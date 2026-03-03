import React, { useContext, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Alert, View, Animated } from "react-native";
import { useTranslation } from "react-i18next";
import HamburgerButton from "../HamburgerButton";

import CustomDrawer from "../CustomDrawer";
import AboutUs from "../AboutUs";
import Animals from "../Animals";
import RecentWorks from "./RecentWorks";
import Publication from "../Publication";
import ResearchAreas from "../ResearchAreas";
import Teaching from "../Teaching.js";
import Extention from "./Extention";
import Byproducts from "./Byproducts";
import Technologies from "../Technologies.js";
import IndianHeritage from "../screens/IndianHeritage.js";
import FarmerHelpDesk from "../FarmerHelpDesk";
import Contact from "../Contact";
import FeedBack from "../FeedBack";
import Profile from "../Profile";
import Home from "./Welcome";
import UserContentScreen from "../UserContentScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import IconButton from "../uiCred/IconButton";
import { ContextProvider } from "../../store/Context";
import { AuthContext } from "../../store/auth-context";
import { useLanguage } from "../../store/LanguageProvider";

const Stack = createNativeStackNavigator();

function MyDrawer({ navigation }) {
  const { t } = useTranslation();
  const authCtx = useContext(AuthContext);
  const { toggleLanguage, language } = useLanguage();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  function handleLogOut() {
    Alert.alert(
      language === "te" ? "లాగ్ అవుట్" : "Logout",
      language === "te" ? "మీరు లాగ్ అవుట్ చేయాలనుకుంటున్నారా?" : "Are you sure want to log out?",
      [
        { text: language === "te" ? "లేదు" : "No", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
        { text: language === "te" ? "అవును" : "Yes", onPress: () => authCtx.logout() },
      ],
      { cancelable: false }
    );
  }

  return (
    <ContextProvider>
      <View style={{ flex: 1 }}>
        <CustomDrawer isVisible={isDrawerVisible} onClose={() => setIsDrawerVisible(false)} />
      <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: "#387849" },
            headerTintColor: "white",
            contentStyle: { backgroundColor: "#ccc4bf" },
            animation: "slide_from_right",
            presentationStyle: "card"
          }}
        >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: language === "te" ? " స్వాగతం" : "  Welcome",
            headerLeft: () => <HamburgerButton onPress={() => setIsDrawerVisible(true)} />,
            headerRight: ({ tintColor }) => (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8}}>
                <IconButton icon="language" color={tintColor} size={24} onPress={toggleLanguage} />
                  <MaterialCommunityIcons
                    name="bell-outline"
                    size={24}
                    color="#fff"
                    onPress={() => navigation.navigate("UserNotifications")}

                  />
                <IconButton icon="exit" color={tintColor} size={24} onPress={handleLogOut} />
              
              </View>
            ),
          }}
        />

        <Stack.Screen name="AboutUs" component={AboutUs} options={{ title: language === "te" ? "మా గురించి" : "About Us" }} />
        <Stack.Screen name="Animals" component={Animals} options={{ title: language === "te" ? "పశువులు" : "Animals" }} />
        <Stack.Screen name="RecentWorks" component={RecentWorks} options={{ title: language === "te" ? "ఇటీవలి రచనలు" : "Recent Works" }} />
        <Stack.Screen name="ResearchAreas" component={ResearchAreas} options={{ title: language === "te" ? "పరిశోధనా ప్రాంతాలు" : "Research Areas" }} />
        <Stack.Screen name="Byproducts" component={Byproducts} options={{ title: language === "te" ? "ఆవుల ఉప ఉత్పత్తులు" : "By products of Cow" }} />
        <Stack.Screen name="Technologies" component={Technologies} options={{ title: language === "te" ? "సాంకేతికతలు" : "Technologies" }} />
        <Stack.Screen name="Teaching" component={Teaching} options={{ title: language === "te" ? "బోధన" : "Teaching" }} />
        <Stack.Screen name="Extention" component={Extention} options={{ title: language === "te" ? "ఎక్సటెన్షన్" : "Extention" }} />
        <Stack.Screen name="IndianHeritage" component={IndianHeritage} options={{ title: language === "te" ? "భారతీయ వారసత్వం" : "Indian Heritage" }} />
        <Stack.Screen name="FarmerHelpDesk" component={FarmerHelpDesk} options={{ title: language === "te" ? "రైతుల హెల్ప‌డెస్క్" : "Farmer HelpDesk" }} />
        <Stack.Screen name="Publication" component={Publication} options={{ title: language === "te" ? "ప్రచురణలు" : "Publication" }} />
        <Stack.Screen name="FeedBack" component={FeedBack} options={{ title: language === "te" ? "ప్రతిస్పందన" : "FeedBack" }} />
        <Stack.Screen name="Contact" component={Contact} options={{ title: language === "te" ? "సంప్రదించండి" : "Contact Us" }} />
        <Stack.Screen name="Content" component={UserContentScreen} options={{ title: language === "te" ? "నోటిఫికేషన్లు" : "Notifications" }} />
        <Stack.Screen name="Profile" component={Profile} options={{ title: language === "te" ? "ప్రొఫైల్" : "Profile" }} />
      </Stack.Navigator>
      </View> 
    </ContextProvider>
  );
}

export default MyDrawer;
