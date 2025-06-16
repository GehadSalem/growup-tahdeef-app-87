
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
    console.log('Fetching notifications...');
    return apiClient.get<Notification[]>('/notification');
  }

  static async createNotification(notification: CreateNotificationRequest): Promise<Notification> {
    console.log('Creating notification:', notification);
    return apiClient.post<Notification>('/notification', notification);
  }

  static async markNotificationRead(id: string): Promise<Notification> {
    console.log('Marking notification as read:', id);
    return apiClient.patch<Notification>(`/notification/${id}`);
  }

  static async deleteNotification(id: string): Promise<void> {
    console.log('Deleting notification:', id);
    return apiClient.delete(`/notification/${id}`);
  }

  static async testNotification(): Promise<any> {
    console.log('Testing notification...');
    return apiClient.get<any>('/notification');
  }
}
