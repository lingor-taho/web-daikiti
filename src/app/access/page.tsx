import type { Metadata } from "next";
import Link from "next/link";
import { InfoTable, StaticPageHero } from "@/components/site/StaticPage";

export const metadata: Metadata = {
  title: "アクセス | DKT Motors",
  description: "DKT Motorsへのアクセス情報です。所在地は公開前に更新予定です。",
};

const accessRows = [
  { label: "所在地", value: "所在地は更新予定です。" },
  { label: "営業時間", value: "更新予定" },
  { label: "来店予約", value: "車両確認や改装相談は、事前のお問い合わせをおすすめします。" },
  { label: "交通案内", value: "最寄駅・駐車場情報は公開前に更新予定です。" },
];

export default function AccessPage() {
  return (
    <main className="static-page">
      <StaticPageHero
        label="Access"
        title="アクセス"
        description="ご来店や車両確認をご希望の方に向けたアクセス情報です。所在地、営業時間、交通案内は確認後に更新予定です。"
        actions={[{ href: "/contact", label: "来店・相談を問い合わせる" }]}
      />

      <section className="section static-section" aria-labelledby="access-heading">
        <div className="container access-layout">
          <div>
            <p className="section-heading__label">Location</p>
            <h2 id="access-heading">所在地・来店案内</h2>
            <p>
              現在の住所情報はプレースホルダーです。正式公開前に、正確な所在地、地図、アクセス方法へ差し替えてください。
            </p>
            <InfoTable rows={accessRows} />
            <div className="button-row">
              <Link className="button button--dark" href="/contact">
                お問い合わせ
              </Link>
            </div>
          </div>
          <div className="map-placeholder" aria-label="所在地は更新予定">
            <span>Map</span>
            <strong>所在地は更新予定です</strong>
            <p>公開前に正確な住所と地図情報へ差し替えてください。</p>
          </div>
        </div>
      </section>
    </main>
  );
}
