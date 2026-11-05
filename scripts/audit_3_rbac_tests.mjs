import jwt from 'jsonwebtoken';
import assert from 'assert';

const JWT_SECRET = process.env.JWT_SECRET || "og_heavy_duty_fallback_secret";

// Standalone RBAC test fixture mimicking requirePermission / requireSuperAdmin logic
function evaluateRoleAndPermission(user, module, action) {
  if (!user) {
    return { status: 401, error: "Unauthorized: Please log in." };
  }
  if (!user.isActive) {
    return { status: 401, error: "Unauthorized: Account disabled." };
  }
  if (user.role === 'super_admin') {
    return { status: 200, user };
  }
  const permissions = user.permissions || {};
  const allowed = permissions[module] || [];
  if (!allowed.includes(action)) {
    return {
      status: 403,
      error: `Forbidden: You do not have '${action}' permission on '${module}'.`
    };
  }
  return { status: 200, user };
}

function evaluateSuperAdmin(user) {
  if (!user) {
    return { status: 401, error: "Unauthorized: Please log in." };
  }
  if (!user.isActive) {
    return { status: 401, error: "Unauthorized: Account disabled." };
  }
  if (user.role !== 'super_admin') {
    return { status: 403, error: "Forbidden: Super Admin access required." };
  }
  return { status: 200, user };
}

console.log("=================================================================");
console.log("             AUDIT 3: ROLE & PERMISSION TEST SUITE                ");
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

// Fixtures
const anonymousUser = null;
const ordinaryAdminNoPerms = { id: "1", role: "admin", isActive: true, permissions: {} };
const readOnlyEnquiryAdmin = { id: "2", role: "admin", isActive: true, permissions: { enquiries: ['read'] } };
const updateEnquiryAdmin = { id: "3", role: "admin", isActive: true, permissions: { enquiries: ['read', 'update'] } };
const superAdmin = { id: "4", role: "super_admin", isActive: true, permissions: {} };
const deactivatedAdmin = { id: "5", role: "admin", isActive: false, permissions: { enquiries: ['read', 'update', 'delete'] } };

// Test 1: Anonymous visitor blocked
test("Anonymous visitor rejected on protected action", () => {
  const res = evaluateRoleAndPermission(anonymousUser, 'enquiries', 'read');
  assert.strictEqual(res.status, 401);
});

// Test 2: Ordinary admin blocked from SuperAdmin action
test("Ordinary admin without super_admin role blocked from backup", () => {
  const res = evaluateSuperAdmin(ordinaryAdminNoPerms);
  assert.strictEqual(res.status, 403);
});

// Test 3: Ordinary admin blocked from unassigned module
test("Ordinary admin blocked from enquiries:read", () => {
  const res = evaluateRoleAndPermission(ordinaryAdminNoPerms, 'enquiries', 'read');
  assert.strictEqual(res.status, 403);
});

// Test 4: Read-only admin allowed to read enquiries
test("Read-only admin allowed enquiries:read", () => {
  const res = evaluateRoleAndPermission(readOnlyEnquiryAdmin, 'enquiries', 'read');
  assert.strictEqual(res.status, 200);
});

// Test 5: Read-only admin blocked from updating enquiries
test("Read-only admin blocked from enquiries:update", () => {
  const res = evaluateRoleAndPermission(readOnlyEnquiryAdmin, 'enquiries', 'update');
  assert.strictEqual(res.status, 403);
});

// Test 6: Read-only admin blocked from deleting enquiries
test("Read-only admin blocked from enquiries:delete", () => {
  const res = evaluateRoleAndPermission(readOnlyEnquiryAdmin, 'enquiries', 'delete');
  assert.strictEqual(res.status, 403);
});

// Test 7: Update admin allowed to update enquiries
test("Update admin allowed enquiries:update", () => {
  const res = evaluateRoleAndPermission(updateEnquiryAdmin, 'enquiries', 'update');
  assert.strictEqual(res.status, 200);
});

// Test 8: Update admin blocked from deleting enquiries
test("Update admin blocked from enquiries:delete", () => {
  const res = evaluateRoleAndPermission(updateEnquiryAdmin, 'enquiries', 'delete');
  assert.strictEqual(res.status, 403);
});

// Test 9: SuperAdmin bypasses all module permissions
test("SuperAdmin allowed enquiries:delete without explicit permission array", () => {
  const res = evaluateRoleAndPermission(superAdmin, 'enquiries', 'delete');
  assert.strictEqual(res.status, 200);
});

// Test 10: SuperAdmin allowed database backup
test("SuperAdmin allowed evaluateSuperAdmin", () => {
  const res = evaluateSuperAdmin(superAdmin);
  assert.strictEqual(res.status, 200);
});

// Test 11: Deactivated admin rejected immediately regardless of permissions
test("Deactivated admin rejected with 401 even with full permissions", () => {
  const res = evaluateRoleAndPermission(deactivatedAdmin, 'enquiries', 'read');
  assert.strictEqual(res.status, 401);
});

console.log("=================================================================");
console.log(`TOTAL TESTS: ${passed + failed}`);
console.log(`PASSED: ${passed}`);
console.log(`FAILED: ${failed}`);
console.log("=================================================================");

if (failed > 0) process.exit(1);

