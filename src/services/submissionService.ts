import { fetchApi } from '../lib/api';

export const submissionService = {
  // 1. Mengambil daftar semua submission (dengan pagination, filter, search)
  getSubmissions: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
    // 1. Siapkan object penampung parameter yang valid
    const cleanParams: Record<string, string> = {};
    
    // 2. Filter parameter: hanya masukkan jika valuenya tidak kosong/null
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          cleanParams[key] = String(value);
        }
      });
    }

    // 3. Bangun query string dari parameter yang sudah dibersihkan
    const query = new URLSearchParams(cleanParams).toString();
    const url = query ? `/submissions?${query}` : '/submissions';
    
    return fetchApi(url, { method: 'GET' });
  },

  // 2. Mengambil detail satu submission
  getSubmission: async (id: string) => {
    return fetchApi(`/submissions/${id}`, { method: 'GET' });
  },

  // 3. Update status submission
  updateStatus: async (id: string, status: string) => {
    return fetchApi(`/submissions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // 4. Tambah catatan internal
  addNote: async (id: string, content: string) => {
    return fetchApi(`/submissions/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  // 5. Kirim ulang notifikasi WA
  resendWa: async (id: string) => {
    return fetchApi(`/submissions/${id}/resend-wa`, {
      method: 'POST',
    });
  },

  // 6. Export/Download Data CSV/Excel
  exportSubmissions: async () => {
    // Digunakan untuk mendownload file, membutuhkan penanganan fetch khusus atau menggunakan blob
    return fetchApi('/submissions/export', { method: 'GET' });
  }
};
