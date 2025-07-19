import { apiclient } from "./Apis";

// const token = localStorage.getItem("access_token");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMGRjMjAyYS1jNDg3LTQyOTItOTJkYi05ZTU0MGUzOTdlN2IiLCJlbWFpbCI6Imthc2hpZmFsaTA5NjkwODJAZ21haWwuY29tIiwibmFtZSI6Ikthc2hpZiBBbGkiLCJwcm9maWxlX3BpYyI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tZQWRWNUZZYnNKZnFWZkNnd0dwN3ZUVTlKdENOTUtxaHQ3YnFEbVM4ZGF6enc2SkdaPXM5Ni1jIiwiZXhwIjoxNzUzNDc2MzIyfQ.ZS_cIgODnzSq2u3we7LMDhp5mMAxZnk1YndzSYNDhO4";


export const streakapi = () => apiclient.get(`/streak`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })


    export const updatestreakapi = () => apiclient.post(`/streak/update`)