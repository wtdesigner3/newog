import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema(
  {
    // Unique resource identifier matching technicalResources ID
    brandKey: { type: String, default: "og-heavy-duty", index: true },
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: {
      type: String,
      required: true,
      index: true,
      enum: ["catalogues", "manuals", "error-codes", "warranty", "general"],
    },
    categoryName: { type: String, default: "" },
    description: { type: String, default: "" },
    applicableProducts: { type: String, default: "" },
    applicableCategorySlug: { type: String, default: "all" },
    applicableModels: { type: [String], default: [] },
    filePath: { type: String, required: true },
    legacyPaths: { type: [String], default: [] },
    fileType: { type: String, default: "PDF" },
    fileSize: { type: String, default: "" },
    pageCount: { type: Number, default: 0 },
    edition: { type: String, default: "" },
    verified: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
      index: true,
    },
    sort: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Resource ||
  mongoose.model("Resource", ResourceSchema);

