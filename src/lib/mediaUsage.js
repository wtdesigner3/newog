import { connectDBSafe } from "./db.js";
import Product from "../app/models/Product.js";
import Category from "../app/models/Category.js";
import Blog from "../app/models/Blog.js";
import Resource from "../app/models/Resource.js";
import { getOGProductFilter, getOGCategoryFilter, getOGBlogFilter, getOGResourceFilter } from "./dbScope.js";

/**
 * Escapes special regex characters in a string
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Checks whether a given media asset (URL or public_id) is referenced by any CMS records.
 * Queries Products, Categories, Blogs, and Resources.
 * 
 * @param {string} fileUrl - Full URL or relative path of the file
 * @returns {Promise<{ isReferenced: boolean, count: number, references: Array }>}
 */
export async function checkMediaUsage(fileUrl) {
  if (!fileUrl || typeof fileUrl !== "string") {
    return { isReferenced: false, count: 0, references: [] };
  }

  const conn = await connectDBSafe({ silent: true });
  if (!conn) {
    return { isReferenced: false, count: 0, references: [] };
  }

  try {
    const cleanUrl = fileUrl.trim();
    // Also extract the basename for fallback matching (e.g. "174829384-prod-xyz.jpg")
    const filename = cleanUrl.split("/").pop();
    const regexExact = new RegExp(`^${escapeRegex(cleanUrl)}$`, "i");
    const regexFilename = filename && filename.length > 5 ? new RegExp(escapeRegex(filename), "i") : regexExact;

    const references = [];

    // 1. Check Products (image, detailImage, brochureUrl, gallery)
    const matchingProducts = await Product.find(
      getOGProductFilter({
        $or: [
          { image: cleanUrl },
          { image: regexFilename },
          { detailImage: cleanUrl },
          { detailImage: regexFilename },
          { brochureUrl: cleanUrl },
          { brochureUrl: regexFilename },
          { gallery: cleanUrl },
          { gallery: regexFilename },
        ],
      })
    )
      .select("name model slug categorySlug image detailImage brochureUrl gallery")
      .lean();

    for (const p of matchingProducts) {
      let role = "Product Media";
      if (p.image === cleanUrl || (filename && p.image?.includes(filename))) role = "Primary Card Image";
      else if (p.detailImage === cleanUrl || (filename && p.detailImage?.includes(filename))) role = "Detail Hero Banner";
      else if (p.brochureUrl === cleanUrl || (filename && p.brochureUrl?.includes(filename))) role = "Product Brochure PDF";
      else if (Array.isArray(p.gallery) && p.gallery.some(g => g === cleanUrl || (filename && g?.includes(filename)))) role = "Product Gallery";

      references.push({
        module: "products",
        moduleLabel: "Product",
        type: "Product",
        id: p._id.toString(),
        name: p.name,
        title: p.name || p.model || p.slug,
        identifier: p.model || p.slug,
        field: role,
        role,
        link: `/dashboard/products`,
      });
    }

    // 2. Check Categories (image, bannerImage)
    const matchingCategories = await Category.find(
      getOGCategoryFilter({
        $or: [
          { image: cleanUrl },
          { image: regexFilename },
          { bannerImage: cleanUrl },
          { bannerImage: regexFilename },
        ],
      })
    )
      .select("name slug image bannerImage")
      .lean();

    for (const c of matchingCategories) {
      let role = "Category Image";
      if (c.image === cleanUrl || (filename && c.image?.includes(filename))) role = "Category Listing Card";
      else if (c.bannerImage === cleanUrl || (filename && c.bannerImage?.includes(filename))) role = "Category Hero Banner";

      references.push({
        module: "categories",
        moduleLabel: "Category",
        type: "Category",
        id: c._id.toString(),
        name: c.name,
        title: c.name || c.slug,
        identifier: c.slug,
        field: role,
        role,
        link: `/dashboard/products/categories`,
      });
    }

    // 3. Check Blogs (image, bannerImage, content rich-text)
    const matchingBlogs = await Blog.find(
      getOGBlogFilter({
        $or: [
          { image: cleanUrl },
          { image: regexFilename },
          { bannerImage: cleanUrl },
          { bannerImage: regexFilename },
          { content: regexFilename },
        ],
      })
    )
      .select("title slug image bannerImage")
      .lean();

    for (const b of matchingBlogs) {
      let role = "Blog Media";
      if (b.image === cleanUrl || (filename && b.image?.includes(filename))) role = "Cover Thumbnail";
      else if (b.bannerImage === cleanUrl || (filename && b.bannerImage?.includes(filename))) role = "Header Banner";
      else role = "Inline Body Image";

      references.push({
        module: "blogs",
        moduleLabel: "Blog Article",
        type: "Blog Article",
        id: b._id.toString(),
        name: b.title,
        title: b.title || b.slug,
        identifier: b.slug,
        field: role,
        role,
        link: `/dashboard/blogs`,
      });
    }

    // 4. Check Resources (filePath, image)
    const matchingResources = await Resource.find(
      getOGResourceFilter({
        $or: [
          { filePath: cleanUrl },
          { filePath: regexFilename },
          { image: cleanUrl },
          { image: regexFilename },
        ],
      })
    )
      .select("title id filePath")
      .lean();

    for (const r of matchingResources) {
      references.push({
        module: "resources",
        moduleLabel: "Technical Resource",
        type: "Technical Resource",
        id: r._id.toString(),
        name: r.title,
        title: r.title || r.id,
        identifier: r.id || r.title,
        field: "Downloadable Manual / Document",
        role: "Downloadable Manual / Document",
        link: `/dashboard/resources`,
      });
    }

    return {
      isReferenced: references.length > 0,
      count: references.length,
      references,
    };
  } catch (err) {
    console.error("[checkMediaUsage] Error checking references:", err.message);
    return { isReferenced: false, count: 0, references: [] };
  }
}
