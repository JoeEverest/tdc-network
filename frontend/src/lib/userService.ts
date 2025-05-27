import {
	User,
	UserSkill,
	CreateUserData,
	UpdateUserData,
	SearchFilters,
} from "../types";
import api from "./api";

// Get all users (public profiles)
export const getAllUsers = async (): Promise<User[]> => {
	const response = await api.get("/user");
	return response.data;
};

// Get specific user by ID
export const getUserById = async (userId: string): Promise<User> => {
	const response = await api.get(`/user/${userId}`);
	return response.data;
};

// Get current user profile
export const getCurrentUser = async (): Promise<User> => {
	const response = await api.get("/user/me");
	return response.data;
};

// Create new user
export const createUser = async (userData: CreateUserData): Promise<User> => {
	const response = await api.post("/user", userData);
	return response.data;
};

// Update user profile
export const updateUser = async (
	userId: string,
	userData: UpdateUserData
): Promise<User> => {
	const response = await api.put(`/user/${userId}`, userData);
	return response.data;
};

// Delete user
export const deleteUser = async (userId: string): Promise<void> => {
	await api.delete(`/user/${userId}`);
};

// Search users
export const searchUsers = async (filters?: SearchFilters): Promise<User[]> => {
	const searchParams = new URLSearchParams();

	if (filters?.skills) {
		filters.skills.forEach((skill) => {
			searchParams.append("skills", skill.skillId);
			if (skill.minRating) {
				searchParams.append("minRating", skill.minRating.toString());
			}
		});
	}

	if (filters?.availableForHire !== undefined) {
		searchParams.append(
			"availableForHire",
			filters.availableForHire.toString()
		);
	}

	if (filters?.location) {
		searchParams.append("location", filters.location);
	}

	const response = await api.get(`/user/search?${searchParams.toString()}`);
	return response.data;
};

// Get user skills
export const getUserSkills = async (userId: string): Promise<UserSkill[]> => {
	const response = await api.get(`/user/${userId}/skills`);
	return response.data;
};

// Get current user skills
export const getCurrentUserSkills = async (): Promise<UserSkill[]> => {
	const response = await api.get("/user/me/skills");
	return response.data;
};

// Add skill to user
export const addSkill = async (skill: {
	skillName: string;
	rating: number;
}): Promise<User> => {
	const response = await api.post(`/user/me/skills`, skill);
	return response.data;
};

// Update skill
export const updateSkill = async (
	userId: string,
	skillId: string,
	skill: { rating: number }
): Promise<User> => {
	const response = await api.put(`/user/me/skills/${skillId}`, skill);
	return response.data;
};

// Remove skill
export const removeSkill = async (
	userId: string,
	skillId: string
): Promise<User> => {
	const response = await api.delete(`/user/me/skills/${skillId}`);
	return response.data;
};

// Toggle availability
export const toggleAvailability = async (userId: string): Promise<User> => {
	const response = await api.patch(`/user/${userId}/availability`);
	return response.data;
};
