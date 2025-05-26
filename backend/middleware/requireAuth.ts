import { clerkMiddleware } from "@clerk/express";

// Middleware to require authentication and attach Clerk user info to req.auth
export const requireAuth = clerkMiddleware();

// Optionally, you can use ClerkExpressWithAuth for routes where auth is optional
