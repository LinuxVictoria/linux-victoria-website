// Serves the built site from _site/ and handles GitHub sign-in for the Decap CMS at /admin/.
// Needs GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET from a GitHub OAuth app whose
// callback URL is https://<this site>/api/callback.

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const PORT = process.env.PORT || 3000;
// Changes on every deploy, so the preview-link workflow can tell when a rebuild is live
const STARTED = Date.now().toString();
const ROOT = path.join(__dirname, "_site");
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".json": "application/json", ".yml": "text/yaml", ".xml": "application/xml",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".gif": "image/gif", ".webp": "image/webp", ".ico": "image/x-icon", ".pdf": "application/pdf",
  ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf", ".txt": "text/plain",
  ".wasm": "application/wasm", ".pf_meta": "application/octet-stream",
};

function origin(req) {
  const proto = req.headers["x-forwarded-proto"] || "http";
  return `${proto}://${req.headers.host}`;
}

// The popup posts the token back to the CMS window, using Decap's handshake
function authResult(res, status, content, allowedOrigin) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`<!doctype html><script>
    const allowed = ${JSON.stringify(allowedOrigin)};
    window.addEventListener("message", (e) => {
      if (e.origin !== allowed) return;
      window.opener.postMessage(${JSON.stringify(message)}, allowed);
    }, { once: true });
    window.opener.postMessage("authorizing:github", allowed);
  </script>`);
}

function handleAuth(req, res, url) {
  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    res.writeHead(500).end("GitHub OAuth is not configured");
    return;
  }
  if (url.pathname === "/api/auth") {
    const state = crypto.randomBytes(16).toString("hex");
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: `${origin(req)}/api/callback`,
      scope: url.searchParams.get("scope") || "repo",
      state,
    });
    res.writeHead(302, {
      Location: `https://github.com/login/oauth/authorize?${params}`,
      "Set-Cookie": `oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    });
    res.end();
    return;
  }
  // /api/callback
  const cookieState = /(?:^|;\s*)oauth_state=([a-f0-9]+)/.exec(req.headers.cookie || "")?.[1];
  const { code, state } = Object.fromEntries(url.searchParams);
  if (!code || !state || state !== cookieState) {
    authResult(res, "error", { message: "Sign-in failed: state mismatch" }, origin(req));
    return;
  }
  fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: GITHUB_CLIENT_ID, client_secret: GITHUB_CLIENT_SECRET, code }),
  })
    .then((r) => r.json())
    .then((data) => {
      if (!data.access_token) throw new Error(data.error_description || "No token returned");
      authResult(res, "success", { token: data.access_token, provider: "github" }, origin(req));
    })
    .catch((err) => authResult(res, "error", { message: err.message }, origin(req)));
}

function serveFile(res, file, status = 200) {
  const type = TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
  res.writeHead(status, { "Content-Type": type });
  fs.createReadStream(file).pipe(res);
}

http
  .createServer((req, res) => {
    res.setHeader("X-Started", STARTED);
    const url = new URL(req.url, "http://localhost");
    if (url.pathname === "/api/auth" || url.pathname === "/api/callback") {
      handleAuth(req, res, url);
      return;
    }
    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }
    const file = path.join(ROOT, pathname);
    if (!file.startsWith(ROOT)) {
      res.writeHead(403).end();
      return;
    }
    fs.stat(file, (err, stat) => {
      if (!err && stat.isFile()) return serveFile(res, file);
      if (!err && stat.isDirectory()) {
        if (!pathname.endsWith("/")) {
          res.writeHead(301, { Location: pathname + "/" + url.search }).end();
          return;
        }
        const index = path.join(file, "index.html");
        if (fs.existsSync(index)) return serveFile(res, index);
      }
      serveFile(res, path.join(ROOT, "404.html"), 404);
    });
  })
  .listen(PORT, () => console.log(`Listening on :${PORT}`));
