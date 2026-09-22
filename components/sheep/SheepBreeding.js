import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

import React, { cloneElement, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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

const sheepList = [
  {
    id: 1,
    img: require("../../assets/images/sheep2.jpeg"),
    description: "sheepBreeding.apron",
  },
  {
    id: 2,
    img: require("../../assets/images/sheep3.jpeg"),
    description: "sheepBreeding.tryingOfApron",
  },
  {
    id: 3,
    img: require("../../assets/images/sheep4.jpeg"),
    description: "sheepBreeding.apronRam",
  },
  {
    id: 4,
    img: require("../../assets/images/sheep5.jpeg"),
    description: "sheepBreeding.breathPaintingOfApronedRam",
  },
  {
    id: 5,
    img: require("../../assets/images/sheep6.jpeg"),
    description: "sheepBreeding.detectionOfEweInHeatByRam",
  },
  {
    id: 6,
    img: require("../../assets/images/sheep7.jpeg"),
    description: "sheepBreeding.eweInHeatWithBackPainted",
  },
  {
    id: 7,
    img: require("../../assets/images/sheep8.jpeg"),
    description: "sheepBreeding.leadingRamInFlockForHeatDetection",
  },
  {
    id: 8,
    img: require("../../assets/images/sheep9.jpeg"),
    description: "sheepBreeding.handMating",
  },
];

export default function SheepBreeding({ navigation }) {
  const [adminContent, setAdminContent] = useState([]);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const content = await getContentByLocation("sheep", "SheepBreeding");
      setAdminContent(content || []);
    } catch (error) {
      console.log("Error fetching content:", error.message);
      setAdminContent([]);
    }
  };

  const combinedData = [
    { id: "header", isAdmin: false, isHeader: true },
    ...adminContent.map((item) => ({ ...item, isAdmin: true })),
    ...sheepList.map((item) => ({ ...item, isAdmin: false })),
  ];

  const renderListItem = ({ item }) => {
    if (item.isHeader) {
      return (
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <Text
            style={{
              color: "#9a0202",
              fontSize: 18,
              fontWeight: "bold",
              marginTop: 16,
            }}
          >
            {i18n.t("sheepBreeding.sheepBreedingAndHeatDetection")}
          </Text>
          <Text
            style={{
              textAlign: "center",
              margin: 15,
              maxWidth: 340,
              fontWeight: "500",
            }}
          >
            {i18n.t("sheepBreeding.sheep")}
          </Text>
        </View>
      );
    } else if (item.isAdmin) {
      const videoId = item.videoUrl ? extractYoutubeId(item.videoUrl) : null;
      return (
        <View style={{ alignItems: "center" }}>
          <View style={styles.imageHeader}>
            <Text style={styles.imageName}>{item.title}</Text>
          </View>
          <View
            style={[styles.imageContainer, { justifyContent: "space-evenly" }]}
          >
            {item.imageUrl && (
              <Image
                source={{ uri: item.imageUrl }}
                style={{
                  width: "100%",
                  height: 180,
                  borderRadius: 5,
                  marginBottom: 10,
                }}
                resizeMode="cover"
              />
            )}
            <Text
              style={{
                padding: 10,
                fontSize: 12,
                color: "#555",
                textAlign: "center",
              }}
            >
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
          <View style={styles.imageHeader}>
            <Text style={styles.imageName}>{i18n.t(item.description)}</Text>
          </View>
          <View
            style={[styles.imageContainer, { justifyContent: "space-evenly" }]}
          >
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
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },

  videoHeader: {
    backgroundColor: "#948181",
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
  videoContainer: {
    backgroundColor: "#948181",
    padding: width < 890 ? 10 : 25,
    height: 270,
    borderRadius: 5,
    marginBottom: 25,
    width: width < 890 ? 360 : 440,
    alignItems: "center",
  },
  videoName: {
    color: "#f6f4f4",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageHeader: {
    marginBottom: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  imageContainer: {
    marginHorizontal: 10,
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: 25,
    width: width < 890 ? 300 : 440,
    alignItems: "center",
    elevation: 4,
    overflow: "hidden",
    shadowColor: "#9b0e7e",
    shadowOpacity: 0.45,
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
