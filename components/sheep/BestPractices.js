import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

import React, { cloneElement, useState, useEffect } from "react";
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

const practiceList = [
  {
    id: 1,
    img: require("../../assets/images/practice1.jpeg"),
    description: "bestPractices.adequateFeeding",
  },
  {
    id: 2,
    img: require("../../assets/images/practice2.jpeg"),
    description: "bestPractices.wateringAtAllTimings",
  },
  {
    id: 3,
    img: require("../../assets/images/practice3.jpeg"),
    description: "bestPractices.creepFeeding",
  },
  {
    id: 4,
    img: require("../../assets/images/practice4.jpeg"),
    description: "bestPractices.grazing",
  },
  {
    id: 5,
    img: require("../../assets/images/practice5.jpeg"),
    description: "bestPractices.groupFeeding",
  },
  {
    id: 6,
    img: require("../../assets/images/practice6.jpeg"),
    description: "bestPractices.raisedFloorSystem",
  },
  {
    id: 7,
    img: require("../../assets/images/practice7.jpeg"),
    description: "bestPractices.semiIntensiveManagement",
  },
  {
    id: 8,
    img: require("../../assets/images/practice8.jpeg"),
    description: "bestPractices.stagnantWater",
  },
];

export default function BestPractices({ navigation }) {
  const [adminContent, setAdminContent] = useState([]);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const content = await getContentByLocation("sheep", "BestPractices");
      setAdminContent(content || []);
    } catch (error) {
      console.log("Error fetching content:", error.message);
      setAdminContent([]);
    }
  };

  const combinedData = [
    { id: "header", isAdmin: false, isHeader: true },
    ...adminContent.map((item) => ({ ...item, isAdmin: true })),
    ...practiceList.map((item) => ({ ...item, isAdmin: false })),
  ];

  const renderListItem = ({ item }) => {
    if (item.isHeader) {
      return (
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <Text style={{ color: "#9a0202", fontSize: 16, fontWeight: "bold", marginTop: 6 }}>
            {i18n.t("bestPractices.bestManagementPractices")}
          </Text>
          <Text style={{ textAlign: "center", margin: 15, maxWidth: 340, fontWeight: "500" }}>
            {i18n.t("bestPractices.bestManagementPracticesDescription")}
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
              style={{ width: "90%", height: 200, borderRadius: 5, marginBottom: 10 }}
              resizeMode="cover"
            />
          )}
          <View style={styles.imageHeader}>
            <Text style={styles.imageDescription}>{item.title}</Text>
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
            <Text style={styles.imageDescription}>
              {i18n.t(item.description)}
            </Text>
          </View>
          <Image source={item.img} style={{ width: "90%", height: 200 }} />
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
    backgroundColor: "#948181",
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
  imageContainer: {
    backgroundColor: "#948181",
    padding: width < 890 ? 10 : 25,
    height: 280,
    borderRadius: 5,
    marginBottom: 25,
    width: width < 890 ? 360 : 440,
    alignItems: "center",
  },
  imageDescription: {
    color: "#f6f4f4",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
