
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// تهيئة عناصر واجهة المستخدم الخاصة بالتطبيقات المحمولة
defineCustomElements(window);

// Initialize Firebase notifications
import { initializeNotifications } from './hooks/firebase-notification';

// Initialize notifications when the app starts
initializeNotifications().catch(console.error);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(<App />);
