import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  FileText,
  Presentation,
  ChevronRight,
  Search,
  Filter,
  Calendar,
  User,
  History
} from 'lucide-react';

export const DocumentSelection = ({ 
  uploadedFiles, 
  isFilesLoading, 
  onDocumentSelect, 
  selectedDocument,
  onNext,
  setCurrentPage,
  isMobile
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filterCounts, setFilterCounts] = useState({
    all: 0,
    book: 0,
    presentation: 0,
    notes: 0
  });

  const filterOptions = [
    { value: 'all', label: 'All Documents' },
    { value: 'book', label: 'Books' },
    { value: 'presentation', label: 'Presentations' },
    { value: 'notes', label: 'Notes' }
  ];

  useEffect(() => {
    if (uploadedFiles) {
      // Calculate counts for filter pills
      const counts = {
        all: uploadedFiles.length,
        book: uploadedFiles.filter(file => file.type.toLowerCase() === 'book').length,
        presentation: uploadedFiles.filter(file => file.type.toLowerCase() === 'presentation').length,
        notes: uploadedFiles.filter(file => file.type.toLowerCase() === 'notes').length
      };
      setFilterCounts(counts);

      // Apply filters
      let filtered = uploadedFiles;
      
      // Apply type filter
      if (selectedFilter !== 'all') {
        filtered = filtered.filter(file => 
          file.type.toLowerCase() === selectedFilter
        );
      }
      
      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(file =>
          file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setFilteredFiles(filtered);
    }
  }, [uploadedFiles, searchQuery, selectedFilter]);

  const getFileIcon = (fileType) => {
    switch (fileType.toLowerCase()) {
      case 'book':
        return BookOpen;
      case 'presentation':
        return Presentation;
      case 'notes':
        return FileText;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header with Configure Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
        <div>
          <h2 className="text-xl md:text-2xl xl:text-3xl font-bold text-white mb-1 md:mb-2">
            Select Document for Quiz
          </h2>
          <p className="text-sm md:text-base xl:text-lg text-slate-400">
            Choose a document from your library to generate quiz questions
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
          <button
            onClick={() => setCurrentPage && setCurrentPage('quiz-history')}
            className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm md:text-base"
          >
            <History size={16} />
            <span>View Quiz History</span>
          </button>
          
          {/* Configure Quiz Button - Always Visible */}
          <button
            onClick={onNext}
            disabled={!selectedDocument}
            className={`
              flex items-center space-x-2 px-4 md:px-6 py-2 md:py-3 rounded-lg transition-all duration-300 shadow-lg text-sm md:text-base
              ${selectedDocument 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-blue-500/25' 
                : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-50'
              }
            `}
          >
            <span>Configure Quiz</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2 md:gap-3">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedFilter(option.value)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${selectedFilter === option.value
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
              }
            `}
          >
            <span>{option.label}</span>
            <span className={`
              px-2 py-0.5 rounded-full text-xs
              ${selectedFilter === option.value
                ? 'bg-white/20 text-white'
                : 'bg-slate-600/50 text-slate-400'
              }
            `}>
              {filterCounts[option.value]}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search your documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
          >
            ×
          </button>
        )}
      </div>

      {/* Documents Grid */}
      <div className="space-y-4">
        {isFilesLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-600/50 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-5 bg-slate-600/50 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-600/50 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/50 rounded-xl flex items-center justify-center">
              <BookOpen size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {searchQuery || selectedFilter !== 'all' 
                ? 'No Documents Found' 
                : 'No Documents Available'
              }
            </h3>
            <p className="text-slate-400 mb-4">
              {searchQuery 
                ? `No documents match "${searchQuery}"` 
                : selectedFilter !== 'all'
                  ? `No ${selectedFilter} documents found`
                  : 'Upload some documents to get started.'
              }
            </p>
            {(searchQuery || selectedFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                }}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-3 md:gap-4">
            {filteredFiles.map((file) => {
              const IconComponent = getFileIcon(file.type);
              const isSelected = selectedDocument?.id === file.id;
              
              return (
                <div
                  key={file.id}
                  onClick={() => onDocumentSelect(file)}
                  className={`
                    group cursor-pointer transition-all duration-300 transform hover:scale-[1.01] md:hover:scale-[1.02]
                    ${isSelected 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-500/50 shadow-lg shadow-blue-500/10' 
                      : 'bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800/70'
                    }
                    border rounded-lg md:rounded-xl p-3 md:p-4 xl:p-6 relative overflow-hidden
                  `}
                >
                  {/* Background decoration for selected */}
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500/10 to-purple-600/10 transform rotate-45 translate-x-8 md:translate-x-10 -translate-y-8 md:-translate-y-10" />
                  )}
                  
                  <div className="flex items-center justify-between relative z-10 gap-3">
                    <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                      <div className={`
                        w-10 h-10 md:w-12 md:h-12 xl:w-14 xl:h-14 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300
                        ${isSelected 
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 scale-105 md:scale-110' 
                          : 'bg-gradient-to-br from-blue-500/80 to-purple-600/80 group-hover:scale-105'
                        }
                      `}>
                        <IconComponent size={isMobile ? 20 : 24} className="text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-white text-sm md:text-base xl:text-lg mb-1 md:mb-2 truncate leading-tight">
                          {file.name.length > (isMobile ? 30 : 50) ? `${file.name.substring(0, isMobile ? 30 : 50)}...` : file.name}
                        </h4>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs md:text-sm text-slate-400 gap-1 sm:gap-0">
                          <span className="flex items-center space-x-1">
                            <FileText size={12} />
                            <span className="capitalize">{file.type}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar size={12} />
                            <span>{file.uploadDate}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="flex items-center space-x-2 text-blue-400 flex-shrink-0">
                        <span className="text-xs md:text-sm font-medium hidden sm:inline">Selected</span>
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-400 rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Document Summary */}
      {selectedDocument && (
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                {React.createElement(getFileIcon(selectedDocument.type), { size: 20, className: "text-white" })}
              </div>
              <div>
                <h4 className="font-medium text-white">{selectedDocument.name}</h4>
                <p className="text-sm text-blue-400">Ready to generate quiz questions</p>
              </div>
            </div>
            <button
              onClick={() => onDocumentSelect(null)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
