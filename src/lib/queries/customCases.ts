import { Prisma, PublishStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export const customCaseInclude = {
  brand: true,
  categories: {
    include: {
      category: true,
    },
  },
  tags: true,
} satisfies Prisma.CustomCaseInclude;

export type FeaturedCustomCase = Prisma.CustomCaseGetPayload<{
  include: typeof customCaseInclude;
}>;

export type CustomCaseListItem = FeaturedCustomCase;
export type CustomCaseDetail = FeaturedCustomCase;

export async function getFeaturedCustomCases() {
  return db.customCase.findMany({
    where: {
      status: PublishStatus.PUBLISHED,
      isFeatured: true,
    },
    include: customCaseInclude,
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
    take: 3,
  });
}

export async function getActiveBrands() {
  return db.brand.findMany({
    where: {
      isActive: true,
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getActiveCategories() {
  return db.customCategory.findMany({
    where: {
      isActive: true,
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getPublishedCustomCases(filters: { brand?: string; category?: string } = {}) {
  const where: Prisma.CustomCaseWhereInput = {
    status: PublishStatus.PUBLISHED,
  };

  if (filters.brand) {
    where.brand = {
      slug: filters.brand,
    };
  }

  if (filters.category) {
    where.categories = {
      some: {
        category: {
          slug: filters.category,
        },
      },
    };
  }

  return db.customCase.findMany({
    where,
    include: customCaseInclude,
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
  });
}

export async function getCustomCaseBySlug(slug: string) {
  const customCase = await db.customCase.findFirst({
    where: {
      slug,
      status: PublishStatus.PUBLISHED,
    },
    include: customCaseInclude,
  });

  if (!customCase) {
    notFound();
  }

  return customCase;
}

export async function getCustomCaseById(id: number) {
  return db.customCase.findUnique({
    where: { id },
    include: customCaseInclude,
  });
}
