import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import { connectDB } from "../../lib/config";
import GlobalSetting from "../../models/GlobalSetting";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { verifyToken, requirePermission, requireSuperAdmin } from "../../lib/auth";
import { uploadFile, isUploadFile } from "../../../lib/upload";

const handleUploadAndDeleteOld = async (file, folderName, prefix, oldFilePath) => {
  if (!isUploadFile(file)) return null;

  const newUrl = await uploadFile(file, folderName, prefix);

  // Delete old file if exists and is local
  if (oldFilePath && oldFilePath.startsWith("/uploads/")) {
    const oldPathFull = path.join(process.cwd(), "public", oldFilePath);
    if (fs.existsSync(oldPathFull)) {
      try {
        fs.unlinkSync(oldPathFull);
      } catch (e) {
        console.error("Failed to delete old file:", e);
      }
    }
  }

  return newUrl;
};

// GET /api/global-settings — Public site & admin settings reader
// Masks/strips AI API keys for unauthenticated or non-super-admin requests
export async function GET(request) {
  try {
    await connectDB();
    let settingsDoc = await GlobalSetting.findOne();
    if (!settingsDoc) {
      settingsDoc = await GlobalSetting.create({});
    }
    
    let settings = settingsDoc.toObject();

    // Check caller authentication
    const decoded = await verifyToken(request);
    const isSuperAdmin = decoded && decoded.role === 'super_admin';

    // If not super admin, strictly strip third-party AI keys
    if (!isSuperAdmin) {
      delete settings.geminiApiKey;
      delete settings.openRouterApiKey;
      delete settings.groqApiKey;
      delete settings.cerebrasApiKey;
    }

    return Response.json({ success: true, data: settings });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT /api/global-settings — Protected settings updater
export async function PUT(request) {
  const { user, error } = await requirePermission(request, 'global_settings', 'update');
  if (error) return error;

  try {
    await connectDB();
    const formData = await request.formData();

    let settings = await GlobalSetting.findOne();
    if (!settings) {
      settings = new GlobalSetting();
    }

    // Process File Uploads
    const logoImage = formData.get("logoImage");
    if (isUploadFile(logoImage)) {
      const newLogo = await handleUploadAndDeleteOld(
        logoImage,
        "settings",
        "logo",
        settings.logoImage !== "/images/logo.png" ? settings.logoImage : null
      );
      if (newLogo) settings.logoImage = newLogo;
    }

    const adminLogo = formData.get("adminLogo");
    if (isUploadFile(adminLogo)) {
      const newAdminLogo = await handleUploadAndDeleteOld(
        adminLogo,
        "settings",
        "adminlogo",
        settings.adminLogo !== "/images/logo.png" ? settings.adminLogo : null
      );
      if (newAdminLogo) settings.adminLogo = newAdminLogo;
    }

    const favicon = formData.get("favicon");
    if (isUploadFile(favicon)) {
      const newFavicon = await handleUploadAndDeleteOld(
        favicon,
        "settings",
        "favicon",
        settings.favicon !== "/favicon.ico" ? settings.favicon : null
      );
      if (newFavicon) settings.favicon = newFavicon;
    }

    const pdf1Url = formData.get("pdf1Url");
    if (isUploadFile(pdf1Url)) {
      const newPdf = await handleUploadAndDeleteOld(
        pdf1Url,
        "pdf",
        "pdf1",
        settings.pdf1Url !== "/pdf/company-profile.pdf" ? settings.pdf1Url : null
      );
      if (newPdf) settings.pdf1Url = newPdf;
    }

    const pdf2Url = formData.get("pdf2Url");
    if (isUploadFile(pdf2Url)) {
      const newPdf = await handleUploadAndDeleteOld(
        pdf2Url,
        "pdf",
        "pdf2",
        settings.pdf2Url !== "#" ? settings.pdf2Url : null
      );
      if (newPdf) settings.pdf2Url = newPdf;
    }

    // General Text Fields
    const textFields = [
      "adminTitle",
      "footerDescription", "primaryEmail", "primaryPhone", "footerPhone", "address",
      "pdf1Text", "pdf2Text",
      "googleAnalyticsId", "googleTagManagerId", "googleSearchConsoleKey",
      "robotsTxt"
    ];

    textFields.forEach(field => {
      if (formData.has(field)) {
        settings[field] = formData.get(field);
      }
    });

    // Sensitive Fields — Super Admin Only
    if (user.role === 'super_admin') {
      const superAdminFields = [
        "customHeadCode", "customBodyCode",
        "geminiApiKey", "openRouterApiKey", "groqApiKey", "cerebrasApiKey",
        "preferredAiProvider", "aiProviderSequence"
      ];
      superAdminFields.forEach(field => {
        if (formData.has(field)) {
          settings[field] = formData.get(field);
        }
      });
    }

    // Parse Dynamic Social Links
    if (formData.has("socialLinks")) {
      try {
        settings.socialLinks = JSON.parse(formData.get("socialLinks"));
      } catch (e) {
        console.error("Failed to parse social links:", e);
      }
    }

    await settings.save();

    revalidatePath('/', 'layout');

    const cleanData = settings.toObject();
    if (user.role !== 'super_admin') {
      delete cleanData.geminiApiKey;
      delete cleanData.openRouterApiKey;
      delete cleanData.groqApiKey;
      delete cleanData.cerebrasApiKey;
    }

    return Response.json({ success: true, message: "Global Settings updated", data: cleanData });
  } catch (err) {
    console.error("[PUT /api/global-settings] Error:", err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
