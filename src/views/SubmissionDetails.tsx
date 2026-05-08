import React, { useState, useEffect } from 'react';
import { ChevronRight, MessageCircle, Mail, Download, ArrowLeft, Send, CheckCircle, FileText, Repeat, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { submissionService } from '../services/submissionService';
import { Submission } from '../types/submission';
import { cn } from '../lib/utils';

interface SubmissionDetailsProps {
  submissionId?: string;
  onBack: () => void;
}

export default function SubmissionDetails({ submissionId, onBack }: SubmissionDetailsProps) {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (submissionId) {
      loadSubmission();
    }
  }, [submissionId]);

  const loadSubmission = async () => {
    setLoading(true);
    try {
      const res = await submissionService.getSubmission(submissionId!);
      if (res.success) {
        setSubmission(res.data);
      }
    } catch (error) {
      console.error("Gagal memuat detail submission:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    setIsUpdatingStatus(true);
    try {
      const res = await submissionService.updateStatus(submissionId!, status);
      if (res.success) {
        setSubmission({ ...submission!, status });
      }
    } catch (error) {
      alert("Gagal memperbarui status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;
    setIsSubmittingNote(true);
    try {
      const res = await submissionService.addNote(submissionId!, noteContent);
      if (res.success) {
        // Optimistic update or reload
        loadSubmission();
        setNoteContent('');
      }
    } catch (error) {
      alert("Gagal menambahkan catatan");
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleResendWa = async () => {
    try {
      const res = await submissionService.resendWa(submissionId!);
      if (res.success) {
        alert("Notifikasi WA berhasil dikirim ulang");
      }
    } catch (error) {
      alert("Gagal mengirim ulang WA");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 gap-3">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-on-surface-variant font-medium">Memuat detail respon...</p>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-center py-20">
        <p className="text-on-surface-variant mb-4">Data tidak ditemukan.</p>
        <button onClick={onBack} className="text-primary font-bold">Kembali</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-semibold text-sm group w-fit"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Daftar Respon
        </button>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-on-surface">Respon #{submission.submission_number}</h1>
              <span className={cn(
                "font-bold text-xs px-3 py-1 rounded-full uppercase tracking-widest",
                submission.status === 'new' ? "bg-surface-container-high text-on-surface-variant" :
                submission.status === 'read' ? "bg-secondary-container text-primary" :
                submission.status === 'done' ? "bg-success-bg text-success-text" : "bg-outline-variant text-on-surface"
              )}>
                {submission.status === 'new' ? 'Baru' : submission.status === 'read' ? 'Dibaca' : submission.status === 'done' ? 'Selesai' : submission.status}
              </span>
            </div>
            <p className="text-on-surface-variant text-sm">Diterima: {new Date(submission.submitted_at).toLocaleString('id-ID')} WIB</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={() => handleUpdateStatus('read')}
               disabled={isUpdatingStatus || submission.status === 'read'}
               className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-primary-container transition-all shadow-sm disabled:opacity-50"
             >
               Tandai Sudah Dibaca
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
                <p className="font-semibold text-on-surface">{submission.customer_name || '-'}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-1">Nomor WhatsApp</label>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-on-surface">{submission.customer_phone || '-'}</p>
                  {submission.customer_phone && (
                    <button className="text-[#25D366] hover:bg-[#25D366]/10 p-1 rounded-full transition-colors">
                      <MessageCircle size={18} fill="currentColor" />
                    </button>
                  )}
                </div>
              </div>
              {/* Data pelanggan tambahan bisa diambil dari values jika ada */}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-outline-variant pb-3 leading-none">
              <h3 className="text-lg font-bold text-on-surface">Detail Formulir</h3>
              <p className="text-sm font-medium text-primary">{submission.form_title}</p>
            </div>
            <div className="space-y-6">
              {submission.values?.map((val, idx) => (
                <div key={idx} className="bg-surface p-4 rounded-xl border border-outline-variant">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-1">{val.field_label}</label>
                  {val.value_json ? (
                    <pre className="text-sm font-semibold text-on-surface whitespace-pre-wrap font-sans">
                      {Array.isArray(val.value_json) ? val.value_json.join(', ') : JSON.stringify(val.value_json, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-sm font-semibold text-on-surface">{val.value_text || '-'}</p>
                  )}
                </div>
              ))}
              
              {(!submission.values || submission.values.length === 0) && (
                <p className="text-sm text-on-surface-variant italic">Tidak ada detail jawaban.</p>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm">
            <h3 className="text-lg font-bold text-on-surface mb-6">Tindakan</h3>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-on-surface block mb-2 uppercase tracking-widest">Update Status Respon</label>
                <div className="relative">
                  <select 
                    value={submission.status}
                    onChange={(e) => handleUpdateStatus(e.target.value)}
                    disabled={isUpdatingStatus}
                    className="w-full appearance-none bg-surface border border-outline-variant rounded-lg px-4 py-2 text-sm font-bold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                  >
                    <option value="new">Respon Baru</option>
                    <option value="read">Sudah Dibaca</option>
                    <option value="done">Selesai</option>
                  </select>
                </div>
              </div>

              <hr className="border-outline-variant" />

              <div>
                <label className="text-xs font-bold text-on-surface block mb-3 uppercase tracking-widest">Notifikasi Pelanggan</label>
                <div className="space-y-3">
                  <button 
                    onClick={handleResendWa}
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#128C7E] transition-all rounded-lg py-2.5 text-sm font-bold shadow-sm"
                  >
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
              {submission.notes?.map((note) => (
                <div key={note.id} className="bg-white border border-outline-variant p-3 rounded-xl shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-on-surface">{note.user_name}</span>
                    <span className="text-[10px] text-on-surface-variant">{new Date(note.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {note.content}
                  </p>
                </div>
              ))}
              {(!submission.notes || submission.notes.length === 0) && (
                <p className="text-xs text-on-surface-variant italic text-center py-4">Belum ada catatan.</p>
              )}
            </div>
            <div className="p-4 bg-white border-t border-outline-variant">
              <textarea 
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none h-20 mb-3"
                placeholder="Tambah catatan internal baru..."
              />
              <div className="flex justify-end">
                <button 
                  onClick={handleAddNote}
                  disabled={isSubmittingNote || !noteContent.trim()}
                  className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSubmittingNote ? 'Menyimpan...' : 'Simpan Catatan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
