# Planning Implementasi Endpoint `me` di Halaman Profile

Dokumen ini berisi panduan langkah demi langkah untuk mengintegrasikan endpoint `GET /auth/me` dari backend ke halaman **Profile** di frontend (React). Panduan ini dirancang khusus agar sangat mudah disalin dan diimplementasikan oleh Junior Developer atau model AI.

## Tujuan
Mengubah data profil yang saat ini *hardcoded* (statis) di file `src/views/Profile.tsx` menjadi dinamis, berdasarkan data asli dari API backend (`authService.getMe()`).

---

## Langkah 1: Tambahkan State dan Lifecycle Fetching
Buka file `src/views/Profile.tsx`.
1. Tambahkan impor `useState`, `useEffect` dari React.
2. Impor `authService` yang sudah dibuat pada panduan sebelumnya.

**Ubah bagian atas file:**
```tsx
import React, { useState, useEffect } from 'react';
import { Camera, Mail, Phone, MapPin, Building, Calendar, Edit3, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { authService } from '../services/authService';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getMe();
        if (response.success) {
          setUser(response.data);
        } else {
          setError('Gagal memuat profil');
        }
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan jaringan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Format tanggal menjadi bahasa Indonesia (contoh: 1 Januari 2023)
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full pb-12">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (error) {
    return <div className="text-error font-medium text-center">{error}</div>;
  }

  // Fallback image jika user tidak punya avatar
  const avatarUrl = user?.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || 'Admin') + "&background=random";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-12"
    >
      {/* ... Lanjut ke Langkah 2 */}
```

---

## Langkah 2: Ganti Data Hardcoded dengan State `user`
Lanjutkan modifikasi di dalam *return* (JSX) dari komponen `Profile`. Cari string yang sifatnya *hardcoded* dan ubah menggunakan variabel state `user`.

**Kode JSX yang diperbarui:**
```tsx
      {/* Header Profile */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl overflow-hidden shadow-sm">
        <div className="h-48 bg-primary relative">
          <div className="absolute -bottom-16 left-8 p-1.5 bg-surface rounded-full">
            <div className="relative group">
              <img 
                src={avatarUrl} 
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
            <h1 className="text-2xl font-bold text-on-surface">{user?.name || '-'}</h1>
            <p className="text-on-surface-variant flex items-center gap-2 mt-1 capitalize">
              <Building size={16} />
              {user?.role === 'admin' ? 'Administrator Sistem' : (user?.role || 'Pengguna')}
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
                  <span className="font-medium">{user?.email || '-'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">Telepon</label>
                <div className="flex items-center gap-3 text-on-surface">
                  <Phone size={18} className="text-primary" />
                  <span className="font-medium">{user?.phone || '-'}</span>
                </div>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">Lokasi Kantor</label>
                <div className="flex items-center gap-3 text-on-surface">
                  <MapPin size={18} className="text-primary" />
                  <span className="font-medium">{user?.location || '-'}</span>
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
            <p className="text-lg font-bold text-on-surface mt-1">{formatDate(user?.created_at)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
```

---

## 3. Checklist Implementasi (Untuk Junior Dev / AI)
Centang daftar berikut jika implementasi telah tuntas:

- [ ] Memastikan `authService` sudah memiliki metode `getMe()`.
- [ ] Menambahkan *hook* `useState` dan `useEffect` pada `src/views/Profile.tsx`.
- [ ] Mengimplementasikan *loading state* (memakai animasi *spinner* dari `lucide-react`).
- [ ] Mengganti teks statis untuk Name, Email, Phone, Location dengan data dinamis.
- [ ] Menambahkan logika *fallback image* (seperti `ui-avatars.com`) jika *user* tidak memiliki foto `avatar_url`.
- [ ] Menambahkan fungsi `formatDate` untuk memformat properti `created_at` API menjadi format tanggal yang bisa dibaca.
- [ ] Membuka halaman "Profil" di browser dan memastikan data berhasil dimuat (tidak ada eror jaringan).
