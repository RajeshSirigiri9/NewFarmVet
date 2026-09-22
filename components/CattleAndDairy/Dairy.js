//https://github.com/Mudassirraza912/react-native-image-slider-banner
// https://www.youtube.com/watch?v=u4q3u3K8KY8

// import { Divider, Layout, TopNavigation } from "@ui-kitten/components";

// "dairy": {
//   "dairyProject": "Dairy Project",
//   "dairyfarming": "Dairy farming is one of the most economically viable self-employment enterprises attracting the attention of educated unemployed youth, small, marginal and landless laborers as main/subsidiary occupation to agriculture.",
//   "dairyProjectCost": "Dairy Project (Cost)",
//   "tmrFeeding": "TMR feeding",
//   "dairyProject2": "Dairy Project",
//   "organicFarming": "Organic Farming",
//   "punganurCattle": "Punganur Cattle"
// },

import React from "react";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { useState, useCallback, useRef, useEffect } from "react";
import { Button, Alert } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { Dimensions } from "react-native";
import i18n from "../../localization/i18n";
import { getContentByLocation } from "../../util/adminService";
import { extractYoutubeId } from "../../util/contentHelper";
const { width, height } = Dimensions.get("window");

export default function Dairy({ navigation }) {
  const [playing, setPlaying] = useState(false);
  const [adminContent, setAdminContent] = useState([]);
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  useEffect(() => {
    fetchDairyContent();
  }, []);

  const fetchDairyContent = async () => {
    try {
      setIsLoadingContent(true);
      const content = await getContentByLocation("cattle", "Dairy");
      setAdminContent(content || []);
    } catch (error) {
      console.log("Error fetching Dairy content:", error.message);
      setAdminContent([]);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  const renderAdminContent = (item) => {
    const videoId = item.videoUrl ? extractYoutubeId(item.videoUrl) : null;

    return (
      <View
        key={item.id}
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            style={{
              width: 300,
              height: 200,
              borderRadius: 8,
              marginBottom: 10,
            }}
            resizeMode="cover"
          />
        )}
        <View style={styles.videoContainer}>
          <View style={styles.videoHeader}>
            <Text style={styles.videoName}>{item.title}</Text>
          </View>
          <Text
            style={{
              paddingHorizontal: 10,
              marginVertical: 10,
              color: "#555",
              fontSize: 12,
            }}
          >
            {item.description}
          </Text>
          {videoId ? (
            <YoutubePlayer
              height={210}
              width={300}
              play={playing}
              videoId={videoId}
              onChangeState={onStateChange}
            />
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <>
      <ScrollView style={styles.videoStyle}>
        {/* Admin-created content */}
        {adminContent.length > 0 && (
          <View>
            {adminContent.map((item) => renderAdminContent(item))}
            <Text
              style={{
                textAlign: "center",
                marginVertical: 20,
                fontSize: 14,
                fontWeight: "bold",
                color: "#970303",
              }}
            >
              --- Standard Content ---
            </Text>
          </View>
        )}

        <Text
          onPress={() => navigation.navigate("Cattle")}
          style={{
            textAlign: "center",
            fontSize: 16,
            color: "#970303",
            fontWeight: "bold",
          }}
        >
          {i18n.t("dairy.dairyProject")}
        </Text>
        <Text
          style={{
            maxWidth: 350,
            textAlign: "center",
            margin: 10,
            fontWeight: "500",
            color: "#311607",
          }}
        >
          {i18n.t("dairy.dairyfarming")}
        </Text>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View style={styles.videoContainer}>
            <View style={styles.videoHeader}>
              <Text style={styles.videoName}>
                {i18n.t("dairy.dairyProjectCost")}
              </Text>
            </View>
            <YoutubePlayer
              height={210}
              width={300}
              play={playing}
              videoId={"7DUi0zRVx5k"}
              onChangeState={onStateChange}
            />
          </View>
          <View style={styles.videoContainer}>
            <View style={styles.videoHeader}>
              <Text style={styles.videoName}>{i18n.t("dairy.tmrFeeding")}</Text>
            </View>
            <YoutubePlayer
              height={210}
              width={300}
              play={playing}
              videoId={"yB67QrQN9Ns"}
              onChangeState={onStateChange}
            />
          </View>
          <View style={styles.videoContainer}>
            <View style={styles.videoHeader}>
              <Text style={styles.videoName}>
                {i18n.t("dairy.dairyProjectCost")}
              </Text>
            </View>
            <YoutubePlayer
              height={210}
              width={300}
              play={playing}
              videoId={"xdGBkjelhsI"}
              onChangeState={onStateChange}
            />
          </View>
          <View style={styles.videoContainer}>
            <View style={styles.videoHeader}>
              <Text style={styles.videoName}>
                {i18n.t("dairy.dairyProject")}
              </Text>
            </View>

            <YoutubePlayer
              height={210}
              width={300}
              play={playing}
              videoId={"po_M9mCumoM"}
              onChangeState={onStateChange}
            />
          </View>
          <View style={styles.videoContainer}>
            <View style={styles.videoHeader}>
              <Text style={styles.videoName}>
                {i18n.t("dairy.dairyProject")}
              </Text>
            </View>
            <YoutubePlayer
              height={210}
              width={300}
              play={playing}
              videoId={"xbRtlZtf19c"}
              onChangeState={onStateChange}
            />
          </View>
          <View style={styles.videoContainer}>
            <View style={styles.videoHeader}>
              <Text style={styles.videoName}>
                {i18n.t("dairy.dairyProject")}
              </Text>
            </View>

            <YoutubePlayer
              height={210}
              width={300}
              play={playing}
              videoId={"xMc6ypD6hMo"}
              onChangeState={onStateChange}
            />
          </View>

          <View style={styles.videoContainer}>
            <View style={styles.videoHeader}>
              <Text style={styles.videoName}>
                {i18n.t("dairy.organicFarming")}
              </Text>
            </View>
            <YoutubePlayer
              height={210}
              width={300}
              play={playing}
              videoId={"RrmcRj6zmd0"}
              onChangeState={onStateChange}
            />
          </View>
          <View style={styles.videoContainer}>
            <View style={styles.videoHeader}>
              <Text style={styles.videoName}>
                {i18n.t("dairy.punganurCattle")}
              </Text>
            </View>
            <YoutubePlayer
              height={210}
              width={300}
              play={playing}
              videoId={"C_k-w5KYSQ4"}
              onChangeState={onStateChange}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  videoStyle: { margin: 15 },
  videoHeader: {
    backgroundColor: "#928e8e",
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
  videoContainer: {
    backgroundColor: "#928e8e",
    paddingTop: 10,
    height: 260,
    borderRadius: 5,
    marginBottom: 25,
    //  marginHorizontal: width > 390 ? "22%" : 0,
    width: 330,
    alignItems: "center",
  },
  videoName: {
    color: "#f6f4f4",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
