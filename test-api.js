// Quick test script to check API responses
import { apiclient } from './src/Components/apiclient/Apis.js';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYjM5MWJmZS1kNTgwLTQ4NTUtYjRiZS0xOWVjNmQ0NWU3Y2MiLCJlbWFpbCI6ImFiZHVsbGFobmFzZWVtMjdAZ21haWwuY29tIiwibmFtZSI6IkFiZHVsbGFoIE5hc2VlbSIsInByb2ZpbGVfcGljIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS0RkY0lKRm5GaElPUEhYd0prdXA5NWw1aTFVM3dubTBzSUhIclJpVm9qaHI5WDB3PXM5Ni1jIiwiZXhwIjoxNzUzMzAyMTEyfQ.XHJwKfspbm2UqB5G_SBs7F1CBzXqDiPMh66SVfiuO0E";

async function testAPIs() {
  console.log("Testing APIs...");
  
  try {
    console.log("Testing /file/books...");
    const booksResponse = await apiclient.get("/file/books", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Books response:", booksResponse.data);
  } catch (error) {
    console.error("Books error:", error.response?.data || error.message);
  }
  
  try {
    console.log("Testing /file/slides...");
    const slidesResponse = await apiclient.get("/file/slides", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Slides response:", slidesResponse.data);
  } catch (error) {
    console.error("Slides error:", error.response?.data || error.message);
  }
  
  try {
    console.log("Testing /file/notes...");
    const notesResponse = await apiclient.get("/file/notes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Notes response:", notesResponse.data);
  } catch (error) {
    console.error("Notes error:", error.response?.data || error.message);
  }
}

testAPIs();
