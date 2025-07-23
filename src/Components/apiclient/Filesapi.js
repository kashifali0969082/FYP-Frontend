

import { apiclient } from "./Apis";
import Cookies from "js-cookie";

// Hardcoded token for localhost development
const LOCALHOST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYjM5MWJmZS1kNTgwLTQ4NTUtYjRiZS0xOWVjNmQ0NWU3Y2MiLCJlbWFpbCI6ImFiZHVsbGFobmFzZWVtMjdAZ21haWwuY29tIiwibmFtZSI6IkFiZHVsbGFoIE5hc2VlbSIsInByb2ZpbGVfcGljIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS0RkY0lKRm5GaElPUEhYd0prdXA5NWw1aTFVM3dubTBzSUhIclJpVm9qaHI5WDB3PXM5Ni1jIiwiZXhwIjoxNzUzMzAyMTEyfQ.XHJwKfspbm2UqB5G_SBs7F1CBzXqDiPMh66SVfiuO0E";

// Helper function to get token
const getToken = () => {
  const token = Cookies.get("access_token");
  // Use localhost token if no token found (for development)
  return token || LOCALHOST_TOKEN;
};

export const FileUpload = async (uploadedfile, onProgress = () => {}) => {
  const token = getToken();
  try {
    const response = await apiclient.post(
      "/file/upload", // use your full backend URL here
      uploadedfile,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        //   "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("API upload error:", error);
    throw error;
  }
};
