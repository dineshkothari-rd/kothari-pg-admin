import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZaseba3sG7aQr1W-HmVcSY7Gguembr4w",
  authDomain: "kothari-pg-admin.firebaseapp.com",
  projectId: "kothari-pg-admin",
  storageBucket: "kothari-pg-admin.firebasestorage.app",
  messagingSenderId: "124877373003",
  appId: "1:124877373003:web:4419edb1debebd314e97ce",
  measurementId: "G-TEWKWGJHHH",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
