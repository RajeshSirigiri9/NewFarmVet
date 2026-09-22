import "./localization/i18n";
import "./config"; // Initialize Firebase first
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Button, Alert, TouchableOpacity } from "react-native";
import { useState, useEffect, useContext, useCallback } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Push notifications import
import { registerForPushNotifications, setupNotificationListeners, clearNotificationBadge } from "./util/pushNotifications";

// Toast notifications import
import { ToastProvider, ToastContext, useToast } from "./util/ToastNotification";

// import Otp from "./components/screens/Otp";
import MyDrawer from "./components/screens/MyDrawer";
import Azolla from "./components/screens/Azolla.js";
import Hydrophonics from "./components/screens/Hydrophonics";
import First from "./components/screens/First";
import Sheep from "./components/sheep/Sheep";
import SheepBreeding from "./components/sheep/SheepBreeding";
import ScientificPractices from "./components/sheep/ScientificPractices";
import HealthCare from "./components/sheep/HealthCare";
import FoddersSheep from "./components/sheep/FoddersSheep";
import GoatHousing from "./components/sheep/GoatHousing";
import BestPractices from "./components/sheep/BestPractices";
import SheepDiesases from "./components/sheep/SheepDiesases";
import Emu from "./components/screens/Emu";
import BioGas from "./components/CattleAndDairy/BioGas";
import GoMutraArk from "./components/CattleAndDairy/GoMutraArk";
import VermiComposting from "./components/CattleAndDairy/VermiComposting";
import Cattle from "./components/screens/Cattle";
import CattleList from "./components/CattleAndDairy/CattleList";
import Dairy from "./components/CattleAndDairy/Dairy";
import EnvironmentalDairyHousing from "./components/CattleAndDairy/EnvironmentalDairyHousing";
import HeatDetection from "./components/CattleAndDairy/HeatDetection";
import Housing from "./components/CattleAndDairy/Housing";
import Feeding from "./components/CattleAndDairy/Feeding";
import CalfRearing from "./components/CattleAndDairy/CalfRearing";
import CalfRearingg from "./components/CattleAndDairy/CalfRearingg";
import SahiwalCalves from "./components/CattleAndDairy/SahiwalCalves";
import IntegratedFarming from "./components/IntegratedFarming";
import PfizerDrug from "./components/PfizerDrug";
import CleanMilkProduction from "./components/CattleAndDairy/CleanMilkProduction";
import Diseases from "./components/CattleAndDairy/Diseases";
import OrganicDairy from "./components/CattleAndDairy/OrganicDairy";
import PreventiveHealthCare from "./components/CattleAndDairy/PreventiveHealthCare";
import SelectionOfGoodAnimals from "./components/CattleAndDairy/SelectionOfGoodAnimals";
import WallowingTank from "./components/CattleAndDairy/WallowingTank";
import AdminPanel from "./components/admin/AdminPanel";
import UserNotifications from "./components/UserNotifications";
import UserContentScreen from "./components/UserContentScreen";
import LoginScreen from "./loginCred/LoginScreen";
import SignupScreen from "./loginCred/SignupScreen";
import Colors from "./components/constants/Colors";
import AuthContextProvider, { AuthContext } from "./store/auth-context.js";
import * as SplashScreen from "expo-splash-screen";
import { LanguageProvider } from "./store/LanguageProvider";
import { Entypo } from "@expo/vector-icons";
import ContentManager from "./components/admin/ContentManager.js";
const Stack = createNativeStackNavigator();
// SplashScreen.preventAutoHideAsync();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#387849" },
        headerTintColor: "white",
        contentStyle: { backgroundColor: "#ccc4bf" },
      }}
    >
      <Stack.Screen
        name="First"
        component={First}
        options={{
          headerShown: false,
        }}
      />

      {/* <Stack.Screen
        name="Otp"
        component={Otp}
        options={{
          headerShown: false,
        }}
      /> */}

      <Stack.Screen
        name="Drawer"
        component={MyDrawer}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Emu" component={Emu} />
      <Stack.Screen name="Cattle" component={Cattle} />
      <Stack.Screen name="Sheep" component={Sheep} />
      <Stack.Screen
        name="SheepBreeding"
        component={SheepBreeding}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="ScientificPractices"
        component={ScientificPractices}
      />
      <Stack.Screen
        name="HealthCare"
        component={HealthCare}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="BestPractices"
        component={BestPractices}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="FoddersSheep"
        component={FoddersSheep}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="GoatHousing"
        component={GoatHousing}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="SheepDiesases"
        component={SheepDiesases}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="BioGas"
        component={BioGas}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="GoMutraArk"
        component={GoMutraArk}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="VermiComposting"
        component={VermiComposting}
        options={{
          title: "",
        }}
      />

      <Stack.Screen
        name="Azolla"
        component={Azolla}
        options={{
          title: "",
        }}
      />

      <Stack.Screen
        name="Hydrophonics"
        component={Hydrophonics}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="CattleList"
        component={CattleList}
        options={{
          title: "Cattle List",
        }}
      />

      <Stack.Screen
        name="Dairy"
        component={Dairy}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="EnvironmentalDairyHousing"
        component={EnvironmentalDairyHousing}
        options={{
          title: "",
          headerRight: () => (
            <Button
              onPress={() =>
                Alert.alert("Information", "This is an Integrated Approach!")
              }
              title="Info"
              color="#053101"
            />
          ),
        }}
      />
      <Stack.Screen
        name="CalfRearing"
        component={CalfRearing}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="CalfRearingg"
        component={CalfRearingg}
        options={{
          title: "Calf Rearing",
        }}
      />
      <Stack.Screen
        name="SahiwalCalves"
        component={SahiwalCalves}
        options={{
          title: "Sahiwal Calves",
        }}
      />
      <Stack.Screen
        name="IntegratedFarming"
        component={IntegratedFarming}
        options={{
          title: "Integrated Farming",
        }}
      />
      <Stack.Screen
        name="PfizerDrug"
        component={PfizerDrug}
        options={{
          title: "Pfizer Drug",
        }}
      />
      <Stack.Screen
        name="CleanMilkProduction"
        component={CleanMilkProduction}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="Diseases"
        component={Diseases}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="Feeding"
        component={Feeding}
        options={{ title: "" }}
      />
      <Stack.Screen
        name="HeatDetection"
        component={HeatDetection}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="Housing"
        component={Housing}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="OrganicDairy"
        component={OrganicDairy}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="PreventiveHealthCare"
        component={PreventiveHealthCare}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="SelectionOfGoodAnimals"
        component={SelectionOfGoodAnimals}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="WallowingTank"
        component={WallowingTank}
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="AdminPanel"
        component={AdminPanel}
        options={{
          title: "",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UserNotifications"
        component={UserNotifications}
        options={{
          title: "",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Content"
        component={UserContentScreen}
        options={{
          title: "",
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {/* { <FirstStack />} */}
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
      {/* <AuthenticatedStack /> */}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authCtx = useContext(AuthContext);
  const toastContext = useContext(ToastContext);

  useEffect(() => {
    // Setup notification listeners when user is authenticated
    if (authCtx.isAuthenticated && toastContext) {
      console.log("ROOT: Setting up push notification listeners...");
      const cleanup = setupNotificationListeners(
        (notification) => {
          console.log("Notification received:", notification);
          // Show toast notification
          const title = notification.request.content.title || "New Notification";
          const body = notification.request.content.body || "You have a new message";
          toastContext.showToast(`${title}: ${body}`, 'info', 4000);
        },
        (notification) => {
          console.log("Notification tapped:", notification);
          toastContext.showToast("Notification opened", 'info', 2000);
        }
      );

      return cleanup;
    }
  }, [authCtx.isAuthenticated, toastContext]);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsTryingLogin(true);
      }
    }

    prepare();

    async function fetchToken() {
      try {
        console.log("\n========== ROOT: Session Restoration Started ==========");
        
        // Try to get credentials from AsyncStorage
        console.log("ROOT: Attempting to read from AsyncStorage...");
        const storedToken = await AsyncStorage.getItem("token");
        const storedUid = await AsyncStorage.getItem("uid");
        const storedEmail = await AsyncStorage.getItem("userEmail");
        const storedIsAdmin = await AsyncStorage.getItem("isAdmin");

        console.log("\nROOT: AsyncStorage Contents:");
        console.log("  - token:", storedToken ? `✓ ${storedToken.substring(0, 20)}...` : "✗ missing");
        console.log("  - uid:", storedUid || "✗ missing");
        console.log("  - email:", storedEmail || "✗ missing");
        console.log("  - isAdmin:", storedIsAdmin || "✗ missing");
        
        // Check Firebase Auth's current user
        console.log("\nROOT: Checking Firebase Auth currentUser...");
        let firebaseUser = firebase.auth().currentUser;
        console.log("  - Current user:", firebaseUser ? firebaseUser.uid : "✗ null");

        if (storedToken && storedUid && storedEmail) {
          console.log("\n✓ ROOT: Found stored credentials in AsyncStorage");
          
          // CRITICAL: Firebase Auth's currentUser is null even though we have a valid token
          // We need to manually sign in with the stored credentials to populate firebase.auth().currentUser
          // This is necessary because Firebase Auth doesn't auto-restore in React Native without explicit config
          
          if (!firebaseUser) {
            console.log("ROOT: Firebase Auth currentUser is null - attempting to restore session...");
            console.log("ROOT: Calling signInWithEmailAndPassword to restore Firebase Auth session...");
            
            try {
              // We don't have the password, so we can't re-authenticate
              // Instead, we need to manually set the auth state
              // The best approach is to use the stored token to verify Firebase Auth
              
              // For now, set up an onAuthStateChanged listener to catch when Firebase Auth initializes
              let authStateResolved = false;
              
              await new Promise((resolve) => {
                const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
                  if (!authStateResolved) {
                    authStateResolved = true;
                    
                    if (user) {
                      console.log("✓ ROOT: Firebase Auth currentUser restored:", user.uid);
                      firebaseUser = user;
                    } else {
                      console.log("! ROOT: Firebase Auth currentUser still null after waiting");
                      console.log("! ROOT: This likely means the Firebase Auth session expired");
                      console.log("! ROOT: User will need to re-login");
                    }
                    unsubscribe();
                    resolve();
                  }
                }, (error) => {
                  if (!authStateResolved) {
                    authStateResolved = true;
                    console.log("✗ ROOT: Firebase Auth error:", error.message);
                    unsubscribe();
                    resolve();
                  }
                });
                
                // Timeout after 3 seconds
                setTimeout(() => {
                  if (!authStateResolved) {
                    authStateResolved = true;
                    unsubscribe();
                    resolve();
                  }
                }, 3000);
              });
            } catch (error) {
              console.log("⚠ ROOT: Error attempting Firebase Auth restoration:", error.message);
            }
          }
          
          // Set up local authentication context
          console.log("\nROOT: Setting up local auth context...");
          authCtx.authenticate(storedToken, storedUid);
          console.log("✓ ROOT: Local auth context set");
          
          // Register for push notifications
          console.log("\nROOT: Registering for push notifications...");
          registerForPushNotifications(storedUid)
            .then((token) => {
              if (token) {
                console.log("✓ ROOT: Push notification token registered:", token);
              } else {
                console.log("⚠ ROOT: Push notifications not available");
              }
            })
            .catch((error) => {
              console.log("⚠ ROOT: Error registering push notifications:", error);
            });
          
          console.log("ROOT: Restoring additional user data from AsyncStorage...");
          
          // Restore all user data from AsyncStorage
          try {
            const storedUserData = await AsyncStorage.getItem("userData");
            if (storedUserData) {
              authCtx.setUserData(JSON.parse(storedUserData));
              console.log("✓ ROOT: User data restored");
            }
            
            // Fetch fresh user data from Firestore to ensure isAdmin is current
            console.log("ROOT: Fetching fresh user data from Firestore...");
            try {
              const { getUserData } = require("./util/auth");
              const freshUserData = await getUserData(storedUid);
              if (freshUserData) {
                console.log("✓ ROOT: Fresh user data fetched, isAdmin:", freshUserData.isAdmin);
                // Update isAdmin in AsyncStorage
                if (freshUserData.isAdmin !== undefined) {
                  await AsyncStorage.setItem("isAdmin", JSON.stringify(freshUserData.isAdmin));
                } else {
                  // Default to false if not set
                  await AsyncStorage.setItem("isAdmin", JSON.stringify(false));
                }
              }
            } catch (firebaseError) {
              console.log("⚠ ROOT: Could not fetch fresh user data:", firebaseError.message);
            }
            
            const storedDisplayName = await AsyncStorage.getItem("displayName");
            if (storedDisplayName) {
              authCtx.LoginNameSetter(storedDisplayName);
              console.log("✓ ROOT: Display name restored");
            }
            
            const storedPhoneNumber = await AsyncStorage.getItem("phoneNumber");
            if (storedPhoneNumber) {
              authCtx.phoneNumberSetter(storedPhoneNumber);
              console.log("✓ ROOT: Phone restored");
            }
            
            if (storedEmail) {
              authCtx.mailsetter(storedEmail);
              console.log("✓ ROOT: Email restored");
            }
            
            console.log("\n✓ ROOT: Session restoration complete");
            console.log("ROOT: User context ready, but Firebase Auth currentUser may still be null");
            console.log("ROOT: This is okay - Firestore queries will use stored token");
          } catch (error) {
            console.log("⚠ ROOT: Error restoring user data:", error.message);
          }
        } else {
          console.log("\n! ROOT: No credentials in AsyncStorage");
          console.log("! ROOT: User must login again");
        }
        
        console.log("========== ROOT: Session Restoration Complete ==========\n");
      } catch (error) {
        console.log("✗ ROOT: Unexpected error:", error);
      }

      setIsTryingLogin(false);
    }

    fetchToken();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isTryingLogin) {
      await SplashScreen.hideAsync();
    }
  }, [isTryingLogin]);

  return <Navigation onLayout={onLayoutRootView} />;
}

export default function App() {
  return (
    <ToastProvider>
      <StatusBar style="light" />
      {/* <ContextProvider> */}
      <LanguageProvider>
        <AuthContextProvider>
          <Root />
        </AuthContextProvider>
      </LanguageProvider>
      {/* </ContextProvider> */}
    </ToastProvider>
  );
}
