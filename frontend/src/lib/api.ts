import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

// Create axios instance
const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
	headers: {
		"Content-Type": "application/json",
	},
});

// Hook to get authenticated API client
export const useApiClient = () => {
	const { getToken } = useAuth();

	// Add auth token to requests
	api.interceptors.request.use(async (config) => {
		const token = await getToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	});

	return api;
};

export default api;
