import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/site/ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ | DKT MOTORS",
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
            以下フォームよりお気軽にお問い合わせください。お問い合わせ内容の確認後、担当者よりご連絡させていただきます。
          </p>
        </div>
      </section>

      <section className="section contact-section contact-section--refined" aria-labelledby="contact-form-heading">
        <div className="container contact-layout contact-layout--refined">
          <aside className="contact-layout__intro">
            <p className="section-heading__label">Inquiry Form</p>
            <h2 id="contact-form-heading">お問い合わせ内容を送信</h2>
            <p>
              車両販売、輸出、自動車改装、リサイクル事業に関するご相談は、こちらのフォームよりご連絡ください。
              車両や改装に関するご相談の場合は、車種、用途、ご希望時期もあわせてご記入いただくと確認がスムーズです。
            </p>
            <div className="contact-info-panel">
              <span>お電話でのお問い合わせ</span>
              <a href="tel:0722848938">072-284-8938</a>
              <p>受付時間：09:00〜18:00</p>
            </div>
            <p className="contact-layout__privacy-note">
              送信前に<Link href="/privacy">プライバシーポリシー</Link>をご確認ください。
            </p>
          </aside>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
