#!/usr/bin/env node
/**
 * Safe, Idempotent Catalog Import CLI
 * 
 * Imports verified OG Heavy Duty HVAC categories, products, and technical resources into MongoDB.
 * 
 * Safety Features:
 * - Defaults to --dry-run unless --execute is explicitly specified.
 * - Non-destructive: preserves existing database records (including legacy collections).
 * - Matches records by unique slug / model / id.
 * - Does not overwrite existing admin modifications unless --force is specified.
 * - Masks credentials in all console diagnostics.
 * 
 * Usage:
 *   node scripts/import_catalog.mjs [--dry-run]
 *   node scripts/import_catalog.mjs --execute
 *   node scripts/import_catalog.mjs --execute --force
 */

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables (.env.local first, fallback to .env)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(projectRoot, ".env.local") });
dotenv.config({ path: path.join(projectRoot, ".env") });

// Parse CLI flags
const args = process.argv.slice(2);
const isExecute = args.includes("--execute");
const isForce = args.includes("--force");
const isConfirmed = args.includes("--confirm-live-import");
const targetDbArg = args.find((a) => a.startsWith("--target-db="))?.split("=")[1];
const allowOverwrite = args.includes("--allow-destructive-overwrite");
const isDryRun = !isExecute || args.includes("--dry-run");
const uriArg = args.find((a) => a.startsWith("--uri="))?.split("=")[1];
const useAtlas = args.includes("--atlas");

if (useAtlas) {
  console.error("ERROR: --atlas flag is disabled. Please provide explicit --uri=<dedicated_og_uri>");
  process.exit(1);
} else if (uriArg) {
  process.env.MONGODB_URI = uriArg;
}

// Safety check: Prevent accidental remote cluster execution (FINDING-601-04)
if (isExecute && !isDryRun) {
  const currentUri = process.env.MONGODB_URI || "";
  const isRemote = currentUri.includes("mongodb.net") || !currentUri.includes("127.0.0.1") && !currentUri.includes("localhost");
  
  if (isRemote) {
    console.error("\n" + "!".repeat(70));
    console.error("CRITICAL REMOTE CLUSTER SAFETY INTERCEPT (FINDING-601-04)");
    console.error("You are attempting live database execution against a REMOTE cluster.");
    console.error("To proceed, you must supply BOTH of the following explicit safety flags:");
    console.error("  1. --confirm-live-import");
    console.error("  2. --target-db=<exact_database_name>");
    if (isForce && !allowOverwrite) {
      console.error("  3. --allow-destructive-overwrite (required when using --force)");
    }
    console.error("!".repeat(70) + "\n");
    
    if (!isConfirmed || !targetDbArg) {
      console.error("ABORTED: Live write cancelled due to missing remote confirmation flags.");
      process.exit(1);
    }
  }

  if (isForce && !allowOverwrite) {
    console.error("ABORTED: --force requires --allow-destructive-overwrite to prevent accidental data loss.");
    process.exit(1);
  }
}

// Import data sources
import { VERIFIED_CATEGORIES, VERIFIED_PRODUCTS } from "../src/lib/catalogData.js";
import { TECHNICAL_RESOURCES, RESOURCE_CATEGORIES } from "../src/lib/resourcesData.js";

// Import Mongoose Models
import Category from "../src/app/models/Category.js";
import Product from "../src/app/models/Product.js";
import Resource from "../src/app/models/Resource.js";
import { connectDB, getMaskedURI, getDBStatus } from "../src/app/lib/config.js";

console.log("=".repeat(70));
console.log(`OG HEAVY DUTY — CATALOG IMPORT CLI`);
console.log(`MODE: ${isDryRun ? "DRY-RUN (SIMULATION ONLY — ZERO WRITES)" : "EXECUTE (LIVE DATABASE PERSISTENCE)"}`);
if (isForce) console.log(`FLAG: --force (OVERWRITE EXISTING OG RECORDS ENABLED)`);
console.log("=".repeat(70));

async function run() {
  try {
    console.log(`Connecting to MongoDB...`);
    await connectDB();
    const dbStatus = getDBStatus();
    console.log(`Connected to: ${dbStatus.maskedUri}`);
    console.log(`Database Name: ${mongoose.connection.name}`);
    console.log(`-`.repeat(70));

    // ─── 1. IMPORT CATEGORIES ───────────────────────────────────────────────
    console.log(`\n[STEP 1/3] Processing Categories (${VERIFIED_CATEGORIES.length} verified categories)...`);
    const categoryStats = { new: 0, existing: 0, updated: 0, skipped: 0 };
    const categoryIdMap = new Map(); // slug -> _id

    for (const cat of VERIFIED_CATEGORIES) {
      const existing = await Category.findOne({ slug: cat.slug });

      if (!existing) {
        categoryStats.new++;
        console.log(`  + [NEW] Category: "${cat.name}" (${cat.slug})`);
        if (!isDryRun) {
          const newDoc = await Category.create({
            name: cat.name,
            slug: cat.slug,
            shortName: cat.shortName || cat.name,
            series: cat.series || "",
            badge: cat.badge || "",
            tagline: cat.tagline || "",
            description: cat.description || "",
            image: cat.image || "",
            bannerImage: cat.bannerImage || "",
            isGif: Boolean(cat.isGif),
            tonnageRange: cat.tonnageRange || "",
            subcategories: cat.subcategories || [],
            features: cat.features || [],
            status: "published",
            isActive: true,
          });
          categoryIdMap.set(cat.slug, newDoc._id);
        }
      } else {
        categoryIdMap.set(cat.slug, existing._id);
        if (isForce && !isDryRun) {
          categoryStats.updated++;
          console.log(`  ~ [UPDATE/FORCE] Category: "${cat.name}" (${cat.slug})`);
          await Category.updateOne(
            { _id: existing._id },
            {
              $set: {
                name: cat.name,
                shortName: cat.shortName || cat.name,
                series: cat.series || "",
                badge: cat.badge || "",
                tagline: cat.tagline || "",
                description: cat.description || "",
                image: cat.image || "",
                bannerImage: cat.bannerImage || "",
                isGif: Boolean(cat.isGif),
                tonnageRange: cat.tonnageRange || "",
                subcategories: cat.subcategories || [],
                features: cat.features || [],
                status: "published",
                isActive: true,
              },
            }
          );
        } else {
          categoryStats.existing++;
          categoryStats.skipped++;
          console.log(`  = [EXISTS] Category: "${cat.name}" (${cat.slug}) - preserved without changes`);
        }
      }
    }

    // ─── 2. IMPORT PRODUCTS ─────────────────────────────────────────────────
    console.log(`\n[STEP 2/3] Processing Products (${VERIFIED_PRODUCTS.length} verified products)...`);
    const productStats = { new: 0, existing: 0, updated: 0, skipped: 0 };

    for (const prod of VERIFIED_PRODUCTS) {
      const existing = await Product.findOne({
        $or: [{ slug: prod.slug }, { model: prod.model }],
      });

      const categoryId = categoryIdMap.get(prod.categorySlug) || null;

      if (!existing) {
        productStats.new++;
        console.log(`  + [NEW] Product: [${prod.model}] "${prod.name}" (${prod.slug})`);
        if (!isDryRun) {
          await Product.create({
            name: prod.name,
            slug: prod.slug,
            model: prod.model,
            modelNumber: prod.model,
            series: prod.series || "",
            tagline: prod.tagline || "",
            categorySlug: prod.categorySlug,
            category: categoryId,
            subcategorySlug: prod.subcategorySlug || "",
            tonnage: prod.tonnage || "",
            starRating: prod.starRating || "",
            technology: prod.technology || "",
            compressor: prod.compressor || "",
            maxAmbient: prod.maxAmbient || "",
            image: prod.image || "",
            detailImage: prod.detailImage || prod.image || "",
            brochureUrl: prod.brochureUrl || "",
            specs: prod.specs || {},
            features: prod.features || [],
            applications: prod.applications || [],
            gallery: prod.gallery || [],
            isFlagship: Boolean(prod.isFlagship),
            status: "published",
            isActive: true,
          });
        }
      } else {
        if (isForce && !isDryRun) {
          productStats.updated++;
          console.log(`  ~ [UPDATE/FORCE] Product: [${prod.model}] "${prod.name}" (${prod.slug})`);
          await Product.updateOne(
            { _id: existing._id },
            {
              $set: {
                name: prod.name,
                model: prod.model,
                modelNumber: prod.model,
                series: prod.series || "",
                tagline: prod.tagline || "",
                categorySlug: prod.categorySlug,
                category: categoryId || existing.category,
                subcategorySlug: prod.subcategorySlug || "",
                tonnage: prod.tonnage || "",
                starRating: prod.starRating || "",
                technology: prod.technology || "",
                compressor: prod.compressor || "",
                maxAmbient: prod.maxAmbient || "",
                image: prod.image || "",
                detailImage: prod.detailImage || prod.image || "",
                brochureUrl: prod.brochureUrl || "",
                specs: prod.specs || {},
                features: prod.features || [],
                applications: prod.applications || [],
                gallery: prod.gallery || [],
                isFlagship: Boolean(prod.isFlagship),
                status: "published",
                isActive: true,
              },
            }
          );
        } else {
          productStats.existing++;
          productStats.skipped++;
          console.log(`  = [EXISTS] Product: [${prod.model}] "${prod.name}" (${prod.slug}) - preserved`);
        }
      }
    }

    // ─── 3. IMPORT TECHNICAL RESOURCES ──────────────────────────────────────
    console.log(`\n[STEP 3/3] Processing Resources (${TECHNICAL_RESOURCES.length} technical documents)...`);
    const resourceStats = { new: 0, existing: 0, updated: 0, skipped: 0 };

    for (const res of TECHNICAL_RESOURCES) {
      const existing = await Resource.findOne({ id: res.id });

      if (!existing) {
        resourceStats.new++;
        console.log(`  + [NEW] Resource: "${res.title}" (${res.id}) [${res.fileSize}]`);
        if (!isDryRun) {
          await Resource.create({
            id: res.id,
            title: res.title,
            category: res.category,
            categoryName: res.categoryName || "",
            description: res.description || "",
            applicableProducts: res.applicableProducts || "",
            applicableCategorySlug: res.applicableCategorySlug || "all",
            applicableModels: res.applicableModels || [],
            filePath: res.filePath,
            legacyPaths: res.legacyPaths || [],
            fileType: res.fileType || "PDF",
            fileSize: res.fileSize || "",
            pageCount: res.pageCount || 0,
            edition: res.edition || "",
            verified: Boolean(res.verified),
            status: "published",
            isActive: true,
          });
        }
      } else {
        if (isForce && !isDryRun) {
          resourceStats.updated++;
          console.log(`  ~ [UPDATE/FORCE] Resource: "${res.title}" (${res.id})`);
          await Resource.updateOne(
            { _id: existing._id },
            {
              $set: {
                title: res.title,
                category: res.category,
                categoryName: res.categoryName || "",
                description: res.description || "",
                applicableProducts: res.applicableProducts || "",
                applicableCategorySlug: res.applicableCategorySlug || "all",
                applicableModels: res.applicableModels || [],
                filePath: res.filePath,
                legacyPaths: res.legacyPaths || [],
                fileType: res.fileType || "PDF",
                fileSize: res.fileSize || "",
                pageCount: res.pageCount || 0,
                edition: res.edition || "",
                verified: Boolean(res.verified),
                status: "published",
                isActive: true,
              },
            }
          );
        } else {
          resourceStats.existing++;
          resourceStats.skipped++;
          console.log(`  = [EXISTS] Resource: "${res.title}" (${res.id}) - preserved`);
        }
      }
    }

    // ─── FINAL SUMMARY ──────────────────────────────────────────────────────
    console.log("\n" + "=".repeat(70));
    console.log("IMPORT EXECUTION SUMMARY");
    console.log("=".repeat(70));
    console.log(`Database:     ${mongoose.connection.name} @ ${dbStatus.maskedUri}`);
    console.log(`Mode:         ${isDryRun ? "DRY-RUN (Simulated — 0 database mutations)" : "EXECUTE (Committed to MongoDB)"}`);
    console.log(`Categories:   ${categoryStats.new} new, ${categoryStats.existing} existing (${categoryStats.updated} updated, ${categoryStats.skipped} skipped)`);
    console.log(`Products:     ${productStats.new} new, ${productStats.existing} existing (${productStats.updated} updated, ${productStats.skipped} skipped)`);
    console.log(`Resources:    ${resourceStats.new} new, ${resourceStats.existing} existing (${resourceStats.updated} updated, ${resourceStats.skipped} skipped)`);
    console.log("=".repeat(70));

    if (isDryRun) {
      console.log("\nTo apply these changes to the live database, run:");
      console.log("  node scripts/import_catalog.mjs --execute\n");
    } else {
      console.log("\n[SUCCESS] Catalog import successfully executed and committed.\n");
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("\n[ERROR] Catalog import failed:", err.message);
    try {
      await mongoose.disconnect();
    } catch (e) {}
    process.exit(1);
  }
}

run();
