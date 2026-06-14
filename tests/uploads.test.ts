import assert from "node:assert/strict";
import { test } from "node:test";
import {
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_REQUEST_BYTES,
  createUploadFileName,
  validateImageUploadFile,
} from "../src/lib/uploads";
import { POST } from "../src/app/admin/uploads/route";

const validPngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

test("validateImageUploadFile accepts a PNG with a valid byte signature", async () => {
  const file = new File([validPngBytes], "demo.png", { type: "image/png" });

  assert.deepEqual(await validateImageUploadFile(file), { ok: true });
});

test("validateImageUploadFile rejects non-image files", async () => {
  const file = new File(["demo"], "demo.txt", { type: "text/plain" });

  assert.deepEqual(await validateImageUploadFile(file), {
    ok: false,
    error: "Unsupported file type. Upload a JPEG, PNG, WebP, or GIF image.",
    status: 400,
  });
});

test("validateImageUploadFile rejects SVG uploads", async () => {
  const file = new File(["<svg viewBox=\"0 0 1 1\"></svg>"], "demo.svg", {
    type: "image/svg+xml",
  });

  assert.deepEqual(await validateImageUploadFile(file), {
    ok: false,
    error: "Unsupported file type. Upload a JPEG, PNG, WebP, or GIF image.",
    status: 400,
  });
});

test("validateImageUploadFile rejects oversized files", async () => {
  const file = new File([new Uint8Array(MAX_UPLOAD_BYTES + 1)], "large.jpg", {
    type: "image/jpeg",
  });

  assert.deepEqual(await validateImageUploadFile(file), {
    ok: false,
    error: "Image is too large. Maximum upload size is 5MB.",
    status: 413,
  });
});

test("validateImageUploadFile rejects text content spoofed as PNG", async () => {
  const file = new File(["not really an image"], "spoof.png", { type: "image/png" });

  assert.deepEqual(await validateImageUploadFile(file), {
    ok: false,
    error: "File content does not match the declared image type.",
    status: 400,
  });
});

test("createUploadFileName keeps a safe unique image extension", () => {
  const name = createUploadFileName("My Case 01.PNG", "image/png", () => "fixed-id");

  assert.equal(name, "my-case-01-fixed-id.png");
});

test("upload route rejects obviously oversized requests before parsing multipart data", async () => {
  const response = await POST(
    new Request("http://localhost/admin/uploads", {
      headers: {
        "content-length": String(MAX_UPLOAD_REQUEST_BYTES + 1),
      },
      method: "POST",
    }),
  );

  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: "Image is too large. Maximum upload size is 5MB.",
  });
});

test("upload route returns shaped JSON for multipart parse failures", async () => {
  const response = await POST(
    new Request("http://localhost/admin/uploads", {
      body: "not a multipart body",
      headers: {
        "content-type": "multipart/form-data; boundary=broken",
      },
      method: "POST",
    }),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: "Upload must be multipart/form-data with one image file.",
  });
});
