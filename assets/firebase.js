// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdEAGUVda8nL6ilIFH9wLqcYHqkBSlOU4",
  authDomain: "image-picker-d61ec.firebaseapp.com",
  projectId: "image-picker-d61ec",
  storageBucket: "image-picker-d61ec.appspot.com",
  messagingSenderId: "53388338455",
  appId: "1:53388338455:web:e07ecc743b844a760f0352",
  measurementId: "G-SXD12P99W3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app)
const analytics = getAnalytics(app);

export{db,storage}