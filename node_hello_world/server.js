const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT_DIR = __dirname;
const DEFAULT_PORT = Number(process.env.PORT) || 8000;

const CONTENT_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function sendResponse(response, statusCode, body, contentType) {
  response.writeHead(statusCode, { 'Content-Type': contentType });
  response.end(body);
}

function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildDirectoryListing(requestPath, directoryPath) {
  const entries = fs.readdirSync(directoryPath, { withFileTypes: true })
    .filter((entry) => entry.name !== '.git' && entry.name !== 'node_modules')
    .sort((left, right) => left.name.localeCompare(right.name));

  const currentPath = requestPath === '/' ? '' : requestPath.replace(/\/$/, '');
  const items = entries.map((entry) => {
    const suffix = entry.isDirectory() ? '/' : '';
    const hrefBase = currentPath ? `${currentPath}/${entry.name}` : `/${entry.name}`;
    const href = `${hrefBase}${suffix}`;
    const label = `${entry.name}${suffix}`;
    return `<li><a href="${encodeURI(href)}">${escapeHtml(label)}</a></li>`;
  }).join('\n');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>web-design-course</title>
    <style>
      :root { color-scheme: light; }
      body {
        margin: 0;
        font-family: Georgia, "Times New Roman", serif;
        background: linear-gradient(135deg, #f3efe5, #dfe7f2);
        color: #1d2a3a;
      }
      main {
        max-width: 720px;
        margin: 48px auto;
        padding: 32px;
        background: rgba(255, 255, 255, 0.85);
        border: 1px solid rgba(29, 42, 58, 0.15);
        border-radius: 18px;
        box-shadow: 0 20px 50px rgba(29, 42, 58, 0.12);
      }
      h1 {
        margin-top: 0;
        font-size: clamp(2rem, 5vw, 3rem);
      }
      ul {
        padding-left: 20px;
      }
      li + li {
        margin-top: 10px;
      }
      a {
        color: #0f4c81;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>web-design-course</h1>
      <p>Choose a folder or file to preview.</p>
      <ul>${items}</ul>
    </main>
  </body>
</html>`;
}

function resolvePath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath.split('?')[0]);
  const safePath = path.normalize(decodedPath).replace(/^([.][.][/\\])+/, '');
  return path.join(ROOT_DIR, safePath);
}

function requestHandler(request, response) {
  const requestPath = request.url || '/';
  const filePath = resolvePath(requestPath);

  if (!filePath.startsWith(ROOT_DIR)) {
    sendResponse(response, 403, 'Forbidden', 'text/plain; charset=utf-8');
    return;
  }

  fs.stat(filePath, (error, stats) => {
    if (error) {
      sendResponse(response, 404, 'Not found', 'text/plain; charset=utf-8');
      return;
    }

    if (stats.isDirectory()) {
      const indexPath = path.join(filePath, 'index.html');
      fs.stat(indexPath, (indexError, indexStats) => {
        if (!indexError && indexStats.isFile()) {
          response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          fs.createReadStream(indexPath)
            .on('error', () => sendResponse(response, 500, 'Internal server error', 'text/plain; charset=utf-8'))
            .pipe(response);
          return;
        }

        const html = buildDirectoryListing(requestPath, filePath);
        sendResponse(response, 200, html, 'text/html; charset=utf-8');
      });
      return;
    }

    const contentType = CONTENT_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    response.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath)
      .on('error', () => sendResponse(response, 500, 'Internal server error', 'text/plain; charset=utf-8'))
      .pipe(response);
  });
}

function startServer(port) {
  const server = http.createServer(requestHandler);

  server.once('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.log(`Port ${port} is in use, retrying on ${nextPort}`);
      startServer(nextPort);
      return;
    }

    throw error;
  });

  server.listen(port, () => {
    const address = server.address();
    const actualPort = typeof address === 'object' && address ? address.port : port;
    console.log(`Serving ${ROOT_DIR} at http://localhost:${actualPort}`);
  });
}

startServer(DEFAULT_PORT);