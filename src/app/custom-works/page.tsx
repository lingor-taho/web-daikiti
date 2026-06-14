import { BrandFilter } from "@/components/site/BrandFilter";
import { CategoryFilter } from "@/components/site/CategoryFilter";
import { CustomCaseCard } from "@/components/site/CustomCaseCard";
import { getActiveBrands, getActiveCategories, getPublishedCustomCases } from "@/lib/queries/customCases";

export const dynamic = "force-dynamic";

type CustomWorksPageProps = {
  searchParams?: Promise<{
    brand?: string;
    category?: string;
  }>;
};

export default async function CustomWorksPage({ searchParams }: CustomWorksPageProps) {
  const params = await searchParams;
  const currentBrand = params?.brand;
  const currentCategory = params?.category;
  const [brands, categories, cases] = await Promise.all([
    getActiveBrands(),
    getActiveCategories(),
    getPublishedCustomCases({
      brand: currentBrand,
      category: currentCategory,
    }),
  ]);

  return (
    <main className="custom-works-page">
      <section className="custom-works-hero">
        <div className="container custom-works-hero__inner">
          <p className="custom-works-hero__label">Custom Works</p>
          <h1>自動車改装事例</h1>
          <p>ブランドや施工内容に合わせて、DKT Motorsの改装事例をご覧いただけます。</p>
        </div>
      </section>

      <section className="section custom-works-list" aria-labelledby="custom-works-list-heading">
        <div className="container">
          <div className="custom-works-list__top">
            <h2 id="custom-works-list-heading">Works</h2>
            <div className="custom-works-filters">
              <div className="custom-works-filters__group">
                <span className="custom-works-filters__label">Brand</span>
                <BrandFilter brands={brands} currentBrand={currentBrand} currentCategory={currentCategory} />
              </div>
              <div className="custom-works-filters__group">
                <span className="custom-works-filters__label">Category</span>
                <CategoryFilter
                  categories={categories}
                  currentBrand={currentBrand}
                  currentCategory={currentCategory}
                />
              </div>
            </div>
          </div>

          {cases.length > 0 ? (
            <div className="case-grid case-grid--list">
              {cases.map((customCase, index) => (
                <CustomCaseCard customCase={customCase} eager={index === 0} key={customCase.id} />
              ))}
            </div>
          ) : (
            <p className="empty-state empty-state--light">該当する改装事例はありません。</p>
          )}
        </div>
      </section>
    </main>
  );
}
