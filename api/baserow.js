// Vercel serverless proxy for Baserow API (avoids CORS)
// Usage: /api/baserow?path=/database/rows/table/771/&method=GET
// Body forwarded as-is for POST/PATCH/DELETE

const BASEROW = 'https://base.wayway.ai/api';

export default async function handler(req, res) {
  const { path } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path param' });

  // Forward auth header
  const headers = { 'Content-Type': 'application/json' };
  if (req.headers.authorization) headers['Authorization'] = req.headers.authorization;

  const opts = { method: req.method, headers };
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    opts.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  try {
    // Build URL with any query params except 'path'
    const url = new URL(BASEROW + path);
    for (const [k, v] of Object.entries(req.query)) {
      if (k !== 'path') url.searchParams.set(k, v);
    }

    const upstream = await fetch(url.toString(), opts);
    const contentType = upstream.headers.get('content-type') || '';

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (upstream.status === 204) return res.status(204).end();

    if (contentType.includes('json')) {
      const data = await upstream.json();
      return res.status(upstream.status).json(data);
    }

    const text = await upstream.text();
    return res.status(upstream.status).send(text);
  } catch (e) {
    return res.status(502).json({ error: 'Proxy error', detail: e.message });
  }
}
