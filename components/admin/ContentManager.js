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
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
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

  // New: Target location fields
  const [targetSection, setTargetSection] = useState("cattle");
  const [targetPage, setTargetPage] = useState("CattleList");
  const [targetSubPage, setTargetSubPage] = useState("");
  const [contentTypes, setSelectedContentTypes] = useState([
    "title",
    "description",
  ]);
  const [videoUrl, setVideoUrl] = useState("");
  const [order, setOrder] = useState("1");

  const categories = [
    "general",
    "cattle",
    "sheep",
    "farming",
    "health",
    "other",
  ];

  // Mapping of sections to their pages
  const sectionPages = {
    cattle: [
      "CattleList",
      "Dairy",
      "Housing",
      "Feeding",
      "Diseases",
      "HealthCare",
      "BioGas",
      "CalfRearing",
      "CleanMilkProduction",
      "EnvironmentalDairyHousing",
      "GoMutraArk",
      "HeatDetection",
      "OrganicDairy",
      "PfizerDrug",
      "PreventiveHealthCare",
      "SahiwalCalves",
      "SelectionOfGoodAnimals",
      "VermiComposting",
      "WallowingTank",
    ],
    sheep: [
      "Sheep",
      "SheepBreeding",
      "SheepDiseases",
      "ScientificPractices",
      "BestPractices",
      "HealthCare",
      "FoddersSheep",
      "GoatHousing",
    ],
    farming: [
      "IntegratedFarming",
      "Azolla",
      "Hydrophonics",
      "Emu",
      "Byproducts",
    ],
    research: ["ResearchAreas", "Farming"],
    technologies: ["Technologies"],
    careers: ["JobPostings", "JobOpportunities"],
    other: ["Home", "About", "Contact", "Download", "Publication"],
  };

  // Mapping of subpage keys to their actual page component names
  const subPageToPageMap = {
    dairyProject: "Dairy",
    environmentalDairyHousing: "EnvironmentalDairyHousing",
    housing: "Housing",
    organicDairy: "OrganicDairy",
    selectionOfGoodAnimals: "SelectionOfGoodAnimals",
    wallowingTank: "WallowingTank",
    calfRearing: "CalfRearing",
    cleanMilkProduction: "CleanMilkProduction",
    feeding: "Feeding",
    heatDetection: "HeatDetection",
    diseases: "Diseases",
    preventiveHealthCare: "PreventiveHealthCare",
    sheepBreeding: "SheepBreeding",
    sheepDiseases: "SheepDiseases",
    scientificPractices: "ScientificPractices",
    bestPractices: "BestPractices",
    healthCare: "HealthCare",
    foddersSheep: "FoddersSheep",
    goatHousing: "GoatHousing",
  };

  // Mapping of pages to subpages/locations
  const pageSubPages = {
    // CattleList subpages
    CattleList: [
      { key: "dairyProject", label: "Dairy Project" },
      {
        key: "environmentalDairyHousing",
        label: "Environmental Dairy Housing",
      },
      { key: "housing", label: "Housing" },
      { key: "organicDairy", label: "Organic Dairy" },
      { key: "selectionOfGoodAnimals", label: "Selection Of Good Animals" },
      { key: "wallowingTank", label: "Wallowing Tank" },
      { key: "calfRearing", label: "Calf Rearing" },
      { key: "cleanMilkProduction", label: "Clean Milk Production" },
      { key: "feeding", label: "Feeding" },
      { key: "heatDetection", label: "Heat Detection" },
      { key: "diseases", label: "Diseases" },
      { key: "preventiveHealthCare", label: "Preventive Health Care" },
    ],
    // Sheep subpages
    Sheep: [
      { key: "sheepBreeding", label: "Sheep Breeding" },
      { key: "sheepDiseases", label: "Sheep Diseases" },
      { key: "scientificPractices", label: "Scientific Practices" },
      { key: "bestPractices", label: "Best Management Practices" },
      { key: "healthCare", label: "Health Care" },
      { key: "foddersSheep", label: "Fodders for Sheep" },
      { key: "goatHousing", label: "Goat Housing" },
    ],
    // Dairy subpages
    Dairy: [
      { key: "dairyProduction", label: "Dairy Production" },
      { key: "organic", label: "Organic Dairy" },
      { key: "cleanMilk", label: "Clean Milk Production" },
    ],
    // Housing subpages
    Housing: [
      { key: "cattleHousing", label: "Cattle Housing" },
      { key: "environmentalControl", label: "Environmental Control" },
      { key: "wallowingTank", label: "Wallowing Tank" },
      { key: "goatHousing", label: "Goat Housing" },
    ],
    // Farming subpages
    IntegratedFarming: [
      { key: "crops", label: "Crops Integration" },
      { key: "livestock", label: "Livestock Integration" },
      { key: "fishery", label: "Fishery Integration" },
    ],
    // Research Areas subpages
    ResearchAreas: [
      {
        key: "integratedFarmingResearch",
        label: "Integrated Farming Research",
      },
      { key: "pfizer", label: "Pfizer Drug Studies" },
      { key: "animalHealth", label: "Animal Health Research" },
    ],
    // Technologies subpages
    Technologies: [
      { key: "milkTechnology", label: "Milk Processing Technology" },
      { key: "soilTechnology", label: "Soil Technology" },
      { key: "waterMgmt", label: "Water Management" },
      { key: "machineryTech", label: "Farm Machinery" },
    ],
    // By-products subpages
    Byproducts: [
      { key: "cowByproducts", label: "Cow By-products" },
      { key: "sheepByproducts", label: "Sheep By-products" },
      { key: "poultryByproducts", label: "Poultry By-products" },
      { key: "vermicompost", label: "Vermicompost" },
    ],
  };

  const availableContentTypes = [
    "title",
    "description",
    "image",
    "videoLink",
    "additionalInfo",
  ];

  const availablePages = sectionPages[targetSection] || sectionPages.cattle;
  const availableSubPages = pageSubPages[targetPage] || [];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      console.log("\nContentManager: Fetching content...");

      // Check if currentUser is already available
      let currentUser = firebase.auth().currentUser;
      console.log(
        "ContentManager: CurrentUser check:",
        currentUser ? currentUser.uid : "null",
      );

      if (!currentUser) {
        console.log(
          "ContentManager: No currentUser, attempting to sign in with email and cached token...",
        );

        // Try to get email from AsyncStorage
        const storedEmail = await AsyncStorage.getItem("userEmail");

        if (storedEmail) {
          console.log(
            "ContentManager: Found stored email, attempting to use it...",
          );
          console.log(
            "ContentManager: Proceeding without Firebase Auth currentUser",
          );
          console.log(
            "ContentManager: Will rely on Firestore rules being readable",
          );
        }
      } else {
        console.log("✓ ContentManager: Using existing Firebase Auth session");
      }

      // Attempt to fetch content
      try {
        console.log("ContentManager: Calling getAllContent()");
        const data = await getAllContent();
        console.log("✓ ContentManager: Fetched", data.length, "content items");
        setContentList(data);
      } catch (firestoreError) {
        console.log(
          "⚠ ContentManager: Firestore query failed:",
          firestoreError.message,
        );

        if (
          firestoreError.message.includes("Missing or insufficient permissions")
        ) {
          console.log(
            "ContentManager: Permission error - likely due to Firestore rules",
          );
          Alert.alert(
            "Access Required",
            "Firestore rules may need to be updated to allow content access.\n\nPlease contact admin.",
          );
        } else {
          throw firestoreError;
        }
      }
    } catch (error) {
      console.log("✗ ContentManager Error:", error);
      Alert.alert("Error Loading Content", error.message);
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
    if (!title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }

    if (title.length < 5 || title.length > 100) {
      Alert.alert("Error", "Title must be between 5 and 100 characters");
      return;
    }

    if (
      description.trim() &&
      (description.length < 10 || description.length > 2000)
    ) {
      Alert.alert(
        "Error",
        "Description must be between 10 and 2000 characters",
      );
      return;
    }

    // Check admin status before proceeding
    console.log(
      "ContentManager: Checking admin status before saving content...",
    );
    try {
      const storedIsAdmin = await AsyncStorage.getItem("isAdmin");
      const isAdmin = storedIsAdmin && JSON.parse(storedIsAdmin) === true;

      if (!isAdmin) {
        Alert.alert("Access Denied", "Only admins can create or edit content");
        console.log("ContentManager: User is not admin, rejecting save");
        return;
      }

      console.log("✓ ContentManager: Admin status verified");
    } catch (error) {
      console.log(
        "ContentManager: Error checking admin status:",
        error.message,
      );
      Alert.alert("Error", "Could not verify admin status");
      return;
    }

    try {
      setIsLoading(true);

      if (isEditMode) {
        // Update existing content
        console.log("ContentManager: Updating content:", selectedContent.id);
        await updateContent(selectedContent.id, {
          title,
          description,
          category,
          targetSection,
          targetPage,
          targetSubPage,
          contentTypes,
          videoUrl,
          order: parseInt(order) || 1,
          imageUrl: imagePreview || selectedContent.imageUrl,
        });
        console.log("✓ ContentManager: Content updated");
        Alert.alert("Success", "Content updated successfully");
      } else {
        // Add new content
        console.log("ContentManager: Adding new content");
        await addContent(
          title,
          description,
          imagePreview,
          category,
          targetSection,
          targetPage,
          targetSubPage,
          contentTypes,
          videoUrl,
          parseInt(order) || 1,
        );
        console.log("✓ ContentManager: Content added");
        Alert.alert("Success", "Content added successfully");
      }

      // Reset form
      setTitle("");
      setDescription("");
      setCategory("general");
      setTargetSection("cattle");
      setTargetPage("CattleList");
      setTargetSubPage("");
      setSelectedContentTypes(["title", "description"]);
      setVideoUrl("");
      setOrder("1");
      setSelectedImage(null);
      setImagePreview(null);
      setShowAddForm(false);
      setIsEditMode(false);
      setSelectedContent(null);

      // Refresh content list
      fetchContent();
    } catch (error) {
      console.log("✗ ContentManager Error:", error.message);
      Alert.alert("Error", error.message);
    }
    setIsLoading(false);
  };

  const handleDeleteContent = async (contentId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this content?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              // Verify admin before deleting
              const storedIsAdmin = await AsyncStorage.getItem("isAdmin");
              const isAdmin =
                storedIsAdmin && JSON.parse(storedIsAdmin) === true;

              if (!isAdmin) {
                Alert.alert("Access Denied", "Only admins can delete content");
                return;
              }

              setIsLoading(true);
              console.log("ContentManager: Deleting content:", contentId);
              await deleteContent(contentId);
              console.log("✓ ContentManager: Content deleted");
              Alert.alert("Success", "Content deleted successfully");
              fetchContent();
            } catch (error) {
              console.log("✗ ContentManager Error deleting:", error.message);
              Alert.alert("Error", error.message);
            }
            setIsLoading(false);
          },
          style: "destructive",
        },
      ],
    );
  };

  const handleEditContent = (content) => {
    setTitle(content.title);
    setDescription(content.description);
    setCategory(content.category || "general");
    setTargetSection(content.targetSection || "cattle");
    setTargetPage(content.targetPage || "CattleList");
    setTargetSubPage(content.targetSubPage || "");
    setSelectedContentTypes(
      Array.isArray(content.contentTypes)
        ? content.contentTypes
        : ["title", "description"],
    );
    setVideoUrl(content.videoUrl || "");
    setOrder(String(content.order || 1));
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
          <Text style={styles.contentLocation}>
            📍{" "}
            {item.targetSection?.charAt(0).toUpperCase() +
              item.targetSection?.slice(1) || "cattle"}{" "}
            → {item.targetPage || ""}
            {item.targetSubPage ? ` → ${item.targetSubPage}` : ""}
          </Text>
          <Text style={styles.contentTypes}>
            Types:{" "}
            {Array.isArray(item.contentTypes)
              ? item.contentTypes.join(", ")
              : item.contentType || "N/A"}
          </Text>
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
        <ActivityIndicator
          size="large"
          color="#27ae60"
          style={{ marginTop: 20 }}
        />
      ) : contentList.length === 0 ? (
        <Text style={styles.emptyText}>
          No content found. Add your first page!
        </Text>
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

              {/* Title Input - MANDATORY */}
              <Text style={styles.label}>
                Title <Text style={styles.mandatoryIndicator}>*</Text> (5-100
                characters)
              </Text>
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

              {/* Description Input - OPTIONAL */}
              <Text style={styles.label}>
                Description (Optional - 10-2000 characters)
              </Text>
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Enter content description (optional)"
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

              {/* Target Section Selector */}
              <Text style={styles.label}>Target Section</Text>
              <View style={styles.dropdownContainer}>
                {Object.keys(sectionPages).map((section) => (
                  <TouchableOpacity
                    key={section}
                    style={[
                      styles.dropdownButton,
                      targetSection === section && styles.dropdownButtonActive,
                    ]}
                    onPress={() => {
                      setTargetSection(section);
                      setTargetPage(sectionPages[section][0]);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownButtonText,
                        targetSection === section &&
                          styles.dropdownButtonTextActive,
                      ]}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Target Page Selector */}
              <Text style={styles.label}>Target Page</Text>
              <View style={styles.dropdownContainer}>
                {availablePages.map((page) => (
                  <TouchableOpacity
                    key={page}
                    style={[
                      styles.dropdownButton,
                      targetPage === page && styles.dropdownButtonActive,
                    ]}
                    onPress={() => {
                      setTargetPage(page);
                      setTargetSubPage("");
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownButtonText,
                        targetPage === page && styles.dropdownButtonTextActive,
                      ]}
                    >
                      {page}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Target SubPage/Location Selector (if available) */}
              {availableSubPages.length > 0 && (
                <>
                  <Text style={styles.label}>Target Location (Optional)</Text>
                  <Text style={styles.sublabel}>
                    Selecting a location will automatically update the target
                    page
                  </Text>
                  <View style={styles.dropdownContainer}>
                    {availableSubPages.map((sub) => (
                      <TouchableOpacity
                        key={sub.key}
                        style={[
                          styles.dropdownButton,
                          targetSubPage === sub.key &&
                            styles.dropdownButtonActive,
                        ]}
                        onPress={() => {
                          setTargetSubPage(sub.key);
                          // Automatically update targetPage to the actual component page
                          if (subPageToPageMap[sub.key]) {
                            setTargetPage(subPageToPageMap[sub.key]);
                          }
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownButtonText,
                            targetSubPage === sub.key &&
                              styles.dropdownButtonTextActive,
                          ]}
                        >
                          {sub.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {/* Content Type Selector - Multiselect */}
              <Text style={styles.label}>
                Content Type{" "}
                <Text style={styles.mandatoryIndicator}>
                  * (select at least one)
                </Text>
              </Text>
              <View style={styles.dropdownContainer}>
                {availableContentTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.dropdownButton,
                      contentTypes.includes(type) &&
                        styles.dropdownButtonActive,
                    ]}
                    onPress={() => {
                      if (contentTypes.includes(type)) {
                        // Remove if already selected
                        if (contentTypes.length > 1) {
                          setSelectedContentTypes(
                            contentTypes.filter((t) => t !== type),
                          );
                        }
                      } else {
                        // Add if not selected
                        setSelectedContentTypes([...contentTypes, type]);
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownButtonText,
                        contentTypes.includes(type) &&
                          styles.dropdownButtonTextActive,
                      ]}
                    >
                      {contentTypes.includes(type) ? "✓ " : ""}
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Conditionally show Image field */}
              {contentTypes.includes("image") && (
                <View>
                  <Text style={styles.label}>Image (Optional)</Text>
                  <TouchableOpacity
                    style={styles.imagePicker}
                    onPress={pickImage}
                  >
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
                        <Text style={styles.imagePickerText}>Add Image</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {/* Conditionally show Video URL field */}
              {contentTypes.includes("videoLink") && (
                <View>
                  <Text style={styles.label}>Video URL (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={videoUrl}
                    onChangeText={setVideoUrl}
                    placeholderTextColor="#bdc3c7"
                  />
                </View>
              )}

              {/* Conditionally show Additional Info field */}
              {contentTypes.includes("additionalInfo") && (
                <View>
                  <Text style={styles.label}>Additional Info (Optional)</Text>
                  <TextInput
                    style={[styles.input, styles.descriptionInput]}
                    placeholder="Any additional information..."
                    value={order}
                    onChangeText={setOrder}
                    multiline
                    numberOfLines={3}
                    placeholderTextColor="#bdc3c7"
                  />
                </View>
              )}

              {/* Display Order Input */}
              <Text style={styles.label}>Display Order (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="1"
                value={order}
                onChangeText={setOrder}
                keyboardType="numeric"
                placeholderTextColor="#bdc3c7"
              />

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
                  style={[
                    styles.submitButton,
                    (!title.trim() ||
                      !description.trim() ||
                      title.length < 5 ||
                      title.length > 100 ||
                      description.length < 10 ||
                      description.length > 2000) &&
                      styles.submitButtonDisabled,
                  ]}
                  onPress={handleAddContent}
                  activeOpacity={0.7}
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
                {new Date(
                  selectedContent?.createdAt?.toDate?.(),
                ).toLocaleDateString()}
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
  contentLocation: {
    fontSize: 10,
    color: "#8e44ad",
    fontWeight: "500",
    marginBottom: 6,
  },
  contentTypes: {
    fontSize: 9,
    color: "#16a085",
    fontWeight: "400",
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
  sublabel: {
    fontSize: 11,
    color: "#7f8c8d",
    fontStyle: "italic",
    marginBottom: 10,
    marginTop: -5,
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
  submitButtonDisabled: {
    backgroundColor: "#bdc3c7",
    opacity: 0.6,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  mandatoryIndicator: {
    color: "#e74c3c",
    fontWeight: "bold",
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
  dropdownContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 15,
  },
  dropdownButton: {
    backgroundColor: "#ecf0f1",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#bdc3c7",
  },
  dropdownButtonActive: {
    backgroundColor: "#3498db",
    borderColor: "#2980b9",
  },
  dropdownButtonText: {
    fontSize: 12,
    color: "#7f8c8d",
    fontWeight: "600",
  },
  dropdownButtonTextActive: {
    color: "white",
  },
});

export default ContentManager;
