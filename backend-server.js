/**
 * Anlconstructions Time Tracker - Backend Server
 * 
 * Handles:
 * - Google Calendar API integration
 * - Weekly SMS payroll notifications
 * - Data persistence
 * 
 * Setup:
 * npm install express twilio dotenv axios cors
 * 
 * Environment Variables:
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * - TWILIO_PHONE
 * - GOOGLE_CLIENT_ID
 * - GOOGLE_CLIENT_SECRET
 * - DATABASE_URL (if using database)
 */

const express = require('express');
const twilio = require('twilio');
const cron = require('node-cron');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// ============ Configuration ============

const TWILIO_CLIENT = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const WORKERS = [
  { name: 'James', phone: '+61421447653', hourlyRate: 28 },
  { name: 'Brady', phone: '+61417914721', hourlyRate: 28 }
];

const HOURLY_RATES = {
  'Adam': 35,
  'James': 28,
  'Brady': 28,
  'Drew': 30
};

// ============ Time Tracking Routes ============

// GET /api/time-entries - Fetch all time entries for a week
app.get('/api/time-entries/:workerName/:weekStart', (req, res) => {
  const { workerName, weekStart } = req.params;
  
  // In production, fetch from database
  // For now, return mock data
  res.json({
    worker: workerName,
    week: weekStart,
    entries: [
      { day: 'Mon', start: '08:00', end: '17:00', hours: 9 },
      { day: 'Tue', start: '08:00', end: '17:00', hours: 9 },
      { day: 'Wed', start: '08:00', end: '17:00', hours: 9 },
      { day: 'Thu', start: '08:00', end: '17:00', hours: 9 },
      { day: 'Fri', start: '08:00', end: '16:00', hours: 8 }
    ]
  });
});

// POST /api/time-entries - Save time entry
app.post('/api/time-entries', (req, res) => {
  const { workerName, date, startTime, endTime } = req.body;
  
  if (!workerName || !date || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // In production, save to database
  console.log(`[${new Date().toISOString()}] Time entry saved:`, {
    workerName,
    date,
    startTime,
    endTime
  });

  res.json({
    success: true,
    message: 'Time entry saved',
    data: { workerName, date, startTime, endTime }
  });
});

// ============ Google Calendar Routes ============

// GET /api/calendar/events - Fetch upcoming calendar events
app.get('/api/calendar/events', async (req, res) => {
  const { googleToken } = req.query;

  if (!googleToken) {
    return res.status(400).json({ error: 'Google token required' });
  }

  try {
    const now = new Date().toISOString();
    const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const response = await axios.get(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        headers: {
          'Authorization': `Bearer ${googleToken}`
        },
        params: {
          timeMin: now,
          timeMax: in30Days,
          orderBy: 'startTime',
          singleEvents: true,
          maxResults: 10
        }
      }
    );

    res.json({
      success: true,
      events: response.data.items
    });
  } catch (error) {
    console.error('Calendar API error:', error.message);
    res.status(500).json({
      error: 'Failed to fetch calendar events',
      message: error.message
    });
  }
});

// POST /api/calendar/events - Create event in Google Calendar
app.post('/api/calendar/events', async (req, res) => {
  const { googleToken, workerName, date, startTime, endTime } = req.body;

  if (!googleToken || !workerName || !date || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
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

    const response = await axios.post(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      event,
      {
        headers: {
          'Authorization': `Bearer ${googleToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      message: 'Event created in Google Calendar',
      eventId: response.data.id
    });
  } catch (error) {
    console.error('Calendar creation error:', error.message);
    res.status(500).json({
      error: 'Failed to create calendar event',
      message: error.message
    });
  }
});

// ============ SMS Payroll Routes ============

// POST /api/sms/send-test - Send test SMS
app.post('/api/sms/send-test', async (req, res) => {
  const { workerName } = req.body;

  if (!workerName) {
    return res.status(400).json({ error: 'Worker name required' });
  }

  const worker = WORKERS.find(w => w.name === workerName);
  if (!worker) {
    return res.status(400).json({ error: 'Worker not found' });
  }

  try {
    const message = generatePayrollMessage(workerName, 37.5); // Mock hours

    const result = await TWILIO_CLIENT.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: worker.phone
    });

    console.log(`Test SMS sent to ${worker.name} (${worker.phone}): ${result.sid}`);

    res.json({
      success: true,
      message: `Test SMS sent to ${worker.name}`,
      sms: result.sid
    });
  } catch (error) {
    console.error('SMS error:', error.message);
    res.status(500).json({
      error: 'Failed to send SMS',
      message: error.message
    });
  }
});

// POST /api/sms/send-payroll - Send payroll SMS to workers
app.post('/api/sms/send-payroll', async (req, res) => {
  const { timeData } = req.body;

  if (!timeData) {
    return res.status(400).json({ error: 'Time data required' });
  }

  const results = [];

  for (const worker of WORKERS) {
    try {
      const workerData = timeData[worker.name] || {};
      const totalHours = calculateTotalHours(workerData);
      const message = generatePayrollMessage(worker.name, totalHours);

      const result = await TWILIO_CLIENT.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE,
        to: worker.phone
      });

      results.push({
        worker: worker.name,
        phone: worker.phone,
        status: 'sent',
        sms_id: result.sid
      });

      console.log(`Payroll SMS sent to ${worker.name}: ${result.sid}`);
    } catch (error) {
      console.error(`Failed to send SMS to ${worker.name}:`, error.message);
      results.push({
        worker: worker.name,
        phone: worker.phone,
        status: 'failed',
        error: error.message
      });
    }
  }

  res.json({
    success: true,
    message: 'Payroll SMS batch sent',
    results
  });
});

// ============ Scheduled Tasks ============

// Run every Friday at 5:30 PM AWST (9:30 AM UTC)
cron.schedule('30 9 * * 5', async () => {
  console.log('[CRON] Running weekly payroll SMS at', new Date().toISOString());
  
  try {
    // Fetch this week's time data
    const timeData = await fetchWeeklyTimeData();

    for (const worker of WORKERS) {
      try {
        const workerData = timeData[worker.name] || {};
        const totalHours = calculateTotalHours(workerData);
        const message = generatePayrollMessage(worker.name, totalHours);

        const result = await TWILIO_CLIENT.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE,
          to: worker.phone
        });

        console.log(`[CRON] Payroll SMS sent to ${worker.name}: ${result.sid}`);
      } catch (error) {
        console.error(`[CRON] Failed to send SMS to ${worker.name}:`, error.message);
      }
    }
  } catch (error) {
    console.error('[CRON] Payroll SMS task failed:', error.message);
  }
});

// ============ Helper Functions ============

function generatePayrollMessage(workerName, totalHours) {
  const rate = HOURLY_RATES[workerName] || 0;
  const totalPay = totalHours * rate;

  return `ANLCONSTRUCTIONS\nWeekly Payroll\n\nWorker: ${workerName}\nHours: ${totalHours.toFixed(1)}h\nRate: $${rate}/hr\nTotal Pay: $${totalPay.toFixed(2)}\n\nDaily details available in the app.`;
}

function calculateTotalHours(workerData) {
  // In production, sum actual time entries from database
  // For now, return mock value
  return 37.5;
}

async function fetchWeeklyTimeData() {
  // In production, fetch from database
  // For now, return mock data
  return {
    'James': { Mon: 9, Tue: 9, Wed: 9, Thu: 9, Fri: 8 },
    'Brady': { Mon: 8.5, Tue: 8.5, Wed: 8.5, Thu: 8.5, Fri: 8 }
  };
}

// ============ Health Check ============

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ============ Error Handling ============

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// ============ Start Server ============

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Anlconstructions Time Tracker server running on port ${PORT}`);
  console.log('✓ Time tracking endpoints active');
  console.log('✓ Google Calendar integration ready');
  console.log('✓ SMS payroll notifications scheduled (Fridays 5:30 PM AWST)');
  console.log('✓ Health check available at /health');
});

module.exports = app;
