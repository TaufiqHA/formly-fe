import React, { useState } from 'react';
import { Type, AlignLeft, ChevronDown, CheckSquare, Radio, Mail, Phone, MapPin, Edit, Copy, Trash2, Save, Layout, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface FormElement {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
  icon: any;
  options?: string[];
}

export default function FormBuilder({ onBack }: { onBack: () => void }) {
  const [formTitle, setFormTitle] = useState('Formulir Pemesanan Barang');
  const [formDescription, setFormDescription] = useState('Silakan isi detail pesanan Anda di bawah ini.');
  const [formElements, setFormElements] = useState<FormElement[]>([
    { id: '1', type: 'text', label: 'Nama Lengkap', placeholder: 'Masukkan nama lengkap Anda', required: true, icon: Type },
    { id: '2', type: 'phone', label: 'Nomor WhatsApp', placeholder: 'Contoh: 08123456789', required: true, icon: Phone },
  ]);
  const [activeField, setActiveField] = useState<string | null>('1');
  const [isSaved, setIsSaved] = useState(false);

  const toolBoxItems = [
    { label: 'Dasar', items: [
      { id: 'text', label: 'Teks Pendek', icon: Type },
      { id: 'para', label: 'Paragraf', icon: AlignLeft },
      { id: 'drop', label: 'Dropdown', icon: ChevronDown },
      { id: 'check', label: 'Checkbox', icon: CheckSquare },
      { id: 'radio', label: 'Radio', icon: Radio },
    ]},
    { label: 'Kontak & Logistik', items: [
      { id: 'email', label: 'Email', icon: Mail },
      { id: 'phone', label: 'Telepon', icon: Phone },
      { id: 'address', label: 'Alamat Lengkap', icon: MapPin },
    ]}
  ];

  const handleAddField = (item: any) => {
    const newId = Date.now().toString();
    const hasOptions = ['drop', 'check', 'radio'].includes(item.id);
    const newElement: FormElement = {
      id: newId,
      type: item.id,
      label: item.label,
      placeholder: `Masukkan ${item.label.toLowerCase()}...`,
      required: false,
      icon: item.icon,
      options: hasOptions ? ['Opsi 1', 'Opsi 2', 'Opsi 3'] : undefined
    };
    setFormElements([...formElements, newElement]);
    setActiveField(newId);
  };

  const handleDeleteField = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFormElements(formElements.filter(el => el.id !== id));
    if (activeField === id) setActiveField(null);
  };

  const handleDuplicateField = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const index = formElements.findIndex(el => el.id === id);
    const element = formElements[index];
    const newId = Date.now().toString();
    const newElement = { ...element, id: newId, label: `${element.label} (Copy)` };
    const newElements = [...formElements];
    newElements.splice(index + 1, 0, newElement);
    setFormElements(newElements);
    setActiveField(newId);
  };

  const handleUpdateField = (id: string, updates: Partial<FormElement>) => {
    setFormElements(formElements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const renderFieldInput = (element: FormElement) => {
    switch (element.type) {
      case 'para':
      case 'address':
        return (
          <textarea 
            placeholder={element.placeholder} 
            rows={3}
            className="w-full border border-outline-variant rounded-xl p-3 text-sm bg-white text-on-surface placeholder-on-surface-variant resize-none focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        );
      case 'drop':
        return (
          <div className="relative">
            <select className="w-full border border-outline-variant rounded-xl p-3 text-sm bg-white text-on-surface appearance-none cursor-pointer focus:ring-1 focus:ring-primary outline-none transition-all">
              <option value="" disabled selected>{element.placeholder}</option>
              {element.options?.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none" size={16} />
          </div>
        );
      case 'check':
        return (
          <div className="space-y-2">
            {element.options?.map((opt, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer group w-fit">
                <input type="checkbox" className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer" />
                <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">{opt}</span>
              </label>
            ))}
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {element.options?.map((opt, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer group w-fit">
                <input type="radio" name={`radio-${element.id}`} className="w-5 h-5 border-outline-variant text-primary focus:ring-primary cursor-pointer" />
                <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">{opt}</span>
              </label>
            ))}
          </div>
        );
      default:
        return (
          <input 
            type={element.type === 'email' ? 'email' : element.type === 'phone' ? 'tel' : 'text'}
            placeholder={element.placeholder} 
            className="w-full border border-outline-variant rounded-xl p-3 text-sm bg-white text-on-surface placeholder-on-surface-variant focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        );
    }
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] -m-6 animate-in fade-in duration-500 overflow-hidden relative">
      <AnimatePresence>
        {isSaved && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-success-bg text-success-text px-6 py-3 rounded-full shadow-lg font-bold flex items-center gap-2 border border-success-text/20"
          >
            <CheckCircle2 size={20} />
            Formulir berhasil disimpan!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbox */}
      <aside className="w-72 bg-white border-r border-outline-variant flex flex-col shrink-0">
        <div className="p-6 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors"
            >
              <LayoutDashboard size={20} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-on-surface leading-tight">Tipe Field</h2>
              <p className="text-sm text-on-surface-variant mt-1">Klik untuk menambah ke kanvas</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-8 overflow-y-auto">
          {toolBoxItems.map(group => (
            <div key={group.label}>
              <h3 className="text-xs font-bold text-outline uppercase tracking-widest mb-4">{group.label}</h3>
              <div className="grid grid-cols-2 gap-3">
                {group.items.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => handleAddField(item)}
                    className="flex flex-col items-center justify-center p-4 border border-outline-variant rounded-xl bg-surface hover:border-primary hover:text-primary hover:shadow-md transition-all group group-active:scale-95 duration-150 cursor-pointer"
                  >
                    <item.icon size={20} className="text-on-surface-variant group-hover:text-primary mb-2 transition-colors" />
                    <span className="text-[11px] font-bold text-center leading-tight">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Canvas */}
      <section className="flex-1 bg-surface-container-low p-12 overflow-y-auto flex flex-col items-center relative">
        <div className="w-full max-w-2xl space-y-0">
          <div className="bg-white rounded-t-2xl border border-outline-variant border-b-0 p-8 shadow-sm">
            <input 
              className="w-full text-3xl font-bold text-on-surface border-none focus:ring-0 p-0 mb-2 bg-transparent placeholder-on-surface/30" 
              placeholder="Judul Formulir" 
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
            <input 
              className="w-full text-base text-on-surface-variant border-none focus:ring-0 p-0 bg-transparent placeholder-on-surface-variant/30" 
              placeholder="Deskripsi Formulir" 
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            />
          </div>
          <div className="bg-white border border-outline-variant rounded-b-2xl shadow-md min-h-[500px] p-6 space-y-6 pb-24">
            <AnimatePresence>
              {formElements.map((element) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={element.id}
                  onClick={() => setActiveField(element.id)}
                  className={cn(
                    "relative group rounded-xl p-6 transition-all cursor-pointer",
                    activeField === element.id 
                      ? "border-2 border-primary bg-primary/5 ring-4 ring-primary/5" 
                      : "border border-transparent hover:border-outline-variant hover:bg-surface"
                  )}
                >
                  {activeField === element.id && (
                    <div className="absolute -top-12 right-0 flex gap-1 bg-white shadow-lg rounded-xl border border-outline-variant p-1 animate-in zoom-in-95 duration-200 z-10">
                      <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"><Edit size={16} /></button>
                      <button 
                        onClick={(e) => handleDuplicateField(element.id, e)}
                        className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
                      >
                        <Copy size={16} />
                      </button>
                      <div className="w-px bg-outline-variant mx-1 my-2" />
                      <button 
                        onClick={(e) => handleDeleteField(element.id, e)}
                        className="p-2 text-error hover:bg-error-container rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-3">
                    <input 
                      type="text"
                      className="bg-transparent border-none p-0 text-sm font-bold text-on-surface focus:ring-0 w-full"
                      value={element.label}
                      onChange={(e) => handleUpdateField(element.id, { label: e.target.value })}
                    />
                    {element.required && <span className="text-error ml-1">*</span>}
                    <Layout size={14} className="text-outline-variant opacity-0 group-hover:opacity-100" />
                  </div>
                  
                  {renderFieldInput(element)}
                  
                  {activeField === element.id && (
                    <div className="mt-4 pt-4 border-t border-outline-variant/30 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      {element.options && (
                        <div className="space-y-3">
                          <label className="text-[10px] font-bold text-on-surface uppercase tracking-widest">Pilihan Opsi</label>
                          <div className="grid gap-2">
                            {element.options.map((opt, i) => (
                              <div key={i} className="flex gap-2 items-center">
                                <input 
                                  className="flex-1 border border-outline-variant rounded-lg px-2 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-none"
                                  value={opt}
                                  onChange={(e) => {
                                    const newOptions = [...(element.options || [])];
                                    newOptions[i] = e.target.value;
                                    handleUpdateField(element.id, { options: newOptions });
                                  }}
                                />
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newOptions = element.options?.filter((_, idx) => idx !== i);
                                    handleUpdateField(element.id, { options: newOptions });
                                  }}
                                  className="p-1.5 text-on-surface-variant hover:text-error transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateField(element.id, { options: [...(element.options || []), `Opsi ${element.options!.length + 1}`] });
                            }}
                            className="text-[10px] font-bold text-primary hover:underline"
                          >
                            + Tambah Opsi
                          </button>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-on-surface uppercase tracking-widest">Wajib Diisi</span>
                          <p className="text-[9px] text-on-surface-variant">Harus diisi oleh pengguna</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={element.required}
                          onChange={(e) => handleUpdateField(element.id, { required: e.target.checked })}
                          className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer transition-all" 
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex justify-center pt-8">
              <button 
                onClick={() => handleAddField({ id: 'text', label: 'Elemen Baru', icon: Type })}
                className="text-primary text-sm font-bold hover:underline py-4 px-12 border-2 border-dashed border-outline-variant rounded-2xl w-full hover:bg-white hover:border-primary/50 transition-all"
              >
                + Tambah Elemen Baru
              </button>
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="fixed bottom-8 bg-primary text-white px-8 py-4 rounded-full shadow-xl hover:bg-primary-container hover:scale-105 active:scale-95 transition-all font-bold flex items-center gap-2 group z-20"
        >
          <Save size={20} className="group-hover:rotate-12 transition-transform" />
          Simpan Formulir
        </button>
      </section>
    </div>
  );
}
