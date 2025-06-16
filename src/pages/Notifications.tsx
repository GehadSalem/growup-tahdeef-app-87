
import React, { useEffect } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationService, Notification } from "@/services/notificationService";

const Notifications = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Get notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: NotificationService.getNotifications,
    enabled: isAuthenticated,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: NotificationService.markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: NotificationService.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success("تم حذف الإشعار");
    },
  });

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-growup rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-cairo text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const noNotifications = notifications.length === 0;

  // وظيفة لتحديد الإشعار كمقروء
  const markAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  // وظيفة لتحديد كل الإشعارات كمقروءة
  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n: Notification) => !n.isRead);
    for (const notification of unreadNotifications) {
      await markAsReadMutation.mutateAsync(notification.id);
    }
    toast.success("تم تحديد جميع الإشعارات كمقروءة");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="الإشعارات" showBackButton />

      <div className="container mx-auto px-4 py-6">
        {noNotifications ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <div className="bg-muted p-6 rounded-full mb-6">
              <Bell className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">لا توجد إشعارات</h2>
            <p className="text-muted-foreground mb-6">
              ستظهر هنا كل التنبيهات والتذكيرات المتعلقة بأهدافك
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">كل الإشعارات</h2>
              <Button variant="ghost" className="text-sm" onClick={markAllAsRead}>تحديد الكل كمقروء</Button>
            </div>

            {notifications.map((notification: Notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg ${
                  notification.isRead ? "bg-background" : "bg-muted/30"
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{notification.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="h-2 w-2 rounded-full bg-growup"></div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleDateString('ar-SA')}
                  </div>
                  {!notification.isRead && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-auto" 
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                    >
                      <Check className="h-4 w-4" />
                      <span className="text-xs">تم</span>
                    </Button>
                  )}
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
