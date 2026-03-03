import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "../config";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const UserContentScreen = () => {
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);

      const q = query(
        collection(db, "content"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const list = [];

      snapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setContentList(list);
    } catch (error) {
      console.log("Error fetching content:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedContent(item)}
    >
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      )}

      <View style={styles.cardContent}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.category}>
          {item.category?.toUpperCase()}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#387849" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="book-open-page-variant"
          size={28}
          color="#387849"
        />
        <Text style={styles.headerTitle}>Learning Content</Text>
      </View>

      <FlatList
        data={contentList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
      />

      {/* Detail Modal */}
      <Modal
        visible={!!selectedContent}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedContent(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {selectedContent?.imageUrl && (
                <Image
                  source={{ uri: selectedContent.imageUrl }}
                  style={styles.detailImage}
                />
              )}

              <Text style={styles.detailTitle}>
                {selectedContent?.title}
              </Text>

              <Text style={styles.detailCategory}>
                {selectedContent?.category}
              </Text>

              <Text style={styles.detailDescription}>
                {selectedContent?.description}
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedContent(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UserContentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
    color: "#387849",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 180,
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: "#27ae60",
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: "#555",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  detailImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailCategory: {
    fontSize: 14,
    color: "#27ae60",
    marginBottom: 10,
  },
  detailDescription: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#387849",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});