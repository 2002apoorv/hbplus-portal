/**
 * Firebase Web Configuration
 * Configures Firebase Web SDK with browser persistence
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  browserLocalPersistence, 
  setPersistence 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
};

export const isConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.apiKey !== 'your-firebase-api-key'
);

let app = null;
let auth = null;
let db = null;

if (isConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    // Ensure browser persistence is active
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.warn('Firebase web persistence warning:', err);
    });
    db = getFirestore(app);
  } catch (error) {
    console.error('Firebase web initialization error:', error);
  }
} else {
  console.info('HBPLUS: Firebase environment variables not fully configured. Running in ready/demo-compatible mode.');
}

export { app, auth, db };
export default { app, auth, db, isConfigured, firebaseConfig };
