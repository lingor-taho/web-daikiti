"use server";

import { Prisma, PublishStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { parseCustomCaseFormData, type CustomCaseInput } from "@/lib/validation/customCase";

export type CustomCaseActionState = {
  ok: boolean;
  message: string;
};

type ParsedCustomCase = CustomCaseInput;

function uniqueValues<T>(values: T[]) {
  return Array.from(new Set(values));
}

function nullableText(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

function buildCustomCaseData({ data }: ParsedCustomCase) {
  return {
    title: data.title,
    slug: data.slug,
    brandId: data.brandId,
    modelName: nullableText(data.modelName),
    summary: data.summary,
    coverImage: data.coverImage,
    beforeImage: nullableText(data.beforeImage),
    afterImage: nullableText(data.afterImage),
    content: data.content,
    galleryJson: data.galleryJson,
    status: data.status,
    isFeatured: data.isFeatured,
    sortOrder: data.sortOrder,
    publishedAt: data.status === PublishStatus.PUBLISHED ? new Date() : null,
  } satisfies Prisma.CustomCaseUncheckedCreateInput;
}

function validationErrorMessage(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  return error.issues
    .map((issue) => {
      const field = issue.path.join(".");
      return field ? `${field}: ${issue.message}` : issue.message;
    })
    .join("\n");
}

function revalidateCustomCasePaths(slugs: string[]) {
  revalidatePath("/");
  revalidatePath("/custom-works");
  revalidatePath("/admin/custom-cases");

  for (const slug of uniqueValues(slugs.filter(Boolean))) {
    revalidatePath(`/custom-works/${slug}`);
  }
}

function prismaErrorMessage(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return "A custom case with this slug already exists.";
  }

  return "Unable to save the custom case.";
}

export async function createCustomCaseAction(formData: FormData): Promise<void> {
  const parsed = parseCustomCaseFormData(formData);

  if (!parsed.success) {
    throw new Error(validationErrorMessage(parsed.error));
  }

  const categoryIds = uniqueValues(parsed.data.relations.categoryIds);
  const tags = uniqueValues(parsed.data.relations.tags);

  try {
    await db.customCase.create({
      data: {
        ...buildCustomCaseData(parsed.data),
        categories: {
          create: categoryIds.map((categoryId) => ({ categoryId })),
        },
        tags: {
          create: tags.map((name) => ({ name })),
        },
      },
    });
  } catch (error) {
    throw new Error(prismaErrorMessage(error));
  }

  revalidateCustomCasePaths([parsed.data.data.slug]);
  redirect("/admin/custom-cases");
}

export async function updateCustomCaseAction(
  id: number,
  formData: FormData,
): Promise<void> {
  const parsed = parseCustomCaseFormData(formData);

  if (!parsed.success) {
    throw new Error(validationErrorMessage(parsed.error));
  }

  const categoryIds = uniqueValues(parsed.data.relations.categoryIds);
  const tags = uniqueValues(parsed.data.relations.tags);
  let previousSlug = "";

  try {
    await db.$transaction(async (tx) => {
      const existing = await tx.customCase.findUnique({
        where: { id },
        select: { slug: true },
      });

      if (!existing) {
        throw new Error("NOT_FOUND");
      }

      previousSlug = existing.slug;

      await tx.customCase.update({
        where: { id },
        data: buildCustomCaseData(parsed.data),
      });

      await tx.customCaseCategory.deleteMany({
        where: { customCaseId: id },
      });

      if (categoryIds.length > 0) {
        await tx.customCaseCategory.createMany({
          data: categoryIds.map((categoryId) => ({
            customCaseId: id,
            categoryId,
          })),
        });
      }

      await tx.customCaseTag.deleteMany({
        where: { customCaseId: id },
      });

      if (tags.length > 0) {
        await tx.customCaseTag.createMany({
          data: tags.map((name) => ({
            customCaseId: id,
            name,
          })),
        });
      }
    });
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      throw new Error("Custom case was not found.");
    }

    throw new Error(prismaErrorMessage(error));
  }

  revalidateCustomCasePaths([previousSlug, parsed.data.data.slug]);
  redirect("/admin/custom-cases");
}
