import { USER_TOKEN_STORAGE_KEY,USER_ROLE,USER_PROFILE } from "../constants";

export async function logout() {
    localStorage.removeItem(USER_TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_ROLE);
    localStorage.removeItem(USER_PROFILE);
}
