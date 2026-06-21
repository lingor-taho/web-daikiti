import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <h2>DKT MOTORS（大吉再生資源株式会社）</h2>
        <p>
          〒587-0041 本社：大阪府堺市美原区菅生1599-1 支店　〒595-0033
          大阪府泉大津市板原町４丁目１６−１６
        </p>
        <p>TEL: 072-284-8938 FAX: 072-284-8934</p>
      </div>
      <div className="site-footer__bottom">
        <div className="container site-footer__bottom-inner">
          <small>Copyright © 2026 DKT MOTORS（大吉再生資源株式会社） All Rights Reserved</small>
          <Link href="/privacy">プライバシーポリシー</Link>
        </div>
      </div>
    </footer>
  );
}
