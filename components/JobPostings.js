import { Dimensions } from "react-native";
const { width } = Dimensions.get("window");

import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import i18n from "../localization/i18n";
import { getContentByLocation } from "../util/adminService";
import { extractYoutubeId } from "../util/contentHelper";
import YoutubePlayer from "react-native-youtube-iframe";

export default function JobPostings({ navigation }) {
  const [adminContent, setAdminContent] = useState([]);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetchJobPostingsContent();
  }, []);

  const fetchJobPostingsContent = async () => {
    try {
      setIsLoadingContent(true);
      const content = await getContentByLocation("careers", "JobPostings");
      setAdminContent(content || []);
    } catch (error) {
      console.log("Error fetching JobPostings content:", error.message);
      setAdminContent([]);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const combinedData = [
    { id: "header", isAdmin: false, isHeader: true },
    ...adminContent.map((item) => ({ ...item, isAdmin: true })),
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
            {i18n.t("ఉద్యోగలు") || "Job Postings"}
          </Text>
          <Text
            style={{
              textAlign: "center",
              margin: 15,
              maxWidth: 340,
              fontWeight: "500",
            }}
          >
            <Text style={{ color: "#2d2121", fontSize: 16, fontWeight: "600" }}>
              Current opportunities
            </Text>
          </Text>
        </View>
      );
    } else if (item.isAdmin) {
      const videoId = item.videoUrl ? extractYoutubeId(item.videoUrl) : null;
      const isYoutubeVideo = videoId !== null;
      
      // Debug logging
      console.log('JobPostings - Item:', {
        title: item.title,
        videoUrl: item.videoUrl,
        videoId: videoId,
        isYoutubeVideo: isYoutubeVideo,
        willShowLink: item.videoUrl && !isYoutubeVideo
      });
      
      const handleOpenLink = (url) => {
        if (url) {
          const urlToOpen = url.startsWith('http') ? url : `https://${url}`;
          Linking.openURL(urlToOpen).catch(err => console.log('Error opening link:', err));
        }
      };

      return (
        <View style={{ alignItems: "center" }}>
          <View style={styles.jobCard}>
            <View style={styles.jobTitleSection}>
              <Text style={styles.jobTitle}>{item.title}</Text>
            </View>
            {item.imageUrl && (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.jobImage}
                resizeMode="cover"
              />
            )}
            {item.description && (
              <View style={styles.descriptionWrapper}>
                <Text style={styles.descriptionText}>{item.description}</Text>
              </View>
            )}
            {item.videoUrl && !videoId && (
              <TouchableOpacity 
                style={styles.linkSection}
                activeOpacity={0.7}
                onPress={() => handleOpenLink(item.videoUrl)}
              >
                <MaterialCommunityIcons name="link" size={18} color="#9a0202" />
                <Text style={styles.linkText}>View Job Details</Text>
              </TouchableOpacity>
            )}
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
    backgroundColor: "#cccac8",
  },
  jobCard: {
    marginHorizontal: 10,
    marginBottom: 25,
    width: width < 890 ? 300 : 440,
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "black",
    shadowOpacity: 0.35,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 4,
  },
  jobTitleSection: {
    paddingHorizontal: 15,
    paddingVertical: 14,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 3,
    borderBottomColor: "#9a0202",
  },
  jobTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1f1f1f",
    letterSpacing: 0.3,
  },
  jobImage: {
    width: "100%",
    height: 180,
    borderRadius: 0,
  },
  imageHeader: {
    marginBottom: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  imageName: {
    color: "#393838",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageContainer: {
    marginHorizontal: 10,
    borderRadius: 8,
    marginBottom: 25,
    width: width < 890 ? 300 : 440,
    alignItems: "center",
    paddingVertical: 15,
  },
  descriptionWrapper: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fafafa",
    borderBottomWidth: 3,
    borderBottomColor: "#387849",
  },
  descriptionText: {
    fontSize: 13,
    color: "#464646",
    lineHeight: 20,
    textAlign: "justify",
    fontWeight: "500",
  },
  linkSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fff9f9",
    borderBottomWidth: 2,
    borderBottomColor: "#9a0202",
    gap: 10,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9a0202",
    textDecorationLine: "underline",
  },
});
