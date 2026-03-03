import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getFirestore, collection, addDoc, query, orderBy, getDocs, doc, where } from "firebase/firestore";


export const firebaseConfig = {
  apiKey: "AIzaSyB471CfkfJVQZPqH_QIeOQ0apLYpRLH7yU",
  authDomain: "farmvet-87f17.firebaseapp.com",
  projectId: "farmvet-87f17",
  storageBucket: "farmvet-87f17.firebasestorage.app",
  messagingSenderId: "996265306834",
  appId: "1:996265306834:web:af43f5888ca7dc6b1cdb0b",
  measurementId: "G-QMJQEFTQ77"
};


const app = firebase.initializeApp(firebaseConfig);

export const db = getFirestore(app);
