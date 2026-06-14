import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { after, before, test } from "node:test";
import path from "node:path";
import type { PrismaClient } from "@prisma/client";
import type * as TaxonomyActions from "../src/lib/actions/taxonomy";

const testSlugPrefix = "task-9-taxonomy-test";
const testDbFile = path.join(process.cwd(), "prisma", `${testSlugPrefix}-${process.pid}.db`);
const testDatabaseUrl = `file:./${path.basename(testDbFile)}`;
const prismaCli = require.resolve("prisma/build/index.js");

let db: PrismaClient;
let actions: typeof TaxonomyActions;

function taxonomyFormData(values: Record<string, string>) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }

  return formData;
}

before(async () => {
  process.env.NODE_ENV = "test";
  process.env.DATABASE_URL = testDatabaseUrl;

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
  const importedActions = await import("../src/lib/actions/taxonomy");

  db = importedDb.db;
  actions = importedActions;
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

test("createBrand creates an inactive brand with parsed integer sort order", async () => {
  const result = await actions.createBrand(
    { ok: false, message: "" },
    taxonomyFormData({
      name: "Task 9 Brand",
      slug: `${testSlugPrefix}-brand`,
      sortOrder: "7",
    }),
  );

  const brand = await db.brand.findUniqueOrThrow({
    where: { slug: `${testSlugPrefix}-brand` },
  });

  assert.deepEqual(result, { ok: true, message: "Brand created." });
  assert.equal(brand.name, "Task 9 Brand");
  assert.equal(brand.sortOrder, 7);
  assert.equal(brand.isActive, false);
});

test("createCategory returns a controlled error for duplicate slugs", async () => {
  const values = {
    name: "Task 9 Category",
    slug: `${testSlugPrefix}-category`,
    sortOrder: "0",
    isActive: "true",
  };

  await actions.createCategory({ ok: false, message: "" }, taxonomyFormData(values));
  const result = await actions.createCategory({ ok: false, message: "" }, taxonomyFormData(values));

  assert.equal(result.ok, false);
  assert.equal(result.message, "A category with this slug already exists.");
});
