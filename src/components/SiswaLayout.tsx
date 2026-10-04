'use client';

import { useState } from 'react';
import SiswaHeader from '@/components/SiswaHeader';
import SiswaSidebar from '@/components/SiswaSidebar';

export default function SiswaLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f4f6fb]">
      <SiswaSidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <SiswaHeader title={title} sidebarCollapsed={collapsed} onToggleSidebar={() => setCollapsed(v => !v)} />
        <main className="flex-1 p-5 md:px-6 md:py-5">{children}</main>
      </div>
    </div>
  );
}
