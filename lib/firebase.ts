import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB8cw_t-RkVuPmAlVKDMXc2Hl-0a6PTAOc",
  authDomain: "kal-budget.firebaseapp.com",
  projectId: "kal-budget",
  storageBucket: "kal-budget.firebasestorage.app",
  messagingSenderId: "136383870207",
  appId: "1:136383870207:web:e75bd680b43d403d60c8ca"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
