import assert from "node:assert/strict";
import { test } from "node:test";
import {
  MAX_UPLOAD_BYTES,
  createUploadFileName,
  validateImageUploadFile,
} from "../src/lib/uploads";

const validPngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

test("validateImageUploadFile accepts a PNG with a valid byte signature", async () => {
  const file = new File([validPngBytes], "demo.png", { type: "image/png" });

  assert.deepEqual(await validateImageUploadFile(file), { ok: true });
});

test("validateImageUploadFile rejects non-image files", async () => {
  const file = new File(["demo"], "demo.txt", { type: "text/plain" });

  assert.deepEqual(await validateImageUploadFile(file), {
    ok: false,
    error: "Unsupported file type. Upload a JPEG, PNG, WebP, GIF, or SVG image.",
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
