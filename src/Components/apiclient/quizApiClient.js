import { apiclient } from "./Apis";
import { getAuthToken } from "../../utils/auth";
import QueryString from "qs";

// Dynamic token getter for API calls
const getHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication token not available");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const fetchModels = async () => {
  return apiclient.get("/models/list", {
    headers: getHeaders(),
  });
};

export const generateQuizApi = async (formData, isDownload) => {
  return apiclient.post("/quiz-gen/", formData, {
    headers: getHeaders(),
    responseType: isDownload ? "blob" : "json",
  });
};
