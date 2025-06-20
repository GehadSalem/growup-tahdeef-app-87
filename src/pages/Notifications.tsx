
import React, { useEffect } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationContext";

const Notifications = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    deleteNotification, 
    handleNotificationClick 
  } = useNotifications();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const noNotifications = !notifications || notifications.length === 0;

  const markAllAsRead = async () => {
    if (!notifications || notifications.length === 0) return;
    
    const unreadNotifications = notifications.filter(n => !n.read);
    for (const notification of unreadNotifications) {
      markAsRead(notification.id);
    }
    toast({
      title: "تم التحديث",
      description: "تم تحديد جميع الإشعارات كمقروءة"
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '📢';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <AppHeader title={`الإشعارات ${unreadCount > 0 ? `(${unreadCount})` : ''}`} onBackClick={() => navigate('/main-menu')} />

      <div className="container mx-auto px-4 py-6">
        {noNotifications ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-6">
              <Bell className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold mb-2 font-cairo">لا توجد إشعارات</h2>
            <p className="text-gray-600 mb-6 font-cairo">
              ستظهر هنا كل التنبيهات والتذكيرات المتعلقة بأهدافك
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold font-cairo">
                كل الإشعارات ({notifications.length})
                {unreadCount > 0 && (
                  <span className="text-sm text-growup mr-2">
                    {unreadCount} غير مقروءة
                  </span>
                )}
              </h2>
              {unreadCount > 0 && (
                <Button variant="ghost" className="text-sm font-cairo" onClick={markAllAsRead}>
                  تحديد الكل كمقروء
                </Button>
              )}
            </div>

            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  notification.read ? "bg-white" : "bg-blue-50 border-blue-200"
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                      <h3 className="font-bold font-cairo text-right">{notification.title}</h3>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-growup"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 text-right font-cairo">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 font-cairo">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-1 mr-2">
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 h-auto font-cairo" 
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-auto text-red-500 hover:text-red-700" 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
