import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";

// Create axios instance
const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
	headers: {
		"Content-Type": "application/json",
	},
});

// Hook to set up authenticated API client
export const useApiClient = () => {
	const { getToken } = useAuth();

	useEffect(() => {
		// Clear any existing interceptors to prevent duplicates
		api.interceptors.request.clear();

		// Add auth token to requests
		const interceptor = api.interceptors.request.use(async (config) => {
			const token = await getToken();
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		});

		// Cleanup function to remove interceptor on unmount
		return () => {
			api.interceptors.request.eject(interceptor);
		};
	}, [getToken]);

	return api;
};

export default api;
