const http = require('http');
const { URL } = require('url');

const PORT = process.env.PROXY_PORT || 8787;

const server = http.createServer(async (req, res) => {
  try {
    const parsed = new URL(req.url, `http://localhost:${PORT}`);
    if (parsed.pathname !== '/proxy') {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }

    const target = parsed.searchParams.get('url');
    if (!target) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing url param');
      return;
    }

    // Allow CORS for browser clients
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (req.method === 'OPTIONS') {
      res.writeHead(204, headers);
      res.end();
      return;
    }

    // Fetch the target URL server-side to avoid CORS
    const response = await fetch(target, { redirect: 'follow' });
    const text = await response.text();

    const outHeaders = Object.assign({ 'Content-Type': 'text/html; charset=utf-8' }, headers);
    res.writeHead(200, outHeaders);
    res.end(text);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy error');
  }
});

server.listen(PORT, () => {
  console.log(`Proxy server listening on http://localhost:${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught', err);
});
