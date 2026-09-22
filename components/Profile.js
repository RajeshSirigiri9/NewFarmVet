// Make Phone Call, Send SMS or Email Using React Native Communication
// https://aboutreact.com/make-phone-call-send-sms-or-email-using-react-native-communication/

import React from "react";
import { useState, useContext, useEffect } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import i18n from "../localization/i18n";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../store/auth-context";
import { isUserAdmin } from "../util/adminService";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";

// 1. Either import the whole module
import Communications from "react-native-communications";
import Icon from "../ui/Icons";
/* 2. Or import single methods
 import {
  phonecall,
  email,
  text,
  web
} from 'react-native-communications';*/

const Profile = () => {
  const [subject, setSubject] = useState();
  const [feedBack, setFeedBack] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(true);
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    console.log(
      "Profile useEffect triggered - uid:",
      authCtx.uid,
      "isAuthenticated:",
      authCtx.isAuthenticated,
    );
    setIsLoadingAdmin(true);
    setIsAdmin(false);
    checkAdminStatus();
  }, [authCtx.uid, authCtx.isAuthenticated]);

  const checkAdminStatus = async () => {
    try {
      if (authCtx.uid) {
        console.log("Checking admin status for UID:", authCtx.uid);

        // Step 1: Check AsyncStorage first (fastest, most reliable at app restart)
        const storedIsAdmin = await AsyncStorage.getItem("isAdmin");
        if (storedIsAdmin !== null) {
          const isAdminValue = JSON.parse(storedIsAdmin);
          console.log("Found isAdmin in AsyncStorage:", isAdminValue);
          setIsAdmin(isAdminValue === true);
          setIsLoadingAdmin(false);
          return;
        }

        // Step 2: Check if userData is available with isAdmin field
        if (authCtx.userData && authCtx.userData.isAdmin !== undefined) {
          console.log(
            "Using userData in memory - isAdmin:",
            authCtx.userData.isAdmin,
          );
          setIsAdmin(authCtx.userData.isAdmin === true);
          setIsLoadingAdmin(false);
          return;
        }

        // Step 3: Wait for Firebase Auth to be ready, then query Firestore
        console.log("Firebase Auth not ready yet, waiting...");
        const currentUser = firebase.auth().currentUser;
        if (!currentUser) {
          await new Promise((resolve, reject) => {
            let resolved = false;
            const unsubscribe = firebase.auth().onAuthStateChanged(
              (user) => {
                if (!resolved) {
                  resolved = true;
                  unsubscribe();
                  if (user) {
                    console.log(
                      "Firebase Auth initialized with user:",
                      user.uid,
                    );
                    resolve(user);
                  } else {
                    reject(new Error("User not authenticated in Firebase"));
                  }
                }
              },
              (error) => {
                if (!resolved) {
                  resolved = true;
                  reject(error);
                }
              },
            );
            // Timeout after 5 seconds
            setTimeout(() => {
              if (!resolved) {
                resolved = true;
                unsubscribe();
                reject(new Error("Firebase Auth initialization timeout"));
              }
            }, 5000);
          });
        } else {
          console.log(
            "Firebase Auth already available with user:",
            currentUser.uid,
          );
        }

        console.log("Firebase Auth is ready, querying Firestore");
        const adminStatus = await isUserAdmin(authCtx.uid);
        console.log("Admin status result from Firestore:", adminStatus);
        setIsAdmin(adminStatus);

        // Store for next time
        await AsyncStorage.setItem("isAdmin", JSON.stringify(adminStatus));
      } else {
        console.log("No UID available yet");
        setIsAdmin(false);
      }
    } catch (error) {
      console.log("Error checking admin status:", error);
      setIsAdmin(false);
    } finally {
      setIsLoadingAdmin(false);
    }
  };

  console.log("Profile - Full authCtx:", {
    uid: authCtx.uid,
    isAuthenticated: authCtx.isAuthenticated,
    userData: authCtx.userData,
    Gmail: authCtx.Gmail,
    otpLoginName: authCtx.otpLoginName,
    phoneNumber: authCtx.phoneNumber,
  });
  console.log("Profile - Admin check state:", { isAdmin, isLoadingAdmin });

  // Get data from context - prioritize userData but check for empty strings
  const mail = authCtx.Gmail || authCtx.userData?.email || "*****@gmail.com";
  const name =
    authCtx.userData?.displayName || authCtx.otpLoginName || "Not Provided";
  const phone =
    authCtx.userData?.phoneNumber || authCtx.phoneNumber || "Not Provided";

  console.log("Profile - Final values:", { mail, name, phone });
  console.log("Profile - About to render, condition check:", {
    isLoadingAdmin,
    isAdmin,
    shouldRenderButton: !isLoadingAdmin && isAdmin,
  });

  const sendVerification = () => {
    setSubject("");
    setFeedBack("");
    Alert.alert("Thank you for submitting valuable feedback");
  };

  return (
    <ImageBackground
      source={require("../assets/images/background2.webp")}
      style={styles.rootScreen}
      resizeMode="cover"
      imageStyle={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <View style={[styles.widget, { paddingTop: 30, marginTop: 30 }]}>
          <Text style={styles.otpText}>{i18n.t("profile.details")}</Text>
          <Text style={styles.widgetText}>
            {i18n.t("profile.name")} {name}
          </Text>
          <Text style={styles.widgetText}>
            {i18n.t("profile.email")} {mail}
          </Text>
          <Text style={styles.widgetText}>
            {i18n.t("profile.phone")} {phone}
          </Text>
        </View>

        {/* Admin Panel Button */}
        {!isLoadingAdmin && isAdmin && (
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => navigation.navigate("AdminPanel")}
          >
            <Text style={styles.adminButtonText}>⚙️ Admin Panel</Text>
          </TouchableOpacity>
        )}

        {/* Debug Info */}
        <View style={styles.debugBox}>
          <Text style={styles.debugText}>DEBUG INFO:</Text>
          <Text style={styles.debugText}>UID: {authCtx.uid || "No UID"}</Text>
          <Text style={styles.debugText}>isLoading: {isLoadingAdmin}</Text>
          <Text style={styles.debugText}>isAdmin: {isAdmin}</Text>
          <Text style={styles.debugText}>
            RenderButton: {!isLoadingAdmin && isAdmin ? "YES" : "NO"}
          </Text>
          <Text style={styles.debugText}>Email: {mail}</Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "white",
    padding: 10,
  },
  widget: {
    backgroundColor: "rgba(114, 146, 189, 0.6)",
    marginHorizontal: 25,
    marginBottom: 25,
    padding: 20,
    borderRadius: 10,
    paddingBottom: 50,
  },
  widgetText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  widgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleText: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
  },
  textInput: {
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    fontSize: 18,
    borderBottomColor: "#fff",
    textAlign: "justify",
    color: "#000",
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    // width: 200,
  },
  sendVerification: {
    padding: 10,
    backgroundColor: "#3498db",
    borderRadius: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  otpText: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  backgroundImage: {
    opacity: 0.4,
  },
  rootScreen: {
    flex: 1,
  },
  adminButton: {
    backgroundColor: "#27ae60",
    marginHorizontal: 25,
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  adminButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  debugBox: {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    marginHorizontal: 25,
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "red",
  },
  debugText: {
    fontSize: 12,
    color: "#000",
    marginVertical: 2,
    fontFamily: "monospace",
  },
});
