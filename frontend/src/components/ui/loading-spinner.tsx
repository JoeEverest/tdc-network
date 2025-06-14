import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  message = "Loading...",
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-blue-600 mb-4`}
      />
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
