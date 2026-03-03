// Make Phone Call, Send SMS or Email Using React Native Communication
// https://aboutreact.com/make-phone-call-send-sms-or-email-using-react-native-communication/

import React from "react";
import { useState, useContext } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import i18n from "../localization/i18n";
import Communications from "react-native-communications";
import Icon from "../ui/Icons";
import { AuthContext } from "../store/auth-context";
import { saveFeedback } from "../util/feedbackService";

const Contact = () => {
  const [subject, setSubject] = useState("");
  const [feedBack, setFeedBack] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ subject: "", message: "" });
  
  const authCtx = useContext(AuthContext);

  // Validation
  const validateForm = () => {
    const newErrors = { subject: "", message: "" };
    let isValid = true;

    // Subject validation
    if (!subject || !subject.trim()) {
      newErrors.subject = "Subject is required";
      isValid = false;
    } else if (subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
      isValid = false;
    } else if (subject.trim().length > 100) {
      newErrors.subject = "Subject must be less than 100 characters";
      isValid = false;
    }

    // Message validation
    if (!feedBack || !feedBack.trim()) {
      newErrors.message = "Feedback message is required";
      isValid = false;
    } else if (feedBack.trim().length < 10) {
      newErrors.message = "Feedback must be at least 10 characters";
      isValid = false;
    } else if (feedBack.trim().length > 1000) {
      newErrors.message = "Feedback must be less than 1000 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const sendVerification = async () => {
    console.log("=== FEEDBACK SUBMISSION START ===");
    console.log("Auth context:", {
      isAuthenticated: authCtx.isAuthenticated,
      uid: authCtx.uid,
      Gmail: authCtx.Gmail,
    });

    // Validate first
    if (!validateForm()) {
      console.log("Validation failed");
      Alert.alert("Validation Error", "Please fix the errors above");
      return;
    }

    // Check if user is logged in
    if (!authCtx.isAuthenticated || !authCtx.uid) {
      console.log("User not logged in");
      Alert.alert("Login Required", "Please login to submit feedback");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Saving feedback with:", {
        userId: authCtx.uid,
        email: authCtx.Gmail,
        subject: subject.trim(),
        messageLength: feedBack.trim().length,
      });

      const result = await saveFeedback(
        authCtx.uid,
        authCtx.Gmail,
        subject,
        feedBack
      );

      console.log("✅ Feedback saved successfully:", result);
      
      setSubject("");
      setFeedBack("");
      setErrors({ subject: "", message: "" });
      
      Alert.alert(
        "Success",
        "Thank you! Your feedback has been submitted successfully.\n\nWe appreciate your valuable input."
      );
    } catch (error) {
      console.log("❌ Feedback error:", error);
      console.log("Error message:", error.message);
      Alert.alert("Submission Failed", error.message);
    }
    setIsSubmitting(false);
  };

  return (
    // <ImageBackground
    //   source={require("../assets/images/background2.webp")}
    //   style={styles.rootScreen}
    //   resizeMode="cover"
    //   imageStyle={styles.backgroundImage}
    // >
      <SafeAreaView style={styles.container}>
        <View style={[styles.widget, { paddingTop: 30, marginTop: 30 }]}>
          <Text style={styles.otpText}>{i18n.t("feedBack.feedback")}</Text>
          
          {/* Subject Input */}
          <View style={styles.inputGroup}>
            <TextInput
              placeholder={i18n.t("feedBack.subject")}
              value={subject}
              onChangeText={(value) => {
                setSubject(value);
                // Clear error when user starts typing
                if (errors.subject) setErrors({ ...errors, subject: "" });
              }}
              color="black"
              backgroundColor="white"
              style={[
                styles.textInput,
                errors.subject && styles.inputError,
              ]}
              editable={!isSubmitting}
              maxLength={100}
            />
            {errors.subject && (
              <Text style={styles.errorText}>{errors.subject}</Text>
            )}
            <Text style={styles.charCount}>
              {subject.length}/100 characters
            </Text>
          </View>

          {/* Feedback Message Input */}
          <View style={styles.inputGroup}>
            <TextInput
              placeholder={i18n.t("feedBack.enterFeedback")}
              value={feedBack}
              onChangeText={(value) => {
                setFeedBack(value);
                // Clear error when user starts typing
                if (errors.message) setErrors({ ...errors, message: "" });
              }}
              color="black"
              backgroundColor="white"
              style={[
                styles.textInput,
                { height: 120 },
                errors.message && styles.inputError,
              ]}
              multiline={true}
              numberOfLines={4}
              editable={!isSubmitting}
              maxLength={1000}
            />
            {errors.message && (
              <Text style={styles.errorText}>{errors.message}</Text>
            )}
            <Text style={styles.charCount}>
              {feedBack.length}/1000 characters
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.sendVerification,
              isSubmitting && styles.buttonDisabled,
            ]}
            onPress={sendVerification}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>
                {i18n.t("feedBack.submit")}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    // </ImageBackground>
  );
};

export default Contact;

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.9,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  widget: {
    backgroundColor: "rgba(114, 189, 121, 0.6)",
    marginHorizontal: 25,
    marginBottom: 25,
    padding: 20,
    borderRadius: 10,
    paddingBottom: 50,
  },
  inputGroup: {
    marginVertical: 10,
  },
  textInput: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: "white",
    color: "black",
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
    marginTop: 5,
  },
  charCount: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
    textAlign: "right",
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  sendVerification: {
    padding: 15,
    backgroundColor: "#27ae60",
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  otpText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
});
