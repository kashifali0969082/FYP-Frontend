

import { apiclient } from "./Apis";
import Cookies from "js-cookie";

const token = Cookies.get("access_token");
export const FileUpload = async (uploadedfile) => {
  try {
    const response = await apiclient.post(
      "/file/upload",
      uploadedfile,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        //   "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("API not running:", error);
    throw error;
  }
};
