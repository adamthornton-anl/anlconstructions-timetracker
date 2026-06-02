# Anlconstructions Time Tracker — Setup Guide

## What You Have

✅ **Backend API** — `app-backend.js` (Node.js + Express)  
✅ **Frontend App** — `app-frontend.html` (Web UI for workers)  
✅ **Database** — Supabase (already set up with tables and workers)  

---

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install express cors dotenv @supabase/supabase-js
```

### 2. Start the Backend

```bash
node app-backend.js
```

You should see:
```
🚀 Anlconstructions API running on port 3001
📊 Supabase connected: https://tzwsdqbrtohcxzvdfwdw.supabase.co
```

### 3. Open the Frontend

Open `app-frontend.html` in your browser (or on your phone):
- Workers select their name
- Enter their PIN (Adam: 7264, James: 5891, Brady: 3742, Drew: 8159)
- Check in/out to start tracking time

---

## How It Works

### Worker Flow
1. Open app → Select name → Enter PIN → Login
2. Tap "Check In" when arriving
3. Tap "Check Out" when leaving
4. Select lunch break (30m, 40m, 45m, 1h, or none)
5. Add job location and materials needed
6. Tap "Save Entry"
7. See hours worked + pay for the week

### Admin (You)
- Access: **http://localhost:3001/api/admin/summary/0** (week 0 = this week)
- Export: **http://localhost:3001/api/admin/export/0** (downloads CSV)

---

## Connecting to the Internet (Deployment)

When you're ready to move from localhost to the internet:

### Option 1: Vercel (Recommended — Free)
```bash
npm install -g vercel
vercel
```
Follow prompts. Backend will be deployed at `yourapp.vercel.app/api`

### Option 2: Heroku
```bash
npm install -g heroku
heroku login
heroku create your-app-name
git push heroku main
```

### Option 3: Self-hosted (AWS, DigitalOcean, etc.)
- Deploy `app-backend.js` to your server
- Point frontend to your server's API URL

---

## Adding Email & SMS (Next Steps)

Once deployed, we'll add:
- **Email** — Weekly payroll summaries to workers
- **SMS** — Shift reminders and alerts
- **Google Calendar** — Job schedule integration

Just let me know when you're ready!

---

## API Endpoints

### Workers
- `GET /api/workers` — List all workers
- `GET /api/workers/:id` — Get worker details
- `POST /api/auth/login` — Login with name + PIN

### Time Entries
- `GET /api/time-entries/:workerId` — Get entries (with ?week_offset=0)
- `POST /api/time-entries` — Create/update entry

### Admin
- `GET /api/admin/summary/:week_offset` — Weekly summary
- `GET /api/admin/export/:week_offset` — Download CSV

### Health
- `GET /api/health` — Check if API is running

---

## Troubleshooting

**"Cannot find module 'express'"**
→ Run: `npm install express cors dotenv @supabase/supabase-js`

**"Port 3001 already in use"**
→ Change PORT in `app-backend.js` or kill the process using port 3001

**"Frontend can't connect to backend"**
→ Check that backend is running on http://localhost:3001
→ Make sure CORS is enabled (it is)

**"Supabase connection error"**
→ Check internet connection
→ Verify credentials in `app-backend.js`

---

## Next: Email & SMS Integration

When you're ready:
1. Provide Gmail app password
2. Provide Twilio credentials
3. I'll add automated payroll emails + SMS alerts

---

**Questions?** Just ask — we're building this together! 🚀
