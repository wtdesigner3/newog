export const dynamic = "force-dynamic";
import mongoose from "mongoose";
import { connectDB } from "@/app/lib/config";
import Product from "@/app/models/Product";
import Category from "@/app/models/Category";
import { requireAuth, requirePermission } from "@/app/lib/auth";
import { uploadFile, isUploadFile } from "@/lib/upload";
import { isOGProduct, isOGCategory, BRAND_KEY_OG } from "@/lib/dbScope";
import { invalidateProduct } from "@/lib/cache/cacheInvalidation";

/**
 * GET /api/products/[id]
 * Retrieves a single product by MongoDB _id or slug. Scoped to OG records.
 */
export async function GET(request, context) {
  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;

    const isObjectId = mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId ? { _id: id } : { slug: id };
    const product = await Product.findOne(query)
      .populate("category", "name slug shortName")
      .lean();

    if (!product) {
      return Response.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    if (!isOGProduct(product)) {
      return Response.json(
        { success: false, message: "Access Denied: Requested item does not belong to OG Heavy Duty." },
        { status: 403 }
      );
    }

    // Verify publication status for unauthenticated visitors (FINDING-62-03)
    const { user } = await requireAuth(request);
    const isAdmin = user && (user.role === "super_admin" || user.permissions?.products?.includes("read"));

    if (!isAdmin && (product.status !== "published" || product.isActive === false)) {
      return Response.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return Response.json(product);
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to fetch product", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/products/[id]
 * Updates an OG Heavy Duty product. Requires 'products:update' permission.
 * Strictly verifies ownership to protect unrelated legacy steel records (FINDING-601-02).
 */
export async function PUT(request, context) {
  const { error } = await requirePermission(request, "products", "update");
  if (error) return error;

  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;

    // Validate MongoDB ObjectId format (FINDING-62-06)
    if (!mongoose.Types.ObjectId.isValid(id) || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return Response.json(
        { success: false, message: "Invalid product identifier format. Must be a 24-character hexadecimal ObjectId." },
        { status: 400 }
      );
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return Response.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // Strict Tenant Isolation (FINDING-601-02)
    if (!isOGProduct(existingProduct)) {
      return Response.json(
        {
          success: false,
          message: "Operation Rejected: You cannot edit or overwrite unrelated legacy records.",
        },
        { status: 403 }
      );
    }

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

    const name = body.name !== undefined ? (body.name || "").trim() : existingProduct.name;
    const model = body.model !== undefined ? (body.model || "").trim() : existingProduct.model;
    const slug = body.slug !== undefined ? (body.slug || "").trim().toLowerCase() : existingProduct.slug;
    const categoryId = body.category !== undefined ? (body.category || null) : existingProduct.category;

    if (!name || !slug) {
      return Response.json(
        { success: false, message: "Product name and slug cannot be empty." },
        { status: 400 }
      );
    }

    // Check slug collision against OTHER products
    if (slug !== existingProduct.slug) {
      const duplicateSlug = await Product.findOne({ slug, _id: { $ne: id } });
      if (duplicateSlug) {
        return Response.json(
          { success: false, message: `Product slug "${slug}" is already taken.` },
          { status: 400 }
        );
      }
    }

    // Check model collision against OTHER products
    if (model && model !== existingProduct.model) {
      const duplicateModel = await Product.findOne({
        model: { $regex: new RegExp(`^${model}$`, "i") },
        _id: { $ne: id },
      });
      if (duplicateModel) {
        return Response.json(
          { success: false, message: `Model number "${model}" is already assigned to another product.` },
          { status: 400 }
        );
      }
    }

    // Category resolution
    let resolvedCategorySlug = existingProduct.categorySlug;
    if (categoryId && categoryId.toString() !== existingProduct.category?.toString()) {
      const catDoc = await Category.findById(categoryId).lean();
      if (!catDoc || !isOGCategory(catDoc)) {
        return Response.json(
          { success: false, message: "Invalid category reference." },
          { status: 400 }
        );
      }
      resolvedCategorySlug = catDoc.slug;
    }

    // Handle Image uploads
    let imageUrl = existingProduct.image;
    let detailImageUrl = existingProduct.detailImage;

    if (imageFile) {
      imageUrl = await uploadFile(imageFile, "products", "prod");
    } else if (body.existingImage !== undefined) {
      imageUrl = body.existingImage;
    } else if (body.image !== undefined && typeof body.image === "string") {
      imageUrl = body.image;
    }

    if (detailImageFile) {
      detailImageUrl = await uploadFile(detailImageFile, "products", "detail");
    } else if (body.existingDetailImage !== undefined) {
      detailImageUrl = body.existingDetailImage;
    } else if (body.detailImage !== undefined && typeof body.detailImage === "string") {
      detailImageUrl = body.detailImage;
    }

    // Complex JSON parsing
    let specs = existingProduct.specs;
    if (body.specs !== undefined) {
      try {
        specs = typeof body.specs === "string" ? JSON.parse(body.specs) : body.specs;
      } catch {}
    }

    let features = existingProduct.features;
    if (body.features !== undefined) {
      try {
        features = typeof body.features === "string" ? JSON.parse(body.features) : body.features;
      } catch {
        features = typeof body.features === "string" ? body.features.split("\n").map(s => s.trim()).filter(Boolean) : [];
      }
    }

    let applications = existingProduct.applications;
    if (body.applications !== undefined) {
      try {
        applications = typeof body.applications === "string" ? JSON.parse(body.applications) : body.applications;
      } catch {
        applications = typeof body.applications === "string" ? body.applications.split(",").map(s => s.trim()).filter(Boolean) : [];
      }
    }

    let gallery = existingProduct.gallery;
    if (body.gallery !== undefined) {
      try {
        gallery = typeof body.gallery === "string" ? JSON.parse(body.gallery) : body.gallery;
      } catch {
        gallery = typeof body.gallery === "string" ? body.gallery.split(",").map(s => s.trim()).filter(Boolean) : [];
      }
    }

    let schemaMarkup = existingProduct.schemaMarkup;
    if (body.schemaMarkup !== undefined || body.schema !== undefined) {
      try {
        schemaMarkup = JSON.parse(body.schemaMarkup || body.schema);
      } catch {}
    }

    let metakeywords = existingProduct.metakeywords;
    if (body.metakeywords !== undefined) {
      try {
        const parsed = JSON.parse(body.metakeywords);
        metakeywords = Array.isArray(parsed) ? parsed.map(k => k.value || k) : [parsed];
      } catch {
        metakeywords = typeof body.metakeywords === "string" ? body.metakeywords.split(",").map(s => s.trim()).filter(Boolean) : [];
      }
    }

    const previousSlug = existingProduct.slug;
    const previousCategorySlug = existingProduct.categorySlug;

    // Apply updates
    existingProduct.brandKey = BRAND_KEY_OG;
    existingProduct.name = name;
    existingProduct.model = model || name;
    existingProduct.modelNumber = model || name;
    existingProduct.slug = slug;
    existingProduct.category = categoryId;
    existingProduct.categorySlug = resolvedCategorySlug;
    if (body.subcategorySlug !== undefined) existingProduct.subcategorySlug = body.subcategorySlug;
    if (body.series !== undefined) existingProduct.series = body.series;
    if (body.tagline !== undefined) existingProduct.tagline = body.tagline;
    if (body.tonnage !== undefined) existingProduct.tonnage = body.tonnage;
    if (body.starRating !== undefined) existingProduct.starRating = body.starRating;
    if (body.technology !== undefined) existingProduct.technology = body.technology;
    if (body.compressor !== undefined) existingProduct.compressor = body.compressor;
    if (body.maxAmbient !== undefined) existingProduct.maxAmbient = body.maxAmbient;
    if (body.description !== undefined) existingProduct.description = body.description;
    if (body.breadcrumb !== undefined) existingProduct.breadcrumb = body.breadcrumb;
    existingProduct.image = imageUrl;
    existingProduct.detailImage = detailImageUrl;
    existingProduct.gallery = gallery;
    if (body.brochureUrl !== undefined) existingProduct.brochureUrl = body.brochureUrl;
    existingProduct.specs = specs;
    existingProduct.features = features;
    existingProduct.applications = applications;
    if (body.isFlagship !== undefined) {
      existingProduct.isFlagship = body.isFlagship === true || body.isFlagship === "true";
    }
    if (body.status !== undefined) {
      existingProduct.status = body.status;
      existingProduct.isActive = body.status === "published";
    } else if (body.isActive !== undefined) {
      const active = body.isActive === true || body.isActive === "true";
      existingProduct.isActive = active;
      if (!active && existingProduct.status === "published") {
        existingProduct.status = "draft";
      }
    }
    if (body.sort !== undefined) existingProduct.sort = Number(body.sort) || 0;
    if (body.alt !== undefined) existingProduct.alt = body.alt;
    if (body.metatag !== undefined) existingProduct.metatag = body.metatag;
    if (body.metaDescription !== undefined) existingProduct.metaDescription = body.metaDescription;
    existingProduct.metakeywords = metakeywords;
    if (body.canonicalUrl !== undefined) existingProduct.canonicalUrl = body.canonicalUrl;
    if (body.ogTitle !== undefined) existingProduct.ogTitle = body.ogTitle;
    if (body.ogDescription !== undefined) existingProduct.ogDescription = body.ogDescription;
    if (body.twitterCard !== undefined) existingProduct.twitterCard = body.twitterCard;
    if (body.robots !== undefined) existingProduct.robots = body.robots;
    existingProduct.schemaMarkup = schemaMarkup;

    await existingProduct.save();
    await existingProduct.populate("category", "name slug shortName");

    // Revalidate Public Website for both new and previous paths
    await invalidateProduct(slug, resolvedCategorySlug);
    if (previousSlug !== slug || previousCategorySlug !== resolvedCategorySlug) {
      await invalidateProduct(previousSlug, previousCategorySlug);
    }

    return Response.json(existingProduct);
  } catch (error) {
    console.error("[API products PUT] Error:", error);
    return Response.json(
      { success: false, message: "Failed to update product", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/products/[id]
 * Deletes or archives an OG Heavy Duty product. Requires 'products:delete' permission.
 * Strictly verifies ownership to protect unrelated legacy steel records (FINDING-601-02).
 */
export async function DELETE(request, context) {
  const { error } = await requirePermission(request, "products", "delete");
  if (error) return error;

  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;

    // Validate MongoDB ObjectId format (FINDING-62-06)
    if (!mongoose.Types.ObjectId.isValid(id) || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return Response.json(
        { success: false, message: "Invalid product identifier format. Must be a 24-character hexadecimal ObjectId." },
        { status: 400 }
      );
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return Response.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // Strict Tenant Isolation (FINDING-601-02)
    if (!isOGProduct(existingProduct)) {
      return Response.json(
        {
          success: false,
          message: "Operation Rejected: You cannot delete or modify unrelated legacy records.",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get("hard") === "true";

    const { slug, categorySlug } = existingProduct;

    if (hardDelete) {
      await Product.findByIdAndDelete(id);
    } else {
      // Soft-delete / Archive
      existingProduct.status = "archived";
      existingProduct.isActive = false;
      await existingProduct.save();
    }

    // Revalidate Public Website
    await invalidateProduct(slug, categorySlug);

    return Response.json({
      success: true,
      message: hardDelete ? "Product deleted successfully." : "Product archived successfully.",
    });
  } catch (error) {
    console.error("[API products DELETE] Error:", error);
    return Response.json(
      { success: false, message: "Failed to delete product", error: error.message },
      { status: 500 }
    );
  }
}
