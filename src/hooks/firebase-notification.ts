
import { messaging, onMessage, getToken } from "@/lib/firebase";
import { NotificationService } from "@/services/notificationService";

const VAPID_KEY = "YOUR_WEB_PUSH_CERTIFICATE_KEY"; // من Firebase

export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
      console.log('FCM Token:', currentToken);
      return currentToken;
    } else {
      console.warn("لم يتم السماح بالإشعارات");
      return null;
    }
  } catch (error) {
    console.error("فشل الحصول على التوكِن", error);
    return null;
  }
};

// للإشعارات أثناء استخدام التطبيق
export const listenToForegroundNotifications = () => {
  onMessage(messaging, async (payload) => {
    console.log("Foreground Notification:", payload);
    
    // إنشاء إشعار في قاعدة البيانات
    try {
      if (payload.notification?.title && payload.notification?.body) {
        await NotificationService.createNotification({
          title: payload.notification.title,
          message: payload.notification.body
        });
      }
    } catch (error) {
      console.error('Error creating notification in database:', error);
    }
    
    // إظهار إشعار للمستخدم
    if (payload.notification?.title && payload.notification?.body) {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        // استخدم Service Worker لعرض الإشعار
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(payload.notification.title, {
            body: payload.notification.body,
            icon: '/logo192.png',
            badge: '/logo192.png'
          });
        });
      } else {
        // fallback لإظهار alert
        alert(payload.notification.title + "\n" + payload.notification.body);
      }
    }
  });
};

// تهيئة الإشعارات
export const initializeNotifications = async () => {
  const token = await requestNotificationPermission();
  if (token) {
    listenToForegroundNotifications();
    console.log('Notifications initialized successfully');
  }
  return token;
};
