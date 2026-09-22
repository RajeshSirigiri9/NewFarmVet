import { Dimensions } from "react-native";
import { ScrollView } from "react-native";
const { width, height } = Dimensions.get("window");
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

const organicList = [
  {
    id: 1,
    img: require("../../assets/images/organic1.jpeg"),
    description: "organicDairy.organicFarm",
  },
  {
    id: 2,
    img: require("../../assets/images/organic2.jpeg"),
    description: "organicDairy.gomutraCollectionOrganicFlooring",
  },
  {
    id: 3,
    img: require("../../assets/images/organic3.jpeg"),
    description: "organicDairy.animalShed",
  },
];

export default function OrganicDairy({ navigation }) {
  const [adminContent, setAdminContent] = useState([]);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const content = await getContentByLocation("cattle", "OrganicDairy");
      setAdminContent(content || []);
    } catch (error) {
      console.log("Error fetching content:", error.message);
      setAdminContent([]);
    }
  };

  const combinedData = [
    { id: "header", isAdmin: false, isHeader: true },
    ...adminContent.map((item) => ({ ...item, isAdmin: true })),
    ...organicList.map((item) => ({ ...item, isAdmin: false })),
  ];

  const renderListItem = ({ item }) => {
    if (item.isHeader) {
      return (
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <Text style={{ color: "#9a0202", fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
            {i18n.t("organicDairy.organicDairy")}
          </Text>
          <Text style={{ textAlign: "center", margin: 15, maxWidth: 340, fontWeight: "500" }}>
            <Text style={{ color: "#2d2121", fontSize: 16, fontWeight: "600" }}>
              {i18n.t("organicDairy.organicDairying")}
            </Text>
            {i18n.t("organicDairy.isAnEnvironmentalFriendlyMethod")}{" "}
            <Text style={{ color: "#2d2121", fontSize: 14, fontWeight: "700" }}>
              {i18n.t("organicDairy.sustainableEcologicallySound")}
            </Text>{" "}
            {i18n.t("organicDairy.productionSystem")}
          </Text>
        </View>
      );
    } else if (item.isAdmin) {
      const videoId = item.videoUrl ? extractYoutubeId(item.videoUrl) : null;
      return (
        <View style={{ alignItems: "center" }}>
          <View style={[styles.imageContainer, { justifyContent: "space-evenly" }]}>
            {item.imageUrl && (
              <Image
                source={{ uri: item.imageUrl }}
                style={{ width: "100%", height: 180, borderRadius: 5, marginBottom: 10 }}
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
        </View>
      );
    } else {
      return (
        <View style={{ alignItems: "center" }}>
          <View style={[styles.imageContainer, { justifyContent: "space-evenly" }]}>
            <View style={styles.imageHeader}>
              <Text style={styles.imageName}>{i18n.t(item.description)}</Text>
            </View>
            <Image
              source={item.img}
              style={{ width: "100%", height: 180, borderRadius: 5 }}
            />
          </View>
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
  rootScreen: { flex: 1 },
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal: 200,
    backgroundColor: "#cccac8",
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
