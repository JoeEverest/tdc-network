import { useQuery, useMutation, useQueryClient } from "react-query";
import * as jobService from "../lib/jobService";
import {
	CreateJobData,
	UpdateJobData,
	JobSearchFilters,
	JobApplication,
} from "../types";

// Query keys for caching
export const jobKeys = {
	all: ["jobs"] as const,
	lists: () => [...jobKeys.all, "list"] as const,
	list: (filters: JobSearchFilters) => [...jobKeys.lists(), filters] as const,
	details: () => [...jobKeys.all, "detail"] as const,
	detail: (id: string) => [...jobKeys.details(), id] as const,
	applications: () => [...jobKeys.all, "applications"] as const,
	userApplications: (userId: string) =>
		[...jobKeys.applications(), "user", userId] as const,
	jobApplications: (jobId: string) =>
		[...jobKeys.applications(), "job", jobId] as const,
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

// Get user's job applications
export const useUserApplications = (userId: string) => {
	return useQuery({
		queryKey: jobKeys.userApplications(userId),
		queryFn: () => jobService.getUserApplications(userId),
		staleTime: 5 * 60 * 1000,
		enabled: !!userId,
	});
};

// Get applications for a specific job
export const useJobApplications = (jobId: string) => {
	return useQuery({
		queryKey: jobKeys.jobApplications(jobId),
		queryFn: () => jobService.getJobApplications(jobId),
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
			// Remove job applications from cache
			queryClient.removeQueries(jobKeys.jobApplications(jobId));
			// Invalidate job lists
			queryClient.invalidateQueries(jobKeys.lists());
		},
	});
};

// Apply to job mutation
export const useApplyToJob = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			jobId,
			userId,
			coverLetter,
		}: {
			jobId: string;
			userId: string;
			coverLetter?: string;
		}) => jobService.applyToJob(jobId, userId, coverLetter),
		onSuccess: (_, { jobId, userId }) => {
			// Invalidate user applications
			queryClient.invalidateQueries(jobKeys.userApplications(userId));
			// Invalidate job applications
			queryClient.invalidateQueries(jobKeys.jobApplications(jobId));
			// Invalidate job detail to update application count
			queryClient.invalidateQueries(jobKeys.detail(jobId));
		},
	});
};

// Withdraw application mutation
export const useWithdrawApplication = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ jobId, userId }: { jobId: string; userId: string }) =>
			jobService.withdrawApplication(jobId, userId),
		onSuccess: (_, { jobId, userId }) => {
			// Invalidate user applications
			queryClient.invalidateQueries(jobKeys.userApplications(userId));
			// Invalidate job applications
			queryClient.invalidateQueries(jobKeys.jobApplications(jobId));
			// Invalidate job detail to update application count
			queryClient.invalidateQueries(jobKeys.detail(jobId));
		},
	});
};

// Update application status mutation (for employers)
export const useUpdateApplicationStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			jobId,
			userId,
			status,
		}: {
			jobId: string;
			userId: string;
			status: JobApplication["status"];
		}) => jobService.updateApplicationStatus(jobId, userId, status),
		onSuccess: (_, { jobId, userId }) => {
			// Invalidate user applications
			queryClient.invalidateQueries(jobKeys.userApplications(userId));
			// Invalidate job applications
			queryClient.invalidateQueries(jobKeys.jobApplications(jobId));
		},
	});
};
