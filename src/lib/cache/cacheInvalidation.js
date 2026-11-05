/**
 * Cache Invalidation Helpers for Next.js On-Demand Revalidation
 * Safely wraps next/cache revalidation methods for CMS mutators and API routes.
 */
import {
  TAG_CATALOG,
  TAG_PRODUCTS,
  TAG_CATEGORIES,
  TAG_RESOURCES,
  TAG_BLOGS,
  TAG_SETTINGS,
} from "./cacheTags.js";

async function safeRevalidateTag(tag) {
  try {
    const nextCache = await import("next/cache").catch(() => null);
    if (nextCache && typeof nextCache.revalidateTag === "function") {
      nextCache.revalidateTag(tag);
      return true;
    }
  } catch (err) {
    // Gracefully handle invocations outside Next.js request lifecycle (e.g. CLI imports)
  }
  return false;
}

async function safeRevalidatePath(path, type) {
  try {
    const nextCache = await import("next/cache").catch(() => null);
    if (nextCache && typeof nextCache.revalidatePath === "function") {
      if (type) {
        nextCache.revalidatePath(path, type);
      } else {
        nextCache.revalidatePath(path);
      }
      return true;
    }
  } catch (err) {
    // Gracefully handle invocations outside Next.js request lifecycle
  }
  return false;
}

export async function invalidateProduct(slug, categorySlug) {
  await safeRevalidateTag(TAG_PRODUCTS);
  await safeRevalidateTag(TAG_CATALOG);
  await safeRevalidatePath("/products");
  await safeRevalidatePath("/sitemap.xml");
  if (categorySlug) {
    await safeRevalidatePath(`/products/${categorySlug}`);
    if (slug) {
      await safeRevalidatePath(`/products/${categorySlug}/${slug}`);
    }
  }
}

export async function invalidateCategory(slug) {
  await safeRevalidateTag(TAG_CATEGORIES);
  await safeRevalidateTag(TAG_CATALOG);
  await safeRevalidatePath("/products");
  await safeRevalidatePath("/sitemap.xml");
  if (slug) {
    await safeRevalidatePath(`/products/${slug}`);
  }
}

export async function invalidateBlog(slug) {
  await safeRevalidateTag(TAG_BLOGS);
  await safeRevalidatePath("/blogs");
  await safeRevalidatePath("/blog");
  await safeRevalidatePath("/sitemap.xml");
  if (slug) {
    await safeRevalidatePath(`/blogs/${slug}`);
    await safeRevalidatePath(`/blog/${slug}`);
  }
}

export async function invalidateResources() {
  await safeRevalidateTag(TAG_RESOURCES);
  await safeRevalidatePath("/resources");
  await safeRevalidatePath("/sitemap.xml");
}

export async function invalidateSettings() {
  await safeRevalidateTag(TAG_SETTINGS);
  await safeRevalidatePath("/", "layout");
  await safeRevalidatePath("/sitemap.xml");
}

export async function invalidateCatalog() {
  await safeRevalidateTag(TAG_CATALOG);
  await safeRevalidateTag(TAG_PRODUCTS);
  await safeRevalidateTag(TAG_CATEGORIES);
  await safeRevalidatePath("/products");
  await safeRevalidatePath("/sitemap.xml");
}
