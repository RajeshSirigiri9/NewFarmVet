import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";

const db = getFirestore();

/**
 * Save user profile to Firestore
 */
export async function saveUserProfile(uid, profileData) {
  try {
    await setDoc(doc(db, "users", uid), profileData, { merge: true });
    return profileData;
  } catch (error) {
    throw new Error("Failed to save profile: " + error.message);
  }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid) {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    throw new Error("Failed to get profile: " + error.message);
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(uid, updates) {
  try {
    await updateDoc(doc(db, "users", uid), updates);
    return updates;
  } catch (error) {
    throw new Error("Failed to update profile: " + error.message);
  }
}

/**
 * Search users by email
 */
export async function searchUserByEmail(email) {
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error("Failed to search user: " + error.message);
  }
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error("Failed to get users: " + error.message);
  }
}

/**
 * Update user phone number and display name
 */
export async function updateUserContact(uid, phoneNumber, displayName) {
  try {
    await updateDoc(doc(db, "users", uid), {
      phoneNumber: phoneNumber,
      displayName: displayName,
      updatedAt: new Date(),
    });
    return { phoneNumber, displayName };
  } catch (error) {
    throw new Error("Failed to update contact: " + error.message);
  }
}
