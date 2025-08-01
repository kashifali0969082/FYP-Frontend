import React, { useState, useEffect, useCallback, useRef } from "react";
import { TableOfContents } from "../Comps/TableOfContents";
import { PDFViewer } from "../Comps/PDFViewer";
import { ToolPanel } from "../Comps/ToolPanel";
import { Toaster } from "../Comps/sonner";
import { Button } from "../Comps/button";
import {
  ArrowLeft,
  BookOpen,
  EyeOff,
  Sparkles,
  Zap,
  Brain,
  Target,
  Menu,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { toast } from "sonner";
import { StreamDocument, StudyModeInit } from "../../Api/Apifun";
import { useLocation } from "react-router-dom";

export default function StudyMode() {
  const [studyData, setStudyData] = useState(null);
  const [chatHistory, setChatHistory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTOCCollapsed, setIsTOCCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPDFHidden, setIsPDFHidden] = useState(false);
  const [highlightedText, setHighlightedText] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const toolPanelRef = useRef(null);
  const location = useLocation();
  const { type, id } = location.state || {};
  const [minemockData, setminemockdata] = useState();
  const [pdfData, setPdfData] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [response, setresponse] = useState();
  const [ChatSessionId, setChatSessionId] = useState("")
const [FinalizedPage, setFinalizedPage] = useState()

  console.log("stdymode current page",currentPage,FinalizedPage);
  
  // Apply dark theme by default
  useEffect(() => {
    Studyinit();
  }, [id]);

  const Studyinit = async () => {
    try {
      let resp = await StudyModeInit({
        document_id: id,
        document_type: type.toLowerCase(),
      });
      console.log("final",resp.data.chat_session_id);
      setChatSessionId(resp.data.chat_session_id)
      setminemockdata(resp);
      let resp2 = await StreamDocument({
        document_id: id,
        document_type: type.toLowerCase(),
      });
      const respon = await StreamDocument(id, type);
      setresponse(respon);
      const byteArray = new Uint8Array(resp2.data);
      setPdfData(byteArray);
      console.log("init ", resp2);
    } catch (error) {
      console.log("error while initalizing study mode", error);
    }
  };

  // Calculate total pages from TOC or default
  const totalPages = studyData?.data?.toc
    ? Math.max(
        ...studyData.data?.toc.chapters.flatMap((chapter) =>
          chapter.sections
            ? chapter.sections.map((section) => section.page)
            : [1]
        )
      )
    : 100;

  // Check if TOC is available
  const hasTOC =
    studyData?.data.toc?.chapters && studyData.data.toc.chapters.length > 0;

  // Fixed TOC width in pixels (0 when no TOC or when PDF is hidden)
  const tocWidth = !hasTOC || isPDFHidden ? 0 : isTOCCollapsed ? 48 : 280;

  // Load chat history
  const loadChatHistory = async (chatSessionId) => {
    try {
      // Mock API response based on provided structure

    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  // Initialize study mode data
  useEffect(() => {
    const initializeStudyMode = async () => {
      try {
        setIsLoading(true);
        // Mock API response - sometimes without TOC
        // const mockData = {
        //   document: {
        //     id: "a4b8b023-5d0f-47fd-9c11-de9c38808600",
        //     user_id: "db391bfe-d580-4855-b4be-19ec6d45e7cc",
        //     title: "Introduction to Algorithms",
        //     file_name: "Introduction_to_algorithms-6-12.pdf",
        //     created_at: "2025-07-10T23:06:34.028593",
        //   },
        //   chat_session_id: "8bb10527-c62d-43e1-bd81-c3a44b590262",
        //   // Conditionally include TOC
        //   toc: {
        //     book_id: "a4b8b023-5d0f-47fd-9c11-de9c38808600",
        //     chapters: [
        //       {
        //         chapter_id: "10273a10-b1ea-4514-b6c7-d1bf2d20a856",
        //         chapter_number: "1",
        //         title: "Chapter 1: Foundations",
        //         sections: [
        //           {
        //             section_id: "06671124-438a-424b-84cc-43ef360501b0",
        //             title: "1.1 Algorithms",
        //             page: 5,
        //           },
        //           {
        //             section_id: "b8e19ca7-0dab-49cc-832a-91a099c32031",
        //             title: "1.2 Algorithms as a technology",
        //             page: 11,
        //           },
        //           {
        //             section_id: "6a0fe27b-a200-4777-becb-5ec0c62b6cee",
        //             title: "2 Getting Started",
        //             page: 16,
        //           },
        //         ],
        //       },
        //       {
        //         chapter_id: "0ada99be-dfc6-4efa-acca-c91d67458e4e",
        //         chapter_number: "2",
        //         title: "Chapter 2: Sorting and Order Statistics",
        //         sections: [
        //           {
        //             section_id: "d945fa7c-2d8d-4302-811c-05a7ab9646dc",
        //             title: "6 Heapsort",
        //             page: 151,
        //           },
        //           {
        //             section_id: "abcdfe9d-b9cd-4820-ae8d-5ba3a9c16cb6",
        //             title: "6.1 Heaps",
        //             page: 151,
        //           },
        //         ],
        //       },
        //     ],
        //   },
        //   last_position: {
        //     page_number: 12,
        //     chapter_id: null,
        //     section_id: null,
        //     updated_at: "2025-07-18T01:56:41.864035+00:00",
        //   },
        // };
        console.log("mockdata", minemockData);

        setStudyData(minemockData);
        setCurrentPage(minemockData.data.last_position.page_number);

        // Load chat history
        await loadChatHistory(minemockData.data.chat_session_id);
      } catch (error) {
        console.error("Failed to initialize study mode:", error);
        toast.error("Failed to load study materials");
      } finally {
        setIsLoading(false);
      }
    };

    initializeStudyMode();
  }, [minemockData]);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsTOCCollapsed(true);
        setRightPanelWidth(280);
      } else {
        // Adjust panel width based on PDF visibility and TOC
        if (isPDFHidden) {
          setRightPanelWidth(Math.min(800, window.innerWidth - 100)); // Take most of the screen when PDF is hidden
        } else {
          // New responsive default widths
          const screenWidth = window.innerWidth;
          if (hasTOC && !isTOCCollapsed) {
            // With TOC visible: 30-35% of screen for tool panel
            setRightPanelWidth(Math.max(320, Math.min(450, screenWidth * 0.32)));
          } else {
            // Without TOC or TOC collapsed: 45% of screen for tool panel
            setRightPanelWidth(Math.max(360, Math.min(600, screenWidth * 0.45)));
          }
        }
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [isTOCCollapsed, hasTOC, isPDFHidden]);

  // Panel resizing logic with proper constraints
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isResizing || !containerRef.current || isMobile) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;

      const newRightPanelWidth = containerWidth - mouseX - 4;
      const minWidth = 280;
      const maxWidth = isPDFHidden
        ? containerWidth - 100
        : containerWidth * 0.6;

      const clampedWidth = Math.max(
        minWidth,
        Math.min(maxWidth, newRightPanelWidth)
      );
      setRightPanelWidth(clampedWidth);
    },
    [isResizing, isMobile, isPDFHidden]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const updatePosition = async (page, sectionId, chapterId) => {
    if (!studyData) return;
    try {
      console.log("Position updated:", { page, sectionId, chapterId });
    } catch (error) {
      console.error("Failed to update position:", error);
    }
  };

  const handlePageChange = (page, sectionId, chapterId) => {
    setCurrentPage(page);
    updatePosition(page, sectionId, chapterId);
  };

  const handleTOCToggle = () => {
    setIsTOCCollapsed(!isTOCCollapsed);
  };

  const handleGoHome = () => {
    toast.info("Returning to AdaptiveLearnAI dashboard...");
    // navigate("/dashboard");
    // Add navigation logic here
  };

  const handleTogglePDF = () => {
    setIsPDFHidden(!isPDFHidden);
    toast.info(
      isPDFHidden ? "Document shown" : "Document hidden for focused studying"
    );
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle text highlighting from PDF or Tool Overlays
  const handleTextHighlight = useCallback((selectedText, context, toolType) => {
    setHighlightedText({ text: selectedText, context, toolType });

    // Send to ToolPanel for processing
    if (toolPanelRef.current) {
      if (toolType && toolType !== "ask") {
        // Direct tool generation for specific tools
        toolPanelRef.current.handleDirectToolGeneration(
          selectedText,
          context,
          toolType
        );
      } else {
        // Regular chat for "ask" tool or default behavior
        toolPanelRef.current.handleHighlightedText(
          selectedText,
          context,
          toolType
        );
      }
    }
  }, []);

  if (isLoading || !studyData) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-tr from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-32 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-16 left-1/4 w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-700"></div>

        {/* Loading Content */}
        <div className="relative z-10 text-center space-y-8 p-8 max-w-md">
          {/* Main Loading Animation */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto relative">
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-blue-500 to-purple-500 animate-spin border-t-transparent shadow-lg"></div>
              {/* Middle ring */}
              <div className="absolute inset-2 rounded-full border-2 border-gradient-to-r from-purple-500 to-pink-500 animate-spin reverse border-b-transparent"></div>
              {/* Inner ring */}
              <div className="absolute inset-4 rounded-full border border-gradient-to-r from-pink-500 to-orange-500 animate-pulse"></div>
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-8 h-8 text-blue-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Initializing AI Study Mode
            </h2>
            <div className="space-y-3">
              <p className="text-slate-300 text-lg">
                Preparing your learning environment...
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-slate-400">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Analyzing document structure</span>
              </div>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="space-y-4">
            <div className="flex justify-center space-x-6">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Document Analysis</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-200"></div>
                <span>AI Preparation</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-400"></div>
                <span>Chat Session</span>
              </div>
            </div>

            {/* Loading bar */}
            <div className="w-64 h-1 bg-slate-700 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
            </div>
          </div>

          {/* Features preview */}
          <div className="grid grid-cols-2 gap-4 mt-8 text-xs text-slate-500">
            <div className="text-center p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <Target className="w-4 h-4 mx-auto mb-1 text-blue-400" />
              <span>Smart Navigation</span>
            </div>
            <div className="text-center p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <Zap className="w-4 h-4 mx-auto mb-1 text-purple-400" />
              <span>AI Tools</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-500/5 to-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/3 to-blue-500/3 rounded-full blur-3xl"></div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-40 right-40 w-1 h-1 bg-purple-400 rounded-full animate-bounce opacity-40"></div>
      <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse delay-1000 opacity-50"></div>

      {/* Enhanced Header */}
      <header className="relative z-10 bg-slate-800/90 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl flex-shrink-0">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              {/* Home Button */}
              <Button
                variant="ghost"
                onClick={handleGoHome}
                className="group gap-2 px-4 py-2 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 border border-transparent hover:border-blue-500/30 transition-all duration-300 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                <span className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AdaptiveLearnAI
                </span>
              </Button>

              <div className="h-6 w-px bg-gradient-to-b from-blue-500/50 to-purple-500/50"></div>

              {/* Document Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-white truncate">
                      {studyData.data.document.title}
                    </h1>
                    <div className="flex items-center gap-4 mt-1">
                      {!isPDFHidden && (
                        <>
                          <p className="text-sm text-slate-400">
                            Page {currentPage} of {totalPages}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden shadow-inner">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 shadow-sm"
                                style={{
                                  width: `${Math.round(
                                    (currentPage / totalPages) * 100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-xs text-slate-500 font-medium">
                              {Math.round((currentPage / totalPages) * 100)}%
                            </span>
                          </div>
                        </>
                      )}
                      {isPDFHidden && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                          <Zap className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-purple-400 font-medium">
                            Focus Mode Active
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-2">
              {/* Fullscreen Toggle */}
              <Button
                variant="ghost"
                onClick={handleFullscreen}
                className="p-2 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all duration-200 rounded-lg"
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>

              {/* Enhanced Hide/Show Document Button */}
              <Button
                variant="outline"
                onClick={handleTogglePDF}
                className={`gap-2 px-4 py-2 border transition-all duration-300 rounded-xl shadow-lg ${
                  isPDFHidden
                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400 hover:from-green-500/30 hover:to-emerald-500/30 hover:shadow-green-500/25"
                    : "bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-400 hover:from-orange-500/30 hover:to-red-500/30 hover:shadow-orange-500/25"
                }`}
                title={
                  isPDFHidden
                    ? "Show document"
                    : "Hide document for focused studying"
                }
              >
                {isPDFHidden ? (
                  <>
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm font-medium">Show Book</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span className="text-sm font-medium">Focus Mode</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area with proper height calculations */}
      <div
        ref={containerRef}
        className="flex-1 flex overflow-hidden relative min-h-0"
      >
        {isMobile ? (
          <div className="flex flex-col w-full h-full">
            {/* Mobile TOC */}
            {hasTOC && !isPDFHidden && (
              <div className="flex-shrink-0 bg-slate-800/60 backdrop-blur-lg border-b border-slate-700/50 max-h-48">
                <div className="h-full overflow-y-auto study-scrollbar">
                  <TableOfContents
                    isCollapsed={isTOCCollapsed}
                    onToggleCollapse={handleTOCToggle}
                    currentPage={currentPage}
                    onPageSelect={handlePageChange}
                    tocData={studyData.data.toc}
                  />
                </div>
              </div>
            )}

            {/* Mobile PDF Viewer */}
            {!isPDFHidden && (
              <div className="flex-1 min-h-0 overflow-hidden bg-slate-900/50 rounded-t-2xl mt-1">
                <div className="h-full overflow-y-auto study-scrollbar">
                  <PDFViewer
                  setFinalizedPage={setFinalizedPage}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    documentId={studyData.data.document.id}
                    fileName={studyData.data.document.file_name}
                    onTextHighlight={handleTextHighlight}
                    type={type}
                    id={id}
                  />
                </div>
              </div>
            )}

            {/* Mobile Tool Panel */}
            <div
              className={`border-t border-slate-700/50 bg-slate-800/90 backdrop-blur-lg ${
                isPDFHidden ? "flex-1" : "max-h-96"
              } flex-shrink-0 overflow-hidden rounded-t-2xl mt-1`}
            >
              <div className="h-full overflow-y-auto study-scrollbar">
                <ToolPanel
                  ref={toolPanelRef}
                  chatSessionId={ChatSessionId}
                  documentId={studyData.data.document.id}
                  currentPage={FinalizedPage}
                  tocData={studyData.data.toc}
                  initialChatHistory={chatHistory}
                  onTextHighlight={handleTextHighlight}
                  type={type}
                  id={id}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Left Sidebar - Table of Contents */}
            {hasTOC && !isPDFHidden && (
              <div
                className="flex-shrink-0 bg-slate-800/60 backdrop-blur-lg border-r border-slate-700/50 overflow-hidden rounded-r-2xl shadow-2xl"
                style={{ width: `${tocWidth}px` }}
              >
                <div className="h-full overflow-y-auto study-scrollbar">
                  <TableOfContents

                    isCollapsed={isTOCCollapsed}
                    onToggleCollapse={handleTOCToggle}
                    currentPage={currentPage}
                    onPageSelect={handlePageChange}
                    tocData={studyData.data.toc}
                    type={type}
                    id={id}
                  />
                </div>
              </div>
            )}

            {/* Desktop Center - PDF Viewer */}
            {!isPDFHidden && (
              <div
                className="flex-1 min-w-0 overflow-hidden bg-slate-900/40 backdrop-blur-sm rounded-2xl mx-1 shadow-xl"
                style={{
                  width: `calc(100% - ${tocWidth}px - ${rightPanelWidth}px - 8px)`,
                }}
              >
                <div className="h-full overflow-y-auto study-scrollbar">
                  <PDFViewer
                  setFinalizedPage={setFinalizedPage}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    documentId={studyData.data.document.id}
                    fileName={studyData.data.document.file_name}
                    onTextHighlight={handleTextHighlight}
                    type={type}
                    id={id}
                  />
                </div>
              </div>
            )}

            {/* Enhanced Resize Handle */}
            {!isPDFHidden && (
              <div
                className={`w-2 relative group cursor-col-resize transition-all duration-300 ${
                  isResizing
                    ? "bg-gradient-to-b from-blue-500 to-purple-500 shadow-lg"
                    : "bg-slate-700/30 hover:bg-gradient-to-b hover:from-blue-500/60 hover:to-purple-500/60"
                }`}
                onMouseDown={handleMouseDown}
              >
                <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-1">
                  <div className="w-full h-full bg-current opacity-80 rounded-full"></div>
                </div>
                {/* Enhanced resize indicator */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-12 bg-slate-800/90 backdrop-blur-lg rounded-lg border border-slate-600/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center shadow-xl">
                  <div className="flex space-x-0.5">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                    <div className="w-0.5 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full animate-pulse delay-100"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Right Sidebar - Tool Panel */}
            <div
              className={`flex-shrink-0 bg-slate-800/60 backdrop-blur-lg overflow-hidden rounded-l-2xl shadow-2xl ${
                isPDFHidden ? "" : "border-l border-slate-700/50"
              }`}
              style={{
                width: isPDFHidden ? "100%" : `${rightPanelWidth}px`,
              }}
            >
              <div className="h-full overflow-y-auto study-scrollbar">
                <ToolPanel
                  ref={toolPanelRef}
                  chatSessionId={studyData.data.chat_session_id}
                  documentId={studyData.data.document.id}
                  currentPage={FinalizedPage}
                  tocData={studyData.data.toc}
                  initialChatHistory={chatHistory}
                  onTextHighlight={handleTextHighlight}
                   type={type}
                    id={id}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Enhanced Toast Container */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "rgba(30, 41, 59, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(100, 116, 139, 0.3)",
            color: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          },
        }}
      />

      {/* Global Styles */}
      <style jsx global>{`
        /* Custom Scrollbars for Study Mode */
        .study-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 116, 139, 0.5) rgba(30, 41, 59, 0.3);
        }

        .study-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .study-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.3);
          border-radius: 10px;
        }

        .study-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3b82f6, #8b5cf6);
          border-radius: 10px;
          border: 2px solid rgba(30, 41, 59, 0.3);
          transition: background 0.3s ease;
        }

        .study-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563eb, #7c3aed);
        }

        .study-scrollbar::-webkit-scrollbar-corner {
          background: rgba(30, 41, 59, 0.3);
        }

        /* Thin scrollbars for compact areas */
        .study-scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 116, 139, 0.4) rgba(30, 41, 59, 0.2);
        }

        .study-scrollbar-thin::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .study-scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.2);
          border-radius: 8px;
        }

        .study-scrollbar-thin::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #6366f1, #a855f7);
          border-radius: 8px;
          border: 1px solid rgba(30, 41, 59, 0.2);
        }

        .study-scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #4f46e5, #9333ea);
        }

        /* Enhanced animations */
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-15px) rotate(120deg);
          }
          66% {
            transform: translateY(8px) rotate(240deg);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 40px rgba(139, 92, 246, 0.8);
            transform: scale(1.05);
          }
        }

        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        /* Enhanced glassmorphism effects */
        .glass-panel {
          background: rgba(30, 41, 59, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(100, 116, 139, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        /* Enhanced button hover effects */
        .btn-gradient-hover {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-gradient-hover::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: left 0.5s ease;
        }

        .btn-gradient-hover:hover::before {
          left: 100%;
        }

        .btn-gradient-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        /* Enhanced focus states */
        .focus-ring {
          transition: all 0.2s ease;
        }

        .focus-ring:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5),
            0 8px 25px rgba(0, 0, 0, 0.3);
          transform: translateY(-1px);
        }

        /* Enhanced text selection */
        ::selection {
          background: rgba(59, 130, 246, 0.3);
          color: white;
        }

        ::-moz-selection {
          background: rgba(59, 130, 246, 0.3);
          color: white;
        }

        /* Smooth transitions for all elements */
        * {
          transition-property: color, background-color, border-color,
            text-decoration-color, fill, stroke, opacity, box-shadow, transform,
            filter, backdrop-filter;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }

        /* Height and overflow fixes */
        html,
        body {
          height: 100%;
          overflow: hidden;
        }

        #root {
          height: 100%;
        }

        /* Ensure proper scrolling behavior */
        .overflow-auto {
          overflow: auto;
        }

        .overflow-y-auto {
          overflow-y: auto;
        }

        .overflow-x-hidden {
          overflow-x: hidden;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .study-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }

          .glass-panel {
            backdrop-filter: blur(16px);
          }
        }

        @media (max-width: 480px) {
          .study-scrollbar::-webkit-scrollbar {
            width: 4px;
            height: 4px;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
