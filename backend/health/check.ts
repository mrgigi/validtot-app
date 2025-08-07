import { api } from "encore.dev/api";

interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
}

// Health check endpoint for monitoring application status.
export const check = api<void, HealthResponse>(
  { expose: true, method: "GET", path: "/health" },
  async () => {
    return {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    };
  }
);
