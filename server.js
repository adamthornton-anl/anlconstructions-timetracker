const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const supabase = createClient(
  'https://tzwsdqbrtohcxzvdfwdw.supabase.co',
  'sb_publishable_frfpPpx6hXMGRdsJrDlW_A_9WTKqN1l'
);

// Login
app.post('/api/login', async (req, res) => {
  const { name, pin } = req.body;
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('name', name)
    .eq('pin', pin)
    .single();
  
  if (user) {
    res.json({ ok: true, user });
  } else {
    res.status(401).json({ ok: false, error: 'Invalid' });
  }
});

// Get workers
app.get('/api/workers', async (req, res) => {
  const { data } = await supabase.from('users').select('*');
  res.json(data || []);
});

// Save time entry
app.post('/api/entry', async (req, res) => {
  const { user_id, day, start_time, end_time, lunch_mins, job, materials } = req.body;
  
  const { data: existing } = await supabase
    .from('time_entries')
    .select('id')
    .eq('user_id', user_id)
    .eq('day', day)
    .single();

  if (existing) {
    const { data } = await supabase
      .from('time_entries')
      .update({ start_time, end_time, lunch_mins, job, materials })
      .eq('id', existing.id)
      .select();
    res.json(data[0]);
  } else {
    const { data } = await supabase
      .from('time_entries')
      .insert([{ user_id, day, start_time, end_time, lunch_mins, job, materials }])
      .select();
    res.json(data[0]);
  }
});

// Get entries
app.get('/api/entries/:user_id', async (req, res) => {
  const { data } = await supabase
    .from('time_entries')
    .select('*')
    .eq('user_id', req.params.user_id)
    .gte('day', 'Mon')
    .lte('day', 'Fri');
  res.json(data || []);
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ App running on port ${PORT}`);
});
