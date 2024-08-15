import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { loadStripe } from '@stripe/stripe-js';
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCNvjt5j7uD4vs3W623sUhkFNh5gR6VMGM",
    authDomain: "embro-c10c0.firebaseapp.com",
    projectId: "embro-c10c0",
    storageBucket: "embro-c10c0.appspot.com",
    messagingSenderId: "793867057517",
    appId: "1:793867057517:web:fa5614f767493d03f2c264",
    measurementId: "G-4K162JW0HB"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const stripePromise = loadStripe('pk_test_51Po1J5EOYoSTEbJM2tympagoNW2xpqBP0pow9Z6H9yrvDL8GEejVRUuMkTmdjAZgfQjoKnH3knLawHgbimaGfQCr00L0cse7tO');

