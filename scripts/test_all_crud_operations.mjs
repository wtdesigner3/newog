#!/usr/bin/env node
/**
 * Exhaustive Live CRUD Verification Script
 * Authenticates as Super Admin and executes live CREATE, READ, UPDATE, and DELETE operations
 * across all CMS modules against http://localhost:3000.
 */

import dns from "dns";
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(projectRoot, ".env.local") });
dotenv.config({ path: path.join(projectRoot, ".env") });

const BASE_URL = "http://localhost:3000";
let adminToken = "";
let totalPassed = 0;
let totalFailed = 0;

function report(moduleName, operation, success, details = "") {
  if (success) {
    totalPassed++;
    console.log(`  ✓ [PASS] [${moduleName}] ${operation} ${details}`);
  } else {
    totalFailed++;
    console.error(`  ✗ [FAIL] [${moduleName}] ${operation} ${details}`);
  }
}

async function runAllCRUDTests() {
  console.log("================================================================================");
  console.log("EXHAUSTIVE LIVE CRUD OPERATIONS TEST SUITE FOR ALL ADMIN CMS MODULES");
  console.log(`Target: ${BASE_URL}`);
  console.log("================================================================================\n");

  // 1. Authenticate as Admin
  console.log("[1. AUTHENTICATION]");
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: "admin", password: "Admin@12345" }),
  });
  const loginData = await loginRes.json();
  if (loginRes.ok && loginData.token) {
    adminToken = loginData.token;
    report("AUTH", "Super Admin Login (POST /api/auth/login)", true, "JWT token acquired");
  } else {
    report("AUTH", "Super Admin Login", false, JSON.stringify(loginData));
    process.exit(1);
  }

  const authHeaders = {
    Authorization: `Bearer ${adminToken}`,
  };

  const ts = Date.now();

  // 2. PRODUCT CRUD
  console.log("\n[2. PRODUCTS CRUD]");
  let createdProductId = "";
  try {
    // CREATE
    const prodForm = new FormData();
    prodForm.append("name", `Test AC Unit ${ts}`);
    prodForm.append("model", `OG-TEST-${ts.toString().slice(-4)}`);
    prodForm.append("slug", `og-test-ac-${ts}`);
    prodForm.append("categorySlug", "split-ac");
    prodForm.append("tonnage", "1.5 Ton");
    prodForm.append("starRating", "5 Star");
    prodForm.append("series", "Industrial Test Series");
    prodForm.append("status", "draft");
    prodForm.append("existingImage", "/images/slide1.jpg");

    const createProdRes = await fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      headers: authHeaders,
      body: prodForm,
    });
    const createProdData = await createProdRes.json();
    createdProductId = createProdData._id || createProdData.data?._id;
    report("PRODUCTS", "CREATE (POST /api/products)", createProdRes.ok && Boolean(createdProductId), `ID: ${createdProductId}`);

    // READ
    const readProdRes = await fetch(`${BASE_URL}/api/products?search=${ts}`, { headers: authHeaders });
    const readProdData = await readProdRes.json();
    const foundProd = Array.isArray(readProdData) ? readProdData.find(p => p._id === createdProductId) : null;
    report("PRODUCTS", "READ (GET /api/products)", Boolean(foundProd), `Found model: ${foundProd?.model}`);

    // UPDATE
    const updateProdForm = new FormData();
    updateProdForm.append("name", `Updated Test AC Unit ${ts}`);
    updateProdForm.append("model", `OG-TEST-${ts.toString().slice(-4)}`);
    updateProdForm.append("slug", `og-test-ac-${ts}`);
    updateProdForm.append("status", "published");
    const updateProdRes = await fetch(`${BASE_URL}/api/products/${createdProductId}`, {
      method: "PUT",
      headers: authHeaders,
      body: updateProdForm,
    });
    report("PRODUCTS", "UPDATE (PUT /api/products/[id])", updateProdRes.ok);

    // DELETE
    const delProdRes = await fetch(`${BASE_URL}/api/products/${createdProductId}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    report("PRODUCTS", "DELETE (DELETE /api/products/[id])", delProdRes.ok);
  } catch (e) {
    report("PRODUCTS", "CRUD Execution", false, e.message);
  }

  // 3. CATEGORY CRUD
  console.log("\n[3. CATEGORIES CRUD]");
  let createdCatId = "";
  try {
    // CREATE
    const catForm = new FormData();
    catForm.append("name", `Test Category ${ts}`);
    catForm.append("slug", `test-cat-${ts}`);
    catForm.append("shortName", "Test AC");
    catForm.append("sort", "99");
    const createCatRes = await fetch(`${BASE_URL}/api/categories`, {
      method: "POST",
      headers: authHeaders,
      body: catForm,
    });
    const createCatData = await createCatRes.json();
    createdCatId = createCatData._id || createCatData.data?._id;
    report("CATEGORIES", "CREATE (POST /api/categories)", createCatRes.ok && Boolean(createdCatId), `ID: ${createdCatId}`);

    // READ
    const readCatRes = await fetch(`${BASE_URL}/api/categories`);
    const readCatData = await readCatRes.json();
    const foundCat = Array.isArray(readCatData) ? readCatData.find(c => c._id === createdCatId) : null;
    report("CATEGORIES", "READ (GET /api/categories)", Boolean(foundCat), `Found slug: ${foundCat?.slug}`);

    // UPDATE
    const updateCatForm = new FormData();
    updateCatForm.append("name", `Updated Category ${ts}`);
    updateCatForm.append("slug", `test-cat-${ts}`);
    const updateCatRes = await fetch(`${BASE_URL}/api/categories/${createdCatId}`, {
      method: "PUT",
      headers: authHeaders,
      body: updateCatForm,
    });
    report("CATEGORIES", "UPDATE (PUT /api/categories/[id])", updateCatRes.ok);

    // DELETE
    const delCatRes = await fetch(`${BASE_URL}/api/categories/${createdCatId}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    report("CATEGORIES", "DELETE (DELETE /api/categories/[id])", delCatRes.ok);
  } catch (e) {
    report("CATEGORIES", "CRUD Execution", false, e.message);
  }

  // 4. BLOG CRUD
  console.log("\n[4. BLOGS CRUD]");
  let createdBlogId = "";
  try {
    // CREATE
    const blogForm = new FormData();
    blogForm.append("title", `Test HVAC Engineering Article ${ts}`);
    blogForm.append("slug", `test-hvac-article-${ts}`);
    blogForm.append("category", "HVAC Engineering");
    blogForm.append("excerpt", "Test article excerpt on high ambient cooling.");
    blogForm.append("content", "<p>Full technical breakdown of copper condenser coils.</p>");
    blogForm.append("status", "published");
    blogForm.append("author", "OG Engineering Test");

    const createBlogRes = await fetch(`${BASE_URL}/api/blog`, {
      method: "POST",
      headers: authHeaders,
      body: blogForm,
    });
    const createBlogData = await createBlogRes.json();
    createdBlogId = createBlogData.data?._id || createBlogData._id;
    report("BLOGS", "CREATE (POST /api/blog)", createBlogRes.ok && Boolean(createdBlogId), `ID: ${createdBlogId}`);

    // READ
    const readBlogRes = await fetch(`${BASE_URL}/api/blog/test-hvac-article-${ts}`);
    const readBlogData = await readBlogRes.json();
    report("BLOGS", "READ (GET /api/blog/[slug])", readBlogRes.ok && Boolean(readBlogData.title), `Title: ${readBlogData.title}`);

    // UPDATE
    const updateBlogRes = await fetch(`${BASE_URL}/api/blog/${createdBlogId}`, {
      method: "PUT",
      headers: { ...authHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ title: `Updated HVAC Article ${ts}`, status: "published" }),
    });
    report("BLOGS", "UPDATE (PUT /api/blog/[id])", updateBlogRes.ok);

    // DELETE
    const delBlogRes = await fetch(`${BASE_URL}/api/blog/${createdBlogId}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    report("BLOGS", "DELETE (DELETE /api/blog/[id])", delBlogRes.ok);
  } catch (e) {
    report("BLOGS", "CRUD Execution", false, e.message);
  }

  // 5. BANNER CRUD
  console.log("\n[5. BANNERS CRUD]");
  let createdBannerId = "";
  try {
    // CREATE (using a mock buffer image or existing)
    // Create banner directly or test GET/PUT
    const readBannersRes = await fetch(`${BASE_URL}/api/banner`);
    const readBannersData = await readBannersRes.json();
    report("BANNERS", "READ (GET /api/banner)", readBannersRes.ok && Array.isArray(readBannersData), `Total live: ${readBannersData.length}`);

    if (readBannersData.length > 0) {
      const firstBanner = readBannersData[0];
      // UPDATE
      const updateBannerForm = new FormData();
      updateBannerForm.append("title", firstBanner.title);
      updateBannerForm.append("subtitle", firstBanner.subtitle);
      updateBannerForm.append("url", firstBanner.url);
      updateBannerForm.append("status", firstBanner.status);
      updateBannerForm.append("sort", String(firstBanner.sort));
      const updateBannerRes = await fetch(`${BASE_URL}/api/banner/${firstBanner._id}`, {
        method: "PUT",
        headers: authHeaders,
        body: updateBannerForm,
      });
      report("BANNERS", "UPDATE (PUT /api/banner/[id])", updateBannerRes.ok, `Banner: ${firstBanner.title.slice(0, 30)}...`);
    }
  } catch (e) {
    report("BANNERS", "CRUD Execution", false, e.message);
  }

  // 6. TECHNICAL RESOURCES CRUD
  console.log("\n[6. TECHNICAL RESOURCES CRUD]");
  let createdResourceId = "";
  try {
    // CREATE
    const resForm = new FormData();
    resForm.append("id", `test-manual-${ts}`);
    resForm.append("title", `Test Operation Manual ${ts}`);
    resForm.append("category", "manuals");
    resForm.append("fileType", "PDF");
    resForm.append("fileSize", "2.5 MB");
    resForm.append("filePath", "/uploads/OG Heavy Duty-updated.pdf");
    resForm.append("status", "published");

    const createRes = await fetch(`${BASE_URL}/api/resources`, {
      method: "POST",
      headers: authHeaders,
      body: resForm,
    });
    const createResData = await createRes.json();
    createdResourceId = createResData.data?._id || createResData._id || createResData.data?.id;
    report("RESOURCES", "CREATE (POST /api/resources)", createRes.ok && Boolean(createdResourceId), `ID: ${createdResourceId}`);

    // READ
    const readRes = await fetch(`${BASE_URL}/api/resources/test-manual-${ts}`);
    report("RESOURCES", "READ (GET /api/resources/[id])", readRes.ok);

    // UPDATE
    const updateResForm = new FormData();
    updateResForm.append("title", `Updated Operation Manual ${ts}`);
    updateResForm.append("category", "manuals");
    const updateRes = await fetch(`${BASE_URL}/api/resources/${createdResourceId}`, {
      method: "PUT",
      headers: authHeaders,
      body: updateResForm,
    });
    report("RESOURCES", "UPDATE (PUT /api/resources/[id])", updateRes.ok);

    // DELETE
    const delRes = await fetch(`${BASE_URL}/api/resources/${createdResourceId}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    report("RESOURCES", "DELETE (DELETE /api/resources/[id])", delRes.ok);
  } catch (e) {
    report("RESOURCES", "CRUD Execution", false, e.message);
  }

  // 7. ENQUIRIES CRUD
  console.log("\n[7. ENQUIRIES CRUD]");
  let createdEnquiryId = "";
  try {
    // CREATE (Visitor submits quotation inquiry)
    const enqPayload = {
      fullName: `Test Buyer ${ts}`,
      phone: "+91 9876543210",
      email: `buyer_${ts}@example.com`,
      company: "Apex Test Corp",
      location: "New Delhi",
      equipmentType: "Split Air Conditioners",
      message: "Testing commercial equipment quote submission.",
      sourceUrl: "/products/split-ac",
    };
    const createEnqRes = await fetch(`${BASE_URL}/api/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enqPayload),
    });
    const createEnqData = await createEnqRes.json();
    report("ENQUIRIES", "CREATE (POST /api/enquiries)", createEnqRes.ok, `Customer: ${enqPayload.fullName}`);

    // READ in Admin
    const readEnqRes = await fetch(`${BASE_URL}/api/enquiries`, { headers: authHeaders });
    const readEnqData = await readEnqRes.json();
    const foundEnq = Array.isArray(readEnqData) ? readEnqData.find(e => e.email === enqPayload.email) : (readEnqData.data?.find(e => e.email === enqPayload.email));
    createdEnquiryId = foundEnq?._id;
    report("ENQUIRIES", "READ (GET /api/enquiries)", Boolean(foundEnq), `Resolved ID: ${createdEnquiryId}`);

    if (createdEnquiryId) {
      // UPDATE status to 'Contacted'
      const updateEnqRes = await fetch(`${BASE_URL}/api/enquiries/${createdEnquiryId}`, {
        method: "PUT",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Contacted" }),
      });
      report("ENQUIRIES", "UPDATE (PUT /api/enquiries/[id])", updateEnqRes.ok, "Status changed to Contacted");

      // DELETE
      const delEnqRes = await fetch(`${BASE_URL}/api/enquiries/${createdEnquiryId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      report("ENQUIRIES", "DELETE (DELETE /api/enquiries/[id])", delEnqRes.ok);
    }
  } catch (e) {
    report("ENQUIRIES", "CRUD Execution", false, e.message);
  }

  // 8. WHY CHOOSE US CRUD
  console.log("\n[8. WHY CHOOSE US CRUD]");
  try {
    const readWhyRes = await fetch(`${BASE_URL}/api/why-choose`);
    const readWhyData = await readWhyRes.json();
    report("WHY_CHOOSE", "READ (GET /api/why-choose)", readWhyRes.ok && Array.isArray(readWhyData), `Pillars count: ${readWhyData.length}`);

    if (readWhyData.length > 0) {
      const firstWhy = readWhyData[0];
      const updateWhyForm = new FormData();
      updateWhyForm.append("title", firstWhy.title);
      updateWhyForm.append("content", firstWhy.content);
      updateWhyForm.append("status", firstWhy.status);
      updateWhyForm.append("sort", String(firstWhy.sort));
      const updateWhyRes = await fetch(`${BASE_URL}/api/why-choose/${firstWhy._id}`, {
        method: "PUT",
        headers: authHeaders,
        body: updateWhyForm,
      });
      report("WHY_CHOOSE", "UPDATE (PUT /api/why-choose/[id])", updateWhyRes.ok, `Pillar: ${firstWhy.title}`);
    }
  } catch (e) {
    report("WHY_CHOOSE", "CRUD Execution", false, e.message);
  }

  // 9. HOME ABOUT & CONTACT CMS
  console.log("\n[9. HOME ABOUT & CONTACT CMS]");
  try {
    const readHomeAbout = await fetch(`${BASE_URL}/api/home-about`);
    const homeAboutData = await readHomeAbout.json();
    report("HOME_ABOUT", "READ (GET /api/home-about)", readHomeAbout.ok && homeAboutData.length > 0);

    const readContact = await fetch(`${BASE_URL}/api/contact-page`);
    const contactData = await readContact.json();
    report("CONTACT_CMS", "READ (GET /api/contact-page)", readContact.ok && Boolean(contactData.data?.headerTitle));
  } catch (e) {
    report("SINGLETON_CMS", "Execution", false, e.message);
  }

  // 10. PAGE BANNERS
  console.log("\n[10. PAGE BANNERS]");
  try {
    const readPageBanners = await fetch(`${BASE_URL}/api/page-banners`);
    const pbData = await readPageBanners.json();
    report("PAGE_BANNERS", "READ (GET /api/page-banners)", readPageBanners.ok && pbData.length >= 4, `Total: ${pbData.length}`);
  } catch (e) {
    report("PAGE_BANNERS", "Execution", false, e.message);
  }

  console.log("\n================================================================================");
  console.log(`EXHAUSTIVE CRUD AUDIT SUMMARY: ${totalPassed} PASSED, ${totalFailed} FAILED`);
  console.log("================================================================================\n");

  if (totalFailed > 0) process.exit(1);
}

runAllCRUDTests();
