import { initializeApp, getApps, getApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import type { Database } from 'firebase/database';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Live Firebase configuration — sourced exclusively from environment variables
// (see .env.example). No credentials or project identifiers are hardcoded in
// the repository. Without a valid .env the app runs in local/demo mode and all
// Firebase services stay disabled (see `isLiveFirebaseConfigured`).
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

export const isLiveFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

const uninitialized = (null as unknown) as never;

let _app: FirebaseApp = uninitialized;
let _auth: Auth = uninitialized;
let _db: Firestore = uninitialized;
let _rtdb: Database = uninitialized;

// Initialize Firebase lazily only when valid environment config is present.
if (isLiveFirebaseConfigured) {
  _app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  _auth = getAuth(_app);
  _db = getFirestore(_app);
  _rtdb = getDatabase(_app);

  // Initialize Analytics conditionally (safe for all browser environments)
  if (typeof window !== 'undefined') {
    isSupported().then(yes => {
      if (yes) {
        getAnalytics(_app);
      }
    }).catch(() => {});
  }
}

export const app = _app;
export const auth = _auth;
export const db = _db;
export const rtdb = _rtdb;