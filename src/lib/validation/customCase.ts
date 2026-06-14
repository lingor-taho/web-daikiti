import { PublishStatus } from "@prisma/client";
import { z } from "zod";

const optionalImagePath = z.string().trim().optional().or(z.literal(""));

const parseableJsonString = z
  .string()
  .trim()
  .default("[]")
  .refine((value) => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }, "Gallery images must be valid JSON.");

const checkboxBoolean = z.preprocess(
  (value) => value === true || value === "true" || value === "on" || value === "1",
  z.boolean(),
);

const relationTags = z.preprocess((value) => {
  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  if (Array.isArray(value)) {
    return value
      .flatMap((tag) => (typeof tag === "string" ? tag.split(",") : tag))
      .map((tag) => (typeof tag === "string" ? tag.trim() : tag))
      .filter(Boolean);
  }

  return value;
}, z.array(z.string().trim().min(1)).default([]));

export const customCaseScalarSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  brandId: z.coerce.number().int().positive("Select a brand."),
  modelName: z.string().trim().optional().or(z.literal("")),
  summary: z.string().trim().min(1, "Summary is required."),
  coverImage: z.string().trim().min(1, "Cover image URL is required."),
  beforeImage: optionalImagePath,
  afterImage: optionalImagePath,
  content: z.string().trim().min(1, "Content is required."),
  galleryJson: parseableJsonString,
  status: z.enum(PublishStatus),
  isFeatured: checkboxBoolean,
  sortOrder: z.coerce.number().int().default(0),
  publishedAt: z.string().trim().optional().or(z.literal("")),
});

export const customCaseRelationSchema = z.object({
  categoryIds: z.array(z.coerce.number().int().positive()).default([]),
  tags: relationTags,
});

export const customCaseSchema = customCaseScalarSchema
  .merge(customCaseRelationSchema)
  .transform(({ categoryIds, tags, ...data }) => ({
    data,
    relations: {
      categoryIds,
      tags,
    },
  }));

export function parseCustomCaseFormData(formData: FormData) {
  const flatInput = Object.fromEntries(formData.entries());

  return customCaseSchema.safeParse({
    ...flatInput,
    categoryIds: formData.getAll("categoryIds"),
    tags: flatInput.tags ?? "",
  });
}

export type CustomCaseScalarInput = z.infer<typeof customCaseScalarSchema>;
export type CustomCaseRelationInput = z.infer<typeof customCaseRelationSchema>;
export type CustomCaseInput = z.infer<typeof customCaseSchema>;
export type CustomCaseFormInput = z.input<typeof customCaseSchema>;
