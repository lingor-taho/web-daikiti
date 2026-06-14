import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const UPLOAD_PUBLIC_PATH = "/uploads/custom-cases";
export const UPLOAD_DIRECTORY = path.join(process.cwd(), "public", "uploads", "custom-cases");

const allowedImageTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/svg+xml", "svg"],
]);

export type UploadValidationResult =
  | { ok: true }
  | {
      error: string;
      ok: false;
      status: 400 | 413;
    };

export function validateImageUploadFile(file: File): UploadValidationResult {
  if (!allowedImageTypes.has(file.type)) {
    return {
      ok: false,
      error: "Unsupported file type. Upload a JPEG, PNG, WebP, GIF, or SVG image.",
      status: 400,
    };
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return {
      ok: false,
      error: "Image is too large. Maximum upload size is 5MB.",
      status: 413,
    };
  }

  return { ok: true };
}

export function createUploadFileName(
  originalName: string,
  mimeType: string,
  idFactory: () => string = randomUUID,
) {
  const fallbackName = "image";
  const parsedName = path.parse(originalName).name || fallbackName;
  const safeBase =
    parsedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || fallbackName;
  const extension = allowedImageTypes.get(mimeType) ?? "img";

  return `${safeBase}-${idFactory()}.${extension}`;
}

export async function saveUploadedImage(file: File) {
  const validation = validateImageUploadFile(file);

  if (!validation.ok) {
    return validation;
  }

  const fileName = createUploadFileName(file.name, file.type);
  const bytes = Buffer.from(await file.arrayBuffer());

  await mkdir(UPLOAD_DIRECTORY, { recursive: true });
  await writeFile(path.join(UPLOAD_DIRECTORY, fileName), bytes, { flag: "wx" });

  return {
    ok: true as const,
    url: `${UPLOAD_PUBLIC_PATH}/${fileName}`,
  };
}
