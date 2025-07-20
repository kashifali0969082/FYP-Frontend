import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./Components/Landing/Landing";

import ErrorComponent from "./Components/Landing/ErrorComponent";
import Testing from "./Components/TEsting/Testing";
import Dashboard from "./Components/TEsting/Testing";
import Streaks from "./Components/TEsting/Streaks";
import { StreakComponent } from "./Components/TEsting/StreakComponent";
import { AuthProvider } from "./Components/Security/Authcontext";
import LearningProfileForm from "./Components/TEsting/LearningProfileForm";

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
         <Route path="/*" element={<ErrorComponent />} />
        <Route path="/dashboard" element={< Dashboard/>} />
        <Route path="/form" element={< LearningProfileForm/>} />
        
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App
