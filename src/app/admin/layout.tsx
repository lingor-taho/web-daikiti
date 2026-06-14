import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "管理画面 | DKT Motors",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
