// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "process.env.NEXT_PUBLIC_FIREBASE_API_KEY",
    authDomain: "qquizapp-698e8.firebaseapp.com",
    projectId: "quizapp-698e8",
    storageBucket: "quizapp-698e8.appspot.com",
    messagingSenderId: "455620061883",
    appId: "1:455620061883:web:22889ce92dabb55568979e",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export { app, db, auth } 