import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  Share,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function JobDetails({ route, navigation }) {
  const { job } = route.params;
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleApply = () => {
    Alert.alert(
      "Apply for Job",
      `Would you like to apply for ${job.title}?`,
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Apply Now",
          onPress: () => {
            Alert.alert(
              "Application Submitted",
              "Your application has been submitted successfully!"
            );
          },
        },
      ]
    );
  };

  const handleContactEmployer = () => {
    Alert.alert(
      "Contact Employer",
      "How would you like to contact the employer?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Call",
          onPress: () => {
            Linking.openURL(`tel:${job.phone || "9876543210"}`);
          },
        },
        {
          text: "Email",
          onPress: () => {
            Linking.openURL(`mailto:${job.email || "contact@company.com"}`);
          },
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this job: ${job.title} at ${job.companyName}`,
        title: job.title,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.bookmarkContainer}>
            <TouchableOpacity
              style={styles.bookmarkBtn}
              onPress={() => setIsBookmarked(!isBookmarked)}
            >
              <MaterialCommunityIcons
                name={isBookmarked ? "bookmark" : "bookmark-outline"}
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Company Logo & Title */}
        <View style={styles.jobTitleSection}>
          <View style={styles.companyLogoContainer}>
            <MaterialCommunityIcons name="hospital-box" size={48} color="white" />
          </View>

          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.companyName}>{job.companyName || "Company"}</Text>

          <View style={styles.jobTypeContainer}>
            <Text
              style={[
                styles.jobTypeTag,
                {
                  backgroundColor:
                    job.jobType === "Full Time"
                      ? "#4CAF50"
                      : job.jobType === "Part Time"
                      ? "#FF9800"
                      : "#2196F3",
                },
              ]}
            >
              {job.jobType || "Full Time"}
            </Text>
          </View>
        </View>

        {/* Location & Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#387849" />
            <Text style={styles.detailText}>{job.location || "Location"}</Text>
          </View>

          {job.salary && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="cash" size={20} color="#387849" />
              <Text style={styles.detailText}>{job.salary}</Text>
            </View>
          )}

          {job.experience && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="briefcase-outline"
                size={20}
                color="#387849"
              />
              <Text style={styles.detailText}>{job.experience}</Text>
            </View>
          )}

          {job.postedDate && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="calendar" size={20} color="#387849" />
              <Text style={styles.detailText}>Posted on {job.postedDate}</Text>
            </View>
          )}
        </View>

        {/* Job Description */}
        {job.description && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Job Description</Text>
            <Text style={styles.sectionContent}>{job.description}</Text>
          </View>
        )}

        {/* Key Responsibilities */}
        {job.responsibilities && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Key Responsibilities</Text>
            {job.responsibilities.map((resp, index) => (
              <View key={index} style={styles.bulletPoint}>
                <Text style={styles.bulletMarker}>•</Text>
                <Text style={styles.bulletText}>{resp}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Requirements */}
        {job.requirements && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            {job.requirements.map((req, index) => (
              <View key={index} style={styles.bulletPoint}>
                <Text style={styles.bulletMarker}>•</Text>
                <Text style={styles.bulletText}>{req}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Benefits */}
        {job.benefits && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Benefits</Text>
            <View style={styles.benefitsGrid}>
              {job.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitCard}>
                  <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Spacing */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.applyBtn}
          onPress={handleApply}
        >
          <MaterialCommunityIcons name="send" size={20} color="white" />
          <Text style={styles.applyBtnText}>Apply Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactBtn}
          onPress={handleContactEmployer}
        >
          <MaterialCommunityIcons name="phone" size={20} color="#387849" />
          <Text style={styles.contactBtnText}>Contact Employer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareBtn}
          onPress={handleShare}
        >
          <MaterialCommunityIcons name="share-variant" size={20} color="#387849" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    backgroundColor: "#387849",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 20,
  },
  backBtn: {
    padding: 8,
  },
  bookmarkContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  bookmarkBtn: {
    padding: 8,
  },
  jobTitleSection: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  companyLogoContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#387849",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f1f1f",
    textAlign: "center",
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  jobTypeContainer: {
    marginTop: 8,
  },
  jobTypeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    overflow: "hidden",
  },
  detailsSection: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginVertical: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 12,
    flex: 1,
  },
  contentSection: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f1f1f",
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 10,
  },
  bulletMarker: {
    fontSize: 16,
    color: "#387849",
    marginRight: 10,
    fontWeight: "bold",
  },
  bulletText: {
    fontSize: 14,
    color: "#555",
    flex: 1,
    lineHeight: 20,
  },
  benefitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  benefitCard: {
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
  },
  benefitText: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  actionContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
    elevation: 8,
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
  },
  applyBtn: {
    flex: 1,
    backgroundColor: "#387849",
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  applyBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
  contactBtn: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#387849",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  contactBtnText: {
    color: "#387849",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  shareBtn: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
});
