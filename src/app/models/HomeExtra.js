import mongoose from "mongoose";

const HomeExtraSchema = new mongoose.Schema({
  // Why Choose Us / Benchmarks Section
  choose_badge: { type: String, default: "" },
  choose_title: { type: String, default: "" },
  choose_subtitle: { type: String, default: "" },

  // Products Showcase Section
  product_badge: { type: String, default: "" },
  product_title: { type: String, default: "" },
  product_subtitle: { type: String, default: "" },

  // Milestones & Certified Section
  certified_badge: { type: String, default: "" },
  certified_title: { type: String, default: "" },
  certified_subtitle: { type: String, default: "" },

  // Clientele / Our Work Section
  work_badge: { type: String, default: "" },
  work_title: { type: String, default: "" },
  work_subtitle: { type: String, default: "" },

  // Blog & Technical Articles Section
  blog_badge: { type: String, default: "" },
  blog_title: { type: String, default: "" },
  blog_subtitle: { type: String, default: "" },

  // Commercial Enquiry / CTA Section
  contact_badge: { type: String, default: "" },
  contact_title: { type: String, default: "" },
  contact_subtitle: { type: String, default: "" },
}, {
  timestamps: true,
});

if (process.env.NODE_ENV !== "production" && mongoose.models.HomeExtra) {
  delete mongoose.models.HomeExtra;
}

export default mongoose.models.HomeExtra || mongoose.model("HomeExtra", HomeExtraSchema);
