import { fetchApi } from '../lib/api';
import { Preferences, WhatsAppConfig, SettingsResponse } from '../types/settings';

export const settingsService = {
  // GET /settings
  getSettings: async (): Promise<SettingsResponse> => {
    return fetchApi('/settings', { method: 'GET' });
  },

  // PUT /settings
  updatePreferences: async (payload: Preferences): Promise<{ success: boolean; message?: string }> => {
    return fetchApi('/settings', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  // PUT /settings/whatsapp
  updateWhatsAppConfig: async (payload: WhatsAppConfig): Promise<{ success: boolean; message?: string }> => {
    return fetchApi('/settings/whatsapp', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  // POST /settings/whatsapp/test
  testWhatsAppConnection: async (): Promise<{ success: boolean; message?: string }> => {
    return fetchApi('/settings/whatsapp/test', {
      method: 'POST',
    });
  },
};
