// The one place the product is named per repo (brief §1). Change to rebrand.
export const APP_NAME = "237Sentinel";

// API base — set VITE_API_BASE_URL in .env for production (the Space URL).
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:7860";
