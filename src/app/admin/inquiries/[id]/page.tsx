import { InquiryStatus } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setInquiryRead, updateInquiryMemo } from "@/lib/actions/inquiries";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

type AdminInquiryDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

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

async function getInquiry(id: number) {
  return db.inquiry.findUnique({
    where: { id },
  });
}

export default async function AdminInquiryDetailPage({ params }: AdminInquiryDetailPageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const inquiry = await getInquiry(id);

  if (!inquiry) {
    notFound();
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">Inquiry Detail</p>
          <h1>{inquiry.name}</h1>
        </div>
        <Link className="admin-button admin-button--secondary" href="/admin/inquiries">
          Back to list
        </Link>
      </header>

      <section className="admin-detail-grid" aria-label="Inquiry fields">
        <div>
          <span>Status</span>
          <strong className={`admin-status admin-status--${inquiry.status.toLowerCase()}`}>
            {statusLabels[inquiry.status]}
          </strong>
        </div>
        <div>
          <span>Submitted</span>
          <strong>{dateFormatter.format(inquiry.submittedAt)}</strong>
        </div>
        <div>
          <span>Name</span>
          <strong>{inquiry.name}</strong>
        </div>
        <div>
          <span>Email</span>
          <strong>
            <a className="admin-text-link" href={`mailto:${inquiry.email}`}>
              {inquiry.email}
            </a>
          </strong>
        </div>
        <div>
          <span>Phone</span>
          <strong>{inquiry.phone || "-"}</strong>
        </div>
        <div>
          <span>Inquiry type</span>
          <strong>{inquiry.inquiryType || "-"}</strong>
        </div>
      </section>

      <section className="admin-form__section" aria-labelledby="inquiry-message-heading">
        <h2 id="inquiry-message-heading">Message</h2>
        <p className="admin-preserve-text">{inquiry.message}</p>
      </section>

      <form className="admin-form" action={updateInquiryMemo.bind(null, inquiry.id)}>
        <section className="admin-form__section">
          <h2>Admin memo</h2>
          <label className="admin-field">
            Status
            <select className="admin-input" defaultValue={inquiry.status} name="status">
              <option value={InquiryStatus.UNREAD}>Unread</option>
              <option value={InquiryStatus.READ}>Read</option>
            </select>
          </label>
          <label className="admin-field">
            Memo
            <textarea
              className="admin-textarea"
              defaultValue={inquiry.adminMemo ?? ""}
              name="adminMemo"
              rows={7}
            />
          </label>
          <div className="admin-form__actions">
            <button className="admin-button admin-button--primary" type="submit">
              Save memo
            </button>
          </div>
        </section>
      </form>

      <div className="admin-row-actions">
        <form action={setInquiryRead.bind(null, inquiry.id, inquiry.status !== InquiryStatus.READ)}>
          <button className="admin-button admin-button--secondary" type="submit">
            {inquiry.status === InquiryStatus.READ ? "Mark unread" : "Mark read"}
          </button>
        </form>
      </div>
    </div>
  );
}
