import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HUYỀN TÂM MINH ĐẠO",
  description: "Nền tảng AI hỗ trợ suy ngẫm tâm linh, định hướng đời sống và giáo dục lối sống.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">{children}</body>
    </html>
  );
}
