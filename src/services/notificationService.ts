
import { apiClient } from '@/lib/api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  userId: string;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
}

export class NotificationService {
  static async getNotifications(): Promise<Notification[]> {
    return apiClient.get<Notification[]>('/notification');
  }

  static async createNotification(notification: CreateNotificationRequest): Promise<Notification> {
    return apiClient.post<Notification>('/notification', notification);
  }

  static async markNotificationRead(id: string): Promise<Notification> {
    return apiClient.patch<Notification>(`/notification/${id}`);
  }

  static async deleteNotification(id: string): Promise<void> {
    return apiClient.delete(`/notification/${id}`);
  }

  static async testNotification(): Promise<any> {
    return apiClient.get<any>('/notification');
  }
}
