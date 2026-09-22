import { useContext, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../ui/LoadingOverlay";
import { AuthContext } from "../store/auth-context";
import { login, getUserData } from "../util/auth";

function LoginScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      console.log("\n========== LOGIN: Starting login process ==========");
      console.log("LOGIN: Email:", email);
      
      const response = await login(email, password);
      console.log("LOGIN: Got response from auth.login()");
      console.log("LOGIN: Response keys:", Object.keys(response));
      console.log("LOGIN: idToken:", response.idToken ? `✓ ${response.idToken.substring(0, 20)}...` : "✗ missing");
      console.log("LOGIN: uid:", response.uid);
      
      // Set authentication - this should save token and uid to AsyncStorage
      console.log("\nLOGIN: Calling authCtx.authenticate()...");
      authCtx.authenticate(response.idToken, response.uid);
      console.log("✓ LOGIN: authenticate() called");
      
      // Verify it was saved to AsyncStorage
      const savedToken = await AsyncStorage.getItem("token");
      const savedUid = await AsyncStorage.getItem("uid");
      console.log("LOGIN: Verification - token saved:", savedToken ? "✓" : "✗");
      console.log("LOGIN: Verification - uid saved:", savedUid ? "✓" : "✗");
      
      authCtx.mailsetter(email);
      
      // Try to fetch user data but don't block if it fails
      try {
        console.log("\nLOGIN: Fetching user data from Firestore...");
        const userData = await getUserData(response.uid);
        console.log("LOGIN: Fetched user data:", userData ? "✓" : "✗");
        
        if (userData) {
          authCtx.setUserData(userData);
          // Store userData in AsyncStorage for persistence
          await AsyncStorage.setItem("userData", JSON.stringify(userData));
          console.log("✓ LOGIN: Stored userData to AsyncStorage, isAdmin:", userData.isAdmin);
          
          // Store isAdmin separately for quick access
          if (userData.isAdmin !== undefined) {
            await AsyncStorage.setItem("isAdmin", JSON.stringify(userData.isAdmin));
            console.log("✓ LOGIN: Stored isAdmin to AsyncStorage:", userData.isAdmin);
          }
          
          if (userData.phoneNumber) {
            authCtx.phoneNumberSetter(userData.phoneNumber);
            await AsyncStorage.setItem("phoneNumber", userData.phoneNumber);
            console.log("✓ LOGIN: Stored phoneNumber");
          }
          if (userData.displayName) {
            authCtx.LoginNameSetter(userData.displayName);
            await AsyncStorage.setItem("displayName", userData.displayName);
            console.log("✓ LOGIN: Stored displayName");
          }
          if (userData.email) {
            await AsyncStorage.setItem("userEmail", userData.email);
            console.log("✓ LOGIN: Stored userEmail");
          }
        }
      } catch (userDataError) {
        console.log("⚠ LOGIN: Could not fetch user data:", userDataError.message);
        // Continue anyway - user data will be empty but user is logged in
      }
      
      console.log("========== LOGIN: Complete - User should be logged in ==========\n");
      
    } catch (error) {
      console.log("\n✗ LOGIN ERROR:", error.message);
      console.log("Error type:", error.code || "unknown");
      
      let errorTitle = "Login Failed";
      let errorMessage = error.message;
      
      // Handle specific Firebase errors
      if (error.message.includes("user-not-found")) {
        errorTitle = "User Not Found";
        errorMessage = "No account found with this email.\n\nPlease 'Sign up' to create a new account.";
      } else if (error.message.includes("wrong-password") || error.message.includes("invalid-credential")) {
        errorTitle = "Incorrect Email or Password";
        errorMessage = "The email or password you entered is incorrect.\n\nPlease try again or use 'Forgot Password' to reset it.";
      } else if (error.message.includes("invalid-email")) {
        errorTitle = "Invalid Email";
        errorMessage = "Please enter a valid email address.";
      } else if (error.message.includes("too-many-requests")) {
        errorTitle = "Too Many Login Attempts";
        errorMessage = "Your account has been temporarily locked.\n\nPlease try again later or reset your password.";
      }
      
      Alert.alert(errorTitle, errorMessage);
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging you in..." />;
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
