import { getAuthToken } from "../../utils/auth";
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Moon,
  Sun,
  RotateCcw,
  FileText,
  MessageCircle,
  X,
  Brain,
  Network,
  HelpCircle,
  Gamepad2,
  Search,
  BookmarkPlus,
  Share,
} from "lucide-react";
import { Button } from "./button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";
import { StreamDocument } from "../../Api/Apifun";
const availableTools = [
  {
    id: "ask",
    name: "Ask LLM",
    icon: <MessageCircle className="w-4 h-4" />,
    description: "Ask AI about this text",
    color:
      "text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950",
  },
  {
    id: "flashcard",
    name: "Flashcards",
    icon: <Brain className="w-4 h-4" />,
    description: "Generate flashcards from this text",
    color:
      "text-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950",
  },
  {
    id: "quiz",
    name: "Quiz",
    icon: <HelpCircle className="w-4 h-4" />,
    description: "Create quiz questions from this text",
    color:
      "text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950",
  },
  {
    id: "diagram",
    name: "Diagrams",
    icon: <Network className="w-4 h-4" />,
    description: "Generate diagrams from this text",
    color:
      "text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950",
  },
  {
    id: "game",
    name: "Games",
    icon: <Gamepad2 className="w-4 h-4" />,
    description: "Create learning games from this text",
    color:
      "text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950",
  },
];
// If you use a custom API client, import it here
// import { apiclient } from "../apiclient/Apis";

// Dynamic token getter for API calls
const getHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication token not available");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const PDFViewer = ({
  setFinalizedPage,
  currentPage,
  totalPages,
  onPageChange,
  documentId,
  fileName,
  onTextHighlight,
  id,
  type,
}) => {
  const [zoom, setZoom] = useState(1.0);
  const [isDarkMode, setIsDarkMode] = useState(true);
const safeCurrentPage = typeof currentPage === "number" && !isNaN(currentPage) ? currentPage : 1;
const [pageInput, setPageInput] = useState(safeCurrentPage.toString());
  const [textSelection, setTextSelection] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [hoveredTool, setHoveredTool] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const contentRef = useRef(null);
  const popupRef = useRef(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
useEffect(()=>{
setFinalizedPage(pageNumber)
},[pageNumber])
  console.log("pdf Viewer function is calling", id, type,pageNumber);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };
  useEffect(() => {
    fetchPdf(id);
  }, []);

  const fetchPdf = async (id) => {
    try {
      console.log("api is called", id, type);
      let lower = type.toLowerCase();
      const response = await axios.get(
        `https://api.adaptivelearnai.xyz/study-mode/documents/${id}/stream`,
        {
          headers: getHeaders(),
          responseType: "blob",
          params: { document_type: lower },
        }
      );
      console.log("response is", response.data);
      const blobUrl = URL.createObjectURL(response.data);
      setPdfUrl(blobUrl);
    } catch (error) {
      console.error("Failed to load PDF:", error);
    }
  };
  const lastPageNumber = async () => {
    let lower = type.toLowerCase();
    try {
      let resp = await axios.post(
        `https://api.adaptivelearnai.xyz/study-mode/documents/${id}/last-position`,
        {
          document_id: id,
          document_type: lower,
          page_number: pageNumber,
        },
        {
          headers: getHeaders(),
        }
      );
    } catch (error) {
      console.log("error while getting the api ", error);
    }
  };
  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
    lastPageNumber()
setPageInput((Number(pageInput) - 1).toString());
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
    lastPageNumber();
    setPageInput((Number(pageInput) + 1).toString());

  };

  const goToPage = () => {
    // Wait for PDF to be loaded before allowing navigation
    if (!pdfUrl || numPages === 0) {
      // PDF not loaded yet, don't show alert
      return;
    }
    const target = parseInt(pageInput, 10);
    if (!isNaN(target) && target >= 1 && target <= numPages) {
      setPageNumber(target);
    } else {
      alert("Invalid page number");
    }
  };
  useEffect(() => {
    goToPage();
  }, [pageInput, pdfUrl, numPages]);
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 2.0));
    toast.success(`Zoom: ${Math.round((zoom + 0.1) * 100)}%`);
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.5));
    toast.success(`Zoom: ${Math.round((zoom - 0.1) * 100)}%`);
  };

  const handleResetZoom = () => {
    setZoom(1.0);
    toast.success("Zoom reset to 100%");
  };

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    const page = parseInt(pageInput);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      setPageInput(currentPage.toString());
      toast.error("Invalid page number");
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      // Simulate search
      setTimeout(() => {
        setIsSearching(false);
        toast.success(`Searching for "${searchTerm}"`);
      }, 1000);
    }
  };

React.useEffect(() => {
  const safeCurrentPage = typeof currentPage === "number" && !isNaN(currentPage) ? currentPage : 1;
  setPageInput(safeCurrentPage.toString());
}, [currentPage]);

  // Handle text selection
  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setShowPopup(false);
      setTextSelection(null);
      return;
    }

    const selectedText = selection.toString().trim();
    if (selectedText.length === 0) {
      setShowPopup(false);
      setTextSelection(null);
      return;
    }

    // Get the range and its position
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Get surrounding context (previous and next sentences)
    const container = range.commonAncestorContainer;
    const textContent = container.textContent || "";
    const startOffset = range.startOffset;
    const endOffset = range.endOffset;

    // Extract context around the selection
    const beforeText = textContent.substring(
      Math.max(0, startOffset - 100),
      startOffset
    );
    const afterText = textContent.substring(
      endOffset,
      Math.min(textContent.length, endOffset + 100)
    );
    const context = `${beforeText}${selectedText}${afterText}`.trim();

    setTextSelection({
      text: selectedText,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      context: context,
    });
    setShowPopup(true);
  }, []);

  // Listen for text selection
  useEffect(() => {
    const handleMouseUp = () => {
      setTimeout(handleTextSelection, 10);
    };

    const handleKeyUp = (e) => {
      if (e.key === "Escape") {
        setShowPopup(false);
        setTextSelection(null);
        setHoveredTool(null);
        window.getSelection()?.removeAllRanges();
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleTextSelection]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
        setTextSelection(null);
        setHoveredTool(null);
      }
    };

    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showPopup]);

  const handleToolSelect = (toolId) => {
    if (textSelection && onTextHighlight) {
      // For "ask" tool, use the original behavior, for others pass the tool type
      const toolType = toolId === "ask" ? undefined : toolId;
      onTextHighlight(textSelection.text, textSelection.context, toolType);
      setShowPopup(false);
      setTextSelection(null);
      setHoveredTool(null);
      window.getSelection()?.removeAllRanges();

      // Show appropriate toast message
      const tool = availableTools.find((t) => t.id === toolId);
      if (tool) {
        toast.success(`Selected text sent to ${tool.name}!`);
      }
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setTextSelection(null);
    setHoveredTool(null);
    window.getSelection()?.removeAllRanges();
  };

  // Generate dynamic content based on current page
  const generatePageContent = () => {
    const chapterNum = Math.ceil(currentPage / 20);
    const sectionNum = Math.ceil((currentPage % 20) / 5) || 1;

    const topics = [
      "Algorithm Analysis and Complexity",
      "Data Structures and Abstract Data Types",
      "Sorting and Searching Algorithms",
      "Graph Algorithms and Network Flow",
      "Dynamic Programming Techniques",
      "Greedy Algorithms and Optimization",
      "Divide and Conquer Strategies",
      "Advanced Tree Structures",
    ];

    const currentTopic = topics[(currentPage - 1) % topics.length];

    const concepts = [
      [
        "Big O Notation",
        "Time Complexity",
        "Space Complexity",
        "Asymptotic Analysis",
      ],
      ["Arrays", "Linked Lists", "Stacks", "Queues", "Hash Tables"],
      ["Quick Sort", "Merge Sort", "Binary Search", "Heap Sort"],
      ["BFS", "DFS", "Dijkstra's Algorithm", "Minimum Spanning Trees"],
      [
        "Optimal Substructure",
        "Memoization",
        "Tabulation",
        "State Transitions",
      ],
      [
        "Greedy Choice Property",
        "Activity Selection",
        "Huffman Coding",
        "Fractional Knapsack",
      ],
      ["Recurrence Relations", "Master Theorem", "Binary Search Trees", "FFT"],
      ["AVL Trees", "Red-Black Trees", "B-Trees", "Segment Trees"],
    ];

    const currentConcepts = concepts[(currentPage - 1) % concepts.length];

    return {
      chapter: chapterNum,
      section: sectionNum,
      topic: currentTopic,
      concepts: currentConcepts,
    };
  };

  const pageContent = generatePageContent();

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm overflow-hidden relative rounded-2xl border border-slate-700/30">
      {/* Enhanced Text Selection Popup with All Tools */}
      {showPopup && textSelection && (
        <div
          ref={popupRef}
          className="fixed z-50 bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          style={{
            left: `${Math.max(
              10,
              Math.min(window.innerWidth - 320, textSelection.x - 160)
            )}px`,
            top: `${Math.max(10, textSelection.y)}px`,
          }}
        >
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400 mb-1 font-medium">
                  Selected text:
                </p>
                <p
                  className="text-sm font-medium truncate max-w-56 text-white"
                  title={textSelection.text}
                >
                  "{textSelection.text}"
                </p>
              </div>
              <Button
                onClick={handleClosePopup}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 ml-3 flex-shrink-0 hover:bg-slate-700/50 rounded-lg"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>

            {/* Tools Grid */}
            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-medium">
                Choose an action:
              </p>
              <div className="grid grid-cols-5 gap-2">
                {availableTools.map((tool) => (
                  <div key={tool.id} className="relative">
                    <Button
                      onClick={() => handleToolSelect(tool.id)}
                      variant={tool.id === "ask" ? "default" : "outline"}
                      size="sm"
                      className={`h-12 w-12 p-0 relative transition-all duration-200 ${
                        tool.color
                      } ${
                        tool.id === "ask"
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-blue-500/30 shadow-lg"
                          : "border-slate-600/50 hover:border-slate-500/70 bg-slate-800/50 hover:bg-slate-700/50"
                      }`}
                      onMouseEnter={() => setHoveredTool(tool.id)}
                      onMouseLeave={() => setHoveredTool(null)}
                    >
                      {tool.icon}
                    </Button>

                    {/* Enhanced Tooltip */}
                    {hoveredTool === tool.id && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900/95 backdrop-blur-xl text-white text-xs rounded-lg shadow-xl border border-slate-600/50 whitespace-nowrap z-10 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="font-medium text-white">
                          {tool.name}
                        </div>
                        <div className="text-slate-300 text-xs mt-0.5">
                          {tool.description}
                        </div>
                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-600/50"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick hint */}
            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <p className="text-xs text-slate-500 text-center">
                {hoveredTool
                  ? availableTools.find((t) => t.id === hoveredTool)
                      ?.description
                  : "Hover over tools for details"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Toolbar */}
      <div className="border-b border-slate-700/50 p-3 flex items-center justify-between bg-slate-800/60 backdrop-blur-lg flex-shrink-0 rounded-t-2xl">
        {/* Left: Zoom Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-700/50 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="h-8 px-2 hover:bg-slate-600/50"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>

            <span className="text-xs text-slate-300 min-w-[3rem] text-center font-mono bg-slate-800/50 px-2 py-1 rounded mx-1">
              {Math.round(zoom * 100)}%
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="h-8 px-2 hover:bg-slate-600/50"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetZoom}
            className="h-8 px-3 hover:bg-slate-700/50 rounded-lg"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            <span className="text-xs">Reset</span>
          </Button>
        </div>

        {/* Center: Page Navigation */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
            className="h-8 px-3 hover:bg-slate-700/50 disabled:opacity-50 rounded-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg px-3 py-1">
            <form
              onSubmit={handlePageInputSubmit}
              className="flex items-center gap-2"
            >
              <Input
                type="text"
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                className="w-12 text-center h-6 text-xs bg-slate-800/50 border-slate-600/50 rounded text-white font-mono"
                size={3}
              />
              {/* <input
                        type="number"
                        placeholder="Page #"
                        // value={inputPage}
                        // onChange={(e) => setInputPage(e.target.value)}
                        style={{ width: "80px", padding: "4px" }}
                      /> */}
              <span className="text-slate-400 text-xs">of</span>
              <span className="text-slate-300 text-xs font-mono">
                {totalPages}
              </span>
            </form>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage >= totalPages}
            className="h-8 px-3 hover:bg-slate-700/50 disabled:opacity-50 rounded-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Right: Search and Theme Controls */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="flex items-center bg-slate-700/50 rounded-lg">
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-32 h-8 text-xs bg-transparent border-none text-white placeholder-slate-400"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSearch}
              disabled={isSearching}
              className="h-8 px-2 hover:bg-slate-600/50"
            >
              <Search
                className={`w-4 h-4 ${isSearching ? "animate-spin" : ""}`}
              />
            </Button>
          </div>

          {/* Additional tools */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 hover:bg-slate-700/50 rounded-lg"
            title="Bookmark page"
          >
            <BookmarkPlus className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 hover:bg-slate-700/50 rounded-lg"
            title="Share"
          >
            <Share className="w-4 h-4" />
          </Button>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="h-8 px-2 hover:bg-slate-700/50 rounded-lg"
            title="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* PDF Content Area with Enhanced Styling */}
      <div
        className={`flex-1 overflow-auto transition-all duration-300 ${
          isDarkMode
            ? "bg-gradient-to-br from-slate-900/80 to-slate-800/80"
            : "bg-gradient-to-br from-gray-100 to-white"
        }`}
      >
        <div className="h-full flex justify-center p-4">
          <div
            ref={contentRef}
            className={`w-full max-w-4xl transition-all duration-300 shadow-2xl rounded-xl overflow-hidden border ${
              isDarkMode
                ? "bg-slate-800/80 text-slate-100 border-slate-700/50"
                : "bg-white text-gray-900 border-gray-200"
            } backdrop-blur-sm select-text`}
            style={{
              fontSize: `${zoom}em`,
              lineHeight: 1.6,
            }}
          >
            <div className="p-6 lg:p-8 h-full overflow-auto study-scrollbar">
              <div
                style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "1rem",
                  minHeight: "100vh",
                }}
              >
                {pdfUrl ? (
                  <>
                    <Document
                      file={pdfUrl}
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      <Page
                        pageNumber={pageNumber}
                        renderAnnotationLayer={false}
                        renderTextLayer={true}
                      />
                    </Document>

                    {/* <div
                      style={{
                        marginTop: "1rem",
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
                      <button onClick={goToPrevPage} disabled={pageNumber <= 1}>
                        Previous
                      </button>

                      <span>
                        Page {pageNumber} of {numPages}
                      </span>

                      <button
                        onClick={goToNextPage}
                        disabled={pageNumber >= numPages}
                      >
                        Next
                      </button>

                      <input
                        type="number"
                        placeholder="Page #"
                        value={inputPage}
                        onChange={(e) => setInputPage(e.target.value)}
                        style={{ width: "80px", padding: "4px" }}
                      />

                      <button onClick={goToPage}>Go</button>
                    </div> */}
                  </>
                ) : (
                  <p>Loading PDF...</p>
                )}
              </div>
            </div>
            {/* <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-700/30">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl font-semibold mb-1 truncate text-white">{fileName}</h1>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>Page {currentPage} of {totalPages}</span>
                    <span>•</span>
                    <span>Chapter {pageContent.chapter}</span>
                    <span>•</span>
                    <span>{Math.round((currentPage / totalPages) * 100)}% complete</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 user-select-text">
                <div className="border-b border-slate-700/30 pb-4">
                  <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Chapter {pageContent.chapter}: {pageContent.topic}
                  </h1>
                  <p className="text-slate-400 text-lg">Section {pageContent.section} - Introduction and Fundamentals</p>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white">Overview</h2>
                  <div className="prose prose-lg prose-invert max-w-none">
                    <p className="leading-relaxed text-slate-300">
                      This section introduces the fundamental concepts of {pageContent.topic.toLowerCase()}. 
                      Understanding these principles is essential for developing efficient algorithms and 
                      solving complex computational problems in computer science. Algorithm analysis provides 
                      the mathematical foundation for understanding how programs behave under different conditions.
                    </p>
                    
                    <p className="leading-relaxed text-slate-300">
                      The concepts covered in this chapter build upon previous knowledge and provide 
                      the foundation for more advanced topics. Students should focus on understanding 
                      both the theoretical aspects and practical applications. Performance analysis is crucial 
                      for writing efficient code that scales well with larger input sizes.
                    </p>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mt-6">Key Concepts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pageContent.concepts.map((concept, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-slate-300">{concept}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className={`mt-8 p-4 rounded-xl border ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-800/50' 
                      : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
                  }`}>
                    <h4 className="flex items-center gap-2 mb-3 text-lg font-semibold">
                      <span className="text-2xl">💡</span>
                      Study Tip
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-300">
                      Practice implementing these concepts in your preferred programming language. 
                      Use the study tools on the right to create flashcards and quizzes for better retention. 
                      Work through the exercises at the end of each section to reinforce your understanding.
                      <strong className="text-blue-400"> Try highlighting any text in this document to access all learning tools instantly!</strong>
                    </p>
                  </div>

                  <div className="mt-8 space-y-4">
                    <h3 className="text-xl font-semibold text-white">Algorithm Analysis in Detail</h3>
                    <div className="prose prose-lg prose-invert max-w-none space-y-4">
                      <p className="leading-relaxed text-slate-300">
                        Algorithm analysis is the theoretical study of computer program performance and resource usage. 
                        It involves mathematical techniques to describe the running time of an algorithm as a function 
                        of its input size. This analysis helps us predict how the algorithm will perform on large datasets 
                        and compare different algorithmic approaches.
                      </p>
                      
                      <p className="leading-relaxed text-slate-300">
                        The most common complexity measures are time complexity and space complexity. Time complexity 
                        describes how the running time increases with input size, while space complexity describes 
                        how memory usage grows. Both are typically expressed using Big O notation, which provides 
                        an upper bound on the growth rate.
                      </p>

                      <h4 className="text-lg font-semibold text-white mt-6">Common Time Complexities</h4>
                      <div className="space-y-3">
                        {[
                          { notation: "O(1)", name: "Constant Time", desc: "Operations that take the same amount of time regardless of input size, such as array indexing or hash table lookups." },
                          { notation: "O(log n)", name: "Logarithmic Time", desc: "Algorithms that divide the problem in half at each step, like binary search or balanced tree operations." },
                          { notation: "O(n)", name: "Linear Time", desc: "Algorithms that examine each element once, such as linear search or finding the maximum element in an unsorted array." },
                          { notation: "O(n log n)", name: "Linearithmic Time", desc: "Efficient sorting algorithms like merge sort and heap sort fall into this category." },
                          { notation: "O(n²)", name: "Quadratic Time", desc: "Algorithms with nested loops over the input, such as bubble sort or simple matrix multiplication." }
                        ].map((complexity, index) => (
                          <div key={index} className="p-4 bg-slate-800/40 rounded-lg border border-slate-700/30">
                            <div className="flex items-start space-x-3">
                              <code className="bg-slate-700/50 text-blue-400 px-2 py-1 rounded text-sm font-mono">{complexity.notation}</code>
                              <div>
                                <h5 className="font-semibold text-white">{complexity.name}:</h5>
                                <p className="text-sm text-slate-400 leading-relaxed">{complexity.desc}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={`mt-6 p-4 rounded-xl border ${
                    isDarkMode 
                      ? 'bg-slate-800/60 border-slate-700/50' 
                      : 'bg-gray-50 border-gray-300'
                  }`}>
                    <h4 className="mb-3 font-semibold text-white flex items-center gap-2">
                      <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">{ }</span>
                      </div>
                      Algorithm Example: Binary Search
                    </h4>
                    <pre className="whitespace-pre-wrap overflow-auto text-sm bg-slate-900/50 p-4 rounded-lg border border-slate-700/30 text-slate-300 font-mono">
{`function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid; // Found target at index mid
    } else if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }
  
  return -1; // Target not found
}

// Time Complexity: O(log n)
// Space Complexity: O(1)`}
                    </pre>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Practice Exercises</h3>
                    <div className="space-y-3">
                      {[
                        "Implement the basic binary search algorithm and analyze its time complexity step by step. Explain why it's O(log n).",
                        "Compare linear search vs binary search performance. When would you use each approach?",
                        "Apply the concept to solve a real-world problem: design an efficient algorithm to find a specific record in a large sorted database."
                      ].map((exercise, index) => (
                        <div key={index} className={`p-4 rounded-lg border ${
                          isDarkMode 
                            ? 'bg-slate-800/40 border-slate-700/30' 
                            : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {index + 1}
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                              <strong className="text-white">Exercise {currentPage}.{index + 1}:</strong> {exercise}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

                <div className="mt-12 pt-6 border-t border-slate-700/30 text-center">
                <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
                  <span className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>Introduction to Algorithms</span>
                  </span>
                  <span>•</span>
                  <span>Page {currentPage}</span>
                  <span>•</span>
                  <span className="text-blue-400">Highlight text to access learning tools</span>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
