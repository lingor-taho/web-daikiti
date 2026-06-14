import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { PublishStatus } from "@prisma/client";
import { deleteCustomCase, unpublishCustomCase } from "../src/lib/actions/customCases";
import { db } from "../src/lib/db";

const testSlugPrefix = "task-8-action-test";

let brandId: number;
let categoryId: number;
let customCaseId: number;

before(async () => {
  await db.customCase.deleteMany({
    where: {
      slug: {
        startsWith: testSlugPrefix,
      },
    },
  });

  const brand = await db.brand.upsert({
    where: { slug: `${testSlugPrefix}-brand` },
    update: {},
    create: {
      name: "Task 8 Action Test Brand",
      slug: `${testSlugPrefix}-brand`,
    },
  });
  brandId = brand.id;

  const category = await db.customCategory.upsert({
    where: { slug: `${testSlugPrefix}-category` },
    update: {},
    create: {
      name: "Task 8 Action Test Category",
      slug: `${testSlugPrefix}-category`,
    },
  });
  categoryId = category.id;

  const customCase = await db.customCase.create({
    data: {
      title: "Task 8 Action Test Case",
      slug: `${testSlugPrefix}-case`,
      brandId,
      summary: "Case used to verify Task 8 actions.",
      coverImage: "/images/custom-works/camper-van.jpg",
      content: "<p>Test content</p>",
      status: PublishStatus.PUBLISHED,
      publishedAt: new Date("2026-01-01T00:00:00.000Z"),
      categories: {
        create: [{ categoryId }],
      },
      tags: {
        create: [{ name: "task8" }],
      },
    },
  });
  customCaseId = customCase.id;
});

after(async () => {
  await db.customCase.deleteMany({
    where: {
      slug: {
        startsWith: testSlugPrefix,
      },
    },
  });
  await db.customCategory.deleteMany({ where: { slug: `${testSlugPrefix}-category` } });
  await db.brand.deleteMany({ where: { slug: `${testSlugPrefix}-brand` } });
  await db.$disconnect();
});

test("unpublishCustomCase sets status to draft and clears publishedAt", async () => {
  await unpublishCustomCase(customCaseId);

  const customCase = await db.customCase.findUniqueOrThrow({
    where: { id: customCaseId },
    select: { publishedAt: true, status: true },
  });

  assert.equal(customCase.status, PublishStatus.DRAFT);
  assert.equal(customCase.publishedAt, null);
});

test("deleteCustomCase removes the case and cascading relation rows", async () => {
  await deleteCustomCase(customCaseId);

  const [customCaseCount, categoryRelationCount, tagCount] = await Promise.all([
    db.customCase.count({ where: { id: customCaseId } }),
    db.customCaseCategory.count({ where: { customCaseId } }),
    db.customCaseTag.count({ where: { customCaseId } }),
  ]);

  assert.equal(customCaseCount, 0);
  assert.equal(categoryRelationCount, 0);
  assert.equal(tagCount, 0);
});
