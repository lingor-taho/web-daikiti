import { PrismaClient, PublishStatus } from "@prisma/client";

process.env.DATABASE_URL ??= "file:./dev.db";

const prisma = new PrismaClient();
const samplePublishedAt = new Date("2026-06-14T00:00:00.000Z");

export async function main() {
  const brands = [
    ["トヨタ", "toyota"],
    ["レクサス", "lexus"],
    ["日産", "nissan"],
    ["スズキ", "suzuki"],
    ["ホンダ", "honda"],
    ["輸入車", "imported"],
  ];

  for (const [index, [name, slug]] of brands.entries()) {
    await prisma.brand.upsert({
      where: { slug },
      update: { name, sortOrder: index, isActive: true },
      create: { name, slug, sortOrder: index, isActive: true },
    });
  }

  const categories = [
    ["施工前後", "before-after"],
    ["外装カスタム", "exterior"],
    ["内装カスタム", "interior"],
    ["塗装・ラッピング", "paint"],
    ["パーツ取付", "parts"],
    ["車中泊仕様", "camper"],
    ["オフロード仕様", "off-road"],
    ["収納・業務仕様", "storage"],
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
  const interior = await prisma.customCategory.findUniqueOrThrow({
    where: { slug: "interior" },
  });
  const camper = await prisma.customCategory.findUniqueOrThrow({
    where: { slug: "camper" },
  });
  const offRoad = await prisma.customCategory.findUniqueOrThrow({
    where: { slug: "off-road" },
  });
  const storage = await prisma.customCategory.findUniqueOrThrow({
    where: { slug: "storage" },
  });
  const nissan = await prisma.brand.findUniqueOrThrow({
    where: { slug: "nissan" },
  });
  const suzuki = await prisma.brand.findUniqueOrThrow({
    where: { slug: "suzuki" },
  });

  await prisma.customCase.deleteMany({
    where: { slug: "sample-before-after" },
  });

  await prisma.customCase.upsert({
    where: { slug: "hiace-camper-style" },
    update: {
      title: "トヨタ ハイエース 車中泊カスタム",
      brandId: toyota.id,
      modelName: "ハイエース",
      summary:
        "仕事用としての使いやすさを残しながら、週末のレジャーや車中泊にも対応しやすい仕様に仕上げたカスタム事例です。",
      coverImage: "/images/custom-works/hiace-camper-after.png",
      beforeImage: "/images/custom-works/hiace-camper-before.png",
      afterImage: "/images/custom-works/hiace-camper-after.png",
      content:
        '<h2>カスタムのポイント</h2><p>外装はブラックパーツとルーフラックで引き締め、アウトドア用品を積みやすい仕様にしています。内装は木目の収納とベッドスペースを想定し、普段使いとレジャーの両立を目指した構成です。</p><img src="/images/custom-works/hiace-camper-after.png" alt="ハイエース 車中泊カスタムの施工イメージ"><h3>ご相談時に確認する内容</h3><ul><li>日常利用とレジャー利用の比率</li><li>必要な収納量と就寝スペース</li><li>外装パーツ、タイヤ、ライト類の優先順位</li></ul>',
      status: PublishStatus.PUBLISHED,
      isFeatured: true,
      sortOrder: 0,
      publishedAt: samplePublishedAt,
      categories: {
        deleteMany: {},
        create: [
          { categoryId: beforeAfter.id },
          { categoryId: exterior.id },
          { categoryId: interior.id },
          { categoryId: camper.id },
        ],
      },
      tags: {
        deleteMany: {},
        create: [{ name: "車中泊" }, { name: "ルーフラック" }, { name: "アウトドア" }],
      },
    },
    create: {
      title: "トヨタ ハイエース 車中泊カスタム",
      slug: "hiace-camper-style",
      brandId: toyota.id,
      modelName: "ハイエース",
      summary:
        "仕事用としての使いやすさを残しながら、週末のレジャーや車中泊にも対応しやすい仕様に仕上げたカスタム事例です。",
      coverImage: "/images/custom-works/hiace-camper-after.png",
      beforeImage: "/images/custom-works/hiace-camper-before.png",
      afterImage: "/images/custom-works/hiace-camper-after.png",
      content:
        '<h2>カスタムのポイント</h2><p>外装はブラックパーツとルーフラックで引き締め、アウトドア用品を積みやすい仕様にしています。内装は木目の収納とベッドスペースを想定し、普段使いとレジャーの両立を目指した構成です。</p><img src="/images/custom-works/hiace-camper-after.png" alt="ハイエース 車中泊カスタムの施工イメージ"><h3>ご相談時に確認する内容</h3><ul><li>日常利用とレジャー利用の比率</li><li>必要な収納量と就寝スペース</li><li>外装パーツ、タイヤ、ライト類の優先順位</li></ul>',
      status: PublishStatus.PUBLISHED,
      isFeatured: true,
      sortOrder: 0,
      publishedAt: samplePublishedAt,
      categories: {
        create: [
          { categoryId: beforeAfter.id },
          { categoryId: exterior.id },
          { categoryId: interior.id },
          { categoryId: camper.id },
        ],
      },
      tags: {
        create: [{ name: "車中泊" }, { name: "ルーフラック" }, { name: "アウトドア" }],
      },
    },
  });

  await prisma.customCase.upsert({
    where: { slug: "jimny-offroad-style" },
    update: {
      title: "スズキ ジムニー オフロードカスタム",
      brandId: suzuki.id,
      modelName: "ジムニー",
      summary: "足回り、タイヤ、ルーフラック、補助灯を組み合わせ、アウトドアでの使いやすさを高めたカスタム事例です。",
      coverImage: "/images/custom-works/jimny-offroad-after.png",
      beforeImage: null,
      afterImage: "/images/custom-works/jimny-offroad-after.png",
      content:
        '<h2>カスタムのポイント</h2><p>コンパクトな車体を活かしながら、悪路走行を意識したタイヤと外装パーツで存在感を高めています。アウトドアギアの積載を想定し、ルーフまわりの拡張性も重視しています。</p><img src="/images/custom-works/jimny-offroad-after.png" alt="ジムニー オフロードカスタムの施工イメージ"><h3>主な施工内容</h3><ul><li>オールテレーンタイヤ</li><li>ルーフラック・補助灯</li><li>バンパーまわりの保護パーツ</li></ul>',
      status: PublishStatus.PUBLISHED,
      isFeatured: true,
      sortOrder: 1,
      publishedAt: samplePublishedAt,
      categories: {
        deleteMany: {},
        create: [
          { categoryId: exterior.id },
          { categoryId: offRoad.id },
        ],
      },
      tags: {
        deleteMany: {},
        create: [{ name: "オフロード" }, { name: "アウトドア" }, { name: "外装パーツ" }],
      },
    },
    create: {
      title: "スズキ ジムニー オフロードカスタム",
      slug: "jimny-offroad-style",
      brandId: suzuki.id,
      modelName: "ジムニー",
      summary: "足回り、タイヤ、ルーフラック、補助灯を組み合わせ、アウトドアでの使いやすさを高めたカスタム事例です。",
      coverImage: "/images/custom-works/jimny-offroad-after.png",
      beforeImage: null,
      afterImage: "/images/custom-works/jimny-offroad-after.png",
      content:
        '<h2>カスタムのポイント</h2><p>コンパクトな車体を活かしながら、悪路走行を意識したタイヤと外装パーツで存在感を高めています。アウトドアギアの積載を想定し、ルーフまわりの拡張性も重視しています。</p><img src="/images/custom-works/jimny-offroad-after.png" alt="ジムニー オフロードカスタムの施工イメージ"><h3>主な施工内容</h3><ul><li>オールテレーンタイヤ</li><li>ルーフラック・補助灯</li><li>バンパーまわりの保護パーツ</li></ul>',
      status: PublishStatus.PUBLISHED,
      isFeatured: true,
      sortOrder: 1,
      publishedAt: samplePublishedAt,
      categories: {
        create: [
          { categoryId: exterior.id },
          { categoryId: offRoad.id },
        ],
      },
      tags: {
        create: [{ name: "オフロード" }, { name: "アウトドア" }, { name: "外装パーツ" }],
      },
    },
  });

  await prisma.customCase.upsert({
    where: { slug: "caravan-work-storage" },
    update: {
      title: "日産 キャラバン 業務用収納カスタム",
      brandId: nissan.id,
      modelName: "キャラバン",
      summary: "工具や部材を整理しやすいリア収納を中心に、業務利用の効率を高めるカスタム事例です。",
      coverImage: "/images/custom-works/caravan-storage-after.png",
      beforeImage: null,
      afterImage: "/images/custom-works/caravan-storage-after.png",
      content:
        '<h2>カスタムのポイント</h2><p>業務用車両として使いやすいよう、リアゲート側から工具や部材を取り出しやすい収納レイアウトを想定しています。床面、棚、照明を整理することで、作業前後の準備時間を短縮しやすい構成です。</p><img src="/images/custom-works/caravan-storage-after.png" alt="キャラバン 業務用収納カスタムの施工イメージ"><h3>主な施工内容</h3><ul><li>リア収納ラック</li><li>作業灯・室内灯</li><li>黒系ホイールと外装アクセント</li></ul>',
      status: PublishStatus.PUBLISHED,
      isFeatured: true,
      sortOrder: 2,
      publishedAt: samplePublishedAt,
      categories: {
        deleteMany: {},
        create: [
          { categoryId: interior.id },
          { categoryId: storage.id },
        ],
      },
      tags: {
        deleteMany: {},
        create: [{ name: "業務車両" }, { name: "収納" }, { name: "作業効率" }],
      },
    },
    create: {
      title: "日産 キャラバン 業務用収納カスタム",
      slug: "caravan-work-storage",
      brandId: nissan.id,
      modelName: "キャラバン",
      summary: "工具や部材を整理しやすいリア収納を中心に、業務利用の効率を高めるカスタム事例です。",
      coverImage: "/images/custom-works/caravan-storage-after.png",
      beforeImage: null,
      afterImage: "/images/custom-works/caravan-storage-after.png",
      content:
        '<h2>カスタムのポイント</h2><p>業務用車両として使いやすいよう、リアゲート側から工具や部材を取り出しやすい収納レイアウトを想定しています。床面、棚、照明を整理することで、作業前後の準備時間を短縮しやすい構成です。</p><img src="/images/custom-works/caravan-storage-after.png" alt="キャラバン 業務用収納カスタムの施工イメージ"><h3>主な施工内容</h3><ul><li>リア収納ラック</li><li>作業灯・室内灯</li><li>黒系ホイールと外装アクセント</li></ul>',
      status: PublishStatus.PUBLISHED,
      isFeatured: true,
      sortOrder: 2,
      publishedAt: samplePublishedAt,
      categories: {
        create: [
          { categoryId: interior.id },
          { categoryId: storage.id },
        ],
      },
      tags: {
        create: [{ name: "業務車両" }, { name: "収納" }, { name: "作業効率" }],
      },
    },
  });
}

export async function disconnect() {
  await prisma.$disconnect();
}

if (process.argv[1]?.endsWith("seed.ts")) {
  main()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await disconnect();
    });
}
