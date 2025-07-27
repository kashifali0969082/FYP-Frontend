import {
  Upload,
  Files,
  Trash2,
  Play,
  Flame,
} from "lucide-react";

import { StreakComponent} from "../TEsting/StreakComponent";
import LeaderboardPreview from "./LeaderboardPreview";
import { useContext, useEffect, useState } from "react";
// Removed streakapi import - data now comes from parent to eliminate duplicate API calls
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../Security/Authcontext";
import LearningProfileForm from "../TEsting/LearningProfileForm";
import { learningProfilestatusapi } from "../apiclient/LearningProfileapis";
import { useStreakUpdate } from "../../hooks/useStreakUpdate";
import StreakUpdateModal from "./StreakUpdateModal";

export const HomePage = ({
  setUploadedFiles, 
  setIsUploadModalOpen, 
  isMobile, 
  uploadedFiles, 
  setCurrentPage, 
  setIsMobileSidebarOpen, 
  isFilesLoading, 
  filesError, 
  refreshFiles, 
  handleDeleteClick, 
  deletingFileId,
  // New props to receive data from parent to eliminate duplicate API calls
  userData, 
  isUserDataLoading = false,
  streakData,
  isStreakLoading = false,
  leaderboardData,
  isLeaderboardLoading = false
}) => {
    // No local state needed - use props from parent to eliminate duplicate API calls
    
    // Streak update hook
    const { triggerStreakUpdate, isModalOpen, streakData: streakUpdateData, closeModal } = useStreakUpdate();
    
    const openInStudyMode = async (file) => {
    console.log("📚 Opening file in study mode:", file);
    
    setCurrentPage("study");
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
    
    // Trigger streak update when opening file in study mode
    await triggerStreakUpdate();
  };
  
  //   APIs - ALL DATA NOW COMES FROM PARENT TO ELIMINATE DUPLICATE CALLS
  // No useEffect needed - all data is passed as props from Testing.jsx
  // This eliminates duplicate streakapi() and leaderboard API calls

// User API function - REMOVED to eliminate duplicate API calls
// User data is now extracted from JWT token instead of API calls for better performance
// This eliminates any need for userapi() calls as all user info is in the token

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
console.log("username from context:", username)
console.log("Current userData:", userData)
console.log("Display name will be:", userData?.name || username)

  return(
    <div className="flex flex-col xl:flex-row gap-4 md:gap-6 xl:gap-8 min-h-screen p-4 md:p-6 xl:p-0">

      {/* Dashboard Area */}
      <div className="flex-1 space-y-4 md:space-y-6 xl:space-y-8">
        {/* Welcome Section with Gradient */}
        <div className="relative overflow-hidden rounded-xl md:rounded-2xl xl:rounded-3xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-4 md:p-6 xl:p-8 text-white">
          <div className="relative z-10">
            <h2 className="text-xl md:text-2xl xl:text-4xl font-bold mb-2 md:mb-3 xl:mb-4">
              {isUserDataLoading ? (
                <div className="flex items-center gap-2 md:gap-3">
                  <span>Welcome,</span>
                  <div className="h-6 md:h-8 xl:h-10 bg-white/20 rounded animate-pulse w-24 md:w-32 xl:w-48"></div>
                </div>
              ) : (
                `Welcome, ${userData?.name || username}!`
              )}
            </h2>
            <p className="text-sm md:text-lg xl:text-xl text-blue-100 mb-3 md:mb-4 xl:mb-6">
              Continue your learning journey with Adaptive AI
            </p>
          </div>
          {/* Decorative gradient orbs */}
          <div className="absolute -top-6 -right-6 md:-top-8 md:-right-8 xl:-top-10 xl:-right-10 w-20 h-20 md:w-32 md:h-32 xl:w-40 xl:h-40 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-50 blur-xl"></div>
          <div className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 xl:-bottom-10 xl:-left-10 w-16 h-16 md:w-24 md:h-24 xl:w-32 xl:h-32 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-40 blur-xl"></div>
        </div>

        {/* Upload Section */}
        <div 
          onClick={() => setIsUploadModalOpen(true)}
          className="relative group cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg md:rounded-xl xl:rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-4 md:p-6 xl:p-8 rounded-lg md:rounded-xl xl:rounded-2xl hover:border-blue-500/50 transition-all duration-300">
            <div className="text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 xl:w-16 xl:h-16 mx-auto mb-3 md:mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg md:rounded-xl xl:rounded-2xl flex items-center justify-center">
                <Upload size={isMobile ? 20 : 24} className="text-white" />
              </div>
              <h3 className="text-base md:text-lg xl:text-xl font-semibold mb-1 md:mb-2 text-white">Upload Your Files</h3>
              <p className="text-xs md:text-sm xl:text-base text-slate-400">
                Drop your books, presentations, or notes to get started
              </p>
            </div>
          </div>
        </div>

        {/* Recently Uploaded Files */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3 md:mb-4 xl:mb-6">
            <h3 className="text-lg md:text-xl xl:text-2xl font-semibold text-white">Recently Uploaded Files</h3>
            {uploadedFiles.length > 5 && (
              <span className="text-xs md:text-sm text-slate-400">Showing 5 most recent</span>
            )}
          </div>
          <div className="space-y-2 md:space-y-3 xl:space-y-4 min-h-[300px] md:min-h-[400px]">
            {isFilesLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <div key={`skeleton-${index}`} className="group">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg xl:rounded-xl p-2 md:p-3 xl:p-6 animate-pulse">
                    <div className="flex items-center justify-between gap-2 md:gap-3 xl:gap-4">
                      <div className="flex items-center space-x-2 md:space-x-3 xl:space-x-4 min-w-0 flex-1">
                        <div className="w-8 h-8 md:w-10 md:h-10 xl:w-12 xl:h-12 bg-slate-600/50 rounded-lg xl:rounded-xl flex-shrink-0"></div>
                        <div className="min-w-0 flex-1">
                          <div className="h-3 md:h-4 xl:h-5 bg-slate-600/50 rounded w-3/4 mb-1 md:mb-2"></div>
                          <div className="h-2 md:h-3 bg-slate-600/50 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 md:space-x-2 xl:space-x-3 flex-shrink-0">
                        <div className="h-6 md:h-8 bg-slate-600/50 rounded-lg w-12 md:w-16 xl:w-20"></div>
                        <div className="h-6 w-6 md:h-8 md:w-8 bg-slate-600/50 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : filesError ? (
              // Error state - only show if there's actually an API error
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 mb-4 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <Files size={32} className="text-red-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Failed to Load Files</h4>
                <p className="text-slate-400 mb-4 max-w-md">
                  There was an issue connecting to the server. Please check your connection and try again.
                </p>
                <button 
                  onClick={refreshFiles}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  Try Again
                </button>
              </div>
            ) : uploadedFiles.length === 0 ? (
              // Empty state - user has no files yet
              <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center">
                  <Upload size={isMobile ? 24 : 32} className="text-white" />
                </div>
                <h4 className="text-base md:text-lg font-semibold text-white mb-2">Ready to Start Learning?</h4>
                <p className="text-sm md:text-base text-slate-400 mb-4 md:mb-6 max-w-sm md:max-w-md px-4">
                  Upload your first document to begin your personalized learning journey with AdaptiveLearn AI. 
                  We support books, presentations, and notes.
                </p>
                <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex items-center space-x-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 text-sm md:text-base"
                >
                  <Upload size={16} />
                  <span>Upload Your First File</span>
                </button>
              </div>
            ) : (
              // Files list
              uploadedFiles.slice(0, 5).map((file) => {
                const IconComponent = file.icon;
                return (
                  <div key={file.id} className="group">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg xl:rounded-xl p-2 md:p-3 xl:p-6 hover:border-slate-600/50 transition-all duration-300">
                      <div className="flex items-center justify-between gap-2 md:gap-3 xl:gap-4">
                        <div className="flex items-center space-x-2 md:space-x-3 xl:space-x-4 min-w-0 flex-1 overflow-hidden">
                          <div className="w-8 h-8 md:w-10 md:h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg xl:rounded-xl flex items-center justify-center flex-shrink-0">
                            <IconComponent size={isMobile ? 16 : 20} className="text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-white truncate text-xs md:text-sm xl:text-base leading-tight">
                              {file.name.length > (isMobile ? 25 : 50) ? `${file.name.substring(0, isMobile ? 25 : 50)}...` : file.name}
                            </h4>
                            <p className="text-xs text-slate-400 truncate">
                              {file.type} • {file.uploadDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 md:space-x-2 xl:space-x-3 flex-shrink-0">
                          <button 
                            onClick={() => openInStudyMode(file)}
                            className="flex items-center space-x-1 px-2 md:px-3 xl:px-4 py-1.5 md:py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                          >
                            <Play size={10} className="md:w-3 md:h-3" />
                            <span className="text-xs xl:text-sm hidden sm:inline">Study</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(file)}
                            disabled={deletingFileId === file.id}
                            className="p-1 md:p-1.5 xl:p-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingFileId === file.id ? (
                              <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 size={10} className="md:w-3 md:h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Fixed position and height */}
      <div className="w-full xl:w-80 xl:sticky xl:top-8 xl:h-fit xl:max-h-screen xl:overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4 md:gap-6">
          {/* Streak Tracker */}
          <div>
            <StreakComponent streakData={streakData} isLoading={isStreakLoading} />
          </div>

          {/* Leaderboard Preview */}
          <div>
            <LeaderboardPreview 
              isMobile={isMobile} 
              setCurrentPage={setCurrentPage}
              setIsMobileSidebarOpen={setIsMobileSidebarOpen}
              // Pass leaderboard data from parent to eliminate duplicate API calls
              leaderboardData={leaderboardData}
              isLeaderboardLoading={isLeaderboardLoading}
            />
          </div>
        </div>
      </div>
      
      {/* Streak Update Modal */}
      <StreakUpdateModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        streakData={streakUpdateData} 
      />
    </div>
  );
};