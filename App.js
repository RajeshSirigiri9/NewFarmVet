import "./localization/i18n";
import "./config"; // Initialize Firebase first
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Button, Alert, TouchableOpacity } from "react-native";
import { useState, useEffect, useContext, useCallback } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
          title: "Admin Panel",
          headerShown: true,
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
      const storedToken = await AsyncStorage.getItem("token");
      const storedUid = await AsyncStorage.getItem("uid");

      if (storedToken && storedUid) {
        authCtx.authenticate(storedToken, storedUid);
        
        // Restore user data from AsyncStorage
        try {
          const storedUserData = await AsyncStorage.getItem("userData");
          if (storedUserData) {
            authCtx.setUserData(JSON.parse(storedUserData));
          }
          
          const storedDisplayName = await AsyncStorage.getItem("displayName");
          if (storedDisplayName) {
            authCtx.LoginNameSetter(storedDisplayName);
          }
          
          const storedPhoneNumber = await AsyncStorage.getItem("phoneNumber");
          if (storedPhoneNumber) {
            authCtx.phoneNumberSetter(storedPhoneNumber);
          }
          
          const storedEmail = await AsyncStorage.getItem("userEmail");
          if (storedEmail) {
            authCtx.mailsetter(storedEmail);
          }
        } catch (error) {
          console.log("Error restoring user data:", error.message);
        }
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
    <>
      <StatusBar style="light" />
      {/* <ContextProvider> */}
      <LanguageProvider>
        <AuthContextProvider>
          <Root />
        </AuthContextProvider>
      </LanguageProvider>
      {/* </ContextProvider> */}
    </>
  );
}
