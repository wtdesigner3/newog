import mongoose from "mongoose";
import { deleteFile } from "../../lib/upload.js";

const BlogSchema = new mongoose.Schema({
    brandKey: { type: String, default: "og-heavy-duty", index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    coverImage: { type: String, default: "" },
    alt: { type: String, default: "" },
    breadImage: { type: String, default: "" },
    bread_heading: { type: String, default: "" },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    author: { type: String, default: "" },
    category: { type: String, default: "" },
    tags: { type: [String], default: [] },
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "published",
        index: true,
    },
    isPublished: { type: Boolean, default: true },
    sort: { type: Number, default: 0 },
    publishedAt: { type: String, default: "" },

    // SEO fields (matching About.js structure as requested)
    metatag: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    metakeywords: { type: [String], default: [] },
    canonicalUrl: { type: String, default: '' },
    ogTitle: { type: String, default: '' },
    ogDescription: { type: String, default: '' },
    twitterCard: { type: String, default: 'summary_large_image' },
    robots: { type: String, default: 'index, follow' },
    schemaMarkup: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

BlogSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        if (doc.coverImage) await deleteFile(doc.coverImage);
        if (doc.breadImage) await deleteFile(doc.breadImage);
    }
});
// Delete cached model so hot-reload always picks up schema changes (dev safety)
export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
