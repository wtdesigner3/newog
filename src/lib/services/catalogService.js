/**
 * Unified Public Catalog Service
 * Enforces explicit 3-tier data precedence across all catalog reads:
 * 1. Database-backed published records when MongoDB is connected and seeded.
 * 2. Graceful fallback to verified static catalog when database is unavailable.
 * 3. Baseline verified fallback when database is connected but unseeded.
 * Missing/draft products in a seeded database return 404.
 */
import { getCategories, getCategoryBySlug } from "./categoryService.js";
import {
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
  getRelatedProducts,
  getFeaturedProducts,
} from "./productService.js";
import { getResourcesForProduct } from "./resourceService.js";

/**
 * Get aggregate data for the /products landing page.
 */
export async function getCatalogLandingData() {
  const [categories, allProducts, featuredProducts] = await Promise.all([
    getCategories(),
    getAllProducts(),
    getFeaturedProducts(6),
  ]);

  const source = allProducts.length > 0 && allProducts[0].source === "database" ? "database" : "fallback";

  return {
    categories,
    allProducts,
    featuredProducts,
    source,
  };
}

/**
 * Get aggregate data for a single category view (/products/[categorySlug]).
 */
export async function getCategoryDetailData(categorySlug) {
  if (!categorySlug) return null;

  const category = await getCategoryBySlug(categorySlug);
  if (!category) return null;

  const products = await getProductsByCategory(categorySlug);

  return {
    category,
    products,
    source: category.source || "fallback",
  };
}

/**
 * Get aggregate data for a single product view (/products/[categorySlug]/[productSlug]).
 */
export async function getProductDetailData(categorySlug, productSlug) {
  if (!productSlug) return null;

  const product = await getProductBySlug(categorySlug, productSlug);
  if (!product) return null;

  const effectiveCategorySlug = product.categorySlug || categorySlug;
  const category = await getCategoryBySlug(effectiveCategorySlug);
  const relatedProducts = await getRelatedProducts(effectiveCategorySlug, product.slug, 3);
  const resources = await getResourcesForProduct(product.model);

  return {
    product,
    category,
    relatedProducts,
    resources,
    source: product.source || "fallback",
  };
}

/**
 * Get products filtered by subcategory.
 */
export async function getProductsBySubcategory(categorySlug, subcategorySlug) {
  const products = await getProductsByCategory(categorySlug);
  if (!subcategorySlug || subcategorySlug === "all") {
    return products;
  }
  return products.filter((p) => p.subcategorySlug === subcategorySlug);
}

export {
  getCategories,
  getCategoryBySlug,
  getAllProducts,
  getProductBySlug,
  getProductsByCategory,
  getRelatedProducts,
  getFeaturedProducts,
};
