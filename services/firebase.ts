// Import the functions you need from the SDKs
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

// Your web app's Firebase configuration
// REPLACE THE STRINGS BELOW WITH THE KEYS YOU COPIED FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyAhPYjDxUd4LxD-WX2YdF-SwQunv16Vs1Y",
  authDomain: "mousse-and-melts.firebaseapp.com",
  projectId: "mousse-and-melts",
  storageBucket: "mousse-and-melts.firebasestorage.app",
  messagingSenderId: "507558640024",
  appId: "1:507558640024:web:9d558ffd4495134e5993ed",
  measurementId: "G-RJ66JF206Q"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Services
export const db = firebase.firestore();
export const auth = firebase.auth();