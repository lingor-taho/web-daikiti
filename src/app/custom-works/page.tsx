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
          <p className="custom-works-hero__label">カスタム事例</p>
          <h1>自動車カスタム事例</h1>
          <p>メーカーや施工内容から、DKT MOTORSのカスタム事例をご覧いただけます。</p>
        </div>
      </section>

      <section className="section custom-works-list" aria-labelledby="custom-works-list-heading">
        <div className="container">
          <div className="custom-works-list__top">
            <h2 id="custom-works-list-heading">事例一覧</h2>
            <div className="custom-works-filters">
              <div className="custom-works-filters__group">
                <span className="custom-works-filters__label">メーカー</span>
                <BrandFilter brands={brands} currentBrand={currentBrand} currentCategory={currentCategory} />
              </div>
              <div className="custom-works-filters__group">
                <span className="custom-works-filters__label">施工内容</span>
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
