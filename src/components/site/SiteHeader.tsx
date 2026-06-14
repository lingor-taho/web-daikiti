import Link from "next/link";

const navItems = [
  { href: "/business", label: "事業紹介" },
  { href: "/custom-works", label: "改装事例", featured: true },
  { href: "/company", label: "会社情報" },
  { href: "/access", label: "アクセス" },
  { href: "/contact", label: "お問い合わせ" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="site-header__brand" href="/" aria-label="DKT Motors home">
          <span className="site-header__brand-mark">DKT</span>
          <span className="site-header__brand-text">MOTORS</span>
        </Link>
        <nav className="site-header__nav" aria-label="サイトナビゲーション">
          {navItems.map((item) => (
            <Link
              className={item.featured ? "site-header__nav-link is-featured" : "site-header__nav-link"}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
