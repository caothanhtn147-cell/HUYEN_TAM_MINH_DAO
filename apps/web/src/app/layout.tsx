import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://huyentam.app'),
  title: 'HUYỀN TÂM MINH ĐẠO | HuyenTam Wisdom',
  description:
    'Nền tảng triết học & biểu tượng soi chiếu nhận thức tâm lý, định hướng lối sống lành mạnh.',
  manifest: '/manifest.json',
  icons: {
    icon: '/globe.svg',
    apple: '/globe.svg',
  },
  openGraph: {
    title: 'HUYỀN TÂM MINH ĐẠO | HuyenTam Wisdom',
    description:
      'Gương soi tâm lý & biểu tượng triết học (Tarot, Kinh Dịch, Bát Tự & Tử Vi, Dưỡng Đạo).',
    url: 'https://huyentam.app',
    siteName: 'HUYỀN TÂM MINH ĐẠO',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HUYỀN TÂM MINH ĐẠO | HuyenTam Wisdom',
    description:
      'Gương soi tâm lý & biểu tượng triết học (Tarot, Kinh Dịch, Bát Tự & Tử Vi, Dưỡng Đạo).',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
        <AuthProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
