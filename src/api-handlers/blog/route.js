export const dynamic = "force-dynamic";
import { connectDB, connectDBSafe } from "@/app/lib/config";
import Blog from "@/app/models/Blog";
import { requireAuth, requirePermission } from "@/app/lib/auth";
import { uploadFile, isUploadFile } from "@/lib/upload";
import { getOGBlogFilter, BRAND_KEY_OG, isOGBlog } from "@/lib/dbScope";
import { invalidateBlog } from "@/lib/cache/cacheInvalidation";
import { sanitizeRichHtml } from "@/lib/sanitizeHtml";
import { getPublishedBlogs } from "@/lib/services/blogService";

/**
 * GET /api/blog (and /api/blogs)
 * Retrieves OG Heavy Duty HVAC articles. Scoped strictly to OG records (zero steel blogs).
 */
export async function GET(request) {
  try {
    const { user } = await requireAuth(request);
    const conn = await connectDBSafe({ silent: true });
    if (!conn) {
      const fallback = await getPublishedBlogs();
      return Response.json(fallback);
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "50", 10));
    const skip = (page - 1) * limit;
    const search = searchParams.get("search") || searchParams.get("q") || "";
    const status = searchParams.get("status") || "";
    const isPaginated = searchParams.get("paginate") === "true";

    const extraFilter = {};

    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      extraFilter.$or = [
        { title: regex },
        { slug: regex },
        { author: regex },
        { category: regex },
      ];
    }

    const isAdmin = user && (user.role === "super_admin" || user.permissions?.blogs?.includes("read"));

    if (isAdmin) {
      if (status && status !== "all") {
        extraFilter.status = status;
      }
    } else {
      // Public visitors see only published and non-archived articles
      extraFilter.$or = [{ status: "published" }, { isPublished: true }];
      extraFilter.status = { $ne: "archived" };
    }

    const query = getOGBlogFilter(extraFilter);
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ sort: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    if (isPaginated || isAdmin) {
      return Response.json({
        success: true,
        data: blogs,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    }

    return Response.json(blogs, {
      headers: {
        "X-Total-Count": total.toString(),
      },
    });
  } catch (error) {
    console.error("[API blog GET] Error:", error);
    return Response.json(
      { success: false, message: "Failed to fetch blogs", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/blog (and /api/blogs)
 * Creates a new OG blog article. Requires 'blogs:create' permission.
 * Enforces HTML sanitization to prevent stored XSS.
 */
export async function POST(request) {
  const { error } = await requirePermission(request, "blogs", "create");
  if (error) return error;

  try {
    await connectDB();

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

    const title = (body.title || "").trim();
    const slug = (body.slug || "").trim().toLowerCase();

    if (!title || !slug) {
      return Response.json(
        { success: false, message: "Article title and slug are required." },
        { status: 400 }
      );
    }

    // Check duplicate slug
    const existing = await Blog.findOne({ slug });
    if (existing) {
      return Response.json(
        { success: false, message: `Article slug "${slug}" already exists.` },
        { status: 400 }
      );
    }

    // Sanitize Rich HTML content
    const rawContent = body.content || "";
    const sanitizedContent = sanitizeRichHtml(rawContent);

    // Image Uploads
    let coverUrl = body.coverImage || "";
    let breadUrl = body.breadImage || "";

    if (coverFile) {
      coverUrl = await uploadFile(coverFile, "blogs", "cover");
    }
    if (breadFile) {
      breadUrl = await uploadFile(breadFile, "blogs", "bread");
    }

    // Parse tags
    let tags = [];
    if (body.tags) {
      try {
        tags = typeof body.tags === "string" ? JSON.parse(body.tags) : body.tags;
      } catch {
        tags = typeof body.tags === "string" ? body.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
      }
    }

    const status = body.status || (body.isPublished === "false" || body.isPublished === false ? "draft" : "published");
    const isPublished = status === "published";

    const newBlog = await Blog.create({
      brandKey: BRAND_KEY_OG,
      title,
      slug,
      coverImage: coverUrl,
      breadImage: breadUrl,
      alt: body.alt || "",
      bread_heading: body.bread_heading || "",
      excerpt: body.excerpt || "",
      content: sanitizedContent,
      author: body.author || "OG Heavy Duty Technical Team",
      category: body.category || "HVAC Engineering",
      tags,
      status,
      isPublished,
      publishedAt: isPublished ? new Date().toISOString() : "",
      sort: Number(body.sort) || 0,
      metatag: body.metatag || "",
      metaDescription: body.metaDescription || "",
      metakeywords: tags,
      canonicalUrl: body.canonicalUrl || "",
      ogTitle: body.ogTitle || "",
      ogDescription: body.ogDescription || "",
      twitterCard: body.twitterCard || "summary_large_image",
      robots: body.robots || "index, follow",
    });

    // Revalidate Public Website
    await invalidateBlog(slug);

    return Response.json(newBlog, { status: 201 });
  } catch (error) {
    console.error("[API blog POST] Error:", error);
    return Response.json(
      { success: false, message: "Failed to create article", error: error.message },
      { status: 500 }
    );
  }
}
