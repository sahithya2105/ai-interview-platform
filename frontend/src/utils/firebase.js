import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCj_m6yMOlqRTqc2my90zsmtv8gn5xQvus",
  authDomain: "ai-interview-platform-706ed.firebaseapp.com",
  projectId: "ai-interview-platform-706ed",
  storageBucket: "ai-interview-platform-706ed.firebasestorage.app",
  messagingSenderId: "21500399696",
  appId: "1:21500399696:web:dd9434b1cb6d9544ab4155"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);