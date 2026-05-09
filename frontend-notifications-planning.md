## 5. Integrasi Service API untuk Notifikasi (In-App)
**Tujuan**: Memastikan service API di frontend dapat mengambil data notifikasi terbaru (GET) dan menandai notifikasi sebagai sudah dibaca (PATCH) ke backend.
**Target File**: `src/services/notificationService.ts` (Buat file jika belum ada)

**Langkah-langkah Implementasi**:
1. Buka atau buat file `src/services/notificationService.ts`.
2. Buat fungsi `getNotifications(page = 1)` yang melakukan HTTP GET ke endpoint backend `/api/v1/notifications?page=${page}`.
   - Pastikan fungsi ini mereturn object yang berisi `data.items`, `data.unread_count`, dan `data.pagination`.
3. Buat fungsi `markAsRead(id: string | null = null)` yang melakukan HTTP PATCH ke endpoint backend `/api/v1/notifications/mark-as-read/${id || ''}`.
   - Fungsi ini akan digunakan untuk menandai satu notifikasi spesifik atau semua notifikasi sekaligus (jika `id` kosong).
4. Tambahkan *Error Handling* dasar dengan blok `try-catch` pada kedua fungsi tersebut.

## 6. Hubungkan UI Notifikasi (Dropdown/Bell) dengan API
**Tujuan**: Menghubungkan *state* komponen Navbar (Ikon Lonceng Notifikasi) dengan data aktual dari API, serta menampilkan badge angka `unread_count`.
**Target File**: `src/components/layout/Navbar.tsx` (atau komponen Header/Topbar sejenis)

**Langkah-langkah Implementasi**:
1. Buka komponen `Navbar.tsx` yang memuat ikon lonceng notifikasi.
2. Tambahkan *state* `notifications` (array), `unreadCount` (number), dan `isNotifOpen` (boolean).
3. Gunakan `useEffect` untuk memanggil `notificationService.getNotifications()` saat komponen di-mount.
   - Set hasil array ke `notifications` dan `unread_count` ke `unreadCount`.
4. Render sebuah *badge* (lingkaran merah dengan angka) di atas ikon lonceng jika `unreadCount > 0`.
5. Saat ikon lonceng diklik, ubah `isNotifOpen` menjadi `true` untuk menampilkan *dropdown* / *popover* daftar notifikasi.

## 7. Render Daftar Notifikasi dan Fitur "Mark as Read"
**Tujuan**: Menampilkan daftar pesan notifikasi (contoh: "Ada submission baru dari Budi") dan mengubah status bacanya saat diklik.
**Target File**: `src/components/layout/Navbar.tsx` (Di dalam Dropdown Notifikasi)

**Langkah-langkah Implementasi**:
1. Di dalam Dropdown, lakukan *mapping* terhadap array `notifications`.
   - Render masing-masing notifikasi dengan menyorot judul form (`data.form_title`) dan nama customer (`data.customer_name`).
   - Berikan styling khusus (misal background abu-abu muda atau *font bold*) untuk notifikasi yang `read_at`-nya bernilai `null` (belum dibaca).
2. Tambahkan *event listener* `onClick` pada setiap item notifikasi:
   - Saat diklik, arahkan pengguna ke halaman detail submission (misal: `/submissions/${data.submission_id}`).
   - Panggil `notificationService.markAsRead(id)` agar di backend statusnya berubah.
   - Kurangi state `unreadCount` secara lokal (optimistic update) dan ubah background item tersebut agar terlihat sudah dibaca.
3. (Opsional) Sediakan tombol "Tandai semua sudah dibaca" di bagian atas atau bawah dropdown yang memanggil `notificationService.markAsRead()` tanpa parameter.

## 8. Real-time Feedback (Opsional / Tingkat Lanjut)
**Tujuan**: Melakukan *polling* ringan agar badge notifikasi bisa ter-update otomatis jika tab dibiarkan terbuka.
**Target File**: `src/components/layout/Navbar.tsx`

**Langkah-langkah Implementasi**:
1. Gunakan fungsi `setInterval` di dalam `useEffect` yang memanggil `getNotifications()` setiap 30 atau 60 detik (Pastikan menambahkan *cleanup* `clearInterval` saat komponen unmount).
2. Jika ada perubahan pada `unread_count` dari hasil fetch interval tersebut, perbarui state `unreadCount` agar badge angka berubah tanpa perlu *refresh* halaman.
