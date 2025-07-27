import { apiclient } from "./Apis";
import { getAuthToken } from "../../utils/auth";

// Dynamic token getter for API calls
const getHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication token not available');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const streakapi = () => apiclient.get(`/streak`, {
  headers: getHeaders(),
});

export const streakLeaderboardapi = () => apiclient.get(`/streak/leaderboard`, {
  headers: getHeaders(),
});

export const updatestreakapi = () => apiclient.post(`/streak/update`, {}, {
  headers: getHeaders(),
});