import {
  Upload,
  Files,
  Trash2,
  Play,
  Flame,
  BarChart3,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react";

import { StreakComponent} from "../TEsting/StreakComponent";
import { useContext, useEffect, useState } from "react";
import { streakapi } from "../apiclient/Studystreakapi";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../Security/Authcontext";
import LearningProfileForm from "../TEsting/LearningProfileForm";
import { learningProfilestatusapi } from "../apiclient/LearningProfileapis";

export const HomePage = ({setUploadedFiles,setIsUploadModalOpen,isMobile,uploadedFiles,setCurrentPage,setIsMobileSidebarOpen}) => {
    const openInStudyMode = (file) => {
    setCurrentPage("study");
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
    console.log("Opening file in study mode:", file);
  };
    const deleteFile = (id) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.id !== id));
  };
  //   apis
useEffect(() => {
    try {
       streakApiResponse();
    } catch (error) {
      console.error("Error fetching streak:", error);
    }
}, []);

function streakApiResponse(values) {
  console.log("called streak data");


  return streakapi()
    .then((response) => {
     // console.log(response);
        const { current_streak, longest_streak, last_active_date } = response.data;

      const streakdata = {
        current_streak,
        longest_streak,
        last_active_date,
      };
      console.log(streakdata)
    })
    .catch((error) => {
      console.log("API error in streakApiResponse:", error);
      throw error;  
    });
} // end api  ........
// const [username,setusername] = useState('')   // this method is for testing purpose 
//  useEffect(() => {
//   const hardcodedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZmE2YWQ4Zi0zNTgyLTQzZmItOWEwYy02YTI5NzJkNGMyYWIiLCJlbWFpbCI6ImYyMDIxMDY1MTEyQGdtYWlsLmNvbSIsIm5hbWUiOiJIYXJyaXMgaWpheiIsInByb2ZpbGVfcGljIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSVBQaWRoUERlLVR2bDAzakx2THplT1N6OGgwSWE2X2gzR0lCU2pFeTVscGFqSFpnPXM5Ni1jIiwiZXhwIjoxNzUzNDc2MTM0fQ.KbkiS5vQn2zaSTUP_3cxLtkrzVkCePEhmicgYSfjH9k";

//     if (hardcodedToken) {
//       // Save token to cookie
//       Cookies.set("access_token", hardcodedToken, { expires: 7 });

//       try {
//         const decoded = jwtDecode(hardcodedToken);
//         setusername(decoded.name); // Use decoded.email if you want email
//       } catch (err) {
//         console.error("Token decode error:", err);
//       }
//     } else {
//       // Already stored token in cookie
//       const savedToken = Cookies.get("access_token");
//       if (savedToken) {
//         try {
//           const decoded = jwtDecode(savedToken);
//           setusername(decoded.name);
//         } catch (err) {
//           console.error("Decode error from cookie:", err);
//         }
//       }
//     }
//   }, []);

  // useEffect(() => {
 
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const tokenFromURL = urlParams.get("token");

  //   if (tokenFromURL) {
  //     Cookies.set("access_token", tokenFromURL, { expires: 7 });

  //     try {
  //       const decoded = jwtDecode(tokenFromURL);
  //       setusername(decoded.name); // or decoded.email
  //     } catch (err) {
  //       console.error("Token decode error:", err);
  //     }

    
  //     window.history.replaceState({}, document.title, "/");  // optional
  //   } else {
     
  //     const savedToken = Cookies.get("access_token");
  //     if (savedToken) {
  //       try {
  //         const decoded = jwtDecode(savedToken);
  //         setusername(decoded.name);
  //       } catch (err) {
  //         console.error("Decode error from cookie:", err);
  //       }
  //     }
  //   }
  // }, []);
const {username} = useContext(AuthContext)
console.log(username)

  return(
    <div className="flex flex-col xl:flex-row gap-8">

      {/* Dashboard Area */}
      <div className="flex-1 space-y-8">
        {/* Welcome Section with Gradient */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-6 md:p-8 text-white">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Welcome back, {username}</h2>
            <p className="text-lg md:text-xl text-blue-100 mb-4 md:mb-6">
              Continue your learning journey with AI
            </p>
          </div>
          {/* Decorative gradient orbs */}
          <div className="absolute -top-10 -right-10 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-50 blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-40 blur-xl"></div>
        </div>

        {/* Upload Section */}
        <div 
          onClick={() => setIsUploadModalOpen(true)}
          className="relative group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl md:rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 md:p-8 rounded-xl md:rounded-2xl hover:border-blue-500/50 transition-all duration-300">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center">
                <Upload size={isMobile ? 24 : 32} className="text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">Upload Your Files</h3>
              <p className="text-sm md:text-base text-slate-400">
                Drop your books, presentations, or notes to get started
              </p>
            </div>
          </div>
        </div>

        {/* Recently Uploaded Files */}
        <div>
          <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-white">Recently Uploaded Files</h3>
          <div className="space-y-3 md:space-y-4">
            {uploadedFiles.slice(0, 5).map((file) => {
              const IconComponent = file.icon;
              return (
                <div key={file.id} className="group">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg md:rounded-xl p-4 md:p-6 hover:border-slate-600/50 transition-all duration-300">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                          <IconComponent size={isMobile ? 20 : 24} className="text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-white truncate text-sm md:text-base">{file.name}</h4>
                          <p className="text-xs md:text-sm text-slate-400">
                            {file.type} • {file.uploadDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
                        <button 
                          onClick={() => openInStudyMode(file)}
                          className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                        >
                          <Play size={14} />
                          <span className="text-sm md:text-base">Study</span>
                        </button>
                        <button 
                          onClick={() => deleteFile(file.id)}
                          className="p-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Panel - Hidden on mobile, stacked on tablet */}
      <div className="w-full xl:w-80 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-6 xl:space-y-0">
        {/* Streak Tracker */}
        <div>
       <StreakComponent streakData={streakApiResponse} />
       
</div>

        {/* Analytics */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl md:rounded-2xl blur-lg opacity-20"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg md:rounded-xl flex items-center justify-center">
                <BarChart3 size={isMobile ? 20 : 24} className="text-white" />
              </div>
              <h3 className="font-semibold text-white text-sm md:text-base">Your Progress</h3>
            </div>
            <div className="space-y-3 md:space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Clock size={14} className="text-blue-400" />
                  <span className="text-xs md:text-sm text-slate-300">Study Time</span>
                </div>
                <span className="font-semibold text-white text-xs md:text-sm">24h 30m</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Files size={14} className="text-purple-400" />
                  <span className="text-xs md:text-sm text-slate-300">Files Studied</span>
                </div>
                <span className="font-semibold text-white text-xs md:text-sm">12</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Target size={14} className="text-green-400" />
                  <span className="text-xs md:text-sm text-slate-300">MCQs Completed</span>
                </div>
                <span className="font-semibold text-white text-xs md:text-sm">247</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <TrendingUp size={14} className="text-orange-400" />
                  <span className="text-xs md:text-sm text-slate-300">Accuracy Rate</span>
                </div>
                <span className="font-semibold text-white text-xs md:text-sm">87%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )};