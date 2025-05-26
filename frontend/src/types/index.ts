// Core types for the skill-based hiring platform

export interface User {
	id: string;
	clerkId: string;
	email: string;
	name: string;
	bio?: string;
	avatarUrl?: string;
	availableForHire: boolean;
	contactInfo?: {
		email?: string;
		phone?: string;
		linkedin?: string;
		website?: string;
	};
	isEndorsed: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface Skill {
	id: string;
	name: string;
	category: string;
	description?: string;
}

export interface UserSkill {
	id: string;
	userId: string;
	skillId: string;
	selfRating: number; // 1-10
	endorsementCount: number;
	averageEndorsedRating?: number;
	skill: Skill;
	endorsements: Endorsement[];
}

export interface Endorsement {
	id: string;
	endorserId: string;
	endorseeId: string;
	skillId: string;
	rating: number; // 1-10
	comment?: string;
	createdAt: string;
	endorser: User;
	skill: Skill;
}

export interface Job {
	id: string;
	authorId: string;
	title: string;
	description: string;
	requirements: JobRequirement[];
	contactInfo: {
		email: string;
		phone?: string;
		company?: string;
	};
	location?: string;
	isRemote: boolean;
	salaryRange?: {
		min: number;
		max: number;
		currency: string;
	};
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	author: User;
}

export interface JobRequirement {
	skillId: string;
	minimumRating: number;
	required: boolean;
	skill: Skill;
}

export interface SearchFilters {
	skills?: {
		skillId: string;
		minRating?: number;
		maxRating?: number;
	}[];
	availableForHire?: boolean;
	location?: string;
	isRemote?: boolean;
}

export interface JobFilters {
	skills?: string[];
	location?: string;
	isRemote?: boolean;
	salaryMin?: number;
	salaryMax?: number;
}

// API Response types
export interface ApiResponse<T> {
	data: T;
	message: string;
	success: boolean;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	hasMore: boolean;
}
