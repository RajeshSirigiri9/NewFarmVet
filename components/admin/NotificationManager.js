import React, { useState, useEffect } from "react";
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
import {
  sendNotificationToAllUsers,
  getAllNotifications,
  deleteNotification,
} from "../../util/adminService";

const NotificationManager = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errors, setErrors] = useState({ title: "", message: "" });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsFetching(true);
      const data = await getAllNotifications();
      setNotifications(data);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
    setIsFetching(false);
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

    setIsLoading(true);
    try {
      await sendNotificationToAllUsers(title, message);
      Alert.alert("Success", "Notification sent to all users!");
      setTitle("");
      setMessage("");
      setErrors({ title: "", message: "" });
      fetchNotifications();
    } catch (error) {
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
            await deleteNotification(notificationId);
            fetchNotifications();
          } catch (error) {
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
        <Text style={styles.formTitle}>
          📢 Send Notification to All Users
        </Text>

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
          {errors.title && (
            <Text style={styles.errorText}>{errors.title}</Text>
          )}
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
              if (errors.message)
                setErrors({ ...errors, message: "" });
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
          style={[
            styles.sendButton,
            isLoading && styles.buttonDisabled,
          ]}
          onPress={handleSendNotification}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.sendButtonText}>
              Send to All Users
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Recent Notifications */}
      <View style={styles.listCard}>
        <Text style={styles.listTitle}>
          Recent Notifications
        </Text>

        {isFetching ? (
          <ActivityIndicator color="#27ae60" />
        ) : notifications.length === 0 ? (
          <Text style={styles.emptyText}>
            No notifications sent yet
          </Text>
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