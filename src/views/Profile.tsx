import React from 'react';
import { Camera, Mail, Phone, MapPin, Building, Calendar, Edit3 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Profile() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-12"
    >
      {/* Header Profile */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl overflow-hidden shadow-sm">
        <div className="h-48 bg-primary relative">
          <div className="absolute -bottom-16 left-8 p-1.5 bg-surface rounded-full">
            <div className="relative group">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAusETVBoa3v1yNS7G3II5xdsLACSYMw3VKgQayx2V1ZyXaxeBtDl6fvhZ7nkjvbgpwW9Sb2m1urp-SF_BNNov-s1QPoIhiN3M_z9VSFoBuZyTm6GYp4ioDe1RTc5f7sQjQn1VjVFO3lOLpKvEeyPFovk-wuN6lGCKi5UI98D3XenoA5hLL7dILS7PCDppItpL9IlXkpIPPXA065CyjFdKCNH2pE5_ylcGqLKY-OFkiel_1pbkyFE3vk6wtdgxmRpO1tytFA0u3onSd" 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-4 border-surface shadow-md"
              />
              <button className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} />
              </button>
            </div>
          </div>
        </div>
        <div className="pt-20 pb-8 px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Formly Admin</h1>
            <p className="text-on-surface-variant flex items-center gap-2 mt-1">
              <Building size={16} />
              Administrator Sistem
              <span className="w-1.5 h-1.5 bg-success-text rounded-full shrink-0" />
              Aktif
            </p>
          </div>
          <button className="bg-secondary-container text-primary px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary/10 transition-colors border border-primary/20">
            <Edit3 size={18} />
            Edit Profil
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Info Kontak */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant shadow-sm h-full">
            <h2 className="font-bold text-lg text-on-surface mb-6">Informasi Pribadi</h2>
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">Email</label>
                <div className="flex items-center gap-3 text-on-surface">
                  <Mail size={18} className="text-primary" />
                  <span className="font-medium">admin@formly.app</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">Telepon</label>
                <div className="flex items-center gap-3 text-on-surface">
                  <Phone size={18} className="text-primary" />
                  <span className="font-medium">+62 812-3456-7890</span>
                </div>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">Lokasi Kantor</label>
                <div className="flex items-center gap-3 text-on-surface">
                  <MapPin size={18} className="text-primary" />
                  <span className="font-medium">Jakarta Selatan, Indonesia</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Tambahan */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant shadow-sm flex flex-col items-center text-center">
            <div className="p-4 bg-primary/10 text-primary rounded-full mb-4">
              <Calendar size={32} />
            </div>
            <p className="text-xs text-on-surface-variant uppercase font-bold tracking-widest">Bergabung Sejak</p>
            <p className="text-lg font-bold text-on-surface mt-1">1 Januari 2023</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
