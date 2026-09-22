import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
import { ScrollView } from "react-native";
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

const goMutraList = [
  {
    id: 1,
    img: require("../../assets/images/goMutra1.jpeg"),
  },
  {
    id: 2,
    img: require("../../assets/images/goMutra2.jpeg"),
  },
  {
    id: 3,
    img: require("../../assets/images/goMutra3.jpeg"),
  },
  {
    id: 4,
    img: require("../../assets/images/goMutra4.jpeg"),
  },
  {
    id: 5,
    img: require("../../assets/images/goMutra5.jpeg"),
  },
  {
    id: 6,
    img: require("../../assets/images/goMutra6.jpeg"),
  },
  {
    id: 7,
    img: require("../../assets/images/goMutra7.jpeg"),
  },
  {
    id: 8,
    img: require("../../assets/images/goMutra8.jpeg"),
  },
  {
    id: 9,
    img: require("../../assets/images/goMutra9.jpeg"),
  },
  {
    id: 10,
    img: require("../../assets/images/goMutra10.jpeg"),
  },
  {
    id: 11,
    img: require("../../assets/images/goMutra11.jpeg"),
  },

  {
    id: 12,
    img: require("../../assets/images/goMutra12.jpeg"),
  },
  {
    id: 13,
    img: require("../../assets/images/goMutra13.jpeg"),
  },
  {
    id: 14,
    img: require("../../assets/images/goMutra14.jpeg"),
  },
  {
    id: 15,
    img: require("../../assets/images/goMutra15.jpeg"),
  },
  {
    id: 16,
    img: require("../../assets/images/goMutra16.jpeg"),
  },
  {
    id: 17,
    img: require("../../assets/images/goMutra17.jpeg"),
  },
  {
    id: 18,
    img: require("../../assets/images/goMutra18.jpeg"),
  },
  {
    id: 19,
    img: require("../../assets/images/goMutra19.jpeg"),
  },
  {
    id: 20,
    img: require("../../assets/images/goMutra20.jpeg"),
  },
];

export default function GoMutraArk({ navigation }) {
  const [adminContent, setAdminContent] = useState([]);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const content = await getContentByLocation("cattle", "GoMutraArk");
      setAdminContent(content || []);
    } catch (error) {
      console.log("Error fetching content:", error.message);
      setAdminContent([]);
    }
  };

  const combinedData = [
    { id: "header", isAdmin: false, isHeader: true },
    ...adminContent.map((item) => ({ ...item, isAdmin: true })),
    ...goMutraList.map((item) => ({ ...item, isAdmin: false })),
  ];

  const renderListItem = ({ item }) => {
    if (item.isHeader) {
      return (
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <Text style={{ color: "#9a0202", fontSize: 18, fontWeight: "bold", marginTop: 16 }}>
            {i18n.t("goMutraArk.goMutraArk")}
          </Text>
          <Text style={{ textAlign: "center", margin: 15, maxWidth: 340, fontWeight: "500" }}>
            <Text style={{ color: "#2d2121", fontSize: 16, fontWeight: "900" }}>
              {i18n.t("goMutraArk.goMutraArk")}{" "}
            </Text>
            {i18n.t("goMutraArk.isAnAgeOldAyurvedicTreatmentMethod")}{" "}
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
            <Text style={{ padding: 10, fontSize: 12, color: "#555", textAlign: "center" }}>
              {item.title}
            </Text>
            <Text style={{ padding: 5, fontSize: 11, color: "#666", textAlign: "center" }}>
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
