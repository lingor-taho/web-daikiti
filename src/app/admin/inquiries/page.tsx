import { InquiryStatus } from "@prisma/client";
import Link from "next/link";
import { AdminTable } from "@/components/admin/AdminTable";
import { setInquiryRead } from "@/lib/actions/inquiries";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const statusLabels: Record<InquiryStatus, string> = {
  [InquiryStatus.UNREAD]: "Unread",
  [InquiryStatus.READ]: "Read",
};

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

async function getInquiries() {
  return db.inquiry.findMany({
    orderBy: [{ submittedAt: "desc" }, { id: "desc" }],
  });
}

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Inquiries</p>
          <h1>Contact inquiries</h1>
        </div>
      </header>

      {inquiries.length > 0 ? (
        <AdminTable columns={["Status", "Name", "Email", "Submitted", "Action"]}>
          {inquiries.map((inquiry) => (
            <tr key={inquiry.id}>
              <td>
                <span className={`admin-status admin-status--${inquiry.status.toLowerCase()}`}>
                  {statusLabels[inquiry.status]}
                </span>
              </td>
              <td>
                <span className="admin-table__title">{inquiry.name}</span>
              </td>
              <td>{inquiry.email}</td>
              <td>{dateFormatter.format(inquiry.submittedAt)}</td>
              <td>
                <div className="admin-row-actions">
                  <Link
                    aria-label={`View inquiry from ${inquiry.name}`}
                    className="admin-button admin-button--secondary admin-button--compact"
                    href={`/admin/inquiries/${inquiry.id}`}
                  >
                    Detail
                  </Link>
                  <form action={setInquiryRead.bind(null, inquiry.id, inquiry.status !== InquiryStatus.READ)}>
                    <button
                      aria-label={`Mark inquiry from ${inquiry.name} as ${
                        inquiry.status === InquiryStatus.READ ? "unread" : "read"
                      }`}
                      className="admin-button admin-button--secondary admin-button--compact"
                      type="submit"
                    >
                      {inquiry.status === InquiryStatus.READ ? "Mark unread" : "Mark read"}
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      ) : (
        <div className="admin-empty">
          <h2>No inquiries yet</h2>
          <p>Public contact form submissions will appear here.</p>
        </div>
      )}
    </div>
  );
}
