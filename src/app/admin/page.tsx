import Link from "next/link";

const adminOverviewLinks = [
  {
    href: "/admin/custom-cases",
    title: "改装事例",
    description: "施工事例の一覧確認、新規作成、編集へ進みます。",
  },
  {
    href: "/admin/brands",
    title: "ブランド",
    description: "ブランド管理は後続タスクで実装予定です。",
  },
  {
    href: "/admin/categories",
    title: "カテゴリ",
    description: "カテゴリ管理は後続タスクで実装予定です。",
  },
  {
    href: "/admin/inquiries",
    title: "お問い合わせ",
    description: "お問い合わせ管理は後続タスクで実装予定です。",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Dashboard</p>
          <h1>管理画面</h1>
        </div>
      </header>

      <section className="admin-card-grid" aria-label="管理メニュー">
        {adminOverviewLinks.map((item) => (
          <Link className="admin-overview-card" href={item.href} key={item.href}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
