import React, { useRef, useState, useEffect, useContext } from "react";
import {
  BookOpen,
  Upload,
  Files,
  User,
  LogOut,
  Sun,
  Moon,
  X,
  HelpCircle,
  FileText,
  Image,
  Presentation,
  Trash2,
  Play,
  Flame,
  BarChart3,
  Clock,
  Target,
  TrendingUp,
  Menu,
  ChevronLeft,
  Trophy,
  History,
} from "lucide-react";

import { MobileHeader } from "../Comps/MobileHeader";
import { HomePage } from "../Comps/HomePage";
import { StudyModePage } from "../Comps/StudyMode";
import { FilesPage } from "../Comps/FilePage";
import LeaderboardPage from "../Comps/LeaderboardPage";
import { QuizBuilderMain } from "../Comps/QuizBuilder/QuizBuilderMain";
import { QuizManager } from "../Comps/QuizBuilder/QuizManager";
import { GetAllFiles, DeleteFile } from "../apiclient/FileRetrievalapis";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../Security/Authcontext";
import { learningProfilestatusapi } from "../apiclient/LearningProfileapis";
import { userapi, streakapi, streakLeaderboardapi } from "../apiclient/Studystreakapi";
import LearningProfileForm from "./LearningProfileForm";
import { getCookie, setCookie } from "../Security/cookie";
import { FileUpload } from "../apiclient/Filesapi";

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [tocPageRange, setTocPageRange] = useState("");
  const [tocError, setTocError] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [isUploading, setIsUploading] = useState(false); // Add loading state
  const [uploadProgress, setUploadProgress] = useState(0); // Upload progress percentage
  const [uploadStatus, setUploadStatus] = useState(""); // Upload status message
  const [uploadSuccess, setUploadSuccess] = useState(false); // Upload success state
  
  // User data state for sidebar
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profile_pic: "",
    id: ""
  });
  
  // Loading state for user data
  const [isUserDataLoading, setIsUserDataLoading] = useState(true);
  
  // Loading state for files
  const [isFilesLoading, setIsFilesLoading] = useState(true);
  const [filesError, setFilesError] = useState(null);
  
  // Cache mechanism to prevent unnecessary refetches
  const [dataCache, setDataCache] = useState({
    userDataFetched: false,
    filesFetched: false,
    lastFetchTime: null
  });
  
  // Delete states
  const [deletingFileId, setDeletingFileId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Function to validate TOC page range
  const validateTocPageRange = (range) => {
    setTocError("");

    if (!range.trim()) {
      setTocError("TOC page range is required for books");
      return false;
    }

    const rangePattern = /^\d+-\d+$/;
    if (!rangePattern.test(range.trim())) {
      setTocError("Please enter a valid range format (e.g., 2-3)");
      return false;
    }

    const [startPage, endPage] = range.trim().split("-").map(Number);

    if (startPage >= endPage) {
      setTocError("Start page must be less than end page");
      return false;
    }

    if (startPage <= 0 || endPage <= 0) {
      setTocError("Page numbers must be positive");
      return false;
    }

    return true;
  };

  const handleTocChange = (e) => {
    const value = e.target.value;
    setTocPageRange(value);

    if (value.trim()) {
      validateTocPageRange(value);
    } else {
      setTocError("");
    }
  };

  // Enhanced file upload function with progress tracking
 const uploadFile = async (fileData) => {
  try {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus("Preparing upload...");

    const formData = new FormData();
    formData.append("file", fileData.file);
    formData.append("document_type", fileData.document_type);

    if (fileData.document_type === "book" && fileData.toc_pages) {
      formData.append("toc_pages", fileData.toc_pages);
    }

    // Debug log
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    setUploadStatus("Uploading file...");

    // Upload to API with progress tracking
    const response = await FileUpload(formData, (progress) => {
      setUploadProgress(progress);
      if (progress < 100) {
        setUploadStatus(`Uploading... ${progress}%`);
      } else {
        setUploadStatus("Processing file...");
      }
    });

    setUploadStatus("Upload successful!");
    setUploadProgress(100);
    setUploadSuccess(true);
    
    // Brief delay to show success message
    setTimeout(() => {
      alert(`Upload successful: ${response.message}`);
    }, 500);

    // Manually add the uploaded file to the state instead of API call
    const newFile = {
      id: response.file_id || Date.now().toString(), // Use response ID or timestamp as fallback
      name: fileData.file.name,
      uploadDate: new Date().toISOString().split('T')[0],
      type: fileData.document_type === 'book' ? 'Book' : 
            fileData.document_type === 'presentation' ? 'Presentation' : 'Notes',
      icon: fileData.document_type === 'book' ? BookOpen : 
            fileData.document_type === 'presentation' ? Presentation : FileText,
      meta: {
        fileType: fileData.document_type
      }
    };

    // Add to the beginning of the files array (newest first)
    setUploadedFiles(prev => [newFile, ...prev]);
    
    // Delay closing modal to show success state
    setTimeout(() => {
      handleModalClose();
    }, 1000);

    return response;
  } catch (error) {
    console.error("Upload failed:", error);
    setUploadStatus("Upload failed!");
    setUploadProgress(0);
    setUploadSuccess(false);
    alert(`Upload failed: ${error?.response?.data?.message || error.message}`);
    throw error;
  } finally {
    // Reset states after a delay if not successful
    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStatus("");
      setUploadSuccess(false);
    }, 2000);
  }
};

  // Helper function to get file icon
  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case "book":
        return BookOpen;
      case "presentation":
        return Presentation;
      case "notes":
        return FileText;
      default:
        return FileText;
    }
  };

  const getFilesFun = async () => {
    setIsFilesLoading(true);
    setFilesError(null);
    
    try {
      console.log("🔄 Starting optimized files fetch...");
      const response = await GetAllFiles();
      console.log("📁 Files API Response:", response);
      
      const { books, presentations, notes } = response;
      
      // Optimized file transformation with better performance
      const transformedFiles = [];
      
      // Process all file types efficiently
      const fileTypes = [
        { data: books, type: 'Book', icon: BookOpen, fileType: 'book' },
        { data: presentations, type: 'Presentation', icon: Presentation, fileType: 'presentation' },
        { data: notes, type: 'Notes', icon: FileText, fileType: 'notes' }
      ];
      
      fileTypes.forEach(({ data, type, icon, fileType }) => {
        if (data && Array.isArray(data) && data.length > 0) {
          console.log(`📄 Processing ${data.length} ${fileType}(s)`);
          
          data.forEach((item, index) => {
            const fileName = item.title || item.original_filename || item.file_name || 
                           item.filename || item.name || `${type}_${item.id || index}`;
            
            transformedFiles.push({
              id: item.id || `${fileType}_${index}`,
              name: fileName,
              uploadDate: item.created_at ? item.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
              type,
              icon,
              meta: {
                s3Key: item.s3_key,
                fileType,
                ...(type === 'Presentation' && {
                  totalSlides: item.total_slides,
                  hasSpeakerNotes: item.has_speaker_notes
                })
              }
            });
          });
        }
      });
      
      // Sort by upload date (newest first) - more efficient sorting
      const sortedFiles = transformedFiles.sort((a, b) => 
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      );
      
      console.log(`✅ Successfully processed ${sortedFiles.length} files`);
      setUploadedFiles(sortedFiles);
      
    } catch (error) {
      console.error("❌ Error fetching files:", error);
      
      // Improved error handling with better UX
      if (error.response?.status === 500 || error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        setFilesError("Unable to connect to the server. Please check your internet connection.");
      } else if (error.response?.status === 401) {
        setFilesError("Authentication failed. Please log in again.");
      } else if (error.response?.status === 404) {
        // 404 might just mean no files exist, don't show as error
        console.log("No files found (404) - this is normal for new users");
        setUploadedFiles([]);
      } else {
        setFilesError("Something went wrong while loading your files.");
      }
      
    } finally {
      setIsFilesLoading(false);
    }
  };

  // Add states for comprehensive data management
  const [streakData, setStreakData] = useState(null);
  const [isStreakLoading, setIsStreakLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(true);

  useEffect(() => {
    // Centralized data fetching - fetch ALL required data in parallel for maximum performance
    const initializeApp = async () => {
      try {
        console.log("🚀 Starting comprehensive app initialization...");
        
        // Fetch ALL data in parallel - user data, files, streak data, and leaderboard
        const [userDataResult, filesResult, streakResult, leaderboardResult] = await Promise.allSettled([
          fetchUserData(),
          getFilesFun(),
          fetchStreakData(),
          fetchLeaderboardData()
        ]);
        
        // Log results for debugging
        if (userDataResult.status === 'rejected') {
          console.warn("User data fetch failed:", userDataResult.reason);
        }
        if (filesResult.status === 'rejected') {
          console.warn("Files fetch failed:", filesResult.reason);
        }
        if (streakResult.status === 'rejected') {
          console.warn("Streak data fetch failed:", streakResult.reason);
        }
        if (leaderboardResult.status === 'rejected') {
          console.warn("Leaderboard fetch failed:", leaderboardResult.reason);
        }
        
        console.log("✅ Comprehensive app initialization complete");
      } catch (error) {
        console.error("❌ App initialization error:", error);
      }
    };

    initializeApp();
    // setShowForm(true);
  }, []);

  // Centralized streak data fetching
  const fetchStreakData = () => {
    console.log("🔧 Testing.jsx - fetchStreakData called - starting streak data fetch");
    setIsStreakLoading(true);

    return streakapi()
      .then((response) => {
        console.log("🔧 Testing.jsx - Streak API Response:", response.data);
        setStreakData(response.data);
        setIsStreakLoading(false);
        return response.data;
      })
      .catch((error) => {
        console.log("🔧 Testing.jsx - API error in fetchStreakData:", error);
        setIsStreakLoading(false);
        throw error;
      });
  };

  // Centralized leaderboard data fetching
  const fetchLeaderboardData = () => {
    console.log("🔧 Testing.jsx - fetchLeaderboardData called - starting leaderboard data fetch");
    setIsLeaderboardLoading(true);

    return streakLeaderboardapi()
      .then((response) => {
        console.log("🔧 Testing.jsx - Leaderboard API Response:", response.data);
        setLeaderboardData(response.data);
        setIsLeaderboardLoading(false);
        return response.data;
      })
      .catch((error) => {
        console.log("🔧 Testing.jsx - API error in fetchLeaderboardData:", error);
        setIsLeaderboardLoading(false);
        throw error;
      });
  };

  // User API function for sidebar with caching
  const fetchUserData = () => {
    // Check cache to avoid unnecessary API calls
    if (dataCache.userDataFetched && userData.id) {
      console.log("🚀 Using cached user data, skipping API call");
      setIsUserDataLoading(false);
      return Promise.resolve(userData);
    }

    console.log("🔧 Testing.jsx - fetchUserData called - starting user data fetch for sidebar");
    setIsUserDataLoading(true);

    return userapi()
      .then((response) => {
        console.log("🔧 Testing.jsx - Sidebar User API Response:", response.data);
        const { id, email, name, profile_pic } = response.data;
        
        const userInfo = {
          id,
          email,
          name,
          profile_pic
        };
        
        console.log("🔧 Testing.jsx - Setting userData to:", userInfo);
        setUserData(userInfo);
        setIsUserDataLoading(false);
        
        // Update cache
        setDataCache(prev => ({
          ...prev,
          userDataFetched: true,
          lastFetchTime: Date.now()
        }));
        
        return userInfo;
      })
      .catch((error) => {
        console.log("🔧 Testing.jsx - API error in sidebar fetchUserData:", error);
        setIsUserDataLoading(false);
        throw error;
      });
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleFileUpload = async () => {

    
    // Validation
    if (!selectedFileType) {
      alert("Please select a file type");
      return;
    }

    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    if (selectedFileType === "Book") {
      if (!validateTocPageRange(tocPageRange)) {
        return;
      }
    }

    // Prepare file data
    const fileData = {
      file: selectedFile,
      document_type: selectedFileType.toLowerCase(), // Convert to lowercase for API
      toc_pages: selectedFileType === "Book" ? tocPageRange : null,
    };

    try {
      await uploadFile(fileData);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const openInStudyMode = (file) => {
    setCurrentPage("study");
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
    console.log("Opening file in study mode:", file);
  };

  const navigateToPage = (page) => {
    setCurrentPage(page);
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  // Delete file functions
  const handleDeleteClick = (file) => {
    setFileToDelete(file);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;
    
    try {
      setDeletingFileId(fileToDelete.id);
      setShowDeleteConfirm(false);
      
      // Log the complete file object to see its structure
      console.log("🔍 FILE TO DELETE - Complete object:", fileToDelete);
      console.log("🔍 File ID:", fileToDelete.id);
      console.log("🔍 File meta:", fileToDelete.meta);
      console.log("🔍 File type:", fileToDelete.type);
      
      // Convert file type to match API expectations
      const docType = fileToDelete.meta.fileType || fileToDelete.type.toLowerCase();
      
      console.log(`🗑️ FINAL VALUES FOR DELETE:`);
      console.log(`   File ID: "${fileToDelete.id}"`);
      console.log(`   Doc Type: "${docType}"`);
      
      await DeleteFile(fileToDelete.id, docType);
      
      // Remove from UI manually - no API refresh needed
      setUploadedFiles(prev => prev.filter(f => f.id !== fileToDelete.id));
      
      console.log("✅ File deleted successfully");
    } catch (error) {
      console.error("❌ Delete failed:", error);
    } finally {
      setDeletingFileId(null);
      setFileToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setFileToDelete(null);
  };




  const handleModalClose = () => {
    setIsUploadModalOpen(false);
    setSelectedFileType("");
    setSelectedFile(null);
    setTocPageRange("");
    setTocError("");
    setUploadProgress(0);
    setUploadStatus("");
    setUploadSuccess(false);
  };

  const isUploadButtonEnabled = () => {
    if (!selectedFileType || !selectedFile || isUploading) {
      return false;
    }

    if (selectedFileType === "Book") {
      return tocPageRange && !tocError;
    }

    return true;
  };

  const fileInputRef = useRef(null);
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    console.log("Selected file:", file.name, "Type:", file.type);

    // File type validation
    const validateFileType = (fileType, allowedTypes, typeName) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`Please upload ${typeName} only.`);
        setSelectedFile(null);
        return false;
      }
      return true;
    };

    switch (selectedFileType) {
      case "Book":
        if (validateFileType(file.type, ["application/pdf"], "a PDF file")) {
          setSelectedFile(file);
        }
        break;
      case "Presentation":
        if (
          validateFileType(
            file.type,
            [
              "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            ],
            "a PPTX file"
          )
        ) {
          setSelectedFile(file);
        }
        break;
     case "Notes":
  if (
    validateFileType(
      file.type,
      [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "text/plain", // .txt
      ],
      "PDF, DOCX, or TXT files"
    )
  ) {
    setSelectedFile(file);
  }
  break;

      default:
        alert("Please select a file type before uploading");
        setSelectedFile(null);
    }
  };
 //     My work ///////////////////////////////////////////////////////////////////////////////////////////////////////
  const {username} = useContext(AuthContext)
  
  // Debug userData in sidebar
  console.log("Testing.jsx - username from context:", username)
  console.log("Testing.jsx - userData state:", userData)
 
  const navigate = useNavigate()
  function logouthandler(){
navigate("/")
  }
  
  const [showForm, setShowForm] = useState(false);
  

useEffect(() => {
  const checkLearningProfile = async () => {
    const isSubmitted = getCookie("learningProfileSubmitted");
    console.log("Cookie value for learningProfileSubmitted:", isSubmitted);
    
    if (isSubmitted === "true") {
      console.log("Using cookie value - form already submitted");
      setShowForm(false);
      return;
    }

    try {
      console.log("Making API call to check learning profile status");
      const response = await learningProfilestatusapi();
      console.log("API Response for learning profile status:", response?.data);
      
      if (response?.data) {
        setShowForm(!response.data.submitted);
        if (response.data.submitted) {
          console.log("Setting cookie based on API response");
          setCookie("learningProfileSubmitted", "true", 365);
        }
      }
    } catch (err) {
      console.error("Profile status error:", err);
      console.log("Showing form due to API error");
      setShowForm(true);
    }
  };

  console.log("Checking learning profile status");
  checkLearningProfile();
}, []);
  

  const handleFormComplete = () => {
    setCookie("learningProfileSubmitted", "true", 365);
    setShowForm(false); // show welcome screen after form is submitted
  // navigate("/dashboard")
  };

  // if (loading) return <div>loading..</div>


  if (showForm) return <LearningProfileForm onComplete={handleFormComplete}/>;


  return (
    
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-tr from-pink-500/10 to-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative flex">
        {/* Mobile Overlay */}
        {isMobile && isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
          ${isMobile ? "fixed" : "sticky"} top-0 h-screen z-50
          ${
            isMobile && !isMobileSidebarOpen
              ? "-translate-x-full"
              : "translate-x-0"
          }
          ${isMobile ? "w-72" : isSidebarCollapsed ? "w-16 md:w-20" : "w-72"}
          bg-slate-800/90 backdrop-blur-sm border-r border-slate-700/50 
          flex flex-col transition-all duration-300
        `}
        >
          {/* Logo/Title */}
          <div className="p-4 md:p-6 border-b border-slate-700/50 flex items-center justify-between">
            {(!isSidebarCollapsed || isMobile) && (
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AdaptiveLearnAI
              </h1>
            )}
            {!isMobile && (
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
              >
                {isSidebarCollapsed ? (
                  <Menu size={20} />
                ) : (
                  <ChevronLeft size={20} />
                )}
              </button>
            )}
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-3 md:p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigateToPage("home")}
                  className={`flex items-center ${
                    isSidebarCollapsed && !isMobile
                      ? "justify-center"
                      : "space-x-3"
                  } px-3 md:px-4 py-3 rounded-lg md:rounded-xl w-full text-left transition-all duration-300 ${
                    currentPage === "home"
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <BookOpen size={20} />
                  {(!isSidebarCollapsed || isMobile) && (
                    <span className="text-sm md:text-base">Home</span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage("study")}
                  className={`flex items-center ${
                    isSidebarCollapsed && !isMobile
                      ? "justify-center"
                      : "space-x-3"
                  } px-3 md:px-4 py-3 rounded-lg md:rounded-xl w-full text-left transition-all duration-300 ${
                    currentPage === "study"
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <BookOpen size={20} />
                  {(!isSidebarCollapsed || isMobile) && (
                    <span className="text-sm md:text-base">Study Mode</span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage("quiz-builder")}
                  className={`flex items-center ${
                    isSidebarCollapsed && !isMobile
                      ? "justify-center"
                      : "space-x-3"
                  } px-3 md:px-4 py-3 rounded-lg md:rounded-xl w-full text-left transition-all duration-300 ${
                    currentPage === "quiz-builder"
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <Target size={20} />
                  {(!isSidebarCollapsed || isMobile) && (
                    <span className="text-sm md:text-base">Quiz Builder</span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage("quiz-history")}
                  className={`flex items-center ${
                    isSidebarCollapsed && !isMobile
                      ? "justify-center"
                      : "space-x-3"
                  } px-3 md:px-4 py-3 rounded-lg md:rounded-xl w-full text-left transition-all duration-300 ${
                    currentPage === "quiz-history"
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <History size={20} />
                  {(!isSidebarCollapsed || isMobile) && (
                    <span className="text-sm md:text-base">Quiz History</span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage("files")}
                  className={`flex items-center ${
                    isSidebarCollapsed && !isMobile
                      ? "justify-center"
                      : "space-x-3"
                  } px-3 md:px-4 py-3 rounded-lg md:rounded-xl w-full text-left transition-all duration-300 ${
                    currentPage === "files"
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <Files size={20} />
                  {(!isSidebarCollapsed || isMobile) && (
                    <span className="text-sm md:text-base">Library</span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage("leaderboard")}
                  className={`flex items-center ${
                    isSidebarCollapsed && !isMobile
                      ? "justify-center"
                      : "space-x-3"
                  } px-3 md:px-4 py-3 rounded-lg md:rounded-xl w-full text-left transition-all duration-300 ${
                    currentPage === "leaderboard"
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <Trophy size={20} />
                  {(!isSidebarCollapsed || isMobile) && (
                    <span className="text-sm md:text-base">Leaderboard</span>
                  )}
                </button>
              </li>
            </ul>
          </nav>

          {/* Bottom Section */}
          <div className="p-3 md:p-4 border-t border-slate-700/50">
            {/* Dark/Light Mode Toggle */}
            {(!isSidebarCollapsed || isMobile) && (
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <span className="text-xs md:text-sm font-medium text-slate-300">
                  Theme
                </span>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-5 w-9 md:h-6 md:w-11 items-center rounded-full transition-colors ${
                    isDarkMode
                      ? "bg-gradient-to-r from-blue-500 to-purple-500"
                      : "bg-slate-600"
                  }`}
                  
                >
                  <span
                    className={`inline-block h-3 w-3 md:h-4 md:w-4 transform rounded-full bg-white transition-transform ${
                      isDarkMode
                        ? "translate-x-5 md:translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Profile */}
            <div
              className={`flex items-center ${
                isSidebarCollapsed && !isMobile ? "justify-center" : "space-x-3"
              } mb-4`}
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-slate-600/50 relative">
                {isUserDataLoading ? (
                  // Loading state
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : userData?.profile_pic ? (
                  <>
                    <img 
                      src={userData.profile_pic} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log("Profile image failed to load:", userData.profile_pic);
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                      onLoad={(e) => {
                        console.log("Profile image loaded successfully:", userData.profile_pic);
                        e.target.nextElementSibling.style.display = 'none';
                      }}
                    />
                    <span 
                      className="absolute inset-0 flex items-center justify-center text-white text-xs md:text-sm font-bold"
                      style={{ display: 'none' }}
                    >
                      {userData?.name ? userData.name.charAt(0).toUpperCase() : username?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </>
                ) : (
                  <span className="text-white text-xs md:text-sm font-bold">
                    {userData?.name ? userData.name.charAt(0).toUpperCase() : username?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              {(!isSidebarCollapsed || isMobile) && (
                <div className="flex-1 min-w-0">
                  {isUserDataLoading ? (
                    // Loading text
                    <div className="space-y-1">
                      <div className="h-4 bg-slate-600 rounded animate-pulse w-24"></div>
                      <div className="h-3 bg-slate-700 rounded animate-pulse w-32"></div>
                    </div>
                  ) : (
                    <>
                      <p className="font-medium text-white text-sm md:text-base truncate">
                        {userData?.name || username}
                      </p>
                      {userData?.email ? (
                        <p className="text-xs md:text-sm text-slate-400 truncate">{userData.email}</p>
                      ) : (
                        <p className="text-xs md:text-sm text-slate-400">Student</p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              className={`flex items-center ${
                isSidebarCollapsed && !isMobile ? "justify-center" : "space-x-2"
              } w-full px-2 md:px-3 py-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 text-slate-300 transition-colors`}
            onClick={logouthandler}>
              <LogOut size={16} />
              {(!isSidebarCollapsed || isMobile) && (
                <span className="text-sm md:text-base">Logout</span>
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          <MobileHeader
            setIsSidebarCollapsed={setIsSidebarCollapsed}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            isMobileSidebarOpen={isMobileSidebarOpen}
            isSidebarCollapsed={isSidebarCollapsed}
            isMobile={isMobile}
          />
          <div className="flex-1 p-4 md:p-8">
            {currentPage === "home" && (
              <HomePage
                setUploadedFiles={setUploadedFiles}
                setCurrentPage={setCurrentPage}
                setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                setIsUploadModalOpen={setIsUploadModalOpen}
                isMobile={isMobile}
                uploadedFiles={uploadedFiles}
                isFilesLoading={isFilesLoading}
                filesError={filesError}
                refreshFiles={getFilesFun}
                handleDeleteClick={handleDeleteClick}
                deletingFileId={deletingFileId}
                // Pass user data to avoid duplicate API calls
                userData={userData}
                isUserDataLoading={isUserDataLoading}
                // Pass streak data to avoid duplicate API calls
                streakData={streakData}
                isStreakLoading={isStreakLoading}
                // Pass leaderboard data to avoid duplicate API calls
                leaderboardData={leaderboardData}
                isLeaderboardLoading={isLeaderboardLoading}
              />
            )}
            {currentPage === "study" && <StudyModePage isMobile={isMobile} />}
            {currentPage === "quiz-builder" && (
              <QuizBuilderMain
                uploadedFiles={uploadedFiles}
                isFilesLoading={isFilesLoading}
                setCurrentPage={setCurrentPage}
                setIsMobileSidebarOpen={setIsMobileSidebarOpen}
                isMobile={isMobile}
              />
            )}
            {currentPage === "quiz-history" && (
              <QuizManager 
                isMobile={isMobile} 
                setCurrentPage={setCurrentPage}
              />
            )}
            {currentPage === "files" && (
              <FilesPage 
                setIsUploadModalOpen={setIsUploadModalOpen} 
                isMobile={isMobile}
                uploadedFiles={uploadedFiles}
                isLoading={isFilesLoading}
                refreshFiles={getFilesFun}
                // Pass files data to avoid duplicate API calls in FilePage
                filesData={uploadedFiles}
                isFilesLoading={isFilesLoading}
                filesError={filesError}
                handleDeleteClick={handleDeleteClick}
                deletingFileId={deletingFileId}
              />
            )}
            {currentPage === "leaderboard" && <LeaderboardPage isMobile={isMobile} />}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-xl md:rounded-2xl p-6 md:p-8 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg md:text-xl font-semibold text-white">
                Upload File
              </h3>
              <button
                onClick={handleModalClose}
                className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
                disabled={isUploading}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* File Type Selection */}
              <div>
                <label className="block text-sm font-medium mb-4 text-slate-300">
                  Select File Type
                </label>
                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedFileType("Book")}
                    disabled={isUploading}
                    className={`p-3 md:p-4 border-2 rounded-lg md:rounded-xl text-left transition-all w-full ${
                      selectedFileType === "Book"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-600 hover:border-slate-500"
                    } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center space-x-3">
                      <BookOpen size={20} className="text-blue-400" />
                      <span className="font-medium text-white text-sm md:text-base">
                        Book
                      </span>
                    </div>
                    <p className="text-xs md:text-sm mt-1 text-slate-400">
                      PDF files with Table of Contents
                    </p>
                  </button>

                  <button
                    onClick={() => setSelectedFileType("Presentation")}
                    disabled={isUploading}
                    className={`p-3 md:p-4 border-2 rounded-lg md:rounded-xl text-left transition-all w-full ${
                      selectedFileType === "Presentation"
                        ? "border-green-500 bg-green-500/10"
                        : "border-slate-600 hover:border-slate-500"
                    } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Presentation size={20} className="text-green-400" />
                      <span className="font-medium text-white text-sm md:text-base">
                        Presentation
                      </span>
                    </div>
                    <p className="text-xs md:text-sm mt-1 text-slate-400">
                      PPTX files only
                    </p>
                  </button>

                  <button
                    onClick={() => setSelectedFileType("Notes")}
                    disabled={isUploading}
                    className={`p-3 md:p-4 border-2 rounded-lg md:rounded-xl text-left transition-all w-full ${
                      selectedFileType === "Notes"
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-slate-600 hover:border-slate-500"
                    } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center space-x-3">
                      <FileText size={20} className="text-purple-400" />
                      <span className="font-medium text-white text-sm md:text-base">
                        Notes
                      </span>
                    </div>
                    <p className="text-xs md:text-sm mt-1 text-slate-400">
                      .pdf , docx , .txt
                    </p>
                  </button>
                </div>
              </div>

              {/* TOC Page Range Input */}
              {selectedFileType === "Book" && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    Table of Contents Page Range *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 2-5"
                    value={tocPageRange}
                    onChange={handleTocChange}
                    disabled={isUploading}
                    className={`w-full px-3 md:px-4 py-2 md:py-3 bg-slate-700/50 border rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400 text-sm md:text-base transition-colors ${
                      tocError
                        ? "border-red-500 focus:border-red-500"
                        : "border-slate-600 focus:border-blue-500"
                    } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                  />
                  {tocError && (
                    <p className="text-red-400 text-xs md:text-sm mt-1">
                      {tocError}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    Enter the page range where the table of contents is located
                    (e.g., 2-5)
                  </p>
                </div>
              )}

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg md:rounded-xl p-6 md:p-8 text-center transition-colors ${
                  isUploading
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                } ${
                  selectedFile
                    ? "border-green-500 bg-green-500/10"
                    : selectedFileType
                    ? "border-slate-600 hover:border-slate-500"
                    : "border-slate-700 cursor-not-allowed"
                }`}
                onClick={
                  selectedFileType && !isUploading ? handleClick : undefined
                }
              >
                <Upload
                  size={
                    typeof window !== "undefined" && window.innerWidth < 768
                      ? 24
                      : 32
                  }
                  className={`mx-auto mb-3 ${
                    selectedFile ? "text-green-400" : "text-slate-400"
                  }`}
                />
                <p className="text-xs md:text-sm text-slate-400">
                  {selectedFile
                    ? `Selected: ${selectedFile.name}`
                    : selectedFileType
                    ? "Drop your file here or click to browse"
                    : "Please select a file type first"}
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={!selectedFileType || isUploading}
                />
              </div>

              {/* Upload Progress Indicator */}
              {isUploading && (
                <div className={`border-2 border-dashed rounded-lg md:rounded-xl p-6 md:p-8 text-center transition-all duration-500 ${
                  uploadSuccess 
                    ? "border-green-500 bg-green-500/10" 
                    : "border-blue-500 bg-blue-500/10"
                }`}>
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto mb-3 relative">
                      {/* Circular Progress */}
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          className="text-slate-600"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          strokeDashoffset={`${2 * Math.PI * 28 * (1 - uploadProgress / 100)}`}
                          className={`transition-all duration-300 ${
                            uploadSuccess ? "text-green-400" : "text-blue-400"
                          }`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        {uploadSuccess ? (
                          <div className="text-green-400 animate-bounce">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-blue-400">{uploadProgress}%</span>
                        )}
                      </div>
                    </div>
                    {uploadSuccess ? (
                      <div className="text-green-400 animate-bounce">
                        <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    ) : (
                      <Upload size={24} className="mx-auto text-blue-400 animate-bounce" />
                    )}
                  </div>
                  
                  <div className={`font-medium mb-2 ${
                    uploadSuccess ? "text-green-400" : "text-white"
                  }`}>
                    {uploadStatus || "Uploading..."}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ease-out ${
                        uploadSuccess 
                          ? "bg-gradient-to-r from-green-500 to-green-400" 
                          : "bg-gradient-to-r from-blue-500 to-purple-600"
                      }`}
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  
                  <p className="text-xs text-slate-400">
                    {uploadSuccess 
                      ? "File uploaded successfully!" 
                      : selectedFile 
                      ? `Uploading ${selectedFile.name}` 
                      : "Processing file..."
                    }
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  onClick={handleModalClose}
                  disabled={isUploading}
                  className={`flex-1 px-4 py-3 border border-slate-600 text-slate-300 rounded-lg md:rounded-xl hover:bg-slate-700/50 hover:text-white transition-colors text-sm md:text-base ${
                    isUploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleFileUpload}
                  disabled={!isUploadButtonEnabled()}
                  className={`flex-1 px-4 py-3 rounded-lg md:rounded-xl transition-all duration-300 shadow-lg text-sm md:text-base flex items-center justify-center gap-2 ${
                    isUploadButtonEnabled() && !isUploading
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-blue-500/25"
                      : isUploading
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white cursor-not-allowed"
                      : "bg-slate-600 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{uploadProgress > 0 ? `${uploadProgress}%` : "Starting..."}</span>
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      <span>Upload</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && fileToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-xl md:rounded-2xl p-6 md:p-8 w-full max-w-md mx-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-xl flex items-center justify-center">
                <Trash2 size={32} className="text-red-400" />
              </div>
              
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                Delete File?
              </h3>
              
              <p className="text-slate-300 mb-2">
                Are you sure you want to delete <span className="font-medium text-white">"{fileToDelete.name}"</span>?
              </p>
              
              <p className="text-sm text-red-400 mb-6">
                This will permanently delete the file and all associated data including study progress, MCQs, and notes. This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deleting Toast Notification */}
      {deletingFileId && (
        <div className="fixed bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 z-50 flex items-center gap-3 shadow-lg">
          <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white text-sm">Deleting file...</span>
        </div>
      )}
    </div>
  );
};


export default Dashboard;
