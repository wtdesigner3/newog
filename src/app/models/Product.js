import mongoose from "mongoose";
import { deleteFile } from "../../lib/upload.js";

const ProductSchema = new mongoose.Schema(
  {
    // Basic fields (inherited & backwards compatible)
    brandKey: { type: String, default: "og-heavy-duty", index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false, // Softened from true to prevent hard crashes during schema migrations
    },
    grade: { type: String, default: "" },
    description: { type: String, default: "" }, // Rich text
    breadcrumb: { type: String, default: "" }, // Page breadcrumb label
    image: { type: String, default: "" }, // Banner / card image
    detailImage: { type: String, default: "" }, // Image shown above description on detail page
    alt: { type: String, default: "" },
    sort: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },

    // OG Heavy Duty HVAC Fields
    model: { type: String, default: "", index: true },
    modelNumber: { type: String, default: "" },
    series: { type: String, default: "" },
    tagline: { type: String, default: "" },
    categorySlug: { type: String, default: "", index: true },
    subcategorySlug: { type: String, default: "" },
    tonnage: { type: String, default: "" },
    starRating: { type: String, default: "" },
    technology: { type: String, default: "" },
    compressor: { type: String, default: "" },
    maxAmbient: { type: String, default: "" },
    specs: { type: mongoose.Schema.Types.Mixed, default: {} },
    features: { type: [String], default: [] },
    applications: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
      index: true,
    },
    brochureUrl: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    isFlagship: { type: Boolean, default: false },

    // SEO fields
    metatag: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    metakeywords: { type: [String], default: [] },
    canonicalUrl: { type: String, default: "" },
    ogTitle: { type: String, default: "" },
    ogDescription: { type: String, default: "" },
    twitterCard: { type: String, default: "summary_large_image" },
    robots: { type: String, default: "index, follow" },
    schemaMarkup: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
  }
);

ProductSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    if (doc.image) await deleteFile(doc.image);
    if (doc.detailImage) await deleteFile(doc.detailImage);
  }
});

// Delete cached model so hot-reload always picks up schema changes (dev safety)
export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
