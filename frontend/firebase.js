// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "feasto-caff8.firebaseapp.com",
  projectId: "feasto-caff8",
  storageBucket: "feasto-caff8.firebasestorage.app",
  messagingSenderId: "751617622665",
  appId: "1:751617622665:web:1a97187337aff1699d3c58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth= getAuth(app)

export {app, auth}