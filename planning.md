# Planning Implementasi Endpoint `Forms` di Halaman FormList

*(Catatan: Anda menyebutkan "di halaman profile", namun karena struktur data Formulir berada di halaman FormList, panduan ini difokuskan pada `src/views/FormList.tsx` agar logikanya tepat sasaran).*

Dokumen ini berisi panduan langkah demi langkah untuk mengintegrasikan endpoint `/forms` (GET dan DELETE) dari backend ke halaman **FormList** di frontend (React). Panduan ini dirancang khusus agar sangat mudah dieksekusi oleh Junior Developer atau model AI.

## Tujuan
Mengubah daftar formulir yang saat ini *hardcoded* di file `src/views/FormList.tsx` menjadi dinamis menggunakan API, serta mengaktifkan fitur hapus formulir ke *backend*.

---

## Langkah 1: Buat Service API untuk Form
Pertama, kita butuh abstraksi untuk memanggil endpoint `/forms`.

**Buat file baru di `src/services/formService.ts`:**
```typescript
import { fetchApi } from '../lib/api';

export const formService = {
  // Mengambil daftar semua form
  getForms: async () => {
    return fetchApi('/forms', { method: 'GET' });
  },

  // Menghapus form berdasarkan ID
  deleteForm: async (id: string) => {
    return fetchApi(`/forms/${id}`, { method: 'DELETE' });
  },

  // (Opsional) Membuat form baru
  createForm: async (data: { title: string; description?: string }) => {
    return fetchApi('/forms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
```

---

## Langkah 2: Sesuaikan Interface & State di `FormList.tsx`
Buka file `src/views/FormList.tsx`.
1. Tambahkan impor `useEffect` dan `formService`.
2. Sesuaikan tipe data `FormItem` agar cocok dengan JSON dari backend.

**Ubah bagian atas file (Interface & State):**
```tsx
import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, ExternalLink, Edit2, Calendar, Users, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { formService } from '../services/formService';

// Sesuaikan interface dengan API_REFERENCE.md
interface FormItem {
  id: string;
  title: string;
  slug: string;
  status: 'active' | 'draft';
  total_submissions: number;
  updated_at: string;
}

interface FormListProps {
  onCreateNew: () => void;
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
}

export default function FormList({ onCreateNew, onEdit, onPreview }: FormListProps) {
  // Inisialisasi state kosong
  const [forms, setForms] = useState<FormItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data dari backend saat komponen dimuat
  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    setIsLoading(true);
    try {
      const response = await formService.getForms();
      if (response.success) {
        setForms(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat daftar formulir');
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi hapus form aktual
  const handleDeleteForm = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus formulir ini?')) {
      try {
        await formService.deleteForm(id);
        // Hapus form dari state lokal tanpa reload halaman
        setForms(forms.filter(f => f.id !== id));
      } catch (err: any) {
        alert('Gagal menghapus formulir: ' + err.message);
      }
    }
  };

  // Fungsi duplicate (sementara bisa mock atau panggil createForm API)
  const handleDuplicateForm = async (form: FormItem) => {
    try {
      const response = await formService.createForm({
        title: `${form.title} (Copy)`,
      });
      if (response.success) {
        fetchForms(); // Reload daftar form agar data sinkron dengan database
      }
    } catch (err: any) {
      alert('Gagal menduplikat formulir: ' + err.message);
    }
  };

  // Format tanggal untuk UI
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { 
      day: '2-digit', month: 'short', year: 'numeric' 
    });
  };

  // Tampilkan loading spinner jika sedang fetch data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (error) {
    return <div className="text-error font-medium text-center">{error}</div>;
  }
```

---

## Langkah 3: Sesuaikan Pemanggilan Properti Data di JSX
Karena nama *key* (properti) dari backend berbeda dengan yang lama, ubah referensi variabel pada blok JSX di bawahnya.

**Cari dan ubah pada bagian render *card* formulir:**
- Ubah `{form.submissions}` menjadi `{form.total_submissions}`
- Ubah `{form.lastUpdated}` menjadi `{formatDate(form.updated_at)}`

**Contoh JSX yang diperbarui:**
```tsx
              <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-outline-variant/30">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-on-surface-variant flex items-center gap-1.5 leading-none">
                    <Users size={14} />
                    {form.total_submissions} Submisi
                  </span>
                  <span className="text-on-surface-variant flex items-center gap-1.5 leading-none">
                    <Calendar size={14} />
                    {formatDate(form.updated_at)}
                  </span>
                </div>
```

---

## 4. Checklist Implementasi (Untuk Junior Dev / AI)
Gunakan checklist ini untuk validasi:

- [ ] Membuat file `src/services/formService.ts` untuk `getForms`, `deleteForm`, dan `createForm`.
- [ ] Menyesuaikan tipe interface `FormItem` di `FormList.tsx` dengan respons backend (`slug`, `total_submissions`, `updated_at`).
- [ ] Mengubah `useState` awal menjadi *array kosong* `[]` beserta statik `isLoading` dan `error`.
- [ ] Menggunakan `useEffect` untuk memanggil `formService.getForms()` saat halaman dimuat.
- [ ] Mengubah logika `handleDeleteForm` agar menembak API backend.
- [ ] Mengubah logika `handleDuplicateForm` agar menembak API backend (`createForm`) lalu me-reload *list* form.
- [ ] Mengubah properti statis pada UI dari `{form.submissions}` menjadi `{form.total_submissions}`.
- [ ] Mengubah pemanggilan `{form.lastUpdated}` menggunakan fungsi `formatDate(form.updated_at)`.
- [ ] Memastikan tidak ada *error TypeScript* (ts-lint) terkait perubahan struktur *interface*.
