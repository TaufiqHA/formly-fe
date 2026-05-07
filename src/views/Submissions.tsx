import React from 'react';
import { Search, Filter, Download as DownloadIcon, ChevronLeft, ChevronRight, Eye, Edit2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const submissions = [
  { id: '#SUB-2023-0891', date: '12 Okt 2023, 14:30', name: 'Budi Santoso', form: 'Pemesanan Katering Event', status: 'Baru', statusColor: 'bg-surface-container-high text-on-surface-variant', dot: 'bg-outline' },
  { id: '#SUB-2023-0890', date: '12 Okt 2023, 11:15', name: 'Siti Aminah', form: 'Registrasi Workshop Mingguan', status: 'Dibaca', statusColor: 'bg-secondary-container text-primary', dot: 'bg-primary' },
  { id: '#SUB-2023-0889', date: '11 Okt 2023, 09:45', name: 'Andi Wijaya', form: 'Pemesanan Merchandise Custom', status: 'Selesai', statusColor: 'bg-success-bg text-success-text', dot: 'bg-success-text' },
  { id: '#SUB-2023-0888', date: '10 Okt 2023, 16:20', name: 'Ratna Sari', form: 'Pemesanan Katering Event', status: 'Spam', statusColor: 'bg-error-container text-on-error-container', dot: 'bg-error' },
  { id: '#SUB-2023-0887', date: '10 Okt 2023, 13:00', name: 'PT Maju Mundur', form: 'Registrasi Workshop Mingguan', status: 'Selesai', statusColor: 'bg-success-bg text-success-text', dot: 'bg-success-text' },
];

export default function Submissions({ onSelectSubmission }: { onSelectSubmission: () => void }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Data Masuk</h1>
          <p className="text-sm sm:text-base text-on-surface-variant mt-1">Kelola dan lihat semua hasil pengisian formulir Anda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Respon', value: '1,284', trend: '+12% vs bulan lalu', color: 'text-primary' },
          { label: 'Belum Dibaca', value: '42', trend: 'Perlu ditinjau', color: 'text-on-surface-variant' },
          { label: 'Penyelesaian', value: '156', trend: 'Sedang diproses', color: 'text-on-surface-variant' },
          { label: 'Konversi', value: '8.4%', trend: 'Rata-rata pengisian', color: 'text-success-text' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant group hover:border-primary/30 transition-colors">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">{stat.label}</p>
            <p className="text-2xl sm:text-3xl font-bold text-on-surface">{stat.value}</p>
            <p className={cn("text-xs mt-3 flex items-center gap-1", stat.color)}>
               {stat.trend}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
              <input 
                type="text" 
                placeholder="Cari ID, Nama..." 
                className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg bg-surface text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <select className="px-3 py-2 border border-outline-variant rounded-lg bg-surface text-sm focus:ring-1 focus:ring-primary outline-none min-w-[160px]">
              <option>Semua Status</option>
              <option>Menunggu Konfirmasi</option>
              <option>Diproses</option>
              <option>Selesai</option>
              <option>Dibatalkan</option>
            </select>
          </div>
          <button className="flex items-center gap-2 bg-surface text-secondary border border-outline-variant px-4 py-2 rounded-lg font-bold text-sm hover:bg-surface-container-low transition-colors shadow-sm">
            <DownloadIcon size={18} />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">ID Respon</th>
                <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">Waktu</th>
                <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">Pengirim</th>
                <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">Nama Form</th>
                <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm text-on-surface divide-y divide-outline-variant">
              {submissions.map((submission, idx) => (
                <tr key={idx} className="hover:bg-surface-bright transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap font-bold text-primary cursor-pointer hover:underline" onClick={onSelectSubmission}>
                    {submission.id}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-on-surface-variant text-center">{submission.date}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-center">{submission.name}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-center">{submission.form}</td>
                  <td className="py-4 px-6 whitespace-nowrap text-center">
                    <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-bold", submission.statusColor)}>
                      <span className={cn("w-2 h-2 rounded-full mr-2", submission.dot)}></span>
                      {submission.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button className="text-secondary hover:text-primary transition-colors p-1.5 rounded hover:bg-surface-container-low" onClick={onSelectSubmission}>
                        <Eye size={18} />
                      </button>
                      <button className="text-secondary hover:text-primary transition-colors p-1.5 rounded hover:bg-surface-container-low">
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-outline-variant p-6 bg-surface flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Showing 1 to 5 of 1,284 entries</span>
          <div className="flex gap-1">
            <button className="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-all" disabled>
              <ChevronLeft size={20} />
            </button>
            <button className="px-5 py-2 rounded-lg bg-primary text-white font-bold text-xs ring-2 ring-primary/20">1</button>
            <button className="px-5 py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high font-bold text-xs">2</button>
            <button className="px-5 py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high font-bold text-xs">3</button>
            <button className="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
