import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ | DKT Motors",
  description: "DKT MOTORS（大吉再生資源株式会社）へのお問い合わせフォームです。",
};

export default function ContactPage() {
  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="container contact-hero__inner">
          <p className="contact-hero__label">Contact</p>
          <h1>お問い合わせ</h1>
          <p>
            車両販売、輸出、自動車改装、リサイクル事業に関するご相談は、以下のフォームよりお問い合わせください。
            お電話でのお問い合わせは 072-284-8938、営業時間は 09:00〜18:00 です。
          </p>
        </div>
      </section>

      <section className="section contact-section" aria-labelledby="contact-form-heading">
        <div className="container contact-layout">
          <div className="contact-layout__intro">
            <p className="section-heading__label">Inquiry Form</p>
            <h2 id="contact-form-heading">お問い合わせ内容を送信</h2>
            <p>
              お名前、メールアドレス、お問い合わせ内容をご入力ください。車両や改装に関するご相談の場合は、
              車種、用途、ご希望時期もあわせて記入いただくと確認がスムーズです。
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
