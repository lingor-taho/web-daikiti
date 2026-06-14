import Image from "next/image";
import Link from "next/link";
import type { FeaturedCustomCase } from "@/lib/queries/customCases";

type FeaturedCasesProps = {
  cases: FeaturedCustomCase[];
};

export function FeaturedCases({ cases }: FeaturedCasesProps) {
  return (
    <section className="section section--cases" id="custom-works">
      <div className="container">
        <div className="section-heading section-heading--light">
          <p className="section-heading__label">Custom Works</p>
          <h2>自動車改装事例</h2>
          <p>ブランドや改装内容ごとに、DKT Motorsの施工事例を画像中心でご紹介します。</p>
        </div>

        {cases.length > 0 ? (
          <div className="case-grid">
            {cases.map((customCase) => (
              <Link className="case-card" href={`/custom-works/${customCase.slug}`} key={customCase.id}>
                <div className="case-card__image">
                  <Image
                    src={customCase.coverImage}
                    alt={`${customCase.title} cover`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 920px) 50vw, 33vw"
                  />
                </div>
                <div className="case-card__body">
                  <div className="case-card__meta">
                    <span>{customCase.brand.name}</span>
                    {customCase.categories.slice(0, 2).map(({ category }) => (
                      <span key={category.id}>{category.name}</span>
                    ))}
                  </div>
                  <h3>{customCase.title}</h3>
                  <p>{customCase.summary}</p>
                  {customCase.tags.length > 0 ? (
                    <div className="case-card__tags" aria-label="Case tags">
                      {customCase.tags.slice(0, 3).map((tag) => (
                        <span key={tag.id}>#{tag.name}</span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="empty-state">現在、掲載中の改装事例はありません。</p>
        )}

        <div className="section-action">
          <Link className="button button--accent" href="/custom-works">
            すべての改装事例を見る
          </Link>
        </div>
      </div>
    </section>
  );
}
