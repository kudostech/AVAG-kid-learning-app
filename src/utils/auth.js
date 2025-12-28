export const isAuthenticated = () => {
  const token = localStorage.getItem("USER_TOKEN");
  if (token) {
    return true;
  }
  localStorage.removeItem("USER_TOKEN");
  localStorage.removeItem("USER_ROLE");
  localStorage.removeItem("USER_PROFILE");
};
export const getUserRole = () => {
  const profile = localStorage.getItem("USER_PROFILE");
  if (!profile) return null;

  try {
    const user = JSON.parse(profile);
    return user.role || null;
  } catch {
    return null;
  }
};
export const getUserProfile = () => {
  const profile = localStorage.getItem("USER_PROFILE");
  if (!profile) return null;

  try {
    const user = JSON.parse(profile);
    return user || null;
  } catch {
    return null;
  }
};
