import React, { useEffect, useState } from 'react';
import { Save, MessageSquare, Shield, Smartphone, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { settingsService } from '../services/settingsService';
import { WhatsAppConfig } from '../types/settings';

export default function WhatsAppSettings() {
  const [config, setConfig] = useState<WhatsAppConfig>({
    api_key: '',
    phone_number: '',
    connection_status: 'disconnected',
    wa_template_new_order: ''
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await settingsService.getSettings();
        if (res.success) {
          setConfig(res.data.whatsapp);
        }
      } catch (error) {
        console.error("Gagal memuat WA settings", error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSaveConfig = async () => {
    try {
      setIsSubmitting(true);
      const res = await settingsService.updateWhatsAppConfig(config);
      if (res.success) {
        alert(res.message || "Konfigurasi WhatsApp berhasil disimpan");
      }
    } catch (error: any) {
      alert("Gagal menyimpan: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setTestingConnection(true);
      const res = await settingsService.testWhatsAppConnection();
      if (res.success) {
        alert("Koneksi Berhasil: " + res.message);
        // Refresh settings to get updated status
        const updated = await settingsService.getSettings();
        if (updated.success) setConfig(updated.data.whatsapp);
      } else {
        alert("Koneksi Gagal: " + res.message);
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setTestingConnection(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const status = config.connection_status || 'disconnected';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-12"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">WhatsApp API</h1>
          <p className="text-on-surface-variant mt-1">Konfigurasi koneksi WhatsApp untuk notifikasi otomatis.</p>
        </div>
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest",
          status === 'connected' ? "bg-success-bg text-success-text" : 
          testingConnection || status === 'pending' ? "bg-primary/10 text-primary" : "bg-error/10 text-error"
        )}>
          {testingConnection || status === 'pending' ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : status === 'connected' ? (
            <CheckCircle2 size={14} />
          ) : (
            <AlertCircle size={14} />
          )}
          {status === 'connected' ? 'Terhubung' : testingConnection || status === 'pending' ? 'Menghubungkan...' : 'Terputus'}
        </div>
      </div>

      <div className="grid gap-6">
        {/* API Configuration */}
        <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-on-surface">Kredensial API</h2>
              <p className="text-sm text-on-surface-variant">Gunakan API Key dari provider WhatsApp gateway Anda.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid gap-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">WhatsApp API Key</label>
              <div className="relative">
                <input 
                  type="password"
                  value={config.api_key || ''}
                  onChange={(e) => setConfig({ ...config, api_key: e.target.value })}
                  placeholder="Masukkan API Key Anda"
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">Nomor Pengirim</label>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
                  <input 
                    type="text"
                    value={config.phone_number}
                    onChange={(e) => setConfig({ ...config, phone_number: e.target.value })}
                    placeholder="+62 8xx-xxxx-xxxx"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <button 
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                  className="px-6 py-3 border border-outline-variant rounded-xl text-sm font-bold text-on-surface hover:bg-surface-container transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                >
                  <RefreshCw size={16} className={cn(testingConnection && "animate-spin")} />
                  Tes Koneksi
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Templates */}
        <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-on-surface">Template Pesan</h2>
              <p className="text-sm text-on-surface-variant">Atur format pesan otomatis untuk pelanggan.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-surface-container shadow-inner rounded-xl border border-outline-variant/30">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">Notifikasi Pesanan Baru</label>
              <textarea 
                rows={4}
                className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-on-surface resize-none"
                value={config.wa_template_new_order}
                onChange={(e) => setConfig({ ...config, wa_template_new_order: e.target.value })}
                placeholder="Halo {nama}, terima kasih telah melakukan pemesanan..."
              />
              <div className="mt-4 flex gap-2 flex-wrap">
                {['{nama}', '{id}', '{total}', '{tanggal}'].map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => setConfig({ ...config, wa_template_new_order: config.wa_template_new_order + tag })}
                    className="px-2 py-1 bg-white border border-outline-variant rounded text-[10px] font-mono text-on-surface-variant hover:border-primary hover:text-primary transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSaveConfig}
          disabled={isSubmitting}
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-container transition-all shadow-lg active:scale-95 disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          Simpan Konfigurasi
        </button>
      </div>
    </motion.div>
  );
}
