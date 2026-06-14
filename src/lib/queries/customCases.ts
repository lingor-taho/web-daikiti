import { Prisma, PublishStatus } from "@prisma/client";
import { db } from "@/lib/db";

const featuredCustomCaseInclude = {
  brand: true,
  categories: {
    include: {
      category: true,
    },
  },
  tags: true,
} satisfies Prisma.CustomCaseInclude;

export type FeaturedCustomCase = Prisma.CustomCaseGetPayload<{
  include: typeof featuredCustomCaseInclude;
}>;

export async function getFeaturedCustomCases() {
  return db.customCase.findMany({
    where: {
      status: PublishStatus.PUBLISHED,
      isFeatured: true,
    },
    include: featuredCustomCaseInclude,
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
    take: 3,
  });
}
