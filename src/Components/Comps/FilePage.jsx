import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { GetAllFiles, DeleteFile } from "../apiclient/FileRetrievalapis";

export const FilesPage = ({ setIsUploadModalOpen, isMobile, uploadedFiles: propFiles, isLoading: propLoading, refreshFiles }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("Recently Uploaded");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'grid'
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const getSlidesFun = async () => {
    try {
      setIsLoading(true);
      console.log("🔄 Fetching all files...");
      const response = await GetAllFiles();
      console.log("📁 Files API response:", response);
      
      const { books, presentations, notes } = response;
      
      // Transform all files into a unified format
      const transformedFiles = [];
      
      // Transform books
      if (books && Array.isArray(books) && books.length > 0) {
        console.log("📚 Processing books:", books);
        books.forEach((book, index) => {
          console.log(`📚 Book ${index}:`, book);
          const fileName = book.title || book.original_filename || book.file_name || book.filename || book.name || `Book_${book.id || index}`;
          transformedFiles.push({
            id: book.id || `book_${index}`,
            title: fileName,
            uploadDate: book.created_at ? book.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            type: 'Book',
            color: "bg-blue-500",
            icon: BookOpen,
            size: book.size || "10 MB",
            pages: book.pages || 1,
            tags: book.tags || [],
            lastOpened: book.last_opened || book.created_at,
            isFavorite: book.is_favorite || false,
          });
        });
      }
      
      // Transform presentations
      if (presentations && Array.isArray(presentations) && presentations.length > 0) {
        console.log("🎯 Processing presentations:", presentations);
        presentations.forEach((presentation, index) => {
          console.log(`🎯 Presentation ${index}:`, presentation);
          const fileName = presentation.title || presentation.original_filename || presentation.file_name || presentation.filename || presentation.name || `Presentation_${presentation.id || index}`;
          transformedFiles.push({
            id: presentation.id || `presentation_${index}`,
            title: fileName,
            uploadDate: presentation.created_at ? presentation.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            type: 'Presentation',
            color: "bg-green-500",
            icon: Presentation,
            size: presentation.size || "10 MB",
            pages: presentation.total_slides || 1,
            tags: presentation.tags || [],
            lastOpened: presentation.last_opened || presentation.created_at,
            isFavorite: presentation.is_favorite || false,
          });
        });
      }
      
      // Transform notes
      if (notes && Array.isArray(notes) && notes.length > 0) {
        console.log("📝 Processing notes:", notes);
        notes.forEach((note, index) => {
          console.log(`📝 Note ${index}:`, note);
          const fileName = note.title || note.original_filename || note.file_name || note.filename || note.name || `Note_${note.id || index}`;
          transformedFiles.push({
            id: note.id || `note_${index}`,
            title: fileName,
            uploadDate: note.created_at ? note.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            type: 'Notes',
            color: "bg-purple-500",
            icon: StickyNote,
            size: note.size || "10 MB",
            pages: note.pages || 1,
            tags: note.tags || [],
            lastOpened: note.last_opened || note.created_at,
            isFavorite: note.is_favorite || false,
          });
        });
      }
      
      // Sort by upload date
      transformedFiles.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
      
      console.log("📄 Final transformed files:", transformedFiles);
      console.log(`📊 Total files loaded: ${transformedFiles.length}`);
      setUploadedFiles(transformedFiles);
    } catch (error) {
      console.error("❌ Error getting files:", error);
      console.error("❌ Error details:", error.response?.data);
      // Set empty array on error
      setUploadedFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Use files from props if available (already loaded), otherwise fetch them
    if (propFiles && propFiles.length > 0) {
      console.log("📄 Using files from props:", propFiles);
      setUploadedFiles(propFiles);
      setIsLoading(false);
    } else if (propLoading !== undefined) {
      setIsLoading(propLoading);
    } else {
      // Only fetch if we don't have files from props
      getSlidesFun();
    }
  }, [propFiles, propLoading]);

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

  const handleDeleteClick = (file) => {
    setFileToDelete(file);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;
    
    setIsDeleting(true);
    
    try {
      // Log the complete file object to see its structure
      console.log("🔍 FILE TO DELETE - Complete object:", fileToDelete);
      console.log("🔍 File ID:", fileToDelete.id);
      console.log("🔍 File meta:", fileToDelete.meta);
      console.log("🔍 File type:", fileToDelete.type);
      
      // Convert file type to match API expectations
      const docType = fileToDelete.meta?.fileType || fileToDelete.type.toLowerCase();
      
      console.log(`🗑️ FINAL VALUES FOR DELETE:`);
      console.log(`   File ID: "${fileToDelete.id}"`);
      console.log(`   Doc Type: "${docType}"`);
      
      await DeleteFile(fileToDelete.id, docType);
      
      // Remove from UI manually
      setUploadedFiles(uploadedFiles.filter((file) => file.id !== fileToDelete.id));
      if (refreshFiles) {
        refreshFiles(); // Refresh files in parent component as well
      }
      
      console.log("✅ File deleted successfully");
    } catch (error) {
      console.error("❌ Delete failed:", error);
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

  const handleBulkDelete = async () => {
    setIsBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    setIsBulkDeleting(true);
    
    try {
      const filesToDelete = uploadedFiles.filter(file => selectedFiles.includes(file.id));
      
      // Delete files sequentially to avoid overwhelming the server
      for (const file of filesToDelete) {
        console.log("🔍 BULK DELETE - Processing file:", file);
        const docType = file.meta?.fileType || file.type.toLowerCase();
        console.log(`🗑️ Deleting file ID: "${file.id}", Type: "${docType}"`);
        await DeleteFile(file.id, docType);
      }
      
      // Update the file list by removing deleted files
      setUploadedFiles(uploadedFiles.filter(file => !selectedFiles.includes(file.id)));
      setSelectedFiles([]);
      
      if (refreshFiles) {
        refreshFiles(); // Refresh files in parent component as well
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

  const filteredFiles = uploadedFiles.filter((file) => {
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && fileToDelete && (
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
                Are you sure you want to delete <span className="font-medium text-white">"{fileToDelete.title || fileToDelete.name}"</span>?
              </p>
              
              <p className="text-sm text-red-400 mb-6">
                This will permanently delete the file and all associated data including study progress, MCQs, and notes. This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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