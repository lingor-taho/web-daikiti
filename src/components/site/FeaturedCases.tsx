import Image from "next/image";
import Link from "next/link";
import type { FeaturedCustomCase } from "@/lib/queries/customCases";

type FeaturedCasesProps = {
  cases: FeaturedCustomCase[];
};

export function FeaturedCases({ cases }: FeaturedCasesProps) {
  return (
    <section className="section section--latest-cases" id="custom-works">
      <div className="container">
        <div className="latest-cases__heading">
          <p>new post</p>
          <h2>最近のカスタム</h2>
        </div>

        {cases.length > 0 ? (
          <div className="latest-case-list">
            {cases.map((customCase, index) => (
              <Link className="latest-case-main" href={`/custom-works/${customCase.slug}`} key={customCase.id}>
                <div className="latest-case-main__image">
                  <Image
                    src={customCase.coverImage}
                    alt={`${customCase.title}の施工写真`}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1180px) 100vw, 1180px"
                  />
                </div>
                <div className="latest-case-main__body">
                  <div className="latest-case-main__meta">
                    <span>{customCase.brand.name}</span>
                    {customCase.categories.slice(0, 2).map(({ category }) => (
                      <span key={category.id}>{category.name}</span>
                    ))}
                  </div>
                  <h3>{customCase.title}</h3>
                  <p>{customCase.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="empty-state">現在、掲載中のカスタム事例はありません。</p>
        )}

        <div className="section-action">
          <Link className="button button--dark" href="/custom-works">
            カスタム一覧を見る
          </Link>
        </div>
      </div>
    </section>
  );
}
