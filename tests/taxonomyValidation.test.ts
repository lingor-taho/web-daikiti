import assert from "node:assert/strict";
import { test } from "node:test";
import { parseTaxonomyFormData } from "../src/lib/validation/taxonomy";

function formData(entries: Record<string, string>) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(entries)) {
    formData.set(key, value);
  }

  return formData;
}

test("parseTaxonomyFormData accepts explicit checkbox truthy values", () => {
  const parsed = parseTaxonomyFormData(
    formData({
      name: "Toyota",
      slug: "toyota",
      sortOrder: "12",
      isActive: "on",
    }),
  );

  assert.equal(parsed.success, true);
  assert.deepEqual(parsed.success ? parsed.data : null, {
    name: "Toyota",
    slug: "toyota",
    sortOrder: 12,
    isActive: true,
  });
});

test("parseTaxonomyFormData defaults sortOrder to zero and inactive when omitted", () => {
  const parsed = parseTaxonomyFormData(
    formData({
      name: "Custom Van",
      slug: "custom-van",
    }),
  );

  assert.equal(parsed.success, true);
  assert.equal(parsed.success ? parsed.data.sortOrder : null, 0);
  assert.equal(parsed.success ? parsed.data.isActive : null, false);
});

test("parseTaxonomyFormData rejects uppercase and underscore slugs", () => {
  const parsed = parseTaxonomyFormData(
    formData({
      name: "Bad Slug",
      slug: "Bad_slug",
      sortOrder: "0",
      isActive: "true",
    }),
  );

  assert.equal(parsed.success, false);
});
