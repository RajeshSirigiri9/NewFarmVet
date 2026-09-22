import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import {
  sendNotificationToAllUsers,
  getAllNotifications,
  deleteNotification,
} from "../../util/adminService";
import { sendBulkPushNotifications } from "../../util/pushNotifications";
import { ToastContext } from "../../util/ToastNotification";

const NotificationManager = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errors, setErrors] = useState({ title: "", message: "" });
  const toastContext = useContext(ToastContext);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsFetching(true);
      console.log("\nNotificationManager: Fetching notifications...");

      // Check if currentUser is already available
      let currentUser = firebase.auth().currentUser;
      console.log(
        "NotificationManager: CurrentUser check:",
        currentUser ? currentUser.uid : "null",
      );

      if (!currentUser) {
        console.log(
          "NotificationManager: No currentUser, attempting to sign in with email and cached token...",
        );

        // Try to get email and password from AsyncStorage
        // Since we don't have password, we'll try to use the token directly
        const storedEmail = await AsyncStorage.getItem("userEmail");

        if (storedEmail) {
          console.log(
            "NotificationManager: Found stored email, attempting to use it...",
          );

          // We can't re-signin without password, so let's just proceed
          // The Firestore rules will need to be flexible enough to allow this
          console.log(
            "NotificationManager: Proceeding without Firebase Auth currentUser",
          );
          console.log(
            "NotificationManager: Will rely on Firestore rules being readable or custom auth",
          );
        }
      } else {
        console.log(
          "✓ NotificationManager: Using existing Firebase Auth session",
        );
      }

      // Attempt to fetch notifications
      try {
        console.log("NotificationManager: Calling getAllNotifications()");
        const data = await getAllNotifications();
        console.log(
          "✓ NotificationManager: Fetched",
          data.length,
          "notifications",
        );
        setNotifications(data);
      } catch (firestoreError) {
        // If Firestore auth fails, it's likely because firebase.auth().currentUser is null
        // Try a different approach - query without relying on Firebase Auth
        console.log(
          "⚠ NotificationManager: Firestore query failed:",
          firestoreError.message,
        );

        if (
          firestoreError.message.includes("Missing or insufficient permissions")
        ) {
          console.log(
            "NotificationManager: Permission error - likely due to null currentUser",
          );
          console.log(
            "NotificationManager: This error suggests Firestore rules require Firebase Auth",
          );
          console.log(
            "NotificationManager: Solution: Update Firestore rules to allow public reads",
          );
          Alert.alert(
            "Admin Access Required",
            "Please log out and log back in to refresh your Firebase Auth session.\n\nError: Firestore permissions issue",
          );
        } else {
          throw firestoreError;
        }
      }
    } catch (error) {
      console.log("✗ NotificationManager Error:", error.message);
      Alert.alert("Error Loading Notifications", error.message);
    }
    setIsFetching(false);
  };

  const handleReLogin = async () => {
    try {
      console.log("NotificationManager: User chosen to re-login");
      await AsyncStorage.clear();
      await firebase.auth().signOut();
      Alert.alert("Logged Out", "Please log in again to refresh your session");
      // The app should navigate back to login screen automatically
    } catch (error) {
      console.log("Logout error:", error);
      Alert.alert("Error", "Failed to log out: " + error.message);
    }
  };

  const validateForm = () => {
    const newErrors = { title: "", message: "" };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
      isValid = false;
    }

    if (!message.trim()) {
      newErrors.message = "Message is required";
      isValid = false;
    } else if (message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSendNotification = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fix the errors");
      return;
    }

    // Check admin status before sending
    console.log("NotificationManager: Checking admin status before sending...");
    try {
      const storedIsAdmin = await AsyncStorage.getItem("isAdmin");
      const isAdmin = storedIsAdmin && JSON.parse(storedIsAdmin) === true;

      if (!isAdmin) {
        Alert.alert("Access Denied", "Only admins can send notifications");
        console.log("NotificationManager: User is not admin, rejecting send");
        return;
      }

      console.log(
        "✓ NotificationManager: Admin status verified, sending notification",
      );
    } catch (error) {
      console.log(
        "NotificationManager: Error checking admin status:",
        error.message,
      );
      Alert.alert("Error", "Could not verify admin status");
      return;
    }

    setIsLoading(true);
    try {
      console.log("NotificationManager: Sending notification...");
      await sendNotificationToAllUsers(title, message);
      console.log("✓ NotificationManager: Notification saved to Firestore");
      
      // Show success toast
      if (toastContext) {
        toastContext.showToast("✓ Notification sent to all users!", 'success', 3000);
      }
      
      // Also send push notifications to all user devices (non-blocking)
      console.log("NotificationManager: Sending push notifications to devices...");
      sendBulkPushNotifications(title, message).catch((err) => {
        console.log("⚠ Warning: Push notifications failed (non-critical):", err.message);
      });
      
      Alert.alert("Success", "Notification sent to all users!");
      setTitle("");
      setMessage("");
      setErrors({ title: "", message: "" });
      fetchNotifications();
    } catch (error) {
      console.log(
        "✗ NotificationManager: Error sending notification:",
        error.message,
      );
      
      // Show error toast
      if (toastContext) {
        toastContext.showToast("✗ Failed to send notification", 'error', 3000);
      }
      Alert.alert("Error", error.message);
    }
    setIsLoading(false);
  };

  const handleDeleteNotification = async (notificationId) => {
    Alert.alert("Delete Notification", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            // Verify admin before deleting
            const storedIsAdmin = await AsyncStorage.getItem("isAdmin");
            const isAdmin = storedIsAdmin && JSON.parse(storedIsAdmin) === true;

            if (!isAdmin) {
              Alert.alert(
                "Access Denied",
                "Only admins can delete notifications",
              );
              return;
            }

            console.log(
              "NotificationManager: Deleting notification:",
              notificationId,
            );
            await deleteNotification(notificationId);
            console.log("✓ NotificationManager: Notification deleted");
            fetchNotifications();
          } catch (error) {
            console.log("✗ NotificationManager Error deleting:", error.message);
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
  };

  const renderNotification = ({ item }) => (
    <View style={styles.notificationCard}>
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <TouchableOpacity
          onPress={() => handleDeleteNotification(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.notificationMessage}>{item.message}</Text>

      <Text style={styles.notificationDate}>
        {new Date(item.createdAt?.toDate?.()).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Send Notification Form */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>📢 Send Notification to All Users</Text>

        <View style={styles.inputGroup}>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="Notification Title"
            value={title}
            onChangeText={(value) => {
              setTitle(value);
              if (errors.title) setErrors({ ...errors, title: "" });
            }}
            maxLength={100}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          <Text style={styles.charCount}>{title.length}/100</Text>
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              errors.message && styles.inputError,
            ]}
            placeholder="Notification Message"
            value={message}
            onChangeText={(value) => {
              setMessage(value);
              if (errors.message) setErrors({ ...errors, message: "" });
            }}
            maxLength={1000}
            multiline
            numberOfLines={4}
          />
          {errors.message && (
            <Text style={styles.errorText}>{errors.message}</Text>
          )}
          <Text style={styles.charCount}>{message.length}/1000</Text>
        </View>

        <TouchableOpacity
          style={[styles.sendButton, isLoading && styles.buttonDisabled]}
          onPress={handleSendNotification}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.sendButtonText}>Send to All Users</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Recent Notifications */}
      <View style={styles.listCard}>
        <Text style={styles.listTitle}>Recent Notifications</Text>

        {isFetching ? (
          <ActivityIndicator color="#27ae60" />
        ) : notifications.length === 0 ? (
          <Text style={styles.emptyText}>No notifications sent yet</Text>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}
      </View>
    </View>
  );
};

export default NotificationManager;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 5,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#ecf0f1",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#2c3e50",
    marginBottom: 5,
  },
  textArea: {
    textAlignVertical: "top",
    minHeight: 100,
  },
  inputError: {
    borderWidth: 2,
    borderColor: "#e74c3c",
    backgroundColor: "#fadbd8",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    fontWeight: "600",
  },
  charCount: {
    fontSize: 12,
    color: "#7f8c8d",
    textAlign: "right",
  },
  sendButton: {
    backgroundColor: "#27ae60",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  listCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 10,
    padding: 15,
    elevation: 5,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
  },
  notificationCard: {
    backgroundColor: "#f8f9fa",
    borderLeftWidth: 4,
    borderLeftColor: "#27ae60",
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
    flex: 1,
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  notificationMessage: {
    fontSize: 13,
    color: "#555",
    marginBottom: 8,
  },
  notificationDate: {
    fontSize: 11,
    color: "#95a5a6",
  },
  emptyText: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
    marginTop: 20,
  },
});
