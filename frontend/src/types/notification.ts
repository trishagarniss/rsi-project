export interface Notification {
  id: string;
  user_id: string;
  tenant_id?: string;
  title: string;
  message?: string;
  type: "info" | "success" | "warning" | "error";
  is_read: boolean;
  reference_type?: string;
  reference_id?: string;
  created_at: string;
}

export interface NotificationListResponse {
  status: string;
  data: Notification[];
  unread_count: number;
}
