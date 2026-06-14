import { BusinessSummary } from "@/components/site/BusinessSummary";
import { ContactCta } from "@/components/site/ContactCta";
import { FeaturedCases } from "@/components/site/FeaturedCases";
import { HomeHero } from "@/components/site/HomeHero";
import { getFeaturedCustomCases } from "@/lib/queries/customCases";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cases = await getFeaturedCustomCases();

  return (
    <main>
      <HomeHero />
      <BusinessSummary />
      <FeaturedCases cases={cases} />
      <ContactCta />
    </main>
  );
}
