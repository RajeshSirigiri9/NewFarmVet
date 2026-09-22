import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

let isExpoNotificationsAvailable = true;

// Configure notification handler
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
} catch (error) {
  console.log("⚠ Push notifications not available in this environment:", error.message);
  isExpoNotificationsAvailable = false;
}

/**
 * Register device for push notifications and save token to Firestore
 */
export async function registerForPushNotifications(userId) {
  try {
    if (!isExpoNotificationsAvailable) {
      console.log("⚠ Push notifications not available in Expo Go");
      console.log("   To use push notifications, create a development build");
      return null;
    }

    console.log("Registering for push notifications...");

    // Request notification permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push notification permissions");
      return null;
    }

    // Get the device push token - wrapped in try-catch for Expo Go
    try {
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'YOUR_EXPO_PROJECT_ID',
      });

      console.log("Push notification token obtained:", token.data);

      // Save token to local storage
      await AsyncStorage.setItem("expoPushToken", token.data);

      // Save token to Firestore for admin to use
      if (userId) {
        const db = getFirestore();
        const userRef = doc(db, "users", userId);
        
        // Update user document with push token
        await updateDoc(userRef, {
          expoPushToken: token.data,
          tokenUpdatedAt: new Date(),
        }).catch(err => {
          console.log("Could not update user token in Firestore:", err.message);
        });
      }

      return token.data;
    } catch (tokenError) {
      console.log("⚠ Could not obtain push token:", tokenError.message);
      console.log("   This is normal in Expo Go - use development build for full push notifications");
      return null;
    }
  } catch (error) {
    console.log("⚠ Error registering for push notifications:", error.message);
    return null;
  }
}

/**
 * Send push notification to a device
 * This function should be called from backend/admin panel
 */
export async function sendPushNotification(expoPushToken, title, message, data = {}) {
  try {
    if (!expoPushToken) {
      throw new Error("No expo push token provided");
    }

    const payload = {
      to: expoPushToken,
      sound: "default",
      title: title,
      body: message,
      data: data,
      badge: 1,
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("Push notification sent successfully");
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}

/**
 * Listen for incoming notifications
 */
export function setupNotificationListeners(onNotificationReceived, onNotificationTapped) {
  try {
    if (!isExpoNotificationsAvailable) {
      return () => {}; // No-op cleanup function
    }

    // Listen for notifications when app is in foreground
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
        if (onNotificationReceived) {
          onNotificationReceived(notification);
        }
      }
    );

    // Listen for notification taps
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification response:", response);
        if (onNotificationTapped) {
          onNotificationTapped(response.notification);
        }
      }
    );

    // Return cleanup function
    return () => {
      if (notificationListener) notificationListener.remove();
      if (responseListener) responseListener.remove();
    };
  } catch (error) {
    console.log("Error setting up notification listeners:", error.message);
    return () => {}; // No-op cleanup function
  }
}

/**
 * Get all user tokens for bulk sending
 */
export async function getAllUserTokens() {
  try {
    const db = getFirestore();
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("expoPushToken", "!=", null));
    const snapshot = await getDocs(q);
    
    const tokens = [];
    snapshot.forEach((doc) => {
      if (doc.data().expoPushToken) {
        tokens.push({
          userId: doc.id,
          token: doc.data().expoPushToken,
        });
      }
    });

    return tokens;
  } catch (error) {
    console.log("Error fetching user tokens:", error.message);
    return [];
  }
}

/**
 * Send push notification to multiple users
 */
export async function sendBulkPushNotifications(title, message, data = {}) {
  try {
    const userTokens = await getAllUserTokens();
    
    if (userTokens.length === 0) {
      console.log("No user tokens found - push notifications skipped");
      return;
    }

    console.log(`Sending push notifications to ${userTokens.length} users`);

    const promises = userTokens.map((user) =>
      sendPushNotification(user.token, title, message, data).catch((err) => {
        console.log(`Failed to send to ${user.userId}:`, err);
        // Continue with other users even if one fails
      })
    );

    await Promise.allSettled(promises);
    console.log("Bulk push notifications completed");
  } catch (error) {
    console.log("⚠ Warning: Error sending bulk notifications:", error.message);
    // Don't throw - this is a non-critical feature
  }
}

/**
 * Clear notification badge count
 */
export async function clearNotificationBadge() {
  try {
    if (!isExpoNotificationsAvailable) {
      return;
    }
    await Notifications.setBadgeCountAsync(0);
  } catch (error) {
    console.log("Error clearing badge:", error.message);
  }
}
