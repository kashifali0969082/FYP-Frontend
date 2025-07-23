import { apiclient } from "./Apis";


// Helper function to get token
const getToken = () => {
  const token = Cookies.get("access_token");
  return token;
};

const token = getToken();

export const streakapi = () => apiclient.get(`/streak`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

export const streakLeaderboardapi = () => apiclient.get(`/streak/leaderboard`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

export const userapi = () => apiclient.get(`/user`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

export const updatestreakapi = () => apiclient.post(`/streak/update`)