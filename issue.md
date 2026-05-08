# Issue: `Uncaught TypeError: recentSubmissions.map is not a function` pada Dashboard

## Deskripsi Masalah
Saat membuka halaman Dashboard, aplikasi *crash* (blank white screen) dengan error di console:
`Uncaught TypeError: recentSubmissions.map is not a function`
Error ini terjadi di file `src/views/Dashboard.tsx` di sekitar baris 221 saat merender tabel `recentSubmissions`.

## Root Cause Analysis
Secara default, state `recentSubmissions` diinisialisasi sebagai array kosong `[]`.
Namun, ketika data diambil dari backend menggunakan fungsi `submissionService.getSubmissions({ limit: 5 })`, hasil yang diberikan oleh API bukanlah sebuah *array* langsung, melainkan sebuah objek *paginasi*.

Berdasarkan *API Contract* (atau dokumen `API_REFERENCE.md`), endpoint `GET /submissions` mengembalikan response dengan struktur:
```json
{
  "success": true,
  "data": {
    "items": [
      { "id": "...", "customer_name": "..." }
    ],
    "pagination": { "page": 1, "limit": 25, "total": 10 }
  }
}
```

Pada file `Dashboard.tsx` baris ~46, terdapat kode:
```typescript
if (submissionRes.success) setRecentSubmissions(submissionRes.data);
```
Kode ini memasukkan seluruh objek `{ items: [...], pagination: {...} }` ke dalam state `recentSubmissions`. Akibatnya, `recentSubmissions` berubah tipe menjadi *Object*, bukan *Array*. Saat komponen mencoba merender dengan `recentSubmissions.map(...)`, operasi tersebut gagal karena `.map()` adalah fungsi khusus untuk Array.

## Langkah-Langkah Penyelesaian (Untuk Junior Dev / AI Model)

Ikuti langkah-langkah berikut untuk memperbaiki bug ini:

### Langkah 1: Buka File `Dashboard.tsx`
1. Buka file `src/views/Dashboard.tsx`.
2. Cari fungsi `fetchDashboardData` di dalam blok `useEffect` (sekitar baris 33-52).

### Langkah 2: Ubah Cara Ekstraksi Data Submission
1. Temukan baris kode yang menyimpan data response ke dalam state:
   ```typescript
   if (submissionRes.success) setRecentSubmissions(submissionRes.data);
   ```
2. Ubah baris tersebut menjadi:
   ```typescript
   if (submissionRes.success) {
     // Pastikan kita mengambil array 'items' dari dalam 'data'.
     // Gunakan fallback array kosong || [] untuk mencegah error jika items undefined.
     setRecentSubmissions(submissionRes.data.items || []);
   }
   ```

### Langkah 3: Verifikasi Hasil
1. Simpan perubahan pada `Dashboard.tsx`.
2. Jalankan atau *refresh* aplikasi di browser.
3. Buka halaman Dashboard.
4. Pastikan halaman tidak lagi *crash* / *blank*.
5. Pastikan tabel **Respon Terbaru** di bagian bawah Dashboard berhasil menampilkan data (atau pesan "Belum ada respon masuk" jika array kosong).

## Checklist Penyelesaian (Definition of Done)
- [ ] Baris kode pen-set-an state `recentSubmissions` telah dimodifikasi untuk mengambil properti `.items`.
- [ ] Error `recentSubmissions.map is not a function` sudah hilang dari *Console Developer Tools*.
- [ ] UI Tabel "Respon Terbaru" di Dashboard merender dengan baik.
