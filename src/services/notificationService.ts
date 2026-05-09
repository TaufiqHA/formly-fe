import { fetchApi } from '../lib/api';
import { NotificationResponse } from '../types/notification';

export const notificationService = {
  // GET /notifications
  getNotifications: async (page = 1): Promise<NotificationResponse> => {
    return fetchApi(`/notifications?page=${page}`, { method: 'GET' });
  },

  // PATCH /notifications/mark-as-read/{id?}
  markAsRead: async (id: string | null = null): Promise<{ success: boolean; message?: string }> => {
    const endpoint = id ? `/notifications/mark-as-read/${id}` : '/notifications/mark-as-read';
    return fetchApi(endpoint, { method: 'PATCH' });
  },
};
