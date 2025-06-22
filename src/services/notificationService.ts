
import { apiClient } from '@/lib/api';
import { Notification } from '@/lib/types';

export class NotificationService {
  static async getNotifications(): Promise<Notification[]> {
    try {
      const response = await apiClient.get<Notification[]>('/notification');
      return response || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  static async createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'userId'>): Promise<Notification> {
    return await apiClient.post<Notification>('/notification', notification);
  }

  static async markAsRead(id: string): Promise<void> {
    await apiClient.patch(`/notification/${id}`);
  }

  static async deleteNotification(id: string): Promise<void> {
    await apiClient.delete(`/notification/${id}`);
  }

  static async testNotification(): Promise<any> {
    return await apiClient.get('/notification');
  }
}
