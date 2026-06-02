// Anlconstructions Time Tracker Backend
// Node.js + Express + Supabase

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'))

// Supabase Setup
const SUPABASE_URL = 'https://tzwsdqbrtohcxzvdfwdw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_frfpPpx6hXMGRdsJrDlW_A_9WTKqN1l';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Auth Middleware
async function authenticateWorker(req, res, next) {
  const workerId = req.headers.workerid || req.headers.workerId;
  const pin = req.headers.pin;
  if (!workerId || !pin) {
    return res.status(401).json({ error: 'Missing credentials' });
  }

  const { data: worker } = await supabase
    .from('users')
    .select('*')
    .eq('id', workerId)
    .single();

  if (!worker || worker.pin !== pin) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  req.worker = worker;
  next();
}

// Routes

// Get all workers
app.get('/api/workers', async (req, res) => {
  const { data, error } = await supabase.from('users').select('id, name, hourly_rate');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Get worker by ID
app.get('/api/workers/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Worker not found' });
  res.json(data);
});

// Verify login
app.post('/api/auth/login', async (req, res) => {
  const { name, pin } = req.body;

  const { data: worker, error } = await supabase
    .from('users')
    .select('*')
    .eq('name', name)
    .single();

  if (error || !worker || worker.pin !== pin) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ success: true, worker });
});

// Get time entries for worker (this week)
app.get('/api/time-entries/:workerId', authenticateWorker, async (req, res) => {
  const { workerId } = req.params;
  const { week_offset = 0 } = req.query;

  const { data, error } = await supabase
    .from('time_entries')
    .select('*')
    .eq('user_id', workerId)
    .eq('week_offset', parseInt(week_offset));

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// Create/update time entry
app.post('/api/time-entries', authenticateWorker, async (req, res) => {
  const { user_id, day, week_offset, start_time, end_time, lunch_mins, job, materials } = req.body;

  // Check if entry exists
  const { data: existing } = await supabase
    .from('time_entries')
    .select('id')
    .eq('user_id', user_id)
    .eq('day', day)
    .eq('week_offset', week_offset)
    .single();

  if (existing) {
    // Update
    const { data, error } = await supabase
      .from('time_entries')
      .update({ start_time, end_time, lunch_mins, job, materials, updated_at: new Date() })
      .eq('id', existing.id)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.json(data[0]);
  } else {
    // Create
    const { data, error } = await supabase
      .from('time_entries')
      .insert([{ user_id, day, week_offset, start_time, end_time, lunch_mins, job, materials }])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
  }
});

// Get weekly summary (admin)
app.get('/api/admin/summary/:week_offset', async (req, res) => {
  const { week_offset } = req.params;

  const { data: entries, error } = await supabase
    .from('time_entries')
    .select('*, users(name, hourly_rate)')
    .eq('week_offset', parseInt(week_offset));

  if (error) return res.status(500).json({ error: error.message });

  // Calculate totals
  const summary = {};
  entries.forEach(entry => {
    const worker = entry.users;
    if (!summary[worker.name]) {
      summary[worker.name] = {
        name: worker.name,
        hours: 0,
        rate: worker.hourly_rate,
        entries: []
      };
    }

    if (entry.start_time && entry.end_time) {
      const start = new Date(entry.start_time);
      const end = new Date(entry.end_time);
      const minutes = (end - start) / 60000 - (entry.lunch_mins || 0);
      const hours = Math.max(0, minutes / 60);
      summary[worker.name].hours += hours;
    }

    summary[worker.name].entries.push(entry);
  });

  res.json(Object.values(summary));
});

// Export CSV
app.get('/api/admin/export/:week_offset', async (req, res) => {
  const { week_offset } = req.params;

  const { data: entries, error } = await supabase
    .from('time_entries')
    .select('*, users(name, hourly_rate)')
    .eq('week_offset', parseInt(week_offset));

  if (error) return res.status(500).json({ error: error.message });

  const summary = {};
  entries.forEach(entry => {
    const worker = entry.users;
    if (!summary[worker.name]) {
      summary[worker.name] = {
        name: worker.name,
        hours: 0,
        rate: worker.hourly_rate
      };
    }

    if (entry.start_time && entry.end_time) {
      const start = new Date(entry.start_time);
      const end = new Date(entry.end_time);
      const minutes = (end - start) / 60000 - (entry.lunch_mins || 0);
      const hours = Math.max(0, minutes / 60);
      summary[worker.name].hours += hours;
    }
  });

  let csv = 'Worker,Hours,Rate,Total\n';
  Object.values(summary).forEach(item => {
    const total = (item.hours * item.rate).toFixed(2);
    csv += `${item.name},${item.hours.toFixed(1)},${item.rate.toFixed(2)},${total}\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=timesheet.csv');
  res.send(csv);
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/app-frontend.html');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`🚀 Anlconstructions API running on port ${PORT}`);
  console.log(`📊 Supabase connected: ${SUPABASE_URL}`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
});
