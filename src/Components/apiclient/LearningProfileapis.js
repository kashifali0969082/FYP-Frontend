import { apiclient } from "./Apis";

import Cookies from "js-cookie";

// Helper function to get token
const getToken = () => {
  const token = Cookies.get("access_token");
  return token;
};

const token = getToken(); 

export const learningProfilestatusapi = () => apiclient.get(`/learning-profile/form/status`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })


export const createlearningprofileformapi = (formData) => apiclient.post(`/learning-profile/form`,formData,{
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })