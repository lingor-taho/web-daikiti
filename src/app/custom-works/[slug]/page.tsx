import Link from "next/link";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { CaseSpec } from "@/components/site/CaseSpec";
import { RichContent } from "@/components/site/RichContent";
import { getCustomCaseBySlug } from "@/lib/queries/customCases";

export const dynamic = "force-dynamic";

type CustomCaseDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CustomCaseDetailPage({ params }: CustomCaseDetailPageProps) {
  const { slug } = await params;
  const customCase = await getCustomCaseBySlug(slug);

  return (
    <main className="custom-case-page">
      <section className="custom-case-hero">
        <div className="container custom-case-hero__inner">
          <p className="custom-case-hero__brand">{customCase.brand.name}</p>
          <h1>{customCase.title}</h1>
          <p>{customCase.summary}</p>
        </div>
      </section>

      <div className="container custom-case-layout">
        <article className="custom-case-main">
          <BeforeAfter
            afterImage={customCase.afterImage}
            beforeImage={customCase.beforeImage}
            title={customCase.title}
          />
          <section className="custom-case-process" aria-labelledby="custom-case-process-heading">
            <h2 id="custom-case-process-heading">Process</h2>
            <RichContent html={customCase.content} />
          </section>
        </article>

        <div className="custom-case-side">
          <CaseSpec customCase={customCase} />
          <div className="custom-case-cta">
            <h2>ご相談はこちら</h2>
            <p>同様の改装やパーツ取付をご検討中の方は、お問い合わせフォームからご相談ください。</p>
            <Link className="button button--accent" href="/contact">
              お問い合わせ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
