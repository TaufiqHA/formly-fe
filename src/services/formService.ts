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

  // Mengambil detail satu form
  getForm: async (id: string) => {
    return fetchApi(`/forms/${id}`, { method: 'GET' });
  },

  // Membuat form baru
  createForm: async (data: { title: string; description?: string }) => {
    return fetchApi('/forms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Simpan / Update struktur field form sekaligus
  updateFormFields: async (formId: string, fieldsData: any[]) => {
    return fetchApi(`/forms/${formId}/fields`, {
      method: 'PUT',
      body: JSON.stringify({ fields: fieldsData }),
    });
  },

  // Mengubah status form (misal: dari draft ke active)
  updateFormStatus: async (id: string, status: 'draft' | 'active') => {
    return fetchApi(`/forms/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
