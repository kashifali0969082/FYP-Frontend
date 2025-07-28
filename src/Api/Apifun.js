import { url } from "../export";
import invoke from "./Api";
import QueryString from "qs";
const apikey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMGRjMjAyYS1jNDg3LTQyOTItOTJkYi05ZTU0MGUzOTdlN2IiLCJlbWFpbCI6Imthc2hpZmFsaTA5NjkwODJAZ21haWwuY29tIiwibmFtZSI6Ikthc2hpZiBBbGkiLCJwcm9maWxlX3BpYyI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tZQWRWNUZZYnNKZnFWZkNnd0dwN3ZUVTlKdENOTUtxaHQ3YnFEbVM4ZGF6enc2SkdaPXM5Ni1jIiwiZXhwIjoxNzU0MTU2NDc1fQ.pJmDnXmqXhSNeqJ9AWwfVfQ7rDO5KfrgrqKrHd_KvWg";
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
  return data;
};

//study mode

export const StudyModeInit = async (RrquiredData) => {
  const queryString = QueryString.stringify(RrquiredData);

  const data = await invoke({
    url: `/study-mode/init?${queryString}`,
    method: "GET",
    headers: { Authorization: `Bearer ${apikey}` },
  });

  return data;
};

export const StreamDocument = async (document_id, document_type) => {
  if (!document_id || typeof document_id !== 'string') {
    throw new Error(`Invalid document_id: ${document_id}`);
  }

  if (!document_type || typeof document_type !== 'string') {
    throw new Error(`Invalid document_type: ${document_type}`);
  }

  const query = QueryString.stringify({ document_type: document_type.toLowerCase() });

  const data = await invoke({
    url: `/study-mode/documents/${document_id}/stream?${query}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${apikey}`,
    },
    responseType: "blob",
  });

  return data;
};


export const UpdateLastPosition = async (
  document_id,
  document_type,
  page_number
) => {
  const payload = {
    document_type,
    page_number,
  };

  const data = await invoke({
    url: `/study-mode/documents/${document_id}/last-position`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${apikey}`,
      "Content-Type": "application/json",
    },
    data: payload,
  });

  return data;
};
