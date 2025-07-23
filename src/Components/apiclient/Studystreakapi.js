import { apiclient } from "./Apis";


// Helper function to get token
const getToken = () => {
  return Cookies.get("access_token");
};
;

export const streakapi = () => apiclient.get(`/streak`,{
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })

export const streakLeaderboardapi = () => apiclient.get(`/streak/leaderboard`,{
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })

export const userapi = () => apiclient.get(`/user`,{
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })

export const updatestreakapi = () => apiclient.post(`/streak/update`, {}, {
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});