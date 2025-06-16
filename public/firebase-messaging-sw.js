/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA-JXV1ehrqPn4JOm_Hsmc5Gm-s-YnHkgo",
  authDomain: "growupe-83565.firebaseapp.com",
  projectId: "growupe-83565",
  storageBucket: "growupe-83565.firebasestorage.app",
  messagingSenderId: "612098820148",
  appId: "1:612098820148:web:720bda451242bdcc9c6261",
  measurementId: "G-EF110CJSHV"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});