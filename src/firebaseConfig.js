// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAU8abWZC0wcBNlPml97KSXq7coSB9FSXY",
  authDomain: "greenshare-2f9e6.firebaseapp.com",
  projectId: "greenshare-2f9e6",
  storageBucket: "greenshare-2f9e6.firebasestorage.app",
  messagingSenderId: "211061544792",
  appId: "1:211061544792:web:18e2f2af8c08aabeb2b72d",
  measurementId: "G-E1Z26TY2SE"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
