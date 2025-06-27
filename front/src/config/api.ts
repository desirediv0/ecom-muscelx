// API base URL configuration
export const API_URL =
  import.meta.env.MODE === "production"
    ? "https://muscle-x.com/api"
    : "http://localhost:4000/api";
