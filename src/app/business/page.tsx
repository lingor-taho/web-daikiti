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
    body: "中古車販売、買取、輸出、整備相談、用品取付、自動車改装まで、車に関わる相談を一体で受け止めます。用途、状態、ご予算を確認しながら、実用性と見た目の両面で納得できる進め方を提案します。",
    items: ["中古車販売・買取のご相談", "輸出や車両手配に関するご相談", "整備・メンテナンスの相談", "自動車改装・用品取付の提案"],
  },
  {
    number: "02",
    title: "プラスチックのリサイクル及び輸出",
    body: "プラスチック資源のリサイクル及び輸出にも取り組み、持続可能な資源循環に関わる事業を展開しています。具体的な取扱品目や条件は、公開情報の整備に合わせて更新予定です。",
    items: ["リサイクル関連の事業相談", "輸出に関する初期相談", "取扱条件の確認", "法人向けのお問い合わせ対応"],
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
        description="DKT Motorsは、自動車トータルサービス事業を中心に、プラスチックのリサイクル及び輸出にも取り組む企業です。車の価値を引き出す改装事例を軸に、相談しやすい事業情報を整えています。"
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
              自動車に関わる実務的なサービスと、資源循環に関わる事業を、公開できる範囲から順次わかりやすく掲載していきます。
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
