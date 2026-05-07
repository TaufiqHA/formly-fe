# Planning Implementasi Frontend Authentication (React)

Dokumen ini berisi panduan langkah demi langkah untuk mengintegrasikan endpoint Authentication dari backend ke project frontend (React/Vite). Panduan ini dirancang agar mudah diikuti oleh Junior Developer atau model AI.

## 1. Persiapan Environment Variables
Buat file `.env.local` di root direktori frontend jika belum ada, dan tambahkan Base URL backend:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```
*(Sesuaikan URL dengan port backend Anda)*

---

## 2. Pembuatan API Wrapper (Utility `fetch`)
Agar tidak mengulang pengiriman token di setiap request, buat file `src/lib/api.ts` untuk menangani proses *fetch*.

**Buat file `src/lib/api.ts`:**
```typescript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');
  
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.dispatchEvent(new Event('auth-expired'));
    }
    throw new Error(data.message || 'Terjadi kesalahan pada server');
  }

  return data;
}
```

---

## 3. Pembuatan Auth Service
Pemisahan logika API spesifik auth ke file terpisah.

**Buat file `src/services/authService.ts`:**
```typescript
import { fetchApi } from '../lib/api';

export const authService = {
  login: async (email: string, password: string) => {
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    return fetchApi('/auth/logout', { method: 'POST' });
  },

  getMe: async () => {
    return fetchApi('/auth/me', { method: 'GET' });
  }
};
```

---

## 4. Integrasi di View Login
Buka file `src/views/Login.tsx` dan ubah fungsi submit formnya agar memanggil `authService.login`.

```tsx
// Di dalam komponen Login.tsx
import { useState } from 'react';
import { authService } from '../services/authService';

// ... tambahkan state loading dan error jika diperlukan

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    const response = await authService.login(email, password);
    if (response.success) {
      // 1. Simpan token ke localStorage
      localStorage.setItem('auth_token', response.data.token);
      // 2. Simpan data user opsional
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
      // 3. Trigger props onLogin
      onLogin();
    }
  } catch (err: any) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 5. Integrasi di `App.tsx` (Root State)
Ubah logika state auth di `src/App.tsx` untuk mengecek token saat aplikasi pertama kali dimuat dan menangani fungsi logout.

```tsx
import { useEffect } from 'react';
import { authService } from './services/authService';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Cek apakah ada token di localStorage saat mount
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          // Opsional: Validasi token ke backend
          await authService.getMe();
          setIsAuthenticated(true);
        } catch (error) {
          // Token tidak valid/expired
          localStorage.removeItem('auth_token');
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    checkAuth();

    // Event listener jika token expired (dipanggil dari lib/api.ts)
    const handleExpired = () => setIsAuthenticated(false);
    window.addEventListener('auth-expired', handleExpired);
    
    return () => window.removeEventListener('auth-expired', handleExpired);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      setIsAuthenticated(false);
      setCurrentView('overview');
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  // Lanjutkan dengan render komponen...
  // Ubah prop onLogout pada Sidebar:
  // <Sidebar ... onLogout={handleLogout} />
```

---

## 6. Checklist Implementasi (Untuk Junior Dev / AI)
Gunakan checklist ini untuk memastikan integrasi berjalan lancar:
- [ ] Membuat file `.env.local` dan menambahkan `VITE_API_BASE_URL`.
- [ ] Membuat utilitas wrapper fetch di `src/lib/api.ts`.
- [ ] Membuat fungsi layanan otentikasi di `src/services/authService.ts`.
- [ ] Mengubah `handleSubmit` di `src/views/Login.tsx` agar menyimpan token ke `localStorage`.
- [ ] Memperbarui `src/App.tsx` agar menggunakan `useEffect` untuk verifikasi session di awal (*on mount*).
- [ ] Memperbarui properti `onLogout` di `App.tsx` (diteruskan ke `Sidebar`) agar memanggil API logout dan membersihkan session lokal.
- [ ] Mencoba testing login dengan kredensial dari backend.
