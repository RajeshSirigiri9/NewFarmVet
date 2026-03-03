import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
  TextInput,
  Modal,
  ScrollView,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  addContent,
  getAllContent,
  updateContent,
  deleteContent,
} from "../../util/adminService";

const ContentManager = () => {
  const [contentList, setContentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [isEditMode, setIsEditMode] = useState(false);

  const categories = ["general", "cattle", "sheep", "farming", "health", "other"];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const data = await getAllContent();
      setContentList(data);
    } catch (error) {
      console.log("Error fetching content:", error);
      Alert.alert("Error", error.message);
    }
    setIsLoading(false);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
        setImagePreview(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleAddContent = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Title and description are required");
      return;
    }

    if (title.length < 5 || title.length > 100) {
      Alert.alert("Error", "Title must be between 5 and 100 characters");
      return;
    }

    if (description.length < 10 || description.length > 2000) {
      Alert.alert("Error", "Description must be between 10 and 2000 characters");
      return;
    }

    try {
      setIsLoading(true);

      if (isEditMode) {
        // Update existing content
        await updateContent(selectedContent.id, {
          title,
          description,
          category,
          imageUrl: imagePreview || selectedContent.imageUrl,
        });
        Alert.alert("Success", "Content updated successfully");
      } else {
        // Add new content
        await addContent(title, description, imagePreview, category);
        Alert.alert("Success", "Content added successfully");
      }

      // Reset form
      setTitle("");
      setDescription("");
      setCategory("general");
      setSelectedImage(null);
      setImagePreview(null);
      setShowAddForm(false);
      setIsEditMode(false);
      setSelectedContent(null);

      // Refresh content list
      fetchContent();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
    setIsLoading(false);
  };

  const handleDeleteContent = async (contentId) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this content?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            setIsLoading(true);
            await deleteContent(contentId);
            Alert.alert("Success", "Content deleted successfully");
            fetchContent();
          } catch (error) {
            Alert.alert("Error", error.message);
          }
          setIsLoading(false);
        },
        style: "destructive",
      },
    ]);
  };

  const handleEditContent = (content) => {
    setTitle(content.title);
    setDescription(content.description);
    setCategory(content.category || "general");
    setImagePreview(content.imageUrl);
    setSelectedContent(content);
    setIsEditMode(true);
    setShowAddForm(true);
  };

  const renderContentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contentCard}
      onPress={() => setSelectedContent(item)}
    >
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.contentImage}
          onError={() => console.log("Image load error for:", item.id)}
        />
      )}
      <View style={styles.contentInfo}>
        <View>
          <Text style={styles.contentTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.contentCategory}>{item.category}</Text>
          <Text style={styles.contentDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <View style={styles.contentActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditContent(item)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteContent(item.id)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Add Content Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setTitle("");
          setDescription("");
          setCategory("general");
          setImagePreview(null);
          setSelectedContent(null);
          setIsEditMode(false);
          setShowAddForm(true);
        }}
      >
        <Text style={styles.addButtonText}>+ Add New Content</Text>
      </TouchableOpacity>

      {/* Content List */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#27ae60" style={{ marginTop: 20 }} />
      ) : contentList.length === 0 ? (
        <Text style={styles.emptyText}>No content found. Add your first page!</Text>
      ) : (
        <FlatList
          data={contentList}
          renderItem={renderContentItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      )}

      {/* Add/Edit Form Modal */}
      <Modal
        visible={showAddForm}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowAddForm(false);
          setSelectedImage(null);
          setImagePreview(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                {isEditMode ? "Edit Content" : "Add New Content"}
              </Text>

              {/* Image Section */}
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {imagePreview ? (
                  <>
                    <Image
                      source={{ uri: imagePreview }}
                      style={styles.imagePreview}
                    />
                    <Text style={styles.imagePickerText}>Change Image</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.imagePickerIcon}>📷</Text>
                    <Text style={styles.imagePickerText}>Add Image (Optional)</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Title Input */}
              <Text style={styles.label}>Title (5-100 characters)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter content title"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#bdc3c7"
              />
              <Text
                style={[
                  styles.charCount,
                  title.length > 100 && styles.charCountError,
                ]}
              >
                {title.length}/100
              </Text>

              {/* Description Input */}
              <Text style={styles.label}>Description (10-2000 characters)</Text>
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Enter content description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={5}
                placeholderTextColor="#bdc3c7"
              />
              <Text
                style={[
                  styles.charCount,
                  description.length > 2000 && styles.charCountError,
                ]}
              >
                {description.length}/2000
              </Text>

              {/* Category Selector */}
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryContainer}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryButton,
                      category === cat && styles.categoryButtonActive,
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        category === cat && styles.categoryButtonTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Form Actions */}
              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowAddForm(false);
                    setImagePreview(null);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleAddContent}
                  disabled={
                    !title.trim() ||
                    !description.trim() ||
                    title.length < 5 ||
                    title.length > 100 ||
                    description.length < 10 ||
                    description.length > 2000
                  }
                >
                  <Text style={styles.submitButtonText}>
                    {isEditMode ? "Update" : "Add"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Content Detail Modal */}
      <Modal
        visible={!!selectedContent && !showAddForm}
        transparent
        animationType="slide"
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

              <Text style={styles.detailTitle}>{selectedContent?.title}</Text>
              <View style={styles.detailCategoryBadge}>
                <Text style={styles.detailCategoryText}>
                  {selectedContent?.category}
                </Text>
              </View>

              <Text style={styles.detailDescription}>
                {selectedContent?.description}
              </Text>

              <Text style={styles.detailDate}>
                Added:{" "}
                {new Date(selectedContent?.createdAt?.toDate?.()).toLocaleDateString()}
              </Text>

              <View style={styles.detailActions}>
                <TouchableOpacity
                  style={styles.detailEditButton}
                  onPress={() => handleEditContent(selectedContent)}
                >
                  <Text style={styles.detailEditButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.detailDeleteButton}
                  onPress={() => {
                    handleDeleteContent(selectedContent.id);
                    setSelectedContent(null);
                  }}
                >
                  <Text style={styles.detailDeleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  addButton: {
    backgroundColor: "#27ae60",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  contentCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  contentImage: {
    width: "100%",
    height: 150,
    backgroundColor: "#ecf0f1",
  },
  contentInfo: {
    padding: 12,
  },
  contentTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  contentCategory: {
    fontSize: 11,
    color: "#27ae60",
    fontWeight: "600",
    marginBottom: 6,
  },
  contentDescription: {
    fontSize: 12,
    color: "#555",
    marginBottom: 10,
    lineHeight: 18,
  },
  contentActions: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#3498db",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  editButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#e74c3c",
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
    marginTop: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "95%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
  },
  imagePicker: {
    backgroundColor: "#ecf0f1",
    borderRadius: 10,
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#bdc3c7",
    borderStyle: "dashed",
  },
  imagePickerIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  imagePickerText: {
    color: "#7f8c8d",
    fontSize: 14,
    fontWeight: "600",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: "#2c3e50",
    marginBottom: 5,
  },
  descriptionInput: {
    textAlignVertical: "top",
    height: 100,
  },
  charCount: {
    fontSize: 11,
    color: "#95a5a6",
    marginBottom: 12,
    textAlign: "right",
  },
  charCountError: {
    color: "#e74c3c",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 15,
  },
  categoryButton: {
    backgroundColor: "#ecf0f1",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  categoryButtonActive: {
    backgroundColor: "#27ae60",
  },
  categoryButtonText: {
    fontSize: 12,
    color: "#7f8c8d",
    fontWeight: "600",
  },
  categoryButtonTextActive: {
    color: "white",
  },
  formActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#95a5a6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#27ae60",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  detailImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  detailCategoryBadge: {
    backgroundColor: "#27ae60",
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  detailCategoryText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  detailDescription: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
    marginBottom: 15,
  },
  detailDate: {
    fontSize: 12,
    color: "#95a5a6",
    marginBottom: 20,
  },
  detailActions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  detailEditButton: {
    flex: 1,
    backgroundColor: "#3498db",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  detailEditButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
  },
  detailDeleteButton: {
    flex: 1,
    backgroundColor: "#e74c3c",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  detailDeleteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
  },
  closeButton: {
    backgroundColor: "#34495e",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default ContentManager;
