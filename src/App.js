import "./App.css";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import LandingPage from "./Components/Landing/Landing";

import ErrorComponent from "./Components/Landing/ErrorComponent";
import Testing from "./Components/TEsting/Testing";
import Dashboard from "./Components/TEsting/Testing";
import Streaks from "./Components/TEsting/Streaks";
import { StreakComponent } from "./Components/TEsting/StreakComponent";
import { AuthProvider, useAuth } from "./Components/Security/Authcontext";
import LearningProfileForm from "./Components/TEsting/LearningProfileForm";



function Authenticatedroute({children}){
   const authContext = useAuth()
   if(authContext.isauthenticated)
    return children

   return <Navigate to="/"/>
}
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
         <Route path="/*" element={<ErrorComponent />} />
        <Route path="/dashboard" element={
          
          <Authenticatedroute>
          < Dashboard/>
          </Authenticatedroute>} />
        <Route path="/form" element={
          <Authenticatedroute>
          < LearningProfileForm/>
          </Authenticatedroute>} />
        
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App
