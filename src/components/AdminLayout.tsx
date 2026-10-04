'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';

export default function AdminLayout({ title, children }: { title: string; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f4f6fb]">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <AdminHeader title={title} sidebarCollapsed={collapsed} onToggleSidebar={() => setCollapsed(v => !v)} />
        <main className="flex-1 p-5 md:px-6 md:py-5">{children}</main>
      </div>
    </div>
  );
}
