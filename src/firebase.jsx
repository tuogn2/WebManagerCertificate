// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXGa1A93Rs4QexRPKj4XNYXsPVUktqILI",
  authDomain: "certificate-4175f.firebaseapp.com",
  projectId: "certificate-4175f",
  storageBucket: "certificate-4175f.appspot.com",
  messagingSenderId: "131645727023",
  appId: "1:131645727023:web:004d833a17710ff63d41da",
  measurementId: "G-P0FB841KCC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// const analytics = getAnalytics(app);

export { auth, provider, signInWithPopup };
