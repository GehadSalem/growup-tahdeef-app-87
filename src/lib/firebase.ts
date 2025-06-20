// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getMessaging, Messaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-JXV1ehrqPn4JOm_Hsmc5Gm-s-YnHkgo",
  authDomain: "growupe-83565.firebaseapp.com",
  projectId: "growupe-83565",
  storageBucket: "growupe-83565.firebasestorage.app",
  messagingSenderId: "612098820148",
  appId: "1:612098820148:web:720bda451242bdcc9c6261",
  measurementId: "G-EF110CJSHV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging: Messaging = getMessaging(app);

export { messaging, getToken, onMessage };
export const auth = getAuth(app);