import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
} from "react-native";
import { getAllFeedbackAdmin, updateFeedbackStatusAdmin } from "../../util/adminService";

const FeedbackViewer = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setIsLoading(true);
      const data = await getAllFeedbackAdmin();
      setFeedbackList(data);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
    setIsLoading(false);
  };

  const handleStatusChange = async (feedbackId, newStatus) => {
    try {
      await updateFeedbackStatusAdmin(feedbackId, newStatus);
      fetchFeedback();
      setSelectedFeedback(null);
      Alert.alert("Success", `Feedback marked as ${newStatus}`);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const filteredFeedback = feedbackList.filter((item) => {
    if (filterStatus === "all") return true;
    return item.status === filterStatus;
  });

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "#e74c3c";
      case "reviewed":
        return "#f39c12";
      case "resolved":
        return "#27ae60";
      default:
        return "#95a5a6";
    }
  };

  const renderFeedbackItem = ({ item }) => (
    <TouchableOpacity
      style={styles.feedbackCard}
      onPress={() => setSelectedFeedback(item)}
    >
      <View style={styles.feedbackHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.feedbackSubject}>{item.subject}</Text>
          <Text style={styles.feedbackEmail}>{item.email}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusBadgeColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.feedbackPreview} numberOfLines={2}>
        {item.message}
      </Text>
      <Text style={styles.feedbackDate}>
        {item.createdAt?.toDate ? new Date(item.createdAt.toDate()).toLocaleDateString() : "N/A"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterStatus === "all" && styles.filterButtonActive,
          ]}
          onPress={() => setFilterStatus("all")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterStatus === "all" && styles.filterButtonTextActive,
            ]}
          >
            All ({feedbackList.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filterStatus === "pending" && styles.filterButtonActive,
          ]}
          onPress={() => setFilterStatus("pending")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterStatus === "pending" && styles.filterButtonTextActive,
            ]}
          >
            Pending (
            {feedbackList.filter((f) => f.status === "pending").length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filterStatus === "reviewed" && styles.filterButtonActive,
          ]}
          onPress={() => setFilterStatus("reviewed")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterStatus === "reviewed" && styles.filterButtonTextActive,
            ]}
          >
            Reviewed (
            {feedbackList.filter((f) => f.status === "reviewed").length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Feedback List */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#27ae60" style={{ marginTop: 20 }} />
      ) : filteredFeedback.length === 0 ? (
        <Text style={styles.emptyText}>No feedback found</Text>
      ) : (
        <FlatList
          data={filteredFeedback}
          renderItem={renderFeedbackItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      )}

      {/* Feedback Detail Modal */}
      <Modal
        visible={!!selectedFeedback}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedFeedback(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>{selectedFeedback?.subject}</Text>
              <Text style={styles.modalEmail}>{selectedFeedback?.email}</Text>

              <View
                style={[
                  styles.modalStatusBadge,
                  { backgroundColor: getStatusBadgeColor(selectedFeedback?.status) },
                ]}
              >
                <Text style={styles.modalStatusText}>{selectedFeedback?.status}</Text>
              </View>

              <Text style={styles.modalSectionTitle}>Message:</Text>
              <Text style={styles.modalMessage}>{selectedFeedback?.message}</Text>

              <Text style={styles.modalDate}>
                Submitted:{" "}
                {selectedFeedback?.createdAt?.toDate ? new Date(selectedFeedback.createdAt.toDate()).toLocaleString() : "N/A"}
              </Text>

              <Text style={styles.modalSectionTitle}>Change Status:</Text>
              <View style={styles.statusButtonsContainer}>
                <TouchableOpacity
                  style={[styles.statusChangeButton, styles.pendingButton]}
                  onPress={() => handleStatusChange(selectedFeedback?.id, "pending")}
                >
                  <Text style={styles.statusChangeButtonText}>Pending</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.statusChangeButton, styles.reviewedButton]}
                  onPress={() => handleStatusChange(selectedFeedback?.id, "reviewed")}
                >
                  <Text style={styles.statusChangeButtonText}>Reviewed</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.statusChangeButton, styles.resolvedButton]}
                  onPress={() => handleStatusChange(selectedFeedback?.id, "resolved")}
                >
                  <Text style={styles.statusChangeButtonText}>Resolved</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedFeedback(null)}
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
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 10,
  },
  filterButton: {
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#bdc3c7",
  },
  filterButtonActive: {
    backgroundColor: "#27ae60",
    borderColor: "#27ae60",
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#7f8c8d",
  },
  filterButtonTextActive: {
    color: "white",
  },
  feedbackCard: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  feedbackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  feedbackSubject: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  feedbackEmail: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  statusBadge: {
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "white",
  },
  feedbackPreview: {
    fontSize: 13,
    color: "#555",
    marginBottom: 8,
  },
  feedbackDate: {
    fontSize: 11,
    color: "#95a5a6",
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
    maxHeight: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  modalEmail: {
    fontSize: 12,
    color: "#7f8c8d",
    marginBottom: 10,
  },
  modalStatusBadge: {
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  modalStatusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
    marginTop: 15,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalDate: {
    fontSize: 12,
    color: "#95a5a6",
    marginBottom: 15,
  },
  statusButtonsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  statusChangeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  pendingButton: {
    backgroundColor: "#e74c3c",
  },
  reviewedButton: {
    backgroundColor: "#f39c12",
  },
  resolvedButton: {
    backgroundColor: "#27ae60",
  },
  statusChangeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
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

export default FeedbackViewer;
