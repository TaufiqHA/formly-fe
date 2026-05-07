import React from 'react';
import { ChevronRight, MessageCircle, Mail, Download, ArrowLeft, Send, CheckCircle, FileText, Repeat } from 'lucide-react';
import { motion } from 'motion/react';

export default function OrderDetails({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-semibold text-sm group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Daftar Pesanan
        </button>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-on-surface">Pesanan #ORD-2023-0891</h1>
              <span className="bg-secondary-container text-primary font-bold text-xs px-3 py-1 rounded-full uppercase tracking-widest">
                Menunggu Konfirmasi
              </span>
            </div>
            <p className="text-on-surface-variant text-sm">Diterima: 12 Okt 2023, 14:30 WIB</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 bg-surface border border-outline-variant text-on-surface-variant px-4 py-2 rounded-lg font-bold text-sm hover:opacity-80 transition-opacity">
               <Repeat size={18} />
               Cetak Ulang Struk
             </button>
             <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-primary-container transition-all shadow-sm">
               Konfirmasi Pesanan
             </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm">
            <h3 className="text-lg font-bold text-on-surface mb-6 border-b border-outline-variant pb-3 leading-none">Data Pelanggan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Nama Lengkap</label>
                <p className="font-semibold text-on-surface">Budi Santoso</p>
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Nomor WhatsApp</label>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-on-surface">+62 812-3456-7890</p>
                  <button className="text-[#25D366] hover:bg-[#25D366]/10 p-1 rounded-full transition-colors">
                    <MessageCircle size={18} fill="currentColor" />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Email</label>
                <p className="font-semibold text-on-surface">budi.santoso@email.com</p>
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Perusahaan</label>
                <p className="font-semibold text-on-surface">PT Maju Bersama</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm">
            <h3 className="text-lg font-bold text-on-surface mb-6 border-b border-outline-variant pb-3 leading-none">Detail Formulir</h3>
            <div className="space-y-6">
              <div className="bg-surface p-4 rounded-xl border border-outline-variant">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Layanan yang Dipesan</label>
                <p className="text-lg font-bold text-primary">Paket Enterprise Logistik Terpadu</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface p-4 rounded-xl border border-outline-variant">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Estimasi Volume (Ton/Bulan)</label>
                  <p className="font-semibold text-on-surface">50 - 100 Ton</p>
                </div>
                <div className="bg-surface p-4 rounded-xl border border-outline-variant">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Rute Utama</label>
                  <p className="font-semibold text-on-surface">Jakarta - Surabaya</p>
                </div>
              </div>

              <div className="bg-surface p-4 rounded-xl border border-outline-variant">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Kebutuhan Khusus / Pesan Tambahan</label>
                <p className="text-sm leading-relaxed text-on-surface">
                  Membutuhkan truk pendingin untuk 20% dari total muatan bulanan. Harap hubungi segera untuk diskusi SLA.
                </p>
              </div>

              <div className="bg-surface p-4 rounded-xl border border-outline-variant">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Lampiran Berkas</label>
                <div className="flex items-center gap-3">
                  <div className="flex flex-1 items-center gap-3 bg-surface-container-highest px-4 py-2.5 rounded-lg border border-outline-variant">
                    <FileText className="text-on-surface-variant" size={20} />
                    <span className="text-sm font-semibold text-on-surface truncate">RFP_Logistics_2023.pdf</span>
                    <button className="text-primary hover:text-primary-container ml-auto transition-colors">
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-on-surface mb-6">Tindakan</h3>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-on-surface block mb-2 uppercase tracking-widest">Update Status Pesanan</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-surface border border-outline-variant rounded-lg px-4 py-2 text-sm font-bold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="pending">Menunggu Konfirmasi</option>
                    <option value="processing">Sedang Diproses</option>
                    <option value="contacted">Sudah Dihubungi</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </select>
                </div>
              </div>

              <hr className="border-outline-variant" />

              <div>
                <label className="text-xs font-bold text-on-surface block mb-3 uppercase tracking-widest">Notifikasi Pelanggan</label>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-all rounded-lg py-2.5 text-sm font-bold shadow-sm">
                    <Mail size={18} />
                    Kirim Ulang Email Resi
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#128C7E] transition-all rounded-lg py-2.5 text-sm font-bold shadow-sm">
                    <Send size={18} />
                    Kirim Notifikasi WA
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant flex flex-col h-[380px] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-outline-variant bg-surface-container-low">
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                Catatan Internal
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-surface/50">
              <div className="bg-white border border-outline-variant p-3 rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-on-surface">Admin Pusat (Sarah)</span>
                  <span className="text-[10px] text-on-surface-variant">12 Okt, 15:00</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Sudah diteruskan ke tim sales untuk perhitungan harga truk pendingin.
                </p>
              </div>
            </div>
            <div className="p-4 bg-white border-t border-outline-variant">
              <textarea 
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none h-20 mb-3"
                placeholder="Tambah catatan internal baru..."
              />
              <div className="flex justify-end">
                <button className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary-container transition-colors shadow-sm">
                  Simpan Catatan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
