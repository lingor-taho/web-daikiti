import type { Metadata } from "next";
import { ContactCta } from "@/components/site/ContactCta";
import { StaticPageHero } from "@/components/site/StaticPage";

export const metadata: Metadata = {
  title: "プライバシーポリシー | DKT MOTORS",
  description: "DKT MOTORS（大吉再生資源株式会社）の個人情報の取り扱いに関する基本方針です。",
};

const policies = [
  {
    title: "第1条（個人情報）",
    body: [
      "個人情報とは、氏名、生年月日、住所、電話番号、メールアドレス、その他の記述により特定の個人を識別できる情報、または個人識別符号を含む情報を指します。",
    ],
  },
  {
    title: "第2条（個人情報の収集方法）",
    body: [
      "当社は、お問い合わせやサービス相談の際に、氏名、電話番号、メールアドレス、ご相談内容などの個人情報をお尋ねすることがあります。",
      "また、必要に応じて、取引先や提携先から業務遂行に必要な範囲の情報を取得する場合があります。",
    ],
  },
  {
    title: "第3条（個人情報を収集・利用する目的）",
    body: [
      "当社が個人情報を利用する目的は、サービスの提供・運営、お問い合わせへの回答、本人確認、必要な連絡、重要なお知らせ、サービス改善、その他これらに付随する目的です。",
    ],
  },
  {
    title: "第4条（利用目的の変更）",
    body: [
      "利用目的を変更する場合は、変更前の目的と関連性があると合理的に認められる範囲で行い、変更後の目的を本ウェブサイト上で公表します。",
    ],
  },
  {
    title: "第5条（個人情報の第三者提供）",
    body: [
      "当社は、法令に基づく場合、人の生命・身体・財産の保護に必要な場合、公的機関への協力が必要な場合などを除き、本人の同意なく個人情報を第三者へ提供しません。",
      "業務委託や事業承継など、個人情報保護法上第三者提供に該当しない取り扱いが発生する場合は、適切な管理に努めます。",
    ],
  },
  {
    title: "第6条（個人情報の開示）",
    body: [
      "本人から個人情報の開示を求められた場合、法令に基づき遅滞なく対応します。ただし、本人または第三者の権利利益を害するおそれがある場合などは、開示できないことがあります。",
    ],
  },
  {
    title: "第7条（個人情報の訂正および削除）",
    body: [
      "当社が保有する個人情報に誤りがある場合、本人は訂正、追加、削除を請求できます。当社は必要と判断した場合、遅滞なく訂正等を行います。",
    ],
  },
  {
    title: "第8条（個人情報の利用停止等）",
    body: [
      "利用目的の範囲を超えて取り扱われている場合、または不正な手段により取得された場合、本人は利用停止または消去を求めることができます。",
      "当社は必要な調査を行い、請求に応じる必要があると判断した場合、遅滞なく対応します。",
    ],
  },
  {
    title: "第9条（プライバシーポリシーの変更）",
    body: [
      "本ポリシーは、法令やサービス内容の変更に応じて見直すことがあります。変更後の内容は、本ウェブサイトに掲載した時点から効力を生じます。",
    ],
  },
  {
    title: "第10条（お問い合わせ窓口）",
    body: [
      "本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。",
      "社名：DKT MOTORS（大吉再生資源株式会社）",
      "個人情報保護管理者：譚洋（TAN YAN）",
      "住所：〒587-0041 大阪府堺市美原区菅生1599-1",
      "電話番号：072-284-8938",
      "受付時間：09:00〜18:00",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="static-page privacy-page">
      <StaticPageHero
        label="Privacy"
        title="プライバシーポリシー"
        description="DKT MOTORS（大吉再生資源株式会社）は、本ウェブサイト上で提供するサービスにおける個人情報の取り扱いについて、以下のとおり方針を定めます。"
      />

      <section className="section static-section privacy-section" aria-labelledby="privacy-heading">
        <div className="container privacy-layout">
          <aside className="privacy-layout__summary">
            <p className="section-heading__label">Policy</p>
            <h2 id="privacy-heading">個人情報の取り扱い</h2>
            <p>
              お問い合わせフォームやサービス相談で取得する情報は、回答・本人確認・必要な連絡のために利用します。
            </p>
          </aside>
          <div className="privacy-article-list">
            {policies.map((policy) => (
              <section className="privacy-article" key={policy.title}>
                <h3>{policy.title}</h3>
                {policy.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </section>

      <ContactCta />
    </main>
  );
}
