export const dynamic = "force-dynamic";
import { connectDB, connectDBSafe } from "@/app/lib/config";
import Product from "@/app/models/Product";
import Category from "@/app/models/Category";
import { requireAuth, requirePermission } from "@/app/lib/auth";
import { uploadFile, isUploadFile } from "@/lib/upload";
import { getOGProductFilter, BRAND_KEY_OG, isOGCategory } from "@/lib/dbScope";
import { invalidateProduct } from "@/lib/cache/cacheInvalidation";
import { getAllProducts } from "@/lib/services/productService";

/**
 * GET /api/products
 * Retrieves OG Heavy Duty products. Scoped strictly to OG records.
 * Supports query parameters: search, category, status, paginate, page, limit.
 */
export async function GET(request) {
  try {
    const conn = await connectDBSafe({ silent: true });
    if (!conn) {
      const fallback = await getAllProducts();
      return Response.json(fallback);
    }

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";
    const isPaginated = searchParams.get("paginate") === "true";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "50", 10));
    const skip = (page - 1) * limit;

    const { user } = await requireAuth(request);
    const isAdmin = user && (user.role === "super_admin" || user.permissions?.products?.includes("read"));

    const extraFilter = {};

    if (search) {
      const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      extraFilter.$or = [
        { name: searchRegex },
        { model: searchRegex },
        { slug: searchRegex },
        { series: searchRegex },
      ];
    }

    if (category && category !== "all") {
      extraFilter.$or = [
        { categorySlug: category },
        ...(category.match(/^[0-9a-fA-F]{24}$/) ? [{ category: category }] : []),
      ];
    }

    if (isAdmin) {
      if (status && status !== "all") {
        extraFilter.status = status;
      }
    } else {
      // Unauthenticated public visitors or non-admin callers strictly receive published, active products
      extraFilter.status = "published";
      extraFilter.isActive = { $ne: false };
    }

    const query = getOGProductFilter(extraFilter);
    const total = await Product.countDocuments(query);

    let queryBuilder = Product.find(query)
      .populate("category", "name slug shortName")
      .sort({ sort: 1, createdAt: 1 });

    if (isPaginated) {
      queryBuilder = queryBuilder.skip(skip).limit(limit);
    }

    const products = await queryBuilder.lean();

    if (isPaginated) {
      return Response.json({
        success: true,
        data: products,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    }

    // Default array response for backward compatibility with existing dashboard tables
    return Response.json(products, {
      headers: {
        "X-Total-Count": total.toString(),
      },
    });
  } catch (error) {
    console.error("[API products GET] Error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch products", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products
 * Creates a new OG Heavy Duty HVAC product.
 * Requires 'products:create' permission.
 */
export async function POST(request) {
  const { error } = await requirePermission(request, "products", "create");
  if (error) return error;

  try {
    await connectDB();

    let body = {};
    const contentType = request.headers.get("content-type") || "";

    let imageFile = null;
    let detailImageFile = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        if (key === "image" && isUploadFile(value)) {
          imageFile = value;
        } else if (key === "detailImage" && isUploadFile(value)) {
          detailImageFile = value;
        } else {
          body[key] = value;
        }
      });
    } else {
      body = await request.json();
    }

    const name = (body.name || "").trim();
    const model = (body.model || body.modelNumber || "").trim();
    const slug = (body.slug || "").trim().toLowerCase();
    const categoryId = body.category || null;

    if (!name || !slug) {
      return Response.json(
        { success: false, message: "Product name and URL slug are required." },
        { status: 400 }
      );
    }

    // Duplicate check for slug
    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) {
      return Response.json(
        { success: false, message: `Product slug "${slug}" already exists.` },
        { status: 400 }
      );
    }

    // Duplicate check for model (if provided)
    if (model) {
      const existingModel = await Product.findOne({
        model: { $regex: new RegExp(`^${model}$`, "i") },
      });
      if (existingModel) {
        return Response.json(
          { success: false, message: `Product model "${model}" already exists.` },
          { status: 400 }
        );
      }
    }

    // Category resolution & validation
    let resolvedCategorySlug = body.categorySlug || "";
    if (categoryId) {
      const categoryDoc = await Category.findById(categoryId).lean();
      if (!categoryDoc) {
        return Response.json(
          { success: false, message: "Referenced category not found." },
          { status: 400 }
        );
      }
      if (!isOGCategory(categoryDoc)) {
        return Response.json(
          { success: false, message: "Category does not belong to OG Heavy Duty." },
          { status: 400 }
        );
      }
      resolvedCategorySlug = categoryDoc.slug;
    }

    // Handle Image Uploads
    let imageUrl = body.existingImage || body.image || "";
    let detailImageUrl = body.existingDetailImage || body.detailImage || "";

    if (imageFile) {
      imageUrl = await uploadFile(imageFile, "products", "prod");
    }
    if (detailImageFile) {
      detailImageUrl = await uploadFile(detailImageFile, "products", "detail");
    }

    // Parse complex JSON fields
    let specs = {};
    if (body.specs) {
      try {
        specs = typeof body.specs === "string" ? JSON.parse(body.specs) : body.specs;
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

    let applications = [];
    if (body.applications) {
      try {
        applications = typeof body.applications === "string" ? JSON.parse(body.applications) : body.applications;
      } catch {
        applications = typeof body.applications === "string" ? body.applications.split(",").map(s => s.trim()).filter(Boolean) : [];
      }
    }

    let gallery = [];
    if (body.gallery) {
      try {
        gallery = typeof body.gallery === "string" ? JSON.parse(body.gallery) : body.gallery;
      } catch {
        gallery = typeof body.gallery === "string" ? body.gallery.split(",").map(s => s.trim()).filter(Boolean) : [];
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

    const newProduct = await Product.create({
      brandKey: BRAND_KEY_OG,
      name,
      model: model || name,
      modelNumber: model || name,
      slug,
      category: categoryId,
      categorySlug: resolvedCategorySlug,
      subcategorySlug: body.subcategorySlug || "",
      series: body.series || "",
      tagline: body.tagline || "",
      tonnage: body.tonnage || "",
      starRating: body.starRating || "",
      technology: body.technology || "",
      compressor: body.compressor || "",
      maxAmbient: body.maxAmbient || "",
      description: body.description || "",
      breadcrumb: body.breadcrumb || "",
      image: imageUrl,
      detailImage: detailImageUrl,
      gallery,
      brochureUrl: body.brochureUrl || "",
      specs,
      features,
      applications,
      isFlagship: body.isFlagship === true || body.isFlagship === "true",
      status: body.status || "published",
      isActive: body.isActive !== false && body.isActive !== "false" && body.status !== "draft" && body.status !== "archived",
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

    await newProduct.populate("category", "name slug shortName");

    // Revalidate Public Website
    await invalidateProduct(slug, resolvedCategorySlug);

    return Response.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("[API products POST] Creation error:", error);
    return Response.json(
      { success: false, message: "Failed to create product", error: error.message },
      { status: 500 }
    );
  }
}
