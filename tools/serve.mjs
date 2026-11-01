// Minimal static server for local development and end-to-end tests. Serves the project directory at the root, as
// GitHub Pages does. Usage: node tools/serve.mjs [port]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve, sep } from 'node:path';

const port = parseInt(process.argv[2] || process.env.PORT || '4173', 10);
// Bind to all interfaces by default so the sandbox preview proxy (which reaches the container from outside)
// can connect; 127.0.0.1 stays reachable from inside the container for Playwright.
const host = process.env.HOST || '0.0.0.0';
// ROOT lets you serve a subtree (e.g. ROOT=book/editions for the reading edition) instead of the whole site.
const root = resolve(new URL('..', import.meta.url).pathname, process.env.ROOT || '.');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.epub': 'application/epub+zip', '.webp': 'image/webp', '.avif': 'image/avif', '.md': 'text/markdown; charset=utf-8', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.woff2': 'font/woff2', '.map': 'application/json' };

createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = resolve(join(root, path));
    if (!file.startsWith(root + sep) && file !== root) { res.writeHead(403); return res.end(); }
    let s = await stat(file).catch(() => null);
    if (s && s.isDirectory()) { if (!path.endsWith('/')) { res.writeHead(301, { Location: path + '/' }); return res.end(); } file = join(file, 'index.html'); s = await stat(file).catch(() => null); }
    if (!s) { const nf = join(root, '404.html'); /* GitHub Pages serves the root 404.html for every miss */ res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }); return res.end(await readFile(nf).catch(() => 'Not found')); }
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    res.end(body);
  } catch (e) { res.writeHead(500); res.end(String(e)); }
}).listen(port, host, () => console.log(`serving ${root} at http://${host}:${port}/`));
