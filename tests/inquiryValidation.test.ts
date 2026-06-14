import assert from "node:assert/strict";
import { test } from "node:test";
import { parseInquiryInput } from "../src/lib/validation/inquiry";

test("parseInquiryInput trims valid public contact input", () => {
  const parsed = parseInquiryInput({
    name: "  Jane Customer  ",
    email: "  jane@example.com  ",
    phone: "  555-1234  ",
    inquiryType: "  Custom build  ",
    message: "  I want to discuss a van build.  ",
  });

  assert.equal(parsed.success, true);
  assert.deepEqual(parsed.success ? parsed.data : null, {
    name: "Jane Customer",
    email: "jane@example.com",
    phone: "555-1234",
    inquiryType: "Custom build",
    message: "I want to discuss a van build.",
  });
});

test("parseInquiryInput rejects missing required contact fields", () => {
  const parsed = parseInquiryInput({
    name: "",
    email: "not-an-email",
    message: "",
  });

  assert.equal(parsed.success, false);

  const fieldErrors = parsed.success ? {} : parsed.error.flatten().fieldErrors;
  assert.ok(fieldErrors.name?.includes("Name is required."));
  assert.ok(fieldErrors.email?.includes("Enter a valid email address."));
  assert.ok(fieldErrors.message?.includes("Message is required."));
});
