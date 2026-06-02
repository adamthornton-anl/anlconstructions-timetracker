# Anlconstructions Time Tracker - Complete Deployment Guide

**Last Updated:** 2026-06-01  
**Status:** ✅ Ready for Deployment

---

## Quick Summary

The time tracker has been successfully enhanced with three new features:

1. **📅 Running Calendar Display** - Shows upcoming job events (admin-only)
2. **🔗 Google Calendar Integration** - Pull events from adam_thornton@y7mail.com
3. **📱 Weekly Payroll SMS** - Auto-send Friday 5:30 PM to workers with hours & pay

---

## What's New

### Feature 1: Calendar Display

**What Adam sees:**
- Live calendar showing upcoming job events
- Easy connect button for Google Calendar
- One-click integration with read-only access

**What Workers see:**
- Nothing (calendar is admin-only)

### Feature 2: Google Calendar Integration

**Connection:**
- Adam clicks "Connect Google Calendar"
- Signs in with adam_thornton@y7mail.com
- App syncs upcoming events in real-time

**Data:**
- Calendar events are read-only
- Workers cannot see or access the calendar
- Events displayed with job title and time

### Feature 3: Weekly Payroll SMS

**Automated Schedule:**
- Every Friday at 5:30 PM AWST
- Sent to James (0421447653) and Brady (0417914721)
- Includes: Hours, rate, total pay, daily breakdown

**Message Format:**
```
ANLCONSTRUCTIONS
Weekly Payroll

Worker: James
Hours: 37.5h
Rate: $28/hr
Total Pay: $1,050.00

Daily details available in the app.
```

---

## Deployment Steps

### Step 1: Update GitHub Pages

Replace the current app with the enhanced version:

```bash
cd ~/anlconstructions-timetracker
cp /path/to/time-tracker-enhanced.html index.html
git add index.html
git commit -m "feat: add calendar, google calendar integration, and sms payroll"
git push origin main
```

**Check:** Open https://adamthornton-anl.github.io/anlconstructions-timetracker/ and verify app loads.

### Step 2: Set Up Google OAuth (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: `Anlconstructions Time Tracker`
3. Enable APIs:
   - Google Calendar API
   - Google Contacts API (optional)
4. Create OAuth 2.0 Web Application:
   - Authorized origins: `https://adamthornton-anl.github.io`
   - Redirect URIs: `https://adamthornton-anl.github.io/anlconstructions-timetracker/`
5. Copy the **Client ID**

6. Update app (`time-tracker-enhanced.html` - find the OAuth function):
```javascript
const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com';
```

7. Push to GitHub

### Step 3: Set Up Twilio SMS (10 minutes)

1. Create account at https://www.twilio.com/
2. Get:
   - Account SID
   - Auth Token
   - Phone number (will show as SMS sender)
3. Add SMS credits ($20+ recommended)

### Step 4: Deploy Backend Server (Choose One)

#### Option A: Heroku (Recommended - Free tier available)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create anlconstructions-timetracker

# Set environment variables
heroku config:set TWILIO_ACCOUNT_SID=your_sid
heroku config:set TWILIO_AUTH_TOKEN=your_token
heroku config:set TWILIO_PHONE=+1234567890
heroku config:set GOOGLE_CLIENT_ID=your_client_id
heroku config:set GOOGLE_CLIENT_SECRET=your_client_secret

# Deploy
git add backend-server.js backend-package.json
git commit -m "feat: add backend server"
git push heroku main

# Verify
heroku logs --tail
heroku open
```

**Backend URL:** `https://anlconstructions-timetracker.herokuapp.com`

#### Option B: AWS Lambda + API Gateway

```bash
# Package backend
zip -r backend.zip backend-server.js backend-package.json node_modules/

# Upload via AWS Console:
# - Create Lambda function
# - Runtime: Node.js 18.x
# - Upload zip
# - Set environment variables (see Step 3)
# - Create API Gateway trigger
```

#### Option C: Self-Hosted (VPS/Droplet)

```bash
# On your server
ssh user@your-vps.com

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and install
git clone https://github.com/yourusername/anlconstructions-timetracker
cd anlconstructions-timetracker
npm install

# Create .env file with credentials
nano .env
# Paste:
# TWILIO_ACCOUNT_SID=your_sid
# TWILIO_AUTH_TOKEN=your_token
# TWILIO_PHONE=+1234567890
# PORT=3000

# Run with PM2 (persistent)
npm install -g pm2
pm2 start backend-server.js --name "timetracker"
pm2 startup
pm2 save

# Use Nginx as reverse proxy
sudo apt-get install nginx
# Configure /etc/nginx/sites-enabled/default to proxy to localhost:3000
```

### Step 5: Test Everything

#### Test Calendar Integration
1. Open app as Adam
2. Click "Connect Google Calendar"
3. Sign in with adam_thornton@y7mail.com
4. Verify calendar status changes to "✓ Connected"
5. Check that events appear in the calendar display

#### Test SMS Notifications
1. As Adam, click "Send Test SMS Now"
2. Check that James (0421447653) and Brady (0417914721) receive SMS
3. Verify message includes correct hours and pay calculation
4. Check that messages arrive within 10 seconds

#### Test Time Tracking
1. Log in as James
2. Set check-in time (e.g., 08:00)
3. Set check-out time (e.g., 17:00)
4. Verify:
   - Hours shows: 9h 0m (30 min lunch auto-deducted = 8h 30m)
   - Pay calculation: 8.5h × $28/hr = $238.00
5. Export CSV and verify data

---

## Verification Checklist

- [ ] **App Updated**
  - [ ] GitHub Pages shows enhanced app
  - [ ] Calendar section visible when logged in as Adam
  - [ ] SMS section visible when logged in as Adam
  - [ ] Workers don't see calendar or SMS sections

- [ ] **Google Calendar**
  - [ ] "Connect Google Calendar" button works
  - [ ] OAuth flow completes successfully
  - [ ] Calendar events display correctly
  - [ ] Status shows "✓ Connected"

- [ ] **SMS Notifications**
  - [ ] Test SMS button works
  - [ ] Messages received by both workers
  - [ ] Message format is correct
  - [ ] Hours and pay calculations are accurate

- [ ] **Time Tracking**
  - [ ] All workers can log hours
  - [ ] Lunch break auto-deducted (30 min)
  - [ ] Pay calculations correct
  - [ ] CSV export works

- [ ] **Backend Server**
  - [ ] Server running without errors
  - [ ] Health check endpoint responds
  - [ ] SMS API endpoints accessible
  - [ ] Calendar API endpoints accessible

---

## File Locations

```
anlconstructions-timetracker/
├── index.html                      # Main app (GitHub Pages)
├── time-tracker-enhanced.html      # New enhanced version
├── backend-server.js               # Backend server (Node.js)
├── backend-package.json            # Backend dependencies
├── INTEGRATION_SETUP.md            # Detailed setup guide
├── DEPLOYMENT_GUIDE.md             # This file
└── .env                            # Environment variables (not in git)
```

---

## Environment Variables

Create a `.env` file in the backend directory:

```
# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE=+1234567890

# Google
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret

# Server
PORT=3000
NODE_ENV=production
```

**Security Note:** Never commit `.env` to git. Add to `.gitignore`:
```
.env
node_modules/
.DS_Store
```

---

## Monitoring & Logging

### Heroku Logs
```bash
heroku logs --tail
heroku logs --dyno=web
```

### Local Testing
```bash
npm run dev
# Server runs on http://localhost:3000
```

### Check SMS Logs
- Twilio Console: https://www.twilio.com/console/sms
- View delivery status and message history

### Check Calendar Sync
- App displays status on calendar section
- Browser console shows API responses (F12 → Console)

---

## Troubleshooting

### Google Calendar Not Connecting
- ✓ Verify Client ID is correct
- ✓ Check that redirect URI matches exactly
- ✓ Ensure HTTPS is used (GitHub Pages = HTTPS ✓)
- ✓ Clear browser cache and try again

### SMS Not Sending
- ✓ Verify Twilio credentials are correct
- ✓ Check that phone numbers have correct format: +61421447653
- ✓ Ensure Twilio account has active SMS credits
- ✓ Check backend logs: `heroku logs --tail`

### Hours Calculation Wrong
- ✓ Verify hourly rates in app (Settings button)
- ✓ Check that lunch break is exactly 30 minutes
- ✓ Confirm time format is HH:MM (e.g., 08:30, not 8:30)

### Backend Server Won't Start
- ✓ Check Node.js version: `node --version` (need 16.0+)
- ✓ Install dependencies: `npm install`
- ✓ Verify all environment variables are set
- ✓ Check port isn't in use: `lsof -i :3000`

---

## Support & Next Steps

### Immediate (Today)
1. Deploy enhanced app to GitHub Pages
2. Set up Google OAuth
3. Test calendar integration with Adam

### This Week
1. Configure Twilio account
2. Deploy backend server
3. Test SMS notifications
4. Get feedback from workers

### Next Week
1. Monitor SMS delivery
2. Check time tracking accuracy
3. Gather feedback
4. Make refinements

### Future Enhancements
- [ ] Persist time entries to Supabase
- [ ] Auto-sync time entries to Google Calendar
- [ ] Email payroll summaries
- [ ] Mobile app (React Native)
- [ ] Geolocation verification
- [ ] Photo proof-of-work

---

## Contact & Questions

For issues or questions:
1. Check this guide's Troubleshooting section
2. Review logs (Heroku or local)
3. Check Twilio and Google Cloud consoles
4. Contact platform support if needed

---

**Deployment Status:** ✅ Ready  
**Last Updated:** 2026-06-01 09:52 UTC  
**Deployed By:** Subagent (Anlconstructions Time Tracker Enhancement)
