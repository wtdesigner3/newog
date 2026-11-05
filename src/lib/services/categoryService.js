/**
 * Category Data Access Service
 * Handles querying, filtering, and fallback resolution for HVAC product categories.
 * 
 * Conforms to:
 * - FINDING-601-01: Attached Next.js Data Cache tags (TAG_CATEGORIES, TAG_CATALOG)
 * - FINDING-601-02: Scoped strictly to OG Heavy Duty records via dbScope
 * - FINDING-601-03: Differentiates genuinely unseeded DB from draft-only state (never falls back if OG records exist)
 */
import { connectDBSafe } from "../db.js";
import Category from "../../app/models/Category.js";
import Product from "../../app/models/Product.js";
import { getOGCategoryFilter, getOGProductFilter } from "../dbScope.js";
import { safeCachedRead } from "../cache/cachedRead.js";
import { TAG_CATEGORIES, TAG_CATALOG } from "../cache/cacheTags.js";
import {
  getCategories as getStaticCategories,
  getCategoryBySlug as getStaticCategoryBySlug,
  getProductsByCategory as getStaticProductsByCategory,
} from "../catalogData.js";

function normalizeCategoryDoc(doc, products = [], requestedSlug = null) {
  if (!doc) return null;
  const canonicalSlug = doc.slug;
  const isAlias = Boolean(requestedSlug && requestedSlug !== canonicalSlug);
  return {
    _id: doc._id?.toString(),
    id: doc.slug,
    name: doc.name,
    shortName: doc.shortName || doc.name,
    slug: doc.slug,
    canonicalSlug,
    isAlias,
    previousSlugs: doc.previousSlugs || [],
    series: doc.series || "",
    badge: doc.badge || "",
    tagline: doc.tagline || "",
    description: doc.description || "",
    image: doc.image || "",
    bannerImage: doc.bannerImage || doc.image || "",
    isGif: Boolean(doc.isGif),
    tonnageRange: doc.tonnageRange || "",
    subcategories: doc.subcategories || [],
    features: doc.features || [],
    sort: doc.sort || 0,
    status: doc.status || "published",
    isActive: doc.isActive !== false,
    metatag: doc.metatag || "",
    metaDescription: doc.metaDescription || "",
    canonicalUrl: doc.canonicalUrl || "",
    ogTitle: doc.ogTitle || "",
    ogDescription: doc.ogDescription || "",
    products: products,
    productCount: products.length,
    source: "database",
  };
}

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
 * Total count of OG categories in database regardless of publication status.
 */
async function getTotalOGCategoryCount() {
  return await Category.countDocuments(getOGCategoryFilter());
}

/**
 * Get all published HVAC categories.
 */
async function _getCategoriesRaw() {
  const conn = await connectDBSafe({ silent: true });

  if (conn) {
    try {
      const totalOG = await getTotalOGCategoryCount();

      if (totalOG > 0) {
        const docs = await Category.find(
          getOGCategoryFilter({
            status: "published",
            isActive: { $ne: false },
          })
        )
          .sort({ sort: 1, createdAt: 1 })
          .lean();

        // Even if docs.length === 0 (all categories are draft/archived),
        // do not fall back to static data if database is populated.
        return docs.map((doc) => normalizeCategoryDoc(doc, []));
      }
    } catch (err) {
      console.warn(`[CategoryService] Database read error: ${err.message}. Engaging static fallback.`);
    }
  }

  // Fallback to verified static catalog only if unseeded or DB offline
  return getStaticCategories().map((c) => ({ ...c, source: "fallback" }));
}

export const getCategories = safeCachedRead(
  _getCategoriesRaw,
  ["all-categories"],
  { tags: [TAG_CATEGORIES, TAG_CATALOG], revalidate: 3600 }
);

/**
 * Get a specific category by slug with its associated products.
 */
async function _getCategoryBySlugRaw(slug) {
  if (!slug) return null;

  const conn = await connectDBSafe({ silent: true });

  if (conn) {
    try {
      const doc = await Category.findOne(
        getOGCategoryFilter({
          $or: [{ slug }, { previousSlugs: slug }],
          status: "published",
          isActive: { $ne: false },
        })
      ).lean();

      if (doc) {
        const productDocs = await Product.find(
          getOGProductFilter({
            $or: [
              { categorySlug: doc.slug },
              { category: doc._id },
            ],
            status: "published",
            isActive: { $ne: false },
          })
        )
          .sort({ sort: 1, createdAt: 1 })
          .lean();

        const products = productDocs.map(normalizeProductDoc);
        return normalizeCategoryDoc(doc, products, slug);
      }

      const totalOG = await getTotalOGCategoryCount();
      if (totalOG > 0) {
        return null;
      }
    } catch (err) {
      console.warn(`[CategoryService] Database error looking up category "${slug}": ${err.message}`);
    }
  }

  // Fallback to static catalog if DB is offline or unseeded
  const staticCat = getStaticCategoryBySlug(slug);
  return staticCat
    ? {
        ...staticCat,
        canonicalSlug: staticCat.slug,
        isAlias: false,
        previousSlugs: [],
        source: "fallback",
      }
    : null;
}

export const getCategoryBySlug = (slug) => {
  const cachedFn = safeCachedRead(
    () => _getCategoryBySlugRaw(slug),
    ["category", slug],
    { tags: [TAG_CATEGORIES, TAG_CATALOG], revalidate: 3600 }
  );
  return cachedFn();
};

/**
 * Get category hierarchy with subcategories.
 */
export async function getCategoryHierarchy() {
  const categories = await getCategories();
  return categories.map((c) => ({
    name: c.name,
    slug: c.slug,
    tonnageRange: c.tonnageRange,
    subcategories: c.subcategories || [],
  }));
}
