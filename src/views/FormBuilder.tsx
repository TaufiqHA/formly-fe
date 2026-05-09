import React, { useState, useEffect } from 'react';
import { Type, AlignLeft, ChevronDown, CheckSquare, Radio, Mail, Phone, MapPin, Edit, Copy, Trash2, Save, Layout, CheckCircle2, LayoutDashboard, Loader2, Share2, Link as LinkIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { formService } from '../services/formService';

interface FormElement {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
  icon: any;
  options?: string[];
}

interface FormBuilderProps {
  formId?: string;
  onBack: () => void;
}

const getIconByType = (type: string) => {
  const icons: Record<string, any> = {
    text: Type,
    para: AlignLeft,
    drop: ChevronDown,
    check: CheckSquare,
    radio: Radio,
    email: Mail,
    phone: Phone,
    address: MapPin,
  };
  return icons[type] || Type;
};

export default function FormBuilder({ formId, onBack }: FormBuilderProps) {
  const [formTitle, setFormTitle] = useState('Memuat...');
  const [formDescription, setFormDescription] = useState('');
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToolboxOpen, setIsToolboxOpen] = useState(false);
  
  // States for Publishing
  const [formStatus, setFormStatus] = useState<'draft' | 'active'>('draft');
  const [formSlug, setFormSlug] = useState<string>('');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (!formId) {
      setIsLoading(false);
      return;
    }

    const loadFormData = async () => {
      try {
        const res = await formService.getForm(formId);
        if (res.success) {
          setFormTitle(res.data.title);
          setFormDescription(res.data.description || '');
          setFormStatus(res.data.status);
          setFormSlug(res.data.slug);
          
          // Map fields dari backend ke format state lokal
          const mappedFields = res.data.fields.map((f: any) => ({
            id: f.id,
            type: f.field_type,
            label: f.label,
            placeholder: f.placeholder || '',
            required: !!f.is_required,
            icon: getIconByType(f.field_type),
            options: f.options || undefined
          }));
          
          setFormElements(mappedFields);
          if (mappedFields.length > 0) setActiveField(mappedFields[0].id);
        }
      } catch (e) {
        console.error("Gagal memuat form", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadFormData();
  }, [formId]);

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

  const handleSave = async () => {
    if (!formId) return alert('Form ID tidak ditemukan');
    
    setIsSaving(true);
    
    try {
      // 1. Simpan Judul dan Deskripsi Form
      await formService.updateForm(formId, {
        title: formTitle,
        description: formDescription
      });

      // 2. Format state lokal (FormElement) ke struktur Request API
      const formattedFields = formElements.map((el, index) => {
        // Cek apakah ID asalnya dari Date.now() (berarti field baru).
        // Jika ya, we do not send the id to backend so it's treated as a new field.
        const isNewField = !el.id.includes('-'); 
        
        return {
          ...(isNewField ? {} : { id: el.id }), 
          label: el.label,
          field_type: el.type,
          placeholder: el.placeholder,
          is_required: el.required,
          options: el.options || null,
          sort_order: index 
        };
      });

      // 3. Tembak API backend untuk update field
      const response = await formService.updateFormFields(formId, formattedFields);
      
      if (response.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      }
    } catch (error: any) {
      alert('Gagal menyimpan form: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!formId) return;
    setIsPublishing(true);
    try {
      // Disarankan untuk menyimpan form (handleSave) sebelum publish
      await handleSave();
      
      const res = await formService.updateFormStatus(formId, 'active');
      if (res.success) {
        setFormStatus('active');
        setFormSlug(res.data.slug);
      }
    } catch (e) {
      alert("Gagal mem-publish form.");
    } finally {
      setIsPublishing(false);
    }
  };

  const publicUrl = formSlug ? `${window.location.origin}/?f=${formSlug}` : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    alert("Link disalin ke clipboard!");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-surface-container-low gap-4 animate-in fade-in duration-500">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Menyiapkan Builder...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 overflow-hidden relative bg-surface-container-low">
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

      {/* Mobile & Desktop Drawer Backdrop */}
      <AnimatePresence>
        {isToolboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsToolboxOpen(false)}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Toolbox - Floating Panel */}
      <aside className={cn(
        "absolute top-6 bottom-6 left-6 w-80 bg-white border border-outline-variant rounded-2xl flex flex-col shrink-0 z-50 transition-all duration-500 shadow-2xl overflow-hidden",
        isToolboxOpen 
          ? "translate-x-0 opacity-100 scale-100 rotate-0" 
          : "-translate-x-full opacity-0 scale-95 -rotate-2 pointer-events-none"
      )}>
        <div className="p-5 md:p-6 border-b border-outline-variant flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-on-surface leading-tight">Komponen</h2>
              <p className="hidden md:block text-[10px] text-on-surface-variant mt-0.5 font-medium uppercase tracking-wider">Seret atau Klik</p>
            </div>
          </div>
          <button 
            onClick={() => setIsToolboxOpen(false)}
            className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors group"
          >
            <Layout size={20} className="rotate-90 group-hover:scale-110 transition-transform" />
          </button>
        </div>
        <div className="p-4 md:p-6 space-y-8 overflow-y-auto custom-scrollbar">
          {toolBoxItems.map(group => (
            <div key={group.label}>
              <h3 className="text-[10px] font-bold text-outline uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary" />
                {group.label}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {group.items.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => {
                      handleAddField(item);
                      if (window.innerWidth < 1024) setIsToolboxOpen(false);
                    }}
                    className="flex flex-col items-center justify-center p-4 border border-outline-variant rounded-2xl bg-surface hover:border-primary hover:text-primary hover:shadow-lg hover:-translate-y-0.5 transition-all group group-active:scale-95 duration-200 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center mb-2 group-hover:bg-primary/5 transition-colors">
                      <item.icon size={20} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-[11px] font-bold text-center leading-tight">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Canvas */}
      <section className="flex-1 p-6 md:p-12 overflow-y-auto flex flex-col items-center relative custom-scrollbar">
        <div className="w-full max-w-4xl flex items-center justify-between mb-12 sticky top-0 bg-surface-container-low/95 backdrop-blur-xl z-20 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsToolboxOpen(true)}
              className={cn(
                "px-5 py-3 rounded-2xl shadow-lg ring-1 ring-black/5 font-bold text-sm flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95",
                isToolboxOpen 
                  ? "bg-white text-primary border border-primary/20" 
                  : "bg-primary text-white shadow-primary/20"
              )}
            >
              <Layout size={20} />
              <span>{isToolboxOpen ? 'Tutup Panel' : 'Tambah Field'}</span>
            </button>
            <div className="h-8 w-px bg-outline-variant mx-2" />
            <button 
              onClick={onBack}
              className="p-3 bg-white border border-outline-variant rounded-2xl text-on-surface-variant hover:bg-surface-container transition-all shadow-sm hover:scale-105 active:scale-95"
              title="Kembali ke Dashboard"
            >
              <LayoutDashboard size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-[10px] font-bold text-outline uppercase tracking-widest leading-none">Status</span>
              <span className={cn(
                "text-[11px] font-medium capitalize",
                formStatus === 'active' ? "text-success-text" : "text-on-surface-variant"
              )}>{formStatus}</span>
            </div>
            
            <button 
              onClick={() => setIsPublishModalOpen(true)}
              className="px-6 py-3 rounded-2xl font-bold bg-white text-primary border border-primary/20 hover:bg-primary/5 transition-all flex items-center gap-2 group text-sm shadow-sm"
            >
              <Share2 size={20} className="group-hover:-translate-y-0.5 transition-transform" />
              {formStatus === 'active' ? 'Bagikan' : 'Publish'}
            </button>

            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={cn(
                "px-8 py-3 rounded-2xl shadow-lg transition-all font-bold flex items-center gap-2 group text-sm",
                isSaving 
                  ? "bg-primary/50 text-white cursor-not-allowed"
                  : "bg-primary text-white shadow-primary/20 hover:bg-primary-container hover:scale-105 active:scale-95"
              )}
            >
              {isSaving ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={20} className="group-hover:translate-y-[-1px] transition-transform" />
              )}
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>

        <div className="w-full max-w-3xl space-y-0 pb-32">
          <div className="bg-white rounded-t-2xl border border-outline-variant border-b-0 p-6 md:p-8 shadow-sm">
            <input 
              className="w-full text-2xl md:text-3xl font-bold text-on-surface border-none focus:ring-0 p-0 mb-2 bg-transparent placeholder-on-surface/30" 
              placeholder="Judul Formulir" 
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
            <input 
              className="w-full text-sm md:text-base text-on-surface-variant border-none focus:ring-0 p-0 bg-transparent placeholder-on-surface-variant/30" 
              placeholder="Deskripsi Formulir" 
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            />
          </div>
          <div className="bg-white border border-outline-variant rounded-b-2xl shadow-md min-h-[400px] md:min-h-[500px] p-4 md:p-6 space-y-6">
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
                    "relative group rounded-xl p-4 md:p-6 transition-all cursor-pointer",
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
      </section>

      {/* Publish Modal */}
      <AnimatePresence>
        {isPublishModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsPublishModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Share2 size={32} />
              </div>
              
              <h3 className="text-2xl font-bold text-on-surface mb-2">Publikasi Formulir</h3>
              
              {formStatus === 'draft' ? (
                <>
                  <p className="text-on-surface-variant mb-8">Formulir Anda saat ini berstatus Draft. Apakah Anda ingin mem-publish formulir ini agar bisa diisi oleh pelanggan?</p>
                  <button 
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-container hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2"
                  >
                    {isPublishing ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Publish Sekarang'}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-on-surface-variant mb-6">Formulir Anda sudah aktif. Bagikan link di bawah ini kepada pelanggan Anda.</p>
                  <div className="bg-surface-container-low rounded-xl p-2 flex items-center border border-outline-variant">
                    <div className="p-3 text-on-surface-variant"><LinkIcon size={20} /></div>
                    <input 
                      readOnly
                      value={publicUrl}
                      className="flex-1 bg-transparent border-none text-sm text-on-surface focus:ring-0 outline-none truncate"
                    />
                    <button 
                      onClick={handleCopyLink}
                      className="ml-2 px-6 py-3 bg-white border border-outline-variant rounded-lg font-bold text-sm text-on-surface hover:border-primary hover:text-primary transition-colors shadow-sm"
                    >
                      Salin
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
