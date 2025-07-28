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

export const StreamDocument = async (document_id, document_type) => {
  if (!document_id || typeof document_id !== 'string') {
    throw new Error(`Invalid document_id: ${document_id}`);
  }

  if (!document_type || typeof document_type !== 'string') {
    throw new Error(`Invalid document_type: ${document_type}`);
  }

  const query = QueryString.stringify({ document_type: document_type.toLowerCase() });

  const data = await apiclient({
    url: `/study-mode/documents/${document_id}/stream?${query}`,
    method: "GET",
    headers: getHeaders(),
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

  const data = await apiclient({
    url: `/study-mode/documents/${document_id}/last-position`,
    method: "POST",
    headers: {
      ...getHeaders(),
      "Content-Type": "application/json",
    },
    data: payload,
  });

  return data;
};
