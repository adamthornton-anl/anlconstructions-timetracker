# Anlconstructions Time Tracker - Supabase Setup Guide

## Overview
This document provides instructions for setting up the Supabase backend database for the Anlconstructions Time Tracker app.

## Database Schema

The system uses four main tables to manage time tracking, workers, materials, and tasks:

### 1. **workers** - Permanent Worker Records
```sql
CREATE TABLE workers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  position TEXT,
  hourly_rate DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Purpose:** Stores permanent records of all workers including contact info and hourly rates.

### 2. **time_entries** - Daily Time Tracking
```sql
CREATE TABLE time_entries (
  id BIGSERIAL PRIMARY KEY,
  worker_id BIGINT NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  check_in_time TIMESTAMP WITH TIME ZONE,
  lunch_start TIMESTAMP WITH TIME ZONE,
  lunch_end TIMESTAMP WITH TIME ZONE,
  check_out_time TIMESTAMP WITH TIME ZONE,
  total_hours DECIMAL(5, 2),
  lunch_hours DECIMAL(5, 2),
  work_hours DECIMAL(5, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(worker_id, entry_date)
);
```

**Purpose:** Records daily check-in/check-out times, lunch breaks, and total work hours for each worker.

### 3. **material_requests** - Supplies & Materials Management
```sql
CREATE TABLE material_requests (
  id BIGSERIAL PRIMARY KEY,
  worker_id BIGINT NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  request_date DATE NOT NULL,
  description TEXT NOT NULL,
  quantity INT,
  unit TEXT,
  priority TEXT DEFAULT 'normal',
  status TEXT DEFAULT 'pending',
  requested_by_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Purpose:** Tracks material and supply requests with priority levels and completion status.

### 4. **daily_tasks** - Task Management
```sql
CREATE TABLE daily_tasks (
  id BIGSERIAL PRIMARY KEY,
  task_date DATE NOT NULL,
  worker_id BIGINT REFERENCES workers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'normal',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Purpose:** Manages daily task list with assignment to workers and status tracking.

## Setup Instructions

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New project"
4. Configure:
   - **Name:** `Anlconstructions Time Tracker`
   - **Database Password:** Create a secure password
   - **Region:** Select your closest region (e.g., Singapore, Australia)
5. Wait for the project to be created (5-10 minutes)

### Step 2: Get Connection Details

Once the project is ready:

1. Go to **Settings → Database**
2. Copy and save:
   - **Project URL:** `https://YOUR_PROJECT_ID.supabase.co`
   - **Anon Key:** Found in Settings → API
   - **Service Role Key:** Found in Settings → API (keep this secret!)

### Step 3: Create Database Tables

1. Go to the **SQL Editor** in Supabase
2. Create a new query and paste the schema from `/home/agent/workspace/time_tracker_schema.sql`
3. Execute the query to create all tables and indexes

### Step 4: Enable Row Level Security (RLS)

1. Go to **Authentication → Policies**
2. For each table (workers, time_entries, material_requests, daily_tasks):
   - Enable RLS
   - Create a policy allowing authenticated users to read/write their own records

Example policy for `time_entries`:
```sql
CREATE POLICY "Users can manage their own time entries"
ON time_entries
FOR ALL
USING (auth.uid() = (SELECT id FROM workers WHERE id = time_entries.worker_id LIMIT 1))
WITH CHECK (auth.uid() = (SELECT id FROM workers WHERE id = time_entries.worker_id LIMIT 1));
```

### Step 5: Configure App

Update the app configuration in `time_tracker_app.html`:

```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

### Step 6: Set Up Authentication (Optional)

For multi-user access with login:

1. Go to **Authentication → Providers**
2. Enable Email provider
3. Users can sign up and log in to the app
4. Each user's data is automatically separated by RLS policies

## API Reference

### Insert a Worker
```javascript
const { data, error } = await supabase
  .from('workers')
  .insert([
    {
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+61 412 345 678',
      position: 'Carpenter',
      hourly_rate: 65.00
    }
  ]);
```

### Record Time Entry
```javascript
const { data, error } = await supabase
  .from('time_entries')
  .insert([
    {
      worker_id: 1,
      entry_date: '2026-06-01',
      check_in_time: '2026-06-01T08:00:00+08:00',
      lunch_start: '2026-06-01T12:00:00+08:00',
      lunch_end: '2026-06-01T12:30:00+08:00',
      check_out_time: '2026-06-01T17:00:00+08:00',
      total_hours: 9.0,
      lunch_hours: 0.5,
      work_hours: 8.5,
      notes: 'Completed framing work'
    }
  ]);
```

### Retrieve Time Entries for a Worker
```javascript
const { data, error } = await supabase
  .from('time_entries')
  .select('*')
  .eq('worker_id', 1)
  .gte('entry_date', '2026-06-01')
  .order('entry_date', { ascending: false });
```

### Update Material Request Status
```javascript
const { data, error } = await supabase
  .from('material_requests')
  .update({ status: 'completed' })
  .eq('id', 1);
```

## Pricing

**Supabase Free Tier Includes:**
- Up to 500MB database storage
- Up to 1GB egress/month
- Real-time subscriptions
- Basic authentication
- Perfect for small teams like Anlconstructions

**Paid tiers available** if you exceed free tier limits (usually not needed for small businesses).

## Backup & Security

1. **Automatic backups** are enabled by default (daily)
2. **Enable 2FA** on your Supabase account
3. **Never commit** API keys to version control
4. **Use Service Role Key** only on the backend, never in client-side code
5. **Rotate keys regularly** if compromised

## Troubleshooting

### Connection Issues
- Verify Supabase project is active
- Check network connectivity
- Confirm API keys are correct

### Authentication Errors
- Ensure RLS policies are configured
- Check that user is authenticated
- Verify permissions for the user's role

### Data Not Syncing
- Check browser console for errors
- Verify API key has correct permissions
- Ensure database tables exist

## Next Steps

1. Start using `time_tracker_app.html` to log worker time
2. Monitor database usage in Supabase dashboard
3. Set up automated backups (Settings → Backups)
4. Configure email notifications for important events
5. Scale to multiple teams if needed

## Support

For Supabase support, visit: [supabase.com/docs](https://supabase.com/docs)
For app issues, contact Adam at Anlconstructions.
