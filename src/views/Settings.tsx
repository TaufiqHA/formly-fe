import React from 'react';
import { Save, Bell, Shield, Palette, Globe, Mail } from 'lucide-react';
import { motion } from 'motion/react';

export default function Settings() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-on-surface">Pengaturan</h1>
        <p className="text-on-surface-variant mt-1">Kelola preferensi akun dan aplikasi Anda.</p>
      </div>

      <div className="grid gap-6">
        {/* Notifikasi */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-on-surface">Notifikasi</h2>
              <p className="text-sm text-on-surface-variant">Atur bagaimana kami menghubungi Anda.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-outline-variant/30">
              <div>
                <p className="font-medium text-on-surface">Email Pesanan Baru</p>
                <p className="text-xs text-on-surface-variant">Terima email setiap ada pesanan masuk.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-outline-variant/30">
              <div>
                <p className="font-medium text-on-surface">Pesan WhatsApp</p>
                <p className="text-xs text-on-surface-variant">Kirim konfirmasi otomatis ke pelanggan.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" />
            </div>
          </div>
        </div>

        {/* Keamanan */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-on-surface">Keamanan</h2>
              <p className="text-sm text-on-surface-variant">Lindungi data dan akun Anda.</p>
            </div>
          </div>
          <button className="w-full text-left p-4 border border-outline-variant rounded-xl hover:bg-surface-container-high transition-colors">
            <p className="font-bold text-sm text-on-surface">Ganti Kata Sandi</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Terakhir diganti 3 bulan yang lalu.</p>
          </button>
        </div>

        {/* Tampilan */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-tertiary/10 text-tertiary rounded-lg">
              <Palette size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-on-surface">Tampilan</h2>
              <p className="text-sm text-on-surface-variant">Kustomisasi antarmuka aplikasi.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex-1 p-4 border-2 border-primary bg-primary/5 rounded-xl text-center">
              <p className="font-bold text-sm text-primary">Terang</p>
            </button>
            <button className="flex-1 p-4 border border-outline-variant rounded-xl text-center hover:bg-surface-container-high">
              <p className="font-bold text-sm text-on-surface-variant">Gelap</p>
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-container transition-all shadow-lg active:scale-95">
          <Save size={20} />
          Simpan Perubahan
        </button>
      </div>
    </motion.div>
  );
}
