/**
 * Global Settings Data Access & Security Sanitization Service
 * Exposes sanitized public settings while strictly stripping sensitive secrets,
 * API keys (Gemini, Groq, Cerebras, OpenRouter), and internal connection strings.
 */
import { connectDBSafe } from "../db.js";
import GlobalSetting from "../../app/models/GlobalSetting.js";

const DEFAULT_PUBLIC_SETTINGS = {
  logoImage: "/images/logo.png",
  favicon: "/favicon.ico",
  adminTitle: "OG Heavy Duty Air Conditioners",
  footerDescription:
    "Engineered in India for demanding Indian climatic conditions. Heavy-duty tropical rotary compressors, 100% grooved copper coils, and proven commercial durability.",
  primaryEmail: "info@ogheavyduty.in",
  primaryPhone: "+91 93235 82341",
  footerPhone: "+91 98765 43210",
  address: "New Delhi, India",
  pdf1Text: "OG Heavy Duty Product Catalogue (2026–2027)",
  pdf1Url: "/documents/og-heavy-duty-catalogue-2026-2027.pdf",
  pdf2Text: "Technical Range Catalogue (2025–2026)",
  pdf2Url: "/documents/og-heavy-duty-catalogue-2025-2026.pdf",
  socialLinks: [
    { platform: "LinkedIn", url: "https://linkedin.com", icon: "bi-linkedin", isActive: true },
    { platform: "Facebook", url: "https://facebook.com", icon: "bi-facebook", isActive: true },
    { platform: "Twitter", url: "https://x.com", icon: "bi-twitter-x", isActive: true },
    { platform: "Instagram", url: "https://instagram.com", icon: "bi-instagram", isActive: true },
  ],
  isMaintenanceMode: false,
  maintenanceMessage: "We are currently undergoing scheduled maintenance. Please check back soon.",
  emergencyShutdown: false,
  googleAnalyticsId: "",
  googleTagManagerId: "",
  googleSearchConsoleKey: "",
  source: "fallback",
};

/**
 * Sanitize settings document by whitelisting safe public properties.
 * Guaranteed to exclude all AI API keys, database URIs, and internal credentials.
 */
export function sanitizePublicSettings(doc) {
  if (!doc) return DEFAULT_PUBLIC_SETTINGS;

  return {
    logoImage: doc.logoImage || DEFAULT_PUBLIC_SETTINGS.logoImage,
    favicon: doc.favicon || DEFAULT_PUBLIC_SETTINGS.favicon,
    adminTitle: doc.adminTitle || DEFAULT_PUBLIC_SETTINGS.adminTitle,
    footerDescription: doc.footerDescription || DEFAULT_PUBLIC_SETTINGS.footerDescription,
    primaryEmail: doc.primaryEmail || DEFAULT_PUBLIC_SETTINGS.primaryEmail,
    primaryPhone: doc.primaryPhone || DEFAULT_PUBLIC_SETTINGS.primaryPhone,
    footerPhone: doc.footerPhone || DEFAULT_PUBLIC_SETTINGS.footerPhone,
    address: doc.address || DEFAULT_PUBLIC_SETTINGS.address,
    pdf1Text: doc.pdf1Text || DEFAULT_PUBLIC_SETTINGS.pdf1Text,
    pdf1Url: doc.pdf1Url || DEFAULT_PUBLIC_SETTINGS.pdf1Url,
    pdf2Text: doc.pdf2Text || DEFAULT_PUBLIC_SETTINGS.pdf2Text,
    pdf2Url: doc.pdf2Url || DEFAULT_PUBLIC_SETTINGS.pdf2Url,
    socialLinks: Array.isArray(doc.socialLinks)
      ? doc.socialLinks.filter((s) => s && s.isActive !== false)
      : DEFAULT_PUBLIC_SETTINGS.socialLinks,
    isMaintenanceMode: Boolean(doc.isMaintenanceMode),
    maintenanceMessage: doc.maintenanceMessage || DEFAULT_PUBLIC_SETTINGS.maintenanceMessage,
    emergencyShutdown: Boolean(doc.emergencyShutdown),
    googleAnalyticsId: doc.googleAnalyticsId || "",
    googleTagManagerId: doc.googleTagManagerId || "",
    googleSearchConsoleKey: doc.googleSearchConsoleKey || "",
    source: "database",
  };
}

/**
 * Get sanitized public settings safe for public client/server components.
 */
export async function getPublicSettings() {
  const conn = await connectDBSafe({ silent: true });

  if (conn) {
    try {
      const doc = await GlobalSetting.findOne().lean();
      if (doc) {
        return sanitizePublicSettings(doc);
      }
    } catch (err) {
      console.warn(`[SettingsService] DB read error: ${err.message}. Engaging fallback settings.`);
    }
  }

  return DEFAULT_PUBLIC_SETTINGS;
}

/**
 * Get full settings (restricted to authenticated admin context).
 */
export async function getAdminSettings() {
  const conn = await connectDBSafe({ silent: true });
  if (!conn) {
    throw new Error("Database unavailable for admin settings retrieval.");
  }
  return await GlobalSetting.findOne().lean();
}
