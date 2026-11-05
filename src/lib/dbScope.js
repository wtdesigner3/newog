/**
 * dbScope.js — Centralized Database Tenant & Multi-Brand Scoping
 * 
 * Ensures strict data isolation in shared MongoDB environments (e.g. jindal_admin).
 * Prevents exposing, modifying, overwriting, or deleting unrelated legacy steel records.
 */

export const BRAND_KEY_OG = "og-heavy-duty";

// Verified stable category slugs belonging to OG Heavy Duty
export const OG_CATEGORY_SLUGS = Object.freeze([
  "window-ac",
  "split-ac",
  "cassette-ac",
  "floor-standing-ac",
  "ductable-ac",
  "commercial-range",
]);

// Verified stable product model numbers belonging to OG Heavy Duty
export const OG_PRODUCT_MODELS = Object.freeze([
  "OG-12WA3",
  "OG-18S3FS",
  "OG-18S5IN",
  "OG-18W5IN",
  "OG-19WA5",
  "OG-24FCC",
  "OG-25IN5",
  "OG-48FCC",
  "OG-70OWC",
  "OG-MHC-36C",
  "OG-MTB-24C",
  "OG-SV24",
  "OGC-24",
  "OGC-30",
]);

// Verified stable resource identifiers belonging to OG Heavy Duty
export const OG_RESOURCE_IDS = Object.freeze([
  "catalogue-2026-2027",
  "catalogue-2025-2026",
  "catalogue-2023-2024",
  "manual-window-ac",
  "manual-split-ac",
  "manual-commercial-ac",
  "error-codes-split",
  "error-codes-window",
  "troubleshooting-guide",
  "warranty-terms",
  "og-full-range-catalogue-2026",
  "window-inverter-series-manual-2026",
  "window-fixed-speed-series-manual-2026",
  "split-inverter-series-manual-2026",
  "split-fixed-speed-series-manual-2026",
  "commercial-cassette-ductable-manual-2026",
  "heavy-duty-error-codes-guide-2026",
  "comprehensive-warranty-terms-2026",
  "monsoon-comfort-operating-guide-2026",
  "legacy-window-compact-series-manual-2024",
]);

/**
 * Returns a Mongoose query condition scoping products strictly to OG Heavy Duty.
 */
export function getOGProductFilter(extra = {}) {
  const ogDiscriminator = {
    $or: [
      { brandKey: BRAND_KEY_OG },
      { model: { $regex: /^OG/i } },
      { slug: { $regex: /^og-/i } },
    ],
  };

  if (Object.keys(extra).length === 0) {
    return ogDiscriminator;
  }

  return {
    $and: [ogDiscriminator, extra],
  };
}

/**
 * Returns a Mongoose query condition scoping categories strictly to OG Heavy Duty.
 */
export function getOGCategoryFilter(extra = {}) {
  const ogDiscriminator = {
    $or: [
      { brandKey: BRAND_KEY_OG },
      { slug: { $in: OG_CATEGORY_SLUGS } },
    ],
  };

  if (Object.keys(extra).length === 0) {
    return ogDiscriminator;
  }

  return {
    $and: [ogDiscriminator, extra],
  };
}

/**
 * Returns a Mongoose query condition scoping resources strictly to OG Heavy Duty.
 */
export function getOGResourceFilter(extra = {}) {
  const ogDiscriminator = {
    $or: [
      { brandKey: BRAND_KEY_OG },
      { id: { $in: OG_RESOURCE_IDS } },
    ],
  };

  if (Object.keys(extra).length === 0) {
    return ogDiscriminator;
  }

  return {
    $and: [ogDiscriminator, extra],
  };
}

/**
 * Returns a Mongoose query condition scoping blogs strictly to OG Heavy Duty.
 * Since the shared database contains legacy steel blogs, all OG blogs must have brandKey.
 */
export function getOGBlogFilter(extra = {}) {
  const ogDiscriminator = {
    brandKey: BRAND_KEY_OG,
  };

  if (Object.keys(extra).length === 0) {
    return ogDiscriminator;
  }

  return {
    $and: [ogDiscriminator, extra],
  };
}

/**
 * Asserts whether a given document is a verified OG Heavy Duty record.
 */
export function isOGProduct(doc) {
  if (!doc) return false;
  if (doc.brandKey === BRAND_KEY_OG) return true;
  if (typeof doc.model === "string" && /^OG/i.test(doc.model)) return true;
  if (typeof doc.slug === "string" && /^og-/i.test(doc.slug)) return true;
  return false;
}

export function isOGCategory(doc) {
  if (!doc) return false;
  if (doc.brandKey === BRAND_KEY_OG) return true;
  if (typeof doc.slug === "string" && OG_CATEGORY_SLUGS.includes(doc.slug)) return true;
  return false;
}

export function isOGResource(doc) {
  if (!doc) return false;
  if (doc.brandKey === BRAND_KEY_OG) return true;
  if (typeof doc.id === "string" && OG_RESOURCE_IDS.includes(doc.id)) return true;
  return false;
}

export function isOGBlog(doc) {
  if (!doc) return false;
  return doc.brandKey === BRAND_KEY_OG;
}

