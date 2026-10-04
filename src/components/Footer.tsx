import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#f7f8fc] border-t border-slate-200/80">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">SIMMAS</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[220px]">
              Sistem Informasi Manajemen Magang Siswa untuk SMK modern.
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-slate-400 mb-4">Produk</p>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li><a href="#fitur" className="hover:text-blue-600">Fitur</a></li>
              <li><a href="#panduan" className="hover:text-blue-600">Panduan</a></li>
              <li><a href="#keamanan" className="hover:text-blue-600">Keamanan</a></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-slate-400 mb-4">Akses</p>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li><Link href="/login" className="hover:text-blue-600">Siswa</Link></li>
              <li><Link href="/login" className="hover:text-blue-600">Guru Pembimbing</Link></li>
              <li><Link href="/login" className="hover:text-blue-600">Administrator</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-slate-400 mb-4">Legal</p>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li><Link href="/kebijakan-privasi" className="hover:text-blue-600 transition">Kebijakan Privasi</Link></li>
              <li><Link href="/ketentuan-layanan" className="hover:text-blue-600 transition">Ketentuan Layanan</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} SIMMAS. Didesain untuk pendidikan Indonesia.</p>
          <p className="text-[11px] uppercase tracking-[0.16em] font-semibold text-slate-400">Versi 2.0.0</p>
        </div>
      </div>
    </footer>
  );
}
