import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { v2 as cloudinary } from 'cloudinary';

// Configure cloudinary only if env vars are present
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const DEDICATED_CLOUDINARY_ACCOUNT = "dpvbgv6nw";
export const DEDICATED_CLOUDINARY_FOLDER = "ogheavyduty";

export const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
export const RESOURCE_MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
export const RESUME_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_FILE_SIZE = DEFAULT_MAX_FILE_SIZE;

const DANGEROUS_EXTENSIONS = [
  '.php', '.phtml', '.phar', '.php3', '.php4', '.php5', '.php7',
  '.exe', '.sh', '.bash', '.bat', '.cmd', '.ps1', '.py', '.pl',
  '.jsp', '.jspx', '.asp', '.aspx', '.cer', '.cgi', '.war', '.js', '.vbs'
];

/**
 * Validate file signature (magic bytes) and enforce allowed MIME types
 */
function detectAndValidateFileType(buffer, originalName = '') {
  const ext = path.extname(originalName).toLowerCase();
  if (DANGEROUS_EXTENSIONS.includes(ext)) {
    throw new Error(`Security Exception: Upload of executable or script file extension '${ext}' is strictly prohibited.`);
  }

  // 1. JPEG check (FF D8 FF)
  if (buffer.length >= 3 && buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return { mime: 'image/jpeg', ext: '.jpg' };
  }

  // 2. PNG check (89 50 4E 47 0D 0A 1A 0A)
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4E &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0D &&
    buffer[5] === 0x0A &&
    buffer[6] === 0x1A &&
    buffer[7] === 0x0A
  ) {
    return { mime: 'image/png', ext: '.png' };
  }

  // 3. WebP check (RIFF .... WEBP)
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return { mime: 'image/webp', ext: '.webp' };
  }

  // 4. PDF check (%PDF-)
  if (buffer.length >= 4 && buffer.subarray(0, 4).toString('ascii') === '%PDF') {
    return { mime: 'application/pdf', ext: '.pdf' };
  }

  // 5. SVG check with strict sanitization
  if (ext === '.svg') {
    const text = buffer.toString('utf8');
    const isXmlOrSvg = /^\s*(<\?xml|<!DOCTYPE|<svg)/i.test(text) && /<svg[\s>]/i.test(text);
    if (!isXmlOrSvg) {
      throw new Error("Invalid SVG file structure.");
    }

    // Check for malicious active script vectors
    const hasScript =
      /<script/i.test(text) ||
      /javascript:/i.test(text) ||
      /\son[a-z]+\s*=/i.test(text) ||
      /<iframe/i.test(text) ||
      /<object/i.test(text) ||
      /<embed/i.test(text);

    if (hasScript) {
      throw new Error("Security Exception: SVG contains forbidden script or executable tags.");
    }

    return { mime: 'image/svg+xml', ext: '.svg' };
  }

  throw new Error("Unsupported or unrecognized file signature. Only JPEG, PNG, WebP, PDF, and clean SVG are permitted.");
}

/**
 * Universal file upload utility
 * Automatically chooses between Cloudinary (if configured) or local filesystem.
 * 
 * @param {File|Blob|Buffer} file - The file to upload (from FormData)
 * @param {string} folder - The subfolder name (e.g., 'about', 'categories')
 * @param {string} prefix - Optional prefix for the filename (e.g., 'banner', 'img')
 * @returns {Promise<string>} - The URL of the uploaded file
 */
export async function uploadFile(file, folder = 'uploads', prefix = '', options = {}) {
  if (!file) return "";

  // Extract buffer and original name
  let buffer;
  let originalName = 'upload.jpg';

  if (file.arrayBuffer && typeof file.arrayBuffer === 'function') {
    const bytes = await file.arrayBuffer();
    buffer = Buffer.from(bytes);
    if (file.name) originalName = file.name;
  } else if (Buffer.isBuffer(file)) {
    buffer = file;
  } else {
    throw new Error("Invalid file format provided to uploadFile");
  }

  // 1. File size cap enforcement with configurable limits
  const customLimit = typeof options === 'number' ? options : options?.maxSize;
  const maxAllowedSize = customLimit || (folder === 'docs' ? RESOURCE_MAX_FILE_SIZE : DEFAULT_MAX_FILE_SIZE);

  if (buffer.length > maxAllowedSize) {
    const limitMB = (maxAllowedSize / (1024 * 1024)).toFixed(0);
    const err = new Error(`File size (${(buffer.length / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed limit of ${limitMB} MB.`);
    err.statusCode = 413;
    err.code = 'LIMIT_FILE_SIZE';
    throw err;
  }

  // 2. Magic byte / Signature inspection
  const detected = detectAndValidateFileType(buffer, originalName);

  // 3. Path traversal defense on target folder
  const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'uploads';
  const safePrefix = prefix ? prefix.replace(/[^a-zA-Z0-9_-]/g, '') + '-' : '';
  const uuid = crypto.randomUUID();
  const finalFileName = `${Date.now()}-${safePrefix}${uuid}${detected.ext}`;

  // 4. Cloud Storage handling (Fail-Closed Enforcement)
  if (process.env.USE_CLOUD_STORAGE === 'true') {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error("Cloud storage is enabled (USE_CLOUD_STORAGE=true) but Cloudinary credentials are not fully configured in environment.");
    }

    if (process.env.CLOUDINARY_CLOUD_NAME !== DEDICATED_CLOUDINARY_ACCOUNT) {
      throw new Error(`Cloudinary Configuration Error: Unauthorized account "${process.env.CLOUDINARY_CLOUD_NAME}". Application is locked to dedicated account "${DEDICATED_CLOUDINARY_ACCOUNT}".`);
    }

    const rootFolder = process.env.CLOUDINARY_ROOT_FOLDER || DEDICATED_CLOUDINARY_FOLDER;
    if (rootFolder !== DEDICATED_CLOUDINARY_FOLDER) {
      throw new Error(`Cloudinary Configuration Error: Unauthorized root folder "${rootFolder}". Must be "${DEDICATED_CLOUDINARY_FOLDER}".`);
    }

    return new Promise((resolve, reject) => {
      const isRaw = detected.ext === '.pdf';
      const publicId = `${Date.now()}-${safePrefix}${uuid}`;

      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: `${rootFolder}/${safeFolder}`,
          public_id: publicId,
          resource_type: isRaw ? 'raw' : 'auto'
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            if (error.http_code === 403) {
              reject(new Error("Cloudinary Authentication Failed (403): Check Cloudinary API credentials."));
            } else {
              reject(error);
            }
          } else {
            resolve(result.secure_url);
          }
        }
      );
      
      uploadStream.end(buffer);
    });
  } 
  
  // 5. Local Filesystem handling
  else {
    const uploadDir = path.join(process.cwd(), `public/uploads/${safeFolder}`);
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, finalFileName);
    fs.writeFileSync(filePath, buffer);
    
    return `/uploads/${safeFolder}/${finalFileName}`;
  }
}

/**
 * Resolves the private storage directory for career resumes.
 * Stored outside the Next.js public directory to prevent direct unauthenticated access.
 */
export function getPrivateResumeDir() {
  return process.env.PRIVATE_RESUME_DIR || path.join(process.cwd(), 'storage', 'resumes');
}

/**
 * Dedicated private resume upload validator & processor (PDF only, max 5 MB).
 * Stores files outside public web root with opaque UUID filenames.
 * 
 * @param {File|Blob|Buffer} file - The uploaded resume file
 * @returns {Promise<{ storageKey: string, originalName: string, size: number, mimeType: string, storageLocation: string }>}
 */
export async function uploadResumeFile(file) {
  if (!file) throw new Error("No resume file provided");
  
  let buffer;
  let originalName = 'resume.pdf';

  if (file.arrayBuffer && typeof file.arrayBuffer === 'function') {
    const bytes = await file.arrayBuffer();
    buffer = Buffer.from(bytes);
    if (file.name) originalName = file.name;
  } else if (Buffer.isBuffer(file)) {
    buffer = file;
  } else {
    throw new Error("Invalid file format provided for resume");
  }

  // 1. File size cap enforcement (5 MB)
  if (buffer.length > RESUME_MAX_FILE_SIZE) {
    const err = new Error(`Resume file size (${(buffer.length / (1024 * 1024)).toFixed(2)} MB) exceeds maximum allowed limit of 5 MB.`);
    err.statusCode = 413;
    err.code = 'LIMIT_FILE_SIZE';
    throw err;
  }

  // 2. Strict PDF signature and structure inspection
  if (buffer.length < 32) {
    throw new Error("Invalid PDF document: File payload is too small.");
  }

  const header = buffer.subarray(0, 5).toString('ascii');
  if (!header.startsWith('%PDF-')) {
    throw new Error("Security Exception: Resume must be a valid PDF document with %PDF- header signature.");
  }

  // Check for standard PDF structure markers (trailer, %%EOF, or /Root) to reject prepended spoofed files
  const tail = buffer.subarray(Math.max(0, buffer.length - 1024)).toString('latin1');
  const bodySample = buffer.subarray(0, Math.min(buffer.length, 4096)).toString('latin1');
  const hasPdfMarker = tail.includes('%%EOF') || bodySample.includes('/Root') || bodySample.includes('/Catalog') || bodySample.includes('/Type');
  if (!hasPdfMarker) {
    throw new Error("Security Exception: Resume file does not exhibit valid PDF structural indicators.");
  }

  // 3. Extension sanitization
  const originalExt = path.extname(originalName).toLowerCase();
  if (DANGEROUS_EXTENSIONS.includes(originalExt) || (originalExt && originalExt !== '.pdf')) {
    throw new Error(`Security Exception: Upload of '${originalExt}' is prohibited. Only PDF resumes are accepted.`);
  }

  const safeOriginalName = path.basename(originalName).replace(/[^a-zA-Z0-9._-]/g, '_');

  // 4. Generate opaque UUID storage key (Never use user-controlled filename as disk path)
  const uuid = crypto.randomUUID();
  const storageKey = `resume-${uuid}.pdf`;

  // 5. Save to private storage directory (OUTSIDE public/)
  const privateDir = getPrivateResumeDir();
  if (!fs.existsSync(privateDir)) {
    fs.mkdirSync(privateDir, { recursive: true });
  }

  const targetPath = path.join(privateDir, storageKey);
  fs.writeFileSync(targetPath, buffer);

  return {
    storageKey,
    originalName: safeOriginalName,
    size: buffer.length,
    mimeType: 'application/pdf',
    storageLocation: 'private_disk',
  };
}

/**
 * Delete a private resume from the private storage directory.
 * Strictly enforces boundary protection against path traversal.
 */
export async function deletePrivateResume(storageKey) {
  if (!storageKey || typeof storageKey !== 'string') return;

  try {
    const cleanKey = path.basename(storageKey);
    const privateDir = path.resolve(getPrivateResumeDir());
    const targetFilePath = path.resolve(privateDir, cleanKey);

    // Prevent Path Traversal
    if (!targetFilePath.startsWith(privateDir)) {
      console.warn("[Security] Path traversal attempt blocked during private resume deletion:", storageKey);
      return;
    }

    if (fs.existsSync(targetFilePath)) {
      fs.unlinkSync(targetFilePath);
    }
  } catch (err) {
    console.error("[Private Storage] Resume deletion error:", err);
  }
}

/**
 * Helper to check if a value is a valid file for upload from FormData
 */
export function isUploadFile(file) {
  return file && typeof file !== "string" && file.size > 0 && typeof file.arrayBuffer === "function";
}

/**
 * Universal file deletion utility
 * Confines deletions strictly to public/uploads directory.
 */
export async function deleteFile(fileUrl) {
  if (!fileUrl || typeof fileUrl !== 'string') return;

  // Handle private resume URLs / keys
  if (fileUrl.startsWith('/api/career/resumes/') || fileUrl.startsWith('resume-')) {
    const key = fileUrl.replace('/api/career/resumes/', '');
    return deletePrivateResume(key);
  }

  if (process.env.USE_CLOUD_STORAGE === 'true' && process.env.CLOUDINARY_CLOUD_NAME) {
    if (process.env.CLOUDINARY_CLOUD_NAME !== DEDICATED_CLOUDINARY_ACCOUNT) {
      console.warn(`[Cloudinary Security] Blocked deletion attempt on non-dedicated cloud account: ${process.env.CLOUDINARY_CLOUD_NAME}`);
      return;
    }
    try {
      const resourceMatch = fileUrl.match(/\/(image|raw|video)\/upload\//);
      const resourceType = resourceMatch ? resourceMatch[1] : 'image';

      const uploadIndex = fileUrl.indexOf('/upload/');
      if (uploadIndex === -1) return;
      
      let pathAfterUpload = fileUrl.substring(uploadIndex + 8);
      if (pathAfterUpload.match(/^v\d+\//)) {
        pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '');
      }
      
      const publicId = pathAfterUpload.substring(0, pathAfterUpload.lastIndexOf('.')) || pathAfterUpload;
      
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (err) {
      console.error("[Cloudinary] Deletion error:", err);
    }
  } else {
    try {
      const cleanRelativePath = fileUrl.replace(/^\/+/, '');
      const uploadsBase = path.resolve(process.cwd(), 'public', 'uploads');
      const targetFilePath = path.resolve(process.cwd(), 'public', cleanRelativePath);

      // Prevent Path Traversal attacks
      if (!targetFilePath.startsWith(uploadsBase)) {
        console.warn("[Security] Path traversal attempt blocked during file deletion:", fileUrl);
        return;
      }

      if (fs.existsSync(targetFilePath)) {
        fs.unlinkSync(targetFilePath);
      }
    } catch (err) {
      console.error("[Local Disk] Deletion error:", err);
    }
  }
}
