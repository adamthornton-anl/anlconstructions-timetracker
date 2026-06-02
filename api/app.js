const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  'https://tzwsdqbrtohcxzvdfwdw.supabase.co',
  'sb_publishable_frfpPpx6hXMGRdsJrDlW_A_9WTKqN1l'
);

app.post('/login', async (req, res) => {
  const { name, pin } = req.body;
  const { data: user, error } = await supabase
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

app.get('/workers', async (req, res) => {
  const { data } = await supabase.from('users').select('*');
  res.json(data || []);
});

app.post('/entry', async (req, res) => {
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

app.get('/entries/:user_id', async (req, res) => {
  const { data } = await supabase
    .from('time_entries')
    .select('*')
    .eq('user_id', req.params.user_id);
  res.json(data || []);
});

module.exports = app;
