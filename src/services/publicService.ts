import { fetchApi } from '../lib/api';

export const publicService = {
  getPublicForm: async (slug: string) => {
    return fetchApi(`/public/forms/${slug}`, { method: 'GET' });
  },

  submitPublicForm: async (slug: string, values: any) => {
    return fetchApi(`/public/forms/${slug}/submit`, {
      method: 'POST',
      body: JSON.stringify({ values }),
    });
  },
};
