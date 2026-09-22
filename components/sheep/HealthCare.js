import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

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

// "healthCare": {
//   "timelyVaccination": "మేకకు సకాలంలో టీకాలు వేయడం",
//   "vaccinationWithSterilizedNeedle": "స్టెరిలైజ్డ్ సూదితో టీకాలు వేయడం",
//   "dippingTank": "డిప్పింగ్ ట్యాంక్",
//   "dipSolutionForDippingOfSheep": "గొర్రెలను ముంచడానికి డిప్ సొల్యూషన్",
//   "standingPen": "స్టాండింగ్ పెన్",
//   "dippingTankProper": "డిప్పింగ్ ట్యాంక్ ప్రాపర్",
//   "drainingPen": "డ్రెయినింగ్ పెన్",
//   "sprayingForTickController": "టిక్ కంట్రోలర్ కోసం స్ప్రేయింగ్",
//   "dewormingAndDeticking": "నులిపురుగుల నిర్మూలన మరియు నివారణ",
//   "healthCare": "గొర్రెల ఆరోగ్య సంరక్షణను",
//   "healthCareDescription": "సరైన నులిపురుగుల నిర్మూలన మరియు నివారణ ద్వారా జాగ్రత్తగా చూసుకోవచ్చు. గొర్రెల మంద యొక్క నులిపురుగుల నిర్మూలన అయితే, సరైన మోతాదు మరియు మందు రకం చాలా ముఖ్యం. తక్కువ మోతాదు మరియు అధిక మోతాదు తీసుకోవడం మరింత హానికరం. మందు ఎంపిక మరియు మోతాదు గురించి పశువైద్యుని సలహా తప్పనిసరిగా తీసుకోండి. ఈ క్రింది పద్ధతులు మంద యొక్క ఆరోగ్యం మరియు ఉత్పత్తిని నిర్వహించడంలో సహాయపడతాయి."
// },

const healthList = [
  {
    id: 1,
    img: require("../../assets/images/health1.jpeg"),
    description: "healthCare.timelyVaccination",
  },
  {
    id: 2,
    img: require("../../assets/images/health2.jpeg"),
    description: "healthCare.vaccinationWithSterilizedNeedle",
  },
  {
    id: 3,
    img: require("../../assets/images/health3.jpeg"),
    description: "healthCare.dippingTank",
  },
  {
    id: 4,
    img: require("../../assets/images/health4.jpeg"),
    description: "healthCare.dipSolutionForDippingOfSheep",
  },
  {
    id: 5,
    img: require("../../assets/images/health5.jpeg"),
    description: "healthCare.standingPen",
  },
  {
    id: 6,
    img: require("../../assets/images/health6.jpeg"),
    description: "healthCare.dippingTankProper",
  },
  {
    id: 7,
    img: require("../../assets/images/health7.jpeg"),
    description: "healthCare.drainingPen",
  },
  {
    id: 8,
    img: require("../../assets/images/health8.jpeg"),
    description: "healthCare.sprayingForTickController",
  },
];

export default function HealthCare({ navigation }) {
  const [adminContent, setAdminContent] = useState([]);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const content = await getContentByLocation("sheep", "HealthCare");
      setAdminContent(content || []);
    } catch (error) {
      console.log("Error fetching content:", error.message);
      setAdminContent([]);
    }
  };

  const combinedData = [
    { id: "header", isAdmin: false, isHeader: true },
    ...adminContent.map((item) => ({ ...item, isAdmin: true })),
    ...healthList.map((item) => ({ ...item, isAdmin: false })),
  ];

  const renderListItem = ({ item }) => {
    if (item.isHeader) {
      return (
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <Text style={{ color: "#9a0202", fontSize: 18, fontWeight: "bold", marginTop: 6 }}>
            {i18n.t("healthCare.dewormingAndDeticking")}
          </Text>
          <Text style={{ textAlign: "center", margin: 15, maxWidth: 340, fontWeight: "500" }}>
            <Text style={{ color: "#2c2525", fontSize: 16, fontWeight: "bold" }}>
              {i18n.t("healthCare.healthCare")}{" "}
            </Text>
            {i18n.t("healthCare.healthCareDescription")}
          </Text>
        </View>
      );
    } else if (item.isAdmin) {
      const videoId = item.videoUrl ? extractYoutubeId(item.videoUrl) : null;
      return (
        <View style={styles.imageContainer}>
          {item.imageUrl && (
            <Image
              source={{ uri: item.imageUrl }}
              style={{ width: "90%", height: 180, borderRadius: 5, marginBottom: 10 }}
              resizeMode="cover"
            />
          )}
          <View style={styles.imageHeader}>
            <Text style={styles.imageName}>{item.title}</Text>
          </View>
          <Text style={{ padding: 10, fontSize: 12, color: "#555", textAlign: "center" }}>
            {item.description}
          </Text>
          {videoId && (
            <YoutubePlayer
              height={210}
              width={300}
              play={playing}
              videoId={videoId}
              onChangeState={(state) => {
                if (state === "ended") {
                  setPlaying(false);
                }
              }}
            />
          )}
        </View>
      );
    } else {
      return (
        <View style={styles.imageContainer}>
          <View style={styles.imageHeader}>
            <Text style={styles.imageName}>{i18n.t(item.description)}</Text>
          </View>
          <Image source={item.img} style={{ width: "90%", height: 180 }} />
        </View>
      );
    }
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={combinedData}
        renderItem={renderListItem}
        keyExtractor={(item, index) => item.id || `admin-${index}`}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },

  imageHeader: {
    backgroundColor: "#5c995e",
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
  imageContainer: {
    backgroundColor: "#5c995e",
    padding: width < 890 ? 10 : 25,
    height: 260,
    borderRadius: 5,
    marginBottom: 25,
    width: width < 890 ? 360 : 440,
    alignItems: "center",
  },
  imageName: {
    color: "#f6f4f4",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
