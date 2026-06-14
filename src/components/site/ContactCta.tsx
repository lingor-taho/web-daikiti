import Link from "next/link";

export function ContactCta() {
  return (
    <section className="contact-cta">
      <div className="container contact-cta__inner">
        <div>
          <h2>車両販売・買取・改装のご相談はこちら</h2>
          <p>
            ご希望の車両、改装内容、輸出に関するご相談まで、お問い合わせフォームよりお気軽にご連絡ください。
          </p>
        </div>
        <Link className="button button--dark" href="/contact">
          お問い合わせ
        </Link>
      </div>
    </section>
  );
}
