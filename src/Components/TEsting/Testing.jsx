import React, { useRef, useState, useEffect } from "react";
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [tocPageRange, setTocPageRange] = useState("");
  const [tocError, setTocError] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [isUploading, setIsUploading] = useState(false); // Add loading state
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

  // Fixed file upload function
  const uploadFile = async (fileData) => {
    try {
      setIsUploading(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", fileData.file);
      formData.append("document_type", fileData.document_type);

      // Only add toc_pages if it's a book and has valid TOC
      if (fileData.document_type === "book" && fileData.toc_pages) {
        formData.append("toc_pages", fileData.toc_pages);
      }

      // Log the FormData contents for debugging
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await FileUpload(formData);
      alert("Upload successful:", response.message);

      // Update UI with new file
      const newFile = {
        id: uploadedFiles.length + 1,
        name: fileData.file.name,
        type: fileData.document_type,
        uploadDate: new Date().toISOString().split("T")[0],
        icon: getFileIcon(fileData.document_type),
      };

      setUploadedFiles([newFile, ...uploadedFiles]);

      // Reset form
      handleModalClose();

      return response;
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
      throw error;
    } finally {
      setIsUploading(false);
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

  const getSlidesFun = async () => {
    try {
      const response = await GetAllSlides();
      const bookResponse = await GetAllBooks();
      console.log("Slides:", response.data.presentations, bookResponse.data.books);
      const presentations = response.data.presentations;
const books = bookResponse.data.books;
      const transformedFiles = [...presentations, ...books].map(item => {
  // Common properties
  const baseFile = {
    id: item.id,
    name: item.original_filename || item.file_name,
    uploadDate: item.created_at.split('T')[0], // Extract date part only
  };

  // Type-specific properties
  if (item.type === 'presentation') {
    return {
      ...baseFile,
      type: 'Presentation',
      icon: Presentation, // Make sure to import your icon component
      meta: {
        totalSlides: item.total_slides,
        hasSpeakerNotes: item.has_speaker_notes
      }
    };
  } else if (item.type === 'book') {
    return {
      ...baseFile,
      type: 'Book',
      icon: BookOpen, // Make sure to import your icon component
      meta: {
        s3Key: item.s3_key
      }
    };
  }
  
  return baseFile;
})
// Sort by upload date (newest first)
.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

// Update state
setUploadedFiles(transformedFiles);
    } catch (error) {
      console.error("Error getting slides:", error);
    }
  };

  useEffect(() => {
    getSlidesFun();
  }, []);

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

  const handleModalClose = () => {
    setIsUploadModalOpen(false);
    setSelectedFileType("");
    setSelectedFile(null);
    setTocPageRange("");
    setTocError("");
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
            ["image/png", "image/jpeg", "image/jpg", "application/pdf"],
            "PNG, JPEG, JPG, or PDF files"
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
                      PDF (no TOC), JPG, JPEG, or PNG
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
                  className={`flex-1 px-4 py-3 rounded-lg md:rounded-xl transition-all duration-300 shadow-lg text-sm md:text-base ${
                    isUploadButtonEnabled()
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-blue-500/25"
                      : "bg-slate-600 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {isUploading ? "Uploading..." : "Upload"}
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
