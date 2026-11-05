import jwt from 'jsonwebtoken';
import assert from 'assert';

const JWT_SECRET = process.env.JWT_SECRET || "og_heavy_duty_fallback_secret";

/**
 * Simulates requireAuth validation logic from src/app/lib/auth.js
 */
function evaluateAuthToken(token, userDoc) {
  if (!token) {
    return { status: 401, error: "Unauthorized: Please log in." };
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return { status: 401, error: "Unauthorized: Invalid or expired token." };
  }

  if (!userDoc) {
    return { status: 401, error: "Unauthorized: User account no longer exists." };
  }

  if (!userDoc.isActive) {
    return { status: 401, error: "Unauthorized: Account has been disabled." };
  }

  if (userDoc.isLocked && userDoc.lockUntil && userDoc.lockUntil > new Date()) {
    return { status: 403, error: "Account is temporarily locked." };
  }

  const expectedTokenVersion = userDoc.tokenVersion || 0;
  const tokenVersion = decoded.tokenVersion || 0;
  if (tokenVersion !== expectedTokenVersion) {
    return { status: 401, error: "Unauthorized: Session has expired or been revoked." };
  }

  return { status: 200, user: decoded };
}

console.log("=================================================================");
console.log("       AUDIT 4: JWT REVOCATION & PASSWORD LIFECYCLE TESTS        ");
console.log("=================================================================");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.log(`[FAIL] ${name} -> ${err.message}`);
    failed++;
  }
}

// Baseline active user
const baseUser = {
  id: "u123",
  email: "admin@ogheavyduty.in",
  role: "admin",
  isActive: true,
  isLocked: false,
  lockUntil: null,
  tokenVersion: 1
};

// 1. Valid token matching user's current tokenVersion
const validToken = jwt.sign(
  { id: baseUser.id, email: baseUser.email, role: baseUser.role, tokenVersion: 1 },
  JWT_SECRET,
  { expiresIn: '1h' }
);

test("Valid token with matching tokenVersion succeeds", () => {
  const res = evaluateAuthToken(validToken, baseUser);
  assert.strictEqual(res.status, 200);
});

// 2. Token revocation on password change (tokenVersion incremented in DB)
test("Stale token rejected immediately when DB tokenVersion increments", () => {
  const updatedUser = { ...baseUser, tokenVersion: 2 }; // Password change happened
  const res = evaluateAuthToken(validToken, updatedUser);
  assert.strictEqual(res.status, 401);
  assert.ok(res.error.includes("Session has expired or been revoked"));
});

// 3. New token issued after password change succeeds
test("Fresh token with new tokenVersion succeeds", () => {
  const updatedUser = { ...baseUser, tokenVersion: 2 };
  const freshToken = jwt.sign(
    { id: updatedUser.id, email: updatedUser.email, role: updatedUser.role, tokenVersion: 2 },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  const res = evaluateAuthToken(freshToken, updatedUser);
  assert.strictEqual(res.status, 200);
});

// 4. Token rejected when account is deactivated (isActive = false)
test("Active token immediately rejected if account isActive=false", () => {
  const deactivatedUser = { ...baseUser, isActive: false };
  const res = evaluateAuthToken(validToken, deactivatedUser);
  assert.strictEqual(res.status, 401);
  assert.ok(res.error.includes("Account has been disabled"));
});

// 5. Token rejected when account is temporarily locked (brute force lockUntil)
test("Active token blocked with 403 when account is locked", () => {
  const lockedUser = {
    ...baseUser,
    isLocked: true,
    lockUntil: new Date(Date.now() + 15 * 60 * 1000) // locked for 15 mins
  };
  const res = evaluateAuthToken(validToken, lockedUser);
  assert.strictEqual(res.status, 403);
  assert.ok(res.error.includes("Account is temporarily locked"));
});

// 6. Expired token rejected by verifyToken
test("Cryptographically expired token is rejected", () => {
  const expiredToken = jwt.sign(
    { id: baseUser.id, email: baseUser.email, role: baseUser.role, tokenVersion: 1 },
    JWT_SECRET,
    { expiresIn: '-1s' }
  );
  const res = evaluateAuthToken(expiredToken, baseUser);
  assert.strictEqual(res.status, 401);
  assert.ok(res.error.includes("Invalid or expired token"));
});

// 7. Tampered token signature rejected
test("Token with invalid secret signature rejected", () => {
  const forgedToken = jwt.sign(
    { id: baseUser.id, email: baseUser.email, role: baseUser.role, tokenVersion: 1 },
    "wrong_secret",
    { expiresIn: '1h' }
  );
  const res = evaluateAuthToken(forgedToken, baseUser);
  assert.strictEqual(res.status, 401);
});

// 8. Deleted user rejected
test("Token rejected if user document no longer exists in DB", () => {
  const res = evaluateAuthToken(validToken, null);
  assert.strictEqual(res.status, 401);
  assert.ok(res.error.includes("User account no longer exists"));
});

console.log("=================================================================");
console.log(`TOTAL TESTS: ${passed + failed}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log("=================================================================");

if (failed > 0) process.exit(1);

