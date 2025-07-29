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
  if (!document_id || typeof document_id !== "string") {
    throw new Error(`Invalid document_id: ${document_id}`);
  }

  if (!document_type || typeof document_type !== "string") {
    throw new Error(`Invalid document_type: ${document_type}`);
  }

  const query = QueryString.stringify({
    document_type: document_type.toLowerCase(),
  });

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

// Study mode init
export const listModels = async () => {
  const data = await apiclient({
    url: `/models/list`,
    method: "GET",
    headers: getHeaders(),
  });

  return data;
};

// {
//   "chat_session_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//   "document_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//   "document_type": "string",
//   "content": "string",
//   "current_page": 0,
//   "model_id": "d50a33ce-2462-4a5a-9aa7-efc2d1749745",
// }

export const ChatbotApi = async (
  chat_session_id,
  document_id,
  document_type,
  content,
  current_page,
  model_id
) => {
  const payload = {
    chat_session_id,
    document_id,
    document_type,
    content,
    current_page,
    model_id,
  };
console.log("mock rsponse payload",payload);

  const data = await apiclient({
    url: `/study-mode/chat/message`,
    method: "POST",
    headers: {
      ...getHeaders(),
      "Content-Type": "application/json",
    },
    data: payload,
  });

  return data;
};
