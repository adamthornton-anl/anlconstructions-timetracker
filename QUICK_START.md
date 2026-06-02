# Anlconstructions Time Tracker - Quick Start Guide

**For Adam & Workers**

---

## Opening the App

📱 **Mobile or Desktop:**
1. Open browser
2. Go to: `https://adamthornton-anl.github.io/anlconstructions-timetracker/`
3. Select your name from dropdown

---

## For Workers (James, Brady, Drew)

### Logging Hours

1. **Check In**
   - Click "Set" under Start
   - Enter time (e.g., 08:00)
   - Click Save

2. **Check Out**
   - Click "Set" under End
   - Enter time (e.g., 17:00)
   - Click Save

3. **View Your Hours**
   - Hours automatically calculate
   - 30-min lunch is auto-deducted
   - Your pay shows in last column

### Example
```
Mon: 08:00 → 17:00
Display: 8h 30m (30-min lunch deducted)
Pay: 8.5h × $28/hr = $238.00
```

### Export Your Timesheet
- Click "Export" button
- CSV file downloads to your phone/computer

### Payroll SMS
Every Friday at 5:30 PM AWST, you'll receive SMS with:
- Your total hours for the week
- Your hourly rate
- Total pay for the week

---

## For Adam (Admin)

### Your Controls

**Worker Selection:**
- You can select any worker to see their hours
- Or select "Adam" to see your own

**New Features (Adam Only):**

#### 1️⃣ Calendar Display
📅 See upcoming jobs in the app

**To Connect:**
1. Select "Adam"
2. Click "Connect Google Calendar"
3. Sign in with: `adam_thornton@y7mail.com`
4. Allow access
5. Calendar events appear below

**What You'll See:**
- Kitchen Renovation - 42 Riverside St
- Bathroom Tile Work - 15 Oak Ave
- Flooring Installation - 42 Riverside St
- Paint & Finishing - 15 Oak Ave
- Final Inspection - 42 Riverside St

#### 2️⃣ Weekly Payroll SMS
📱 Automatically send payroll text to workers

**Automatic Send:**
- Every Friday at 5:30 PM AWST
- Goes to: James (0421447653) & Brady (0417914721)
- Includes hours, rate, and total pay

**Test It Now:**
1. Click "Send Test SMS Now"
2. SMS sent to both workers
3. Check it works before Friday

**Message Example:**
```
ANLCONSTRUCTIONS
Weekly Payroll

Worker: James
Hours: 37.5h
Rate: $28/hr
Total Pay: $1,050.00

Daily details available in the app.
```

### Hourly Rates
```
Adam:  $35/hour
James: $28/hour
Brady: $28/hour
Drew:  $30/hour
```

### Weekly Navigation
- Click `‹` to see previous week
- Click `›` to see next week
- Week label shows current range

### Export Worker Hours
- Select worker
- Click "Export"
- CSV file with all hours and pay

---

## Troubleshooting

### I Can't See the Calendar
- ✓ Make sure you're logged in as Adam
- ✓ Click "Connect Google Calendar"
- ✓ Sign in with adam_thornton@y7mail.com
- ✓ Check browser allows popups

### SMS Didn't Send
- ✓ Click "Send Test SMS Now" first
- ✓ Check that Twilio is set up
- ✓ Verify phone numbers: 0421447653, 0417914721
- ✓ Check your SMS credits

### Hours Show Wrong
- ✓ Check your times are correct (08:00 not 8:00)
- ✓ Remember: 30-min lunch is automatic
- ✓ Example: 08:00→17:00 = 9h - 0.5h = 8.5h
- ✓ Multiply hours × rate = pay

### Data Lost After Refresh
- ✓ Don't worry, data is saved locally
- ✓ It stays on your device
- ✓ Try opening browser settings and enable cookies
- ✓ Or deploy with Supabase for cloud backup

---

## Settings

**Click "Settings" to see:**
- Hourly rates for each worker
- Lunch break deduction (30 min)

**To change rates:**
- Contact support (rates are admin-configured)

---

## Data & Privacy

### What's Stored
- Time in and time out
- Hours worked
- Pay calculated
- Exported CSVs

### Where It's Stored
- On your phone/device (browser storage)
- Not on a server (unless you add Supabase)
- Private and secure

### Exporting
- CSV file can be sent to accountant
- Includes all hours and pay
- Useful for payroll records

---

## Week View Example

```
┌───────┬────────┬────────┬────────┬──────┐
│ Day   │ Start  │ End    │ Hours  │ Pay  │
├───────┼────────┼────────┼────────┼──────┤
│ Mon   │ 08:00  │ 17:00  │ 8h 30m │ $238 │
│ Tue   │ 08:00  │ 17:00  │ 8h 30m │ $238 │
│ Wed   │ 09:00  │ 17:30  │ 8h 30m │ $238 │
│ Thu   │ 08:00  │ 17:00  │ 8h 30m │ $238 │
│ Fri   │ 08:00  │ 16:00  │ 7h 30m │ $210 │
├───────┼────────┼────────┼────────┼──────┤
│ Total │        │        │ 41h 30m│$1,162│
└───────┴────────┴────────┴────────┴──────┘

Note: Each day's lunch deducted from hours
```

---

## Common Questions

**Q: Do workers see the calendar?**  
A: No, only Adam (admin) can see calendar events.

**Q: When do SMS go out?**  
A: Every Friday at 5:30 PM AWST to James and Brady.

**Q: What if someone is sick?**  
A: Just don't log hours for that day.

**Q: Can I change hourly rates?**  
A: Contact admin (rates are configured server-side).

**Q: What if I forget to check out?**  
A: Manually enter the time when you remember.

**Q: Does the app work offline?**  
A: Yes! Time data saves locally even without internet.

**Q: Can I track lunch breaks differently?**  
A: Currently 30 minutes auto-deducted; contact support to change.

---

## Need Help?

1. **Check the app** - Settings and notifications are built-in
2. **Refresh the browser** - Sometimes fixes UI issues
3. **Check your browser** - Use Chrome, Safari, or Firefox
4. **Contact Adam** - He can help with any questions

---

## Tips for Best Use

✅ **DO:**
- Check in when you arrive
- Check out when you leave
- Use consistent time format (HH:MM)
- Export weekly for records
- Test SMS on Fridays before 5:30 PM

❌ **DON'T:**
- Share your login
- Close app without saving times
- Forget to check out
- Edit times in the past (without asking Adam)

---

**Questions?** Ask Adam or check DEPLOYMENT_GUIDE.md for technical details.

---

**Version:** 1.0  
**Last Updated:** 2026-06-01  
**Status:** ✅ Ready to Use
