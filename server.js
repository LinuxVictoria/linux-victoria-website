// Serves the built site from _site/ and is the back end for Spacedash (Decap at /admin/):
//
//   /api/auth, /api/callback  sign in with Authentik (OIDC). Who may edit is decided in
//                             Authentik by the app's bindings, so only bound people get in.
//   /api/github/*             a GitHub API proxy for Decap. It answers /user from the
//                             Authentik profile and forwards repo calls with a GitHub App
//                             token limited to this site's repo, so editors need no GitHub
//                             account and commits come from the SpaceClub bot.
//
// Env: OIDC_ISSUER, OIDC_CLIENT_ID, OIDC_CLIENT_SECRET (Authentik provider for this site);
// GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, GITHUB_INSTALLATION_ID, GITHUB_REPO (owner/name).

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const PORT = process.env.PORT || 3000;
// Changes on every deploy, so the preview-link workflow can tell when a rebuild is live
const STARTED = Date.now().toString();
const ROOT = path.join(__dirname, "_site");
const ENV = process.env;
const REPO = ENV.GITHUB_REPO;
const SESSION_HOURS = 8;

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

function cookie(req, name) {
  return new RegExp(`(?:^|;\\s*)${name}=([^;]+)`).exec(req.headers.cookie || "")?.[1];
}

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

// --- sign in with Authentik ---------------------------------------------------

let discovery;
async function oidc() {
  if (!discovery) {
    const r = await fetch(new URL(".well-known/openid-configuration", ENV.OIDC_ISSUER));
    if (!r.ok) throw new Error(`OIDC discovery returned ${r.status}`);
    discovery = await r.json();
  }
  return discovery;
}

// Signed-in editors: session token -> { user, expires }. Kept in memory, so a redeploy
// just asks people to log in again.
const sessions = new Map();

// The popup posts the result back to the CMS window, using Decap's handshake
function authResult(res, status, content, allowedOrigin) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Set-Cookie": "spacedash_oidc=; Path=/api; Max-Age=0" });
  res.end(`<!doctype html><script>
    const allowed = ${JSON.stringify(allowedOrigin)};
    window.addEventListener("message", (e) => {
      if (e.origin !== allowed) return;
      window.opener.postMessage(${JSON.stringify(message)}, allowed);
    }, { once: true });
    window.opener.postMessage("authorizing:github", allowed);
  </script>`);
}

async function handleAuth(req, res, url) {
  const config = await oidc();
  const redirectUri = `${origin(req)}/api/callback`;

  if (url.pathname === "/api/auth") {
    const state = crypto.randomBytes(16).toString("hex");
    const verifier = crypto.randomBytes(32).toString("base64url");
    const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
    const params = new URLSearchParams({
      response_type: "code",
      client_id: ENV.OIDC_CLIENT_ID,
      redirect_uri: redirectUri,
      scope: "openid profile email",
      state,
      code_challenge: challenge,
      code_challenge_method: "S256",
    });
    res.writeHead(302, {
      Location: `${config.authorization_endpoint}?${params}`,
      "Set-Cookie": `spacedash_oidc=${state}.${verifier}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    });
    res.end();
    return;
  }

  // /api/callback
  const [savedState, verifier] = (cookie(req, "spacedash_oidc") || "").split(".");
  const code = url.searchParams.get("code");
  if (!code || !savedState || url.searchParams.get("state") !== savedState) {
    authResult(res, "error", { message: url.searchParams.get("error_description") || "Sign-in failed, please try again." }, origin(req));
    return;
  }
  const tokenRes = await fetch(config.token_endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: ENV.OIDC_CLIENT_ID,
      client_secret: ENV.OIDC_CLIENT_SECRET,
      code_verifier: verifier,
    }),
  });
  const tokens = await tokenRes.json();
  if (!tokens.access_token) throw new Error(tokens.error_description || "No token from Authentik");
  const info = await (await fetch(config.userinfo_endpoint, { headers: { Authorization: `Bearer ${tokens.access_token}` } })).json();

  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, {
    user: { sub: info.sub, name: info.name || info.preferred_username, email: info.email, login: info.preferred_username },
    expires: Date.now() + SESSION_HOURS * 3600 * 1000,
  });
  authResult(res, "success", { token, provider: "github" }, origin(req));
}

function sessionFor(req) {
  const token = /^(?:token|Bearer) (\w+)$/.exec(req.headers.authorization || "")?.[1];
  const session = token && sessions.get(token);
  if (!session) return null;
  if (session.expires < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session;
}

// --- GitHub App token, limited to this site's repo ---------------------------

let installation = { token: null, expires: 0 };
async function githubToken() {
  if (installation.expires - Date.now() > 5 * 60 * 1000) return installation.token;
  const key = ENV.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, "\n");
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const now = Math.floor(Date.now() / 1000);
  const body = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({ iat: now - 60, exp: now + 540, iss: ENV.GITHUB_APP_ID })}`;
  const jwt = `${body}.${crypto.sign("RSA-SHA256", Buffer.from(body), key).toString("base64url")}`;
  const r = await fetch(`https://api.github.com/app/installations/${ENV.GITHUB_INSTALLATION_ID}/access_tokens`, {
    method: "POST",
    headers: { Authorization: `Bearer ${jwt}`, Accept: "application/vnd.github+json" },
    body: JSON.stringify({
      repositories: [REPO.split("/")[1]],
      permissions: { contents: "write", pull_requests: "write", statuses: "read", metadata: "read" },
    }),
  });
  const data = await r.json();
  if (!data.token) throw new Error(`GitHub App token: ${r.status} ${data.message || ""}`);
  installation = { token: data.token, expires: new Date(data.expires_at).getTime() };
  return installation.token;
}

// --- the proxy Decap talks to ---------------------------------------------------

async function handleGithub(req, res, url) {
  const session = sessionFor(req);
  if (!session) return json(res, 401, { message: "Please log in again." });

  const ghPath = url.pathname.slice("/api/github".length) || "/";
  const repoRoot = `/repos/${REPO}`;

  // Decap's "who am I": the Authentik person, not a GitHub account
  if (ghPath === "/user") {
    const { login, name, email } = session.user;
    return json(res, 200, { login, name, email, avatar_url: "", id: 0 });
  }
  // Only this site's repo, whatever the request asks for
  if (ghPath !== repoRoot && !ghPath.startsWith(`${repoRoot}/`)) {
    return json(res, 403, { message: "Spacedash only edits this site's repository." });
  }

  const chunks = [];
  for await (const c of req) chunks.push(c);
  const upstream = await fetch(`https://api.github.com${ghPath}${url.search}`, {
    method: req.method,
    headers: {
      Authorization: `token ${await githubToken()}`,
      Accept: req.headers.accept || "application/vnd.github+json",
      ...(chunks.length ? { "Content-Type": req.headers["content-type"] || "application/json" } : {}),
      ...(req.headers["if-none-match"] ? { "If-None-Match": req.headers["if-none-match"] } : {}),
    },
    body: chunks.length ? Buffer.concat(chunks) : undefined,
  });

  const headers = { "Content-Type": upstream.headers.get("content-type") || "application/json" };
  const etag = upstream.headers.get("etag");
  if (etag) headers.ETag = etag;
  // pagination links point at GitHub; send Decap back through this proxy
  const link = upstream.headers.get("link");
  if (link) headers.Link = link.replaceAll("https://api.github.com", `${origin(req)}/api/github`);

  let body = Buffer.from(await upstream.arrayBuffer());
  // An app token reports no push rights on the repo itself; Decap reads that to decide
  // whether you may edit. Access was already checked by Authentik at sign-in.
  if (ghPath === repoRoot && upstream.ok) {
    const repo = JSON.parse(body);
    repo.permissions = { admin: false, maintain: false, push: true, triage: true, pull: true };
    body = Buffer.from(JSON.stringify(repo));
  }
  res.writeHead(upstream.status, headers);
  res.end(body);
}

// --- static files ------------------------------------------------------------

function serveFile(res, file, status = 200) {
  const type = TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
  res.writeHead(status, { "Content-Type": type });
  fs.createReadStream(file).pipe(res);
}

// Decap's config points sign-in and the API at whichever address it was opened on,
// so the live site, PR previews and localhost all work. local_backend is dropped here:
// it's only for the Eleventy dev server with decap-server.
function serveConfig(req, res, file) {
  const here = origin(req);
  const yml = fs
    .readFileSync(file, "utf8")
    .replace(/^(\s*)base_url:.*$/m, `$1base_url: ${here}\n$1api_root: ${here}/api/github`)
    .replace(/^local_backend:.*$/m, "");
  res.writeHead(200, { "Content-Type": "text/yaml" });
  res.end(yml);
}

http
  .createServer(async (req, res) => {
    res.setHeader("X-Started", STARTED);
    const url = new URL(req.url, "http://localhost");
    try {
      if (url.pathname === "/api/auth" || url.pathname === "/api/callback") return await handleAuth(req, res, url);
      if (url.pathname === "/api/github" || url.pathname.startsWith("/api/github/")) return await handleGithub(req, res, url);
    } catch (err) {
      console.error(`[spacedash] ${url.pathname}: ${err.message}`);
      if (url.pathname === "/api/callback") return authResult(res, "error", { message: "Sign-in failed, please try again." }, origin(req));
      return json(res, 502, { message: "Spacedash couldn't reach GitHub or Authentik." });
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
    if (pathname === "/admin/config.yml" && fs.existsSync(file)) return serveConfig(req, res, file);
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
