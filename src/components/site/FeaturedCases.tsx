import Link from "next/link";
import { CustomCaseCard } from "@/components/site/CustomCaseCard";
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
              <CustomCaseCard customCase={customCase} key={customCase.id} />
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
