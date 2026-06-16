import { get, put } from "@/lib/api-client";
import { NotificationListResponse, Notification } from "@/types/notification";

export const notificationService = {
  async getAll(skip = 0, limit = 50): Promise<NotificationListResponse> {
    return get<NotificationListResponse>(`/notifications/?skip=${skip}&limit=${limit}`);
  },

  async getRecentUnread(limit = 5): Promise<NotificationListResponse> {
    return get<NotificationListResponse>(`/notifications/recent?limit=${limit}`);
  },

  async markRead(notifId: string): Promise<{ status: string; data: Notification }> {
    return put<{ status: string; data: Notification }>(`/notifications/${notifId}/read`);
  },

  async markAllRead(): Promise<{ status: string; message: string }> {
    return put<{ status: string; message: string }>("/notifications/read-all");
  },
};
