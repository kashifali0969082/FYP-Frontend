import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Upload,
  FileText,
  Book,
  Presentation,
  StickyNote,
  Calendar,
  HardDrive,
  Download,
  Trash2,
  BookOpen,
} from "lucide-react";
import { GetAllSlides, GetAllBooks } from "../../Api/Apifun";

export const FilesPage = ({ setIsUploadModalOpen }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [sortBy, setSortBy] = useState("Recently Uploaded");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const getSlidesFun = async () => {
    try {
      const response = await GetAllSlides();
      const bookResponse = await GetAllBooks();

      const presentations = response.data.presentations || [];
      const books = bookResponse.data.books || [];

      const transformedFiles = [...presentations, ...books]
        .map((item) => {
          const baseFile = {
            id: item.id,
            title: item.original_filename || item.file_name || item.name || "Untitled",
            uploadDate: item.created_at?.split("T")[0] || item.uploadDate,
            size: item.size || "10 MB", // placeholder
            pages: item.total_slides || 1, // or pages if available
            thumbnail: "/api/placeholder/120/160",
            tags: item.tags || [],
          };

          if (item.type === "presentation") {
            return {
              ...baseFile,
              type: "Slides",
              color: "bg-green-500",
            };
          } else if (item.type === "book") {
            return {
              ...baseFile,
              type: "Books",
              color: "bg-blue-500",
            };
          }

          return {
            ...baseFile,
            type: "Notes",
            color: "bg-purple-500",
          };
        })
        .sort(
          (a, b) =>
            new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        );

      setUploadedFiles(transformedFiles);
    } catch (error) {
      console.error("Error getting slides/books:", error);
    }
  };

  useEffect(() => {
    getSlidesFun();
  }, []);

  const getTypeIcon = (type) => {
    switch (type) {
      case "Books":
        return <Book className="w-4 h-4 sm:w-5 sm:h-5" />;
      case "Slides":
        return <Presentation className="w-4 h-4 sm:w-5 sm:h-5" />;
      case "Notes":
        return <StickyNote className="w-4 h-4 sm:w-5 sm:h-5" />;
      default:
        return <FileText className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Books":
        return "bg-blue-500/20 text-blue-400 border-blue-400/30";
      case "Slides":
        return "bg-green-500/20 text-green-400 border-green-400/30";
      case "Notes":
        return "bg-purple-500/20 text-purple-400 border-purple-400/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-400/30";
    }
  };

  const filteredFiles = uploadedFiles.filter((file) => {
    const matchesSearch =
      file.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesType = selectedType === "All" || file.type === selectedType;
    return matchesSearch && matchesType;
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case "Name":
        return a.title.localeCompare(b.title);
      case "Type":
        return a.type.localeCompare(b.type);
      case "Recently Uploaded":
      default:
        return new Date(b.uploadDate) - new Date(a.uploadDate);
    }
  });

  const FileListItem = ({ file }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 hover:bg-slate-800/70 transition-all duration-300 border border-slate-700/50 group">
      <div className="flex items-center gap-2 sm:gap-4">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${file.color} flex items-center justify-center text-white flex-shrink-0`}
        >
          {getTypeIcon(file.type)}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white text-sm sm:text-base truncate">
            {file.title}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
            </span>
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3 flex-shrink-0" />
              {file.size}
            </span>
            <span className="hidden sm:inline">{file.pages} pages</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getTypeColor(
              file.type
            )}`}
          >
            {getTypeIcon(file.type)}
            <span className="hidden sm:inline">{file.type}</span>
          </span>

          <div className="flex gap-1 sm:gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg text-xs font-medium transition-all">
              Study
            </button>
            <button className="p-1.5 sm:p-2 bg-slate-700/50 hover:bg-slate-700 text-gray-300 rounded-lg transition-colors">
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button className="p-1.5 sm:p-2 bg-red-600/50 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition-colors">
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const MobileFilters = () => (
    <div
      className={`${
        showMobileFilters ? "block" : "hidden"
      } lg:hidden bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 mb-4`}
    >
      <div className="flex flex-col gap-3">
        <select
          className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Books">Books</option>
          <option value="Slides">Slides</option>
          <option value="Notes">Notes</option>
        </select>
        <select
          className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="Recently Uploaded">Recent</option>
          <option value="Name">Name</option>
          <option value="Type">Type</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6">
      {/* Controls */}
      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3 mb-4">
          <select
            className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Books">Books</option>
            <option value="Slides">Slides</option>
            <option value="Notes">Notes</option>
          </select>
          <select
            className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2.5 text-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="Recently Uploaded">Recent</option>
            <option value="Name">Name</option>
            <option value="Type">Type</option>
          </select>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-lg font-medium"
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Upload
          </button>
        </div>

        <MobileFilters />
      </div>

      {/* File List */}
      <div className="space-y-3">
        {sortedFiles.length > 0 ? (
          sortedFiles.map((file) => (
            <FileListItem key={file.id} file={file} />
          ))
        ) : (
          <div className="text-white text-center py-10">No files found.</div>
        )}
      </div>
    </div>
  );
};
