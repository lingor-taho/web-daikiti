import { PrismaClient } from "@prisma/client";

import { disconnect as disconnectSeed, main as seed } from "./seed";

process.env.DATABASE_URL ??= "file:./dev.db";

const prisma = new PrismaClient();

async function main() {
  const customCaseCount = await prisma.customCase.count();

  if (customCaseCount > 0) {
    console.log(`Seed skipped: ${customCaseCount} custom case(s) already exist.`);
    return;
  }

  console.log("No custom cases found. Seeding sample data...");
  await seed();
  await disconnectSeed();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
