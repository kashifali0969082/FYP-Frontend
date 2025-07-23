import { apiclient } from "./Apis";
import Cookies from "js-cookie";

// Hardcoded token for localhost development
const LOCALHOST_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYjM5MWJmZS1kNTgwLTQ4NTUtYjRiZS0xOWVjNmQ0NWU3Y2MiLCJlbWFpbCI6ImFiZHVsbGFobmFzZWVtMjdAZ21haWwuY29tIiwibmFtZSI6IkFiZHVsbGFoIE5hc2VlbSIsInByb2ZpbGVfcGljIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS0RkY0lKRm5GaElPUEhYd0prdXA5NWw1aTFVM3dubTBzSUhIclJpVm9qaHI5WDB3PXM5Ni1jIiwiZXhwIjoxNzUzMzAyMTEyfQ.XHJwKfspbm2UqB5G_SBs7F1CBzXqDiPMh66SVfiuO0E";

// Helper function to get token
const getToken = () => {
  const token = Cookies.get("access_token");
  // Use localhost token if no token found (for development)
  return token || LOCALHOST_TOKEN;
};

// Get all books
export const GetAllBooks = async () => {
  const token = getToken();
  try {
    console.log("📚 Fetching books...");
    const response = await apiclient.get("/file/books", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("📚 Books API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API error in GetAllBooks:", error);
    console.error("Books error details:", error.response?.data);
    throw error;
  }
};

// Get all presentations/slides
export const GetAllSlides = async () => {
  const token = getToken();
  try {
    console.log("🎯 Fetching slides...");
    const response = await apiclient.get("/file/slides", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("🎯 Slides API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API error in GetAllSlides:", error);
    console.error("Slides error details:", error.response?.data);
    throw error;
  }
};

// Get all notes
export const GetAllNotes = async () => {
  const token = getToken();
  try {
    console.log("📝 Fetching notes...");
    const response = await apiclient.get("/file/notes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("📝 Notes API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API error in GetAllNotes:", error);
    console.error("Notes error details:", error.response?.data);
    throw error;
  }
};

// Get all files (books, slides, and notes combined)
export const GetAllFiles = async () => {
  const token = getToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    console.log("🔄 Fetching files with token:", token.substring(0, 20) + "...");
    
    // Fetch all file types in parallel
    const [booksResponse, slidesResponse, notesResponse] = await Promise.allSettled([
      GetAllBooks(),
      GetAllSlides(), 
      GetAllNotes()
    ]);

    console.log("📊 API Responses:");
    console.log("Books response:", booksResponse);
    console.log("Slides response:", slidesResponse);
    console.log("Notes response:", notesResponse);

    // Extract successful results
    const books = booksResponse.status === 'fulfilled' ? booksResponse.value.books || [] : [];
    const presentations = slidesResponse.status === 'fulfilled' ? slidesResponse.value.presentations || [] : [];
    const notes = notesResponse.status === 'fulfilled' ? notesResponse.value.notes || [] : [];

    console.log("📚 Extracted data:");
    console.log("Books:", books);
    console.log("Presentations:", presentations);
    console.log("Notes:", notes);

    // Log any errors but don't fail completely
    if (booksResponse.status === 'rejected') {
      console.warn("Failed to fetch books:", booksResponse.reason);
    }
    if (slidesResponse.status === 'rejected') {
      console.warn("Failed to fetch slides:", slidesResponse.reason);
    }
    if (notesResponse.status === 'rejected') {
      console.warn("Failed to fetch notes:", notesResponse.reason);
    }

    return {
      books,
      presentations,
      notes,
      total: books.length + presentations.length + notes.length
    };
  } catch (error) {
    console.error("API error in GetAllFiles:", error);
    throw error;
  }
};
