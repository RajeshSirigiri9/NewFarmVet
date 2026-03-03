import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const auth = firebase.auth();
const db = getFirestore();

export async function createUser(email, password, name = "", phone = "") {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const userCredential = await auth.createUserWithEmailAndPassword(normalizedEmail, password);
    const user = userCredential.user;
    
    // Save user profile to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: normalizedEmail,
      displayName: name || "",
      phoneNumber: phone || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
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
    const userCredential = await auth.signInWithEmailAndPassword(normalizedEmail, password);
    const user = userCredential.user;
    
    return {
      idToken: await user.getIdToken(),
      uid: user.uid,
      email: normalizedEmail
    };
  } catch (error) {
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
    await auth.signOut();
  } catch (error) {
    throw new Error(error.message);
  }
}
