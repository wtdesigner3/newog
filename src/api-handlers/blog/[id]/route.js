export const dynamic = "force-dynamic";
import mongoose from "mongoose";
import { connectDB } from "@/app/lib/config";
import Blog from "@/app/models/Blog";
import { requireAuth, requirePermission } from "@/app/lib/auth";
import { uploadFile, isUploadFile } from "@/lib/upload";
import { isOGBlog, BRAND_KEY_OG } from "@/lib/dbScope";
import { invalidateBlog } from "@/lib/cache/cacheInvalidation";
import { sanitizeRichHtml } from "@/lib/sanitizeHtml";

/**
 * GET /api/blog/[id]
 * Retrieves single article by _id or slug.
 */
export async function GET(request, context) {
  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;

    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
    const blog = await Blog.findOne(query).lean();

    if (!blog) {
      return Response.json({ success: false, message: "Article not found" }, { status: 404 });
    }

    if (!isOGBlog(blog)) {
      return Response.json(
        { success: false, message: "Access Denied: Unrelated record." },
        { status: 403 }
      );
    }

    // Verify publication status for unauthenticated visitors (FINDING-62-03)
    const { user } = await requireAuth(request);
    const isAdmin = user && (user.role === "super_admin" || user.permissions?.blogs?.includes("read"));

    if (!isAdmin && (blog.status !== "published" || blog.isPublished === false)) {
      return Response.json({ success: false, message: "Article not found" }, { status: 404 });
    }

    return Response.json(blog);
  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to fetch article", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/blog/[id]
 * Updates an OG article. Requires 'blogs:update' permission.
 * Strictly verifies ownership to protect legacy steel blogs from mutation (FINDING-601-02).
 */
export async function PUT(request, context) {
  const { error } = await requirePermission(request, "blogs", "update");
  if (error) return error;

  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;

    // Validate ObjectId format (FINDING-62-06)
    if (!mongoose.Types.ObjectId.isValid(id) || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return Response.json(
        { success: false, message: `Invalid article identifier format: "${id}". Expected a 24-character hexadecimal ObjectId.` },
        { status: 400 }
      );
    }

    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return Response.json({ success: false, message: "Article not found" }, { status: 404 });
    }

    // Strict Tenant Isolation (FINDING-601-02)
    if (!isOGBlog(existingBlog)) {
      return Response.json(
        {
          success: false,
          message: "Operation Rejected: You cannot edit or modify unrelated legacy articles.",
        },
        { status: 403 }
      );
    }

    let body = {};
    const contentType = request.headers.get("content-type") || "";

    let coverFile = null;
    let breadFile = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        if (key === "coverImage" && isUploadFile(value)) {
          coverFile = value;
        } else if (key === "breadImage" && isUploadFile(value)) {
          breadFile = value;
        } else {
          body[key] = value;
        }
      });
    } else {
      body = await request.json();
    }

    const title = body.title !== undefined ? (body.title || "").trim() : existingBlog.title;
    const slug = body.slug !== undefined ? (body.slug || "").trim().toLowerCase() : existingBlog.slug;

    if (!title || !slug) {
      return Response.json(
        { success: false, message: "Title and slug cannot be empty." },
        { status: 400 }
      );
    }

    // Check slug collision against OTHER articles
    if (slug !== existingBlog.slug) {
      const duplicateSlug = await Blog.findOne({ slug, _id: { $ne: id } });
      if (duplicateSlug) {
        return Response.json(
          { success: false, message: `Slug "${slug}" is already in use.` },
          { status: 400 }
        );
      }
    }

    // Image Uploads
    let coverUrl = existingBlog.coverImage;
    let breadUrl = existingBlog.breadImage;

    if (coverFile) {
      coverUrl = await uploadFile(coverFile, "blogs", "cover");
    } else if (body.coverImage !== undefined && typeof body.coverImage === "string") {
      coverUrl = body.coverImage;
    }

    if (breadFile) {
      breadUrl = await uploadFile(breadFile, "blogs", "bread");
    } else if (body.breadImage !== undefined && typeof body.breadImage === "string") {
      breadUrl = body.breadImage;
    }

    // Sanitize HTML
    let sanitizedContent = existingBlog.content;
    if (body.content !== undefined) {
      sanitizedContent = sanitizeRichHtml(body.content);
    }

    // Tags
    let tags = existingBlog.tags || [];
    if (body.tags !== undefined) {
      try {
        tags = typeof body.tags === "string" ? JSON.parse(body.tags) : body.tags;
      } catch {
        tags = typeof body.tags === "string" ? body.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
      }
    }

    const previousSlug = existingBlog.slug;

    // Apply updates
    existingBlog.brandKey = BRAND_KEY_OG;
    existingBlog.title = title;
    existingBlog.slug = slug;
    existingBlog.content = sanitizedContent;
    if (body.excerpt !== undefined) existingBlog.excerpt = body.excerpt;
    if (body.author !== undefined) existingBlog.author = body.author;
    if (body.category !== undefined) existingBlog.category = body.category;
    existingBlog.coverImage = coverUrl;
    existingBlog.breadImage = breadUrl;
    existingBlog.tags = tags;
    if (body.alt !== undefined) existingBlog.alt = body.alt;
    if (body.bread_heading !== undefined) existingBlog.bread_heading = body.bread_heading;

    if (body.status !== undefined) {
      existingBlog.status = body.status;
      existingBlog.isPublished = body.status === "published";
    } else if (body.isPublished !== undefined) {
      const pub = body.isPublished === true || body.isPublished === "true";
      existingBlog.isPublished = pub;
      existingBlog.status = pub ? "published" : "draft";
    }

    if (body.sort !== undefined) existingBlog.sort = Number(body.sort) || 0;
    if (body.metatag !== undefined) existingBlog.metatag = body.metatag;
    if (body.metaDescription !== undefined) existingBlog.metaDescription = body.metaDescription;
    existingBlog.metakeywords = tags;
    if (body.canonicalUrl !== undefined) existingBlog.canonicalUrl = body.canonicalUrl;
    if (body.ogTitle !== undefined) existingBlog.ogTitle = body.ogTitle;
    if (body.ogDescription !== undefined) existingBlog.ogDescription = body.ogDescription;

    await existingBlog.save();

    // Revalidate Public Website
    await invalidateBlog(slug);
    if (previousSlug !== slug) {
      await invalidateBlog(previousSlug);
    }

    return Response.json(existingBlog);
  } catch (error) {
    console.error("[API blog PUT] Error:", error);
    return Response.json(
      { success: false, message: "Failed to update article", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/blog/[id]
 * Deletes or archives an article. Requires 'blogs:delete' permission.
 * Strictly verifies ownership to protect legacy steel blogs (FINDING-601-02).
 */
export async function DELETE(request, context) {
  const { error } = await requirePermission(request, "blogs", "delete");
  if (error) return error;

  try {
    await connectDB();
    const params = await context.params;
    const { id } = params;

    // Validate ObjectId format (FINDING-62-06)
    if (!mongoose.Types.ObjectId.isValid(id) || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return Response.json(
        { success: false, message: `Invalid article identifier format: "${id}". Expected a 24-character hexadecimal ObjectId.` },
        { status: 400 }
      );
    }

    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return Response.json({ success: false, message: "Article not found" }, { status: 404 });
    }

    // Strict Tenant Isolation (FINDING-601-02)
    if (!isOGBlog(existingBlog)) {
      return Response.json(
        {
          success: false,
          message: "Operation Rejected: You cannot delete or modify unrelated legacy articles.",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const hardDelete = searchParams.get("hard") === "true";
    const { slug } = existingBlog;

    if (hardDelete) {
      await Blog.findByIdAndDelete(id);
    } else {
      existingBlog.status = "archived";
      existingBlog.isPublished = false;
      await existingBlog.save();
    }

    // Revalidate Public Website
    await invalidateBlog(slug);

    return Response.json({
      success: true,
      message: hardDelete ? "Article deleted." : "Article archived.",
    });
  } catch (error) {
    console.error("[API blog DELETE] Error:", error);
    return Response.json(
      { success: false, message: "Failed to delete article", error: error.message },
      { status: 500 }
    );
  }
}
