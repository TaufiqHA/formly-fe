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

  // Membuat form baru
  createForm: async (data: { title: string; description?: string }) => {
    return fetchApi('/forms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
