import { useQuery, useMutation, useQueryClient } from "react-query";
import * as endorsementService from "../lib/endorsementService";
import { Endorsement, CreateEndorsementData } from "../types";

// Query keys for caching
export const endorsementKeys = {
	all: ["endorsements"] as const,
	lists: () => [...endorsementKeys.all, "list"] as const,
	userReceived: (userId: string) =>
		[...endorsementKeys.lists(), "received", userId] as const,
	userGiven: (userId: string) =>
		[...endorsementKeys.lists(), "given", userId] as const,
	skillEndorsements: (userId: string, skillId: string) =>
		[...endorsementKeys.lists(), "skill", userId, skillId] as const,
	details: () => [...endorsementKeys.all, "detail"] as const,
	detail: (id: string) => [...endorsementKeys.details(), id] as const,
	eligibility: () => [...endorsementKeys.all, "eligibility"] as const,
	canEndorse: (endorserId: string, userId: string, skillId: string) =>
		[
			...endorsementKeys.eligibility(),
			endorserId,
			userId,
			skillId,
		] as const,
};

// Get endorsements received by a user
export const useUserEndorsements = (userId: string) => {
	return useQuery({
		queryKey: endorsementKeys.userReceived(userId),
		queryFn: () => endorsementService.getUserEndorsements(userId),
		staleTime: 5 * 60 * 1000,
		enabled: !!userId,
	});
};

// Get endorsements given by a user
export const useUserGivenEndorsements = (userId: string) => {
	return useQuery({
		queryKey: endorsementKeys.userGiven(userId),
		queryFn: () => endorsementService.getUserGivenEndorsements(userId),
		staleTime: 5 * 60 * 1000,
		enabled: !!userId,
	});
};

// Get endorsements for a specific skill
export const useSkillEndorsements = (userId: string, skillId: string) => {
	return useQuery({
		queryKey: endorsementKeys.skillEndorsements(userId, skillId),
		queryFn: () => endorsementService.getSkillEndorsements(userId, skillId),
		staleTime: 5 * 60 * 1000,
		enabled: !!userId && !!skillId,
	});
};

// Get endorsement by ID
export const useEndorsement = (endorsementId: string) => {
	return useQuery({
		queryKey: endorsementKeys.detail(endorsementId),
		queryFn: () => endorsementService.getEndorsementById(endorsementId),
		staleTime: 10 * 60 * 1000,
		enabled: !!endorsementId,
	});
};

// Check if user can endorse another user's skill
export const useCanEndorse = (
	endorserId: string,
	userId: string,
	skillId: string
) => {
	return useQuery({
		queryKey: endorsementKeys.canEndorse(endorserId, userId, skillId),
		queryFn: () =>
			endorsementService.canEndorseSkill(endorserId, userId, skillId),
		staleTime: 2 * 60 * 1000,
		enabled: !!endorserId && !!userId && !!skillId,
	});
};

// Create endorsement mutation
export const useCreateEndorsement = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (endorsementData: CreateEndorsementData) =>
			endorsementService.createEndorsement(endorsementData),
		onSuccess: (newEndorsement) => {
			const { userId, skillId, endorserId } = newEndorsement;

			// Invalidate endorsement lists for the user who received the endorsement
			queryClient.invalidateQueries(endorsementKeys.userReceived(userId));

			// Invalidate endorsement lists for the user who gave the endorsement
			queryClient.invalidateQueries(
				endorsementKeys.userGiven(endorserId)
			);

			// Invalidate skill-specific endorsements
			queryClient.invalidateQueries(
				endorsementKeys.skillEndorsements(userId, skillId)
			);

			// Invalidate can endorse queries
			queryClient.invalidateQueries(endorsementKeys.eligibility());

			// Invalidate user data as skills might have updated ratings
			queryClient.invalidateQueries(["users", "detail", userId]);
			queryClient.invalidateQueries(["users", "skills"]);
		},
	});
};

// Update endorsement mutation
export const useUpdateEndorsement = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			endorsementId,
			endorsementData,
		}: {
			endorsementId: string;
			endorsementData: Partial<Endorsement>;
		}) =>
			endorsementService.updateEndorsement(
				endorsementId,
				endorsementData
			),
		onSuccess: (updatedEndorsement, { endorsementId }) => {
			const { userId, skillId, endorserId } = updatedEndorsement;

			// Update specific endorsement in cache
			queryClient.setQueryData(
				endorsementKeys.detail(endorsementId),
				updatedEndorsement
			);

			// Invalidate related queries
			queryClient.invalidateQueries(endorsementKeys.userReceived(userId));
			queryClient.invalidateQueries(
				endorsementKeys.userGiven(endorserId)
			);
			queryClient.invalidateQueries(
				endorsementKeys.skillEndorsements(userId, skillId)
			);

			// Invalidate user data
			queryClient.invalidateQueries(["users", "detail", userId]);
		},
	});
};

// Delete endorsement mutation
export const useDeleteEndorsement = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (endorsementId: string) =>
			endorsementService.deleteEndorsement(endorsementId),
		onMutate: async (endorsementId) => {
			// Optimistically remove the endorsement from cache
			const endorsement = queryClient.getQueryData<Endorsement>(
				endorsementKeys.detail(endorsementId)
			);
			return { endorsement };
		},
		onSuccess: (_, endorsementId, context) => {
			const endorsement = context?.endorsement;
			if (!endorsement) return;

			const { userId, skillId, endorserId } = endorsement;

			// Remove endorsement from cache
			queryClient.removeQueries(endorsementKeys.detail(endorsementId));

			// Invalidate related queries
			queryClient.invalidateQueries(endorsementKeys.userReceived(userId));
			queryClient.invalidateQueries(
				endorsementKeys.userGiven(endorserId)
			);
			queryClient.invalidateQueries(
				endorsementKeys.skillEndorsements(userId, skillId)
			);

			// Invalidate can endorse queries
			queryClient.invalidateQueries(endorsementKeys.eligibility());

			// Invalidate user data as skill ratings might have changed
			queryClient.invalidateQueries(["users", "detail", userId]);
			queryClient.invalidateQueries(["users", "skills"]);
		},
	});
};
