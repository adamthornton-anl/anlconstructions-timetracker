# Anlconstructions Time Tracker - Quick Start Guide

## What You Get

✅ **Web-based time tracking app** - Check in/out, lunch logging, notes  
✅ **Worker management** - Add & manage permanent worker records  
✅ **Material requests** - Track supplies needed on site  
✅ **Daily task list** - Manage and assign work tasks  
✅ **Reports & analytics** - View worker hours, pending requests, active tasks  

## Files Included

1. **time_tracker_app.html** - Complete web application (open in browser)
2. **SUPABASE_SETUP.md** - Database setup instructions
3. **time_tracker_schema.sql** - Database schema (for Supabase)

## Getting Started in 3 Steps

### Step 1: Open the App

Open `time_tracker_app.html` in any modern web browser (Chrome, Firefox, Safari, Edge).

**Note:** Currently uses browser local storage. To sync data to a database, follow Step 2.

### Step 2: Add Your Workers

1. Click the **👷 Workers** tab
2. Enter worker details:
   - Name (required)
   - Email
   - Phone
   - Position
   - Hourly rate
3. Click **➕ Add Worker**

Example:
- John Smith | Carpenter | $65/hour
- Sarah Johnson | Electrician | $75/hour

### Step 3: Start Logging Time

1. Click the **⏰ Time Entry** tab
2. Select a worker from the dropdown
3. Use the buttons to quickly log times:
   - **Check In Now** - Records current time
   - **Lunch Start Now** - Marks lunch start
   - **Lunch End Now** - Marks lunch end
   - **Check Out Now** - Records check-out time
4. Add any notes about the work
5. Click **💾 Save Time Entry**

The app automatically calculates:
- **Total Hours** - Time from check-in to check-out
- **Work Hours** - Total minus lunch break
- **Lunch Break** - Time spent on lunch

## Features Overview

### ⏰ Time Entry Tab
- Quick button-based time logging
- Lunch break tracking
- Work notes and comments
- Real-time hour calculations
- Live clock display

### 👷 Workers Tab
- Add new workers with hourly rates
- Store contact information
- Edit worker details
- View all workers in a table

### 📦 Materials Tab
- Submit material/supply requests
- Set priority levels (Low/Normal/High/Urgent)
- Track request status (Pending/Completed)
- Assign requests to workers

### 📋 Tasks Tab
- Create daily task list
- Assign tasks to specific workers
- Set task priorities
- Track task completion status
- Add detailed descriptions

### 📊 Reports Tab
- View total workers and entries
- See pending material requests count
- Check active tasks
- Worker summary with total hours
- Last entry date for each worker

## Data Storage

**Current Version:** All data saved locally in browser storage
- Data persists when you close and reopen the app
- Data is private to your browser (not shared)

**To Sync to Cloud Database:**
1. Follow instructions in `SUPABASE_SETUP.md`
2. Set up a free Supabase project
3. Configure API keys in the app
4. Data will automatically sync to the database

## Tips & Tricks

### For Quick Time Logging
- Use the **Now** buttons for accurate timestamps
- Manually enter times if needed
- Fill in notes at end of day

### For Material Requests
- Be specific in the description
- Include quantities and units
- Set correct priority for urgent needs

### For Task Management
- Create tasks at start of week
- Assign to specific workers
- Update status as work progresses
- Review completed tasks in reports

### For Accuracy
- Check in/out immediately when starting/stopping work
- Log lunch times accurately for payroll
- Add notes for complex days
- Review weekly hours in reports

## Common Tasks

### How to delete a worker?
Workers Tab → Find worker → Click Delete button

### How to change a worker's hourly rate?
Currently: Delete and re-add with new rate
Future: Update functionality coming

### How to mark materials as received?
Materials Tab → Table row → (Edit button coming soon)

### How to mark tasks complete?
Tasks Tab → Table row → (Status update coming soon)

### How to export reports?
Reports Tab → Right-click table → Print or Save as PDF

## System Requirements

- **Browser:** Chrome, Firefox, Safari, or Edge (any modern version)
- **Internet:** Required only if synced to Supabase
- **Mobile:** Works on tablets and phones
- **Offline:** Can work offline with local storage

## Backup & Data Safety

**Local Storage:**
- Clears if browser cache/cookies are cleared
- Separate for each browser/device
- No backup if device is lost

**With Supabase:**
- Automatic daily backups
- Cloud storage (secure)
- Accessible from any device
- Can be exported anytime

## Next Steps

1. ✅ Use the app to log time for a week
2. ✅ Add all your permanent workers
3. ✅ (Optional) Set up Supabase for cloud backup
4. ✅ Start using materials and tasks features
5. ✅ Check reports weekly for analytics

## Troubleshooting

### App won't open?
- Make sure you're opening the `.html` file in a browser
- Try a different browser (Chrome recommended)
- Check file is in the right location

### Data disappeared?
- Check if you're in a private/incognito browser window (data won't save)
- Use a regular browser window
- If on mobile, use a proper app browser (not mobile browser)

### Time calculations wrong?
- Make sure all times are filled in (check-in, lunch start/end, check-out)
- Times must be in correct order (check-in before lunch, lunch before check-out)
- Check system time is correct

### Need more features?
- Let Adam know what's missing
- Features can be added: custom fields, job sites, invoicing, etc.

## Contact & Support

For issues or feature requests, contact Adam at Anlconstructions.

---

**Version:** 1.0  
**Last Updated:** 2026-06-01  
**Status:** Ready to use
