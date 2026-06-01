## Initial Setup Guide for Panel Bazaar BD

1. **Deploy to Vercel**
   Import this GitHub repository into Vercel.
   Add all Environment Variables to the Vercel project before deploying.

2. **Supabase Database**
   Go to your Supabase project's SQL Editor.
   Run the following files in order:
   - `supabase/migrations/001_tables.sql`
   - `supabase/migrations/002_functions.sql`
   - `supabase/migrations/003_rls_policies.sql`
   - `supabase/migrations/004_trigger_profile.sql`

3. **VerifyTaka Webhook**
   Go to your VerifyTaka dashboard.
   Add Webhook URL: `https://your-domain.com/api/webhooks/verifytaka`

4. **First Admin Setup**
   Register an account on the live site with: `sb2127061@gmail.com`
   The database trigger will automatically set `is_admin = true` for this specific email.