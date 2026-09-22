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

// "foddersForSheep": {
//   "fodderTrees": "మేత చెట్లు",
//   "subabulTrees": "సుబాబుల్ చెట్లు",
//   "leftHedgeLucerneRightSubabul": "ఎడమ హెడ్జ్-లూసెర్న్ కుడి సుబాబుల్",
//   "siratro": "సిరాట్రో",
//   "horseGram": "హార్స్ గ్రామ్",
//   "leftAdaviveopaRightVepaOrNeem": "ఎడమ అడవివేపా కుడి వేప లేదా వేప",
//   "indigenousGrassesInMangoOrchards": "మామిడి తోటలలో స్థానిక గడ్డి",
//   "hedgeLucerneWithAvisa": "హెడ్జ్-లూసర్న్ మరియు రెండు వైపులా అవిసా(సెస్బానియా)తో",
//   "hedgeLucerne": "హెడ్జ్-లూసర్న్",
//   "guineaGrass": "గినియా-గ్రాస్",
//   "lucerne": "లూసర్న్",
//   "foddersForSheep": "గొర్రెల కోసం మేతలు",
//   "foddersForSheepDescription": "ఎత్తు తక్కువగా ఉండాలి. గొర్రెల కోసం వివిధ రకాల మేత ఉత్పత్తి వ్యవస్థలను దేశీయ గడ్డి, మేత చెట్లు, సిల్విపాస్ట్చర్, హార్టిపాస్ట్చర్ మొదలైన వాటి నుండి పొందవచ్చు. అనువైన మేత రకాలు క్రింద చూపించబడ్డాయి."
// },

const fodderList = [
  {
    id: 1,
    img: require("../../assets/images/fodder1.jpeg"),
    description: "foddersForSheep.fodderTrees",
  },
  {
    id: 2,
    img: require("../../assets/images/fodder2.jpeg"),
    description: "foddersForSheep.subabulTrees",
  },
  {
    id: 3,
    img: require("../../assets/images/fodder3.jpeg"),
    description: "foddersForSheep.leftHedgeLucerneRightSubabul",
  },
  {
    id: 4,
    img: require("../../assets/images/fodder4.jpeg"),
    description: "foddersForSheep.siratro",
  },
  {
    id: 5,
    img: require("../../assets/images/fodder5.jpeg"),
    description: "foddersForSheep.horseGram",
  },
  {
    id: 6,
    img: require("../../assets/images/fodder6.jpeg"),
    description: "foddersForSheep.leftAdaviveopaRightVepaOrNeem",
  },
  {
    id: 7,
    img: require("../../assets/images/fodder7.jpeg"),
    description: "foddersForSheep.indigenousGrassesInMangoOrchards",
  },
  {
    id: 8,
    img: require("../../assets/images/fodder8.jpeg"),
    description: "foddersForSheep.hedgeLucerneWithAvisa",
  },
  {
    id: 9,
    img: require("../../assets/images/fodder9.jpeg"),
    description: "foddersForSheep.hedgeLucerne",
  },
  {
    id: 10,
    img: require("../../assets/images/fodder10.jpeg"),
    description: "foddersForSheep.guineaGrass",
  },
  {
    id: 11,
    img: require("../../assets/images/fodder11.jpeg"),
    description: "foddersForSheep.lucerne",
  },
];

export default function FoddersSheep({ navigation }) {
  const [adminContent, setAdminContent] = useState([]);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const content = await getContentByLocation("sheep", "FoddersSheep");
      setAdminContent(content || []);
    } catch (error) {
      console.log("Error fetching content:", error.message);
      setAdminContent([]);
    }
  };

  const combinedData = [
    { id: "header", isAdmin: false, isHeader: true },
    ...adminContent.map((item) => ({ ...item, isAdmin: true })),
    ...fodderList.map((item) => ({ ...item, isAdmin: false })),
  ];

  const renderListItem = ({ item }) => {
    if (item.isHeader) {
      return (
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <Text style={{ color: "#9a0202", fontSize: 18, fontWeight: "bold", marginTop: 6 }}>
            {i18n.t("foddersForSheep.foddersForSheep")}
          </Text>
          <Text style={{ textAlign: "center", margin: 15, maxWidth: 340, fontWeight: "500" }}>
            <Text style={{ color: "#2c2525", fontSize: 16, fontWeight: "bold" }}>
              {i18n.t("foddersForSheep.foddersForSheep")}{" "}
            </Text>
            {i18n.t("foddersForSheep.foddersForSheepDescription")}
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
    backgroundColor: "#819482",
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
  imageContainer: {
    backgroundColor: "#819482",
    padding: width < 890 ? 10 : 25,
    height: 270,
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
