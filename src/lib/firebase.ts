
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration - Replace with your own configuration in production
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Note: This should be replaced with the user's Firebase config
  authDomain: "movieflix-app.firebaseapp.com",
  projectId: "movieflix-app",
  storageBucket: "movieflix-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:a1b2c3d4e5f6g7h8i9j0k1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
