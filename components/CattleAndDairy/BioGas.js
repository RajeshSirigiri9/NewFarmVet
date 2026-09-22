import { Dimensions, Platform } from "react-native";
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

// "bioGas": {
//   "bioGas": "Bio-Gas",
//   "bioGasDescription": "Bio gas generally refers to a mixture of various gases produced by the breakdown of organic matter in the absence of oxygen. Bio gas is produced from raw materials such as agricultural waste, manure, municipal waste, plant material, sewage, green waste, or food waste. Bio gas is a renewable energy source.",
//   "smallScale": "Small Scale Bio Gas Unit",
//   "bioGasSlurry": "Bio Gas Slurry",
//   "largeScale": "Large Scale Bio Gas Unit",
//   "powerFrom": "Power from Bio Gas",
//   "bioGasUnit": "Bio Gas Unit",
//   "demonstrationOfBioGasUnit": "Demonstration of Bio Gas Unit"
// },

const biogasList = [
  {
    id: 1,
    img: require("../../assets/images/biogas1.jpeg"),
    description: "biogas.smallScale",
  },
  {
    id: 2,
    img: require("../../assets/images/biogas2.jpeg"),
    description: "biogas.bioGasSlurry",
  },
  {
    id: 3,
    img: require("../../assets/images/biogas3.jpeg"),
    description: "biogas.largeScale",
  },
  {
    id: 4,
    img: require("../../assets/images/biogas4.jpeg"),
    description: "biogas.powerFrom",
  },
  {
    id: 5,
    img: require("../../assets/images/biogas5.jpeg"),
    description: "biogas.bioGasUnit",
  },
  {
    id: 6,
    img: require("../../assets/images/biogas6.jpeg"),
    description: "biogas.demonstrationOfBioGasUnit",
  },
];

export default function BioGas({ navigation }) {
  const [adminContent, setAdminContent] = useState([]);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const content = await getContentByLocation("cattle", "BioGas");
      setAdminContent(content || []);
    } catch (error) {
      console.log("Error fetching content:", error.message);
      setAdminContent([]);
    }
  };

  const combinedData = [
    { id: "header", isAdmin: false, isHeader: true },
    ...adminContent.map((item) => ({ ...item, isAdmin: true })),
    ...biogasList.map((item) => ({ ...item, isAdmin: false })),
  ];

  const renderListItem = ({ item }) => {
    if (item.isHeader) {
      return (
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <Text
            style={{
              color: "#9a0202",
              fontSize: 16,
              fontWeight: "bold",
              marginTop: 6,
            }}
          >
            {i18n.t("biogas.bioGas")}
          </Text>
          <Text
            style={{
              textAlign: "center",
              margin: 15,
              maxWidth: 340,
              fontWeight: "500",
            }}
          >
            {i18n.t("biogas.bioGasDescription")}
          </Text>
        </View>
      );
    } else if (item.isAdmin) {
      const videoId = item.videoUrl ? extractYoutubeId(item.videoUrl) : null;
      return (
        <View style={styles.imageContainer}>
          <View style={styles.imageHeader}>
            <Text style={styles.imageDescription}>{item.title}</Text>
          </View>
          {item.imageUrl && (
            <Image
              source={{ uri: item.imageUrl }}
              style={{
                width: "90%",
                height: 200,
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
      );
    } else {
      return (
        <View style={styles.imageContainer}>
          <View style={styles.imageHeader}>
            <Text style={styles.imageDescription}>
              {i18n.t(item.description)}
            </Text>
          </View>
          <Image
            source={item.img}
            style={{
              width: "90%",
              height: 200,
            }}
          />
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
    marginHorizontal: Platform.OS === "android" ? 10 : 0,
  },

  imageHeader: {
    backgroundColor: "#979595",
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
  imageContainer: {
    backgroundColor: "#979595",
    padding: width < 890 ? 10 : 25,
    // paddingRight: 25,
    height: 280,
    borderRadius: 5,
    marginBottom: 25,
    width: width < 890 ? 340 : 440,
    alignItems: "center",
    elevation: 4,
    overflow: "hidden",
    shadowColor: "black",
    shadowOpacity: 0.35,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 4,
  },
  imageDescription: {
    color: "#f6f4f4",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
