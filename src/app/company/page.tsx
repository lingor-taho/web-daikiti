import type { Metadata } from "next";
import { ContactCta } from "@/components/site/ContactCta";
import { InfoTable, StaticPageHero } from "@/components/site/StaticPage";

export const metadata: Metadata = {
  title: "会社情報 | DKT Motors",
  description: "DKT MOTORS（大吉再生資源株式会社）の会社概要です。",
};

const companyRows = [
  { label: "会社名", value: "DKT MOTORS（大吉再生資源株式会社）" },
  {
    label: "所在地",
    value: (
      <>
        〒587-0041 本社: 大阪府堺市美原区菅生1599-1
        <br />
        支店: 〒595-0033 大阪府泉大津市板原町4丁目16-16
      </>
    ),
  },
  { label: "TEL", value: "072-284-8938" },
  { label: "FAX", value: "072-284-8934" },
  { label: "営業時間", value: "09:00〜18:00" },
  { label: "代表取締役", value: "譚洋（TAN YAN）" },
  { label: "設立", value: "2016年6月20日" },
  { label: "資本金", value: "500万円" },
  { label: "事業内容", value: "自動車トータルサービス事業、プラスチックのリサイクル及び輸出" },
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
        description="DKT MOTORS（大吉再生資源株式会社）の会社概要を掲載しています。"
      />

      <section className="section static-section" aria-labelledby="company-profile-heading">
        <div className="container static-two-column">
          <div>
            <p className="section-heading__label">Profile</p>
            <h2 id="company-profile-heading">会社概要</h2>
            <p>
              原サイト掲載情報をもとに、会社名、所在地、連絡先、設立、資本金、事業内容を整理しています。
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
