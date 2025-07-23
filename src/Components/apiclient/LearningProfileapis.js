import { apiclient } from "./Apis";

import Cookies from "js-cookie";
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmE2YWQ4Zi0zNTgyLTQzZmItOWEwYy02YTI5NzJkNGMyYWIiLCJlbWFpbCI6ImYyMDIxMDY1MTEyQGdtYWlsLmNvbSIsIm5hbWUiOiJIYXJyaXMgaWpheiIsInByb2ZpbGVfcGljIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSVBQaWRoUERlLVR2bDAzakx2THplT1N6OGgwSWE2X2gzR0lCU2pFeTVscGFqSFpnPXM5Ni1jIiwiZXhwIjoxNzUzNTY5NjgyfQ.agAAEt9YoiYHWeLzg8igIbwjsV27mgxdBThO9J-VEf8"
// const token = Cookies.get("access_token");

// For testing - hardcoded token (after dev we will make it dynamic)
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYjM5MWJmZS1kNTgwLTQ4NTUtYjRiZS0xOWVjNmQ0NWU3Y2MiLCJlbWFpbCI6ImFiZHVsbGFobmFzZWVtMjdAZ21haWwuY29tIiwibmFtZSI6IkFiZHVsbGFoIE5hc2VlbSIsInByb2ZpbGVfcGljIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS0RkY0lKRm5GaElPUEhYd0prdXA5NWw1aTFVM3dubTBzSUhIclJpVm9qaHI5WDB3PXM5Ni1jIiwiZXhwIjoxNzUzMzAyMTEyfQ.XHJwKfspbm2UqB5G_SBs7F1CBzXqDiPMh66SVfiuO0E";


export const learningProfilestatusapi = () => apiclient.get(`/learning-profile/form/status`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

// export const getlearningprofileformapi = () => apiclient.get(`/learning-profile/form`,{
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })



export const createlearningprofileformapi = (formData) => apiclient.post(`/learning-profile/form`,formData,{
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })