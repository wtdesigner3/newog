export const dynamic = "force-dynamic";
import { requireAuth } from "../../../lib/auth";
import { checkMediaUsage } from "../../../../lib/mediaUsage";

/**
 * GET /api/files/usage?url=<fileUrl>
 * Inspects where a specific media asset is referenced across Products, Categories, Blogs, and Resources.
 */
export async function GET(request) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get("url");

    if (!fileUrl) {
      return Response.json({ success: false, message: "Query parameter 'url' is required." }, { status: 400 });
    }

    const usage = await checkMediaUsage(fileUrl);
    return Response.json({
      success: true,
      url: fileUrl,
      isReferenced: usage.isReferenced,
      count: usage.count,
      references: usage.references,
    });
  } catch (err) {
    console.error("[API files usage] Error:", err);
    return Response.json({ success: false, message: "Failed to inspect file usage", error: err.message }, { status: 500 });
  }
}
