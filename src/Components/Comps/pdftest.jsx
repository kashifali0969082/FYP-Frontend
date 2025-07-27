import React, { useEffect, useRef, useState } from "react";
import { GlobalWorkerOptions, getDocument, version } from "pdfjs-dist";
import { StreamDocument } from "../../Api/Apifun";
// Set the worker source for PDF.js using jsDelivr CDN (usually more reliable)
GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.js`;

const PdfRenderer = () => {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndRenderPDF = async () => {
      try {
        setLoading(true);

        // Replace this with your actual StreamDocument function call
        const response = await StreamDocument({
          document_id: "44cf5b66-5e6b-4753-a9b2-f7de48e9de1b",
          document_type: "book",
        });

        // Check if the request was successful
        if (response.status !== 200) {
          throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }

        // The response.data already contains the ArrayBuffer
        const arrayBuffer = response.data;
        const pdf = await getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;
      } catch (err) {
        console.error("Error rendering PDF:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndRenderPDF();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      {loading && <p>Loading PDF...</p>}
      <canvas ref={canvasRef} style={{ border: "1px solid #ccc" }} />
    </div>
  );
};

export default PdfRenderer;