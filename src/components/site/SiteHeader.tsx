"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "ホーム" },
  { href: "/custom-works", label: "カスタム" },
  { href: "/company", label: "会社情報" },
  { href: "/contact", label: "お問い合わせ" },
];

export function SiteHeader() {
  const [isCompact, setIsCompact] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const updateHeader = () => setIsCompact(window.scrollY > 80);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header className={`site-header${isCompact ? " is-compact" : ""}${isMenuOpen ? " is-menu-open" : ""}`}>
      <div className="site-header__top">
        <div className="container site-header__top-inner">
          <span>自動車業界におけるトータルカーサポート企業</span>
          <span>TEL 072-284-8938 / 09:00〜18:00</span>
        </div>
      </div>
      <div className="container site-header__inner">
        <div className="site-header__brand-group">
          <Link className="site-header__brand" href="/" aria-label="DKT MOTORS ホーム">
            <Image src="/images/original-site/logo.jpg" alt="DKT MOTORS" width={190} height={58} priority />
          </Link>
          <Link className="site-header__company-name" href="/">
            大吉再生資源株式会社
          </Link>
        </div>
        <button
          className="site-header__menu-button"
          type="button"
          aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={isMenuOpen}
          aria-controls="site-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span className="site-header__menu-line" />
          <span className="site-header__menu-line" />
          <span className="site-header__menu-line" />
        </button>
        <nav className="site-header__nav" id="site-navigation" aria-label="サイトナビゲーション">
          {navItems.map((item) => (
            <Link className="site-header__nav-link" href={item.href} key={item.href} onClick={() => setIsMenuOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
