import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDXxdwWuJpuoqi0p140LKizJ2ySU8CMCxE",
  authDomain: "srishti-os.firebaseapp.com",
  projectId: "srishti-os",
  storageBucket: "srishti-os.firebasestorage.app",
  messagingSenderId: "324988726154",
  appId: "1:324988726154:web:92abfeea1861e0e37fb673",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a time
    console.warn('Firestore persistence failed: multiple tabs open');
  } else if (err.code === 'unimplemented') {
    // The current browser doesn't support persistence
    console.warn('Firestore persistence not supported in this browser');
  }
});

export default app;
