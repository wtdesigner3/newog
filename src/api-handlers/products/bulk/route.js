export const dynamic = "force-dynamic";
import mongoose from "mongoose";
import { connectDB } from "@/app/lib/config";
import Product from "@/app/models/Product";
import Category from "@/app/models/Category";
import { requirePermission } from "@/app/lib/auth";
import { getOGProductFilter, isOGCategory } from "@/lib/dbScope";
import { invalidateProduct, invalidateCatalog } from "@/lib/cache/cacheInvalidation";

const MAX_BATCH_LIMIT = 50;
const ALLOWED_ACTIONS = ["publish", "unpublish", "archive", "assign-category"];

/**
 * POST /api/products/bulk
 * Perform scoped bulk administrative operations on OG Heavy Duty products.
 * Requires 'products:update' permission.
 */
export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { success: false, message: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const { action, ids, categoryId } = body || {};

    if (!action || !ALLOWED_ACTIONS.includes(action)) {
      return Response.json(
        {
          success: false,
          message: `Invalid action "${action}". Allowed actions: ${ALLOWED_ACTIONS.join(", ")}.`,
        },
        { status: 400 }
      );
    }

    const permissionAction = action === "delete" ? "delete" : "update";
    const { error: permError } = await requirePermission(request, "products", permissionAction);
    if (permError) return permError;

    if (!Array.isArray(ids) || ids.length === 0) {
      return Response.json(
        { success: false, message: "IDs array must contain between 1 and 50 items." },
        { status: 400 }
      );
    }

    if (ids.length > MAX_BATCH_LIMIT) {
      return Response.json(
        {
          success: false,
          message: `Batch limit exceeded: Maximum ${MAX_BATCH_LIMIT} items permitted per bulk request. Received ${ids.length}.`,
        },
        { status: 400 }
      );
    }

    // Validate ObjectIds format (FINDING-62-06 hardening)
    const validObjectIds = [];
    for (const id of ids) {
      if (!mongoose.Types.ObjectId.isValid(id) || !/^[0-9a-fA-F]{24}$/.test(id)) {
        return Response.json(
          { success: false, message: `Invalid product identifier format: "${id}". Expected 24-char ObjectId.` },
          { status: 400 }
        );
      }
      validObjectIds.push(new mongoose.Types.ObjectId(id));
    }

    await connectDB();

    // Prepare update operation
    let updateFields = {};
    if (action === "publish") {
      updateFields = { status: "published", isActive: true };
    } else if (action === "unpublish") {
      updateFields = { status: "draft", isActive: false };
    } else if (action === "archive") {
      updateFields = { status: "archived", isActive: false };
    } else if (action === "assign-category") {
      if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
        return Response.json(
          { success: false, message: "A valid categoryId is required for assign-category bulk action." },
          { status: 400 }
        );
      }

      const targetCat = await Category.findById(categoryId).lean();
      if (!targetCat || !isOGCategory(targetCat)) {
        return Response.json(
          { success: false, message: "Referenced category not found or does not belong to OG Heavy Duty." },
          { status: 400 }
        );
      }

      updateFields = {
        category: targetCat._id,
        categorySlug: targetCat.slug,
      };
    }

    // Strictly scope update to OG Heavy Duty records only
    const filter = getOGProductFilter({ _id: { $in: validObjectIds } });
    const result = await Product.updateMany(filter, { $set: updateFields });

    // Cache invalidation
    try {
      await invalidateProduct();
      await invalidateCatalog();
    } catch (cacheErr) {
      console.warn("[Bulk Products] Cache invalidation warning:", cacheErr.message);
    }

    return Response.json({
      success: true,
      action,
      count: result.modifiedCount,
      matched: result.matchedCount,
      affectedIds: ids,
      message: `Successfully executed ${action} on ${result.modifiedCount} product(s).`,
    });
  } catch (error) {
    console.error("[API products bulk] Error:", error);
    return Response.json(
      { success: false, message: "Bulk product operation failed", error: error.message },
      { status: 500 }
    );
  }
}

