// Make Phone Call, Send SMS or Email Using React Native Communication
// https://aboutreact.com/make-phone-call-send-sms-or-email-using-react-native-communication/

import React from "react";
import { useState, useContext, useEffect } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import i18n from "../localization/i18n";

import { SafeAreaView } from 'react-native-safe-area-context';
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
    checkAdminStatus();
  }, [authCtx.uid]);
  
  const checkAdminStatus = async () => {
    try {
      if (authCtx.uid) {
        console.log("Checking admin status for UID:", authCtx.uid);
        const adminStatus = await isUserAdmin(authCtx.uid);
        console.log("Admin status result:", adminStatus);
        setIsAdmin(adminStatus);
      } else {
        console.log("No UID available yet");
        setIsAdmin(false);
      }
    } catch (error) {
      console.log("Error checking admin status:", error);
      setIsAdmin(false);
    }
    setIsLoadingAdmin(false);
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
  const name = authCtx.userData?.displayName || authCtx.otpLoginName || "Not Provided";
  const phone = authCtx.userData?.phoneNumber || authCtx.phoneNumber || "Not Provided";
  
  console.log("Profile - Final values:", { mail, name, phone });
  
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
        {/* <View style={styles.debugBox}>
          <Text style={styles.debugText}>DEBUG INFO:</Text>
          <Text style={styles.debugText}>UID: {authCtx.uid || "No UID"}</Text>
          <Text style={styles.debugText}>isLoading: {isLoadingAdmin}</Text>
          <Text style={styles.debugText}>isAdmin: {isAdmin}</Text>
          <Text style={styles.debugText}>Email: {mail}</Text>
        </View> */}
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
