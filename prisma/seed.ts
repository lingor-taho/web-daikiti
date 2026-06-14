import { PrismaClient, PublishStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const brands = [
    ["TOYOTA", "toyota"],
    ["LEXUS", "lexus"],
    ["NISSAN", "nissan"],
    ["HONDA", "honda"],
    ["Imported Cars", "imported"],
  ];

  for (const [index, [name, slug]] of brands.entries()) {
    await prisma.brand.upsert({
      where: { slug },
      update: { name, sortOrder: index, isActive: true },
      create: { name, slug, sortOrder: index, isActive: true },
    });
  }

  const categories = [
    ["Before / After", "before-after"],
    ["Exterior", "exterior"],
    ["Interior", "interior"],
    ["Paint", "paint"],
    ["Parts", "parts"],
  ];

  for (const [index, [name, slug]] of categories.entries()) {
    await prisma.customCategory.upsert({
      where: { slug },
      update: { name, sortOrder: index, isActive: true },
      create: { name, slug, sortOrder: index, isActive: true },
    });
  }

  const toyota = await prisma.brand.findUniqueOrThrow({
    where: { slug: "toyota" },
  });
  const beforeAfter = await prisma.customCategory.findUniqueOrThrow({
    where: { slug: "before-after" },
  });
  const exterior = await prisma.customCategory.findUniqueOrThrow({
    where: { slug: "exterior" },
  });

  await prisma.customCase.upsert({
    where: { slug: "sample-before-after" },
    update: {
      title: "TOYOTA Custom Before / After",
      brandId: toyota.id,
      modelName: "Sample Model",
      summary:
        "Exterior and interior updates that sharpen the vehicle's presence while keeping everyday usability intact.",
      coverImage: "/images/placeholders/custom-case-1.jpg",
      beforeImage: "/images/placeholders/before.jpg",
      afterImage: "/images/placeholders/after.jpg",
      content:
        "<h2>Work Details</h2><p>We reviewed the vehicle condition, refreshed the exterior stance, and adjusted interior details for a cleaner custom finish.</p>",
      status: PublishStatus.PUBLISHED,
      isFeatured: true,
      sortOrder: 0,
      publishedAt: new Date(),
      categories: {
        deleteMany: {},
        create: [
          { categoryId: beforeAfter.id },
          { categoryId: exterior.id },
        ],
      },
      tags: {
        deleteMany: {},
        create: [{ name: "custom" }, { name: "before-after" }],
      },
    },
    create: {
      title: "TOYOTA Custom Before / After",
      slug: "sample-before-after",
      brandId: toyota.id,
      modelName: "Sample Model",
      summary:
        "Exterior and interior updates that sharpen the vehicle's presence while keeping everyday usability intact.",
      coverImage: "/images/placeholders/custom-case-1.jpg",
      beforeImage: "/images/placeholders/before.jpg",
      afterImage: "/images/placeholders/after.jpg",
      content:
        "<h2>Work Details</h2><p>We reviewed the vehicle condition, refreshed the exterior stance, and adjusted interior details for a cleaner custom finish.</p>",
      status: PublishStatus.PUBLISHED,
      isFeatured: true,
      sortOrder: 0,
      publishedAt: new Date(),
      categories: {
        create: [
          { categoryId: beforeAfter.id },
          { categoryId: exterior.id },
        ],
      },
      tags: {
        create: [{ name: "custom" }, { name: "before-after" }],
      },
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
