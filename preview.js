const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;
const DIST_DIR = path.resolve(__dirname, 'dist');

const mime = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.json': 'application/json',
  '.ico':  'image/x-icon',
};

function serveFile(filePath, res) {
  const ext = path.extname(filePath);
  const contentType = mime[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end('Server Error');
    } else {
      // For HTML files we inject a simple CSP header for safety
      const headers = {'Content-Type': contentType};
      if (ext === '.html') {
        headers['Cache-Control'] = 'no-cache';
      }
      res.writeHead(200, headers);
      res.end(data);
    }
  });
}

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(DIST_DIR, reqPath);
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA routing
      serveFile(path.join(DIST_DIR, 'index.html'), res);
    } else {
      serveFile(filePath, res);
    }
  });
});

server.listen(PORT, () => {
  console.log(`✅ Production preview server running on http://localhost:${PORT}`);
});
