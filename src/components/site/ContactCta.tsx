import Link from "next/link";

export function ContactCta() {
  return (
    <section className="contact-cta">
      <div className="container contact-cta__inner">
        <div>
          <h2>車両販売・買取・改装のご相談はこちら</h2>
          <p>
            お電話でのお問い合わせは 072-284-8938、営業時間は 09:00〜18:00 です。WEBからのお問い合わせは24時間受け付けています。
          </p>
        </div>
        <Link className="button button--dark" href="/contact">
          お問い合わせ
        </Link>
      </div>
    </section>
  );
}
