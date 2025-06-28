import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./Components/Landing/Landing";
import Dashboard from "./Components/Landing/Dashboard";
import Oauthcallback from "./Components/Landing/Oauthcallback";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dash" element={<Dashboard />} />
         <Route path="/oauth/callback" element={<Oauthcallback />} />
      </Routes>
    </Router>
  );
}

export default App;
