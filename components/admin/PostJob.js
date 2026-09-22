import React, { useState, useContext } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLanguage } from "../../store/LanguageProvider";
import { useToast, ToastContext } from "../../util/ToastNotification";
import { saveJobPosting } from "../../util/jobPostingService";

const { width } = Dimensions.get("window");

const STEPS = [
  { id: 1, title: "Job Details" },
  { id: 2, title: "Requirements" },
  { id: 3, title: "Preview & Publish" },
];

const BENEFITS_OPTIONS = [
  { id: "accommodation", label: "Accommodation", icon: "home" },
  { id: "food", label: "Food", icon: "silverware-fork-knife" },
  { id: "transport", label: "Transport", icon: "car" },
  { id: "pf_esi", label: "PF & ESI", icon: "file-document" },
  { id: "medical", label: "Medical", icon: "hospital-box" },
  { id: "incentives", label: "Incentives", icon: "gift" },
];

const JOB_CATEGORIES = [
  "Veterinary",
  "Dairy Farming",
  "Sheep Farming",
  "Research",
  "Teaching",
  "Extension",
  "Management",
  "Other",
];

const JOB_TYPES = ["Full Time", "Part Time", "Contract", "Internship"];

const EXPERIENCE_LEVELS = [
  "Fresher",
  "1-3 Years",
  "3-5 Years",
  "5-10 Years",
  "10+ Years",
];

export default function PostJob({ navigation }) {
  const { language } = useLanguage();
  const toastContext = useContext(ToastContext);
  const { show } = useToast(toastContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Job Details
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [vacancies, setVacancies] = useState("");

  // Step 2: Requirements
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  // Step 3: Additional Info
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [otherBenefits, setOtherBenefits] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const toggleBenefit = (benefitId) => {
    setSelectedBenefits((prev) =>
      prev.includes(benefitId)
        ? prev.filter((id) => id !== benefitId)
        : [...prev, benefitId]
    );
  };

  const validateStep1 = () => {
    if (!jobTitle.trim()) {
      show("Job Title is required", "error");
      return false;
    }
    if (!company.trim()) {
      show("Company/Organization is required", "error");
      return false;
    }
    if (!category) {
      show("Job Category is required", "error");
      return false;
    }
    if (!jobType) {
      show("Job Type is required", "error");
      return false;
    }
    if (!location.trim()) {
      show("Location is required", "error");
      return false;
    }
    if (!vacancies.trim()) {
      show("Number of Vacancies is required", "error");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!qualification.trim()) {
      show("Qualification is required", "error");
      return false;
    }
    if (!experience) {
      show("Experience level is required", "error");
      return false;
    }
    if (!salaryRange.trim()) {
      show("Salary Range is required", "error");
      return false;
    }
    if (!jobDescription.trim()) {
      show("Job Description is required", "error");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!contactPerson.trim()) {
      show("Contact Person is required", "error");
      return false;
    }
    if (!phoneNumber.trim()) {
      show("Phone Number is required", "error");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = async () => {
    if (!validateStep3()) return;

    setLoading(true);
    try {
      const jobData = {
        title: jobTitle.trim(),
        companyName: company.trim(),
        category: category,
        jobType: jobType,
        location: location.trim(),
        vacancies: parseInt(vacancies),
        qualification: qualification.trim(),
        experience: experience,
        salary: salaryRange.trim(),
        description: jobDescription.trim(),
        benefits: selectedBenefits.map((benefitId) => {
          const benefit = BENEFITS_OPTIONS.find((b) => b.id === benefitId);
          return benefit ? benefit.label : benefitId;
        }),
        otherBenefits: otherBenefits.trim() || null,
        contactPerson: contactPerson.trim(),
        phone: phoneNumber.trim(),
        postedDate: new Date().toLocaleDateString("en-IN"),
        postedTime: new Date().toLocaleString("en-IN"),
        status: "active",
      };

      await saveJobPosting(jobData);

      show("✓ Job posted successfully!", "success");

      // Reset form
      setTimeout(() => {
        setCurrentStep(1);
        setJobTitle("");
        setCompany("");
        setCategory("");
        setJobType("");
        setLocation("");
        setVacancies("");
        setQualification("");
        setExperience("");
        setSalaryRange("");
        setJobDescription("");
        setSelectedBenefits([]);
        setOtherBenefits("");
        setContactPerson("");
        setPhoneNumber("");
        navigation.goBack();
      }, 1500);
    } catch (error) {
      console.error("Error posting job:", error);
      show("✗ Failed to post job. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    Alert.alert("Save as Draft", "Save this job posting as draft?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Save Draft",
        onPress: async () => {
          setLoading(true);
          try {
            const jobData = {
              title: jobTitle.trim(),
              companyName: company.trim(),
              category: category,
              jobType: jobType,
              location: location.trim(),
              vacancies: vacancies ? parseInt(vacancies) : 0,
              qualification: qualification.trim(),
              experience: experience,
              salary: salaryRange.trim(),
              description: jobDescription.trim(),
              benefits: selectedBenefits.map((benefitId) => {
                const benefit = BENEFITS_OPTIONS.find((b) => b.id === benefitId);
                return benefit ? benefit.label : benefitId;
              }),
              otherBenefits: otherBenefits.trim() || null,
              contactPerson: contactPerson.trim(),
              phone: phoneNumber.trim(),
              status: "draft",
            };

            await saveJobPosting(jobData);
            show("✓ Job saved as draft!", "success");

            setTimeout(() => {
              navigation.goBack();
            }, 1000);
          } catch (error) {
            console.error("Error saving draft:", error);
            show("✗ Failed to save draft", "error");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post New Job</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Step Indicators */}
      <View style={styles.stepsContainer}>
        {STEPS.map((step, index) => (
          <View key={step.id} style={styles.stepWrapper}>
            <TouchableOpacity
              style={[
                styles.stepCircle,
                currentStep >= step.id && styles.stepCircleActive,
              ]}
              onPress={() => {
                if (step.id < currentStep) setCurrentStep(step.id);
              }}
            >
              {currentStep > step.id ? (
                <MaterialCommunityIcons name="check" size={20} color="white" />
              ) : (
                <Text
                  style={[
                    styles.stepNumber,
                    currentStep >= step.id && styles.stepNumberActive,
                  ]}
                >
                  {step.id}
                </Text>
              )}
            </TouchableOpacity>

            {index < STEPS.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  currentStep > step.id && styles.stepLineActive,
                ]}
              />
            )}
          </View>
        ))}
      </View>

      {/* Step Titles */}
      <View style={styles.stepTitlesContainer}>
        {STEPS.map((step) => (
          <Text
            key={step.id}
            style={[
              styles.stepTitleText,
              currentStep >= step.id && styles.stepTitleTextActive,
            ]}
          >
            {step.title}
          </Text>
        ))}
      </View>

      {/* Step Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <Text style={styles.label}>Job Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Veterinary Doctor"
              value={jobTitle}
              onChangeText={setJobTitle}
              placeholderTextColor="#bbb"
            />

            <Text style={styles.label}>Company / Organization *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Pets & Paws Animal Hospital"
              value={company}
              onChangeText={setCompany}
              placeholderTextColor="#bbb"
            />

            <Text style={styles.label}>Job Category *</Text>
            <View style={styles.dropdown}>
              <MaterialCommunityIcons name="chevron-down" size={20} color="#999" />
              <Text
                style={[
                  styles.dropdownText,
                  !category && styles.placeholderText,
                ]}
              >
                {category || "Select Category"}
              </Text>
            </View>
            {/* Category Picker */}
            <View style={styles.pickerContainer}>
              {JOB_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.pickerItem,
                    category === cat && styles.pickerItemSelected,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      category === cat && styles.pickerItemTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Job Type *</Text>
            <View style={styles.buttonGroup}>
              {JOB_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    jobType === type && styles.typeButtonActive,
                  ]}
                  onPress={() => setJobType(type)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      jobType === type && styles.typeButtonTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Ahmedabad, Gujarat"
              value={location}
              onChangeText={setLocation}
              placeholderTextColor="#bbb"
            />

            <Text style={styles.label}>Number of Vacancies *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2"
              value={vacancies}
              onChangeText={setVacancies}
              keyboardType="number-pad"
              placeholderTextColor="#bbb"
            />
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Requirements & Details</Text>

            <Text style={styles.label}>Qualification *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. BVSc & AH"
              value={qualification}
              onChangeText={setQualification}
              placeholderTextColor="#bbb"
            />

            <Text style={styles.label}>Experience Required *</Text>
            <View style={styles.dropdown}>
              <MaterialCommunityIcons name="chevron-down" size={20} color="#999" />
              <Text
                style={[
                  styles.dropdownText,
                  !experience && styles.placeholderText,
                ]}
              >
                {experience || "Select Experience"}
              </Text>
            </View>
            {/* Experience Picker */}
            <View style={styles.pickerContainer}>
              {EXPERIENCE_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.pickerItem,
                    experience === level && styles.pickerItemSelected,
                  ]}
                  onPress={() => setExperience(level)}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      experience === level && styles.pickerItemTextSelected,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Salary Range *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. ₹25,000 - ₹40,000 per month"
              value={salaryRange}
              onChangeText={setSalaryRange}
              placeholderTextColor="#bbb"
            />

            <Text style={styles.label}>Job Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the job role, responsibilities and expectations..."
              value={jobDescription}
              onChangeText={setJobDescription}
              multiline={true}
              numberOfLines={5}
              textAlignVertical="top"
              placeholderTextColor="#bbb"
            />
          </View>
        )}

        {currentStep === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Additional Information</Text>

            <Text style={styles.label}>Benefits</Text>
            <View style={styles.benefitsGrid}>
              {BENEFITS_OPTIONS.map((benefit) => (
                <TouchableOpacity
                  key={benefit.id}
                  style={[
                    styles.benefitItem,
                    selectedBenefits.includes(benefit.id) &&
                      styles.benefitItemSelected,
                  ]}
                  onPress={() => toggleBenefit(benefit.id)}
                >
                  <View
                    style={[
                      styles.benefitIconBg,
                      selectedBenefits.includes(benefit.id) &&
                        styles.benefitIconBgActive,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={benefit.icon}
                      size={24}
                      color={
                        selectedBenefits.includes(benefit.id)
                          ? "white"
                          : "#999"
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.benefitLabel,
                      selectedBenefits.includes(benefit.id) &&
                        styles.benefitLabelActive,
                    ]}
                  >
                    {benefit.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Other Benefit</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Training, Bonus, etc."
              value={otherBenefits}
              onChangeText={setOtherBenefits}
              placeholderTextColor="#bbb"
            />

            <Text style={styles.label}>Contact Person *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Dr. Ravi Patel"
              value={contactPerson}
              onChangeText={setContactPerson}
              placeholderTextColor="#bbb"
            />

            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. +91 98765 43210"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholderTextColor="#bbb"
            />
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#387849" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        {currentStep < 3 ? (
          <TouchableOpacity
            style={[styles.nextButton, currentStep === 1 && { marginLeft: 0 }]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.draftButton}
              onPress={handleSaveDraft}
              disabled={loading}
            >
              <Text style={styles.draftButtonText}>Post as Draft</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.publishButton}
              onPress={handlePublish}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={styles.publishButtonText}>Publish Job</Text>
                  <MaterialCommunityIcons name="send" size={20} color="white" />
                </>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#387849",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "white",
  },
  stepWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddd",
  },
  stepCircleActive: {
    backgroundColor: "#387849",
    borderColor: "#387849",
  },
  stepNumber: {
    color: "#999",
    fontSize: 16,
    fontWeight: "600",
  },
  stepNumberActive: {
    color: "white",
  },
  stepLine: {
    width: 32,
    height: 2,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: "#387849",
  },
  stepTitlesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "white",
  },
  stepTitleText: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
    flex: 1,
    textAlign: "center",
  },
  stepTitleTextActive: {
    color: "#387849",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  stepContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f1f1f",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
    backgroundColor: "white",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  dropdownText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    marginLeft: 8,
  },
  placeholderText: {
    color: "#bbb",
  },
  pickerContainer: {
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 6,
    overflow: "hidden",
  },
  pickerItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "white",
  },
  pickerItemSelected: {
    backgroundColor: "#e8f5e9",
  },
  pickerItemText: {
    fontSize: 14,
    color: "#333",
  },
  pickerItemTextSelected: {
    color: "#387849",
    fontWeight: "600",
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
  },
  typeButtonActive: {
    backgroundColor: "#387849",
    borderColor: "#387849",
  },
  typeButtonText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  typeButtonTextActive: {
    color: "white",
  },
  benefitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  benefitItem: {
    width: (width - 72) / 3,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
  },
  benefitItemSelected: {
    borderColor: "#387849",
    backgroundColor: "#e8f5e9",
  },
  benefitIconBg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  benefitIconBgActive: {
    backgroundColor: "#387849",
  },
  benefitLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
  },
  benefitLabelActive: {
    color: "#387849",
    fontWeight: "600",
  },
  actionBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
    backgroundColor: "white",
    gap: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
  },
  backButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#387849",
    backgroundColor: "white",
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#387849",
    marginLeft: 6,
  },
  nextButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: "#387849",
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    marginRight: 6,
  },
  draftButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#387849",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  draftButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#387849",
  },
  publishButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: "#387849",
    justifyContent: "center",
    alignItems: "center",
  },
  publishButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    marginRight: 6,
  },
});
