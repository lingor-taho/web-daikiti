import type { Metadata } from "next";
import { ContactCta } from "@/components/site/ContactCta";
import { InfoTable, StaticPageHero } from "@/components/site/StaticPage";

export const metadata: Metadata = {
  title: "会社情報 | DKT Motors",
  description: "DKT Motorsの会社概要、事業内容、公開前に更新予定の基本情報です。",
};

const companyRows = [
  { label: "会社名", value: "DKT Motors（正式表記は更新予定）" },
  { label: "所在地", value: "更新予定" },
  { label: "代表者", value: "更新予定" },
  { label: "事業内容", value: "自動車トータルサービス事業、プラスチックのリサイクル及び輸出" },
  { label: "取扱領域", value: "中古車販売・買取・輸出、整備相談、自動車改装、関連用品の相談" },
  { label: "設立", value: "更新予定" },
  { label: "備考", value: "公開前に正確な登記情報・所在地・連絡先へ更新予定です。" },
];

const principles = [
  {
    title: "相談しやすい情報設計",
    body: "サービス範囲や改装事例をわかりやすく整理し、初めてのご相談でも判断材料を見つけやすい状態を目指します。",
  },
  {
    title: "実用性を重視した提案",
    body: "車両の用途や状態に合わせ、見た目だけではなく使いやすさ、維持しやすさも含めて提案します。",
  },
  {
    title: "更新できる会社情報",
    body: "所在地、会社概要、取扱条件などは、公開可能な情報が確定し次第、正確な内容へ更新します。",
  },
];

export default function CompanyPage() {
  return (
    <main className="static-page">
      <StaticPageHero
        label="Company"
        title="会社情報"
        description="DKT Motorsの基本情報を掲載しています。会社概要の詳細値は公開前に確認し、正確な内容へ更新予定です。"
      />

      <section className="section static-section" aria-labelledby="company-profile-heading">
        <div className="container static-two-column">
          <div>
            <p className="section-heading__label">Profile</p>
            <h2 id="company-profile-heading">会社概要</h2>
            <p>
              以下の会社情報は、現在のサイト制作段階でのプレースホルダーを含みます。正式公開前に確認済みの値へ更新してください。
            </p>
          </div>
          <InfoTable rows={companyRows} />
        </div>
      </section>

      <section className="section static-section static-section--soft" aria-labelledby="company-stance-heading">
        <div className="container">
          <div className="section-heading">
            <p className="section-heading__label">Stance</p>
            <h2 id="company-stance-heading">大切にする姿勢</h2>
            <p>
              自動車トータルサービスと改装事例の発信を通じて、相談前の不安を減らすことを重視しています。
            </p>
          </div>
          <div className="static-card-grid static-card-grid--three">
            {principles.map((principle) => (
              <article className="static-panel static-panel--compact" key={principle.title}>
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContactCta />
    </main>
  );
}
