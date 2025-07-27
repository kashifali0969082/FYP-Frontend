import "./App.css";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import LandingPage from "./Components/Landing/Landing";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ErrorComponent from "./Components/Landing/ErrorComponent";
import Dashboard from "./Components/TEsting/Testing";
import { AuthProvider, useAuth } from "./Components/Security/Authcontext";
import StudyMode from "./Components/PdfViewer/viewer";
import PdfRenderer from "./Components/Comps/pdftest";
import LearningProfileForm from "./Components/TEsting/LearningProfileForm";
// import { AuthProvider } from "./Components/Security/Authcontext";



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

          
          <Route path="/pdf" element={
             <Authenticatedroute>
             < PdfRenderer />
             </Authenticatedroute>} />
        
          <Route path="/StudyMode" element={
            <Authenticatedroute>
            <StudyMode />
            </Authenticatedroute>} />
        
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
