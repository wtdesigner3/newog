import { revalidatePath } from "next/cache";
export const dynamic = 'force-dynamic';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth } from "../../lib/auth";
import { deleteFile, DEDICATED_CLOUDINARY_ACCOUNT, DEDICATED_CLOUDINARY_FOLDER } from "../../../lib/upload";
import { checkMediaUsage } from "../../../lib/mediaUsage";

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Helper to check media module permissions
function hasMediaPermission(user, action) {
  if (user?.role === 'super_admin') return true;
  return (
    user?.hasPermission?.('media', action) ||
    user?.hasPermission?.('files', action) ||
    user?.hasPermission?.('file_manager', action) ||
    false
  );
}

// Helper to recursively list local files
function getAllLocalFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      // Strictly exclude private resumes directory from public media
      if (!file.toLowerCase().includes('resume')) {
        arrayOfFiles = getAllLocalFiles(fullPath, arrayOfFiles);
      }
    } else {
      if (!file.startsWith('.') && !file.toLowerCase().includes('resume')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

const IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'];
const VIDEO_FORMATS = ['mp4', 'mov', 'avi', 'mkv', 'webm'];

/**
 * GET /api/files
 * Lists uploaded media assets with search, module filtering, and pagination.
 */
export async function GET(request) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  if (!hasMediaPermission(user, 'read')) {
    return Response.json({ success: false, message: "Forbidden: Media read permission required." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').toLowerCase().trim();
    const type = (searchParams.get('type') || 'all').toLowerCase(); // all, image, document, video
    const moduleFilter = (searchParams.get('module') || 'all').toLowerCase(); // all, products, categories, blogs, resources, etc.
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '30', 10)));
    const checkUsageParam = searchParams.get('checkUsage') === 'true';

    let allFiles = [];
    let source = 'local';

    const isCloudStorage = process.env.USE_CLOUD_STORAGE === 'true' && process.env.CLOUDINARY_CLOUD_NAME;

    if (isCloudStorage) {
      source = 'cloudinary';
      const rootFolder = process.env.CLOUDINARY_ROOT_FOLDER || DEDICATED_CLOUDINARY_FOLDER;
      const folderPrefix = moduleFilter !== 'all' ? `${rootFolder}/${moduleFilter}` : `${rootFolder}/`;

      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folderPrefix,
        max_results: 500,
      });

      allFiles = (result.resources || [])
        // Strictly exclude private resume uploads
        .filter(res => !res.public_id.includes('/resumes/') && !res.public_id.includes('resume-'))
        .map(res => {
          const parts = res.public_id.split('/');
          const filename = parts.pop();
          const folder = parts.slice(1).join('/'); // remove rootFolder
          return {
            id: res.public_id,
            filename: filename || res.public_id,
            name: filename || res.public_id,
            url: res.secure_url,
            format: (res.format || '').toLowerCase(),
            sizeBytes: res.bytes || 0,
            size: res.bytes || 0,
            createdAt: res.created_at,
            updatedAt: res.created_at,
            folder: folder || 'general',
            module: folder || 'general',
            source: 'cloudinary',
          };
        });
    } else {
      source = 'local';
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      const localFilePaths = getAllLocalFiles(uploadDir);

      allFiles = localFilePaths.map(filePath => {
        const stat = fs.statSync(filePath);
        const relativePath = filePath.replace(path.join(process.cwd(), 'public'), '').replace(/\\/g, '/');
        const filename = path.basename(filePath);
        const format = path.extname(filePath).replace('.', '').toLowerCase();
        
        // Extract subfolder from /uploads/products/...
        const parts = relativePath.split('/').filter(Boolean);
        const folder = parts.length > 2 ? parts[1] : 'general';

        return {
          id: relativePath,
          filename,
          name: filename,
          url: relativePath,
          format,
          sizeBytes: stat.size,
          size: stat.size,
          createdAt: stat.birthtime,
          updatedAt: stat.mtime || stat.birthtime,
          folder,
          module: folder,
          source: 'local',
        };
      });
    }

    // Sort newest first
    allFiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Filter by type
    if (type !== 'all') {
      allFiles = allFiles.filter(f => {
        if (type === 'image') return IMAGE_FORMATS.includes(f.format);
        if (type === 'video') return VIDEO_FORMATS.includes(f.format);
        if (type === 'document') return !IMAGE_FORMATS.includes(f.format) && !VIDEO_FORMATS.includes(f.format);
        return true;
      });
    }

    // Filter by module/subfolder (for local or Cloudinary)
    if (moduleFilter !== 'all') {
      allFiles = allFiles.filter(f => f.folder.toLowerCase().includes(moduleFilter));
    }

    // Search by filename or id
    if (search) {
      allFiles = allFiles.filter(f => 
        f.filename.toLowerCase().includes(search) || 
        f.id.toLowerCase().includes(search) ||
        f.url.toLowerCase().includes(search)
      );
    }

    const totalCount = allFiles.length;
    const startIndex = (page - 1) * limit;
    const paginatedFiles = allFiles.slice(startIndex, startIndex + limit);

    // Optionally attach usage references
    if (checkUsageParam) {
      await Promise.all(
        paginatedFiles.map(async (file) => {
          const usage = await checkMediaUsage(file.url);
          file.isReferenced = usage.isReferenced;
          file.referenceCount = usage.count;
          file.references = usage.references;
        })
      );
    }

    return Response.json({
      success: true,
      data: paginatedFiles,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      source,
    });
  } catch (err) {
    console.error("[API files GET] Error:", err);
    return Response.json({ success: false, message: "Failed to fetch files", error: err.message }, { status: 500 });
  }
}

/**
 * DELETE /api/files?url=<fileUrl>
 * Deletes an uploaded media asset.
 * Safe Deletion: Rejects deletion if file is currently referenced in Products, Categories, Blogs, or Resources.
 */
export async function DELETE(request) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  if (!hasMediaPermission(user, 'delete')) {
    return Response.json({ success: false, message: "Forbidden: Media delete permission required." }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('url');

    if (!fileUrl) {
      return Response.json({ success: false, message: "Query parameter 'url' is required." }, { status: 400 });
    }

    // Reference Check: Block deletion if referenced by existing CMS records
    const usage = await checkMediaUsage(fileUrl);
    if (usage.isReferenced) {
      return Response.json(
        {
          success: false,
          blocked: true,
          message: `Cannot delete asset: It is currently referenced by ${usage.count} CMS record(s). Please remove these associations before deleting.`,
          references: usage.references,
        },
        { status: 409 }
      );
    }

    await deleteFile(fileUrl);
    revalidatePath('/', 'layout');

    return Response.json({
      success: true,
      message: "Media asset deleted successfully.",
      url: fileUrl,
    });
  } catch (err) {
    console.error("[API files DELETE] Error:", err);
    return Response.json({ success: false, message: "Failed to delete file", error: err.message }, { status: 500 });
  }
}
