import React, { useEffect, useState } from 'react';
import { Save, Bell, Shield, Palette, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { settingsService } from '../services/settingsService';
import { Preferences } from '../types/settings';

export default function Settings() {
  const [preferences, setPreferences] = useState<Preferences>({
    notif_email_new_order: true,
    notif_wa_auto_confirm: true,
    theme: 'light'
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await settingsService.getSettings();
        if (res.success) {
          setPreferences(res.data.preferences);
        }
      } catch (error) {
        console.error("Gagal memuat settings", error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const res = await settingsService.updatePreferences(preferences);
      if (res.success) {
        alert(res.message || "Pengaturan berhasil disimpan");
      }
    } catch (error: any) {
      alert("Gagal menyimpan: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

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
              <input 
                type="checkbox" 
                checked={preferences.notif_email_new_order}
                onChange={(e) => setPreferences({ ...preferences, notif_email_new_order: e.target.checked })}
                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer" 
              />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-outline-variant/30">
              <div>
                <p className="font-medium text-on-surface">Pesan WhatsApp</p>
                <p className="text-xs text-on-surface-variant">Kirim konfirmasi otomatis ke pelanggan.</p>
              </div>
              <input 
                type="checkbox" 
                checked={preferences.notif_wa_auto_confirm}
                onChange={(e) => setPreferences({ ...preferences, notif_wa_auto_confirm: e.target.checked })}
                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer" 
              />
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
            <button 
              onClick={() => setPreferences({ ...preferences, theme: 'light' })}
              className={`flex-1 p-4 border-2 rounded-xl text-center transition-all ${
                preferences.theme === 'light' 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-outline-variant hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              <p className="font-bold text-sm">Terang</p>
            </button>
            <button 
              onClick={() => setPreferences({ ...preferences, theme: 'dark' })}
              className={`flex-1 p-4 border-2 rounded-xl text-center transition-all ${
                preferences.theme === 'dark' 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-outline-variant hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              <p className="font-bold text-sm">Gelap</p>
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          disabled={isSubmitting}
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-container transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          Simpan Perubahan
        </button>
      </div>
    </motion.div>
  );
}
