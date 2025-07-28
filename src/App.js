import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./Components/Landing/Landing";
import Testing from "./Components/TEsting/Testing";
import Dashboard from "./Components/TEsting/Testing";
import StudyMode from "./Components/PdfViewer/viewer";
import { PdfViewer } from "./Components/Comps/pdftest";
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Testing />} />
        <Route path="/dashboard" element={< Dashboard/>} />
                <Route path="/StudyMode" element={<StudyMode />} />

      </Routes>
    </Router>
  );
}

export default App
