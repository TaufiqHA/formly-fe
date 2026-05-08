export interface Preferences {
  notif_email_new_order: boolean;
  notif_wa_auto_confirm: boolean;
  theme: 'light' | 'dark';
}

export interface WhatsAppConfig {
  api_key?: string; // Hanya untuk request, biasanya tidak direturn full oleh GET demi keamanan
  phone_number: string;
  connection_status?: 'connected' | 'disconnected' | 'pending';
  wa_template_new_order: string;
}

export interface SettingsData {
  preferences: Preferences;
  whatsapp: WhatsAppConfig;
}

export interface SettingsResponse {
  success: boolean;
  data: SettingsData;
  message?: string;
}
