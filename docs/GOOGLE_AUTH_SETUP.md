# Google authentication setup

The React app now requires a Supabase Auth session before rendering planner pages. The sign-in button uses Supabase OAuth with Google.

## 1. Configure Google OAuth

1. Open [Google Cloud Console](https://console.cloud.google.com/auth/clients) and create an OAuth client ID of type **Web application**.
2. Add these authorized JavaScript origins:
   - `https://mipiboy.github.io`
   - `http://localhost:3000` (local development only)
3. Add this authorized redirect URI:
   - `https://toukykglihgxezsaxobj.supabase.co/auth/v1/callback`
4. Copy the Google Client ID and Client Secret.

## 2. Enable Google in Supabase

In Supabase Dashboard → Authentication → Sign In / Providers → Google:
- Enable Google.
- Paste the Google Client ID and Client Secret.
- Save.

Then open Authentication → URL Configuration and set:
- Site URL: `https://mipiboy.github.io/MiPiBoy-Planner/`
- Additional Redirect URLs:
  - `https://mipiboy.github.io/MiPiBoy-Planner/`
  - `http://localhost:3000/MiPiBoy-Planner/` (only if running locally with CRA PUBLIC_URL set to this path)
  - `http://localhost:3000/` (if local PUBLIC_URL is empty)

Do not put the Google Client Secret in React environment variables or commit it to GitHub. It belongs only in Supabase's provider settings.

## 3. Frontend environment

Keep the existing public Supabase project URL and anon/publishable key in the build environment:

```env
REACT_APP_SUPABASE_URL=https://toukykglihgxezsaxobj.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<your-public-anon-or-publishable-key>
```

These are public client configuration values, not secrets. Never expose a service_role key.

For GitHub Pages, configure the two variables in the build workflow/repository environment used to run `npm run build`. For local development, use an untracked `.env.local` file.

## 4. Database security

All eight existing planner tables now have:
- `user_id uuid not null default auth.uid()` referencing `auth.users(id)`
- Row Level Security enabled
- authenticated-only SELECT / INSERT / UPDATE / DELETE policies scoped to `auth.uid() = user_id`
- parent-child ownership constraints for task completions and university class records

Anonymous table access and broad table privileges (including TRUNCATE) have been revoked. Existing UI inserts may omit `user_id`; PostgreSQL fills it from the authenticated session.

## 5. Verify

1. Sign in with Google.
2. Create a task, note and savings box.
3. Sign out and sign in with a second Google account.
4. Confirm the second account sees none of the first account's records.
5. Create a record in the second account, then return to the first and confirm isolation.

The database schema and policies have already been applied to the connected Supabase project. This guide is for enabling the external Google provider and configuring redirect URLs.
