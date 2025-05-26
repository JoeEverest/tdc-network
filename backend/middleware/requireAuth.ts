import { clerkMiddleware } from "@clerk/express";


export const requireAuth = clerkMiddleware();


