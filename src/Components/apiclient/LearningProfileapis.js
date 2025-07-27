import { apiclient } from "./Apis";

import Cookies from "js-cookie";

// Helper function to get token
const getToken = () => {
  return Cookies.get("access_token");
};


export const learningProfilestatusapi = () => apiclient.get(`/learning-profile/form/status`,{
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })


export const createlearningprofileformapi = (formData) => apiclient.post(`/learning-profile/form`,formData,{
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    })