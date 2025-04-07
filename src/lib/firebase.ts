
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration with default values for development
const firebaseConfig = {
  apiKey: "AIzaSyD_default_key_for_development",
  authDomain: "movieflix-app.firebaseapp.com",
  projectId: "movieflix-app",
  storageBucket: "movieflix-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:a1b2c3d4e5f6g7h8i9j0k1"
};

// Initialize Firebase only if not already initialized
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to local emulator if in development
if (import.meta.env.DEV) {
  try {
    // Use emulators if they are running
    // connectFirestoreEmulator(db, '127.0.0.1', 8080);
    console.log("Firestore emulator connection would be configured here if needed");
  } catch (error) {
    console.error("Failed to connect to Firestore emulator:", error);
  }
}

export default app;
