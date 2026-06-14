import { z } from "zod";

const explicitBoolean = z.preprocess((value) => {
  if (value === true || value === "true" || value === "on" || value === "1") {
    return true;
  }

  if (
    value === false ||
    value === "false" ||
    value === "off" ||
    value === "0" ||
    value === null ||
    value === undefined
  ) {
    return false;
  }

  return value;
}, z.boolean());

export const taxonomySchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  sortOrder: z.coerce.number().int("Sort order must be an integer.").default(0),
  isActive: explicitBoolean.default(false),
});

export function parseTaxonomyFormData(formData: FormData) {
  return taxonomySchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    isActive: formData.get("isActive"),
  });
}

export type TaxonomyInput = z.infer<typeof taxonomySchema>;
