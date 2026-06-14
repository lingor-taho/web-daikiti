import assert from "node:assert/strict";
import { test } from "node:test";
import {
  MAX_UPLOAD_BYTES,
  createUploadFileName,
  validateImageUploadFile,
} from "../src/lib/uploads";

test("validateImageUploadFile accepts common web image types within the size limit", () => {
  const file = new File(["demo"], "demo.png", { type: "image/png" });

  assert.deepEqual(validateImageUploadFile(file), { ok: true });
});

test("validateImageUploadFile rejects non-image files", () => {
  const file = new File(["demo"], "demo.txt", { type: "text/plain" });

  assert.deepEqual(validateImageUploadFile(file), {
    ok: false,
    error: "Unsupported file type. Upload a JPEG, PNG, WebP, GIF, or SVG image.",
    status: 400,
  });
});

test("validateImageUploadFile rejects oversized files", () => {
  const file = new File([new Uint8Array(MAX_UPLOAD_BYTES + 1)], "large.jpg", {
    type: "image/jpeg",
  });

  assert.deepEqual(validateImageUploadFile(file), {
    ok: false,
    error: "Image is too large. Maximum upload size is 5MB.",
    status: 413,
  });
});

test("createUploadFileName keeps a safe unique image extension", () => {
  const name = createUploadFileName("My Case 01.PNG", "image/png", () => "fixed-id");

  assert.equal(name, "my-case-01-fixed-id.png");
});
