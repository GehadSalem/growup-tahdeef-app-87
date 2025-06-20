
import React, { createContext, useContext, useState, useEffect } from 'react';
import { NotificationService, Notification } from '@/services/notificationService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  sendNotification: (notification: any) => void;
  handleNotificationClick: (notification: Notification) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: NotificationService.getNotifications,
    enabled: !!isAuthenticated,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const markAsReadMutation = useMutation({
    mutationFn: NotificationService.markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: NotificationService.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const sendNotificationMutation = useMutation({
    mutationFn: NotificationService.createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const deleteNotification = (id: string) => {
    deleteNotificationMutation.mutate(id);
  };

  const sendNotification = (notification: any) => {
    sendNotificationMutation.mutate(notification);
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read first
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Navigate based on action type
    if (notification.actionType) {
      switch (notification.actionType) {
        case 'expense':
          window.location.href = '/financial-planning?tab=expenses';
          break;
        case 'installment':
          window.location.href = '/financial-planning?tab=obligations';
          break;
        case 'savings':
          window.location.href = '/financial-planning?tab=savings';
          break;
        case 'emergency':
          window.location.href = '/financial-planning?tab=emergency';
          break;
        case 'habit':
          window.location.href = '/break-habits';
          break;
        case 'goal':
          window.location.href = '/major-goals';
          break;
        default:
          break;
      }
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        deleteNotification,
        sendNotification,
        handleNotificationClick,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
