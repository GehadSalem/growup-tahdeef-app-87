
import { apiClient } from '@/lib/api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export class NotificationService {
  static async testNotification(): Promise<any> {
    return apiClient.get<any>('/notification');
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
}
