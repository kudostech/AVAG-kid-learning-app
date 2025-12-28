import apiClient  from "./api";
export const apiRequest = (method, url, data = {}, params = {}) => {
  return apiClient({
    method,
    url,
    data,
    params,
  })
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        // Server responded with a status outside 2xx
        throw new Error(error.response.data?.message || "An error occurred");
      } else {
        // Network error or no response from server
        throw new Error("Network error or server is unreachable.");
      }
    });
};
