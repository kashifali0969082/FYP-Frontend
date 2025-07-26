import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./Components/Landing/Landing";
import Testing from "./Components/TEsting/Testing";
import Dashboard from "./Components/TEsting/Testing";
import StudyMode from "./Components/PdfViewer/viewer";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={< Dashboard/>} />
                <Route path="/StudyMode" element={<StudyMode />} />

      </Routes>
    </Router>
  );
}

export default App
