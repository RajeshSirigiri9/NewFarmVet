import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Get or create auth instance with AsyncStorage persistence
let auth;
try {
  const app = firebase.app();
  // Try to get existing auth first
  auth = firebase.auth();
  console.log("util/auth.js - Using compat mode auth");
} catch (error) {
  console.log("util/auth.js - Compat auth not available:", error.message);
}

const db = getFirestore();

// Log auth persistence configuration
console.log("util/auth.js - Firebase Auth initialized with persistence support");

export async function createUser(email, password, name = "", phone = "") {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const userCredential = await auth.createUserWithEmailAndPassword(normalizedEmail, password);
    const user = userCredential.user;
    
    // Check if this is the first user (make them admin)
    let isFirstUser = false;
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      isFirstUser = usersSnap.size === 0;
    } catch (error) {
      console.log("util/auth.js - Could not check user count:", error.message);
    }
    
    // Save user profile to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: normalizedEmail,
      displayName: name || "",
      phoneNumber: phone || "",
      isAdmin: isFirstUser, // First user is automatically admin
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log("util/auth.js - User created, isAdmin:", isFirstUser);
    
    return {
      idToken: await user.getIdToken(),
      uid: user.uid,
      email: normalizedEmail,
      displayName: name,
      phoneNumber: phone
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function login(email, password) {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    console.log("util/auth.js - Attempting login with:", normalizedEmail);
    
    const userCredential = await auth.signInWithEmailAndPassword(normalizedEmail, password);
    const user = userCredential.user;
    
    console.log("util/auth.js - Login successful for user:", user.uid);
    console.log("util/auth.js - Current user after login:", auth.currentUser?.uid);
    
    // Firebase Auth should automatically persist the session via AsyncStorage
    // But let's make sure onAuthStateChanged is set up when app restarts
    
    return {
      idToken: await user.getIdToken(),
      uid: user.uid,
      email: normalizedEmail
    };
  } catch (error) {
    console.log("util/auth.js - Login error:", error.message);
    throw new Error(error.message);
  }
}

export async function getUserData(uid) {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateUserProfile(uid, userData) {
  try {
    await setDoc(doc(db, "users", uid), userData, { merge: true });
    return userData;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function logout() {
  try {
    console.log("util/auth.js - Logging out user:", auth.currentUser?.uid);
    await auth.signOut();
    console.log("util/auth.js - Logout successful");
  } catch (error) {
    throw new Error(error.message);
  }
}
