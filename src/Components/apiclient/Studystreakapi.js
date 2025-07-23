import { apiclient } from "./Apis";

// const token = localStorage.getItem("access_token");

// For testing - hardcoded token (after dev we will make it dynamic)
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYjM5MWJmZS1kNTgwLTQ4NTUtYjRiZS0xOWVjNmQ0NWU3Y2MiLCJlbWFpbCI6ImFiZHVsbGFobmFzZWVtMjdAZ21haWwuY29tIiwibmFtZSI6IkFiZHVsbGFoIE5hc2VlbSIsInByb2ZpbGVfcGljIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS0RkY0lKRm5GaElPUEhYd0prdXA5NWw1aTFVM3dubTBzSUhIclJpVm9qaHI5WDB3PXM5Ni1jIiwiZXhwIjoxNzUzMzAyMTEyfQ.XHJwKfspbm2UqB5G_SBs7F1CBzXqDiPMh66SVfiuO0E";


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