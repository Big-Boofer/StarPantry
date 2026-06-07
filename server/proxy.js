const http = require('http');
const { URL } = require('url');

const PORT = process.env.PROXY_PORT || 8787;

// In-memory cache and rate maps
const cache = new Map();
const rateMap = new Map();

function parseAllowlist(raw) {
  if (!raw) return null;
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

function hostAllowed(hostname, allowlist) {
  if (!allowlist || allowlist.length === 0) return true;
  for (const pat of allowlist) {
    if (pat.startsWith('*.')) {
      const suffix = pat.slice(2);
      if (hostname === suffix || hostname.endsWith('.' + suffix)) return true;
    } else if (pat === hostname) return true;
  }
  return false;
}

function isPrivateIpAddress(host) {
  const ipv4 = host.match(/^\d+\.\d+\.\d+\.\d+$/);
  if (ipv4) {
    const parts = host.split('.').map(Number);
    if (parts[0] === 10) return true;
    if (parts[0] === 127) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
    return false;
  }
  if (host === 'localhost') return true;
  return false;
}

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

    // CORS
    const corsAllow = process.env.PROXY_CORS_ALLOW || '*';
    const headers = {
      'Access-Control-Allow-Origin': corsAllow,
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-proxy-secret'
    };

    if (req.method === 'OPTIONS') {
      res.writeHead(204, headers);
      res.end();
      return;
    }

    // Enforce secret if configured
    const requiredSecret = process.env.PROXY_SECRET;
    if (requiredSecret) {
      const got = req.headers['x-proxy-secret'];
      if (!got || got !== requiredSecret) {
        res.writeHead(401, headers);
        res.end('Unauthorized');
        return;
      }
    }

    const parsedTarget = new URL(target);
    if (isPrivateIpAddress(parsedTarget.hostname)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Forbidden');
      return;
    }

    const allowlist = parseAllowlist(process.env.PROXY_ALLOWLIST || '');
    if (allowlist && allowlist.length && !hostAllowed(parsedTarget.hostname, allowlist)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Host not allowed');
      return;
    }

    // Rate limiting per IP
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
    const windowSec = Number(process.env.PROXY_RATE_WINDOW || 60);
    const limit = Number(process.env.PROXY_RATE_LIMIT || 60);
    const now = Date.now();
    const entry = rateMap.get(ip) || { count: 0, windowStart: now };
    if (now - entry.windowStart > windowSec * 1000) {
      entry.count = 0; entry.windowStart = now;
    }
    entry.count += 1;
    rateMap.set(ip, entry);
    if (entry.count > limit) {
      res.writeHead(429, headers);
      res.end('Too many requests');
      return;
    }

    // Cache
    const cacheTtl = Number(process.env.PROXY_CACHE_TTL || 300) * 1000;
    const cached = cache.get(target);
    if (cached && now < cached.expiresAt) {
      const outHeaders = Object.assign({ 'Content-Type': cached.contentType || 'text/html; charset=utf-8' }, headers);
      res.writeHead(200, outHeaders);
      res.end(cached.body);
      return;
    }

    // Fetch
    const response = await fetch(target, { redirect: 'follow' });
    const text = await response.text();
    const contentType = response.headers.get('content-type') || 'text/html; charset=utf-8';

    cache.set(target, { body: text, contentType, expiresAt: now + cacheTtl });

    const outHeaders = Object.assign({ 'Content-Type': contentType }, headers);
    res.writeHead(200, outHeaders);
    res.end(text);
  } catch (err) {
    console.error('proxy error', err && err.message);
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
