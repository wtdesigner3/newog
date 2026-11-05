import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../../lib/config";
import Faq from "../../../models/Faq";
import { requirePermission } from "../../../lib/auth";

// GET /api/faqs/[id]
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const item = await Faq.findById(id).lean();
    if (!item) {
      return Response.json({ error: "FAQ not found" }, { status: 404 });
    }
    return Response.json(item);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// PUT /api/faqs/[id] (Requires 'inner_pages' permission)
export async function PUT(request, { params }) {
  const { user, error } = await requirePermission(request, 'inner_pages', 'update');
  if (error) return error;

  try {
    const { id } = await params;
    await connectDB();

    const body = await request.json();
    const existing = await Faq.findById(id);
    if (!existing) {
      return Response.json({ error: "FAQ not found" }, { status: 404 });
    }

    const updated = await Faq.findByIdAndUpdate(
      id,
      {
        $set: {
          question: body.question !== undefined ? body.question.trim() : existing.question,
          answer: body.answer !== undefined ? body.answer.trim() : existing.answer,
          answerHtml: body.answerHtml !== undefined ? body.answerHtml : (body.answer ? body.answer.trim() : existing.answerHtml),
          category: body.category !== undefined ? body.category : existing.category,
          isVerified: body.isVerified !== undefined ? body.isVerified : existing.isVerified,
          relatedLink: body.relatedLink !== undefined ? body.relatedLink : existing.relatedLink,
          sort: body.sort !== undefined ? Number(body.sort) : existing.sort,
          status: body.status !== undefined ? body.status : existing.status,
        },
      },
      { new: true, runValidators: true }
    );

    revalidatePath('/faq', 'page');

    return Response.json({
      message: "FAQ updated successfully",
      data: updated,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/faqs/[id] (Requires 'inner_pages' permission)
export async function DELETE(request, { params }) {
  const { user, error } = await requirePermission(request, 'inner_pages', 'delete');
  if (error) return error;

  try {
    const { id } = await params;
    await connectDB();

    const item = await Faq.findByIdAndDelete(id);
    if (!item) {
      return Response.json({ error: "FAQ not found" }, { status: 404 });
    }

    revalidatePath('/faq', 'page');

    return Response.json({ message: "FAQ deleted successfully" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

