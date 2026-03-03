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
import { AuthContext } from "../../store/auth-context";
import { isUserAdmin } from "../../util/adminService";
import NotificationManager from "./NotificationManager";
import FeedbackViewer from "./FeedbackViewer";
import ContentManager from "./ContentManager";

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
      const adminStatus = await isUserAdmin(authCtx.uid);
      setIsAdmin(adminStatus);
      if (!adminStatus) {
        Alert.alert("Access Denied", "You do not have admin privileges");
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Error", error.message);
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

  return (
    // <ImageBackground
    //   source={require("../../assets/images/background2.webp")}
    //   style={styles.rootScreen}
    //   resizeMode="cover"
    //   imageStyle={styles.backgroundImage}
    // >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Admin Panel</Text>
          <Text style={styles.headerSubtitle}>Welcome, Admin!</Text>
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
            Feedback  💬
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
        </View>

        {/* Content */}
        <ScrollView style={styles.content}>
          {activeTab === "notifications" && <NotificationManager />}
          {activeTab === "feedback" && <FeedbackViewer />}
          {activeTab === "content" && <ContentManager />}
        </ScrollView>
      </SafeAreaView>
    // </ImageBackground>
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
    paddingTop: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#27ae60",
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
