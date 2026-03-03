import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "../config";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNotification, setSelectedNotification ] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const q = query(
        collection(db, "notifications"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const notificationsList = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notificationsList.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });

      setNotifications(notificationsList);
    } catch (err) {
      console.log("Error fetching notifications:", err.message);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const renderNotification = ({ item }) => (
  <TouchableOpacity
    style={styles.notificationCard}
    onPress={() => setSelectedNotification(item)}  // ✅ open modal
  >
    <View style={styles.cardHeader}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="bell"
          size={24}
          color="#387849"
        />
      </View>

      <View style={styles.headerText}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.date}>
          {formatDate(item.createdAt)}
        </Text>
      </View>
    </View>

    <Text style={styles.message} numberOfLines={2}>
      {item.message}
    </Text>

    {item.imageUrl && (
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.notificationImage}
      />
    )}
  </TouchableOpacity>
);

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };


  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="bell-outline"
            size={28}
            color="#387849"
          />
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#387849" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="bell-outline"
          size={28}
          color="#387849"
        />
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notifications.length}</Text>
          </View>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={24}
            color="#d32f2f"
          />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchNotifications}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!error && notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="bell-off-outline"
            size={60}
            color="#ccc"
          />
          <Text style={styles.emptyText}>No Notifications Yet</Text>
          <Text style={styles.emptySubtext}>
            You'll receive notifications from admins here
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={fetchNotifications}
          scrollIndicatorInsets={{ right: 1 }}
        />
      )}
        <Modal
  visible={!!selectedNotification}
  animationType="slide"
  transparent
  onRequestClose={() => setSelectedNotification(null)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <ScrollView>

        {selectedNotification?.imageUrl && (
          <Image
            source={{ uri: selectedNotification.imageUrl }}
            style={styles.notificationImage}
          />
        )}

        <Text style={styles.title}>
          {selectedNotification?.title}
        </Text>

        <Text style={styles.date}>
          {selectedNotification?.createdAt
            ? formatDate(selectedNotification.createdAt)
            : ""}
        </Text>

        <Text style={styles.message}>
          {selectedNotification?.message}
        </Text>

      </ScrollView>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setSelectedNotification(null)}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#387849",
    marginLeft: 12,
    flex: 1,
  },
  badge: {
    backgroundColor: "#387849",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  listContainer: {
    padding: 12,
  },
  notificationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  message: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 12,
  },
  notificationImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#f0f0f0",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  statusBadge: {
    backgroundColor: "#c8e6c9",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#2e7d32",
    fontWeight: "600",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 14,
  },
  closeButton: {
  marginTop: 15,
  backgroundColor: "#387849",
  padding: 12,
  borderRadius: 10,
  alignItems: "center",
},

closeButtonText: {
  color: "white",
  fontWeight: "bold",
},
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: "#ffebee",
    borderRadius: 12,
    alignItems: "center",
  },
  errorText: {
    color: "#d32f2f",
    marginTop: 8,
    fontSize: 14,
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#d32f2f",
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#999",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 8,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
});

export default UserNotifications;
