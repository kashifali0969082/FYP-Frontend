import { apiclient } from "./Apis";

export const learningProfilestatusapi = () => apiclient.get(`/learning-profile/form/status`)

export const getlearningprofileformapi = () => apiclient.get(`/learning-profile/form`)

export const createlearningprofileformapi = () => apiclient.post(`/learning-profile/form`)