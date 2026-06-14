import Link from "next/link";
import { notFound } from "next/navigation";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { CaseSpec } from "@/components/site/CaseSpec";
import { RichContent } from "@/components/site/RichContent";
import { getCustomCaseById } from "@/lib/queries/customCases";

export const dynamic = "force-dynamic";

type PreviewCustomCasePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PreviewCustomCasePage({ params }: PreviewCustomCasePageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);

  if (!Number.isInteger(id)) {
    notFound();
  }

  const customCase = await getCustomCaseById(id);

  if (!customCase) {
    notFound();
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Preview</p>
          <h1>{customCase.title}</h1>
        </div>
        <div className="admin-row-actions">
          <Link className="admin-button admin-button--secondary" href="/admin/custom-cases">
            一覧へ戻る
          </Link>
          <Link className="admin-button admin-button--primary" href={`/admin/custom-cases/${customCase.id}/edit`}>
            編集
          </Link>
        </div>
      </header>

      <section className="admin-preview-hero">
        <p className="admin-preview-hero__brand">{customCase.brand.name}</p>
        <h2>{customCase.title}</h2>
        <p>{customCase.summary}</p>
      </section>

      <div className="admin-preview-layout">
        <article className="custom-case-main">
          <BeforeAfter
            afterImage={customCase.afterImage}
            beforeImage={customCase.beforeImage}
            title={customCase.title}
          />
          <section className="custom-case-process" aria-labelledby="admin-preview-process-heading">
            <h2 id="admin-preview-process-heading">Process</h2>
            <RichContent html={customCase.content} />
          </section>
        </article>

        <div className="custom-case-side">
          <CaseSpec customCase={customCase} />
        </div>
      </div>
    </div>
  );
}
