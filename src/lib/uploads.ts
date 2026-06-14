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

const invalidContentError: UploadValidationResult = {
  ok: false,
  error: "File content does not match the declared image type.",
  status: 400,
};

function hasPrefix(bytes: Uint8Array, prefix: number[]) {
  return prefix.every((byte, index) => bytes[index] === byte);
}

function isValidImageContent(mimeType: string, bytes: Uint8Array) {
  switch (mimeType) {
    case "image/jpeg":
      return hasPrefix(bytes, [0xff, 0xd8, 0xff]);
    case "image/png":
      return hasPrefix(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case "image/webp":
      return (
        bytes.length >= 12 &&
        hasPrefix(bytes, [0x52, 0x49, 0x46, 0x46]) &&
        bytes[8] === 0x57 &&
        bytes[9] === 0x45 &&
        bytes[10] === 0x42 &&
        bytes[11] === 0x50
      );
    case "image/gif":
      return (
        hasPrefix(bytes, [0x47, 0x49, 0x46, 0x38, 0x37, 0x61]) ||
        hasPrefix(bytes, [0x47, 0x49, 0x46, 0x38, 0x39, 0x61])
      );
    case "image/svg+xml":
      return isValidSvgContent(bytes);
    default:
      return false;
  }
}

function isValidSvgContent(bytes: Uint8Array) {
  if (bytes.includes(0x00)) {
    return false;
  }

  let content: string;

  try {
    content = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return false;
  }

  if (/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(content)) {
    return false;
  }

  return /^\uFEFF?\s*(?:<\?xml[\s\S]*?\?>\s*)?(?:<!--[\s\S]*?-->\s*)*<svg(?:\s|>|\/)/i.test(content);
}

export async function validateImageUploadFile(
  file: File,
  fileBytes?: Uint8Array,
): Promise<UploadValidationResult> {
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

  const bytes = fileBytes ?? new Uint8Array(await file.arrayBuffer());

  if (!isValidImageContent(file.type, bytes)) {
    return invalidContentError;
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
  const bytes = Buffer.from(await file.arrayBuffer());
  const validation = await validateImageUploadFile(file, bytes);

  if (!validation.ok) {
    return validation;
  }

  const fileName = createUploadFileName(file.name, file.type);

  await mkdir(UPLOAD_DIRECTORY, { recursive: true });
  await writeFile(path.join(UPLOAD_DIRECTORY, fileName), bytes, { flag: "wx" });

  return {
    ok: true as const,
    url: `${UPLOAD_PUBLIC_PATH}/${fileName}`,
  };
}
