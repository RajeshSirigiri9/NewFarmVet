import { Dimensions } from "react-native";
import { ScrollView } from "react-native-virtualized-view";
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

const pfizerList = [
  {
    id: 1,
    img: require("../assets/images/pfizer1.jpeg"),
    description: "Experimental Shed",
  },
  {
    id: 2,
    img: require("../assets/images/pfizer2.jpeg"),
    description: "Selection of animals",
  },
  {
    id: 3,
    img: require("../assets/images/pfizer3.jpeg"),
    description: "Identification of animals",
  },
  {
    id: 4,
    img: require("../assets/images/pfizer4.jpeg"),
    description: "Identification of animals",
  },
  {
    id: 5,
    img: require("../assets/images/pfizer5.jpeg"),
    description: "Pouring of drug on animals",
  },
  {
    id: 6,
    img: require("../assets/images/pfizer6.jpeg"),
    description: "Treatment of animals",
  },
  {
    id: 7,
    img: require("../assets/images/pfizer7.jpeg"),
    description: "Treatment of animals",
  },
  {
    id: 8,
    img: require("../assets/images/pfizer8.jpeg"),
    description: "Treatment of animals",
  },
];

export default function PfizerDrug({ navigation }) {
  const [adminContent, setAdminContent] = useState([]);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const content = await getContentByLocation("cattle", "PfizerDrug");
      setAdminContent(content || []);
    } catch (error) {
      console.log("Error fetching content:", error.message);
      setAdminContent([]);
    }
  };

  const combinedData = [
    { id: "header", isAdmin: false, isHeader: true },
    ...adminContent.map((item) => ({ ...item, isAdmin: true })),
    ...pfizerList.map((item) => ({ ...item, isAdmin: false })),
  ];

  const renderListItem = ({ item }) => {
    if (item.isHeader) {
      return (
        <View style={styles.screen}>
          <Text style={{ textAlign: "center", margin: 15, maxWidth: 340, fontWeight: "500" }}>
            <Text style={{ color: "#6c0606", fontSize: 16, fontWeight: "600" }}>
              The objective{" "}
            </Text>
            of this study is to measure the Fipronil residues in bovine milk from
            lactating dairy cows at various withdrawal times following topical
            administration of Fipronil @1.0 mg/Kg in order to define the residue
            depletion profile. Fipronil, an acaricide can be used to prevent,
            control and treat the tick infestation in the dairy farms.
            {"\n"} A total of 15 Jersey Sahiwal crossbred cows of second parity in
            fourth month of lactation cycle of Department of Livestock Production
            Management, College of Veterinary Science, Tirupati were utilized for
            the study purpose. No signs of illness or infection especially
            mastitis and milk sample from the animals will be checked for SCC
            400,000 in the composite 4-quarter milk sample, prior to start of the
            study.
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
                style={{ width: "100%", height: 190, borderRadius: 5, marginBottom: 10 }}
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
              style={{ width: "100%", height: 190, borderRadius: 5 }}
            />
          </View>
        </View>
      );
    }
  };

  return (
    <ScrollView>
      <View style={styles.screen}>
        <FlatList
          data={combinedData}
          renderItem={renderListItem}
          keyExtractor={(item, index) => item.id || `admin-${index}`}
          scrollEnabled={false}
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
