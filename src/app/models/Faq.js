import mongoose from "mongoose";

const FaqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  answer: {
    type: String,
    required: true,
    trim: true,
  },
  answerHtml: {
    type: String,
    default: "",
    trim: true,
  },
  category: {
    type: String,
    enum: ["general", "technical", "sizing", "support"],
    default: "general",
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
  relatedLink: {
    label: { type: String, default: "" },
    href: { type: String, default: "" },
  },
  sort: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
}, {
  timestamps: true,
});

if (process.env.NODE_ENV !== "production" && mongoose.models.Faq) {
  delete mongoose.models.Faq;
}

export default mongoose.models.Faq || mongoose.model("Faq", FaqSchema);

