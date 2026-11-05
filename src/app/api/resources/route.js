export const dynamic = "force-dynamic";
import { connectDB, connectDBSafe } from "../../lib/config";
import Resource from "../../models/Resource";
import { requireAuth, requirePermission } from "../../lib/auth";
import { uploadFile, isUploadFile, deleteFile } from "../../../lib/upload";
import { getOGResourceFilter, BRAND_KEY_OG, isOGResource } from "../../../lib/dbScope";
import { invalidateResources } from "../../../lib/cache/cacheInvalidation";
import { getResources } from "../../../lib/services/resourceService";

const ALLOWED_CATEGORIES = ["catalogues", "manuals", "error-codes", "warranty", "general"];

/**
 * GET /api/resources
 * Retrieves OG technical resources. Scoped strictly to OG records.
 * Supports filtering by category, status, search.
 */
export async function GET(request) {
  try {
    const conn = await connectDBSafe({ silent: true });
    if (!conn) {
      const fallback = await getResources();
      return Response.json(fallback);
    }

    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || searchParams.get("q") || "";

    const { user } = await requireAuth(request);
    const isAdmin = user && (user.role === "super_admin" || user.permissions?.resources?.includes("read"));

    const extraFilter = {};

    if (category && category !== "all") {
      extraFilter.category = category;
    }

    if (isAdmin) {
      if (status && status !== "all") {
        extraFilter.status = status;
      }
    } else {
      // Unauthenticated public visitors or non-admin callers strictly receive published, active resources
      extraFilter.status = "published";
      extraFilter.isActive = { $ne: false };
    }

    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      extraFilter.$or = [
        { title: regex },
        { id: regex },
        { applicableProducts: regex },
        { description: regex },
      ];
    }

    const query = getOGResourceFilter(extraFilter);
    const resources = await Resource.find(query).sort({ sort: 1, createdAt: 1 }).lean();

    return Response.json(resources);
  } catch (error) {
    console.error("[API resources GET] Error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch technical resources", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/resources
 * Creates a new technical resource document.
 * Requires 'resources:create' permission.
 */
export async function POST(request) {
  const { error } = await requirePermission(request, "resources", "create");
  if (error) return error;

  try {
    await connectDB();

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

    const title = (body.title || "").trim();
    let id = (body.id || "").trim().toLowerCase();
    const category = body.category || "manuals";

    if (!title) {
      return Response.json(
        { success: false, message: "Document title is required." },
        { status: 400 }
      );
    }

    if (!id) {
      id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }

    if (!ALLOWED_CATEGORIES.includes(category)) {
      return Response.json(
        {
          success: false,
          message: `Invalid category. Must be one of: ${ALLOWED_CATEGORIES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Check duplicate ID
    const existing = await Resource.findOne({ id });
    if (existing) {
      return Response.json(
        { success: false, message: `Resource identifier "${id}" already exists.` },
        { status: 400 }
      );
    }

    let filePath = body.filePath || "";

    // File handling with security checks
    if (docFile) {
      // Validate PDF mime type and file extension
      const filename = docFile.name || "";
      if (!filename.toLowerCase().endsWith(".pdf")) {
        return Response.json(
          { success: false, message: "Only PDF documents (.pdf) are permitted for technical resources." },
          { status: 400 }
        );
      }

      // Max size: 50MB (Returns HTTP 413 Payload Too Large)
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
    }

    if (!filePath) {
      return Response.json(
        { success: false, message: "A valid PDF file or document URL/path is required." },
        { status: 400 }
      );
    }

    // Parse applicable models
    let applicableModels = [];
    if (body.applicableModels) {
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

    // Legacy Window & Compact Manual safety constraint:
    // If the document is the legacy window manual, restrict it strictly to verified window models
    if (id === "legacy-window-compact-series-manual-2024") {
      const allowedWindowModels = ["OG-12WA3", "OG-18W5IN", "OG-19WA5"];
      applicableModels = applicableModels.filter(m => allowedWindowModels.includes(m));
      if (applicableModels.length === 0) applicableModels = allowedWindowModels;
    }

    const newResource = await Resource.create({
      brandKey: BRAND_KEY_OG,
      id,
      title,
      category,
      categoryName: body.categoryName || category.charAt(0).toUpperCase() + category.slice(1),
      description: body.description || "",
      applicableProducts: body.applicableProducts || "",
      applicableCategorySlug: body.applicableCategorySlug || "all",
      applicableModels,
      filePath,
      fileType: "PDF",
      fileSize: body.fileSize || "1.5 MB",
      pageCount: Number(body.pageCount) || 12,
      edition: body.edition || "2026 Edition",
      verified: true,
      status: body.status || "published",
      isActive: body.status === "published",
      sort: Number(body.sort) || 0,
      downloadCount: 0,
    });

    // Revalidate Public Technical Resources Route
    await invalidateResources();

    return Response.json(newResource, { status: 201 });
  } catch (error) {
    if (docFile && filePath && filePath.startsWith("/uploads/")) {
      try { await deleteFile(filePath); } catch {}
    }
    console.error("[API resources POST] Error:", error);
    return Response.json(
      { success: false, message: "Failed to create resource", error: error.message },
      { status: 500 }
    );
  }
}
