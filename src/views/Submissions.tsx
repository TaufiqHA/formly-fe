import React, { useState, useEffect } from 'react';
import { Search, Filter, Download as DownloadIcon, ChevronLeft, ChevronRight, Eye, Edit2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { submissionService } from '../services/submissionService';
import { formService } from '../services/formService';
import { Submission } from '../types/submission';

export default function Submissions({ onSelectSubmission }: { onSelectSubmission: (id: string) => void }) {
  const [isExporting, setIsExporting] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [forms, setForms] = useState<{ id: string, title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    status: '',
    search: '',
    formId: ''
  });

  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    loadForms();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(params.search);
    }, 500);
    return () => clearTimeout(timer);
  }, [params.search]);

  useEffect(() => {
    loadSubmissions();
  }, [params.page, params.limit, params.status, params.formId, debouncedSearch]);

  const loadForms = async () => {
    try {
      const res = await formService.getForms();
      if (res.success) {
        setForms(res.data);
      }
    } catch (error) {
      console.error("Gagal memuat daftar form:", error);
    }
  };

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const res = await submissionService.getSubmissions({
        page: params.page,
        limit: params.limit,
        status: params.status,
        search: debouncedSearch,
        form_id: params.formId
      });
      if (res.success) {
        // API returns { items: [], pagination: {} }
        setSubmissions(res.data.items || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (error) {
      console.error("Gagal memuat submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await submissionService.exportSubmissions(params.formId);
    } catch (error) {
      console.error("Gagal export:", error);
      alert("Gagal mengekspor data");
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'new':
        return { color: 'bg-surface-container-high text-on-surface-variant', dot: 'bg-outline', label: 'Baru' };
      case 'read':
        return { color: 'bg-secondary-container text-primary', dot: 'bg-primary', label: 'Dibaca' };
      case 'done':
        return { color: 'bg-success-bg text-success-text', dot: 'bg-success-text', label: 'Selesai' };
      default:
        return { color: 'bg-surface-container-high text-on-surface-variant', dot: 'bg-outline', label: status };
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Data Masuk</h1>
          <p className="text-sm sm:text-base text-on-surface-variant mt-1">Kelola dan lihat semua hasil pengisian formulir Anda.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
              <input 
                type="text" 
                placeholder="Cari ID, Nama..." 
                className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg bg-surface text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                value={params.search}
                onChange={(e) => setParams({ ...params, search: e.target.value, page: 1 })}
              />
            </div>
            <select 
              className="px-3 py-2 border border-outline-variant rounded-lg bg-surface text-sm focus:ring-1 focus:ring-primary outline-none min-w-[160px]"
              value={params.formId}
              onChange={(e) => setParams({ ...params, formId: e.target.value, page: 1 })}
            >
              <option value="">Semua Formulir</option>
              {forms.map(form => (
                <option key={form.id} value={form.id}>{form.title}</option>
              ))}
            </select>
            <select 
              className="px-3 py-2 border border-outline-variant rounded-lg bg-surface text-sm focus:ring-1 focus:ring-primary outline-none min-w-[160px]"
              value={params.status}
              onChange={(e) => setParams({ ...params, status: e.target.value, page: 1 })}
            >
              <option value="">Semua Status</option>
              <option value="new">Baru</option>
              <option value="read">Dibaca</option>
              <option value="done">Selesai</option>
            </select>
          </div>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 bg-surface text-secondary border border-outline-variant px-4 py-2 rounded-lg font-bold text-sm hover:bg-surface-container-low transition-colors shadow-sm disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <DownloadIcon size={18} />
            )}
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin text-primary" size={32} />
              <p className="text-sm text-on-surface-variant font-medium">Memuat data...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="py-20 text-center text-on-surface-variant">
              Tidak ada data ditemukan.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest">No. Order</th>
                  <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">Waktu</th>
                  <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">Pengirim</th>
                  <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">WhatsApp</th>
                  <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">Nama Form</th>
                  <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-center">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm text-on-surface divide-y divide-outline-variant">
                {submissions.map((submission) => {
                  const style = getStatusStyle(submission.status);
                  return (
                    <tr key={submission.id} className="hover:bg-surface-bright transition-colors">
                      <td className="py-4 px-6 whitespace-nowrap font-bold text-primary cursor-pointer hover:underline" onClick={() => onSelectSubmission(submission.id)}>
                        {submission.submission_number}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-on-surface-variant text-center">
                        {new Date(submission.submitted_at).toLocaleString('id-ID')}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-center">
                        {submission.customer_name || submission.name || '-'}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-center">
                        {submission.customer_phone || submission.phone || submission.whatsapp ? (
                          <a 
                            href={`https://wa.me/${(submission.customer_phone || submission.phone || submission.whatsapp || '').replace(/[^0-9]/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium"
                          >
                            {submission.customer_phone || submission.phone || submission.whatsapp}
                          </a>
                        ) : '-'}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-center">{submission.form_title || '-'}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-center">
                        <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-bold", style.color)}>
                          <span className={cn("w-2 h-2 rounded-full mr-2", style.dot)}></span>
                          {style.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            className="text-secondary hover:text-primary transition-colors p-1.5 rounded hover:bg-surface-container-low" 
                            onClick={() => onSelectSubmission(submission.id)}
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="border-t border-outline-variant p-6 bg-surface flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
            Menampilkan {submissions.length} dari {pagination.total} data
          </span>
          <div className="flex gap-1">
            <button 
              className="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-all disabled:opacity-50"
              disabled={params.page === 1}
              onClick={() => setParams({ ...params, page: params.page - 1 })}
            >
              <ChevronLeft size={20} />
            </button>
            <button className="px-5 py-2 rounded-lg bg-primary text-white font-bold text-xs ring-2 ring-primary/20">
              {params.page}
            </button>
            <button 
              className="p-2 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-all disabled:opacity-50"
              disabled={params.page * params.limit >= pagination.total}
              onClick={() => setParams({ ...params, page: params.page + 1 })}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
