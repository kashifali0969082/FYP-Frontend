import { apiclient } from "./Apis";

export const googleauth = () => apiclient.get(`/google/login`)

