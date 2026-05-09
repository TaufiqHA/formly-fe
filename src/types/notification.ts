export interface NotificationData {
  submission_id: string;
  form_title: string;
  customer_name: string;
}

export interface Notification {
  id: string;
  type: string;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
}

export interface NotificationResponse {
  success: boolean;
  data: {
    items: Notification[];
    unread_count: number;
    pagination: {
      current_page: number;
      last_page: number;
      total: number;
    };
  };
  message?: string;
}
