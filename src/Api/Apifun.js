import { apiclient } from "../Components/apiclient/Apis";
import { getAuthToken } from "../utils/auth";
import QueryString from "qs";

// Dynamic token getter for API calls
const getHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication token not available");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const deleteDocument = async (type, id) => {
  const data = await apiclient({
    url: `/file/delete/${type}/${id}`,
    method: "DELETE",
    headers: getHeaders(),
  });
  return data;
};

// Study mode init
export const StudyModeInit = async (RrquiredData) => {
  const queryString = QueryString.stringify(RrquiredData);

  const data = await apiclient({
    url: `/study-mode/init?${queryString}`,
    method: "GET",
    headers: getHeaders(),
  });

  return data;
};

// Stream document
export const StreamDocument = async ({ document_id, document_type }) => {
  const url = `/study-mode/documents/${document_id}/stream?document_type=${document_type}`;

  const data = await apiclient({
    url,
    method: "GET",
    headers: {
      ...getHeaders(),
      Accept: "application/json",
    },
    responseType: "arraybuffer",
  });

  return data;
};
