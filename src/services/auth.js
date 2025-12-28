import { apiRequest } from "./request";

// Login
export const loginUser = async (credentials) => {
  const response = await apiClient.post("users/login/", credentials);
  return response.data;
};


// Logout
export const logoutUser = async () => {
  return apiRequest("POST", "auth/logout");
};

// Register
export const registerUser = async (userData) => {
  return apiRequest("POST", "users/sign-up/", userData);
};

// Verify OTP
export const verifyOTP = async (otpData) => {
  return apiRequest("POST", "auth/verify-otp", otpData);
};

// Forgot Password
export const forgotPassword = async (emailData) => {
  return apiRequest("POST", "auth/forgot-password", emailData);
};

// Reset Password
export const resetPassword = async (passwordData) => {
  return apiRequest("POST", "auth/reset-password", passwordData);
};

export const updateProfile = async (userData) => {
  return apiRequest("PU", "users/profile/", userData);
};