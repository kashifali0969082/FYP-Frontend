import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";
export const PdfViewer = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [inputPage, setInputPage] = useState("");

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const fetchPdf = async () => {
    try {
      const response = await axios.get(
        "https://api.adaptivelearnai.xyz/study-mode/documents/44cf5b66-5e6b-4753-a9b2-f7de48e9de1b/stream",
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMGRjMjAyYS1jNDg3LTQyOTItOTJkYi05ZTU0MGUzOTdlN2IiLCJlbWFpbCI6Imthc2hpZmFsaTA5NjkwODJAZ21haWwuY29tIiwibmFtZSI6Ikthc2hpZiBBbGkiLCJwcm9maWxlX3BpYyI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tZQWRWNUZZYnNKZnFWZkNnd0dwN3ZUVTlKdENOTUtxaHQ3YnFEbVM4ZGF6enc2SkdaPXM5Ni1jIiwiZXhwIjoxNzU0MTU2NDc1fQ.pJmDnXmqXhSNeqJ9AWwfVfQ7rDO5KfrgrqKrHd_KvWg`,
          },
          responseType: "blob",
          params: { document_type: "book" },
        }
      );

      const blobUrl = URL.createObjectURL(response.data);
      setPdfUrl(blobUrl);
    } catch (error) {
      console.error("Failed to load PDF:", error);
    }
  };

  useEffect(() => {
    fetchPdf();

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, []);

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  const goToPage = () => {
    const target = parseInt(inputPage, 10);
    if (!isNaN(target) && target >= 1 && target <= numPages) {
      setPageNumber(target);
    } else {
      alert("Invalid page number");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#fff",
        padding: "1rem",
        minHeight: "100vh",
      }}
    >
      {pdfUrl ? (
        <>
          <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
            <Page
              pageNumber={pageNumber}
              renderAnnotationLayer={false}
              renderTextLayer={true}
            />
          </Document>

          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <button onClick={goToPrevPage} disabled={pageNumber <= 1}>
              Previous
            </button>

            <span>
              Page {pageNumber} of {numPages}
            </span>

            <button onClick={goToNextPage} disabled={pageNumber >= numPages}>
              Next
            </button>

            <input
              type="number"
              placeholder="Page #"
              value={inputPage}
              onChange={(e) => setInputPage(e.target.value)}
              style={{ width: "80px", padding: "4px" }}
            />

            <button onClick={goToPage}>Go</button>
          </div>
        </>
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};
