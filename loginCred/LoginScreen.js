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
      const response = await login(email, password);
      
      // Set authentication first
      authCtx.authenticate(response.idToken, response.uid);
      authCtx.mailsetter(email);
      
      // Try to fetch user data but don't block if it fails
      try {
        const userData = await getUserData(response.uid);
        console.log("Fetched user data from Firestore:", userData);
        if (userData) {
          authCtx.setUserData(userData);
          // Store userData in AsyncStorage for persistence
          await AsyncStorage.setItem("userData", JSON.stringify(userData));
          
          if (userData.phoneNumber) {
            authCtx.phoneNumberSetter(userData.phoneNumber);
            await AsyncStorage.setItem("phoneNumber", userData.phoneNumber);
          }
          if (userData.displayName) {
            authCtx.LoginNameSetter(userData.displayName);
            await AsyncStorage.setItem("displayName", userData.displayName);
          }
          if (userData.email) {
            await AsyncStorage.setItem("userEmail", userData.email);
          }
        }
      } catch (userDataError) {
        console.log("Could not fetch user data:", userDataError.message);
        // Continue anyway - user data will be empty but user is logged in
      }
      
    } catch (error) {
      console.log("Login error:", error.message);
      
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
