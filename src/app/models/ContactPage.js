import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    isActive: { type: Boolean, default: true },
});

const ContactPageSchema = new mongoose.Schema({
    // Page Header
    headerTitle: { type: String, default: "Contact Us" },
    headerImage: { type: String, default: "" },

    // Contact Section
    contactSubTitle: { type: String, default: "Get In Touch" },
    contactTitle: { type: String, default: "Contact Us" },
    contactDescription: { type: String, default: "Looking for reliable metal solutions? Our experts are ready to assist you." },
    mapIframeUrl: { type: String, default: "" },

    // Locations Array
    locations: { type: [LocationSchema], default: [] },

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
}, { timestamps: true });

export default mongoose.models.ContactPage || mongoose.model("ContactPage", ContactPageSchema);
