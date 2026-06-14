import Link from "next/link";

const adminNavItems = [
  { href: "/admin/custom-cases", label: "改装事例" },
  { href: "/admin/brands", label: "ブランド" },
  { href: "/admin/categories", label: "カテゴリ" },
  { href: "/admin/inquiries", label: "お問い合わせ" },
];

export function AdminSidebar() {
  return (
    <aside className="admin-sidebar" aria-label="管理メニュー">
      <Link className="admin-sidebar__brand" href="/admin">
        <span className="admin-sidebar__brand-mark">DKT</span>
        <span>
          <strong>Admin</strong>
          <small>DKT Motors</small>
        </span>
      </Link>

      <nav className="admin-sidebar__nav">
        {adminNavItems.map((item) => (
          <Link className="admin-sidebar__link" href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
