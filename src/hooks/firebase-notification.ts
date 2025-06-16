
import { messaging, onMessage, getToken } from "@/lib/firebase.ts";

// Get VAPID key from environment or use a default for development
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || "BG7x8q3KxaWALxgzZ9s8QqKjK8sY7WNY1j9ZvYc5fTL7pKsWq3uJy9sM8qKjK8sY7WNY1j9ZvYc5fTL7pKsWq3";

export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (currentToken) {
        console.log("FCM Token:", currentToken);
        return currentToken;
      } else {
        console.warn("لم يتم الحصول على التوكِن");
        return null;
      }
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
  onMessage(messaging, (payload) => {
    console.log("Foreground Notification:", payload);
    
    // Create a more user-friendly notification display
    if (payload.notification) {
      const notificationTitle = payload.notification.title || "إشعار جديد";
      const notificationBody = payload.notification.body || "";
      
      // You can replace this alert with a toast notification
      if ('serviceWorker' in navigator && 'Notification' in window) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(notificationTitle, {
            body: notificationBody,
            icon: "/logo192.png",
            tag: "growup-notification",
            requireInteraction: true
          });
        });
      } else {
        alert(`${notificationTitle}\n${notificationBody}`);
      }
    }
  });
};

// Initialize notifications when the app loads
export const initializeNotifications = async () => {
  try {
    const token = await requestNotificationPermission();
    if (token) {
      listenToForegroundNotifications();
      return token;
    }
  } catch (error) {
    console.error("Failed to initialize notifications:", error);
  }
  return null;
};
