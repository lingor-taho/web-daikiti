import type { Metadata } from "next";
import { StaticPageHero } from "@/components/site/StaticPage";

export const metadata: Metadata = {
  title: "プライバシーポリシー | DKT Motors",
  description: "DKT Motorsの個人情報の取り扱いに関する基本方針です。",
};

const policies = [
  {
    title: "個人情報の取得",
    body: "お問い合わせフォームなどを通じて、お名前、メールアドレス、電話番号、ご相談内容など、対応に必要な情報を取得する場合があります。",
  },
  {
    title: "利用目的",
    body: "取得した個人情報は、お問い合わせへの回答、相談内容の確認、サービス提供に必要な連絡、サイト運営上の確認のために利用します。",
  },
  {
    title: "第三者提供",
    body: "法令に基づく場合を除き、ご本人の同意なく個人情報を第三者へ提供しません。業務上必要な委託が発生する場合は、適切な管理に努めます。",
  },
  {
    title: "安全管理",
    body: "個人情報の漏えい、紛失、改ざん、不正アクセスを防ぐため、必要な範囲で安全管理措置を講じます。",
  },
  {
    title: "開示・訂正・削除",
    body: "ご本人から個人情報の開示、訂正、削除などのご希望があった場合は、本人確認のうえ、法令に従って対応します。",
  },
  {
    title: "改定",
    body: "本ポリシーは、法令やサービス内容の変更に応じて見直すことがあります。改定後の内容は本ページに掲載します。",
  },
];

export default function PrivacyPage() {
  return (
    <main className="static-page">
      <StaticPageHero
        label="Privacy Policy"
        title="プライバシーポリシー"
        description="DKT Motorsは、お問い合わせやサービス相談に伴い取得する個人情報を、必要な範囲で適切に取り扱います。"
      />

      <section className="section static-section" aria-labelledby="privacy-heading">
        <div className="container policy-layout">
          <div>
            <p className="section-heading__label">Policy</p>
            <h2 id="privacy-heading">個人情報の取り扱い</h2>
            <p>
              本ページは公開用の基本方針です。事業実態、運用体制、法務確認に合わせて、必要に応じて内容を更新してください。
            </p>
          </div>
          <div className="policy-list">
            {policies.map((policy) => (
              <section className="policy-list__item" key={policy.title}>
                <h3>{policy.title}</h3>
                <p>{policy.body}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
