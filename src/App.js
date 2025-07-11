import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./Components/Landing/Landing";
import ErrorComponent from "./Components/Landing/ErrorComponent";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
         <Route path="/*" element={<ErrorComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
