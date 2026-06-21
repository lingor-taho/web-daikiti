import type { CustomCaseDetail } from "@/lib/queries/customCases";

type CaseSpecProps = {
  customCase: CustomCaseDetail;
};

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function CaseSpec({ customCase }: CaseSpecProps) {
  const categories = customCase.categories.map(({ category }) => category.name);
  const tags = customCase.tags.map((tag) => tag.name);

  return (
    <aside className="case-spec" aria-labelledby="case-spec-heading">
      <h2 id="case-spec-heading">事例情報</h2>
      <dl className="case-spec__list">
        <div>
          <dt>メーカー</dt>
          <dd>{customCase.brand.name}</dd>
        </div>
        <div>
          <dt>車種</dt>
          <dd>{customCase.modelName ?? "未設定"}</dd>
        </div>
        <div>
          <dt>施工内容</dt>
          <dd>{categories.length > 0 ? categories.join(" / ") : "未設定"}</dd>
        </div>
        <div>
          <dt>タグ</dt>
          <dd>{tags.length > 0 ? tags.map((tag) => `#${tag}`).join(" ") : "未設定"}</dd>
        </div>
        <div>
          <dt>掲載日</dt>
          <dd>{customCase.publishedAt ? dateFormatter.format(customCase.publishedAt) : "未設定"}</dd>
        </div>
      </dl>
    </aside>
  );
}
