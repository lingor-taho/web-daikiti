import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { after, before, test } from "node:test";
import path from "node:path";
import type { InquiryStatus as InquiryStatusType, PrismaClient } from "@prisma/client";
import type * as InquiryActions from "../src/lib/actions/inquiries";

const testSlugPrefix = "task-10-inquiry-action-test";
const testDbFile = path.join(process.cwd(), "prisma", `${testSlugPrefix}-${process.pid}.db`);
const testDatabaseUrl = `file:./${path.basename(testDbFile)}`;
const prismaCli = require.resolve("prisma/build/index.js");

let db: PrismaClient;
let actions: typeof InquiryActions;
let inquiryStatus: typeof InquiryStatusType;
let inquiryId: number;

function assertTestDatabaseUrl(databaseUrl: string | undefined) {
  assert.ok(databaseUrl, "DATABASE_URL must be set explicitly for this test.");
  assert.match(databaseUrl, /test/i, "DATABASE_URL must be test-scoped.");
  assert.doesNotMatch(databaseUrl, /dev\.db/i, "DATABASE_URL must not point at dev.db.");
}

before(async () => {
  process.env.NODE_ENV = "test";
  process.env.DATABASE_URL = testDatabaseUrl;
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
  const importedActions = await import("../src/lib/actions/inquiries");
  const importedClient = await import("@prisma/client");

  db = importedDb.db;
  actions = importedActions;
  inquiryStatus = importedClient.InquiryStatus;

  const inquiry = await db.inquiry.create({
    data: {
      name: "Task 10 Test Customer",
      email: "task10@example.com",
      message: "Please contact me about a custom build.",
    },
  });
  inquiryId = inquiry.id;
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

test("setInquiryRead updates inquiry status", async () => {
  await actions.setInquiryRead(inquiryId, true);

  const inquiry = await db.inquiry.findUniqueOrThrow({
    where: { id: inquiryId },
    select: { status: true },
  });

  assert.equal(inquiry.status, inquiryStatus.READ);
});

test("updateInquiryMemo stores trimmed memo text", async () => {
  const formData = new FormData();
  formData.set("adminMemo", "  Follow up next week.  ");
  formData.set("status", inquiryStatus.UNREAD);

  await actions.updateInquiryMemo(inquiryId, formData);

  const inquiry = await db.inquiry.findUniqueOrThrow({
    where: { id: inquiryId },
    select: { adminMemo: true, status: true },
  });

  assert.equal(inquiry.adminMemo, "Follow up next week.");
  assert.equal(inquiry.status, inquiryStatus.UNREAD);
});
