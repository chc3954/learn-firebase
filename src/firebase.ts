// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6XjSzk-aM-RG9ksthYRz79XPzrkGfV5w",
  authDomain: "learn-firebase-bc6b1.firebaseapp.com",
  projectId: "learn-firebase-bc6b1",
  storageBucket: "learn-firebase-bc6b1.appspot.com",
  messagingSenderId: "939552570854",
  appId: "1:939552570854:web:faeed8fdd70d8cedbfaa27",
  measurementId: "G-XED6RS5KYB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
