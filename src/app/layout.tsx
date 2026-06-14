import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "DKT Motors",
  description: "DKT Motors website redesign",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
