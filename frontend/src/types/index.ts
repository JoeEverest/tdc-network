// Core types for the skill-based hiring platform - matching backend API

export interface User {
	_id: string;
	clerkId: string;
	email: string;
	name: string;
	skills: UserSkill[];
	availableForHire: boolean;
	contactInfo?: {
		email?: string;
		phone?: string;
	};
	createdAt: string;
	updatedAt: string;
}

export interface Skill {
	_id: string;
	name: string;
}

export interface UserSkill {
	skill: Skill | string; // Can be populated or just ObjectId
	rating: number; // 1-10
	endorsements: string[]; // Array of user ObjectIds who endorsed this skill
}

export interface Endorsement {
	_id: string;
	endorser: string; // User ObjectId
	endorsee: string; // User ObjectId
	skill: string; // Skill ObjectId
	createdAt: string;
}

export interface Job {
	id: string;
	_id?: string; // For backward compatibility
	authorId: string;
	title: string;
	description: string;
	requirements: JobRequirement[];
	contactInfo: {
		email: string;
		phone?: string;
		company?: string;
	};
	company?: string; // For backward compatibility
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
	minRating: number;
	skill: string;
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
	search?: string;
}

export interface JobFilters {
	skills?: string[];
	location?: string;
	isRemote?: boolean;
	salaryMin?: number;
	salaryMax?: number;
	search?: string;
	salaryRange?: {
		min: number;
		max: number;
	};
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

// Create/Update data types
export interface CreateUserData {
	clerkId: string;
	email: string;
	name: string;
	skills?: UserSkill[];
	availableForHire?: boolean;
	contactInfo?: {
		email?: string;
		phone?: string;
	};
}

export interface UpdateUserData {
	name?: string;
	skills?: UserSkill[];
	availableForHire?: boolean;
	contactInfo?: {
		email?: string;
		phone?: string;
	};
}

export interface CreateJobData {
	title: string;
	description: string;
	requiredSkills: JobRequirement[];
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
}

export type UpdateJobData = Partial<CreateJobData>;

export interface CreateEndorsementData {
	endorserId: string;
	endorseeId: string;
	skillId: string;
}

export interface JobApplication {
	_id: string;
	jobId: string;
	userId: string;
	coverLetter?: string;
	status: "pending" | "accepted" | "rejected";
	createdAt: string;
	updatedAt: string;
}

export type Application = JobApplication;

// Alias for JobFilters to match expected naming
export type JobSearchFilters = JobFilters;
