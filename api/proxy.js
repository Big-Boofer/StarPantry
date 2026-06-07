// Simple Vercel-style serverless proxy for fetching HTML and returning it with CORS headers
// Deploy this file to Vercel (place at /api/proxy.js) or another serverless provider that supports Node.js.

export default async function handler(req, res) {
  try {
    const url = req.query.url || req.url && new URL(req.url, `http://${req.headers.host}`).searchParams.get('url');
    if (!url) {
      res.status(400).send('Missing url parameter');
      return;
    }

    // Use node-fetch if not available in the runtime (Vercel provides fetch in newer runtimes)
    let fetchFn = global.fetch || (await import('node-fetch')).default;
    const resp = await fetchFn(url, { redirect: 'follow' });
    const text = await resp.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(text);
  } catch (err) {
    console.error('proxy error', err && err.message);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).send('Proxy error');
  }
}
