import type { Metadata } from "next";
import Link from "next/link";
import { ContactCta } from "@/components/site/ContactCta";
import { StaticPageHero } from "@/components/site/StaticPage";

export const metadata: Metadata = {
  title: "事業紹介 | DKT Motors",
  description: "DKT Motorsの自動車トータルサービス事業とプラスチックのリサイクル及び輸出のご紹介です。",
};

const businessAreas = [
  {
    number: "01",
    title: "自動車トータルサービス事業",
    body: "自動車に関する幅広いサービスを提供しております。中古車の販売をはじめ、あらゆるニーズにお応えできる体制を整え、お客様一人ひとりのカーライフを安心で快適なものにするため、質の高いサービスをご提供いたします。",
    items: ["中古車販売のご相談", "中古車輸出業務", "自動車改装・用品取付の提案", "カーライフに関わる各種相談"],
  },
  {
    number: "02",
    title: "プラスチックのリサイクル及び輸出",
    body: "環境保全と資源の有効活用を目的とし、プラスチックのリサイクルおよび輸出事業を展開しております。国内外の企業や自治体と連携し、廃プラスチックの回収・選別・再生処理を行います。",
    items: ["廃プラスチックの回収・選別", "再生処理に関する相談", "高品質なリサイクル原料の供給", "輸出に関する法人向け相談"],
  },
];

const workSteps = [
  {
    title: "用途を整理",
    body: "日常利用、仕事用、アウトドア、展示用途など、車両の使い方を確認します。",
  },
  {
    title: "施工内容を設計",
    body: "外装、内装、電装、用品取付など、必要な範囲を無理なく組み立てます。",
  },
  {
    title: "事例で比較",
    body: "公開中の改装事例を参考に、仕上がりの方向性や優先順位を確認します。",
  },
];

export default function BusinessPage() {
  return (
    <main className="static-page">
      <StaticPageHero
        label="Business"
        title="事業紹介"
        description="DKT MOTORS（大吉再生資源株式会社）は、自動車トータルサービス事業と、プラスチックのリサイクル及び輸出に取り組む企業です。"
        actions={[
          { href: "/custom-works", label: "改装事例を見る" },
          { href: "/contact", label: "相談する", variant: "ghost" },
        ]}
      />

      <section className="section static-section" aria-labelledby="business-areas-heading">
        <div className="container">
          <div className="section-heading">
            <p className="section-heading__label">Service Areas</p>
            <h2 id="business-areas-heading">二つの事業領域</h2>
            <p>
              原サイト掲載の事業内容をベースに、車両サービスと資源循環の二つの領域をわかりやすく整理しています。
            </p>
          </div>
          <div className="static-card-grid">
            {businessAreas.map((area) => (
              <article className="static-panel" key={area.title}>
                <span className="static-panel__number">{area.number}</span>
                <h3>{area.title}</h3>
                <p>{area.body}</p>
                <ul className="static-check-list">
                  {area.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section static-section static-section--dark" aria-labelledby="custom-work-heading">
        <div className="container static-feature">
          <div>
            <p className="section-heading__label">Custom Works</p>
            <h2 id="custom-work-heading">自動車改装を、事例で具体的に伝える。</h2>
            <p>
              改装は仕上がりのイメージ、使い勝手、施工範囲のすり合わせが重要です。DKT Motorsでは、公開可能な施工事例を通じて、相談前に比較しやすい情報を整えています。
            </p>
            <Link className="button button--accent" href="/custom-works">
              改装事例へ
            </Link>
          </div>
          <div className="process-list">
            {workSteps.map((step, index) => (
              <article className="process-list__item" key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContactCta />
    </main>
  );
}
