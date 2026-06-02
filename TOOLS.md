# TOOLS.md

### Platform Token
- subdomain: `anlconstructions`
- agent_token: `mh_pool_e6f75de6932b71f2`

### Supabase
- Project URL: `https://tzwsdqbrtohcxzvdfwdw.supabase.co`
- Project Ref: `tzwsdqbrtohcxzvdfwdw`
- Service Role Key: (stored securely — not in code)
- Personal Access Token: (stored securely — not in code)
- **Tables created:** users, time_entries
- **Workers:** Adam (7264), James (5891), Brady (3742), Drew (8159)

### App Setup
- **Backend:** `node app-backend.js` → runs on http://localhost:3001
- **Frontend:** Open `app-frontend.html` in browser
- **Dependencies:** `npm install express cors dotenv @supabase/supabase-js`
- **Documentation:** See README.md and SETUP.md

### Optional (Not Yet Connected)
- Gmail App Password: (pending)
- Twilio Account SID: (pending)
- Twilio Auth Token: (pending)
- Twilio Phone: (pending)
- Worker SMS Numbers: (pending)

---

**Note:** Sensitive keys are stored in environment variables on the deployed server, not in code.

### How to use Supabase

**You CAN connect. Sandbox is off. You have exec and web_fetch.**

#### Read / write existing tables (curl, works immediately):
```bash
curl -s "https://tzwsdqbrtohcxzvdfwdw.supabase.co/rest/v1/TABLE_NAME?select=*" \
  -H "apikey: SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer SERVICE_ROLE_KEY"
```

#### Create tables / run DDL — requires Adam's Personal Access Token:
Adam needs to go to https://supabase.com/dashboard/account/tokens → "Generate new token" → paste it to you. Store it here as "Personal Access Token" above.

Then run DDL like this:
```bash
curl -s -X POST "https://api.supabase.com/v1/projects/tzwsdqbrtohcxzvdfwdw/database/query" \
  -H "Authorization: Bearer ADAM_PERSONAL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "YOUR SQL HERE"}'
```

**Do not tell Adam you cannot connect. You can read/write data right now. For table creation, ask Adam for his personal access token — one step, takes 30 seconds.**
