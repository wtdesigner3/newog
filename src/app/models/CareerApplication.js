import mongoose from "mongoose";

const CareerApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    position: { type: String, default: "General Application", trim: true },
    experienceYears: { type: String, default: "", trim: true },
    message: { type: String, default: "", trim: true },
    resumeUrl: { type: String, default: "" },
    resumeKey: { type: String, default: null, trim: true },
    resumeOriginalName: { type: String, default: "resume.pdf", trim: true },
    resumeSize: { type: Number, default: 0 },
    resumeMime: { type: String, default: "application/pdf" },
    status: { type: String, enum: ['new', 'reviewed', 'shortlisted', 'rejected'], default: 'new' },
  },
  { timestamps: true }
);

export default mongoose.models.CareerApplication || mongoose.model("CareerApplication", CareerApplicationSchema);

