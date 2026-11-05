import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import mongoose from "mongoose";
import { connectDB } from "@/app/lib/config";
import Enquiry from "@/app/models/Enquiry";
import { requirePermission } from "@/app/lib/auth";
import { sendUpdatedEnquiryEmail } from "@/lib/email";

export async function PUT(request, context) {
  const { user, error } = await requirePermission(request, 'enquiries', 'update');
  if (error) return error;

  try {
    const { id } = await context.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id) || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return Response.json(
        { success: false, message: `Invalid enquiry identifier format: "${id}". Expected a 24-character hexadecimal ObjectId.` },
        { status: 400 }
      );
    }

    await connectDB();
    const data = await request.json();

    // Whitelist allowed updates
    const updateData = {};
    if (data.status) updateData.status = data.status;
    if (typeof data.isRead === 'boolean') updateData.isRead = data.isRead;
    
    // Technical fields if updated
    const allowedTechnicalFields = [
      'standard', 'grade', 'thicknessMin', 'thicknessMax',
      'widthMin', 'widthMax', 'qty', 'surfaceFinish', 'hardness',
      'selectOne', 'uts', 'ys', 'elongation', 'endUse', 'specialRequirements'
    ];
    for (const field of allowedTechnicalFields) {
      if (data[field] !== undefined) {
        updateData[field] = String(data[field]).trim();
      }
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!enquiry) {
      return Response.json({ message: "Enquiry not found" }, { status: 404 });
    }

    // Send email notification if technical details were updated
    if (data.standard || data.qty || data.grade || data.thicknessMin || data.specialRequirements) {
      try {
        await sendUpdatedEnquiryEmail(enquiry);
      } catch (err) {
        console.error("[Email Notification Failed]:", err);
      }
    }

    revalidatePath('/', 'layout');
    return Response.json({ message: "Enquiry updated", data: enquiry });
  } catch (err) {
    return Response.json({ message: "Update failed", error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const { user, error } = await requirePermission(request, 'enquiries', 'delete');
  if (error) return error;

  try {
    const { id } = await context.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id) || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return Response.json(
        { success: false, message: `Invalid enquiry identifier format: "${id}". Expected a 24-character hexadecimal ObjectId.` },
        { status: 400 }
      );
    }

    await connectDB();
    const enquiry = await Enquiry.findByIdAndDelete(id);

    if (!enquiry) {
      return Response.json({ message: "Enquiry not found" }, { status: 404 });
    }

    revalidatePath('/', 'layout');
    return Response.json({ message: "Enquiry deleted successfully" });
  } catch (err) {
    return Response.json({ message: "Delete failed", error: err.message }, { status: 500 });
  }
}
