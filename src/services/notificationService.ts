
import { apiClient } from '@/lib/api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  userId: string;
  actionType?: string; // For directing user to specific sections
  actionData?: any; // Additional data for navigation
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  actionType?: string;
  actionData?: any;
}

export class NotificationService {
  static async getNotifications(): Promise<Notification[]> {
    console.log('Fetching notifications...');
    const result = await apiClient.get<Notification[]>('/notification');
    console.log('Fetched notifications:', result);
    return Array.isArray(result) ? result : [];
  }

  static async createNotification(notification: CreateNotificationRequest): Promise<Notification> {
    console.log('Creating notification:', notification);
    const result = await apiClient.post<Notification>('/notification', notification);
    console.log('Created notification:', result);
    return result;
  }

  static async markNotificationRead(id: string): Promise<Notification> {
    console.log('Marking notification as read:', id);
    const result = await apiClient.patch<Notification>(`/notification/${id}`);
    console.log('Mark notification read result:', result);
    return result;
  }

  static async deleteNotification(id: string): Promise<void> {
    console.log('Deleting notification:', id);
    await apiClient.delete(`/notification/${id}`);
    console.log('Notification deleted successfully');
  }
}
