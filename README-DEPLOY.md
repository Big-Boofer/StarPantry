Deployment guide — make the app accessible at a real URL
=====================================================

This project is built with Vite + React. To make the site available from anywhere (a real URL), you can deploy the frontend to Vercel, Netlify, or any static host. The recipe importer needs a CORS-enabled proxy; for that you can deploy the included serverless proxy to the same platform.

Recommended quick path (Vercel):

1. Create a free account at https://vercel.com and connect your GitHub (or push this repo to GitHub).
2. Import the repository in Vercel and let it detect the Vite app. Use the default build command `npm run build` and output `dist`.
3. Add the serverless proxy:
   - The file `api/proxy.js` is included. Vercel will deploy it automatically as a serverless function at `https://<your-vercel-app>.vercel.app/api/proxy`.
4. In the app, open Settings and set the "Recipe Imports URL" to the serverless proxy endpoint from step 3 (for example `https://my-pantrypal.vercel.app/api/proxy`).
5. Deploy and visit the generated URL — the importer will use the deployed proxy to fetch recipes and the site will be accessible from anywhere.

Supabase (Auth + Persistence)
---------------------------------
This app can use Supabase for households, authentication, and persistent shared state.

1. Create a Supabase project at https://app.supabase.com
2. Open the SQL editor and run the SQL in `supabase_schema.sql` to create the `households` and `household_members` tables and RLS policies.
3. In your Supabase project settings -> API, copy the `url` and the `anon` public key.
4. In Vercel, add the following Environment Variables (Production):
   - `VITE_SUPABASE_URL` — your Supabase `url` (e.g. `https://xyz.supabase.co`)
   - `VITE_SUPABASE_ANON_KEY` — the `anon` public key
5. Redeploy the app so the build picks up `VITE_SUPABASE_URL`.

Notes:
- The app stores a household `state` JSON blob in the `households` table (ingredients, recipes, orders, settings). You can expand the schema if you want normalized tables.
- The provided SQL enables Row Level Security (RLS) so only owners or household members can read/write household rows. Review and adapt policies for your workflow.
- For invites and membership management you can extend the `household_members` table and add server-side functions for invite emails.

Notes:
- The serverless proxy forwards the requested page HTML and sets CORS headers. It is intended for light use and demo purposes only. For production use, add caching, rate-limiting, and request validation.
- If you prefer Netlify, place `api/proxy.js` under `netlify/functions/proxy.js` and follow Netlify Functions docs.
If you have a custom server (Heroku, DigitalOcean App Platform), deploy the serverless `api/proxy.js` or host your own proxy on your server and point the app to that URL.

Commands to test locally before deploying:

```bash
# build the frontend
npm run build
```

What I added for you
- `vercel.json` — config to deploy the frontend and `api/proxy.js` as a serverless function.
- `.github/workflows/vercel-deploy.yml` — GitHub Action that builds and deploys to Vercel on push to `main`.

Exact steps for you to finish deployment

1) Create a Vercel token
   - Go to https://vercel.com/account/tokens and create a new token. Copy the token value.

2) Add GitHub repository secrets
   - In your GitHub repo settings -> Secrets -> Actions, add the secret `VERCEL_TOKEN` with the token value.
   - Optionally add `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` if you want the Action to deploy to a specific project without interactive linking. (You can also let `npx vercel` prompt during first run and then subsequent runs will be linked automatically.)

3) Push this repository to GitHub (if not already). Example:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git branch -M main
git remote add origin https://github.com/<youruser>/<repo>.git
git push -u origin main
```

4) Visit the Actions tab on GitHub — you should see the `Deploy to Vercel` workflow run. If everything is configured, it will build and call `npx vercel --prod`.

5) After the Action completes, your project will be deployed to Vercel. Visit the Vercel dashboard to find the URL, then set the `Recipe Imports URL` in Settings to `https://<your-app>.vercel.app/api/proxy`.

Security note: Add an allowlist in `api/proxy.js` before making the proxy public if you plan heavy use; I can add a simple allowlist and caching layer for you.

Recommended environment variables (Vercel)
-----------------------------------------

Set the following Environment Variables in your Vercel Project (Project → Settings → Environment Variables) for Production:

- `VERCEL_TOKEN` — deployment token for GitHub Actions (already covered above).
- `VITE_REMOTE_PROXY_URL` — the URL your frontend will call for recipe imports, e.g. `https://my-pantrypal.vercel.app/api/proxy`.
- `PROXY_SECRET` — a strong random value; if set, the proxy requires `x-proxy-secret` header matching this value.
- `PROXY_ALLOWLIST` — optional comma-separated hostnames allowed through the proxy, e.g. `example.com,*.recipes.example.org`. Leave empty to allow all hosts (not recommended for public usage).
- `PROXY_CACHE_TTL` — optional cache time-to-live in seconds (default `300`).
- `PROXY_RATE_LIMIT` — optional requests per window (default `60`).
- `PROXY_RATE_WINDOW` — optional window size in seconds for rate limiting (default `60`).
- `PROXY_CORS_ALLOW` — optional CORS origin value (defaults to `*`). For tighter security set to your site URL, e.g. `https://my-pantrypal.vercel.app`.

Example values (Vercel UI):
- Key: `PROXY_SECRET`, Value: `s3cr3t-r4nd0m-token` (Environment: Production)
- Key: `VITE_REMOTE_PROXY_URL`, Value: `https://my-pantrypal.vercel.app/api/proxy`

How the app picks the proxy
---------------------------
The frontend reads `VITE_REMOTE_PROXY_URL` at build time and uses it as the default remote proxy URL. If you set this env var in Vercel and redeploy, users won't need to enter the proxy URL in Settings manually.

Testing the deployed proxy
--------------------------
If you set `PROXY_SECRET`, include it in requests as the `x-proxy-secret` header. Example `curl` (replace values):

```bash
curl -H "x-proxy-secret: s3cr3t-r4nd0m-token" \
   "https://my-pantrypal.vercel.app/api/proxy?url=https://example.com/recipe-page"
```

If the proxy is allowlisted, ensure the target host is included in `PROXY_ALLOWLIST` or the request will be rejected with `403 Host not allowed`.

Re-deploy after changes
------------------------
After adding or changing Environment Variables in the Vercel dashboard, trigger a redeploy (either via GitHub Actions or the Vercel dashboard) so the build sees `VITE_REMOTE_PROXY_URL` and other runtime variables take effect.

I already added basic hardening (secret/allowlist/cache/rate-limit) to `api/proxy.js`. If you want stricter rules (better IP resolution, persistent caching, Redis, or logging), I can add them next.
