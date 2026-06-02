const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SUPABASE_URL = 'https://tzwsdqbrtohcxzvdfwdw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_frfpPpx6hXMGRdsJrDlW_A_9WTKqN1l';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { name, pin } = req.body;
    
    if (!name || !pin) {
      return res.status(400).json({ ok: false, error: 'Missing name or pin' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('name', name)
      .eq('pin', pin)
      .single();

    if (error || !user) {
      return res.status(401).json({ ok: false, error: 'Invalid credentials' });
    }

    res.json({ ok: true, user });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Get all workers
app.get('/api/workers', async (req, res) => {
  try {
    const { data: workers, error } = await supabase
      .from('users')
      .select('*');

    if (error) throw error;
    res.json(workers || []);
  } catch (err) {
    res.status(500).json([]);
  }
});

// Save/update time entry
app.post('/api/entry', async (req, res) => {
  try {
    const { user_id, day, start_time, end_time, lunch_mins, job, materials } = req.body;

    if (!user_id || !day) {
      return res.status(400).json({ error: 'Missing user_id or day' });
    }

    // Check if entry exists for this user and day
    const { data: existing, error: checkError } = await supabase
      .from('time_entries')
      .select('id')
      .eq('user_id', user_id)
      .eq('day', day)
      .single();

    let result;

    if (existing && !checkError) {
      // Update existing entry
      const { data, error } = await supabase
        .from('time_entries')
        .update({
          start_time: start_time || existing.start_time,
          end_time: end_time || existing.end_time,
          lunch_mins: lunch_mins !== undefined ? lunch_mins : existing.lunch_mins,
          job: job || existing.job,
          materials: materials || existing.materials
        })
        .eq('id', existing.id)
        .select();

      if (error) throw error;
      result = data ? data[0] : {};
    } else {
      // Create new entry
      const { data, error } = await supabase
        .from('time_entries')
        .insert([{
          user_id,
          day,
          start_time: start_time || null,
          end_time: end_time || null,
          lunch_mins: lunch_mins || 0,
          job: job || null,
          materials: materials || null
        }])
        .select();

      if (error) throw error;
      result = data ? data[0] : {};
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get entries for user
app.get('/api/entries/:user_id', async (req, res) => {
  try {
    const { data: entries, error } = await supabase
      .from('time_entries')
      .select('*')
      .eq('user_id', req.params.user_id)
      .order('day', { ascending: false });

    if (error) throw error;
    res.json(entries || []);
  } catch (err) {
    res.status(500).json([]);
  }
});

// Catch-all for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Time Tracker API running on port ${PORT}`);
  console.log(`📱 Open http://localhost:${PORT} in your browser`);
});

module.exports = app;
