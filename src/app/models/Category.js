import mongoose from "mongoose";
import { deleteFile } from "../../lib/upload.js";

const CategorySchema = new mongoose.Schema(
  {
    // Basic fields (inherited & backwards compatible)
    brandKey: { type: String, default: "og-heavy-duty", index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    previousSlugs: { type: [String], default: [], index: true }, // Preserved historical URL aliases (PHASE 6.3)
    description: { type: String, default: "" },
    breadcrumb: { type: String, default: "" }, // Page breadcrumb label
    image: { type: String, default: "" },
    alt: { type: String, default: "" },
    sort: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },

    // OG Heavy Duty HVAC Category Fields
    shortName: { type: String, default: "" },
    series: { type: String, default: "" },
    badge: { type: String, default: "" },
    tagline: { type: String, default: "" },
    bannerImage: { type: String, default: "" },
    isGif: { type: Boolean, default: false },
    tonnageRange: { type: String, default: "" },
    subcategories: { type: mongoose.Schema.Types.Mixed, default: [] },
    features: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
      index: true,
    },

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

CategorySchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    if (doc.image) await deleteFile(doc.image);
    if (doc.bannerImage) await deleteFile(doc.bannerImage);
  }
});

// Delete cached model so hot-reload always picks up schema changes (dev safety)
export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);
