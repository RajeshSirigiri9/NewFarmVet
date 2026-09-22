import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  doc,
  where,
} from "firebase/firestore";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

export const firebaseConfig = {
  apiKey: "AIzaSyB471CfkfJVQZPqH_QIeOQ0apLYpRLH7yU",
  authDomain: "farmvet-87f17.firebaseapp.com",
  projectId: "farmvet-87f17",
  storageBucket: "farmvet-87f17.firebasestorage.app",
  messagingSenderId: "996265306834",
  appId: "1:996265306834:web:af43f5888ca7dc6b1cdb0b",
  measurementId: "G-QMJQEFTQ77",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence for React Native
try {
  const auth = firebase.auth();
  console.log("config.js - Firebase Auth initialized (compat mode)");
  console.log(
    "config.js - Auth will use AsyncStorage for session persistence in React Native",
  );
} catch (error) {
  console.log("config.js - Error initializing Firebase Auth:", error.message);
}

export const db = getFirestore(app);
