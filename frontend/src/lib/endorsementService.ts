import { Endorsement, CreateEndorsementData } from "../types";
import api from "./api";

// Get endorsements for a user
export const getUserEndorsements = async (
	userId: string
): Promise<Endorsement[]> => {
	const response = await api.get(`/endorsements/for/${userId}`);
	return response.data;
};

// Get endorsements given by a user
export const getUserGivenEndorsements = async (
	userId: string
): Promise<Endorsement[]> => {
	const response = await api.get(`/endorsements/by/${userId}`);
	return response.data;
};

// Get endorsements for a specific skill
export const getSkillEndorsements = async (
	userId: string,
	skillId: string
): Promise<Endorsement[]> => {
	const response = await api.get(
		`/endorsements/user/${userId}/skill/${skillId}`
	);
	return response.data;
};

// Get endorsement by ID
export const getEndorsementById = async (
	endorsementId: string
): Promise<Endorsement> => {
	const response = await api.get(`/endorsements/${endorsementId}`);
	return response.data;
};

// Check if user can endorse a skill
export const canEndorseSkill = async (
	endorserId: string,
	userId: string,
	skillId: string
): Promise<boolean> => {
	const response = await api.get(
		`/endorsements/can-endorse/${endorserId}/${userId}/${skillId}`
	);
	return response.data;
};

// Create new endorsement
export const createEndorsement = async (
	endorsementData: CreateEndorsementData
): Promise<Endorsement> => {
	const response = await api.post("/endorsements", endorsementData);
	return response.data;
};

// Update endorsement
export const updateEndorsement = async (
	endorsementId: string,
	endorsementData: Partial<CreateEndorsementData>
): Promise<Endorsement> => {
	const response = await api.put(
		`/endorsements/${endorsementId}`,
		endorsementData
	);
	return response.data;
};

// Delete endorsement
export const deleteEndorsement = async (
	endorsementId: string
): Promise<void> => {
	await api.delete(`/endorsements/${endorsementId}`);
};
