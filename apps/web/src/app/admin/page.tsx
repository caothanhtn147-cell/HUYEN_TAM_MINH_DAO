import type { Metadata } from 'next';
import { AdminDashboardView } from '@/components/admin/AdminDashboardView';

export const metadata: Metadata = {
  title: 'Admin Governance & Health Audit | Huyền Tâm Minh Đạo',
  description:
    'Trung tâm Quản trị và Giám sát Chỉ số Vận hành, AI Providers & Audit Logs hệ thống Huyền Tâm Minh Đạo.',
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <AdminDashboardView />
    </main>
  );
}
