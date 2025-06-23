import invoke from "./Api";

const apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMGRjMjAyYS1jNDg3LTQyOTItOTJkYi05ZTU0MGUzOTdlN2IiLCJlbWFpbCI6Imthc2hpZmFsaTA5NjkwODJAZ21haWwuY29tIiwibmFtZSI6Ikthc2hpZiBBbGkiLCJwcm9maWxlX3BpYyI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tZQWRWNUZZYnNKZnFWZkNnd0dwN3ZUVTlKdENOTUtxaHQ3YnFEbVM4ZGF6enc2SkdaPXM5Ni1jIiwiZXhwIjoxNzUwNjI2MzczfQ.Ezx-RroXBYR7TvwJTInVVJp9ckuaYzDaojOZiJZKeSc";


export const ServerCheck = async () => {
 const data = await invoke({ url: "/", method: 'GET', headers: {
 apikey,
 }, });
 return data;
}
