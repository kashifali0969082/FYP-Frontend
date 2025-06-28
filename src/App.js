import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./Components/Landing/Landing";
import Testing from "./Components/TEsting/Testing";
import Dashboard from "./Components/TEsting/Testing";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/test" element={< Dashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;
