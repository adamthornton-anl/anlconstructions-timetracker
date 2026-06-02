# Anlconstructions Time Tracker

A **production-ready time tracking and payroll system** for Anlconstructions. Workers clock in/out, log materials, and get paid. You see everything in real-time.

---

## ✨ Features

### For Workers
- 📱 **Mobile-friendly app** — Works on iPhone, iPad, Android
- ⏰ **One-tap check-in/out** — Auto-captures time
- 🍽️ **Lunch tracking** — Deduct breaks automatically
- 📝 **Job logging** — Record where you worked
- 📦 **Materials notes** — List supplies needed
- 💰 **Live pay calculation** — See what you've earned this week
- 📊 **Weekly summary** — View all hours at a glance

### For You (Admin)
- 👥 **Worker management** — Add/edit workers and rates
- 📈 **Weekly summaries** — See all timesheets in one place
- 💾 **CSV export** — Download for payroll or accounting
- 📧 **Email reports** — Automated payroll summaries (coming)
- 📱 **SMS alerts** — Text reminders (coming)
- 📅 **Calendar integration** — Pull jobs from Google Calendar (coming)

---

## 📋 Files Included

```
workspace/
├── app-backend.js          # Node.js API server
├── app-frontend.html       # Web app for workers
├── package.json            # Dependencies
├── SETUP.md               # Quick start guide
├── README.md              # This file
├── TOOLS.md               # Your credentials (saved)
└── time-tracker.html      # Local version (no backend needed)
```

---

## 🚀 Getting Started (5 minutes)

### Step 1: Install dependencies
```bash
npm install express cors dotenv @supabase/supabase-js
```

### Step 2: Start the backend
```bash
node app-backend.js
```

You'll see:
```
🚀 Anlconstructions API running on port 3001
📊 Supabase connected
```

### Step 3: Open the app
Open `app-frontend.html` in your browser

**Login:**
- Worker: Adam, James, Brady, or Drew
- PIN: Check your TOOLS.md for their 4-digit codes
- Done! They can now track time.

---

## 👥 Default Workers

| Name  | PIN  | Rate    |
|-------|------|---------|
| Adam  | 7264 | $81.49  |
| James | 5891 | $48.65  |
| Brady | 3742 | $29.95  |
| Drew  | 8159 | $81.49  |

---

## 💾 Database

Everything is stored in Supabase:
- **users** table — Workers + rates
- **time_entries** table — Clock in/out logs

You can view/edit directly at: https://supabase.com/dashboard/projects/tzwsdqbrtohcxzvdfwdw

---

## 🌐 Deployment (When Ready)

### Local Development
```bash
node app-backend.js
```
Backend runs on: http://localhost:3001

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```
Backend gets a live URL. Point frontend to it in code.

### Deploy to Heroku
```bash
heroku login
heroku create your-app-name
git push heroku main
```

---

## 📧 Coming Next

Once deployed, we'll add:
- **Email notifications** — Payroll summaries sent Fridays at 5:30pm
- **SMS alerts** — Shift reminders and break notifications
- **Google Calendar** — Pull your job schedule into the app
- **Dashboard** — Real-time overview of all workers

Just let me know when you're ready!

---

## 🔧 API Reference

### Login
```
POST /api/auth/login
Body: { "name": "Adam", "pin": "7264" }
Returns: Worker object with ID
```

### Check In/Out
```
POST /api/time-entries
Headers: workerId, pin
Body: { "user_id": "...", "day": "Mon", "start_time": "...", "end_time": "..." }
```

### View Hours
```
GET /api/time-entries/:workerId?week_offset=0
Headers: workerId, pin
Returns: Array of time entries for that week
```

### Admin Summary
```
GET /api/admin/summary/0
Returns: Worker totals + pay for week 0 (this week)
```

### Export CSV
```
GET /api/admin/export/0
Returns: CSV file download for payroll
```

---

## ❓ FAQ

**Q: Can workers work offline?**
A: The local version (`time-tracker.html`) works offline. The cloud version requires internet but auto-syncs.

**Q: How do I add a new worker?**
A: You'll need to add them to Supabase directly. Will create an admin panel for this soon.

**Q: Can I track GPS location?**
A: Not yet, but easy to add. Let me know if you need it.

**Q: What if a worker forgets to check out?**
A: They (or you) can manually edit entries in Supabase dashboard.

**Q: When will SMS/Email work?**
A: After you provide Gmail app password + Twilio credentials. Takes 10 mins to set up.

---

## 📞 Support

- **Backend not starting?** → Check Node.js is installed (`node --version`)
- **Can't connect to Supabase?** → Check internet connection
- **Frontend won't load?** → Open app-frontend.html directly in browser
- **Need help?** → Ask! I'm here.

---

## 📝 What's Next?

1. ✅ **Local testing** — Run locally to make sure it works
2. 🚀 **Deploy** — Move to Vercel or Heroku (free tier available)
3. 📧 **Email setup** — Add Gmail for payroll emails
4. 📱 **SMS setup** — Add Twilio for text alerts
5. 📅 **Calendar integration** — Pull jobs from Google Calendar
6. 📊 **Dashboard** — Real-time analytics for you

---

**Built with ❤️ by Nicole**  
Supabase + Express + HTML5  
Ready to scale.
