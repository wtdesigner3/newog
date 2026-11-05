/**
 * Product Data Access Service
 * Handles querying, filtering, and fallback resolution for HVAC products.
 * 
 * Conforms to:
 * - FINDING-601-01: Attached Next.js Data Cache tags (TAG_PRODUCTS, TAG_CATALOG)
 * - FINDING-601-02: Scoped strictly to OG Heavy Duty records via dbScope
 * - FINDING-601-03: Differentiates genuinely unseeded DB from draft-only state (never falls back if OG records exist)
 */
import { connectDBSafe } from "../db.js";
import Product from "../../app/models/Product.js";
import { getOGProductFilter } from "../dbScope.js";
import { safeCachedRead } from "../cache/cachedRead.js";
import { TAG_PRODUCTS, TAG_CATALOG } from "../cache/cacheTags.js";
import {
  getAllProducts as getStaticProducts,
  getProductBySlug as getStaticProductBySlug,
  getProductsByCategory as getStaticProductsByCategory,
  getRelatedProducts as getStaticRelatedProducts,
} from "../catalogData.js";

function normalizeProductDoc(doc) {
  if (!doc) return null;
  return {
    _id: doc._id?.toString(),
    id: doc.slug,
    model: doc.model || doc.name,
    name: doc.name,
    series: doc.series || "",
    tagline: doc.tagline || "",
    slug: doc.slug,
    categorySlug: doc.categorySlug || "",
    subcategorySlug: doc.subcategorySlug || "",
    tonnage: doc.tonnage || "",
    starRating: doc.starRating || "",
    technology: doc.technology || "",
    compressor: doc.compressor || "",
    maxAmbient: doc.maxAmbient || "",
    image: doc.image || "",
    detailImage: doc.detailImage || doc.image || "",
    brochureUrl: doc.brochureUrl || "",
    specs: doc.specs || {},
    features: doc.features || [],
    applications: doc.applications || [],
    gallery: doc.gallery || [],
    isFlagship: Boolean(doc.isFlagship),
    status: doc.status || "published",
    isActive: doc.isActive !== false,
    sort: doc.sort || 0,
    metatag: doc.metatag || "",
    metaDescription: doc.metaDescription || "",
    canonicalUrl: doc.canonicalUrl || "",
    ogTitle: doc.ogTitle || "",
    ogDescription: doc.ogDescription || "",
    source: "database",
  };
}

/**
 * Total count of OG products in database regardless of publication status.
 * Used to detect whether the database is seeded or unseeded (FINDING-601-03).
 */
async function getTotalOGProductCount() {
  return await Product.countDocuments(getOGProductFilter());
}

/**
 * Retrieve all published products from the database or static catalog.
 */
async function _getAllProductsRaw() {
  const conn = await connectDBSafe({ silent: true });

  if (conn) {
    try {
      const totalOG = await getTotalOGProductCount();

      if (totalOG > 0) {
        // Database is populated with OG records
        const docs = await Product.find(
          getOGProductFilter({
            status: "published",
            isActive: { $ne: false },
          })
        )
          .sort({ sort: 1, createdAt: 1 })
          .lean();

        // Even if docs.length === 0 (all OG products are draft/archived),
        // we DO NOT fall back to static data because the DB is populated.
        return docs.map(normalizeProductDoc);
      }
    } catch (err) {
      console.warn(`[ProductService] Database read error: ${err.message}. Engaging static fallback.`);
    }
  }

  // Only genuinely unseeded database or offline database engages static fallback
  return getStaticProducts().map((p) => ({ ...p, source: "fallback" }));
}

export const getAllProducts = safeCachedRead(
  _getAllProductsRaw,
  ["all-products"],
  { tags: [TAG_PRODUCTS, TAG_CATALOG], revalidate: 3600 }
);

/**
 * Retrieve a single product by category slug and product slug (or model / direct slug).
 */
async function _getProductBySlugRaw(categorySlug, productSlug) {
  if (!productSlug) return null;

  const conn = await connectDBSafe({ silent: true });

  if (conn) {
    try {
      const query = {
        status: "published",
        isActive: { $ne: false },
        $or: [
          { slug: productSlug },
          { model: productSlug },
          { model: productSlug.toUpperCase() },
        ],
      };

      if (categorySlug && categorySlug !== "all") {
        query.categorySlug = categorySlug;
      }

      const doc = await Product.findOne(getOGProductFilter(query)).lean();

      if (doc) {
        return normalizeProductDoc(doc);
      }

      // Check if DB is seeded with OG products
      const totalOG = await getTotalOGProductCount();
      if (totalOG > 0) {
        // DB is populated; a non-existent or draft product is legitimately 404
        return null;
      }
    } catch (err) {
      console.warn(`[ProductService] DB error looking up product "${productSlug}": ${err.message}`);
    }
  }

  // Fallback to static catalog if DB is down or unseeded
  const staticProduct = getStaticProductBySlug(categorySlug, productSlug);
  return staticProduct ? { ...staticProduct, source: "fallback" } : null;
}

export const getProductBySlug = (categorySlug, productSlug) => {
  const cachedFn = safeCachedRead(
    () => _getProductBySlugRaw(categorySlug, productSlug),
    ["product", categorySlug || "all", productSlug],
    { tags: [TAG_PRODUCTS, TAG_CATALOG], revalidate: 3600 }
  );
  return cachedFn();
};

/**
 * Retrieve all published products within a category.
 */
async function _getProductsByCategoryRaw(categorySlug) {
  if (!categorySlug) return [];

  const conn = await connectDBSafe({ silent: true });

  if (conn) {
    try {
      const totalOG = await getTotalOGProductCount();

      if (totalOG > 0) {
        const docs = await Product.find(
          getOGProductFilter({
            categorySlug,
            status: "published",
            isActive: { $ne: false },
          })
        )
          .sort({ sort: 1, createdAt: 1 })
          .lean();

        return docs.map(normalizeProductDoc);
      }
    } catch (err) {
      console.warn(`[ProductService] DB error for category "${categorySlug}": ${err.message}`);
    }
  }

  return getStaticProductsByCategory(categorySlug).map((p) => ({ ...p, source: "fallback" }));
}

export const getProductsByCategory = (categorySlug) => {
  const cachedFn = safeCachedRead(
    () => _getProductsByCategoryRaw(categorySlug),
    ["products-by-category", categorySlug],
    { tags: [TAG_PRODUCTS, TAG_CATALOG], revalidate: 3600 }
  );
  return cachedFn();
};

/**
 * Retrieve related products within the same category (supplemented with other systems if fewer than limit).
 */
export async function getRelatedProducts(categorySlug, currentProductSlug, limit = 8) {
  const categoryProducts = await getProductsByCategory(categorySlug);
  const sameCategory = categoryProducts.filter(
    (p) => p.slug !== currentProductSlug && p.model !== currentProductSlug
  );

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const allProducts = await getAllProducts();
  const others = allProducts.filter(
    (p) =>
      p.slug !== currentProductSlug &&
      p.model !== currentProductSlug &&
      p.categorySlug !== categorySlug
  );

  return [...sameCategory, ...others].slice(0, limit);
}

/**
 * Retrieve featured/flagship products.
 */
export async function getFeaturedProducts(limit = 6) {
  const all = await getAllProducts();
  const flagshipModels = ["OG-18W5IN", "OG-18S5IN", "OGC-24", "OG-24FCC", "OG-MTB-24C", "OG-SV24"];
  const featured = all.filter((p) => p.isFlagship || flagshipModels.includes(p.model));
  return (featured.length > 0 ? featured : all).slice(0, limit);
}
