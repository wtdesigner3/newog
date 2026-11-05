export const dynamic = "force-dynamic";
import mongoose from "mongoose";
import { connectDB } from "../../../lib/config";
import Resource from "../../../models/Resource";
import { requirePermission } from "../../../lib/auth";
import { getOGResourceFilter } from "../../../../lib/dbScope";
import { invalidateResources } from "../../../../lib/cache/cacheInvalidation";

const MAX_BATCH_LIMIT = 50;
const ALLOWED_ACTIONS = ["publish", "unpublish", "archive"];

/**
 * POST /api/resources/bulk
 * Perform scoped bulk administrative operations on OG Heavy Duty technical resources.
 * Requires 'resources:update' permission.
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

    const { error: permError } = await requirePermission(request, "resources", "update");
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

    await connectDB();

    // Build identifier match conditions
    const orConditions = [];
    for (const id of ids) {
      if (typeof id !== "string" || !id.trim()) continue;
      const cleanId = id.trim();
      if (mongoose.Types.ObjectId.isValid(cleanId) && /^[0-9a-fA-F]{24}$/.test(cleanId)) {
        orConditions.push({ _id: new mongoose.Types.ObjectId(cleanId) });
        orConditions.push({ id: cleanId });
      } else {
        orConditions.push({ id: cleanId });
      }
    }

    if (orConditions.length === 0) {
      return Response.json(
        { success: false, message: "No valid resource identifiers provided." },
        { status: 400 }
      );
    }

    let updateFields = {};
    if (action === "publish") {
      updateFields = { status: "published", isActive: true };
    } else if (action === "unpublish") {
      updateFields = { status: "draft", isActive: false };
    } else if (action === "archive") {
      updateFields = { status: "archived", isActive: false };
    }

    // Strictly scope update to OG Heavy Duty records only
    const filter = getOGResourceFilter({ $or: orConditions });
    const result = await Resource.updateMany(filter, { $set: updateFields });

    // Cache invalidation
    try {
      await invalidateResources();
    } catch (cacheErr) {
      console.warn("[Bulk Resources] Cache invalidation warning:", cacheErr.message);
    }

    return Response.json({
      success: true,
      action,
      count: result.modifiedCount,
      matched: result.matchedCount,
      affectedIds: ids,
      message: `Successfully executed ${action} on ${result.modifiedCount} resource(s).`,
    });
  } catch (error) {
    console.error("[API resources bulk] Error:", error);
    return Response.json(
      { success: false, message: "Bulk resource operation failed", error: error.message },
      { status: 500 }
    );
  }
}

