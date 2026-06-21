import type { Metadata } from "next";
import { ContactCta } from "@/components/site/ContactCta";
import { InfoTable, StaticPageHero } from "@/components/site/StaticPage";

export const metadata: Metadata = {
  title: "会社情報 | DKT MOTORS",
  description: "DKT MOTORS（大吉再生資源株式会社）の会社概要とアクセス情報です。",
};

const companyRows = [
  { label: "会社名", value: "DKT MOTORS（大吉再生資源株式会社）" },
  {
    label: "所在地",
    value: (
      <>
        〒587-0041 本社：大阪府堺市美原区菅生1599-1
        <br />
        支店：〒595-0033 大阪府泉大津市板原町4丁目16-16
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

export default function CompanyPage() {
  return (
    <main className="static-page">
      <StaticPageHero
        label="Company"
        title="会社情報"
        description="DKT MOTORS（大吉再生資源株式会社）の会社概要、所在地、連絡先、アクセス情報を掲載しています。"
      />

      <section className="section static-section" aria-labelledby="company-profile-heading">
        <div className="container company-profile-full">
          <h2 className="sr-only" id="company-profile-heading">
            会社概要
          </h2>
          <InfoTable rows={companyRows} />
        </div>
      </section>

      <section className="section static-section static-section--soft" aria-labelledby="company-access-heading">
        <div className="container company-access-map">
          <div className="company-access-map__heading">
            <p className="section-heading__label">Access</p>
            <h2 id="company-access-heading">アクセス</h2>
            <p>
              ご来店やお取引のご相談は、事前にお電話またはお問い合わせフォームよりご連絡ください。
            </p>
          </div>
          <iframe
            title="DKT MOTORS 本社地図"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3287.3677046115!2d135.5622663763599!3d34.51891087298483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000d79fa486beb1%3A0x8a8ba72386b540f5!2z44CSNTg3LTAwNDEg5aSn6Ziq5bqc5aC65biC576O5Y6f5Yy66I-F55Sf77yR77yV77yZ77yZ4oiS77yR!5e0!3m2!1sja!2sjp!4v1761229418126!5m2!1sja!2sjp"
            width="100%"
            height="450"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <ContactCta />
    </main>
  );
}
