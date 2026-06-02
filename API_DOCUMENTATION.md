# Anlconstructions Time Tracker - API Documentation

## Overview

This document provides complete API reference for integrating the Time Tracker app with Supabase backend for data persistence and cloud synchronization.

## Authentication

All API calls require the Supabase Anon Key or Service Role Key in the Authorization header:

```
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
```

**Service Role Key** (backend only):
```
Authorization: Bearer YOUR_SERVICE_ROLE_KEY
```

## Base URL

```
https://YOUR_PROJECT_ID.supabase.co/rest/v1
```

Replace `YOUR_PROJECT_ID` with your Supabase project ID.

---

## Workers Endpoint

### List All Workers
**GET** `/workers`

```bash
curl -X GET "https://YOUR_PROJECT_ID.supabase.co/rest/v1/workers" \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json"
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+61 412 345 678",
    "position": "Carpenter",
    "hourly_rate": 65.00,
    "created_at": "2026-06-01T08:00:00Z",
    "updated_at": "2026-06-01T08:00:00Z"
  }
]
```

### Get Single Worker
**GET** `/workers?id=eq.1`

```bash
curl -X GET "https://YOUR_PROJECT_ID.supabase.co/rest/v1/workers?id=eq.1" \
  -H "Authorization: Bearer YOUR_KEY"
```

### Add New Worker
**POST** `/workers`

```bash
curl -X POST "https://YOUR_PROJECT_ID.supabase.co/rest/v1/workers" \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+61 412 345 678",
    "position": "Carpenter",
    "hourly_rate": 65.00
  }'
```

**Response:** `201 Created`

### Update Worker
**PATCH** `/workers?id=eq.1`

```bash
curl -X PATCH "https://YOUR_PROJECT_ID.supabase.co/rest/v1/workers?id=eq.1" \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "hourly_rate": 70.00,
    "position": "Senior Carpenter"
  }'
```

### Delete Worker
**DELETE** `/workers?id=eq.1`

```bash
curl -X DELETE "https://YOUR_PROJECT_ID.supabase.co/rest/v1/workers?id=eq.1" \
  -H "Authorization: Bearer YOUR_KEY"
```

---

## Time Entries Endpoint

### List Time Entries
**GET** `/time_entries`

With filters:
```bash
# Get entries for specific worker
curl -X GET "https://YOUR_PROJECT_ID.supabase.co/rest/v1/time_entries?worker_id=eq.1" \
  -H "Authorization: Bearer YOUR_KEY"

# Get entries for a date range
curl -X GET "https://YOUR_PROJECT_ID.supabase.co/rest/v1/time_entries?entry_date=gte.2026-06-01&entry_date=lte.2026-06-30" \
  -H "Authorization: Bearer YOUR_KEY"

# Get entries and sort by date
curl -X GET "https://YOUR_PROJECT_ID.supabase.co/rest/v1/time_entries?order=entry_date.desc" \
  -H "Authorization: Bearer YOUR_KEY"
```

**Response:**
```json
[
  {
    "id": 1,
    "worker_id": 1,
    "entry_date": "2026-06-01",
    "check_in_time": "2026-06-01T08:00:00+08:00",
    "lunch_start": "2026-06-01T12:00:00+08:00",
    "lunch_end": "2026-06-01T12:30:00+08:00",
    "check_out_time": "2026-06-01T17:00:00+08:00",
    "total_hours": 9.0,
    "lunch_hours": 0.5,
    "work_hours": 8.5,
    "notes": "Completed framing work",
    "created_at": "2026-06-01T17:15:00Z",
    "updated_at": "2026-06-01T17:15:00Z"
  }
]
```

### Create Time Entry
**POST** `/time_entries`

```bash
curl -X POST "https://YOUR_PROJECT_ID.supabase.co/rest/v1/time_entries" \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "worker_id": 1,
    "entry_date": "2026-06-01",
    "check_in_time": "2026-06-01T08:00:00+08:00",
    "lunch_start": "2026-06-01T12:00:00+08:00",
    "lunch_end": "2026-06-01T12:30:00+08:00",
    "check_out_time": "2026-06-01T17:00:00+08:00",
    "total_hours": 9.0,
    "lunch_hours": 0.5,
    "work_hours": 8.5,
    "notes": "Completed framing work"
  }'
```

### Update Time Entry
**PATCH** `/time_entries?id=eq.1`

```bash
curl -X PATCH "https://YOUR_PROJECT_ID.supabase.co/rest/v1/time_entries?id=eq.1" \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Completed framing and started electrical",
    "work_hours": 8.75
  }'
```

### Calculate Hours (Function)
**POST** `/rpc/calculate_work_hours`

```bash
curl -X POST "https://YOUR_PROJECT_ID.supabase.co/rest/v1/rpc/calculate_work_hours" \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "check_in": "2026-06-01T08:00:00+08:00",
    "check_out": "2026-06-01T17:00:00+08:00",
    "lunch_minutes": 30
  }'
```

**Response:**
```json
{
  "total_hours": 9.0,
  "lunch_hours": 0.5,
  "work_hours": 8.5
}
```

---

## Material Requests Endpoint

### List Material Requests
**GET** `/material_requests`

```bash
# Get all pending requests
curl -X GET "https://YOUR_PROJECT_ID.supabase.co/rest/v1/material_requests?status=eq.pending" \
  -H "Authorization: Bearer YOUR_KEY"

# Get requests for specific worker
curl -X GET "https://YOUR_PROJECT_ID.supabase.co/rest/v1/material_requests?worker_id=eq.1" \
  -H "Authorization: Bearer YOUR_KEY"

# Get high priority requests
curl -X GET "https://YOUR_PROJECT_ID.supabase.co/rest/v1/material_requests?priority=in.(high,urgent)&order=priority.desc" \
  -H "Authorization: Bearer YOUR_KEY"
```

**Response:**
```json
[
  {
    "id": 1,
    "worker_id": 1,
    "request_date": "2026-06-01",
    "description": "Cement bags and sand",
    "quantity": 10,
    "unit": "bags",
    "priority": "high",
    "status": "pending",
    "requested_by_timestamp": "2026-06-01T09:30:00+08:00",
    "completed_at": null,
    "created_at": "2026-06-01T09:30:00Z",
    "updated_at": "2026-06-01T09:30:00Z"
  }
]
```

### Create Material Request
**POST** `/material_requests`

```bash
curl -X POST "https://YOUR_PROJECT_ID.supabase.co/rest/v1/material_requests" \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "worker_id": 1,
    "request_date": "2026-06-01",
    "description": "Cement bags and sand",
    "quantity": 10,
    "unit": "bags",
    "priority": "high",
    "status": "pending"
  }'
```

### Update Request Status
**PATCH** `/material_requests?id=eq.1`

```bash
curl -X PATCH "https://YOUR_PROJECT_ID.supabase.co/rest/v1/material_requests?id=eq.1" \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "completed_at": "2026-06-01T14:00:00+08:00"
  }'
```

### Delete Material Request
**DELETE** `/material_requests?id=eq.1`

```bash
curl -X DELETE "https://YOUR_PROJECT_ID.supabase.co/rest/v1/material_requests?id=eq.1" \
  -H "Authorization: Bearer YOUR_KEY"
```

---

## Daily Tasks Endpoint

### List Tasks
**GET** `/daily_tasks`

```bash
# Get today's tasks
curl -X GET "https://YOUR_PROJECT_ID.supabase.co/rest/v1/daily_tasks?task_date=eq.2026-06-01&order=priority.desc" \
  -H "Authorization: Bearer YOUR_KEY"

# Get tasks for specific worker
curl -X GET "https://YOUR_PROJECT_ID.supabase.co/rest/v1/daily_tasks?worker_id=eq.1&status=eq.pending" \
  -H "Authorization: Bearer YOUR_KEY"

# Get pending tasks
curl -X GET "https://YOUR_PROJECT_ID.supabase.co/rest/v1/daily_tasks?status=eq.pending&order=priority.desc,task_date.asc" \
  -H "Authorization: Bearer YOUR_KEY"
```

**Response:**
```json
[
  {
    "id": 1,
    "task_date": "2026-06-01",
    "worker_id": 1,
    "title": "Frame wall in master bedroom",
    "description": "Frame out wall dividing master bedroom",
    "status": "pending",
    "priority": "high",
    "created_at": "2026-06-01T08:00:00Z",
    "updated_at": "2026-06-01T08:00:00Z"
  }
]
```

### Create Task
**POST** `/daily_tasks`

```bash
curl -X POST "https://YOUR_PROJECT_ID.supabase.co/rest/v1/daily_tasks" \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "task_date": "2026-06-01",
    "worker_id": 1,
    "title": "Frame wall in master bedroom",
    "description": "Frame out wall dividing master bedroom",
    "priority": "high",
    "status": "pending"
  }'
```

### Update Task Status
**PATCH** `/daily_tasks?id=eq.1`

```bash
curl -X PATCH "https://YOUR_PROJECT_ID.supabase.co/rest/v1/daily_tasks?id=eq.1" \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

---

## Analytics & Reporting

### Get Worker Hours Report
**GET** `/time_entries?select=worker_id,work_hours,entry_date&order=entry_date.desc`

```bash
curl -X GET "https://YOUR_PROJECT_ID.supabase.co/rest/v1/time_entries?select=worker_id,work_hours,entry_date&worker_id=eq.1&entry_date=gte.2026-06-01&order=entry_date.desc" \
  -H "Authorization: Bearer YOUR_KEY"
```

### Get Pending Materials
**GET** `/material_requests?select=*&status=eq.pending&order=priority.desc`

```bash
curl -X GET "https://YOUR_PROJECT_ID.supabase.co/rest/v1/material_requests?status=eq.pending&order=priority.desc,request_date.asc" \
  -H "Authorization: Bearer YOUR_KEY"
```

### Get Weekly Summary
**GET** `/rpc/get_weekly_summary`

```bash
curl -X POST "https://YOUR_PROJECT_ID.supabase.co/rest/v1/rpc/get_weekly_summary" \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "start_date": "2026-05-25",
    "end_date": "2026-06-01"
  }'
```

---

## Error Handling

### Common Error Codes

| Code | Message | Solution |
|------|---------|----------|
| 401 | Unauthorized | Check API key and authorization header |
| 403 | Forbidden | User doesn't have permission for this action |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate key or constraint violation |
| 422 | Unprocessable Entity | Invalid data format |
| 500 | Server Error | Contact Supabase support |

### Example Error Response
```json
{
  "code": "23505",
  "message": "duplicate key value violates unique constraint \"time_entries_worker_id_entry_date_key\"",
  "details": "Key (worker_id, entry_date)=(1, 2026-06-01) already exists."
}
```

---

## Rate Limiting

Supabase free tier includes:
- **10,000 requests per hour** per project
- **100 concurrent connections**
- **1GB bandwidth per month**

Production accounts have higher limits.

## Code Examples

### JavaScript (Fetch API)

```javascript
// List workers
const response = await fetch(
  'https://YOUR_PROJECT_ID.supabase.co/rest/v1/workers',
  {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_KEY',
      'Content-Type': 'application/json'
    }
  }
);
const workers = await response.json();

// Create time entry
const createEntry = await fetch(
  'https://YOUR_PROJECT_ID.supabase.co/rest/v1/time_entries',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      worker_id: 1,
      entry_date: '2026-06-01',
      check_in_time: '2026-06-01T08:00:00+08:00',
      check_out_time: '2026-06-01T17:00:00+08:00',
      work_hours: 8.5
    })
  }
);
```

### Using Supabase JavaScript Client

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://YOUR_PROJECT_ID.supabase.co',
  'YOUR_ANON_KEY'
)

// List workers
const { data: workers, error } = await supabase
  .from('workers')
  .select('*')

// Create time entry
const { data, error } = await supabase
  .from('time_entries')
  .insert([{
    worker_id: 1,
    entry_date: '2026-06-01',
    work_hours: 8.5
  }])

// Update task
const { data, error } = await supabase
  .from('daily_tasks')
  .update({ status: 'completed' })
  .eq('id', 1)
```

---

## WebSocket (Real-time Sync)

Subscribe to changes in real-time:

```javascript
const subscription = supabase
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'time_entries' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

---

## Support & Resources

- **Supabase Docs:** https://supabase.com/docs
- **REST API Docs:** https://supabase.com/docs/guides/api
- **Database Functions:** https://supabase.com/docs/guides/database/functions
- **Security & RLS:** https://supabase.com/docs/guides/security/row-level-security
