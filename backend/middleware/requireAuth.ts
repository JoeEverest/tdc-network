import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";

// Custom auth middleware for API endpoints that returns JSON instead of redirecting
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
