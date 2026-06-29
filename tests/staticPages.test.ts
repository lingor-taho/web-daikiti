import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { join } from "node:path";

const appRoot = process.cwd();

const staticPages = [
  {
    route: "/business",
    file: "src/app/business/page.tsx",
    expectedText: ["自動車トータルサービス事業", "プラスチックのリサイクル及び輸出"],
  },
  {
    route: "/company",
    file: "src/app/company/page.tsx",
    expectedText: ["会社情報", "大吉再生資源株式会社", "072-284-8938"],
  },
  {
    route: "/access",
    file: "src/app/access/page.tsx",
    expectedText: ["アクセス", "大阪府堺市美原区菅生1599-1", "09:00〜18:00"],
  },
  {
    route: "/privacy",
    file: "src/app/privacy/page.tsx",
    expectedText: ["プライバシーポリシー", "個人情報"],
  },
];

test("static company content routes exist with required Japanese content", () => {
  for (const page of staticPages) {
    const source = readFileSync(join(appRoot, page.file), "utf8");

    for (const expectedText of page.expectedText) {
      assert.match(source, new RegExp(expectedText), `${page.route} should include ${expectedText}`);
    }
  }
});

test("footer links to the privacy policy route", () => {
  const footerSource = readFileSync(join(appRoot, "src/components/site/SiteFooter.tsx"), "utf8");

  assert.match(footerSource, /href=["{]\/privacy/);
});

test("home intro animation only plays for the document's initial home load", () => {
  const animationSource = readFileSync(join(appRoot, "src/components/site/HomeIntroAnimation.tsx"), "utf8");

  assert.doesNotMatch(animationSource, /sessionStorage/);
  assert.match(animationSource, /__dktHomeIntroPlayedInDocument/);
  assert.match(animationSource, /performance\.getEntriesByType\("navigation"\)/);
});
