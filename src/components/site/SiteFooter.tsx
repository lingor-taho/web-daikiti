import Link from "next/link";

const footerLinks = [
  { href: "/business", label: "事業紹介" },
  { href: "/custom-works", label: "改装事例" },
  { href: "/company", label: "会社情報" },
  { href: "/access", label: "アクセス" },
  { href: "/contact", label: "お問い合わせ" },
  { href: "/privacy", label: "プライバシーポリシー" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <Link className="site-footer__brand" href="/">
            DKT MOTORS
          </Link>
          <p>大吉再生資源株式会社。自動車トータルサービスと資源循環事業を通じて、お客様のカーライフと企業活動を支えます。</p>
          <p>〒587-0041 本社: 大阪府堺市美原区菅生1599-1 / 支店: 大阪府泉大津市板原町4丁目16-16</p>
          <p>TEL: 072-284-8938 / FAX: 072-284-8934</p>
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
