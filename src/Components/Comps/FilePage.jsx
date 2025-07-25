import React, { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import {
  Search,
  Filter,
  Upload,
  FileText,
  BookOpen,
  Presentation,
  StickyNote,
  Calendar,
  HardDrive,
  Trash2,
  Play,
  Grid3X3,
  List,
  ChevronDown,
  Star,
  Clock,
  Eye,
  MoreHorizontal,
  X,
  Loader2,
  Brain,
  Mic,
  Send,
  Square,
  ExternalLink,
} from "lucide-react";
// Removed GetAllFiles import - data now comes from parent to eliminate duplicate API calls
import { DeleteFile } from "../apiclient/FileRetrievalapis";

export const FilesPage = ({ 
  setIsUploadModalOpen, 
  isMobile, 
  isLoading: propLoading, 
  refreshFiles,
  // New props to receive data from parent to eliminate duplicate API calls
  filesData,
  isFilesLoading,
  filesError,
  handleDeleteClick,
  deletingFileId
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("Recently Uploaded");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'
  // Removed individual delete modal states - now handled by parent
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Ask My Library AI feature states
  const [showAIQuery, setShowAIQuery] = useState(false);
  const [aiQuery, setAIQuery] = useState("");
  const [aiAnswer, setAIAnswer] = useState("");
  const [aiSources, setAISources] = useState([]);
  const [aiReferences, setAIReferences] = useState([]);
  const [isAILoading, setIsAILoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);

  // Use files data from parent to eliminate duplicate API calls
  const isLoading = isFilesLoading || propLoading || false;

  // No local file fetching function needed - all data comes from parent component
  // This eliminates the duplicate GetAllFiles() API call

  // No useEffect needed - all data comes from parent to eliminate duplicate API calls

  const getTypeIcon = (type) => {
    switch (type) {
      case "Book":
        return <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />;
      case "Presentation":
        return <Presentation className="w-4 h-4 sm:w-5 sm:h-5" />;
      case "Notes":
        return <StickyNote className="w-4 h-4 sm:w-5 sm:h-5" />;
      default:
        return <FileText className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Book":
        return "bg-blue-500/20 text-blue-400 border-blue-400/30";
      case "Presentation":
        return "bg-green-500/20 text-green-400 border-green-400/30";
      case "Notes":
        return "bg-purple-500/20 text-purple-400 border-purple-400/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-400/30";
    }
  };

  // Delete functionality now handled by parent component via handleDeleteClick prop
  // Individual delete modal and functions removed - only bulk delete remains

  // Ask My Library AI functionality
  const handleAISubmit = async () => {
    if (!aiQuery.trim()) return;
    setIsAILoading(true);
    setAIAnswer("");
    setAISources([]);
    setAIReferences([]);
    
    // Simulate realistic loading stages
    const loadingStages = [
      "Analyzing your query...",
      "Searching through your library...",
      "Processing documents...",
      "Gathering relevant information...",
      "Generating response..."
    ];
    
    try {
      // Progressive loading simulation
      let stageIndex = 0;
      const stageInterval = setInterval(() => {
        if (stageIndex < loadingStages.length) {
          setLoadingStage(loadingStages[stageIndex]);
          stageIndex++;
        }
      }, 600);
      
      // Make actual API call to the backend
      const response = await fetch("https://api.adaptivelearnai.xyz/library/search", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          // Add auth header if needed
          ...(document.cookie.includes('access_token') && {
            'Authorization': `Bearer ${document.cookie.split('access_token=')[1]?.split(';')[0]}`
          })
        },
        body: JSON.stringify({ 
          query: aiQuery.trim()
        }),
      });
      
      clearInterval(stageInterval);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("🔍 Library search response:", data);
      
      // Update state with API response
      setAIAnswer(data.answer || "No answer found for your query.");
      setAISources(data.sources || []);
      setAIReferences(data.references || []);
      
    } catch (err) {
      console.error("❌ Library search failed:", err);
      
      // Enhanced error handling with specific error messages
      let errorMessage = "Sorry, I couldn't process your query at the moment. ";
      
      if (err.message.includes('Failed to fetch') || err.message.includes('Network Error')) {
        errorMessage += "Please check your internet connection and try again.";
      } else if (err.message.includes('401')) {
        errorMessage += "Authentication failed. Please log in again.";
      } else if (err.message.includes('404')) {
        errorMessage += "Library search service is not available.";
      } else if (err.message.includes('500')) {
        errorMessage += "Server error occurred. Please try again later.";
      } else {
        errorMessage += "Please try again or contact support if the issue persists.";
      }
      
      setAIAnswer(errorMessage);
      setAISources([]);
      setAIReferences([]);
    } finally {
      setIsAILoading(false);
      setLoadingStage("");
    }
  };

  const handleMicClick = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
      }
      setIsRecording(false);
      return;
    }

    // Start recording
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", audioBlob, "query.webm");

        console.log("🎤 Sending audio to transcribe endpoint:");
        console.log("- Blob size:", audioBlob.size, "bytes");
        console.log("- Blob type:", audioBlob.type);
        console.log("- FormData:", formData);

        try {
          // Use the same domain as other API calls
          const res = await fetch("https://api.adaptivelearnai.xyz/transcribe", {
            method: "POST",
            body: formData,
          });
          
          console.log("📡 Transcribe response status:", res.status);
          console.log("📡 Transcribe response headers:", res.headers);
          
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          
          const data = await res.json();
          console.log("📝 Transcription response:", data);
          setAIQuery(data.transcript || data.transcription || data.text || "");
        } catch (err) {
          console.error("❌ Transcription failed:", err);
          console.error("❌ Error details:", {
            message: err.message,
            stack: err.stack
          });
          
          // Fallback: Try with relative path
          try {
            console.log("🔄 Trying fallback endpoint...");
            const fallbackRes = await fetch("/transcribe", {
              method: "POST",
              body: formData,
            });
            
            if (fallbackRes.ok) {
              const fallbackData = await fallbackRes.json();
              console.log("✅ Fallback transcription success:", fallbackData);
              setAIQuery(fallbackData.transcript || fallbackData.transcription || fallbackData.text || "");
            } else {
              throw new Error(`Fallback failed with status: ${fallbackRes.status}`);
            }
          } catch (fallbackErr) {
            console.error("❌ Fallback also failed:", fallbackErr);
            setAIQuery(prev => prev + " [Voice input failed - please type your query]");
            alert("Voice transcription failed. Please check your backend connection and try again, or type your query manually.");
          }
        }
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
        setMediaRecorder(null);
      };

      recorder.start();
    } catch (err) {
      console.error("Microphone access denied:", err);
      setIsRecording(false);
      alert("Microphone access is required for voice input. Please enable microphone permissions and try again.");
    }
  };

  const handleDocumentReference = (docRef) => {
    // TODO: Navigate to specific document or highlight it in the file list
    console.log("Navigate to document:", docRef);
    
    // For now, scroll to and highlight the document if it's visible
    const docElement = document.getElementById(`file-${docRef.id}`);
    if (docElement) {
      docElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      docElement.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50');
      setTimeout(() => {
        docElement.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50');
      }, 3000);
    } else {
      // If document not visible, you could filter the file list or show a message
      alert(`Document "${docRef.title}" found! It may be in a different view or filter.`);
    }
  };

  const handleBulkDelete = async () => {
    setIsBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    setIsBulkDeleting(true);
    
    try {
      const filesToDelete = filesData.filter(file => selectedFiles.includes(file.id));
      
      // Delete files sequentially to avoid overwhelming the server
      for (const file of filesToDelete) {
        console.log("🔍 BULK DELETE - Processing file:", file);
        const docType = file.meta?.fileType || file.type.toLowerCase();
        console.log(`🗑️ Deleting file ID: "${file.id}", Type: "${docType}"`);
        await DeleteFile(file.id, docType);
      }
      
      setSelectedFiles([]);
      
      if (refreshFiles) {
        refreshFiles(); // Refresh files in parent component
      }
      
      console.log(`✅ Successfully deleted ${filesToDelete.length} file${filesToDelete.length !== 1 ? 's' : ''}`);
    } catch (error) {
      console.error("❌ Error during bulk delete:", error);
    } finally {
      setIsBulkDeleting(false);
      setIsBulkDeleteModalOpen(false);
    }
  };

  const cancelBulkDelete = () => {
    setIsBulkDeleteModalOpen(false);
  };

  const filteredFiles = filesData.filter((file) => {
    const fileName = file.title || file.name || '';
    const fileTags = file.tags || [];
    const matchesSearch =
      fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fileTags.some((tag) =>
        (tag || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesType = selectedType === "All" || file.type === selectedType;
    return matchesSearch && matchesType;
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case "Name":
        const nameA = a.title || a.name || '';
        const nameB = b.title || b.name || '';
        return nameA.localeCompare(nameB);
      case "Type":
        return a.type.localeCompare(b.type);
      case "Size":
        const sizeA = a.size || "0 MB";
        const sizeB = b.size || "0 MB";
        return sizeB.localeCompare(sizeA);
      case "Recently Uploaded":
      default:
        return new Date(b.uploadDate) - new Date(a.uploadDate);
    }
  });

  const toggleFileSelection = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const GridView = ({ files }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {files.map((file) => {
        const IconComponent = file.icon;
        return (
          <div
            key={file.id}
            className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 hover:bg-slate-800/70 transition-all duration-300 border border-slate-700/50"
          >
            {/* Selection checkbox */}
            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <input
                type="checkbox"
                checked={selectedFiles.includes(file.id)}
                onChange={() => toggleFileSelection(file.id)}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded"
              />
            </div>

            {/* Favorite star */}
            {file.isFavorite && (
              <div className="absolute top-3 right-3">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              </div>
            )}

            {/* File preview/icon */}
            <div className="flex justify-center mb-4">
              <div className={`w-16 h-16 ${file.color} rounded-lg flex items-center justify-center`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* File info */}
            <div className="text-center mb-4">
              <h3 className="font-medium text-white text-sm truncate mb-1">
                {file.title || file.name}
              </h3>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(file.uploadDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-1">
                <span>{file.size || "Unknown size"}</span>
                <span>•</span>
                <span>{file.pages || "Unknown"} pages</span>
              </div>
            </div>

            {/* Type badge */}
            <div className="flex justify-center mb-4">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getTypeColor(file.type)}`}>
                {getTypeIcon(file.type)}
                {file.type}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-3 rounded-lg text-xs font-medium transition-all">
                <Play className="w-3 h-3 inline mr-1" />
                Study
              </button>
              <button 
                onClick={() => handleDeleteClick(file)}
                className="p-2 bg-red-600/50 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const ListView = ({ files }) => (
    <div className="space-y-3">
      {files.map((file) => {
        const IconComponent = file.icon;
        return (
          <div
            key={file.id}
            className="group bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 hover:bg-slate-800/70 transition-all duration-300 border border-slate-700/50"
          >
            <div className="flex items-center gap-4">
              {/* Selection checkbox */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={() => toggleFileSelection(file.id)}
                  className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded"
                />
              </div>

              {/* File icon */}
              <div className={`w-12 h-12 ${file.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-white text-sm truncate">
                    {file.title || file.name}
                  </h3>
                  {file.isFavorite && (
                    <Star className="w-4 h-4 text-yellow-400 fill-current flex-shrink-0" />
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 flex-shrink-0" />
                    {new Date(file.uploadDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3 flex-shrink-0" />
                    {file.size || "Unknown size"}
                  </span>
                  <span className="hidden sm:inline">{file.pages || "Unknown"} pages</span>
                  {file.lastOpened && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      Last opened {new Date(file.lastOpened).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Type badge */}
              <div className="hidden sm:flex">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getTypeColor(file.type)}`}>
                  {getTypeIcon(file.type)}
                  {file.type}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-3 rounded-lg text-xs font-medium transition-all">
                  <Play className="w-3 h-3 inline mr-1" />
                  Study
                </button>
                <button 
                  onClick={() => handleDeleteClick(file)}
                  className="p-2 bg-red-600/50 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // Loading component
  const LoadingComponent = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 mx-auto mb-4 bg-slate-800/50 rounded-xl flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">Loading your files...</h3>
      <p className="text-slate-400">Please wait while we fetch your documents</p>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Library</h1>
            <p className="text-slate-400">
              Manage and organize your learning materials ({filteredFiles.length} files)
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* AI Query toggle */}
            <button
              onClick={() => setShowAIQuery(!showAIQuery)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                showAIQuery 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                  : "bg-slate-800/50 text-slate-400 hover:text-white border border-slate-700/50"
              }`}
              title="Ask My Library"
            >
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Ask My Library</span>
            </button>
            
            {/* View toggle */}
            <div className="hidden sm:flex bg-slate-800/50 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Ask My Library AI Query Section */}
        {showAIQuery && (
          <div className="mb-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-4 border border-blue-500/30 backdrop-blur-sm">
            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-400" />
              Ask My Library
              <span className="text-xs text-slate-400 ml-2">Query across all your documents</span>
            </h3>
            
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={aiQuery}
                  onChange={(e) => setAIQuery(e.target.value)}
                  placeholder="Ask anything across all your documents..."
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  onKeyPress={(e) => e.key === 'Enter' && !isAILoading && handleAISubmit()}
                  disabled={isAILoading}
                />
                {isRecording && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="flex items-center gap-2 text-red-400 text-xs">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      Recording...
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handleMicClick}
                disabled={isAILoading}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  isRecording 
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/25 scale-105" 
                    : "bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600 hover:bg-slate-700/50"
                }`}
                title={isRecording ? "Stop recording" : "Voice input"}
              >
                {isRecording ? (
                  <Square className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={handleAISubmit}
                disabled={!aiQuery.trim() || isAILoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:opacity-50 text-white rounded-lg font-medium transition-all flex items-center gap-2"
              >
                {isAILoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Ask
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Ask
                  </>
                )}
              </button>
            </div>

            {/* AI Response */}
            {(aiAnswer || isAILoading) && (
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/30">
                {isAILoading ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                      <span className="font-medium">{loadingStage || "Processing..."}</span>
                    </div>
                    <div className="w-full bg-slate-700/30 rounded-full h-1">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full animate-pulse" style={{width: '60%'}}></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-white text-sm leading-relaxed">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeSanitize]}
                        className="prose prose-invert max-w-none"
                        components={{
                          // Custom styling for markdown elements
                          h1: ({children}) => <h1 className="text-2xl font-bold text-white mt-6 mb-4">{children}</h1>,
                          h2: ({children}) => <h2 className="text-xl font-semibold text-white mt-5 mb-3">{children}</h2>,
                          h3: ({children}) => <h3 className="text-lg font-semibold text-white mt-4 mb-2">{children}</h3>,
                          p: ({children}) => <p className="text-slate-200 mb-3 leading-relaxed">{children}</p>,
                          strong: ({children}) => <strong className="font-semibold text-blue-200">{children}</strong>,
                          em: ({children}) => <em className="italic text-blue-100">{children}</em>,
                          code: ({inline, children}) => 
                            inline ? (
                              <code className="bg-slate-800/70 text-green-300 px-1.5 py-0.5 rounded text-sm">{children}</code>
                            ) : (
                              <code className="text-green-300 text-sm">{children}</code>
                            ),
                          pre: ({children}) => (
                            <pre className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 my-3 overflow-x-auto">{children}</pre>
                          ),
                          ul: ({children}) => <ul className="list-disc list-inside space-y-1 my-2 text-slate-200">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-inside space-y-1 my-2 text-slate-200">{children}</ol>,
                          li: ({children}) => <li className="mb-1">{children}</li>,
                          a: ({href, children}) => (
                            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                              {children}
                            </a>
                          ),
                          blockquote: ({children}) => (
                            <blockquote className="border-l-4 border-blue-500/50 pl-4 italic text-slate-300 my-3">{children}</blockquote>
                          ),
                          table: ({children}) => (
                            <div className="overflow-x-auto my-3">
                              <table className="min-w-full border border-slate-700/50 rounded-lg">{children}</table>
                            </div>
                          ),
                          th: ({children}) => (
                            <th className="border border-slate-700/50 px-3 py-2 bg-slate-800/50 text-white font-semibold text-left">{children}</th>
                          ),
                          td: ({children}) => (
                            <td className="border border-slate-700/50 px-3 py-2 text-slate-200">{children}</td>
                          ),
                        }}
                      >
                        {aiAnswer}
                      </ReactMarkdown>
                    </div>
                    
                    {/* Document References with clickable links */}
                    {aiReferences.length > 0 && (
                      <div className="space-y-2">
                        <span className="font-medium text-slate-300 text-sm">Referenced Documents:</span>
                        <div className="flex flex-wrap gap-2">
                          {aiReferences.map((ref, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleDocumentReference(ref)}
                              className="group inline-flex items-center gap-2 px-3 py-2 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-500/30 hover:border-blue-400/50 rounded-lg text-blue-300 hover:text-blue-200 transition-all text-xs cursor-pointer"
                            >
                              <div className="flex items-center gap-1">
                                {ref.type === 'Book' && <BookOpen className="w-3 h-3" />}
                                {ref.type === 'Notes' && <StickyNote className="w-3 h-3" />}
                                {ref.type === 'Presentation' && <Presentation className="w-3 h-3" />}
                                <span className="font-medium">{ref.title}</span>
                              </div>
                              <div className="text-blue-400/70">
                                • {ref.topic}
                              </div>
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Legacy sources (if no references) */}
                    {aiSources.length > 0 && aiReferences.length === 0 && (
                      <div className="text-xs text-slate-400">
                        <span className="font-medium text-slate-300">Sources: </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {aiSources.map((source, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-900/30 border border-blue-500/30 rounded-full text-blue-300"
                            >
                              📄 {source}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files by name or tags..."
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters - Desktop */}
          <div className="hidden sm:flex gap-3">
            {/* Type filter */}
            <select
              className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white min-w-[120px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Book">Books</option>
              <option value="Presentation">Presentations</option>
              <option value="Notes">Notes</option>
            </select>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white min-w-[140px] flex items-center justify-between focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <span>{sortBy}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showSortDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10">
                  {["Recently Uploaded", "Recently Opened", "Name", "Type", "Size"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option);
                        setShowSortDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-white hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>

          {/* Mobile filter toggle */}
          <div className="sm:hidden flex gap-2">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile filters */}
        {showMobileFilters && (
          <div className="sm:hidden bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 mb-4">
            <div className="flex flex-col gap-3">
              <select
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Book">Books</option>
                <option value="Presentation">Presentations</option>
                <option value="Notes">Notes</option>
              </select>
              <select
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Recently Uploaded">Recently Uploaded</option>
                <option value="Recently Opened">Recently Opened</option>
                <option value="Name">Name</option>
                <option value="Type">Type</option>
                <option value="Size">Size</option>
              </select>
            </div>
          </div>
        )}

        {/* Bulk actions */}
        {selectedFiles.length > 0 && (
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-400 text-sm">
                {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600/20 border border-red-500/30 text-red-400 px-3 py-1 rounded text-xs font-medium hover:bg-red-600/30 transition-colors"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedFiles([])}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* File List/Grid */}
      {isLoading ? (
        <LoadingComponent />
      ) : sortedFiles.length > 0 ? (
        viewMode === "grid" ? (
          <GridView files={sortedFiles} />
        ) : (
          <ListView files={sortedFiles} />
        )
      ) : (
        <div className="text-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-800/50 rounded-xl flex items-center justify-center">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No files found</h3>
          <p className="text-slate-400 mb-6">
            {searchTerm || selectedType !== "All" 
              ? "Try adjusting your search or filters" 
              : "Upload your first file to get started"}
          </p>
          {!searchTerm && selectedType === "All" && (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all inline-flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Files
            </button>
          )}
        </div>
      )}

      {/* Individual delete modal removed - now handled by parent component */}

      {/* Bulk Delete Confirmation Modal */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <p className="mb-4">Are you sure you want to delete {selectedFiles.length} selected file{selectedFiles.length !== 1 ? 's' : ''}?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelBulkDelete}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                disabled={isBulkDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmBulkDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={isBulkDeleting}
              >
                {isBulkDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};