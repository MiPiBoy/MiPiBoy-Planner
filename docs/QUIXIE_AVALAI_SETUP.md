# Quixie / AvalAI configuration

Quixie now sends requests through the Supabase Edge Function `quixie`. The AvalAI credential is no longer read by the React app or embedded in the GitHub Pages bundle.

## Configure the provider key

1. Open the AvalAI dashboard at https://ava.al/keys.
2. Create a **new** API key. The previous key may have been invalidated during AvalAI's recovery process.
3. Open Supabase Dashboard → Edge Functions → Secrets for project `toukykglihgxezsaxobj`.
4. Add a secret named `AVALAI_API_KEY` and paste the new key as its value.
5. Save, then reload Planner and try Quixie again.

Do not add this key to React environment variables, GitHub Actions variables, source files, or chat messages. It must exist only as a Supabase Edge Function secret.

## Troubleshooting

- A 503 response with a configuration message means `AVALAI_API_KEY` has not been added to Edge Function secrets.
- A 401 / “API key not recognized” response means the key stored in Supabase is invalid, revoked, copied incorrectly, or not yet accepted by AvalAI. Create another key in AvalAI and replace the Supabase secret.
- 429 means the provider rate limit was reached; Quixie waits and retries a limited number of times.
- The Edge Function requires a valid Supabase user session. Sign in before using Quixie.

Because the previous implementation sent the AvalAI key directly from the browser, revoke the old key after creating the replacement.
