// src/services/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcrkNe45ZFSS1GC8a16ItCJ1HfpLerDQ4",
  authDomain: "id2216-ef6a7.firebaseapp.com",
  databaseURL: "https://id2216-ef6a7-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "id2216-ef6a7",
  storageBucket: "id2216-ef6a7.firebasestorage.app",
  messagingSenderId: "1029820958735",
  appId: "1:1029820958735:web:35a8c5505c5b7337923b7a",
  measurementId: "G-DGSGVCDJLX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage, firebaseConfig };