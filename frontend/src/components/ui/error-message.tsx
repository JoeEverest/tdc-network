import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({
  title = "Something went wrong",
  message = "There was an error loading the data. Please try again.",
  onRetry,
  className = "",
}: ErrorMessageProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 text-center max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}
