import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

const db = getFirestore();

/**
 * Save feedback to Firestore
 */
export async function saveFeedback(userId, email, subject, message) {
  try {
    console.log("saveFeedback called with:", { userId, email, subject, messageLength: message?.length });

    if (!userId) {
      throw new Error("User must be logged in to submit feedback");
    }

    if (!subject || !subject.trim()) {
      throw new Error("Subject is required");
    }

    if (!message || !message.trim()) {
      throw new Error("Feedback message is required");
    }

    if (subject.trim().length < 3) {
      throw new Error("Subject must be at least 3 characters");
    }

    if (message.trim().length < 10) {
      throw new Error("Feedback must be at least 10 characters");
    }

    const feedbackData = {
      userId: userId,
      email: email,
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date(),
      status: "pending",
    };

    console.log("Adding document to Firestore:", feedbackData);
    const docRef = await addDoc(collection(db, "feedback"), feedbackData);
    console.log("Document created with ID:", docRef.id);

    return {
      id: docRef.id,
      ...feedbackData,
    };
  } catch (error) {
    console.log("saveFeedback error:", error);
    throw new Error(error.message);
  }
}

/**
 * Get all feedback for a user
 */
export async function getUserFeedback(userId) {
  try {
    const q = query(collection(db, "feedback"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error("Failed to fetch feedback: " + error.message);
  }
}

/**
 * Get all feedback (admin only)
 */
export async function getAllFeedback() {
  try {
    const querySnapshot = await getDocs(collection(db, "feedback"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error("Failed to fetch all feedback: " + error.message);
  }
}

/**
 * Delete feedback
 */
export async function deleteFeedback(feedbackId) {
  try {
    await deleteDoc(doc(db, "feedback", feedbackId));
    return true;
  } catch (error) {
    throw new Error("Failed to delete feedback: " + error.message);
  }
}

/**
 * Update feedback status (admin)
 */
export async function updateFeedbackStatus(feedbackId, status) {
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
