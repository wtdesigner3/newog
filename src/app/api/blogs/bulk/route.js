export const dynamic = "force-dynamic";
import mongoose from "mongoose";
import { connectDB } from "../../../lib/config";
import Blog from "../../../models/Blog";
import { requirePermission } from "../../../lib/auth";
import { getOGBlogFilter } from "../../../../lib/dbScope";
import { invalidateBlog } from "../../../../lib/cache/cacheInvalidation";

const MAX_BATCH_LIMIT = 50;
const ALLOWED_ACTIONS = ["publish", "unpublish", "archive"];

/**
 * POST /api/blogs/bulk
 * Perform scoped bulk administrative operations on OG Heavy Duty blog articles.
 * Requires 'blogs:update' permission.
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

    const { action, ids } = body || {};

    if (!action || !ALLOWED_ACTIONS.includes(action)) {
      return Response.json(
        {
          success: false,
          message: `Invalid action "${action}". Allowed actions: ${ALLOWED_ACTIONS.join(", ")}.`,
        },
        { status: 400 }
      );
    }

    const { error: permError } = await requirePermission(request, "blogs", "update");
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
          { success: false, message: `Invalid article identifier format: "${id}". Expected 24-char ObjectId.` },
          { status: 400 }
        );
      }
      validObjectIds.push(new mongoose.Types.ObjectId(id));
    }

    await connectDB();

    let updateFields = {};
    if (action === "publish") {
      updateFields = { status: "published", isPublished: true };
    } else if (action === "unpublish") {
      updateFields = { status: "draft", isPublished: false };
    } else if (action === "archive") {
      updateFields = { status: "archived", isPublished: false };
    }

    // Strictly scope update to OG Heavy Duty records only
    const filter = getOGBlogFilter({ _id: { $in: validObjectIds } });
    const result = await Blog.updateMany(filter, { $set: updateFields });

    // Cache invalidation
    try {
      await invalidateBlog();
    } catch (cacheErr) {
      console.warn("[Bulk Blogs] Cache invalidation warning:", cacheErr.message);
    }

    return Response.json({
      success: true,
      action,
      count: result.modifiedCount,
      matched: result.matchedCount,
      affectedIds: ids,
      message: `Successfully executed ${action} on ${result.modifiedCount} article(s).`,
    });
  } catch (error) {
    console.error("[API blogs bulk] Error:", error);
    return Response.json(
      { success: false, message: "Bulk blog operation failed", error: error.message },
      { status: 500 }
    );
  }
}

