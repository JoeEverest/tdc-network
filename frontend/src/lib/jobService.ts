import { Job, CreateJobData, UpdateJobData, JobSearchFilters } from "../types";
import api from "./api";
import { useApiClient } from "./api";

// Get all jobs with optional filtering
export const getJobs = async (filters?: JobSearchFilters): Promise<Job[]> => {
  const searchParams = new URLSearchParams();

  if (filters?.skills) {
    searchParams.append("skills", filters.skills.join(","));
  }

  if (filters?.location) {
    searchParams.append("location", filters.location);
  }

  if (filters?.isRemote !== undefined) {
    searchParams.append("isRemote", filters.isRemote.toString());
  }

  if (filters?.salaryMin) {
    searchParams.append("salaryMin", filters.salaryMin.toString());
  }

  if (filters?.salaryMax) {
    searchParams.append("salaryMax", filters.salaryMax.toString());
  }

  const queryString = searchParams.toString();
  const response = await api.get(
    `/jobs${queryString ? `?${queryString}` : ""}`,
  );
  return response.data;
};

// Get specific job by ID
export const getJobById = async (jobId: string): Promise<Job> => {
  const response = await api.get(`/jobs/${jobId}`);
  return response.data;
};

// Create new job
export const createJob = async (jobData: CreateJobData): Promise<Job> => {
  const response = await api.post("/jobs", jobData);
  return response.data;
};

// Update job
export const updateJob = async (
  jobId: string,
  jobData: UpdateJobData,
): Promise<Job> => {
  const response = await api.put(`/jobs/${jobId}`, jobData);
  return response.data;
};

// Delete job
export const deleteJob = async (jobId: string): Promise<void> => {
  await api.delete(`/jobs/${jobId}`);
};

// Job API service functions
export const useJobService = () => {
  const api = useApiClient();

  return {
    // Get all jobs with optional filtering
    getAllJobs: async (params?: {
      skills?: string | string[];
      minSalary?: number;
      maxSalary?: number;
      status?: "open" | "closed";
    }): Promise<Job[]> => {
      const searchParams = new URLSearchParams();

      if (params?.skills) {
        if (Array.isArray(params.skills)) {
          searchParams.append("skills", params.skills.join(","));
        } else {
          searchParams.append("skills", params.skills);
        }
      }

      if (params?.minSalary) {
        searchParams.append("minSalary", params.minSalary.toString());
      }

      if (params?.maxSalary) {
        searchParams.append("maxSalary", params.maxSalary.toString());
      }

      if (params?.status) {
        searchParams.append("status", params.status);
      }

      const queryString = searchParams.toString();
      const response = await api.get(
        `/jobs${queryString ? `?${queryString}` : ""}`,
      );
      return response.data;
    },

    // Get specific job by ID
    getJobById: async (jobId: string): Promise<Job> => {
      const response = await api.get(`/jobs/${jobId}`);
      return response.data;
    },

    // Create new job
    createJob: async (jobData: {
      title: string;
      description: string;
      requiredSkills: { skillName: string; minRating: number }[];
      salary?: {
        min: number;
        max: number;
      };
    }): Promise<Job> => {
      const response = await api.post("/jobs", jobData);
      return response.data;
    },

    // Update job
    updateJob: async (
      jobId: string,
      jobData: {
        title?: string;
        description?: string;
        requiredSkills?: { skillName: string; minRating: number }[];
        salary?: {
          min: number;
          max: number;
        };
        status?: "open" | "closed";
      },
    ): Promise<Job> => {
      const response = await api.put(`/jobs/${jobId}`, jobData);
      return response.data;
    },

    // Delete job
    deleteJob: async (jobId: string): Promise<void> => {
      await api.delete(`/jobs/${jobId}`);
    },

    // Search jobs by skills and criteria
    searchJobs: async (params: {
      query?: string;
      skills?: string | string[];
      minSalary?: number;
      maxSalary?: number;
      status?: "open" | "closed";
    }): Promise<Job[]> => {
      const searchParams = new URLSearchParams();

      if (params.query) {
        searchParams.append("q", params.query);
      }

      if (params.skills) {
        if (Array.isArray(params.skills)) {
          searchParams.append("skills", params.skills.join(","));
        } else {
          searchParams.append("skills", params.skills);
        }
      }

      if (params.minSalary) {
        searchParams.append("minSalary", params.minSalary.toString());
      }

      if (params.maxSalary) {
        searchParams.append("maxSalary", params.maxSalary.toString());
      }

      if (params.status) {
        searchParams.append("status", params.status);
      }

      const response = await api.get(`/jobs/search?${searchParams.toString()}`);
      return response.data;
    },
  };
};
