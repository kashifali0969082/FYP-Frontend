import React, { useState, useEffect } from "react";
import {
  BookOpen,
  FileQuestion,
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
} from "lucide-react";
import { MobileHeader } from "../Comps/MobileHeader";
import { HomePage } from "../Comps/HomePage";
import { MCQsPage } from "../Comps/McqPage";
import { StudyModePage } from "../Comps/StudyMode";
import { FilesPage } from "../Comps/FilePage";
import { FileUpload, GetAllBooks, GetAllSlides } from "../../Api/Apifun";
const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState("");
  const [tocPageRange, setTocPageRange] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 1,
      name: "Advanced Mathematics.pdf",
      type: "Book",
      uploadDate: "2025-06-20",
      icon: BookOpen,
    },
    {
      id: 2,
      name: "Physics Presentation.pptx",
      type: "Presentation",
      uploadDate: "2025-06-19",
      icon: Presentation,
    },
    {
      id: 3,
      name: "Chemistry Notes.pdf",
      type: "Notes",
      uploadDate: "2025-06-18",
      icon: FileText,
    },
    {
      id: 4,
      name: "Biology Diagrams.jpg",
      type: "Notes",
      uploadDate: "2025-06-17",
      icon: Image,
    },
    {
      id: 5,
      name: "History Timeline.pdf",
      type: "Book",
      uploadDate: "2025-06-16",
      icon: BookOpen,
    },
  ]);
  const getSlidesFun=async()=>{
   try {
     let resp=await GetAllSlides()
    console.log("slides",resp);
   } catch (error) {
    console.log("error",error);
    
   }
    
  }
  const GetBooksFun =async () => {
    try {
      let resp = await GetAllBooks();
      console.log("kash", resp);
    } catch (error) {
      console.log("Getting error while getting books", error);
    }
  };
  const Filefun=async()=>{
    try {
      let resp=await FileUpload() 

        } catch (error) {
      console.log("error",error);
      
    }
  }
  useEffect(() => {
    GetBooksFun();
    getSlidesFun();
  }, []);

  // Check for mobile screen size
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

  const handleFileUpload = () => {
    if (selectedFileType) {
      const newFile = {
        id: uploadedFiles.length + 1,
        name: `New ${selectedFileType}.${
          selectedFileType === "Presentation" ? "pptx" : "pdf"
        }`,
        type: selectedFileType,
        uploadDate: new Date().toISOString().split("T")[0],
        icon:
          selectedFileType === "Book"
            ? BookOpen
            : selectedFileType === "Presentation"
            ? Presentation
            : FileText,
      };
      setUploadedFiles([newFile, ...uploadedFiles]);
      setIsUploadModalOpen(false);
      setSelectedFileType("");
      setTocPageRange("");
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

  // Mobile Header Component

  // Home Page Component

  // Study Mode Page Component

  // MCQs Page Component

  // Files Page Component

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
                LearnAI
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
                  onClick={() => navigateToPage("mcqs")}
                  className={`flex items-center ${
                    isSidebarCollapsed && !isMobile
                      ? "justify-center"
                      : "space-x-3"
                  } px-3 md:px-4 py-3 rounded-lg md:rounded-xl w-full text-left transition-all duration-300 ${
                    currentPage === "mcqs"
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <FileQuestion size={20} />
                  {(!isSidebarCollapsed || isMobile) && (
                    <span className="text-sm md:text-base">MCQs</span>
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
                    <span className="text-sm md:text-base">Files</span>
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
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User size={isMobile ? 16 : 20} className="text-white" />
              </div>
              {(!isSidebarCollapsed || isMobile) && (
                <div>
                  <p className="font-medium text-white text-sm md:text-base">
                    John Doe
                  </p>
                  <p className="text-xs md:text-sm text-slate-400">Student</p>
                </div>
              )}
            </div>

            {/* Logout */}
            <button
              className={`flex items-center ${
                isSidebarCollapsed && !isMobile ? "justify-center" : "space-x-2"
              } w-full px-2 md:px-3 py-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 text-slate-300 transition-colors`}
            >
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
              />
            )}
            {currentPage === "study" && <StudyModePage isMobile={isMobile} />}
            {currentPage === "mcqs" && <MCQsPage isMobile={isMobile} />}
            {currentPage === "files" && <FilesPage isMobile={isMobile} />}
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
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
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
                    className={`p-3 md:p-4 border-2 rounded-lg md:rounded-xl text-left transition-all w-full ${
                      selectedFileType === "Book"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-600 hover:border-slate-500"
                    }`}
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
                    className={`p-3 md:p-4 border-2 rounded-lg md:rounded-xl text-left transition-all w-full ${
                      selectedFileType === "Presentation"
                        ? "border-green-500 bg-green-500/10"
                        : "border-slate-600 hover:border-slate-500"
                    }`}
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
                    className={`p-3 md:p-4 border-2 rounded-lg md:rounded-xl text-left transition-all w-full ${
                      selectedFileType === "Notes"
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <FileText size={20} className="text-purple-400" />
                      <span className="font-medium text-white text-sm md:text-base">
                        Notes
                      </span>
                    </div>
                    <p className="text-xs md:text-sm mt-1 text-slate-400">
                      PDF (no TOC), JPG, JPEG, or PNG
                    </p>
                  </button>
                </div>
              </div>

              {/* TOC Page Range Input */}
              {selectedFileType === "Book" && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    Table of Contents Page Range
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 3-4"
                    value={tocPageRange}
                    onChange={(e) => setTocPageRange(e.target.value)}
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-700/50 border border-slate-600 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400 text-sm md:text-base"
                  />
                </div>
              )}

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-slate-600 hover:border-slate-500 rounded-lg md:rounded-xl p-6 md:p-8 text-center transition-colors">
                <Upload
                  size={isMobile ? 24 : 32}
                  className="mx-auto mb-3 text-slate-400"
                />
                <p className="text-xs md:text-sm text-slate-400">
                  Drop your file here or click to browse
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-slate-600 text-slate-300 rounded-lg md:rounded-xl hover:bg-slate-700/50 hover:text-white transition-colors text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFileUpload}
                  disabled={!selectedFileType}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg md:rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-blue-500/25 text-sm md:text-base"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
