import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD9snmVMp5Xl5JqCS3dnqt5N5kBYq4CmwY",
  authDomain: "spinal-solution.firebaseapp.com",
  projectId: "spinal-solution",
  storageBucket: "spinal-solution.firebasestorage.app",
  messagingSenderId: "597986205303",
  appId: "1:597986205303:web:ee739413642724a6ebf072",
  measurementId: "G-8N5ZMY63RD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
