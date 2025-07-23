

import { apiclient } from "./Apis";
import Cookies from "js-cookie";


// Helper function to get token
const getToken = () => {
  return Cookies.get("access_token");
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
