import { PublishStatus } from "@prisma/client";
import Link from "next/link";
import { AdminTable } from "@/components/admin/AdminTable";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const statusLabels: Record<PublishStatus, string> = {
  [PublishStatus.DRAFT]: "下書き",
  [PublishStatus.PUBLISHED]: "公開中",
};

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

async function getAdminCustomCases() {
  return db.customCase.findMany({
    include: {
      brand: true,
    },
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
  });
}

export default async function AdminCustomCasesPage() {
  const customCases = await getAdminCustomCases();

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Custom Cases</p>
          <h1>改装事例</h1>
        </div>
        <Link className="admin-button admin-button--primary" href="/admin/custom-cases/new">
          新規作成
        </Link>
      </header>

      {customCases.length > 0 ? (
        <AdminTable columns={["ブランド", "タイトル", "ステータス", "更新日", "操作"]}>
          {customCases.map((customCase) => (
            <tr key={customCase.id}>
              <td>{customCase.brand.name}</td>
              <td>
                <span className="admin-table__title">{customCase.title}</span>
              </td>
              <td>
                <span className={`admin-status admin-status--${customCase.status.toLowerCase()}`}>
                  {statusLabels[customCase.status]}
                </span>
              </td>
              <td>{dateFormatter.format(customCase.updatedAt)}</td>
              <td>
                <Link className="admin-text-link" href={`/admin/custom-cases/${customCase.id}/edit`}>
                  編集
                </Link>
              </td>
            </tr>
          ))}
        </AdminTable>
      ) : (
        <div className="admin-empty">
          <h2>改装事例がまだありません</h2>
          <p>新規作成から最初の施工事例を登録できます。</p>
          <Link className="admin-button admin-button--primary" href="/admin/custom-cases/new">
            新規作成
          </Link>
        </div>
      )}
    </div>
  );
}
