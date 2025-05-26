import { requireAuth as clerkRequireAuth } from "@clerk/express";

// Export the requireAuth middleware
export const requireAuth = clerkRequireAuth();
