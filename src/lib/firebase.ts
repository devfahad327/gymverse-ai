let auth: import('firebase/auth').Auth | null = null;
let db: import('firebase/firestore').Firestore | null = null;

export function getFirebase() {
  if (typeof window === 'undefined') return { auth: null, db: null };
  if (auth && db) return { auth, db };

  // Lazy-init: only runs client-side when env vars are present
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    return { auth: null, db: null };
  }

  try {
    const { initializeApp, getApps } = require('firebase/app');
    const { getAuth } = require('firebase/auth');
    const { getFirestore } = require('firebase/firestore');

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    console.warn('Firebase init failed:', e);
  }

  return { auth, db };
}
