# Database Configuration Template

When you're ready to set up Supabase cloud sync, fill in this form and save the credentials.

## Step 1: Create Supabase Account & Project

1. Go to https://supabase.com
2. Click "Sign up"
3. Create account (email or GitHub)
4. Click "New project"
5. Fill in:
   - **Name:** `Anlconstructions Time Tracker`
   - **Database Password:** _(create a strong password)_
   - **Region:** _(select your region - e.g., Singapore or Sydney)_
6. Wait 5-10 minutes for project creation

## Step 2: Get Your Credentials

Once project is created:

1. Go to **Settings → API** in left sidebar
2. Find these keys:

### Project Information
- **Project ID:** `xxxxxxxxxxxxxx` ← Save this
- **Project URL:** `https://YOUR_PROJECT_ID.supabase.co`

### Authentication Keys
- **Anon Key (Public):** Starts with `eyJ...` ← Safe to use in app
- **Service Role Key (Secret):** Starts with `eyJ...` ← Keep this private!

## Step 3: Save Your Credentials

Copy and save these in a secure location:

```
PROJECT_ID: 
PROJECT_URL: 
ANON_KEY: 
SERVICE_ROLE_KEY: 
REGION: 
```

## Step 4: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `time_tracker_schema.sql`
4. Paste into the query editor
5. Click "Run"
6. Wait for all tables to be created

## Step 5: Configure the App

Edit `time_tracker_app.html` and find this section (around line 380):

```javascript
// Supabase Configuration - TO BE FILLED IN WITH ACTUAL CREDENTIALS
const SUPABASE_URL = 'https://YOUR_SUPABASE_URL.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

Replace with your actual keys:

```javascript
const SUPABASE_URL = 'https://xxxxxxxxxxxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGc...';
```

## Step 6: Test the Connection

1. Refresh the app in browser
2. Open browser console (F12)
3. Try adding a worker
4. Check if data appears in Supabase dashboard → Table Editor

## Security Notes

🔒 **Public Key (Anon Key):**
- Safe to include in browser code
- Limited to authenticated users
- Row-level security limits access

🔒 **Private Key (Service Role Key):**
- NEVER put in browser code
- Use only in backend/server
- Has full database access
- Keep secret like a password

## Firewall & Access Rules

Supabase automatically:
- ✅ Enables HTTPS
- ✅ Blocks direct database access
- ✅ Enforces Row Level Security (RLS)
- ✅ Limits API requests
- ✅ Logs all queries

## Backups & Recovery

Supabase automatically:
- ✅ Backs up daily
- ✅ Keeps 30-day history
- ✅ Encrypts backups
- ✅ Allows point-in-time restore

## Monitoring & Status

Check project health:
1. Go to **Settings → Project Status**
2. Monitor:
   - Database status
   - API usage
   - Storage space
   - Connection count

## Pricing

Free tier includes:
- ✅ 500MB database storage
- ✅ 1GB bandwidth/month
- ✅ Real-time subscriptions
- ✅ Up to 50,000 monthly active users

Never pays: Perfect for Anlconstructions.

## Troubleshooting

### "Connection refused" error
→ Check Project URL and ANON_KEY are correct
→ Verify Supabase project is active

### "Unauthorized" error
→ Check Anon Key has spaces removed
→ Verify RLS policies are set correctly

### Data not syncing
→ Check browser console for errors
→ Verify API key permissions
→ Check database tables exist

### Slow performance
→ Check query indexes
→ Monitor database connection count
→ Review slow query logs

## API Endpoints

Once configured, your endpoints are:

```
REST API Base: https://YOUR_PROJECT_ID.supabase.co/rest/v1
Realtime: wss://YOUR_PROJECT_ID.supabase.co/realtime/v1
Auth API: https://YOUR_PROJECT_ID.supabase.co/auth/v1
```

## Connection String (for tools)

If you need the full database connection string:

Go to **Settings → Database** and find:

```
postgresql://postgres:[YOUR_PASSWORD]@db.YOUR_PROJECT_ID.supabase.co:5432/postgres
```

## Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **Status Page:** https://status.supabase.com
- **Community Chat:** https://discord.supabase.com
- **Email Support:** support@supabase.com (for paid plans)

## Next Steps

1. ✅ Create Supabase project
2. ✅ Get credentials
3. ✅ Run database schema
4. ✅ Configure app keys
5. ✅ Test connection
6. ✅ Start using cloud sync

---

**Optional but Recommended:**
- Set up email notifications for database alerts
- Enable 2FA on your Supabase account
- Set up regular data exports
- Configure backup retention

**You're all set!** Your Anlconstructions Time Tracker is now cloud-enabled.
