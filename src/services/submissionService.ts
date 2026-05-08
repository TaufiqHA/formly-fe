import { fetchApi } from '../lib/api';

export const submissionService = {
  // 1. Mengambil daftar semua submission (dengan pagination, filter, search)
  getSubmissions: async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
    // Membangun query string jika ada parameter yang dikirim
    const query = params ? new URLSearchParams(params as any).toString() : '';
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
