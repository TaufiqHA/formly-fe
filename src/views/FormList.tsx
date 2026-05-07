import React, { useState } from 'react';
import { Plus, Search, FileText, ExternalLink, Edit2, Calendar, Users, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface FormItem {
  id: string;
  title: string;
  submissions: number;
  lastUpdated: string;
  status: 'active' | 'draft';
}

interface FormListProps {
  onCreateNew: () => void;
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
}

export default function FormList({ onCreateNew, onEdit, onPreview }: FormListProps) {
  const [forms, setForms] = useState<FormItem[]>([
    { id: '1', title: 'Formulir Pemesanan Barang', submissions: 1248, lastUpdated: '12 Okt 2023', status: 'active' },
    { id: '2', title: 'Registrasi Workshop Mingguan', submissions: 85, lastUpdated: '10 Okt 2023', status: 'active' },
    { id: '3', title: 'Survey Kepuasan Pelanggan', submissions: 0, lastUpdated: '08 Okt 2023', status: 'draft' },
  ]);

  const handleDeleteForm = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus formulir ini?')) {
      setForms(forms.filter(f => f.id !== id));
    }
  };

  const handleDuplicateForm = (form: FormItem) => {
    const newForm: FormItem = {
      ...form,
      id: Date.now().toString(),
      title: `${form.title} (Copy)`,
      submissions: 0,
      lastUpdated: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    setForms([...forms, newForm]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Manajemen Formulir</h1>
          <p className="text-on-surface-variant mt-1">Buat dan kelola formulir pesanan digital Anda.</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-primary-container transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} />
          Buat Formulir Baru
        </button>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
          <input 
            type="text" 
            placeholder="Cari judul formulir..." 
            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex gap-2">
           <select className="px-4 py-2.5 border border-outline-variant rounded-xl bg-surface text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20">
             <option>Semua Status</option>
             <option>Aktif</option>
             <option>Draft</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {forms.map((form) => (
            <motion.div 
              key={form.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -4 }}
              className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={cn(
                  "p-3 rounded-xl",
                  form.status === 'active' ? "bg-primary/10 text-primary" : "bg-surface-container-highest text-on-surface-variant"
                )}>
                  <FileText size={24} />
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => onPreview(form.id)}
                    className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
                    title="Preview"
                  >
                    <ExternalLink size={18} />
                  </button>
                  <button 
                    onClick={() => onEdit(form.id)}
                    className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-lg text-on-surface mb-2 line-clamp-1 group-hover:text-primary transition-colors cursor-pointer" onClick={() => onEdit(form.id)}>
                {form.title}
              </h3>
              
              <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-outline-variant/30">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-on-surface-variant flex items-center gap-1.5 leading-none">
                    <Users size={14} />
                    {form.submissions} Submisi
                  </span>
                  <span className="text-on-surface-variant flex items-center gap-1.5 leading-none">
                    <Calendar size={14} />
                    {form.lastUpdated}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest leading-none",
                    form.status === 'active' ? "bg-success-bg text-success-text" : "bg-outline-variant text-on-surface-variant"
                  )}>
                    {form.status === 'active' ? 'Aktif' : 'Draft'}
                  </span>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDeleteForm(form.id)}
                      className="text-[10px] font-bold text-on-surface-variant hover:text-error transition-colors uppercase tracking-widest"
                    >
                      Hapus
                    </button>
                    <div className="w-px h-3 bg-outline-variant" />
                    <button 
                      onClick={() => handleDuplicateForm(form)}
                      className="text-[10px] font-bold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest"
                    >
                      Duplikat
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button 
          onClick={onCreateNew}
          className="border-2 border-dashed border-outline-variant rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-on-surface-variant hover:border-primary hover:text-primary hover:bg-primary/5 transition-all min-h-[240px]"
        >
          <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
            <Plus size={24} />
          </div>
          <span className="font-bold text-sm">Buat Formulir Baru</span>
        </button>
      </div>
    </motion.div>
  );
}
