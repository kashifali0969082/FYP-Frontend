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
  // Default zoom at 80% for full-page fit; lock to stabilize text-layer alignment
  const [zoom, setZoom] = useState(0.8);
  const lockZoom = true;
  const [isDarkMode, setIsDarkMode] = useState(true);
  const safeCurrentPage =
    typeof currentPage === "number" && !isNaN(currentPage) ? currentPage : 1;
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
  const [pageWidth, setPageWidth] = useState(0);
  // Align text layer fallback
  const alignTextLayer = useCallback(() => {
    try {
      const root = contentRef.current;
      if (!root) return;
      const pageEl = root.querySelector(".pdf-page");
      if (!pageEl) return;
      const canvas = pageEl.querySelector(".react-pdf__Page__canvas");
      const text = pageEl.querySelector(".react-pdf__Page__textContent");
      if (!canvas || !text) return;
      // Reset any previous manual translate
      const current = text.style.transform || "";
      const withoutTranslate = current.replace(/\s*translate\([^\)]*\)/, "");
      text.style.transform = withoutTranslate.trim();
      // Measure and correct if needed
      const cr = canvas.getBoundingClientRect();
      const tr = text.getBoundingClientRect();
      const dx = cr.left - tr.left;
      const dy = cr.top - tr.top;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        text.style.transform = `${withoutTranslate} translate(${dx}px, ${dy}px)`;
      }
    } catch (_) {}
  }, []);
  useEffect(() => {
    setFinalizedPage(pageNumber);
  }, [pageNumber]);
  console.log("pdf Viewer function is calling", id, type, pageNumber);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };
  useEffect(() => {
    fetchPdf(id);
  }, []);

  // Measure container width and keep page width responsive
  useEffect(() => {
    const updateWidth = () => {
      const el = contentRef.current;
      if (!el) return;
      // account for inner padding (~48px for p-6) and avoid negative
      const padding = 48;
      const w = Math.max(200, (el.clientWidth || 0) - padding);
      setPageWidth(w);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Try aligning after render when page/zoom/size changes
  useEffect(() => {
    const t = setTimeout(alignTextLayer, 60);
    return () => clearTimeout(t);
  }, [alignTextLayer, pageNumber, zoom, pageWidth]);

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
  const lastPageNumber = async (page) => {
    let lower = type.toLowerCase();
    try {
      let resp = await axios.post(
        `https://api.adaptivelearnai.xyz/study-mode/documents/${id}/last-position`,
        {
          document_id: id,
          document_type: lower,
          page_number: page,
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
    const next = Math.max(pageNumber - 1, 1);
    setPageNumber(next);
    setPageInput(String(next));
    onPageChange?.(next);
    setFinalizedPage?.(next);
    lastPageNumber(next);
  };

  const goToNextPage = () => {
    const limit = numPages || totalPages || Number.MAX_SAFE_INTEGER;
    const next = Math.min(pageNumber + 1, limit);
    setPageNumber(next);
    setPageInput(String(next));
    onPageChange?.(next);
    setFinalizedPage?.(next);
    lastPageNumber(next);
  };

  const goToPage = () => {
    // Wait for PDF to be loaded before allowing navigation
    if (!pdfUrl || numPages === 0) {
      // PDF not loaded yet, don't show alert
      return;
    }
    const target = parseInt(pageInput, 10);
  const limit = numPages || totalPages || Number.MAX_SAFE_INTEGER;
  if (!isNaN(target) && target >= 1 && target <= limit) {
      setPageNumber(target);
      setPageInput(String(target));
      onPageChange?.(target);
      setFinalizedPage?.(target);
      lastPageNumber(target);
    } else {
      alert("Invalid page number");
    }
  };
  useEffect(() => {
    goToPage();
  }, [pageInput, pdfUrl, numPages]);
  const handleZoomIn = () => {
    if (lockZoom) return; // locked to 80%
    setZoom(Math.min(zoom + 0.1, 2.0));
    toast.success(`Zoom: ${Math.round((zoom + 0.1) * 100)}%`);
  };

  const handleZoomOut = () => {
    if (lockZoom) return; // locked to 80%
    setZoom(Math.max(zoom - 0.1, 0.5));
    toast.success(`Zoom: ${Math.round((zoom - 0.1) * 100)}%`);
  };

  const handleResetZoom = () => {
    setZoom(0.8);
    toast.success("Zoom locked at 80%");
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
    const safeCurrentPage =
      typeof currentPage === "number" && !isNaN(currentPage) ? currentPage : 1;
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
              disabled={lockZoom}
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
              disabled={lockZoom}
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
            disabled={pageNumber <= 1}
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
                {numPages || totalPages || 0}
              </span>
            </form>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextPage}
            disabled={(numPages ? pageNumber >= numPages : false) || (!numPages && totalPages ? pageNumber >= totalPages : false)}
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

      {/* PDF Content Area with Enhanced Styling (no scroll) */}
      <div
        className={`flex-1 overflow-hidden transition-all duration-300 ${
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
              // Page scaling handled by react-pdf Page scale
              lineHeight: 1.6,
            }}
          >
            <div className="p-6 lg:p-8 h-full">
              <div className="w-full flex justify-center">
                {pdfUrl ? (
                  <>
                    <Document
                      file={pdfUrl}
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      <Page
                        className="pdf-page"
                        pageNumber={pageNumber}
                        renderAnnotationLayer={false}
                        renderTextLayer={true}
                        width={Math.max(200, Math.round(pageWidth * zoom))}
                      />
                    </Document>
                    <style>{`
                      /* Hide text visually but keep selection */
                      .pdf-page {
                        position: relative;
                      }
                      .pdf-page .react-pdf__Page__canvas {
                        position: relative;
                        z-index: 1;
                        pointer-events: none; /* don't block text selection */
                      }
                      .pdf-page .react-pdf__Page__textContent {
                        /* Minimal TextLayer CSS compatible with pdf.js */
                        position: absolute !important;
                        top: 0; left: 0; /* anchor to canvas origin */
                        pointer-events: auto;
                        z-index: 2;
                        color: transparent !important; /* visually hidden */
                        user-select: text;
                        -webkit-user-select: text;
                        -ms-user-select: text;
                      }
                      .pdf-page .react-pdf__Page__textContent span {
                        position: absolute;
                        white-space: pre;
                        transform-origin: 0% 0%;
                      }
                      .pdf-page .react-pdf__Page__textContent span {
                        color: transparent !important;
                        background: transparent !important;
                        text-shadow: none !important;
                      }
                      .pdf-page .react-pdf__Page__textContent span::selection {
                        background: rgba(59, 130, 246, 0.35) !important;
                      }
                      .pdf-page .react-pdf__Page__textContent span::-moz-selection {
                        background: rgba(59, 130, 246, 0.35) !important;
                      }
                    `}</style>
                  </>
                ) : (
                  <p>Loading PDF...</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
