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
import { getContentByLocation } from "../../util/adminService";
import { extractYoutubeId } from "../../util/contentHelper";
import YoutubePlayer from "react-native-youtube-iframe";

const IntegratedList = [
  {
    id: 1,
    img: require("../assets/images/Integrated1.jpeg"),
    description: "Integrated Farming System(Rice + Dairy + sugarcane)",
  },
  {
    id: 2,
    img: require("../assets/images/Integrated2.jpeg"),
    description: "Integrated Farming System(Beetel vine + fodders + cocount)",
  },
  {
    id: 3,
    img: require("../assets/images/Integrated3.jpeg"),
    description: "Integrated Farming System(Subabul + fodders)",
  },
  {
    id: 4,
    img: require("../assets/images/Integrated4.jpeg"),
    description:
      "Intergrated farming (Agri(Groundnut ) + Horticulture (Marigold) + Hybrid napier grass)",
  },
  {
    id: 5,
    img: require("../assets/images/Integrated5.jpeg"),
    description: "Silvipasture system",
  },
  {
    id: 6,
    img: require("../assets/images/Integrated6.jpeg"),
    description: "Cattle + Sheep farming",
  },
  {
    id: 7,
    img: require("../assets/images/Integrated7.jpeg"),
    description: "Mango orchard + Groundnut",
  },
  {
    id: 8,
    img: require("../assets/images/Integrated8.jpeg"),
    description: "Integrated Farming System(Dairy + fodders)",
  },
  {
    id: 9,
    img: require("../assets/images/Integrated9.jpeg"),
    description: "Integrated Farming System(Sheep + goat)",
  },
  {
    id: 10,
    img: require("../assets/images/Integrated10.jpeg"),
    description: "Integrated Farming System(Paddy + jowar) ",
  },
  {
    id: 11,
    img: require("../assets/images/Integrated11.jpeg"),
    description: "Horticulture + sheep",
  },
  {
    id: 12,
    img: require("../assets/images/Integrated12.jpeg"),
    description: "Hortipasture",
  },
  {
    id: 13,
    img: require("../assets/images/Integrated13.jpeg"),
    description: "Cattle + Sheep farming",
  },
  {
    id: 14,
    img: require("../assets/images/Integrated14.jpeg"),
    description: "Mango orchard + Groundnut",
  },
  {
    id: 15,
    img: require("../assets/images/Integrated15.jpeg"),
    description: "Integrated Farming System(Dairy + fodders)",
  },
  {
    id: 16,
    img: require("../assets/images/Integrated16.jpeg"),
    description: "Integrated Farming System(Sheep + goat)",
  },
  {
    id: 17,
    img: require("../assets/images/Integrated17.jpeg"),
    description: "Integrated Farming System(Paddy + jowar)",
  },
  {
    id: 18,
    img: require("../assets/images/Integrated18.jpeg"),
    description: "Horticulture + sheep",
  },
  {
    id: 19,
    img: require("../assets/images/Integrated19.jpeg"),
    description: "Hortipasture",
  },
];

export default function IntegratedFarming({ navigation }) {
  const [adminContent, setAdminContent] = useState([]);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const content = await getContentByLocation("cattle", "IntegratedFarming");
      setAdminContent(content || []);
    } catch (error) {
      console.log("Error fetching content:", error.message);
      setAdminContent([]);
    }
  };

  const combinedData = [
    { id: "header", isAdmin: false, isHeader: true },
    ...adminContent.map((item) => ({ ...item, isAdmin: true })),
    ...IntegratedList.map((item) => ({ ...item, isAdmin: false })),
  ];

  const renderListItem = ({ item }) => {
    if (item.isHeader) {
      return (
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <Text style={{ textAlign: "center", margin: 15, maxWidth: 340, fontWeight: "500" }}>
            <Text style={{ color: "#840404", fontSize: 16, fontWeight: "600" }}>
              Integrated Farming{" "}
            </Text>
            system is an innovative method of promoting the sustainable use of
            available natural resources incorporating livestock activities with
            traditional agricultural practices in a holistic manner suitable to
            local conditions. It is method of more efficient and effective natural
            resource management allowing nutrient recycling and improved
            diversification.
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
              <Text style={styles.imageName}>{item.description}</Text>
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
