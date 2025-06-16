// src/firebase-notification.ts

import { messaging, onMessage, getToken } from "@/lib/firebase.ts";


const VAPID_KEY = "YOUR_WEB_PUSH_CERTIFICATE_KEY"; // من Firebase

export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
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
  onMessage(messaging, (payload) => {
    console.log("Foreground Notification:", payload);
    alert(payload.notification?.title + "\n" + payload.notification?.body);
  });
};