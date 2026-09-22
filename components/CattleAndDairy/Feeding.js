import { Dimensions } from "react-native";
import { ScrollView } from "react-native";
const { width, height } = Dimensions.get("window");
//import { Platform } from "react-native";

import React, { useCallback, useState, useEffect } from "react";
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

const FeedingList = [
  {
    id: 1,
    img: require("../../assets/images/Feeding1.jpeg"),
    description: "feeding.wateringOfAnimals",
  },
  {
    id: 2,
    img: require("../../assets/images/Feeding2.jpeg"),
    description: "feeding.greenFodderOnTheBunds",
  },

  {
    id: 4,
    img: require("../../assets/images/Feeding4.jpeg"),
    description: "feeding.chaffedGreenMaizeFodder",
  },
  {
    id: 5,
    img: require("../../assets/images/Feeding3.jpeg"),
    description: "feeding.paddyStrawFeeding",
  },
  {
    id: 6,
    img: require("../../assets/images/Feeding5.jpeg"),
    description: "feeding.hayStack",
  },
  {
    id: 7,
    img: require("../../assets/images/Feeding6.jpeg"),
    description: "feeding.individualFeedingOfChaffedHybridNapier",
  },
  {
    id: 8,
    img: require("../../assets/images/Feeding7.jpeg"),
    description: "feeding.correctSizeOfChaffedMaize",
  },
  {
    id: 9,
    img: require("../../assets/images/Feeding8.jpeg"),
    description: "feeding.sunflowerCake",
  },
  {
    id: 10,
    img: require("../../assets/images/Feeding9.jpeg"),
    description: "feeding.unchaffedGreenFodderNotAGoodPractice",
  },
];

export default function FeedingProduction({ navigation }) {
  const [adminContent, setAdminContent] = useState([]);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetchFeedingContent();
  }, []);

  const fetchFeedingContent = async () => {
    try {
      setIsLoadingContent(true);
      const content = await getContentByLocation("cattle", "Feeding");
      setAdminContent(content || []);
    } catch (error) {
      console.log("Error fetching Feeding content:", error.message);
      setAdminContent([]);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const combinedData = [
    { id: "header", isAdmin: false, isHeader: true },
    ...adminContent.map((item) => ({ ...item, isAdmin: true })),
    ...FeedingList.map((item) => ({ ...item, isAdmin: false })),
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
            {i18n.t("feeding.feeding")}
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
  const renderItem = useCallback(
    ({ item }) => (
      <View style={{ alignItems: "center" }}>
        <View style={styles.imageHeader}>
          <Text style={styles.imageName}>{i18n.t(item.description)}</Text>
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
    ),
    [],
  );
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
