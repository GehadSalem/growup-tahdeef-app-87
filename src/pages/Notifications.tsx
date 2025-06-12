
import React, { useEffect } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotificationService, Notification } from "@/services/notificationService";

const Notifications = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Get notifications
  const { data: notifications = [], isLoading, error } = useQuery({
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
    onError: (error: any) => {
      console.error('Mark as read error:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة الإشعار",
        variant: "destructive"
      });
    }
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: NotificationService.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "تم الحذف",
        description: "تم حذف الإشعار بنجاح"
      });
    },
    onError: (error: any) => {
      console.error('Delete notification error:', error);
      toast({
        title: "خطأ", 
        description: "فشل في حذف الإشعار",
        variant: "destructive"
      });
    }
  });

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader title="الإشعارات" onBackClick={() => navigate('/main-menu')} />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-growup rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl font-cairo text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Notifications error:', error);
  }

  const noNotifications = !notifications || notifications.length === 0;

  // وظيفة لتحديد الإشعار كمقروء
  const markAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  // وظيفة لتحديد كل الإشعارات كمقروءة
  const markAllAsRead = async () => {
    if (!notifications || notifications.length === 0) return;
    
    const unreadNotifications = notifications.filter((n: Notification) => !n.read);
    for (const notification of unreadNotifications) {
      await markAsReadMutation.mutateAsync(notification.id);
    }
    toast({
      title: "تم التحديث",
      description: "تم تحديد جميع الإشعارات كمقروءة"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader title="الإشعارات" onBackClick={() => navigate('/main-menu')} />

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
              <h2 className="text-lg font-bold font-cairo">كل الإشعارات</h2>
              <Button variant="ghost" className="text-sm font-cairo" onClick={markAllAsRead}>
                تحديد الكل كمقروء
              </Button>
            </div>

            {notifications.map((notification: Notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  notification.read ? "bg-white" : "bg-blue-50 border-blue-200"
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold font-cairo text-right">{notification.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 text-right font-cairo">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-growup ml-2 mt-2"></div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-gray-500 font-cairo">
                    {new Date(notification.createdAt).toLocaleDateString('ar-SA')}
                  </div>
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
                      <Check className="h-4 w-4 ml-1" />
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
