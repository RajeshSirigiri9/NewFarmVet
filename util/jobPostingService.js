import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config";

/**
 * Save a job posting to Firestore
 * Integrates with the admin content system
 * Section: "careers", Page: "JobOpportunities"
 */
export const saveJobPosting = async (jobData) => {
  try {
    // Create the job document with all required fields
    const jobDocument = {
      // Basic info
      title: jobData.title,
      companyName: jobData.companyName,
      category: jobData.category,
      jobType: jobData.jobType,
      location: jobData.location,
      vacancies: jobData.vacancies,

      // Requirements
      qualification: jobData.qualification,
      experience: jobData.experience,
      salary: jobData.salary,
      description: jobData.description,

      // Additional info
      benefits: jobData.benefits || [],
      otherBenefits: jobData.otherBenefits,
      contactPerson: jobData.contactPerson,
      phone: jobData.phone,

      // Metadata
      status: jobData.status || "active",
      postedDate: jobData.postedDate,
      postedTime: jobData.postedTime,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),

      // Admin content integration
      section: "careers",
      page: "JobOpportunities",
      type: "job_posting",
    };

    // Save to Firestore adminContent collection
    const docRef = await addDoc(
      collection(db, "adminContent"),
      jobDocument
    );

    console.log("Job posting saved with ID:", docRef.id);
    return {
      success: true,
      jobId: docRef.id,
      message: "Job posted successfully!",
    };
  } catch (error) {
    console.error("Error saving job posting:", error);
    throw error;
  }
};

/**
 * Get all job postings from a specific category
 */
export const getJobsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, "adminContent"),
      where("section", "==", "careers"),
      where("page", "==", "JobOpportunities"),
      where("category", "==", category),
      where("status", "==", "active")
    );

    const snapshot = await getDocs(q);
    const jobs = [];

    snapshot.forEach((doc) => {
      jobs.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return jobs;
  } catch (error) {
    console.error("Error fetching jobs by category:", error);
    return [];
  }
};

/**
 * Get all active job postings for Job Opportunities page
 */
export const getAllJobPostings = async () => {
  try {
    const q = query(
      collection(db, "adminContent"),
      where("section", "==", "careers"),
      where("page", "==", "JobOpportunities"),
      where("status", "==", "active")
    );

    const snapshot = await getDocs(q);
    const jobs = [];

    snapshot.forEach((doc) => {
      jobs.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return jobs;
  } catch (error) {
    console.error("Error fetching job postings:", error);
    return [];
  }
};

/**
 * Get all job postings including drafts (Admin only)
 */
export const getAllJobPostingsForAdmin = async () => {
  try {
    const q = query(
      collection(db, "adminContent"),
      where("section", "==", "careers"),
      where("page", "==", "JobOpportunities")
    );

    const snapshot = await getDocs(q);
    const jobs = [];

    snapshot.forEach((doc) => {
      jobs.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return jobs;
  } catch (error) {
    console.error("Error fetching admin job postings:", error);
    return [];
  }
};

/**
 * Update job posting status (publish/unpublish/delete)
 */
export const updateJobPostingStatus = async (jobId, status) => {
  try {
    const jobRef = doc(db, "adminContent", jobId);
    await updateDoc(jobRef, {
      status: status,
      updatedAt: Timestamp.now(),
    });

    console.log("Job posting status updated:", jobId);
    return {
      success: true,
      message: "Job posting status updated!",
    };
  } catch (error) {
    console.error("Error updating job posting status:", error);
    throw error;
  }
};

/**
 * Update job posting details
 */
export const updateJobPosting = async (jobId, updates) => {
  try {
    const jobRef = doc(db, "adminContent", jobId);
    await updateDoc(jobRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });

    console.log("Job posting updated:", jobId);
    return {
      success: true,
      message: "Job posting updated!",
    };
  } catch (error) {
    console.error("Error updating job posting:", error);
    throw error;
  }
};

/**
 * Delete a job posting
 */
export const deleteJobPosting = async (jobId) => {
  try {
    await updateJobPostingStatus(jobId, "deleted");
    console.log("Job posting deleted:", jobId);
    return {
      success: true,
      message: "Job posting deleted!",
    };
  } catch (error) {
    console.error("Error deleting job posting:", error);
    throw error;
  }
};

/**
 * Search jobs by keyword
 */
export const searchJobs = async (keyword) => {
  try {
    const q = query(
      collection(db, "adminContent"),
      where("section", "==", "careers"),
      where("page", "==", "JobOpportunities"),
      where("status", "==", "active")
    );

    const snapshot = await getDocs(q);
    const jobs = [];
    const lowerKeyword = keyword.toLowerCase();

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (
        data.title.toLowerCase().includes(lowerKeyword) ||
        data.companyName.toLowerCase().includes(lowerKeyword) ||
        data.description.toLowerCase().includes(lowerKeyword) ||
        data.location.toLowerCase().includes(lowerKeyword)
      ) {
        jobs.push({
          id: doc.id,
          ...data,
        });
      }
    });

    return jobs;
  } catch (error) {
    console.error("Error searching jobs:", error);
    return [];
  }
};
