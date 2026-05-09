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
  },

  register: async (data: any) => {
    return fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateProfile: async (data: any) => {
    return fetchApi('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
};
