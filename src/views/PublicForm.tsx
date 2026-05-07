import React from 'react';
import { Send, Image as ImageIcon, MapPin, Truck, CheckCircle, Package } from 'lucide-react';
import { motion } from 'motion/react';

export default function PublicForm() {
  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col items-center py-12 px-4 font-sans selection:bg-primary selection:text-white">
      <div className="w-full max-w-2xl bg-white border border-outline-variant rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-700">
        <div className="h-48 relative overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_-AQwhxnCi8Zg65o1u0ux3ItPCD9hPATrkB8YNW1h0sRS6QYl7jv4orSQTcg3_8RBO4WCGunTXGPakuYw6CcqwiQxMrazwnVV0o2roSfRhpOh0LiH5K0Pi7rslK_cb7MYA8lr4pgR6lWiaPm9tRaIDsIOEpeCLl39bGFgmYw-j5DN_-Hdzj-0CugOX6hzK7uJ0S0IKKxMXV-2osQirB1Ysd7fCRjrHTuHgw-9EzICjhBm_SS1pze5crFCXGcSrXkxrTNSGMVODQ36" 
            alt="Logistic Header"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>

        <div className="px-8 pb-12 -mt-12 relative">
          <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-lg mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                <Truck size={28} />
              </div>
              <h1 className="text-3xl font-bold text-on-surface tracking-tight">Formulir Pesanan Global</h1>
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              Silakan lengkapi informasi di bawah ini untuk memulai pengiriman kargo Anda. Tim logistik kami akan segera menghubungi Anda.
            </p>
          </div>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 border-l-4 border-primary pl-3">
                Identitas Pengirim
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">Nama Lengkap <span className="text-error">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Masukkan nama lengkap" 
                    className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-outline"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-on-surface">Nomor WhatsApp <span className="text-error">*</span></label>
                  <input 
                    type="tel" 
                    placeholder="Contoh: 081234567890" 
                    className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-outline"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface">Alamat Pengambilan <span className="text-error">*</span></label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-outline" size={18} />
                  <textarea 
                    rows={3}
                    placeholder="Tuliskan alamat lengkap pengambilan barang" 
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-outline resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2 border-l-4 border-primary pl-3">
                Detail Muatan
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface">Jenis Layanan</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'fcl', label: 'Full Container', icon: Package },
                    { id: 'lcl', label: 'Less Container', icon: ImageIcon },
                    { id: 'express', label: 'Express Air', icon: Send },
                  ].map((service) => (
                    <label key={service.id} className="relative group cursor-pointer">
                      <input type="radio" name="service" className="sr-only peer" defaultChecked={service.id === 'fcl'} />
                      <div className="flex flex-col items-center gap-2 p-4 bg-surface border border-outline-variant rounded-xl group-hover:border-primary transition-all peer-checked:bg-primary/5 peer-checked:border-primary peer-checked:ring-4 peer-checked:ring-primary/5">
                        <service.icon size={20} className="text-on-surface-variant peer-checked:text-primary" />
                        <span className="text-xs font-bold text-on-surface">{service.label}</span>
                        <CheckCircle size={14} className="absolute top-2 right-2 text-primary opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface">Estimasi Berat (Ton)</label>
                <input 
                  type="number" 
                  placeholder="0" 
                  className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-outline"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface">Instruksi Khusus (Opsional)</label>
                <textarea 
                  rows={2}
                  placeholder="Ada instruksi tambahan untuk tim operasional?" 
                  className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-outline resize-none"
                />
              </div>
            </div>

            <button className="w-full bg-primary text-white py-4 rounded-2xl text-xl font-bold hover:bg-primary-container transition-all shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 mt-12 group">
              Kirim Pesanan
              <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-outline-variant text-center space-y-2">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Powered by</p>
            <h2 className="text-2xl font-black text-primary italic tracking-tight">Orderly</h2>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-xs text-on-surface-variant font-medium opacity-60">
        Protected by SecureOrder™ Encryption. © 2023 Orderly Systems.
      </p>
    </div>
  );
}
