import React, { useState, useContext, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../store/auth-context";
import { isUserAdmin } from "../../util/adminService";
import NotificationManager from "./NotificationManager";
import FeedbackViewer from "./FeedbackViewer";
import ContentManager from "./ContentManager";
import PostJob from "./PostJob";

const AdminPanel = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("notifications");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      console.log("AdminPanel - Checking admin status");

      // Step 1: Check AsyncStorage first (no Firestore calls needed)
      const storedIsAdmin = await AsyncStorage.getItem("isAdmin");
      if (storedIsAdmin !== null) {
        const isAdminValue = JSON.parse(storedIsAdmin);
        console.log(
          "AdminPanel - Found isAdmin in AsyncStorage:",
          isAdminValue,
        );
        setIsAdmin(isAdminValue === true);
        setIsLoading(false);
        if (isAdminValue !== true) {
          Alert.alert("Access Denied", "You do not have admin privileges");
          navigation.goBack();
        }
        return;
      }

      // Step 2: Check if userData in context has isAdmin
      if (authCtx.userData && authCtx.userData.isAdmin === true) {
        console.log("AdminPanel - Found isAdmin in userData");
        setIsAdmin(true);
        setIsLoading(false);
        return;
      }

      // Step 3: Only if both fail, query Firestore
      console.log("AdminPanel - Querying Firestore for admin status");
      const adminStatus = await isUserAdmin(authCtx.uid);
      console.log("AdminPanel - Admin status:", adminStatus);
      setIsAdmin(adminStatus);

      if (!adminStatus) {
        Alert.alert("Access Denied", "You do not have admin privileges");
        navigation.goBack();
      }

      // Store for next time
      await AsyncStorage.setItem("isAdmin", JSON.stringify(adminStatus));
    } catch (error) {
      console.log("AdminPanel - Error checking admin status:", error);
      Alert.alert("Error", error.message || "Failed to verify admin status");
      setIsAdmin(false);
      navigation.goBack();
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#27ae60" />
      </SafeAreaView>
    );
  }

  if (!isAdmin) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>You do not have admin access</Text>
      </SafeAreaView>
    );
  }

  const handleRefresh = async () => {
    console.log("AdminPanel: User clicked refresh");
    Alert.alert("Refreshing", "Clearing cache and reloading...");

    // Clear AsyncStorage
    try {
      await AsyncStorage.removeItem("isAdmin");
      console.log("AdminPanel: Cleared isAdmin from AsyncStorage");
    } catch (error) {
      console.log("AdminPanel: Error clearing cache:", error);
    }

    // Refresh current tab by re-mounting the component
    const current = activeTab;
    setActiveTab(null); // Force unmount
    setTimeout(() => {
      setActiveTab(current); // Remount
      console.log("AdminPanel: Tab reloaded");
      Alert.alert("Refreshed", "Data reloaded - check the " + current + " tab");
    }, 500);
  };

  const handleLogout = async () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            import("firebase/compat/app").then((firebase) => {
              firebase.default.auth().signOut();
            });
            Alert.alert("Logged Out", "You have been logged out");
            navigation.navigate("Login");
          } catch (error) {
            console.log("Logout error:", error);
          }
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Admin Panel</Text>
            <Text style={styles.headerSubtitle}>Welcome, Admin!</Text>
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
          >
            <Text style={styles.refreshButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "notifications" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("notifications")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "notifications" && styles.activeTabText,
            ]}
          >
            📢 Notifications
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "feedback" && styles.activeTab]}
          onPress={() => setActiveTab("feedback")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "feedback" && styles.activeTabText,
            ]}
          >
            Feedback 💬
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "content" && styles.activeTab]}
          onPress={() => setActiveTab("content")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "content" && styles.activeTabText,
            ]}
          >
            📝 Content
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "postJob" && styles.activeTab]}
          onPress={() => setActiveTab("postJob")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "postJob" && styles.activeTabText,
            ]}
          >
            💼 Post Job
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === "notifications" && <NotificationManager />}
        {activeTab === "feedback" && <FeedbackViewer />}
        {activeTab === "content" && <ContentManager />}
        {activeTab === "postJob" && <PostJob navigation={navigation} />}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.65)",
  },
  rootScreen: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.9,
  },
  header: {
    backgroundColor: "rgba(39, 174, 96, 0.8)",
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 2,
    borderBottomColor: "#27ae60",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  refreshButton: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
  },
  refreshButtonText: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginTop: 5,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(52, 73, 94, 0.7)",
    borderBottomWidth: 2,
    borderBottomColor: "#34495e",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#27ae60",
    backgroundColor: "rgba(39, 174, 96, 0.3)",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
  },
  activeTabText: {
    color: "#27ae60",
    fontSize: 13,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    textAlign: "center",
    marginTop: 20,
  },
});

export default AdminPanel;
