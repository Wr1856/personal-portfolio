export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
] as const;

export const PDF_MIME_TYPE = "application/pdf";

export const UPLOAD_LIMITS = {
  image: 5 * 1024 * 1024, // 5 MB
  resume: 8 * 1024 * 1024, // 8 MB
  certificate: 15 * 1024 * 1024, // 15 MB
} as const;

export type UploadKind = "image" | "resume" | "certificate";

type UploadRule = {
  maxBytes: number;
  mimeTypes: readonly string[];
  extensions: readonly string[];
};

export const UPLOAD_RULES: Record<UploadKind, UploadRule> = {
  image: {
    maxBytes: UPLOAD_LIMITS.image,
    mimeTypes: IMAGE_MIME_TYPES,
    extensions: IMAGE_EXTENSIONS,
  },
  resume: {
    maxBytes: UPLOAD_LIMITS.resume,
    mimeTypes: [PDF_MIME_TYPE],
    extensions: [".pdf"],
  },
  certificate: {
    maxBytes: UPLOAD_LIMITS.certificate,
    mimeTypes: [PDF_MIME_TYPE, ...IMAGE_MIME_TYPES],
    extensions: [".pdf", ...IMAGE_EXTENSIONS],
  },
};

export type FileValidationError = "too_large" | "invalid_type";

export function validateUpload(
  file: { name: string; size: number; type: string },
  kind: UploadKind,
): FileValidationError | null {
  const rule = UPLOAD_RULES[kind];
  if (file.size > rule.maxBytes) return "too_large";
  const extension = file.name
    .slice(file.name.lastIndexOf("."))
    .toLowerCase();
  if (!rule.extensions.includes(extension)) return "invalid_type";
  if (!rule.mimeTypes.includes(file.type)) return "invalid_type";
  return null;
}

/**
 * Builds a safe, unique object path: a sanitized base name plus a random
 * suffix, preserving only the validated extension.
 */
export function buildSafeObjectPath(originalName: string, prefix: string): string {
  const extension = originalName
    .slice(originalName.lastIndexOf("."))
    .toLowerCase();
  const base = originalName
    .slice(0, originalName.lastIndexOf("."))
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "file";
  const unique = crypto.randomUUID();
  return `${prefix}/${base}-${unique}${extension}`;
}
