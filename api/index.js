const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const SUPABASE_URL = 'https://tzwsdqbrtohcxzvdfwdw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_frfpPpx6hXMGRdsJrDlW_A_9WTKqN1l';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/login', async (req, res) => {
  try {
    const { name, pin } = req.body;
    
    if (!name || !pin) {
      return res.status(400).json({ ok: false });
    }

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('name', name)
      .eq('pin', pin)
      .single();

    if (!user) {
      return res.status(401).json({ ok: false });
    }

    res.json({ ok: true, user });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/workers', async (req, res) => {
  try {
    const { data: workers } = await supabase.from('users').select('*');
    res.json(workers || []);
  } catch (err) {
    res.status(500).json([]);
  }
});

app.post('/entry', async (req, res) => {
  try {
    const { user_id, day, start_time, end_time, lunch_mins, job, materials } = req.body;

    if (!user_id || !day) {
      return res.status(400).json({ error: 'Missing user_id or day' });
    }

    const { data: existing } = await supabase
      .from('time_entries')
      .select('id')
      .eq('user_id', user_id)
      .eq('day', day)
      .single()
      .catch(() => ({}));

    let result;

    if (existing && existing.id) {
      const { data } = await supabase
        .from('time_entries')
        .update({
          start_time: start_time || undefined,
          end_time: end_time || undefined,
          lunch_mins: lunch_mins !== undefined ? lunch_mins : undefined,
          job: job || undefined,
          materials: materials || undefined
        })
        .eq('id', existing.id)
        .select();

      result = data ? data[0] : {};
    } else {
      const { data } = await supabase
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

      result = data ? data[0] : {};
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/entries/:user_id', async (req, res) => {
  try {
    const { data: entries } = await supabase
      .from('time_entries')
      .select('*')
      .eq('user_id', req.params.user_id);

    res.json(entries || []);
  } catch (err) {
    res.status(500).json([]);
  }
});

module.exports = app;
