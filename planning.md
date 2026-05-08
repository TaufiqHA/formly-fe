# Planning Implementasi Tombol Kembali di Halaman Preview

Dokumen ini berisi panduan teknis untuk mengimplementasikan fitur navigasi "Tombol Kembali" pada halaman `PublicForm` saat aplikasi berada dalam mode *Preview*. Panduan ini dirancang sangat sederhana agar dapat langsung dieksekusi oleh Junior Developer maupun AI Assistant.

## 🎯 Tujuan
Menambahkan tombol "Kembali ke Dashboard" di pojok atas halaman formulir **HANYA** saat admin sedang melihat *Preview* form. Tombol ini tidak akan muncul saat pelanggan (publik) mengakses formulir melalui URL asli.

---

## 🛠️ Langkah 1: Update File `PublicForm.tsx`
Kita akan menambahkan prop `onBack` dan merender UI tombol secara kondisional jika `previewId` ada.

**File Target:** `src/views/PublicForm.tsx`

**Panduan Implementasi:**
1. **Tambahkan Icon:** Pada baris paling atas, tambahkan `ArrowLeft` ke dalam daftar import `lucide-react`:
   ```tsx
   import { Send, CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
   ```

2. **Update Props:** Ubah definisi argumen fungsi `PublicForm` agar menerima prop `onBack`:
   ```tsx
   export default function PublicForm({ slug, previewId, onBack }: { slug?: string, previewId?: string, onBack?: () => void }) {
   ```

3. **Render UI Tombol:** Cari bagian kode yang merender Header formulir. Biasanya terlihat seperti ini:
   ```tsx
   <div className="px-8 py-10 relative bg-primary/5 border-b border-outline-variant">
     <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-2">{formConfig.title}</h1>
   ```
   
   **Tambahkan kode tombol di atas elemen `<h1>`:**
   ```tsx
   <div className="px-8 py-10 relative bg-primary/5 border-b border-outline-variant">
     {/* === TAMBAHAN KODE TOMBOL KEMBALI === */}
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
     {/* === BATAS KODE TAMBAHAN === */}
     
     <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-2">{formConfig.title}</h1>
   ```

---

## 💻 Langkah 2: Passing Fungsi `onBack` di `App.tsx`
Karena `PublicForm` sekarang mengharapkan prop `onBack`, kita perlu mengaturnya di file routing utama (`App.tsx`) agar tombol tersebut berfungsi untuk mengembalikan state halaman.

**File Target:** `src/App.tsx`

**Panduan Implementasi:**
Cari pemanggilan `<PublicForm ... />` di dalam `App.tsx`. Biasanya terdapat di 2 tempat:

1. Di dalam fungsi `renderView()`, pada blok `case 'publicForm':`
   **Ubah menjadi:**
   ```tsx
      case 'publicForm':
        return (
          <PublicForm 
            slug={publicFormSlug || ''} 
            previewId={previewFormId || undefined} 
            onBack={() => {
              setPreviewFormId(null);
              setPublicFormSlug(null);
              setCurrentView('formList');
            }}
          />
        );
   ```

2. Di bagian bawah (Special Layout Bypass) sebelum `return` utama:
   Cari blok kode ini:
   ```tsx
     // Special layout for Public Form
     if (currentView === 'publicForm') {
       return <PublicForm slug={publicFormSlug || ''} previewId={previewFormId || undefined} />;
     }
   ```
   **Ubah menjadi:**
   ```tsx
     // Special layout for Public Form
     if (currentView === 'publicForm') {
       return (
         <PublicForm 
           slug={publicFormSlug || ''} 
           previewId={previewFormId || undefined} 
           onBack={() => {
             setPreviewFormId(null);
             setPublicFormSlug(null);
             setCurrentView('formList');
           }} 
         />
       );
     }
   ```

---

## ✅ Panduan QA / Pengujian untuk Developer
1. **Skenario Mode Preview:**
   - Login sebagai admin.
   - Buka menu Formulir.
   - Klik aksi "Preview" (ikon mata) pada salah satu daftar form.
   - **Ekspektasi:** Formulir terbuka, dan terdapat tombol "Kembali ke Dashboard" dengan panah kiri di atas judul formulir.
2. **Skenario Fungsi Navigasi:**
   - Klik tombol "Kembali ke Dashboard" yang muncul di halaman preview.
   - **Ekspektasi:** Tampilan langsung beralih kembali ke halaman Daftar Formulir tanpa melakukan *refresh browser*.
3. **Skenario Mode Publik Asli:**
   - Buka tautan publik asli formulir (misal dengan mengakses `http://localhost:3000/?f=slug-form`).
   - **Ekspektasi:** Formulir terbuka normal, **TIDAK ADA** tombol kembali yang muncul (karena `previewId` kosong).
