import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getAllJobPostings } from "../util/jobPostingService";

const { width } = Dimensions.get("window");

const CATEGORIES = [
  { id: 1, name: "All Jobs", key: "all" },
  { id: 2, name: "Veterinary", key: "veterinary" },
  { id: 3, name: "Dairy Farming", key: "dairy farming" },
  { id: 4, name: "Sheep Farming", key: "sheep farming" },
];

export default function JobOpportunities({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchText, selectedCategory, jobs]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const jobsList = await getAllJobPostings();
      setJobs(jobsList || []);
    } catch (error) {
      console.log("Error fetching jobs:", error.message);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  const filterJobs = () => {
    let filtered = jobs;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (job) => job.category && job.category.toLowerCase() === selectedCategory
      );
    }

    // Filter by search text
    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(search) ||
          (job.description && job.description.toLowerCase().includes(search))
      );
    }

    setFilteredJobs(filtered);
  };

  const renderJobCard = ({ item }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() =>
        navigation.navigate("JobDetails", { job: item })
      }
    >
      <View style={styles.jobHeader}>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.company} numberOfLines={1}>
            {item.companyName || "Company"}
          </Text>
        </View>
        <TouchableOpacity style={styles.bookmarkBtn}>
          <MaterialCommunityIcons name="bookmark-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.jobMeta}>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="map-marker" size={16} color="#999" />
          <Text style={styles.metaText} numberOfLines={1}>
            {item.location || "Location"}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <MaterialCommunityIcons name="briefcase" size={16} color="#999" />
          <Text style={styles.metaText}>{item.jobType || "Full Time"}</Text>
        </View>
      </View>

      <View style={styles.jobFooter}>
        <Text style={styles.timeAgo}>{item.postedTime || "Recently"}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Job Opportunities</Text>
        <Text style={styles.headerSubtitle}>Find the right opportunity for you</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs, roles, keywords..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <MaterialCommunityIcons name="close" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryBtn,
              selectedCategory === item.key && styles.categoryBtnActive,
            ]}
            onPress={() => setSelectedCategory(item.key)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item.key && styles.categoryTextActive,
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* Job Count */}
      <View style={styles.jobCountContainer}>
        <Text style={styles.jobCount}>
          {filteredJobs.length} Job{filteredJobs.length !== 1 ? "s" : ""} Available
        </Text>
        <TouchableOpacity style={styles.filterBtn}>
          <MaterialCommunityIcons name="tune" size={20} color="#387849" />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Jobs List */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <Text style={styles.loaderText}>Loading jobs...</Text>
        </View>
      ) : filteredJobs.length > 0 ? (
        <FlatList
          data={filteredJobs}
          renderItem={renderJobCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.jobsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#387849"]}
              tintColor="#387849"
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="briefcase-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No jobs found</Text>
          <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#387849",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#e8e8e8",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 44,
    elevation: 2,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 14,
    color: "#333",
  },
  categoriesContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoryBtnActive: {
    backgroundColor: "#387849",
    borderColor: "#387849",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  categoryTextActive: {
    color: "white",
  },
  jobCountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  jobCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#387849",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#387849",
    marginLeft: 4,
  },
  jobsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  jobCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "black",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  jobInfo: {
    flex: 1,
    marginRight: 10,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f1f1f",
    marginBottom: 4,
  },
  company: {
    fontSize: 13,
    color: "#666",
  },
  bookmarkBtn: {
    padding: 4,
  },
  jobMeta: {
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  metaText: {
    fontSize: 12,
    color: "#999",
    marginLeft: 6,
    flex: 1,
  },
  jobFooter: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  timeAgo: {
    fontSize: 12,
    color: "#999",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    fontSize: 16,
    color: "#999",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 6,
  },
});
