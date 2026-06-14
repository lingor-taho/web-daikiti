import Link from "next/link";

const footerLinks = [
  { href: "/business", label: "事業紹介" },
  { href: "/custom-works", label: "改装事例" },
  { href: "/company", label: "会社情報" },
  { href: "/access", label: "アクセス" },
  { href: "/contact", label: "お問い合わせ" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <Link className="site-footer__brand" href="/">
            DKT MOTORS
          </Link>
          <p>自動車トータルサービスと改装事例を中心に、信頼できるカーライフを支えます。</p>
        </div>
        <nav className="site-footer__nav" aria-label="フッターナビゲーション">
          {footerLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="container site-footer__bottom">
        <small>&copy; DKT Motors. All rights reserved.</small>
      </div>
    </footer>
  );
}
