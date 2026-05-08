import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { publicService } from '../services/publicService';
import { formService } from '../services/formService';

interface Field {
  id: string;
  label: string;
  field_type: string;
  is_required: boolean;
  options: string[] | null;
}

interface FormConfig {
  id: string;
  title: string;
  description: string;
  fields: Field[];
}

export default function PublicForm({ slug, previewId, onBack }: { slug?: string, previewId?: string, onBack?: () => void }) {
  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{ submission_number?: string, wa_redirect_url?: string }>({});

  useEffect(() => {
    if (!slug && !previewId) {
      setError('Form tidak ditemukan.');
      setIsLoading(false);
      return;
    }

    const fetchForm = async () => {
      try {
        setIsLoading(true);
        // Jika previewId ada, ambil dari formService (authenticated) agar bisa baca DRAFT.
        // Jika tidak, gunakan publicService (unauthenticated).
        const res = previewId 
          ? await formService.getForm(previewId) 
          : await publicService.getPublicForm(slug!);

        if (res.success) {
          setFormConfig(res.data);
        } else {
          setError(res.message || 'Form tidak ditemukan.');
        }
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat memuat form.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [slug, previewId]);

  const handleChange = (fieldId: string, value: any) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckboxChange = (fieldId: string, option: string, checked: boolean) => {
    setValues((prev) => {
      const current = prev[fieldId] || [];
      if (checked) {
        return { ...prev, [fieldId]: [...current, option] };
      } else {
        return { ...prev, [fieldId]: current.filter((o: string) => o !== option) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formConfig) return;

    if (previewId) {
      alert("Ini adalah mode Preview. Form tidak dapat di-submit.");
      return;
    }

    if (!slug) {
      alert("Slug form tidak ditemukan.");
      return;
    }

    // Validate required fields
    for (const field of formConfig.fields) {
      const val = values[field.id];
      if (field.is_required && (!val || (Array.isArray(val) && val.length === 0))) {
        alert(`Kolom "${field.label}" wajib diisi.`);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const res = await publicService.submitPublicForm(slug, values);
      if (res.success) {
        setIsSuccess(true);
        setSuccessData(res.data);
      } else {
        alert(res.message || 'Gagal mengirim form.');
      }
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat mengirim form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex flex-col items-center justify-center py-12 px-4">
        <Loader2 className="animate-spin text-primary w-12 h-12 mb-4" />
        <p className="text-on-surface-variant font-medium">Memuat form...</p>
      </div>
    );
  }

  if (error || !formConfig) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex flex-col items-center justify-center py-12 px-4">
        <AlertCircle className="text-error w-16 h-16 mb-4" />
        <h2 className="text-2xl font-bold text-on-surface mb-2">Oops!</h2>
        <p className="text-on-surface-variant">{error}</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex flex-col items-center py-12 px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-lg bg-white border border-outline-variant rounded-3xl shadow-2xl overflow-hidden p-8 text-center"
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-bold text-on-surface mb-4">Berhasil Dikirim!</h2>
          <p className="text-on-surface-variant mb-6">
            Terima kasih telah mengisi formulir <strong>{formConfig.title}</strong>.
          </p>
          {successData.submission_number && (
            <div className="bg-surface py-3 px-4 rounded-xl inline-block mb-8">
              <span className="text-sm text-on-surface-variant">Nomor Pesanan:</span>
              <span className="ml-2 font-bold text-primary">{successData.submission_number}</span>
            </div>
          )}
          
          {successData.wa_redirect_url && (
            <a 
              href={successData.wa_redirect_url} 
              target="_blank" 
              rel="noreferrer"
              className="block w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary-container transition-all shadow-lg text-lg"
            >
              Lanjutkan ke WhatsApp
            </a>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col items-center py-12 px-4 font-sans selection:bg-primary selection:text-white">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white border border-outline-variant rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="px-8 py-10 relative bg-primary/5 border-b border-outline-variant">
          {previewId && onBack && (
            <button 
              onClick={onBack}
              type="button"
              className="mb-6 flex items-center gap-2 text-sm font-bold text-primary bg-white px-4 py-2 rounded-full border border-primary/20 hover:bg-primary/10 transition-colors shadow-sm w-fit group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Kembali ke Dashboard
            </button>
          )}
          
          <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-2">{formConfig.title}</h1>
          {formConfig.description && (
            <p className="text-on-surface-variant leading-relaxed">
              {formConfig.description}
            </p>
          )}
        </div>

        <div className="px-8 py-8 relative">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {formConfig.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="text-sm font-bold text-on-surface">
                  {field.label} {field.is_required && <span className="text-error">*</span>}
                </label>
                
                {/* Teks Pendek / Email / Telepon */}
                {['text', 'email', 'phone'].includes(field.field_type) && (
                  <input 
                    type={field.field_type === 'email' ? 'email' : field.field_type === 'phone' ? 'tel' : 'text'} 
                    required={field.is_required}
                    value={values[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-outline"
                  />
                )}

                {/* Paragraf / Alamat */}
                {['para', 'address'].includes(field.field_type) && (
                  <textarea 
                    required={field.is_required}
                    rows={3}
                    value={values[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-outline resize-none"
                  />
                )}

                {/* Radio Button */}
                {field.field_type === 'radio' && field.options && (
                  <div className="space-y-2">
                    {field.options.map((opt) => (
                      <label key={opt} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-outline-variant hover:border-primary/50 transition-colors bg-surface">
                        <input 
                          type="radio" 
                          name={field.id}
                          value={opt}
                          required={field.is_required && !values[field.id]}
                          checked={values[field.id] === opt}
                          onChange={(e) => handleChange(field.id, e.target.value)}
                          className="w-5 h-5 text-primary focus:ring-primary border-outline-variant"
                        />
                        <span className="text-on-surface">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Checkbox */}
                {field.field_type === 'check' && field.options && (
                  <div className="space-y-2">
                    {field.options.map((opt) => {
                      const isChecked = (values[field.id] || []).includes(opt);
                      return (
                        <label key={opt} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-outline-variant hover:border-primary/50 transition-colors bg-surface">
                          <input 
                            type="checkbox" 
                            value={opt}
                            checked={isChecked}
                            onChange={(e) => handleCheckboxChange(field.id, opt, e.target.checked)}
                            className="w-5 h-5 text-primary focus:ring-primary border-outline-variant rounded"
                          />
                          <span className="text-on-surface">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
                
                {/* Dropdown */}
                {field.field_type === 'drop' && field.options && (
                  <select
                    required={field.is_required}
                    value={values[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none"
                  >
                    <option value="" disabled>Pilih salah satu...</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-4 rounded-2xl text-xl font-bold hover:bg-primary-container transition-all shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 mt-12 group disabled:opacity-70 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  Kirim Jawaban
                  <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-outline-variant text-center space-y-2">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Powered by</p>
            <h2 className="text-2xl font-black text-primary italic tracking-tight">Formly</h2>
          </div>
        </div>
      </motion.div>
      
      <p className="mt-8 text-xs text-on-surface-variant font-medium opacity-60">
        Protected by SecureOrder™ Encryption. © {new Date().getFullYear()} Formly Systems.
      </p>
    </div>
  );
}
