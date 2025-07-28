import axios from "axios";

export const apiclient = axios.create(
    {
     baseURL:'https://api.adaptivelearnai.xyz/',
     withCredentials: true,
    }
)