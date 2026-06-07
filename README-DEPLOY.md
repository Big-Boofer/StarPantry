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

Notes:
- The serverless proxy forwards the requested page HTML and sets CORS headers. It is intended for light use and demo purposes only. For production use, add caching, rate-limiting, and request validation.
- If you prefer Netlify, place `api/proxy.js` under `netlify/functions/proxy.js` and follow Netlify Functions docs.
- If you have a custom server (Heroku, DigitalOcean App Platform), you can run `server/proxy.js` directly (Node 18+ recommended) and point the app to that URL.

Commands to test locally before deploying:

```bash
# build the frontend
npm run build

# run the local proxy (if you want the same behavior as serverless)
node server/proxy.js
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
