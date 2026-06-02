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

// API Routes
app.post('/api/login', async (req, res) => {
  try {
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
      res.status(401).json({ ok: false });
    }
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api/workers', async (req, res) => {
  try {
    const { data } = await supabase.from('users').select('*');
    res.json(data || []);
  } catch (err) {
    res.status(500).json([]);
  }
});

app.post('/api/entry', async (req, res) => {
  try {
    const { user_id, day, start_time, end_time, lunch_mins, job, materials } = req.body;
    
    const { data: existing } = await supabase
      .from('time_entries')
      .select('id')
      .eq('user_id', user_id)
      .eq('day', day)
      .single();

    let result;
    if (existing) {
      const { data } = await supabase
        .from('time_entries')
        .update({ start_time, end_time, lunch_mins, job, materials, updated_at: new Date() })
        .eq('id', existing.id)
        .select();
      result = data[0];
    } else {
      const { data } = await supabase
        .from('time_entries')
        .insert([{ user_id, day, start_time, end_time, lunch_mins, job, materials }])
        .select();
      result = data[0];
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/entries/:user_id', async (req, res) => {
  try {
    const { data } = await supabase
      .from('time_entries')
      .select('*')
      .eq('user_id', req.params.user_id);
    res.json(data || []);
  } catch (err) {
    res.status(500).json([]);
  }
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

module.exports = app;
