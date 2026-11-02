import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    const file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    if (file !== root && !file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
    let target = file;
    try { if ((await fs.stat(target)).isDirectory()) target = path.join(target, 'index.html'); } catch { /* handled by fallback below */ }
    let data;
    try { data = await fs.readFile(target); } catch { target = path.join(root, '404.html'); data = await fs.readFile(target); response.statusCode = 404; }
    response.setHeader('Content-Type', types[path.extname(target)] || 'application/octet-stream');
    response.end(data);
  } catch { response.writeHead(400).end('Bad request'); }
}).listen(4173, '127.0.0.1', () => console.log('http://127.0.0.1:4173'));
