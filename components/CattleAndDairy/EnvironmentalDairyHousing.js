import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { ScrollView } from "react-native-virtualized-view";
//import { Platform } from "react-native";


import React, { useState, useEffect } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import {

  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  Image,
} from "react-native";
import i18n from "../../localization/i18n";
import { getContentByLocation } from "../../util/adminService";
import { extractYoutubeId } from "../../util/contentHelper";
import YoutubePlayer from "react-native-youtube-iframe";

const environmentalList = [
  {
    id: 1,
    img: require("../../assets/images/environmental1.jpeg"),
    description: "",
  },
  {
    id: 2,
    img: require("../../assets/images/environmental2.jpeg"),
    description: "",
  },
  {
    id: 3,
    img: require("../../assets/images/environmental3.jpeg"),
    description: "",
  },
  {
    id: 4,
    img: require("../../assets/images/environmental4.jpeg"),
    description: "",
  },
  {
    id: 5,
    img: require("../../assets/images/environmental5.jpeg"),
    description: "",
  },
  {
    id: 6,
    img: require("../../assets/images/environmental6.jpeg"),
    description: "",
  },
  {
    id: 7,
    img: require("../../assets/images/environmental7.jpeg"),
    description: "",
  },
  {
    id: 8,
    img: require("../../assets/images/environmental8.jpeg"),
    description: "",
  },
];

export default function EnvironmentalDairyHousing({ navigation }) {
  return (
    <ScrollView
    // nestedScrollEnabled={true}
    // stickyHeaderIndices={[0]}
    // showsVerticalScrollIndicator={false}
    // style={styles.container}
    // horizontal={true}
    // vertical={true}
    >
      <View>
        <Text
          style={{
            color: "#9a0202",
            fontSize: 18,
            fontWeight: "bold",
            paddingTop: 16,
            textAlign: "center",
            backgroundColor: "#fff",
          }}
        >
          {i18n.t("environmentalDairyHousing.environmentalDairyHousing")}
          {"\n"} {i18n.t("environmentalDairyHousing.technologies")}
        </Text>
      </View>

      <View style={styles.screen}>
        <Text
          style={{
            // textAlign: "center",
            margin: 15,
            maxWidth: 340,
            fontWeight: "500",
          }}
        >
          <Text
            style={{
              color: "#0b0606",
              fontSize: 16,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            {i18n.t("environmentalDairyHousing.integratedApproach")}{" "}
          </Text>
          {
            <Text>
              {}
              {i18n.t("environmentalDairyHousing.wasMadeInTheModelProject")}
            </Text>
          }
          {"\n\n"}
          {i18n.t(
            "environmentalDairyHousing.theEnvironmentallyControlledDairyHousingModel"
          )}
          {"\n"}
          {i18n.t("environmentalDairyHousing.theVarious")}
          {"\n"} 1. {i18n.t("environmentalDairyHousing.freeStallSystem")}
          {"\n"} 2. {i18n.t("environmentalDairyHousing.rubberizedMattress")}
          {"\n"} 3. {i18n.t("environmentalDairyHousing.coolingPads")}
          {"\n"} 4. {i18n.t("environmentalDairyHousing.exhaustFans")}
          {"\n"} 5. {i18n.t("environmentalDairyHousing.automaticWaterers")}
          {"\n"} 6.{" "}
          {i18n.t(
            "environmentalDairyHousing.automaticConcentrateDispenserSystem"
          )}
          {"\n"} 7.{" "}
          {i18n.t(
            "environmentalDairyHousing.controlUnitContainingTemperatureSensor"
          )}
          {"\n"} 8.{" "}
          {i18n.t("environmentalDairyHousing.waterTankForRecirculation")}
          {"\n"} 9. {i18n.t("environmentalDairyHousing.drinkingWaterTank")}
          {"\n"} 10. {i18n.t("environmentalDairyHousing.feedBin")}
        </Text>

        <FlatList
          data={environmentalList}
          //numColumns={width > 400 ? 2 : 1}
          renderItem={({ item }) => (
            <View style={{ alignItems: "center" }}>
              <View style={styles.imageHeader}>
                <Text style={styles.imageName}>{item.description}</Text>
              </View>
              <View
                style={[
                  styles.imageContainer,
                  {
                    justifyContent: "space-evenly",
                  },
                ]}
              >
                <Image
                  source={item.img}
                  style={{ width: "100%", height: 180, borderRadius: 5 }}
                />
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  rootScreen: { flex: 1 },
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal: 200,
    backgroundColor: "white",
  },

  imageHeader: {
    // backgroundColor: "#b6b4b6",
    marginBottom: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  imageContainer: {
    marginHorizontal: 10,
    backgroundColor: "white",
    // padding: width < 890 ? 10 : 25,
    // height: 260,
    borderRadius: 5,
    marginBottom: 25,
    width: width < 890 ? 300 : 440,
    alignItems: "center",
    elevation: 4,
    overflow: "hidden" ,
    shadowColor: "black",
    shadowOpacity: 0.35,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 4,
  },

  imageName: {
    color: "#393838",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});

// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   StyleSheet,
//   Alert,
// } from "react-native";
// import React, { useRef, useState } from "react";
// import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";

// import { firebaseConfig } from "../config";
// import firebase from "firebase/compat/app";

// export const Otp = () => {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [code, setCode] = useState();
//   const [verificationId, setVerificationId] = useState(null);
//   const recaptchaVerifier = useRef(null);
//   const sendVerification = () => {
//     const phoneProvider = new firebase.auth.PhoneAuthProvider();
//     phoneProvider
//       .verifyPhoneNumber(phoneNumber, recaptchaVerifier.current)
//       .then(setVerificationId);
//     setPhoneNumber("");
//   };
//   const confirmCode = () => {
//     const credential = firebase.auth.PhoneAuthProvider.credential(
//       verificationId,
//       code
//     );
//     firebase
//       .auth()
//       .signInWithCredential(credential)
//       .then(() => {
//         setCode("");
//       })
//       .catch((error) => {
//         // show an alert in case of error
//       });
//   };

//   return (
//     <View style={styles.container}>
//       <FirebaseRecaptchaVerifierModal
//         firebaseConfig={firebaseConfig}
//         ref={recaptchaVerifier}
//       />
//       <Text style={styles.otpText}>I Login using OTP</Text>
//       <TextInput
//         placeholder="Phone Number With Country code"
//         onChangeText={setPhoneNumber}
//         keyboardType="phone-pad"
//         autoCompleteType="tel"
//       />
//       <TouchableOpacity
//         style={styles.sendVerification}
//         onPress={sendVerification}
//       >
//         <Text style={styles.buttonText}>Send verification</Text>
//       </TouchableOpacity>

//       <TextInput
//         placeholder="Phone Number With Country code"
//         onChangeText={setPhoneNumber}
//         keyboardType="phone-pad"
//         autoCompleteType="tel"
//         style={styles.textInput}
//       />
//       <TextInput
//         placeholder="Confirm Code"
//         onChangeText={setCode}
//         keyboardType="number-pad"
//         style={styles.textInput}
//       />
//       <TouchableOpacity style={styles.sendCode} onPress={confirmCode}>
//         <Text style={styles.buttonText}>Confirm verification</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   textInput: {
//     paddingTop: 40,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//     fontSize: 24,
//     borderBottomColor: "#fff",
//     // borderBottomwidth: 2,
//     marginBottom: 20,
//     textAlign: "center",
//     color: "#fff",
//   },
//   sendVerification: {
//     padding: 20,
//     backgroundColor: "#3498db",
//     borderRadius: 10,
//   },
//   sendCode: {
//     padding: 20,
//     backgroundColor: "#9b59b6",
//     borderRadius: 10,
//   },
//   buttonText: {
//     textAlign: "center",
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   otpText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#fff",
//     margin: 20,
//   },
// });
