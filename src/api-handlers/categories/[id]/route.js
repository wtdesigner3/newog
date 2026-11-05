export const dynamic = "force-dynamic";
import mongoose from "mongoose";
import { connectDB } from "@/app/lib/config";
import Category from "@/app/models/Category";
import Product from "@/app/models/Product";
import { requirePermission } from "@/app/lib/auth";
import { uploadFile, isUploadFile } from "@/lib/upload";
import { isOGCategory, BRAND_KEY_OG, getOGProductFilter } from "@/lib/dbScope";
import { invalidateCategory, invalidateProduct } from "@/lib/cache/cacheInvalidation";

/**
 * GET /api/categories/[id]
 * Retrieves category by MongoDB _id or slug. Scoped strictly to OG categories.
 */
export async function GET(request, context) {
  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;

    const query = id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: id }
      : { $or: [{ slug: id }, { previousSlugs: id }] };
    const category = await Category.findOne(query).lean();

    if (!category) {
      return Response.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    if (!isOGCategory(category)) {
      return Response.json(
        { success: false, message: "Access Denied: Unrelated record." },
        { status: 403 }
      );
    }

    const isAlias = !id.match(/^[0-9a-fA-F]{24}$/) && category.slug !== id;

    const productCount = await Product.countDocuments(
      getOGProductFilter({
        $or: [{ categorySlug: category.slug }, { category: category._id }],
        status: "published",
        isActive: { $ne: false },
      })
    );

    return Response.json({
      ...category,
      productCount,
      isAlias,
      canonicalSlug: category.slug,
    });
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to fetch category", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/categories/[id]
 * Updates an OG category. Requires 'categories:update' permission.
 * Strictly verifies ownership to protect unrelated legacy steel categories (FINDING-601-02).
 */
export async function PUT(request, context) {
  const { error } = await requirePermission(request, "categories", "update");
  if (error) return error;

  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;

    // Validate ObjectId format (FINDING-62-06)
    if (!mongoose.Types.ObjectId.isValid(id) || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return Response.json(
        { success: false, message: `Invalid category identifier format: "${id}". Expected a 24-character hexadecimal ObjectId.` },
        { status: 400 }
      );
    }

    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return Response.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    // Strict Tenant Isolation (FINDING-601-02)
    if (!isOGCategory(existingCategory)) {
      return Response.json(
        {
          success: false,
          message: "Operation Rejected: You cannot edit or modify unrelated legacy categories.",
        },
        { status: 403 }
      );
    }

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

    const name = body.name !== undefined ? (body.name || "").trim() : existingCategory.name;
    const slug = body.slug !== undefined ? (body.slug || "").trim().toLowerCase() : existingCategory.slug;

    if (!name || !slug) {
      return Response.json(
        { success: false, message: "Category name and slug cannot be empty." },
        { status: 400 }
      );
    }

    // Duplicate slug check against OTHER categories (current slugs and historical aliases)
    if (slug !== existingCategory.slug) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        return Response.json(
          { success: false, message: "Category slug must contain only lowercase alphanumeric characters and hyphens." },
          { status: 400 }
        );
      }
      const duplicateSlug = await Category.findOne(
        getOGCategoryFilter({
          _id: { $ne: id },
          $or: [{ slug }, { previousSlugs: slug }],
        })
      );
      if (duplicateSlug) {
        return Response.json(
          {
            success: false,
            message: `Category slug "${slug}" is already in use by category "${duplicateSlug.name}" (as a current slug or previous URL alias).`,
          },
          { status: 409 }
        );
      }
    }

    // Image uploads
    let imageUrl = existingCategory.image;
    let bannerImageUrl = existingCategory.bannerImage;

    if (imageFile) {
      imageUrl = await uploadFile(imageFile, "categories", "category");
    } else if (body.image !== undefined && typeof body.image === "string") {
      imageUrl = body.image;
    }

    if (bannerFile) {
      bannerImageUrl = await uploadFile(bannerFile, "categories", "banner");
    } else if (body.bannerImage !== undefined && typeof body.bannerImage === "string") {
      bannerImageUrl = body.bannerImage;
    }

    // Parse subcategories & features
    let subcategories = existingCategory.subcategories;
    if (body.subcategories !== undefined) {
      try {
        subcategories = typeof body.subcategories === "string" ? JSON.parse(body.subcategories) : body.subcategories;
      } catch {}
    }

    let features = existingCategory.features;
    if (body.features !== undefined) {
      try {
        features = typeof body.features === "string" ? JSON.parse(body.features) : body.features;
      } catch {
        features = typeof body.features === "string" ? body.features.split("\n").map(s => s.trim()).filter(Boolean) : [];
      }
    }

    let schemaMarkup = existingCategory.schemaMarkup;
    if (body.schemaMarkup !== undefined || body.schema !== undefined) {
      try {
        schemaMarkup = JSON.parse(body.schemaMarkup || body.schema);
      } catch {}
    }

    let metakeywords = existingCategory.metakeywords;
    if (body.metakeywords !== undefined) {
      try {
        const parsed = JSON.parse(body.metakeywords);
        metakeywords = Array.isArray(parsed) ? parsed.map(k => k.value || k) : [parsed];
      } catch {
        metakeywords = typeof body.metakeywords === "string" ? body.metakeywords.split(",").map(s => s.trim()).filter(Boolean) : [];
      }
    }

    const previousSlug = existingCategory.slug;

    let updatedCategory = null;
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        // Apply updates
        existingCategory.brandKey = BRAND_KEY_OG;
        existingCategory.name = name;
        if (body.shortName !== undefined) existingCategory.shortName = body.shortName;

        // If slug changed, update historical alias array and verify collision inside transaction (HARDENING-631-01)
        if (previousSlug !== slug) {
          const duplicateInTx = await Category.findOne(
            getOGCategoryFilter({
              _id: { $ne: id },
              $or: [{ slug }, { previousSlugs: slug }],
            })
          ).session(session);

          if (duplicateInTx) {
            const err = new Error(
              `Category slug "${slug}" is already in use by category "${duplicateInTx.name}" (as a current slug or previous URL alias).`
            );
            err.statusCode = 409;
            throw err;
          }

          if (!Array.isArray(existingCategory.previousSlugs)) {
            existingCategory.previousSlugs = [];
          }
          if (previousSlug && !existingCategory.previousSlugs.includes(previousSlug)) {
            existingCategory.previousSlugs.push(previousSlug);
          }
          // If the new slug was previously an alias for this category, remove it from previousSlugs
          existingCategory.previousSlugs = existingCategory.previousSlugs.filter(
            (s) => s !== slug
          );
        }

        existingCategory.slug = slug;
        if (body.series !== undefined) existingCategory.series = body.series;
        if (body.badge !== undefined) existingCategory.badge = body.badge;
        if (body.tagline !== undefined) existingCategory.tagline = body.tagline;
        if (body.description !== undefined) existingCategory.description = body.description;
        if (body.breadcrumb !== undefined) existingCategory.breadcrumb = body.breadcrumb;
        existingCategory.image = imageUrl;
        existingCategory.bannerImage = bannerImageUrl;
        if (body.isGif !== undefined) existingCategory.isGif = body.isGif === true || body.isGif === "true";
        if (body.tonnageRange !== undefined) existingCategory.tonnageRange = body.tonnageRange;
        existingCategory.subcategories = subcategories;
        existingCategory.features = features;
        if (body.status !== undefined) {
          existingCategory.status = body.status;
          existingCategory.isActive = body.status === "published";
        } else if (body.isActive !== undefined) {
          const active = body.isActive === true || body.isActive === "true";
          existingCategory.isActive = active;
          if (!active && existingCategory.status === "published") {
            existingCategory.status = "draft";
          }
        }
        if (body.sort !== undefined) existingCategory.sort = Number(body.sort) || 0;
        if (body.alt !== undefined) existingCategory.alt = body.alt;
        if (body.metatag !== undefined) existingCategory.metatag = body.metatag;
        if (body.metaDescription !== undefined) existingCategory.metaDescription = body.metaDescription;
        existingCategory.metakeywords = metakeywords;
        if (body.canonicalUrl !== undefined) existingCategory.canonicalUrl = body.canonicalUrl;
        if (body.ogTitle !== undefined) existingCategory.ogTitle = body.ogTitle;
        if (body.ogDescription !== undefined) existingCategory.ogDescription = body.ogDescription;
        if (body.twitterCard !== undefined) existingCategory.twitterCard = body.twitterCard;
        if (body.robots !== undefined) existingCategory.robots = body.robots;
        existingCategory.schemaMarkup = schemaMarkup;

        await existingCategory.save({ session });

        if (previousSlug !== slug) {
          // Cascade categorySlug updates to all associated products (FINDING-62-04)
          await Product.updateMany(
            getOGProductFilter({
              $or: [
                { category: existingCategory._id },
                { categorySlug: previousSlug },
              ],
            }),
            { $set: { categorySlug: slug } },
            { session }
          );
        }

        updatedCategory = existingCategory;
      });
    } finally {
      await session.endSession();
    }

    // Post-commit cache invalidation ONLY (executed only when transaction succeeds)
    await invalidateCategory(slug);
    if (previousSlug !== slug) {
      await invalidateCategory(previousSlug);
      if (Array.isArray(updatedCategory?.previousSlugs)) {
        for (const prev of updatedCategory.previousSlugs) {
          await invalidateCategory(prev);
        }
      }
      await invalidateProduct(null, slug);
      await invalidateProduct(null, previousSlug);
    }

    return Response.json(updatedCategory || existingCategory);
  } catch (error) {
    console.error("[API categories PUT] Error:", error);
    if (error.statusCode === 409 || error.code === 11000) {
      return Response.json(
        { success: false, message: error.message || "Category slug conflict detected.", error: error.message },
        { status: 409 }
      );
    }
    return Response.json(
      { success: false, message: "Failed to update category", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/categories/[id]
 * Deletes an OG category. Requires 'categories:delete' permission.
 * Safety check: Rejects deletion if active products are assigned to this category.
 */
export async function DELETE(request, context) {
  const { error } = await requirePermission(request, "categories", "delete");
  if (error) return error;

  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;

    // Validate ObjectId format (FINDING-62-06)
    if (!mongoose.Types.ObjectId.isValid(id) || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return Response.json(
        { success: false, message: `Invalid category identifier format: "${id}". Expected a 24-character hexadecimal ObjectId.` },
        { status: 400 }
      );
    }

    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return Response.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    // Strict Tenant Isolation (FINDING-601-02)
    if (!isOGCategory(existingCategory)) {
      return Response.json(
        {
          success: false,
          message: "Operation Rejected: You cannot delete or modify unrelated legacy categories.",
        },
        { status: 403 }
      );
    }

    // Safety constraint: Prevent orphaned products
    const productCount = await Product.countDocuments(
      getOGProductFilter({
        $or: [
          { categorySlug: existingCategory.slug },
          { category: existingCategory._id },
        ],
      })
    );

    if (productCount > 0) {
      return Response.json(
        {
          success: false,
          message: `Cannot delete category "${existingCategory.name}" because ${productCount} product(s) are assigned to it. Please reassign or delete those products first.`,
        },
        { status: 409 }
      );
    }

    const { slug, previousSlugs = [] } = existingCategory;
    await Category.findByIdAndDelete(id);

    // Revalidate Public Category Routes
    await invalidateCategory(slug);
    if (Array.isArray(previousSlugs)) {
      for (const prev of previousSlugs) {
        await invalidateCategory(prev);
      }
    }

    return Response.json({
      success: true,
      message: `Category "${existingCategory.name}" deleted successfully.`,
    });
  } catch (error) {
    console.error("[API categories DELETE] Error:", error);
    return Response.json(
      { success: false, message: "Failed to delete category", error: error.message },
      { status: 500 }
    );
  }
}
