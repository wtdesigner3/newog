import jwt from 'jsonwebtoken';

const BASE = 'http://localhost:3001';
const JWT_SECRET = process.env.JWT_SECRET || "og_heavy_duty_fallback_secret";

// 1. Generate test tokens
const validToken = jwt.sign(
  { id: "507f1f77bcf86cd799439011", email: "admin@ogheavyduty.in", role: "super_admin", tokenVersion: 0 },
  JWT_SECRET,
  { expiresIn: '1h' }
);

const expiredToken = jwt.sign(
  { id: "507f1f77bcf86cd799439011", email: "admin@ogheavyduty.in", role: "super_admin", tokenVersion: 0 },
  JWT_SECRET,
  { expiresIn: '-1h' } // Expired 1 hour ago
);

const forgedToken = jwt.sign(
  { id: "507f1f77bcf86cd799439011", email: "admin@ogheavyduty.in", role: "super_admin", tokenVersion: 0 },
  "wrong_secret_attacker_key",
  { expiresIn: '1h' }
);

const revokedToken = jwt.sign(
  { id: "507f1f77bcf86cd799439011", email: "admin@ogheavyduty.in", role: "super_admin", tokenVersion: 999 },
  JWT_SECRET,
  { expiresIn: '1h' }
);

const scenarios = [
  // A. Anonymous GET to protected APIs
  { name: "Anonymous GET /api/enquiries", method: "GET", path: "/api/enquiries", exp: 401 },
  { name: "Anonymous GET /api/enquiries/export", method: "GET", path: "/api/enquiries/export", exp: 401 },
  { name: "Anonymous GET /api/logs", method: "GET", path: "/api/logs", exp: 401 },
  { name: "Anonymous GET /api/user", method: "GET", path: "/api/user", exp: 401 },
  { name: "Anonymous GET /api/system/backup", method: "GET", path: "/api/system/backup", exp: 401 },
  { name: "Anonymous GET /api/system/errors", method: "GET", path: "/api/system/errors", exp: 401 },
  { name: "Anonymous GET /api/system/redirects", method: "GET", path: "/api/system/redirects", exp: 401 },
  { name: "Anonymous GET /api/files", method: "GET", path: "/api/files", exp: 401 },
  { name: "Anonymous GET /api/email-templates", method: "GET", path: "/api/email-templates", exp: 401 },
  { name: "Anonymous GET /api/dashboard/stats", method: "GET", path: "/api/dashboard/stats", exp: 401 },
  { name: "Anonymous GET /api/analytics/stats", method: "GET", path: "/api/analytics/stats", exp: 401 },

  // B. Anonymous POST to protected APIs
  { name: "Anonymous POST /api/upload", method: "POST", path: "/api/upload", exp: 401 },
  { name: "Anonymous POST /api/files/upload", method: "POST", path: "/api/files/upload", exp: 401 },
  { name: "Anonymous POST /api/products", method: "POST", path: "/api/products", exp: 401 },
  { name: "Anonymous POST /api/categories", method: "POST", path: "/api/categories", exp: 401 },
  { name: "Anonymous POST /api/user", method: "POST", path: "/api/user", exp: 401 },
  { name: "Anonymous POST /api/system/backup", method: "POST", path: "/api/system/backup", exp: 401 },
  { name: "Anonymous POST /api/system/cache", method: "POST", path: "/api/system/cache", exp: 401 },
  { name: "Anonymous POST /api/email-templates/test", method: "POST", path: "/api/email-templates/test", exp: 401 },

  // C. Anonymous PUT / PATCH / DELETE to protected APIs
  { name: "Anonymous PUT /api/products/123", method: "PUT", path: "/api/products/123", exp: 401 },
  { name: "Anonymous DELETE /api/products/123", method: "DELETE", path: "/api/products/123", exp: 401 },
  { name: "Anonymous PUT /api/categories/123", method: "PUT", path: "/api/categories/123", exp: 401 },
  { name: "Anonymous DELETE /api/categories/123", method: "DELETE", path: "/api/categories/123", exp: 401 },
  { name: "Anonymous PUT /api/enquiries/123", method: "PUT", path: "/api/enquiries/123", exp: 401 },
  { name: "Anonymous DELETE /api/enquiries/123", method: "DELETE", path: "/api/enquiries/123", exp: 401 },
  { name: "Anonymous PUT /api/global-settings", method: "PUT", path: "/api/global-settings", exp: 401 },

  // D. Public POST to enquiries & career
  { name: "Public POST /api/enquiries (empty validation)", method: "POST", path: "/api/enquiries", body: "{}", exp: 400 },
  { name: "Public POST /api/career/apply (empty validation)", method: "POST", path: "/api/career/apply", body: "{}", exp: 400 },

  // E. Malformed / Invalid / Expired / Revoked Tokens
  { name: "Invalid JWT signature on /api/logs", method: "GET", path: "/api/logs", headers: { "Authorization": `Bearer ${forgedToken}` }, exp: 401 },
  { name: "Expired JWT on /api/logs", method: "GET", path: "/api/logs", headers: { "Authorization": `Bearer ${expiredToken}` }, exp: 401 },
  { name: "Malformed Auth Header (Garbage text)", method: "GET", path: "/api/logs", headers: { "Authorization": "NotABearerToken" }, exp: 401 },
  { name: "Malformed Auth Header (Bearer without token)", method: "GET", path: "/api/logs", headers: { "Authorization": "Bearer " }, exp: 401 },
  { name: "Malformed Auth Header (Basic auth)", method: "GET", path: "/api/logs", headers: { "Authorization": "Basic YWRtaW46cGFzc3dvcmQ=" }, exp: 401 },

  // F. Dashboard Route Protection
  { name: "Anonymous GET /dashboard (Redirect)", method: "GET", path: "/dashboard", redirect: "manual", exp: 307 },
  { name: "Anonymous GET /dashboard/products (Redirect)", method: "GET", path: "/dashboard/products", redirect: "manual", exp: 307 },
];

async function run() {
  console.log("=================================================================");
  console.log("       AUDIT 2: PROXY & HANDLER-LEVEL SECURITY VERIFICATION       ");
  console.log("=================================================================");

  let passed = 0;
  let failed = 0;

  for (const s of scenarios) {
    try {
      const headers = { "Content-Type": "application/json", ...(s.headers || {}) };
      const opts = {
        method: s.method,
        headers,
        redirect: s.redirect || 'follow'
      };
      if (s.body) opts.body = s.body;

      const res = await fetch(`${BASE}${s.path}`, opts);
      const isExpected = res.status === s.exp;

      if (isExpected) {
        console.log(`[PASS] ${s.name} -> HTTP ${res.status} (Expected ${s.exp})`);
        passed++;
      } else {
        console.log(`[FAIL] ${s.name} -> HTTP ${res.status} (Expected ${s.exp})`);
        failed++;
      }
    } catch (err) {
      console.log(`[ERR ] ${s.name} -> ${err.message}`);
      failed++;
    }
  }

  console.log("=================================================================");
  console.log(`TOTAL SCENARIOS: ${scenarios.length}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log("=================================================================");

  if (failed > 0) process.exit(1);
}

run();

