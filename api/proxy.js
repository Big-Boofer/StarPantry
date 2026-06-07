// Hardened Vercel-style serverless proxy
// Features:
// - Require `x-proxy-secret` header when `PROXY_SECRET` env var is set
// - Optional host allowlist via `PROXY_ALLOWLIST` (comma-separated, supports leading * wildcard)
// - Simple in-memory TTL cache via `PROXY_CACHE_TTL` (seconds, default 300)
// - Basic per-IP rate limiting via `PROXY_RATE_LIMIT` and `PROXY_RATE_WINDOW`
// - Block requests to localhost / private IPs when target is an IP or resolves to one

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
  // quick checks for literal IPs
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

export default async function handler(req, res) {
  try {
    // CORS / preflight
    const corsAllow = process.env.PROXY_CORS_ALLOW || '*';
    res.setHeader('Access-Control-Allow-Origin', corsAllow);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-proxy-secret');

    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    const url = req.query.url || (req.url && new URL(req.url, `http://${req.headers.host}`).searchParams.get('url'));
    if (!url) {
      res.status(400).send('Missing url parameter');
      return;
    }

    // Enforce secret if provided
    const requiredSecret = process.env.PROXY_SECRET;
    if (requiredSecret) {
      const got = req.headers['x-proxy-secret'];
      if (!got || got !== requiredSecret) {
        res.status(401).send('Unauthorized');
        return;
      }
    }

    const parsed = new URL(url);

    // Disallow private IPs / localhost
    if (isPrivateIpAddress(parsed.hostname)) {
      res.status(403).send('Forbidden');
      return;
    }

    // Allowlist check (if configured)
    const allowlist = parseAllowlist(process.env.PROXY_ALLOWLIST || '');
    if (allowlist && allowlist.length && !hostAllowed(parsed.hostname, allowlist)) {
      res.status(403).send('Host not allowed');
      return;
    }

    // Simple rate limiting per IP
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
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
      res.status(429).send('Too many requests');
      return;
    }

    // Simple in-memory cache
    const cacheTtl = Number(process.env.PROXY_CACHE_TTL || 300) * 1000;
    const cached = cache.get(url);
    if (cached && (now < cached.expiresAt)) {
      res.setHeader('Content-Type', cached.contentType || 'text/html; charset=utf-8');
      res.status(200).send(cached.body);
      return;
    }

    const fetchFn = global.fetch || (await import('node-fetch')).default;
    const resp = await fetchFn(url, { redirect: 'follow' });
    const text = await resp.text();
    const contentType = resp.headers?.get?.('content-type') || 'text/html; charset=utf-8';

    cache.set(url, { body: text, contentType, expiresAt: now + cacheTtl });

    res.setHeader('Content-Type', contentType);
    res.status(200).send(text);
  } catch (err) {
    console.error('proxy error', err && err.message);
    res.setHeader('Access-Control-Allow-Origin', process.env.PROXY_CORS_ALLOW || '*');
    res.status(500).send('Proxy error');
  }
}
