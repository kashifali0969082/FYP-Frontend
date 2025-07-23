import { apiclient } from "./Apis";
import Cookies from "js-cookie";


// Helper function to get token
const getToken = () => {
  const token = Cookies.get("access_token");
  return token;
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

// Delete a file by ID and type
export const DeleteFile = async (fileId, fileType) => {
  const token = getToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    console.log(`🗑️ DELETE REQUEST DETAILS:`);
    console.log(`   File ID: "${fileId}" (type: ${typeof fileId})`);
    console.log(`   File Type: "${fileType}" (type: ${typeof fileType})`);
    
    // Map file types to match backend expectations
    const typeMapping = {
      'book': 'book',
      'books': 'book', 
      'slide': 'presentation',
      'slides': 'presentation',
      'presentation': 'presentation',
      'presentations': 'presentation',
      'note': 'notes',
      'notes': 'notes'
    };
    
    const mappedType = typeMapping[fileType.toLowerCase()] || fileType.toLowerCase();
    
    // Use the correct API format: /file/delete/{document_type}/{document_id}
    const endpoint = `/file/delete/${mappedType}/${fileId}`;
    
    console.log(`   Endpoint: ${endpoint}`);
    console.log(`   Method: DELETE`);
    
    const response = await apiclient.delete(endpoint, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("✅ Delete response:", response);
    return response;
  } catch (error) {
    console.error("❌ Delete API error:", error);
    console.error("❌ Delete error details:", error.response?.data);
    console.error("❌ Delete request config:", error.config);
    throw error;
  }
};
