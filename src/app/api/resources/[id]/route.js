export const dynamic = "force-dynamic";
import { connectDB } from "../../../lib/config";
import Resource from "../../../models/Resource";
import { requireAuth, requirePermission } from "../../../lib/auth";
import { uploadFile, isUploadFile, deleteFile } from "../../../../lib/upload";
import { isOGResource, BRAND_KEY_OG } from "../../../../lib/dbScope";
import { invalidateResources } from "../../../../lib/cache/cacheInvalidation";

const ALLOWED_CATEGORIES = ["catalogues", "manuals", "error-codes", "warranty", "general"];

/**
 * GET /api/resources/[id]
 * Retrieves a technical resource document by ID or MongoDB _id.
 */
export async function GET(request, context) {
  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;

    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { id };
    const resource = await Resource.findOne(query).lean();

    if (!resource) {
      return Response.json({ success: false, message: "Resource not found" }, { status: 404 });
    }

    if (!isOGResource(resource)) {
      return Response.json(
        { success: false, message: "Access Denied: Unrelated resource." },
        { status: 403 }
      );
    }

    // Verify publication status for unauthenticated visitors (FINDING-62-03)
    const { user } = await requireAuth(request);
    const isAdmin = user && (user.role === "super_admin" || user.permissions?.resources?.includes("read"));

    if (!isAdmin && (resource.status !== "published" || resource.isActive === false)) {
      return Response.json({ success: false, message: "Resource not found" }, { status: 404 });
    }

    return Response.json(resource);
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to fetch resource", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/resources/[id]
 * Updates technical resource metadata or file. Requires 'resources:update' permission.
 * Validates replacements before replacing existing document.
 */
export async function PUT(request, context) {
  const { error } = await requirePermission(request, "resources", "update");
  if (error) return error;

  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;

    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { id };
    const existingResource = await Resource.findOne(query);

    if (!existingResource) {
      return Response.json({ success: false, message: "Resource not found" }, { status: 404 });
    }

    if (!isOGResource(existingResource)) {
      return Response.json(
        { success: false, message: "Operation Rejected: You cannot edit unrelated records." },
        { status: 403 }
      );
    }

    let body = {};
    const contentType = request.headers.get("content-type") || "";
    let docFile = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        if (key === "file" && isUploadFile(value)) {
          docFile = value;
        } else {
          body[key] = value;
        }
      });
    } else {
      body = await request.json();
    }

    const title = body.title !== undefined ? (body.title || "").trim() : existingResource.title;
    const category = body.category !== undefined ? body.category : existingResource.category;

    if (category && !ALLOWED_CATEGORIES.includes(category)) {
      return Response.json(
        {
          success: false,
          message: `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Safe Replacement: Validate new file before replacing existing file path
    let filePath = existingResource.filePath;
    if (docFile) {
      const filename = docFile.name || "";
      if (!filename.toLowerCase().endsWith(".pdf")) {
        return Response.json(
          { success: false, message: "Only PDF documents (.pdf) are permitted." },
          { status: 400 }
        );
      }
      if (docFile.size > 50 * 1024 * 1024) {
        return Response.json(
          { success: false, message: "File exceeds maximum permitted size of 50MB." },
          { status: 413 }
        );
      }
      try {
        filePath = await uploadFile(docFile, "docs", "resource", { maxSize: 50 * 1024 * 1024 });
      } catch (uploadErr) {
        if (uploadErr.statusCode === 413 || uploadErr.code === 'LIMIT_FILE_SIZE') {
          return Response.json(
            { success: false, message: uploadErr.message },
            { status: 413 }
          );
        }
        return Response.json(
          { success: false, message: uploadErr.message },
          { status: 400 }
        );
      }
    } else if (body.filePath !== undefined && body.filePath.trim()) {
      filePath = body.filePath.trim();
    }

    // Parse applicable models
    let applicableModels = existingResource.applicableModels;
    if (body.applicableModels !== undefined) {
      try {
        applicableModels = typeof body.applicableModels === "string"
          ? JSON.parse(body.applicableModels)
          : body.applicableModels;
      } catch {
        applicableModels = typeof body.applicableModels === "string"
          ? body.applicableModels.split(",").map(s => s.trim()).filter(Boolean)
          : [];
      }
    }

    // Legacy Window manual compatibility restriction
    if (existingResource.id === "legacy-window-compact-series-manual-2024") {
      const allowedWindowModels = ["OG-12WA3", "OG-18W5IN", "OG-19WA5"];
      applicableModels = applicableModels.filter(m => allowedWindowModels.includes(m));
      if (applicableModels.length === 0) applicableModels = allowedWindowModels;
    }

    existingResource.brandKey = BRAND_KEY_OG;
    existingResource.title = title;
    existingResource.category = category;
    if (body.categoryName !== undefined) existingResource.categoryName = body.categoryName;
    if (body.description !== undefined) existingResource.description = body.description;
    if (body.applicableProducts !== undefined) existingResource.applicableProducts = body.applicableProducts;
    if (body.applicableCategorySlug !== undefined) existingResource.applicableCategorySlug = body.applicableCategorySlug;
    existingResource.applicableModels = applicableModels;
    existingResource.filePath = filePath;
    if (body.fileSize !== undefined) existingResource.fileSize = body.fileSize;
    if (body.pageCount !== undefined) existingResource.pageCount = Number(body.pageCount) || 0;
    if (body.edition !== undefined) existingResource.edition = body.edition;
    if (body.status !== undefined) {
      existingResource.status = body.status;
      existingResource.isActive = body.status === "published";
    }
    if (body.sort !== undefined) existingResource.sort = Number(body.sort) || 0;

    await existingResource.save();

    // Revalidate Public Website
    await invalidateResources();

    return Response.json(existingResource);
  } catch (error) {
    console.error("[API resources PUT] Error:", error);
    return Response.json(
      { success: false, message: "Failed to update resource", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/resources/[id]
 * Deletes or archives a resource. Requires 'resources:delete' permission.
 */
export async function DELETE(request, context) {
  const { error } = await requirePermission(request, "resources", "delete");
  if (error) return error;

  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;

    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { id };
    const existing = await Resource.findOne(query);

    if (!existing) {
      return Response.json({ success: false, message: "Resource not found" }, { status: 404 });
    }

    if (!isOGResource(existing)) {
      return Response.json(
        { success: false, message: "Operation Rejected: Unrelated record." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get("hard") === "true";

    if (hardDelete) {
      await Resource.findOneAndDelete(query);
    } else {
      existing.status = "archived";
      existing.isActive = false;
      await existing.save();
    }

    await invalidateResources();

    return Response.json({
      success: true,
      message: hardDelete ? "Resource deleted." : "Resource archived.",
    });
  } catch (error) {
    console.error("[API resources DELETE] Error:", error);
    return Response.json(
      { success: false, message: "Failed to delete resource", error: error.message },
      { status: 500 }
    );
  }
}

