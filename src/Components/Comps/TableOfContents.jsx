import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  BookOpen,
  FileText,
  Hash,
} from "lucide-react";
import { Button } from "./button";
import { ScrollArea } from "./ui/scrollarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

const TOCItemComponent = ({ chapter, currentPage, onPageSelect }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Check if chapter has only one section with the same name as chapter
  const shouldShowSections =
    chapter.sections &&
    chapter.sections.length > 0 &&
    !(
      chapter.sections.length === 1 &&
      chapter.sections[0].title === chapter.title
    );

  const hasExpandableSections = shouldShowSections;

  // If chapter has no sections or only one section with same name, make chapter clickable
  const chapterPage =
    chapter.sections && chapter.sections.length > 0
      ? chapter.sections[0].page
      : null;

  const isCurrentChapter = chapterPage && currentPage === chapterPage;

  const handleChapterClick = () => {
    if (chapterPage) {
      onPageSelect(
        chapterPage,
        chapter.sections?.[0]?.section_id,
        chapter.chapter_id
      );
    }
  };

  const handleSectionClick = (section) => {
    onPageSelect(section.page, section.section_id, chapter.chapter_id);
  };

  const handleToggleExpand = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="mb-1">
        {/* Chapter Header */}
        <div
          className={`flex items-center justify-between py-2.5 px-3 rounded-lg transition-all duration-200 group ${
            !hasExpandableSections ? "cursor-pointer" : ""
          } ${
            isCurrentChapter && !hasExpandableSections
              ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30 shadow-lg"
              : "hover:bg-slate-700/50 text-slate-300 hover:text-white"
          }`}
          onClick={!hasExpandableSections ? handleChapterClick : undefined}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {hasExpandableSections ? (
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 w-4 h-4 hover:bg-transparent"
                  onClick={handleToggleExpand}
                >
                  {isOpen ? (
                    <ChevronDown className="w-3 h-3 text-blue-400" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                  )}
                </Button>
              </CollapsibleTrigger>
            ) : (
              <div className="w-4 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              </div>
            )}
            
            <BookOpen className="w-4 h-4 text-blue-400 flex-shrink-0" />
            
            <span className="text-sm font-medium break-words leading-tight whitespace-normal flex-1">
              {chapter.title}
            </span>
          </div>
          
          {chapterPage && !hasExpandableSections && (
            <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded-md font-mono">
              {chapterPage}
            </span>
          )}
        </div>

        {/* Sections */}
        {hasExpandableSections && (
          <CollapsibleContent>
            <div className="mt-1 ml-6 space-y-1">
              {chapter.sections?.map((section) => {
                const isCurrentSection = currentPage === section.page;
                return (
                  <div
                    key={section.section_id}
                    className={`flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                      isCurrentSection
                        ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30 shadow-md"
                        : "hover:bg-slate-700/30 text-slate-400 hover:text-slate-200"
                    }`}
                    onClick={() => handleSectionClick(section)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-4 flex items-center justify-center">
                        <Hash className="w-3 h-3 text-purple-400 opacity-60" />
                      </div>
                      
                      <FileText className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 opacity-80" />
                      
                      <span className="text-sm break-words leading-tight whitespace-normal flex-1">
                        {section.title}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 bg-slate-800/30 px-2 py-0.5 rounded font-mono">
                        {section.page}
                      </span>
                      
                      {isCurrentSection && (
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        )}
      </div>
    </Collapsible>
  );
};

export const TableOfContents = ({
  isCollapsed,
  onToggleCollapse,
  currentPage,
  onPageSelect,
  tocData,
}) => {
  if (isCollapsed) {
    return (
      <div className="w-12 h-full bg-slate-800/80 backdrop-blur-lg border-r border-slate-700/50 p-2 flex flex-col">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="w-full h-10 mb-4 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
          title="Open Table of Contents"
        >
          <PanelLeftOpen className="w-4 h-4 text-slate-400" />
        </Button>
        
        {/* Collapsed indicators */}
        <div className="flex-1 flex flex-col items-center gap-2">
          {tocData.chapters.slice(0, 5).map((chapter, index) => (
            <div
              key={chapter.chapter_id}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                chapter.sections?.some(section => section.page === currentPage)
                  ? "bg-blue-400 shadow-lg shadow-blue-400/50"
                  : "bg-slate-600"
              }`}
            />
          ))}
          {tocData.chapters.length > 5 && (
            <div className="w-1 h-1 bg-slate-500 rounded-full opacity-50"></div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-slate-800/80 backdrop-blur-lg border-r border-slate-700/50 flex flex-col min-w-0">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-white">Contents</h3>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
            title="Collapse Table of Contents"
          >
            <PanelLeftClose className="w-4 h-4 text-slate-400" />
          </Button>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Reading Progress</span>
            <span>{Math.round((currentPage / Math.max(...tocData.chapters.flatMap(ch => ch.sections?.map(s => s.page) || [1]))) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ 
                width: `${Math.round((currentPage / Math.max(...tocData.chapters.flatMap(ch => ch.sections?.map(s => s.page) || [1]))) * 100)}%` 
              }}
            />
          </div>
        </div>
      </div>

      {/* Content with custom scrollbar */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {tocData.chapters.map((chapter) => (
            <TOCItemComponent
              key={chapter.chapter_id}
              chapter={chapter}
              currentPage={currentPage}
              onPageSelect={onPageSelect}
            />
          ))}
        </div>
      </ScrollArea>
      
      {/* Footer stats */}
      <div className="p-3 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-700/30">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-center">
            <div className="text-blue-400 font-semibold">{tocData.chapters.length}</div>
            <div className="text-slate-500">Chapters</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400 font-semibold">
              {tocData.chapters.reduce((acc, ch) => acc + (ch.sections?.length || 0), 0)}
            </div>
            <div className="text-slate-500">Sections</div>
          </div>
        </div>
      </div>
    </div>
  );
};