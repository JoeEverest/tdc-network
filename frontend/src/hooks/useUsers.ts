import { useQuery, useMutation, useQueryClient } from "react-query";
import * as userService from "../lib/userService";
import { CreateUserData, UpdateUserData, SearchFilters } from "../types";

// Query keys for caching
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: SearchFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  profile: () => [...userKeys.all, "profile"] as const,
  skills: () => [...userKeys.all, "skills"] as const,
};

// Get current user profile
export const useProfile = () => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: userService.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get user by ID
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => userService.getUserById(userId),
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });
};

// Search users with filters
export const useUsers = () => {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: () => userService.getAllUsers(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true,
  });
};

// Search users with filters
export const useSearchUsers = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: userKeys.list(filters || {}),
    queryFn: () => userService.searchUsers(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true,
    enabled: !!filters && Object.keys(filters).length > 0,
  });
};

// Get user skills
export const useUserSkills = (userId?: string) => {
  return useQuery({
    queryKey: [...userKeys.skills(), userId || "current"],
    queryFn: () =>
      userId
        ? userService.getUserSkills(userId)
        : userService.getCurrentUserSkills(),
    staleTime: 5 * 60 * 1000,
  });
};

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserData) => userService.createUser(userData),
    onSuccess: (newUser) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries(userKeys.all);
      // Set the new user data in cache
      queryClient.setQueryData(userKeys.profile(), newUser);
    },
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      userData,
    }: {
      userId: string;
      userData: UpdateUserData;
    }) => userService.updateUser(userId, userData),
    onSuccess: (updatedUser, { userId }) => {
      // Update specific user in cache
      queryClient.setQueryData(userKeys.detail(userId), updatedUser);
      // If updating current user, update profile cache
      queryClient.invalidateQueries(userKeys.profile());
      // Invalidate user lists to reflect changes
      queryClient.invalidateQueries(userKeys.lists());
    },
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: (_, userId) => {
      // Remove user from cache
      queryClient.removeQueries(userKeys.detail(userId));
      // Invalidate user lists
      queryClient.invalidateQueries(userKeys.lists());
    },
  });
};

// Add skill mutation
export const useAddSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ skill }: { skill: { skillName: string; rating: number } }) =>
      userService.addSkill(skill),
    onSuccess: () => {
      // Invalidate skills cache
      queryClient.invalidateQueries(userKeys.skills());
      // Invalidate user lists to reflect new skills
      queryClient.invalidateQueries(userKeys.lists());
    },
  });
};

// Update skill mutation
export const useUpdateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      skillId,
      skill,
    }: {
      skillId: string;
      skill: { rating: number };
    }) => userService.updateSkill(skillId, skill),
    onSuccess: () => {
      // Invalidate skills cache
      queryClient.invalidateQueries(userKeys.skills());
      // Invalidate user lists
      queryClient.invalidateQueries(userKeys.lists());
    },
  });
};

// Remove skill mutation
export const useRemoveSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ skillId }: { skillId: string }) =>
      userService.removeSkill(skillId),
    onSuccess: () => {
      // Invalidate skills cache
      queryClient.invalidateQueries(userKeys.skills());
      // Invalidate user lists
      queryClient.invalidateQueries(userKeys.lists());
    },
  });
};

// Toggle availability mutation
export const useToggleAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.toggleAvailability(userId),
    onSuccess: (updatedUser, userId) => {
      // Update user in cache
      queryClient.setQueryData(userKeys.detail(userId), updatedUser);
      // Update profile if it's current user
      queryClient.invalidateQueries(userKeys.profile());
      // Invalidate user lists to reflect availability change
      queryClient.invalidateQueries(userKeys.lists());
    },
  });
};
