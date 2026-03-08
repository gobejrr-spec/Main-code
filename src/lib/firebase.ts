import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDPa60cUz0B9l-t1TdjjxHhhF4_Ig3N3oI",
  authDomain: "munguu2.firebaseapp.com",
  projectId: "munguu2",
  storageBucket: "munguu2.firebasestorage.app",
  messagingSenderId: "66821645088",
  appId: "1:66821645088:web:725204903e0adb1c12ad45",
  measurementId: "G-89VDS5F540"
};

const app = initializeApp(firebaseConfig);

// analytics (optional)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// ✅ ЭНЭ ХОЁР ЧУХАЛ
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;