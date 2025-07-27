import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LandingPage from "./Components/Landing/Landing";
import ErrorComponent from "./Components/Landing/ErrorComponent";
import Dashboard from "./Components/TEsting/Testing";
import StudyMode from "./Components/PdfViewer/viewer";
import PdfRenderer from "./Components/Comps/pdftest";
import LearningProfileForm from "./Components/TEsting/LearningProfileForm";
import { AuthProvider } from "./Components/Security/Authcontext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pdf" element={<PdfRenderer />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/StudyMode" element={<StudyMode />} />
          <Route path="/form" element={<LearningProfileForm />} />
          <Route path="*" element={<ErrorComponent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
