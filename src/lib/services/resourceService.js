/**
 * Technical Resource Data Access Service
 * Handles querying and fallback resolution for technical manuals, error codes, and catalogues.
 * 
 * Conforms to:
 * - FINDING-601-01: Attached Next.js Data Cache tags (TAG_RESOURCES)
 * - FINDING-601-02: Scoped strictly to OG Heavy Duty records via dbScope
 * - FINDING-601-03: Differentiates genuinely unseeded DB from draft-only state
 */
import { connectDBSafe } from "../db.js";
import Resource from "../../app/models/Resource.js";
import { getOGResourceFilter } from "../dbScope.js";
import { safeCachedRead } from "../cache/cachedRead.js";
import { TAG_RESOURCES } from "../cache/cacheTags.js";
import {
  TECHNICAL_RESOURCES as STATIC_RESOURCES,
  RESOURCE_CATEGORIES as STATIC_CATEGORIES,
  getResourcesByCategory as getStaticResourcesByCategory,
  getResourcesForProduct as getStaticResourcesForProduct,
} from "../resourcesData.js";

function normalizeResourceDoc(doc) {
  if (!doc) return null;
  return {
    _id: doc._id?.toString(),
    id: doc.id,
    title: doc.title,
    category: doc.category,
    categoryName: doc.categoryName || "",
    description: doc.description || "",
    applicableProducts: doc.applicableProducts || "",
    applicableCategorySlug: doc.applicableCategorySlug || "all",
    applicableModels: doc.applicableModels || [],
    filePath: doc.filePath,
    legacyPaths: doc.legacyPaths || [],
    fileType: doc.fileType || "PDF",
    fileSize: doc.fileSize || "",
    pageCount: doc.pageCount || 0,
    edition: doc.edition || "",
    verified: Boolean(doc.verified),
    status: doc.status || "published",
    sort: doc.sort || 0,
    downloadCount: doc.downloadCount || 0,
    source: "database",
  };
}

/**
 * Total count of OG resources in database regardless of publication status.
 */
async function getTotalOGResourceCount() {
  return await Resource.countDocuments(getOGResourceFilter());
}

/**
 * Get all published technical resources.
 */
async function _getResourcesRaw() {
  const conn = await connectDBSafe({ silent: true });

  if (conn) {
    try {
      const totalOG = await getTotalOGResourceCount();

      if (totalOG > 0) {
        const docs = await Resource.find(
          getOGResourceFilter({
            status: "published",
            isActive: { $ne: false },
          })
        )
          .sort({ sort: 1, createdAt: 1 })
          .lean();

        return docs.map(normalizeResourceDoc);
      }
    } catch (err) {
      console.warn(`[ResourceService] Database read error: ${err.message}. Engaging static fallback.`);
    }
  }

  return STATIC_RESOURCES.map((r) => ({ ...r, source: "fallback" }));
}

export const getResources = safeCachedRead(
  _getResourcesRaw,
  ["all-resources"],
  { tags: [TAG_RESOURCES], revalidate: 3600 }
);

/**
 * Get resource categories metadata.
 */
export async function getResourceCategories() {
  return STATIC_CATEGORIES;
}

/**
 * Get resources filtered by category slug.
 */
export async function getResourcesByCategory(categorySlug) {
  const all = await getResources();
  if (!categorySlug || categorySlug === "all") return all;
  return all.filter((r) => r.category === categorySlug);
}

/**
 * Get resources associated with a specific product model or category.
 */
export async function getResourcesForProduct(productModel, categorySlug) {
  const all = await getResources();
  return all.filter((r) => {
    if (r.applicableModels && r.applicableModels.includes(productModel)) return true;
    if (r.applicableCategorySlug === "all") return true;
    if (categorySlug && r.applicableCategorySlug === categorySlug) return true;
    return false;
  });
}
