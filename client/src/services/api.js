import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api",
  timeout: 30_000,
});

/**
 * Requests a recipe for a free-form ingredients string.
 * Accepts an AbortSignal so callers can cancel stale in-flight requests.
 */
export async function generateRecipe(ingredients, { signal } = {}) {
  const response = await apiClient.post(
    "/recipe/generate",
    { ingredients },
    { signal }
  );
  return response.data.recipe;
}

/**
 * Normalizes any axios/network error into a consistent { code, message } shape
 * so UI components never need to know about axios internals.
 */
export function toApiError(error) {
  if (axios.isCancel(error) || error.name === "CanceledError") {
    return { code: "CANCELED", message: "Request canceled." };
  }

  if (error.code === "ECONNABORTED") {
    return { code: "TIMEOUT", message: "The request timed out. Please try again." };
  }

  if (!error.response) {
    return {
      code: "NETWORK_ERROR",
      message: "Couldn't reach the server. Check your connection and try again.",
    };
  }

  const data = error.response.data;
  return {
    code: data?.error || "UNKNOWN_ERROR",
    message: data?.message || "Something went wrong. Please try again.",
  };
}

export default apiClient;
