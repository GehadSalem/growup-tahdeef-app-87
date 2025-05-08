
import React, { useState } from "react";
import { AppHeader } from "@/components/ui/AppHeader";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const Notifications = () => {
  // بيانات الإشعارات - يمكن أن تأتي من API في المستقبل
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "تذكير بهدفك اليومي",
      message: "حان الوقت لممارسة القراءة اليومية",
      time: "منذ 10 دقائق",
      read: false,
    },
    {
      id: 2,
      title: "عمل رائع!",
      message: "لقد أكملت 7 أيام متتالية من التأمل",
      time: "منذ 3 ساعات",
      read: false,
    },
    {
      id: 3,
      title: "تحديث في التطبيق",
      message: "تم إضافة ميزات جديدة في تطبيق GrowUp",
      time: "منذ يوم واحد",
      read: true,
    },
  ]);

  const noNotifications = notifications.length === 0;

  // وظيفة لتحديد الإشعار كمقروء
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // وظيفة لتحديد كل الإشعارات كمقروءة
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
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

            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg ${
                  notification.read ? "bg-background" : "bg-muted/30"
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
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-growup"></div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-muted-foreground">
                    {notification.time}
                  </div>
                  {!notification.read && (
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
