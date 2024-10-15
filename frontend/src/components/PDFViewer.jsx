import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf'; // Import pdfjs for worker configuration
import { useLocation } from 'react-router-dom';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; // Optional, for annotations like links

// Set workerSrc to use the locally installed pdfjs-dist worker
pdfjs.GlobalWorkerOptions.workerSrc = `../node_modules/pdfjs-dist/build/pdf.worker.min.js`;

const PDFViewer = () => {
  const location = useLocation();
  const fileUrl = location.state?.fileUrl || ""; // Use optional chaining to get fileUrl, and default to an empty string if null
  console.log(fileUrl);

  const [numPages, setNumPages] = useState(null); // Store number of pages
  const [pageNumber, setPageNumber] = useState(1); // Store current page number

  // Function to call when the document loads successfully
  const onDocumentSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Function to go to the previous page
  const goToPrevPage = () => {
    setPageNumber(prevPage => Math.max(prevPage - 1, 1));
  };

  // Function to go to the next page
  const goToNextPage = () => {
    setPageNumber(prevPage => Math.min(prevPage + 1, numPages));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
     <iframe src={{fileUrl}} width={'1000px'} height={'500px'}></iframe>
    </div>
  );
};

export default PDFViewer;
