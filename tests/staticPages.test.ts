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

test("home intro video uses only the animation asset without a poster image", () => {
  const animationSource = readFileSync(join(appRoot, "src/components/site/HomeIntroAnimation.tsx"), "utf8");
  const stylesSource = readFileSync(join(appRoot, "src/styles/globals.css"), "utf8");

  assert.match(animationSource, /useState\(true\)/);
  assert.match(animationSource, /useLayoutEffect/);
  assert.doesNotMatch(animationSource, /poster=/);
  assert.doesNotMatch(animationSource, /currentTime/);
  assert.doesNotMatch(animationSource, /onEnded/);
  assert.doesNotMatch(stylesSource, /background-image:\s*url\("\/images\/intro\/racetrack-scene\.png"\)/);
});

test("custom planner mobile categories stay above a shared detail panel", () => {
  const plannerSource = readFileSync(join(appRoot, "src/components/site/ModificationPlannerDemo.tsx"), "utf8");
  const stylesSource = readFileSync(join(appRoot, "src/styles/globals.css"), "utf8");

  assert.match(plannerSource, /custom-plan-category-group/);
  assert.match(plannerSource, /custom-plan-category-row/);
  assert.doesNotMatch(plannerSource, /custom-plan-mobile-detail-panel/);
  assert.doesNotMatch(stylesSource, /custom-plan-category-group:has\(/);
  assert.match(stylesSource, /@media \(max-width: 760px\)[\s\S]*\.custom-plan-category-row[\s\S]*display: flex/);
  assert.match(stylesSource, /@media \(max-width: 760px\)[\s\S]*\.custom-plan-category-group\.is-active/);
  assert.match(stylesSource, /@media \(max-width: 760px\)[\s\S]*\.custom-plan-category-rail button span[\s\S]*display: none/);
  assert.match(stylesSource, /@media \(max-width: 760px\)[\s\S]*\.custom-plan-category-rail button\.is-active span[\s\S]*display: block/);
  assert.match(stylesSource, /@media \(max-width: 760px\)[\s\S]*white-space: nowrap/);
});
