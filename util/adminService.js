import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc,
  query,
  where,
  deleteDoc,
  setDoc,
  getDoc
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const db = getFirestore();
const storage = getStorage();

/**
 * Check if user is admin
 */
export async function isUserAdmin(userId) {
  try {
    console.log("isUserAdmin - Checking admin status for userId:", userId);
    const userDoc = await getDoc(doc(db, "users", userId));
    console.log("isUserAdmin - User document exists:", userDoc.exists());
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("isUserAdmin - User data:", userData);
      const isAdmin = userData.isAdmin === true;
      console.log("isUserAdmin - isAdmin value:", isAdmin);
      return isAdmin;
    }
    console.log("isUserAdmin - User document does not exist");
    return false;
  } catch (error) {
    console.log("isUserAdmin - Error:", error);
    throw new Error("Failed to check admin status: " + error.message);
  }
}

/**
 * Get all registered users
 */
export async function getAllUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error("Failed to fetch users: " + error.message);
  }
}

/**
 * Send notification to all users
 */
export async function sendNotificationToAllUsers(title, message, imageUrl = null) {
  try {
    if (!title || !title.trim()) {
      throw new Error("Notification title is required");
    }
    if (!message || !message.trim()) {
      throw new Error("Notification message is required");
    }

    const notificationData = {
      title: title.trim(),
      message: message.trim(),
      imageUrl: imageUrl || null,
      createdAt: new Date(),
      status: "published",
    };

    const docRef = await addDoc(collection(db, "notifications"), notificationData);
    console.log("Notification sent with ID:", docRef.id);

    return {
      id: docRef.id,
      ...notificationData,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Get all notifications
 */
export async function getAllNotifications() {
  try {
    const querySnapshot = await getDocs(collection(db, "notifications"));
    const notifications = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by newest first
    return notifications.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    throw new Error("Failed to fetch notifications: " + error.message);
  }
}

/**
 * Delete notification
 */
export async function deleteNotification(notificationId) {
  try {
    await deleteDoc(doc(db, "notifications", notificationId));
    return true;
  } catch (error) {
    throw new Error("Failed to delete notification: " + error.message);
  }
}

/**
 * Get all feedback
 */
export async function getAllFeedbackAdmin() {
  try {
    const querySnapshot = await getDocs(collection(db, "feedback"));
    const feedbackList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by newest first
    return feedbackList.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    throw new Error("Failed to fetch feedback: " + error.message);
  }
}

/**
 * Update feedback status
 */
export async function updateFeedbackStatusAdmin(feedbackId, status) {
  try {
    if (!["pending", "reviewed", "resolved"].includes(status)) {
      throw new Error("Invalid status");
    }

    await updateDoc(doc(db, "feedback", feedbackId), {
      status: status,
      updatedAt: new Date(),
    });

    return { id: feedbackId, status };
  } catch (error) {
    throw new Error("Failed to update feedback: " + error.message);
  }
}

/**
 * Add new content/page
 */
export async function addContent(title, description, imageUrl = null, category = "general") {
  try {
    if (!title || !title.trim()) {
      throw new Error("Content title is required");
    }
    if (!description || !description.trim()) {
      throw new Error("Content description is required");
    }

    const contentData = {
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl || null,
      category: category || "general",
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublished: true,
    };

    const docRef = await addDoc(collection(db, "content"), contentData);
    console.log("Content added with ID:", docRef.id);

    return {
      id: docRef.id,
      ...contentData,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Get all content
 */
export async function getAllContent() {
  try {
    const querySnapshot = await getDocs(collection(db, "content"));
    const content = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by newest first
    return content.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    throw new Error("Failed to fetch content: " + error.message);
  }
}

/**
 * Update content
 */
export async function updateContent(contentId, updates) {
  try {
    await updateDoc(doc(db, "content", contentId), {
      ...updates,
      updatedAt: new Date(),
    });

    return { id: contentId, ...updates };
  } catch (error) {
    throw new Error("Failed to update content: " + error.message);
  }
}

/**
 * Delete content
 */
export async function deleteContent(contentId) {
  try {
    await deleteDoc(doc(db, "content", contentId));
    return true;
  } catch (error) {
    throw new Error("Failed to delete content: " + error.message);
  }
}

/**
 * Upload image to Firebase Storage
 */
export async function uploadImage(imageUri, folderName = "uploads") {
  try {
    // This is a simplified version - actual implementation depends on how you handle images
    // For React Native, you might need to use expo-image-picker and convert to blob
    console.log("Image upload function - implement based on your image source");
    return null;
  } catch (error) {
    throw new Error("Failed to upload image: " + error.message);
  }
}

/**
 * Make user an admin
 */
export async function makeUserAdmin(userId) {
  try {
    await updateDoc(doc(db, "users", userId), {
      isAdmin: true,
    });
    return true;
  } catch (error) {
    throw new Error("Failed to make user admin: " + error.message);
  }
}

/**
 * Remove admin privileges
 */
export async function removeUserAdmin(userId) {
  try {
    await updateDoc(doc(db, "users", userId), {
      isAdmin: false,
    });
    return true;
  } catch (error) {
    throw new Error("Failed to remove admin privileges: " + error.message);
  }
}
