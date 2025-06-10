// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCowaqozfdzDkvpuPyKpQkitgXEITPuxFg",
  authDomain: "growup-tahdeef-436e0.firebaseapp.com",
  projectId: "growup-tahdeef-436e0",
  storageBucket: "growup-tahdeef-436e0.appspot.com",
  messagingSenderId: "448742141499",
  appId: "1:448742141499:web:86d9e735db4acfeda1361e",
  measurementId: "G-LLTXD77VXR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);