'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, ArrowRight, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth();

  return (
    <header className="fixed left-0 right-0 z-50 flex w-full justify-center pointer-events-none top-5 px-4 sm:px-6">
      <div className="w-full max-w-5xl pointer-events-auto flex items-center justify-between rounded-full border border-slate-200/80 bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgba(15,23,42,0.06)] py-2.5 pl-3 pr-3">
        <Link href="/" className="flex items-center gap-2.5 px-2" aria-label="SIMMAS Home">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-[15px] font-bold tracking-tight text-slate-900">SIMMAS</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#fitur" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            Fitur
          </a>
          <a href="#panduan" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            Panduan
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {currentUser ? (
            <Link
              href={`/dashboard/${currentUser.role}`}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all"
            >
              Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex items-center h-10 px-4 rounded-full border border-blue-200 text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-all"
              >
                Masuk
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all"
              >
                Mulai Sekarang
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden h-9 w-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-700"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden pointer-events-auto absolute top-16 left-4 right-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl flex flex-col gap-2">
          <a href="#fitur" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 py-2 px-3 rounded-lg hover:bg-slate-50">
            Fitur
          </a>
          <a href="#panduan" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-700 py-2 px-3 rounded-lg hover:bg-slate-50">
            Panduan
          </a>
          <Link href="/login" className="w-full text-center text-sm font-semibold py-2.5 rounded-xl bg-blue-600 text-white">
            Masuk / Mulai Sekarang
          </Link>
        </div>
      )}
    </header>
  );
}
