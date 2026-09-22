import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { FlatList } from "react-native";
import Press from "../../ui/Press";
import { FadeInFlatList } from "../../ui/FadeInFlatList";
import i18n from "../../localization/i18n";
import { useState, useEffect } from "react";
import { getContentByLocation } from "../../util/adminService";
import YoutubePlayer from "react-native-youtube-iframe";
import { extractYoutubeId } from "../../util/contentHelper";

const List = [
  {
    id: "1",
    name: "cattleList.dairyProject",
    page: "Dairy",
  },
  {
    id: "2",
    name: "cattleList.environmentalDairyHousing",
    page: "EnvironmentalDairyHousing",
  },
  {
    id: "3",
    name: "cattleList.housing",
    page: "Housing",
  },
  {
    id: "4",
    name: "cattleList.organicDairy",
    page: "OrganicDairy",
  },
  {
    id: "5",
    name: "cattleList.selectionOfGoodAnimals",
    page: "SelectionOfGoodAnimals",
  },
  {
    id: "6",
    name: "cattleList.wallowingTank",
    page: "WallowingTank",
  },
  {
    id: "7",
    name: "cattleList.calfRearing",
    page: "CalfRearing",
  },
  {
    id: "8",
    name: "cattleList.cleanMilkProduction",
    page: "CleanMilkProduction",
  },
  {
    id: "9",
    name: "cattleList.feeding",
    page: "Feeding",
  },
  {
    id: "10",
    name: "cattleList.heatDetection",
    page: "HeatDetection",
  },

  {
    id: "11",
    name: "cattleList.diseases",
    page: "Diseases",
  },
  {
    id: "12",
    name: "cattleList.preventiveHealthCare",
    page: "PreventiveHealthCare",
  },
];

export default function CattleList() {
  const [adminContent, setAdminContent] = useState([]);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetchDynamicContent();
  }, []);

  const fetchDynamicContent = async () => {
    try {
      setIsLoadingContent(true);
      const content = await getContentByLocation("cattle", "CattleList");
      // Filter to show only content where targetSubPage is empty or not set
      const filteredContent = content.filter(
        (item) => !item.targetSubPage || item.targetSubPage === "",
      );
      setAdminContent(filteredContent);
    } catch (error) {
      console.log("Error fetching cattle list content:", error.message);
      setAdminContent([]);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const renderAdminContent = ({ item }) => {
    const videoId = item.videoUrl ? extractYoutubeId(item.videoUrl) : null;

    return (
      <View style={styles.adminContentCard}>
        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.adminContentImage}
            onError={() => console.log("Image load error")}
          />
        )}
        <View style={styles.adminContentBody}>
          <Text style={styles.adminContentTitle}>{item.title}</Text>
          <Text style={styles.adminContentDescription} numberOfLines={3}>
            {item.description}
          </Text>
          {videoId && (
            <View style={styles.videoContainer}>
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
            </View>
          )}
        </View>
      </View>
    );
  };

  // Combine admin content with static list
  const combinedData = [...adminContent, ...List];

  return (
    <FadeInFlatList
      initialDelay={100}
      durationPerItem={500}
      parallelItems={5}
      itemsToFadeIn={10}
      data={combinedData}
      renderItem={({ item }) => {
        // Check if this is admin content or static content
        if (item.videoUrl !== undefined || item.contentType !== undefined) {
          return renderAdminContent({ item });
        }
        // Static content
        return (
          <Press page={item.page}>
            <Text style={styles.eachButton}>{i18n.t(item.name)}</Text>
          </Press>
        );
      }}
      keyExtractor={(item) => item.id}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
  },
  item: {
    padding: 20,
    fontSize: 15,
    marginTop: 5,
  },
  eachButton: {
    backgroundColor: "#58b870",
    padding: 15,
    margin: 15,
    borderRadius: 10,
    overflow: "hidden",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: "#022920",
  },
  adminContentCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 15,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  adminContentImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#f0f0f0",
  },
  adminContentBody: {
    padding: 12,
  },
  adminContentTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#022920",
    marginBottom: 8,
  },
  adminContentDescription: {
    fontSize: 12,
    color: "#555",
    lineHeight: 18,
    marginBottom: 10,
  },
  videoButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  videoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 15,
  },
});
