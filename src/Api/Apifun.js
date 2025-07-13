import invoke from "./Api";

const apikey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMGRjMjAyYS1jNDg3LTQyOTItOTJkYi05ZTU0MGUzOTdlN2IiLCJlbWFpbCI6Imthc2hpZmFsaTA5NjkwODJAZ21haWwuY29tIiwibmFtZSI6Ikthc2hpZiBBbGkiLCJwcm9maWxlX3BpYyI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tZQWRWNUZZYnNKZnFWZkNnd0dwN3ZUVTlKdENOTUtxaHQ3YnFEbVM4ZGF6enc2SkdaPXM5Ni1jIiwiZXhwIjoxNzUyNjExNjc0fQ.sYxK0LHDH4mtDOCowvEy90ZmfyrD26N9_czJTuUVTKc";

export const ServerCheck = async () => {
  const data = await invoke({
    url: "/",
    method: "GET",
    headers: {
      apikey,
    },
  });
  return data;
};
export const GetAllBooks = async () => {
  const data = await invoke({
    url: "/file/books",
    method: "GET",

    headers: { Authorization: `Bearer ${apikey}` },
  });
  return data;
};
export const GetAllSlides = async () => {
  const data = await invoke({
    url: "/file/slides",
    method: "GET",

    headers: { Authorization: `Bearer ${apikey}` },
  });
  return data;
};
export const FileUpload = async (uploadedfile) => {
  const data = await invoke({
    url: "/file/upload",
    method: "POST",

    headers: { Authorization: `Bearer ${apikey}` },
    data: uploadedfile,
  });
  return data;
};

export const deleteDocument = async (type, id) => {
  const data = await invoke({
    url: `/file/delete/${type}/${id}`,
    method: "DELETE",
    headers: { Authorization: `Bearer ${apikey}` },
  });
  return data
};
