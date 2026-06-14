import { NextResponse } from "next/server";
import { MAX_UPLOAD_REQUEST_BYTES, saveUploadedImage } from "@/lib/uploads";

export const runtime = "nodejs";

function uploadError(error: string, status: 400 | 413 | 500) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  const contentLength = Number.parseInt(request.headers.get("content-length") ?? "", 10);

  if (Number.isFinite(contentLength) && contentLength > MAX_UPLOAD_REQUEST_BYTES) {
    return uploadError("Image is too large. Maximum upload size is 5MB.", 413);
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return uploadError("Upload must be multipart/form-data with one image file.", 400);
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return uploadError("Upload one image file in the file field.", 400);
  }

  try {
    const result = await saveUploadedImage(file);

    if (!result.ok) {
      return uploadError(result.error, result.status);
    }

    return NextResponse.json({ ok: true, url: result.url });
  } catch {
    return uploadError("Upload could not be saved. Please try again.", 500);
  }
}
