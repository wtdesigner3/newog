export const dynamic = "force-dynamic";
import { connectDB, connectDBSafe } from "@/app/lib/config";
import Category from "@/app/models/Category";
import Product from "@/app/models/Product";
import { requirePermission } from "@/app/lib/auth";
import { uploadFile, isUploadFile } from "@/lib/upload";
import { getOGCategoryFilter, getOGProductFilter, BRAND_KEY_OG } from "@/lib/dbScope";
import { invalidateCategory } from "@/lib/cache/cacheInvalidation";
import { getCategories } from "@/lib/services/categoryService";

/**
 * GET /api/categories
 * Retrieves OG Heavy Duty HVAC categories with active product counts.
 * Scoped strictly to OG categories (zero steel categories leaked).
 */
export async function GET() {
  try {
    const conn = await connectDBSafe({ silent: true });
    if (!conn) {
      const fallback = await getCategories();
      return Response.json(fallback);
    }

    const query = getOGCategoryFilter();
    const categories = await Category.find(query).sort({ sort: 1, createdAt: 1 }).lean();

    // Populate actual OG product count for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments(
          getOGProductFilter({
            $or: [
              { categorySlug: cat.slug },
              { category: cat._id },
            ],
            status: "published",
            isActive: { $ne: false },
          })
        );
        return {
          ...cat,
          productCount,
        };
      })
    );

    return Response.json(categoriesWithCounts);
  } catch (error) {
    console.error("[API categories GET] Error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch categories", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/categories
 * Creates a new OG Heavy Duty HVAC category.
 * Requires 'categories:create' permission.
 */
export async function POST(request) {
  const { error } = await requirePermission(request, "categories", "create");
  if (error) return error;

  try {
    await connectDB();

    let body = {};
    const contentType = request.headers.get("content-type") || "";

    let imageFile = null;
    let bannerFile = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        if (key === "image" && isUploadFile(value)) {
          imageFile = value;
        } else if (key === "bannerImage" && isUploadFile(value)) {
          bannerFile = value;
        } else {
          body[key] = value;
        }
      });
    } else {
      body = await request.json();
    }

    const name = (body.name || "").trim();
    const slug = (body.slug || "").trim().toLowerCase();

    if (!name || !slug) {
      return Response.json(
        { success: false, message: "Category name and slug are required." },
        { status: 400 }
      );
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      return Response.json(
        { success: false, message: "Category slug must contain only lowercase alphanumeric characters and hyphens." },
        { status: 400 }
      );
    }

    // Uniqueness check: Cannot match current slug or historical previousSlugs of any category (PHASE 6.3)
    const existing = await Category.findOne(
      getOGCategoryFilter({
        $or: [{ slug }, { previousSlugs: slug }],
      })
    );
    if (existing) {
      return Response.json(
        {
          success: false,
          message: `Category slug "${slug}" is already in use by category "${existing.name}" (as a current slug or previous URL alias).`,
        },
        { status: 409 }
      );
    }

    // Handle Image uploads
    let imageUrl = body.image || "";
    let bannerImageUrl = body.bannerImage || "";

    if (imageFile) {
      imageUrl = await uploadFile(imageFile, "categories", "category");
    }
    if (bannerFile) {
      bannerImageUrl = await uploadFile(bannerFile, "categories", "banner");
    }

    // Parse subcategories & features
    let subcategories = [];
    if (body.subcategories) {
      try {
        subcategories = typeof body.subcategories === "string" ? JSON.parse(body.subcategories) : body.subcategories;
      } catch {}
    }

    let features = [];
    if (body.features) {
      try {
        features = typeof body.features === "string" ? JSON.parse(body.features) : body.features;
      } catch {
        features = typeof body.features === "string" ? body.features.split("\n").map(s => s.trim()).filter(Boolean) : [];
      }
    }

    let schemaMarkup = {};
    if (body.schemaMarkup || body.schema) {
      try {
        schemaMarkup = JSON.parse(body.schemaMarkup || body.schema);
      } catch {}
    }

    let metakeywords = [];
    if (body.metakeywords) {
      try {
        const parsed = JSON.parse(body.metakeywords);
        metakeywords = Array.isArray(parsed) ? parsed.map(k => k.value || k) : [parsed];
      } catch {
        metakeywords = body.metakeywords.split(",").map(s => s.trim()).filter(Boolean);
      }
    }

    const newCategory = await Category.create({
      brandKey: BRAND_KEY_OG,
      name,
      shortName: body.shortName || name,
      slug,
      series: body.series || "",
      badge: body.badge || "",
      tagline: body.tagline || "",
      description: body.description || "",
      breadcrumb: body.breadcrumb || "",
      image: imageUrl,
      bannerImage: bannerImageUrl,
      isGif: body.isGif === true || body.isGif === "true",
      tonnageRange: body.tonnageRange || "",
      subcategories,
      features,
      status: body.status || "published",
      isActive: body.isActive !== false && body.isActive !== "false" && body.status !== "draft",
      sort: Number(body.sort) || 0,
      alt: body.alt || "",
      metatag: body.metatag || "",
      metaDescription: body.metaDescription || "",
      metakeywords,
      canonicalUrl: body.canonicalUrl || "",
      ogTitle: body.ogTitle || "",
      ogDescription: body.ogDescription || "",
      twitterCard: body.twitterCard || "summary_large_image",
      robots: body.robots || "index, follow",
      schemaMarkup,
    });

    // Revalidate Public Category Routes
    await invalidateCategory(slug);

    return Response.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("[API categories POST] Error:", error);
    return Response.json(
      { success: false, message: "Failed to create category", error: error.message },
      { status: 500 }
    );
  }
}
