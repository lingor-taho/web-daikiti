import Link from "next/link";

export function ContactCta() {
  return (
    <section className="contact-cta">
      <div className="container">
        <h2>お気軽にお問い合わせください</h2>
        <div className="contact-cta__cards">
          <article className="contact-cta__card">
            <h3>お電話でのお問い合わせは</h3>
            <a className="contact-cta__phone" href="tel:0722848938">
              072-284-8938
            </a>
            <p>営業時間：09:00〜18:00</p>
          </article>
          <article className="contact-cta__card">
            <h3>WEBからのお問い合わせは</h3>
            <Link className="contact-cta__button" href="/contact">
              お問い合わせ
            </Link>
            <p>24時間受付中</p>
          </article>
        </div>
      </div>
    </section>
  );
}
