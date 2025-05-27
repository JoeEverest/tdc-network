import { useQuery, useMutation, useQueryClient } from "react-query";
import * as jobService from "../lib/jobService";
import { CreateJobData, UpdateJobData, JobSearchFilters } from "../types";

// Query keys for caching
export const jobKeys = {
  all: ["jobs"] as const,
  lists: () => [...jobKeys.all, "list"] as const,
  list: (filters: JobSearchFilters) => [...jobKeys.lists(), filters] as const,
  details: () => [...jobKeys.all, "detail"] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
};

// Get all jobs with optional filters
export const useJobs = (filters: JobSearchFilters = {}) => {
  return useQuery({
    queryKey: jobKeys.list(filters),
    queryFn: () => jobService.getJobs(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true,
  });
};

// Get job by ID
export const useJob = (jobId: string) => {
  return useQuery({
    queryKey: jobKeys.detail(jobId),
    queryFn: () => jobService.getJobById(jobId),
    staleTime: 5 * 60 * 1000,
    enabled: !!jobId,
  });
};

// Create job mutation
export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobData: CreateJobData) => jobService.createJob(jobData),
    onSuccess: () => {
      // Invalidate all job lists to include the new job
      queryClient.invalidateQueries(jobKeys.lists());
    },
  });
};

// Update job mutation
export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      jobData,
    }: {
      jobId: string;
      jobData: UpdateJobData;
    }) => jobService.updateJob(jobId, jobData),
    onSuccess: (updatedJob, { jobId }) => {
      // Update specific job in cache
      queryClient.setQueryData(jobKeys.detail(jobId), updatedJob);
      // Invalidate job lists to reflect changes
      queryClient.invalidateQueries(jobKeys.lists());
    },
  });
};

// Delete job mutation
export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => jobService.deleteJob(jobId),
    onSuccess: (_, jobId) => {
      // Remove job from cache
      queryClient.removeQueries(jobKeys.detail(jobId));
      // Invalidate job lists
      queryClient.invalidateQueries(jobKeys.lists());
    },
  });
};
