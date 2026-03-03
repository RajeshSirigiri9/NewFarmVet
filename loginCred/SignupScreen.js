import { useState, useContext } from "react";
import { Alert } from "react-native";

import AuthContent from "../components/Auth/AuthContent.js";
import LoadingOverlay from "../ui/LoadingOverlay";
import { createUser } from "../util/auth";
import { AuthContext } from "../store/auth-context.js";

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authCtx = useContext(AuthContext);

  async function signupHandler({ email, password, name, phone }) {
    setIsAuthenticating(true);
    try {
      console.log("=== SIGNUP START ===");
      console.log("Form data received:", { email, password: "***", name, phone });
      
      const data = await createUser(email, password, name, phone);
      console.log("User created in Firebase Auth, returned data:", data);
      
      // Prepare userData object
      const userDataObj = {
        uid: data.uid,
        email: data.email,
        createdAt: new Date(),
        displayName: name || "",
        phoneNumber: phone || "",
      };
      console.log("Setting userData in context:", userDataObj);
      
      // Set user data and token to trigger navigation
      authCtx.setUserData(userDataObj);
      authCtx.mailsetter(data.email);
      authCtx.phoneNumberSetter(phone || "");
      authCtx.LoginNameSetter(name || "");
      authCtx.authenticate(data.idToken, data.uid);
      console.log("=== SIGNUP COMPLETE, Authenticating ===");
      
    } catch (error) {
      console.log("=== SIGNUP ERROR ===", error.message);
      
      let errorTitle = "Authentication failed";
      let errorMessage = error.message;
      
      // Handle specific Firebase errors
      if (error.message.includes("email-already-in-use")) {
        errorTitle = "Email Already Registered";
        errorMessage = "This email is already registered.\n\nPlease use 'Login' to access your account or use a different email to create a new account.";
      } else if (error.message.includes("weak-password")) {
        errorTitle = "Weak Password";
        errorMessage = "Password should be at least 6 characters long.";
      } else if (error.message.includes("invalid-email")) {
        errorTitle = "Invalid Email";
        errorMessage = "Please enter a valid email address.";
      }
      
      Alert.alert(errorTitle, errorMessage);
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user..." />;
  }

  return <AuthContent onAuthenticate={signupHandler} />;
}

export default SignupScreen;
