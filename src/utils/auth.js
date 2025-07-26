import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

/**
 * Get authentication token from cookies
 * @returns {string|null} Token if valid, null otherwise
 */
export const getAuthToken = () => {
  try {
    const token = Cookies.get("access_token");
    if (!token) {
      console.warn("No access token found in cookies");
      return null;
    }

    // Verify token is valid and not expired
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp < currentTime) {
      console.warn("Token has expired, removing from cookies");
      Cookies.remove("access_token");
      return null;
    }

    return token;
  } catch (error) {
    console.error("Error getting auth token:", error);
    Cookies.remove("access_token");
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return getAuthToken() !== null;
};

/**
 * Get user info from token
 * @returns {object|null} User info if valid token, null otherwise
 */
export const getUserInfo = () => {
  try {
    const token = getAuthToken();
    if (!token) return null;
    
    return jwtDecode(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Clear authentication data
 */
export const clearAuth = () => {
  Cookies.remove("access_token", {
    path: "/",
    domain: ".adaptivelearnai.xyz",
  });
};
