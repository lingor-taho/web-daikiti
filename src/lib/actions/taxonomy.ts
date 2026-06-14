"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { parseTaxonomyFormData, type TaxonomyInput } from "@/lib/validation/taxonomy";

export type TaxonomyActionState = {
  ok: boolean;
  message: string;
};

type TaxonomyKind = "brand" | "category";

function validationErrorMessage(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  return error.issues
    .map((issue) => {
      const field = issue.path.join(".");
      return field ? `${field}: ${issue.message}` : issue.message;
    })
    .join("\n");
}

function duplicateSlugMessage(kind: TaxonomyKind) {
  return `A ${kind} with this slug already exists.`;
}

function prismaErrorMessage(error: unknown, kind: TaxonomyKind) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return duplicateSlugMessage(kind);
  }

  return `Unable to save the ${kind}.`;
}

function revalidateTaxonomyPaths(adminPath: "/admin/brands" | "/admin/categories") {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  revalidatePath(adminPath);
  revalidatePath("/custom-works");
}

function taxonomyData(input: TaxonomyInput) {
  return {
    name: input.name,
    slug: input.slug,
    sortOrder: input.sortOrder,
    isActive: input.isActive,
  };
}

export async function createBrand(
  _previousState: TaxonomyActionState,
  formData: FormData,
): Promise<TaxonomyActionState> {
  const parsed = parseTaxonomyFormData(formData);

  if (!parsed.success) {
    return { ok: false, message: validationErrorMessage(parsed.error) };
  }

  try {
    const existing = await db.brand.findUnique({
      where: { slug: parsed.data.slug },
      select: { id: true },
    });

    if (existing) {
      return { ok: false, message: duplicateSlugMessage("brand") };
    }

    await db.brand.create({ data: taxonomyData(parsed.data) });
  } catch (error) {
    return { ok: false, message: prismaErrorMessage(error, "brand") };
  }

  revalidateTaxonomyPaths("/admin/brands");
  return { ok: true, message: "Brand created." };
}

export async function createCategory(
  _previousState: TaxonomyActionState,
  formData: FormData,
): Promise<TaxonomyActionState> {
  const parsed = parseTaxonomyFormData(formData);

  if (!parsed.success) {
    return { ok: false, message: validationErrorMessage(parsed.error) };
  }

  try {
    const existing = await db.customCategory.findUnique({
      where: { slug: parsed.data.slug },
      select: { id: true },
    });

    if (existing) {
      return { ok: false, message: duplicateSlugMessage("category") };
    }

    await db.customCategory.create({ data: taxonomyData(parsed.data) });
  } catch (error) {
    return { ok: false, message: prismaErrorMessage(error, "category") };
  }

  revalidateTaxonomyPaths("/admin/categories");
  return { ok: true, message: "Category created." };
}

export async function setBrandActive(id: number, isActive: boolean): Promise<void> {
  try {
    await db.brand.update({
      where: { id },
      data: { isActive },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw new Error("Brand was not found.");
    }

    throw new Error("Unable to update the brand.");
  }

  revalidateTaxonomyPaths("/admin/brands");
}

export async function setCategoryActive(id: number, isActive: boolean): Promise<void> {
  try {
    await db.customCategory.update({
      where: { id },
      data: { isActive },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      throw new Error("Category was not found.");
    }

    throw new Error("Unable to update the category.");
  }

  revalidateTaxonomyPaths("/admin/categories");
}
