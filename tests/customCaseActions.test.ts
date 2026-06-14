import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { execFileSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import type { PrismaClient, PublishStatus as PublishStatusType } from "@prisma/client";
import type * as CustomCaseActions from "../src/lib/actions/customCases";

const testSlugPrefix = "task-8-action-test";
const testDbFile = path.join(process.cwd(), "prisma", `${testSlugPrefix}-${process.pid}.db`);
const testDatabaseUrl = `file:./${path.basename(testDbFile)}`;
const prismaCli = require.resolve("prisma/build/index.js");

let db: PrismaClient;
let actions: typeof CustomCaseActions;
let publishStatus: typeof PublishStatusType;
let brandId: number;
let categoryId: number;
let customCaseId: number;

function assertTestDatabaseUrl(databaseUrl: string | undefined) {
  assert.ok(databaseUrl, "DATABASE_URL must be set explicitly for this test.");
  assert.match(databaseUrl, /test/i, "DATABASE_URL must be test-scoped.");
  assert.doesNotMatch(databaseUrl, /dev\.db/i, "DATABASE_URL must not point at dev.db.");
}

before(async () => {
  Object.assign(process.env, {
    DATABASE_URL: testDatabaseUrl,
    NODE_ENV: "test",
  });
  assertTestDatabaseUrl(process.env.DATABASE_URL);

  for (const file of [testDbFile, `${testDbFile}-journal`]) {
    if (existsSync(file)) {
      rmSync(file);
    }
  }

  execFileSync(process.execPath, [prismaCli, "migrate", "deploy", "--schema", "prisma/schema.prisma"], {
    cwd: process.cwd(),
    env: { ...process.env, DATABASE_URL: testDatabaseUrl, RUST_LOG: "info" },
    stdio: "pipe",
  });

  const importedDb = await import("../src/lib/db");
  const importedActions = await import("../src/lib/actions/customCases");
  const importedClient = await import("@prisma/client");

  db = importedDb.db;
  actions = importedActions;
  publishStatus = importedClient.PublishStatus;

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
      status: publishStatus.PUBLISHED,
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
  if (db) {
    await db.$disconnect();
  }

  for (const file of [testDbFile, `${testDbFile}-journal`]) {
    if (existsSync(file)) {
      rmSync(file);
    }
  }
});

test("uses an isolated sqlite database instead of dev.db", () => {
  assertTestDatabaseUrl(process.env.DATABASE_URL);
  assert.equal(process.env.DATABASE_URL, testDatabaseUrl);
  assert.ok(existsSync(testDbFile));
});

test("unpublishCustomCase sets status to draft and clears publishedAt", async () => {
  await actions.unpublishCustomCase(customCaseId);

  const customCase = await db.customCase.findUniqueOrThrow({
    where: { id: customCaseId },
    select: { publishedAt: true, status: true },
  });

  assert.equal(customCase.status, publishStatus.DRAFT);
  assert.equal(customCase.publishedAt, null);
});

test("deleteCustomCase removes the case and cascading relation rows", async () => {
  await actions.deleteCustomCase(customCaseId);

  const [customCaseCount, categoryRelationCount, tagCount] = await Promise.all([
    db.customCase.count({ where: { id: customCaseId } }),
    db.customCaseCategory.count({ where: { customCaseId } }),
    db.customCaseTag.count({ where: { customCaseId } }),
  ]);

  assert.equal(customCaseCount, 0);
  assert.equal(categoryRelationCount, 0);
  assert.equal(tagCount, 0);
});
