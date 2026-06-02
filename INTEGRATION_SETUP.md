# Anlconstructions Time Tracker - Advanced Features Setup

**Status:** Enhanced features ready for deployment

## Overview

The time tracker has been enhanced with three new features:

1. **📅 Running Calendar Display** - Shows upcoming job events
2. **🔗 Google Calendar Integration** - Connects to adam_thornton@y7mail.com
3. **📱 Automated Weekly SMS** - Payroll notifications every Friday 5:30 PM

---

## 1. Google Calendar Integration

### What It Does
- Adam (owner) can connect his Google Calendar
- App displays upcoming job events in real-time
- Workers cannot see the calendar (admin-only feature)
- Events pulled from adam_thornton@y7mail.com

### Setup Instructions

#### Step 1: Create Google OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: **Anlconstructions Time Tracker**
3. Enable these APIs:
   - Google Calendar API
   - Google Contacts API (optional)

4. Create OAuth 2.0 credentials:
   - Application type: **Web application**
   - Authorized JavaScript origins: `https://adamthornton-anl.github.io`
   - Authorized redirect URIs: `https://adamthornton-anl.github.io/anlconstructions-timetracker/`

5. Copy the **Client ID** and save it

#### Step 2: Update App with OAuth Client ID

In `time-tracker-enhanced.html`, find the calendar integration function and add:

```javascript
// Replace this placeholder OAuth function with real implementation
const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_API_KEY = 'YOUR_API_KEY';

function initGoogleCalendarOAuth() {
    // Load Google Identity Services library
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    window.onload = function () {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse
        });
    };
}

function handleCredentialResponse(response) {
    const token = response.credential;
    saveGoogleCalendarToken(token);
    loadGoogleCalendarEvents();
}
```

#### Step 3: Load Calendar Events via API

Replace the mock events function with real API call:

```javascript
function loadGoogleCalendarEvents() {
    const token = loadGoogleCalendarToken();
    if (!token) {
        document.getElementById('calendarEvents').innerHTML = '';
        return;
    }

    const now = new Date().toISOString();
    const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        params: {
            timeMin: now,
            timeMax: in30Days,
            orderBy: 'startTime',
            singleEvents: true,
            maxResults: 10
        }
    })
    .then(r => r.json())
    .then(data => {
        let html = '';
        data.items.forEach(event => {
            html += `
                <div class="calendar-event">
                    <div class="calendar-event-title">${event.summary}</div>
                    <div class="calendar-event-time">
                        ${new Date(event.start.dateTime).toLocaleDateString()} •
                        ${new Date(event.start.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                </div>
            `;
        });
        document.getElementById('calendarEvents').innerHTML = html;
    })
    .catch(err => console.error('Calendar API error:', err));
}
```

### Pushing Time Entries to Google Calendar

Once daily time entries are recorded, they can be automatically added to the calendar:

```javascript
function pushTimeEntryToCalendar(workerName, date, startTime, endTime) {
    const token = loadGoogleCalendarToken();
    if (!token) return;

    const event = {
        summary: `${workerName} - Time Entry`,
        description: `Work hours: ${startTime} - ${endTime}`,
        start: {
            dateTime: `${date}T${startTime}:00`,
            timeZone: 'Australia/Perth'
        },
        end: {
            dateTime: `${date}T${endTime}:00`,
            timeZone: 'Australia/Perth'
        }
    };

    fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
    })
    .then(r => r.json())
    .then(data => console.log('Event created:', data.id))
    .catch(err => console.error('Failed to create event:', err));
}
```

---

## 2. Automated Weekly SMS Notifications

### What It Does
- Every Friday at 5:30 PM AWST, workers receive SMS with:
  - Daily breakdown of hours
  - Total hours worked (excluding lunch)
  - Pay calculation at their hourly rate
  - Week summary

### Workers & Phone Numbers
- **James:** 0421447653 ($28/hr)
- **Brady:** 0417914721 ($28/hr)

### SMS Backend Setup

You need a server to:
1. Detect Friday 5:30 PM AWST
2. Calculate payroll from stored time entries
3. Send SMS via Twilio or similar

#### Option A: Supabase Edge Functions

Create a scheduled function in Supabase:

**File: `supabase/functions/send-weekly-payroll-sms/index.ts`**

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Twilio } from "https://deno.land/x/twilio@0.18.0/mod.ts"

const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID")
const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN")
const TWILIO_PHONE = Deno.env.get("TWILIO_PHONE")

const client = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

serve(async (req) => {
  // Only run on Friday at 5:30 PM AWST
  const now = new Date()
  const awstTime = new Date(now.toLocaleString('en-US', { timeZone: 'Australia/Perth' }))
  
  if (awstTime.getDay() !== 5 || awstTime.getHours() !== 17 || awstTime.getMinutes() !== 30) {
    return new Response('Not Friday 5:30 PM', { status: 200 })
  }

  // Fetch payroll data from app storage
  const workers = [
    { name: 'James', phone: '+61421447653', rate: 28 },
    { name: 'Brady', phone: '+61417914721', rate: 28 }
  ]

  for (const worker of workers) {
    // Calculate hours from this week's data
    const hours = 37.5 // Get this from actual time tracker data
    const pay = hours * worker.rate

    const message = `ANLCONSTRUCTIONS\nWeekly Payroll\n\nWorker: ${worker.name}\nHours: ${hours}h\nRate: $${worker.rate}/hr\nPay: $${pay.toFixed(2)}\n\nDaily breakdown available in app.`

    try {
      await client.messages.create({
        body: message,
        from: TWILIO_PHONE,
        to: worker.phone
      })
      console.log(`SMS sent to ${worker.name}`)
    } catch (err) {
      console.error(`Failed to send to ${worker.phone}:`, err)
    }
  }

  return new Response('Payroll SMS sent', { status: 200 })
})
```

**Deploy with:**
```bash
supabase functions deploy send-weekly-payroll-sms
supabase secrets set TWILIO_ACCOUNT_SID "your-sid"
supabase secrets set TWILIO_AUTH_TOKEN "your-token"
supabase secrets set TWILIO_PHONE "+1234567890"
```

#### Option B: Twilio Webhooks + Cron Service

Use a service like EasyCron or AWS Lambda to trigger the Twilio API weekly.

#### Option C: Simple Node.js Server

```javascript
const cron = require('node-cron');
const twilio = require('twilio');

const client = twilio('ACCOUNT_SID', 'AUTH_TOKEN');

// Every Friday at 5:30 PM AWST (9:30 AM UTC)
cron.schedule('30 9 * * 5', async () => {
  const workers = [
    { name: 'James', phone: '+61421447653', rate: 28 },
    { name: 'Brady', phone: '+61417914721', rate: 28 }
  ];

  for (const worker of workers) {
    const message = generatePayrollSMS(worker);
    
    try {
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE,
        to: worker.phone
      });
      console.log(`Payroll SMS sent to ${worker.name}`);
    } catch (err) {
      console.error(`Failed to send SMS to ${worker.phone}:`, err);
    }
  }
});

function generatePayrollSMS(worker) {
  // Get actual hours from database
  const hours = 37.5;
  const pay = hours * worker.rate;

  return `ANLCONSTRUCTIONS\nWeekly Payroll\n\nWorker: ${worker.name}\nHours: ${hours}h\nRate: $${worker.rate}/hr\nPay: $${pay.toFixed(2)}\n\nDaily breakdown available in app.`;
}
```

---

## 3. Data Storage & Persistence

### Current Setup
- Data stored in browser **localStorage** (resets daily)
- No server database

### For Production (Recommended)

Use Supabase to persist data:

**Database Schema:**

```sql
-- Time entries table
CREATE TABLE time_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_name TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  hours_worked DECIMAL,
  rate DECIMAL,
  materials TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(worker_name, date)
);

-- Calendar events table
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  google_calendar_id TEXT,
  title TEXT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  synced_at TIMESTAMP DEFAULT NOW()
);

-- SMS logs table
CREATE TABLE sms_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_phone TEXT NOT NULL,
  week_start DATE NOT NULL,
  message TEXT,
  status TEXT, -- 'sent', 'failed'
  sent_at TIMESTAMP DEFAULT NOW()
);
```

**Save to Supabase:**

```javascript
async function saveTimeEntryToDatabase(workerName, date, startTime, endTime) {
  const hours = calculateHours(startTime, endTime);
  const rate = hourlyRates[workerName];

  const { data, error } = await supabase
    .from('time_entries')
    .insert([{
      worker_name: workerName,
      date: date,
      start_time: startTime,
      end_time: endTime,
      hours_worked: hours,
      rate: rate
    }]);

  if (error) console.error('Database error:', error);
  else console.log('Time entry saved:', data);
}
```

---

## Deployment Checklist

- [ ] Update `time-tracker-enhanced.html` in GitHub Pages repo
- [ ] Create Google OAuth 2.0 credentials
- [ ] Add OAuth Client ID to app
- [ ] Set up Twilio account (if using SMS)
- [ ] Deploy SMS backend (Supabase, Lambda, or Node.js)
- [ ] Configure cron job for Friday 5:30 PM AWST
- [ ] Set up Supabase database (optional but recommended)
- [ ] Test calendar sync with sample Google Calendar events
- [ ] Test SMS by running "Send Test SMS Now" button
- [ ] Document credentials in secure location

---

## Testing

1. **Calendar Integration:**
   - Click "Connect Google Calendar" as Adam
   - Authorize with adam_thornton@y7mail.com
   - Verify events appear in the calendar display

2. **SMS Notifications:**
   - As Adam, click "Send Test SMS Now"
   - Check that James (0421447653) and Brady (0417914721) receive test message
   - Verify time entries and pay calculation are correct

3. **Time Tracking:**
   - Log in as each worker
   - Check in and out
   - Verify hours calculation (30 min lunch auto-deducted)
   - Verify pay calculation at correct hourly rate
   - Export CSV

---

## Files

- **time-tracker-enhanced.html** - Full app with all features
- **INTEGRATION_SETUP.md** - This setup guide
- **Backend components** - SMS, Calendar APIs, Database schema

## Next Steps

1. Deploy enhanced app to GitHub Pages
2. Set up Google OAuth credentials
3. Configure Twilio account for SMS
4. Test all features with Adam and workers
5. Monitor logs for any issues
6. Gather feedback and iterate

---

**Questions?** Check the setup sections above or contact support.
