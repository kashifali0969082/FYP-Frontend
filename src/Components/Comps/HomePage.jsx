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
  Loader2,
  BookOpen,
  X,
} from "lucide-react";
import { deleteDocument } from "../../Api/Apifun";
import { useState,useEffect } from "react";
import { GetAllSlides,GetAllBooks } from "../../Api/Apifun";
export const HomePage = ({
  setUploadedFiles,
  setIsUploadModalOpen,
  isMobile,
  uploadedFiles,
  setCurrentPage,
  setIsMobileSidebarOpen,
}) => {
  console.log("uploaded", uploadedFiles);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    getSlidesFun();
  }, []);
    const getSlidesFun = async () => {
    try {
      const response = await GetAllSlides();
      const bookResponse = await GetAllBooks();
  
      const presentations = response.data.presentations;
      const books = bookResponse.data.books;
      const transformedFiles = [...presentations, ...books]
        .map((item) => {
          // Common properties
          const baseFile = {
            id: item.id,
            name: item.original_filename || item.file_name,
            uploadDate: item.created_at.split("T")[0], // Extract date part only
          };

          // Type-specific properties
          if (item.type === "presentation") {
            return {
              ...baseFile,
              type: "Presentation",
              icon: Presentation, // Make sure to import your icon component
              meta: {
                totalSlides: item.total_slides,
                hasSpeakerNotes: item.has_speaker_notes,
              },
            };
          } else if (item.type === "book") {
            return {
              ...baseFile,
              type: "Book",
              icon: BookOpen, // Make sure to import your icon component
              meta: {
                s3Key: item.s3_key,
              },
            };
          }

          return baseFile;
        })
        // Sort by upload date (newest first)
        .sort(
          (a, b) =>
            new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        );

      // Update state
      setUploadedFiles(transformedFiles);
    } catch (error) {
      console.error("Error getting slides:", error);
    }
  };
  const openInStudyMode = (file) => {
    setCurrentPage("study");
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
    console.log("Opening file in study mode:", file);
  };

  const handleDeleteClick = (file) => {
    setFileToDelete(file);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;
    
    setIsDeleting(true);
    
    try {
      console.log("Deleting file with ID:", fileToDelete.id, "Type:", fileToDelete.type);
      let resp = await deleteDocument(fileToDelete.type, fileToDelete.id);
      console.log("Delete response:", resp);
      
      if (resp.status === 204) {
        alert(`${fileToDelete.type} deleted successfully`);
        // Update the uploaded files list
        setUploadedFiles(uploadedFiles.filter((file) => file.id !== fileToDelete.id));
      } else {
        alert(`Failed to delete ${fileToDelete.type}. Please try again.`);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert(`Error deleting ${fileToDelete.type}. Please try again.`);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setFileToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setFileToDelete(null);
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Dashboard Area */}
      <div className="flex-1 space-y-8">
        {/* Welcome Section with Gradient */}
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-6 md:p-8 text-white">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">
              Welcome back, John!
            </h2>
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
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">
                Upload Your Files
              </h3>
              <p className="text-sm md:text-base text-slate-400">
                Drop your books, presentations, or notes to get started
              </p>
            </div>
          </div>
        </div>

        {/* Recently Uploaded Files */}
        <div>
          <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-white">
            Recently Uploaded Files
          </h3>
          <div className="space-y-3 md:space-y-4">
            {uploadedFiles.slice(0, 5).map((file) => {
              const IconComponent = file.icon;
              return (
                <div key={file.id} className="group">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg md:rounded-xl p-4 md:p-6 hover:border-slate-600/50 transition-all duration-300">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-3 md:space-x-4 min-w-0 flex-1">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                          <IconComponent
                            size={isMobile ? 20 : 24}
                            className="text-white"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-white truncate text-sm md:text-base">
                            {file.name}
                          </h4>
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
                          onClick={() => handleDeleteClick(file)}
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
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl md:rounded-2xl blur-lg opacity-20"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg md:rounded-xl flex items-center justify-center">
                <Flame size={isMobile ? 20 : 24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm md:text-base">
                  Study Streak
                </h3>
                <p className="text-xs md:text-sm text-slate-400">Keep it up!</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                7
              </div>
              <p className="text-xs md:text-sm text-slate-400">
                You've studied 7 days in a row!
              </p>
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl md:rounded-2xl blur-lg opacity-20"></div>
          <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl md:rounded-2xl p-4 md:p-6">
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg md:rounded-xl flex items-center justify-center">
                <BarChart3 size={isMobile ? 20 : 24} className="text-white" />
              </div>
              <h3 className="font-semibold text-white text-sm md:text-base">
                Your Progress
              </h3>
            </div>
            <div className="space-y-3 md:space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Clock size={14} className="text-blue-400" />
                  <span className="text-xs md:text-sm text-slate-300">
                    Study Time
                  </span>
                </div>
                <span className="font-semibold text-white text-xs md:text-sm">
                  24h 30m
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Files size={14} className="text-purple-400" />
                  <span className="text-xs md:text-sm text-slate-300">
                    Files Studied
                  </span>
                </div>
                <span className="font-semibold text-white text-xs md:text-sm">
                  12
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Target size={14} className="text-green-400" />
                  <span className="text-xs md:text-sm text-slate-300">
                    MCQs Completed
                  </span>
                </div>
                <span className="font-semibold text-white text-xs md:text-sm">
                  247
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <TrendingUp size={14} className="text-orange-400" />
                  <span className="text-xs md:text-sm text-slate-300">
                    Accuracy Rate
                  </span>
                </div>
                <span className="font-semibold text-white text-xs md:text-sm">
                  87%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-xl md:rounded-2xl p-6 md:p-8 max-w-md w-full mx-4">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl md:rounded-2xl blur-lg opacity-50"></div>
            <div className="relative">
              {/* Close button */}
              <button
                onClick={cancelDelete}
                className="absolute -top-2 -right-2 p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {/* Icon */}
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl md:rounded-2xl flex items-center justify-center">
                <Trash2 size={isMobile ? 24 : 32} className="text-white" />
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">
                  Delete File
                </h3>
                <p className="text-sm md:text-base text-slate-400 mb-6">
                  Are you sure you want to delete "{fileToDelete?.name}"? This action cannot be undone.
                </p>

                {/* Buttons */}
                <div className="flex space-x-3 justify-center">
                  <button
                    onClick={cancelDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};