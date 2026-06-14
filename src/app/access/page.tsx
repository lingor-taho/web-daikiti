import type { Metadata } from "next";
import Link from "next/link";
import { InfoTable, StaticPageHero } from "@/components/site/StaticPage";

export const metadata: Metadata = {
  title: "アクセス | DKT Motors",
  description: "DKT MOTORS（大吉再生資源株式会社）へのアクセス情報です。",
};

const accessRows = [
  {
    label: "本社",
    value: "〒587-0041 大阪府堺市美原区菅生1599-1",
  },
  {
    label: "支店",
    value: "〒595-0033 大阪府泉大津市板原町4丁目16-16",
  },
  { label: "TEL", value: "072-284-8938" },
  { label: "FAX", value: "072-284-8934" },
  { label: "営業時間", value: "09:00〜18:00" },
  { label: "来店予約", value: "車両確認や改装相談は、事前のお問い合わせをおすすめします。" },
];

export default function AccessPage() {
  return (
    <main className="static-page">
      <StaticPageHero
        label="Access"
        title="アクセス"
        description="ご来店や車両確認をご希望の方に向けたアクセス情報です。本社と支店の所在地、連絡先、営業時間を掲載しています。"
        actions={[{ href: "/contact", label: "来店・相談を問い合わせる" }]}
      />

      <section className="section static-section" aria-labelledby="access-heading">
        <div className="container access-layout">
          <div>
            <p className="section-heading__label">Location</p>
            <h2 id="access-heading">所在地・来店案内</h2>
            <p>
              車両確認や改装相談は、事前にお問い合わせフォームまたはお電話でご連絡ください。
            </p>
            <InfoTable rows={accessRows} />
            <div className="button-row">
              <Link className="button button--dark" href="/contact">
                お問い合わせ
              </Link>
            </div>
          </div>
          <div className="map-placeholder" aria-label="大阪府堺市美原区菅生1599-1">
            <span>Map</span>
            <strong>大阪府堺市美原区菅生1599-1</strong>
            <p>本社所在地です。正式な地図埋め込みが必要な場合は、Google Maps等の埋め込みに差し替えてください。</p>
          </div>
        </div>
      </section>
    </main>
  );
}
