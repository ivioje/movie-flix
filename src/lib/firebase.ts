
import { initializeApp, getApps } from "firebase/app";
import { enableNetwork, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBgjQCqyS2WF9BXeGJe9ME7W7WlBQr-miI",
  authDomain: "movie-flix-e5b3f.firebaseapp.com",
  projectId: "movie-flix-e5b3f",
  storageBucket: "movie-flix-e5b3f.firebasestorage.app",
  messagingSenderId: "907669452231",
  appId: "1:907669452231:web:01bd16f2fb5335103f55e2"
};

// Initialize Firebase only if not already initialized
// let app;
// if (getApps().length === 0) {
// } else {
//   app = getApps()[0];
// }
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
