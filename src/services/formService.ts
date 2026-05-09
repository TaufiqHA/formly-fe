import { fetchApi } from '../lib/api';

export const formService = {
  // Mengambil daftar semua form
  getForms: async (params?: { status?: string; search?: string }) => {
    const cleanParams: Record<string, string> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          cleanParams[key] = String(value);
        }
      });
    }
    const query = new URLSearchParams(cleanParams).toString();
    const url = query ? `/forms?${query}` : '/forms';
    return fetchApi(url, { method: 'GET' });
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
