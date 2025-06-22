import { useEffect, useState } from 'react';
import { AppHeader } from '@/components/ui/AppHeader';
import { useNavigate } from 'react-router-dom';
import { NotificationService } from '@/services/notificationService';
import { Notification } from '@/lib/types';

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const fetchedNotifications = await NotificationService.getNotifications();
        setNotifications(fetchedNotifications || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadNotifications = notifications.filter(notification => !notification.isRead);

  const markAsRead = async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications(prev => prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <AppHeader
        showMenu
        title="الإشعارات"
        onBackClick={() => navigate("/main-menu")}
      />
      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center py-12">
            جاري التحميل...
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            لا يوجد لديك إشعارات حالياً.
          </div>
        ) : (
          <ul className="space-y-4">
            {notifications.map(notification => (
              <li
                key={notification.id}
                className={`bg-white rounded-xl shadow-md p-4 border border-gray-100 ${!notification.isRead ? 'bg-blue-50' : ''}`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold font-cairo text-lg">{notification.title}</h3>
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-growup hover:underline font-cairo text-sm"
                    >
                      تحديد كمقروء
                    </button>
                  )}
                </div>
                <p className="text-gray-600 font-cairo">{notification.message}</p>
                <p className="text-gray-400 text-sm font-cairo">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
