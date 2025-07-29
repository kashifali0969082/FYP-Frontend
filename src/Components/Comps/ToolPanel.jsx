import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ChatbotApi, listModels } from "../../Api/Apifun";
import { toast } from "sonner";
import axios from "axios";
import mermaid from "mermaid";
import {
  Send,
  Mic,
  Brain,
  Network,
  HelpCircle,
  ChevronDown,
  Loader2,
  MicOff,
  ExternalLink,
  Copy,
  Check,
  Gamepad2,
  Quote,
  X,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Zap,
  BookOpen,
  Target,
  Trophy,
} from "lucide-react";
import { Button } from "./button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ToolOverlay } from "./ui/tooloverlay";

// Tool Panel Overlay Component
const ToolPanelOverlay = ({ toolType, content, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            {toolType === 'flashcard' && <Brain className="w-5 h-5 text-purple-500" />}
            {toolType === 'quiz' && <HelpCircle className="w-5 h-5 text-green-500" />}
            {toolType === 'diagram' && <Network className="w-5 h-5 text-cyan-500" />}
            {toolType === 'game' && <Gamepad2 className="w-5 h-5 text-orange-500" />}
            <h2 className="text-lg font-semibold">
              {getToolDisplayName(toolType)}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-none">
            {(!content || (Array.isArray(content) && content.length === 0)) ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">
                  {toolType === 'flashcard' && <Brain className="w-16 h-16 mx-auto mb-4 text-purple-500/50" />}
                  {toolType === 'quiz' && <HelpCircle className="w-16 h-16 mx-auto mb-4 text-green-500/50" />}
                  {toolType === 'diagram' && <Network className="w-16 h-16 mx-auto mb-4 text-cyan-500/50" />}
                  {toolType === 'game' && <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-orange-500/50" />}
                  <p className="text-lg font-medium mb-2">No content available</p>
                  <p className="text-sm">The {getToolDisplayName(toolType).toLowerCase()} content is not ready yet.</p>
                </div>
              </div>
            ) : (
              <>
                {toolType === 'flashcard' && Array.isArray(content) && (
                  <FlashcardRenderer flashcards={content} />
                )}
                {toolType === 'quiz' && Array.isArray(content) && (
                  <QuizRenderer questions={content} />
                )}
                {toolType === 'diagram' && Array.isArray(content) && (
                  <DiagramRenderer diagrams={content} />
                )}
                {toolType === 'game' && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                      <h3 className="text-lg font-bold mb-2">Learning Game</h3>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <pre className="text-sm whitespace-pre-wrap font-mono">
                        {Array.isArray(content) ? content.join('\n\n') : content}
                      </pre>
                    </div>
                  </div>
                )}
                {/* Fallback for other content */}
                {!['flashcard', 'quiz', 'diagram', 'game'].includes(toolType) && (
                  <div className="bg-muted rounded-lg p-4">
                    <pre className="text-sm whitespace-pre-wrap font-mono">
                      {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
                    </pre>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Flashcard Component
const FlashcardRenderer = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedCards, setCompletedCards] = useState(new Set());

  const currentCard = flashcards[currentIndex];
  const totalCards = flashcards.length;

  const nextCard = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const markCompleted = () => {
    setCompletedCards(prev => new Set([...prev, currentCard.id]));
    if (currentIndex < totalCards - 1) {
      nextCard();
    }
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 1) return "text-green-500 bg-green-500/10";
    if (difficulty <= 2) return "text-yellow-500 bg-yellow-500/10";
    return "text-red-500 bg-red-500/10";
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-sm">Flashcards</h3>
          <Badge variant="outline" className="text-xs">
            {currentIndex + 1} of {totalCards}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          {completedCards.size}/{totalCards} completed
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-1.5">
        <div
          className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
        />
      </div>

      {/* Flashcard */}
      <div className="relative h-48">
        <div
          className={`absolute inset-0 w-full h-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front Side - Question */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-purple-100 dark:bg-purple-900 border-2 border-purple-300 dark:border-purple-700 rounded-lg p-4 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-3">
              <Badge className={`text-xs px-2 py-1 ${getDifficultyColor(currentCard.difficulty)}`}>
                Level {currentCard.difficulty}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {currentCard.topic}
              </Badge>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-center mb-3 text-purple-900 dark:text-purple-100">
                {currentCard.question}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                Click to reveal answer
              </p>
            </div>
          </div>

          {/* Back Side - Answer */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-green-100 dark:bg-green-900 border-2 border-green-300 dark:border-green-700 rounded-lg p-4 flex flex-col justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-xs font-medium text-green-700 dark:text-green-300">
                  Answer
                </span>
              </div>
              <p className="text-sm text-center text-green-900 dark:text-green-100">
                {currentCard.answer}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={prevCard}
          disabled={currentIndex === 0}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="w-3 h-3" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-1"
          >
            {isFlipped ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {isFlipped ? "Hide" : "Reveal"}
          </Button>

          {isFlipped && !completedCards.has(currentCard.id) && (
            <Button
              variant="default"
              size="sm"
              onClick={markCompleted}
              className="flex items-center gap-1 bg-green-500 hover:bg-green-600"
            >
              <Check className="w-3 h-3" />
              Got it!
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={nextCard}
          disabled={currentIndex === totalCards - 1}
          className="flex items-center gap-1"
        >
          Next
          <ArrowRight className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

// Quiz Component
const QuizRenderer = ({ questions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(new Set());

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isCurrentSubmitted = submitted.has(currentQuestion.id);

  const handleAnswerSelect = (questionId, answer) => {
    if (!isCurrentSubmitted) {
      setAnswers(prev => ({ ...prev, [questionId]: answer }));
    }
  };

  const submitAnswer = () => {
    if (answers[currentQuestion.id]) {
      setSubmitted(prev => new Set([...prev, currentQuestion.id]));
    }
  };

  const nextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getScore = () => {
    return questions.filter(q => {
      const userAnswer = answers[q.id];
      const correctAnswer = q.correct_answer;
      
      if (q.question_type === 'short_answer') {
        // Case-insensitive comparison for short answers
        return userAnswer?.toLowerCase().trim() === correctAnswer?.toLowerCase().trim();
      } else {
        // Exact match for multiple choice
        return userAnswer === correctAnswer;
      }
    }).length;
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 1) return "text-green-500 bg-green-500/10";
    if (difficulty <= 2) return "text-yellow-500 bg-yellow-500/10";
    return "text-red-500 bg-red-500/10";
  };

  if (showResults) {
    const score = getScore();
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <div className="space-y-4">
        <div className="text-center py-6">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-lg font-bold mb-2">Quiz Complete!</h3>
          <div className="text-2xl font-bold text-primary mb-2">
            {score}/{totalQuestions}
          </div>
          <div className="text-sm text-muted-foreground">
            {percentage}% correct
          </div>
        </div>

        <div className="space-y-2">
          {questions.map((question, index) => {
            const userAnswer = answers[question.id];
            const correctAnswer = question.correct_answer;
            
            // Check if answer is correct based on question type
            const isCorrect = question.question_type === 'short_answer'
              ? userAnswer?.toLowerCase().trim() === correctAnswer?.toLowerCase().trim()
              : userAnswer === correctAnswer;
            
            return (
              <Card key={question.id} className="p-3">
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {isCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium mb-1">{question.question}</p>
                    <div className="text-xs space-y-1">
                      <div className={isCorrect ? "text-green-600" : "text-red-600"}>
                        Your answer: {userAnswer || "Not answered"}
                      </div>
                      {!isCorrect && (
                        <div className="text-green-600">
                          Correct answer: {question.correct_answer}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Button
          variant="outline"
          onClick={() => {
            setCurrentIndex(0);
            setAnswers({});
            setShowResults(false);
            setSubmitted(new Set());
          }}
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Retake Quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold text-sm">Quiz</h3>
          <Badge variant="outline" className="text-xs">
            {currentIndex + 1} of {totalQuestions}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          {submitted.size}/{totalQuestions} answered
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted rounded-full h-1.5">
        <div
          className="bg-gradient-to-r from-green-500 to-blue-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question */}
      <Card className="p-4">
        <div className="space-y-4">
          {/* Question Header */}
          <div className="flex items-center justify-between">
            <Badge className={`text-xs px-2 py-1 ${getDifficultyColor(currentQuestion.difficulty)}`}>
              Level {currentQuestion.difficulty}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {currentQuestion.topic}
            </Badge>
          </div>

          {/* Question Text */}
          <h4 className="font-medium text-sm leading-relaxed">
            {currentQuestion.question}
          </h4>

          {/* Answer Input - Multiple Choice or Short Answer */}
          <div className="space-y-2">
            {currentQuestion.question_type === 'short_answer' ? (
              /* Short Answer Input */
              <div className="space-y-2">
                <Input
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                  placeholder="Type your answer here..."
                  disabled={isCurrentSubmitted}
                  className="w-full"
                />
                {isCurrentSubmitted && (
                  <div className="space-y-1">
                    <div className={`text-xs p-2 rounded ${
                      answers[currentQuestion.id]?.toLowerCase().trim() === currentQuestion.correct_answer?.toLowerCase().trim()
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                      Your answer: {answers[currentQuestion.id] || "Not answered"}
                    </div>
                    {answers[currentQuestion.id]?.toLowerCase().trim() !== currentQuestion.correct_answer?.toLowerCase().trim() && (
                      <div className="text-xs p-2 rounded bg-green-50 text-green-700 border border-green-200">
                        Correct answer: {currentQuestion.correct_answer}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Multiple Choice Options */
              currentQuestion.options?.map((option, index) => {
                const isSelected = answers[currentQuestion.id] === option;
                const isCorrect = option === currentQuestion.correct_answer;
                const showCorrect = isCurrentSubmitted && isCorrect;
                const showIncorrect = isCurrentSubmitted && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                    disabled={isCurrentSubmitted}
                    className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                      showCorrect
                        ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/50 dark:border-green-800"
                        : showIncorrect
                        ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/50 dark:border-red-800"
                        : isSelected
                        ? "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/50 dark:border-blue-800"
                        : "bg-muted border-border hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                        showCorrect
                          ? "bg-green-500 border-green-500 text-white"
                          : showIncorrect
                          ? "bg-red-500 border-red-500 text-white"
                          : isSelected
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "border-muted-foreground"
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1">{option}</span>
                      {showCorrect && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {showIncorrect && <XCircle className="w-4 h-4 text-red-500" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Explanation */}
          {isCurrentSubmitted && currentQuestion.explanation && (
            <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Brain className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">Explanation</p>
                  <p className="text-blue-700 dark:text-blue-300">{currentQuestion.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={prevQuestion}
          disabled={currentIndex === 0}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="w-3 h-3" />
          Previous
        </Button>

        <div className="flex gap-2">
          {!isCurrentSubmitted && answers[currentQuestion.id] && (
            <Button
              variant="default"
              size="sm"
              onClick={submitAnswer}
              className="flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              Submit
            </Button>
          )}

          {isCurrentSubmitted && (
            <Button
              variant="default"
              size="sm"
              onClick={nextQuestion}
              className="flex items-center gap-1"
            >
              {currentIndex === totalQuestions - 1 ? (
                <>
                  <Trophy className="w-3 h-3" />
                  Results
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-3 h-3" />
                </>
              )}
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          {currentIndex === totalQuestions - 1 && submitted.size === totalQuestions
            ? "Ready for results"
            : `${totalQuestions - currentIndex - 1} remaining`
          }
        </div>
      </div>
    </div>
  );
};

// Diagram Component
const DiagramRenderer = ({ diagrams }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [renderError, setRenderError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const diagramRef = useRef(null);
  const containerRef = useRef(null);
  
  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Reset zoom when diagram changes
  useEffect(() => {
    setZoomLevel(1);
  }, [currentIndex]);

  // Check if content is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (containerRef.current) {
        const { scrollWidth, scrollHeight, clientWidth, clientHeight } = containerRef.current;
        const isScrollable = scrollWidth > clientWidth || scrollHeight > clientHeight;
        setShowScrollHint(isScrollable);
      }
    };

    const timer = setTimeout(checkScrollable, 500);
    return () => clearTimeout(timer);
  }, [currentIndex, zoomLevel]);

  // Initialize Mermaid only on client side
  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;
    
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        maxWidth: null,
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
          padding: 20
        },
        sequence: {
          useMaxWidth: false,
          padding: 20
        },
        journey: {
          useMaxWidth: false,
          padding: 20
        },
        gantt: {
          useMaxWidth: false,
          padding: 20
        },
        graph: {
          useMaxWidth: false,
          padding: 20
        },
        themeCSS: `
          .node rect { fill: #f9f9f9; stroke: #333; stroke-width: 2px; }
          .node text { fill: #333; }
          .edgePath .path { stroke: #333; stroke-width: 2px; }
          .edgeLabel { background-color: #e8e8e8; }
        `
      });
    } catch (error) {
      console.error('Mermaid initialization error:', error);
      setRenderError('Failed to initialize diagram renderer');
    }
  }, [isClient]);

  // Render diagram when content changes
  useEffect(() => {
    if (!isClient || !diagramRef.current || !diagrams || !diagrams[currentIndex] || typeof window === 'undefined') {
      return;
    }

    const diagramDefinition = diagrams[currentIndex];
    const diagramId = `diagram-${currentIndex}-${Date.now()}`;
    
    // Clear previous content
    diagramRef.current.innerHTML = '';
    setRenderError(null);
    
    // Add a small delay to ensure DOM is ready
    const renderTimeout = setTimeout(() => {
      try {
        mermaid.render(diagramId, diagramDefinition)
          .then((result) => {
            if (diagramRef.current && result.svg) {
              diagramRef.current.innerHTML = result.svg;
              
              // Ensure the SVG is properly sized and visible
              const svg = diagramRef.current.querySelector('svg');
              if (svg) {
                svg.style.maxWidth = 'none';
                svg.style.width = 'auto';
                svg.style.height = 'auto';
                svg.style.display = 'block';
                
                // Force a reflow to ensure proper sizing
                setTimeout(() => {
                  if (containerRef.current) {
                    const { scrollWidth, scrollHeight, clientWidth, clientHeight } = containerRef.current;
                    const isScrollable = scrollWidth > clientWidth || scrollHeight > clientHeight;
                    setShowScrollHint(isScrollable);
                  }
                }, 100);
              }
            }
          })
          .catch((error) => {
            console.error('Mermaid rendering error:', error);
            setRenderError('Failed to render diagram');
            // Fallback to text display
            if (diagramRef.current) {
              diagramRef.current.innerHTML = `<pre class="text-xs font-mono whitespace-pre-wrap text-gray-800 dark:text-gray-200 p-4 bg-gray-100 dark:bg-gray-800 rounded">${diagramDefinition}</pre>`;
            }
          });
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        setRenderError('Failed to render diagram');
        // Fallback to text display
        if (diagramRef.current) {
          diagramRef.current.innerHTML = `<pre class="text-xs font-mono whitespace-pre-wrap text-gray-800 dark:text-gray-200 p-4 bg-gray-100 dark:bg-gray-800 rounded">${diagramDefinition}</pre>`;
        }
      }
    }, 200);

    return () => clearTimeout(renderTimeout);
  }, [currentIndex, diagrams, isClient]);
  
  if (!Array.isArray(diagrams) || diagrams.length === 0) {
    return (
      <div className="text-center py-6">
        <Network className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No diagrams available</p>
      </div>
    );
  }

  // Show loading state while client-side hydration happens
  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-500" />
            <h3 className="font-semibold text-sm">Diagrams</h3>
            {diagrams.length > 1 && (
              <Badge variant="outline" className="text-xs">
                {currentIndex + 1} of {diagrams.length}
              </Badge>
            )}
          </div>
        </div>
        <Card className="p-4">
          <div className="bg-white dark:bg-muted rounded-lg p-4 overflow-x-auto">
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-cyan-500" />
          <h3 className="font-semibold text-sm">Diagrams</h3>
          {diagrams.length > 1 && (
            <Badge variant="outline" className="text-xs">
              {currentIndex + 1} of {diagrams.length}
            </Badge>
          )}
        </div>
        
        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
            className="h-6 w-6 p-0 text-xs"
            title="Zoom Out"
          >
            -
          </Button>
          <span className="text-xs text-muted-foreground min-w-[3rem] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.1))}
            className="h-6 w-6 p-0 text-xs"
            title="Zoom In"
          >
            +
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoomLevel(1)}
            className="h-6 px-2 text-xs"
            title="Reset Zoom"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {renderError && (
        <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700 dark:text-red-300">{renderError}</span>
          </div>
        </div>
      )}

      {/* Diagram Display */}
      <Card className="p-0 relative">
        <div 
          ref={containerRef}
          className="diagram-container"
        >
          <div 
            ref={diagramRef}
            className="mermaid-diagram"
            style={{ 
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center top',
              transition: 'transform 0.2s ease'
            }}
          />
        </div>
        
        {/* Scroll Hint */}
        {showScrollHint && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-70 pointer-events-none z-10">
            Scroll to explore
          </div>
        )}
      </Card>

      {/* Navigation for multiple diagrams */}
      {diagrams.length > 1 && (
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            Previous
          </Button>

          <div className="flex gap-1">
            {diagrams.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? "bg-cyan-500" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIndex(Math.min(diagrams.length - 1, currentIndex + 1))}
            disabled={currentIndex === diagrams.length - 1}
            className="flex items-center gap-1"
          >
            Next
            <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
};
// Add CSS for 3D flip animation and Mermaid diagrams
const FlipCardStyles = () => (
  <style>{`
    .transform-style-preserve-3d {
      transform-style: preserve-3d;
    }
    .backface-hidden {
      backface-visibility: hidden;
    }
    .rotate-y-180 {
      transform: rotateY(180deg);
    }
    
    /* Mermaid diagram styles */
    .mermaid-diagram {
      display: block;
      width: auto;
      height: auto;
      min-height: 200px;
      min-width: fit-content;
      overflow: visible;
      transform-origin: center top;
      position: relative;
      background: transparent;
    }
    
    .mermaid-diagram svg {
      max-width: none !important;
      width: auto !important;
      height: auto !important;
      display: block;
      margin: 0 auto;
    }
    
    .mermaid-diagram .node rect,
    .mermaid-diagram .node circle,
    .mermaid-diagram .node ellipse,
    .mermaid-diagram .node polygon {
      fill: #f9f9f9;
      stroke: #333;
      stroke-width: 1.5px;
    }
    
    .mermaid-diagram .edgePath .path {
      stroke: #333;
      stroke-width: 1.5px;
      fill: none;
    }
    
    .mermaid-diagram .edgeLabel {
      background-color: #e8e8e8;
      text-align: center;
    }
    
    .mermaid-diagram .cluster rect {
      fill: #ffffde;
      stroke: #aaaa33;
      stroke-width: 1px;
    }
    
    .mermaid-diagram .labelText {
      fill: #333;
      text-anchor: middle;
      font-family: 'trebuchet ms', verdana, arial, sans-serif;
      font-size: 14px;
    }
    
    /* Container scrolling */
    .diagram-container {
      overflow: auto;
      max-height: 70vh;
      width: 100%;
      min-width: 0;
      min-height: 200px;
      scrollbar-width: thin;
      scrollbar-color: #888 #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      position: relative;
      background: #fff;
      display: block;
      box-sizing: border-box;
      scroll-behavior: smooth;
    }
    
    .dark .diagram-container {
      background: #1a1a1a;
      border-color: rgba(255, 255, 255, 0.1);
    }
    
    .diagram-container::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }
    
    .diagram-container::-webkit-scrollbar-track {
      background: #f8f9fa;
      border-radius: 6px;
      margin: 2px;
    }
    
    .diagram-container::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #aaa, #888);
      border-radius: 6px;
      border: 2px solid #f8f9fa;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .diagram-container::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #888, #666);
    }
    
    .diagram-container::-webkit-scrollbar-thumb:active {
      background: linear-gradient(180deg, #666, #444);
    }
    
    .diagram-container::-webkit-scrollbar-corner {
      background: #f8f9fa;
      border-radius: 6px;
    }
    
    /* Dark mode scrollbar */
    .dark .diagram-container::-webkit-scrollbar-track {
      background: #2a2a2a;
    }
    
    .dark .diagram-container::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #555, #333);
      border-color: #2a2a2a;
    }
    
    .dark .diagram-container::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #666, #444);
    }
    
    .dark .diagram-container::-webkit-scrollbar-corner {
      background: #2a2a2a;
    }
    
    /* Ensure proper scaling for different screen sizes */
    @media (max-width: 768px) {
      .mermaid-diagram svg {
        max-width: none !important;
      }
      
      .diagram-container {
        max-height: 60vh;
      }
    }
  `}</style>
);

// const availableModels = [
//   { id: 'd50a33ce-2462-4a5a-9aa7-efc2d1749745', name: 'GPT-4', provider: 'OpenAI' },
//   { id: 'claude-3-opus', name: 'Claude', provider: 'Anthropic' },
//   { id: 'gemini-pro', name: 'Gemini', provider: 'Google' },
// ];

const availableTools = [
  {
    id: "flashcard",
    name: "Flashcards",
    icon: <Brain className="w-4 h-4" />,
    description: "Generate flashcards",
    color:
      "text-purple-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950",
  },
  {
    id: "quiz",
    name: "Quiz",
    icon: <HelpCircle className="w-4 h-4" />,
    description: "Create quiz questions",
    color:
      "text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950",
  },
  {
    id: "diagram",
    name: "Diagrams",
    icon: <Network className="w-4 h-4" />,
    description: "Generate diagrams",
    color:
      "text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950",
  },
  {
    id: "game",
    name: "Games",
    icon: <Gamepad2 className="w-4 h-4" />,
    description: "Create learning games",
    color:
      "text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950",
  },
];

// Get tool-specific button text
const getToolButtonText = (toolType) => {
  const type = toolType.toLowerCase();
  if (type.includes("flashcard")) return "Open Flashcards";
  if (type.includes("quiz")) return "Open Quiz";
  if (type.includes("diagram")) return "Open Diagrams";
  if (type.includes("game")) return "Open Game";
  return "Open Tool";
};

// Get tool name for display
const getToolDisplayName = (toolType) => {
  const type = toolType.toLowerCase();
  if (type.includes("flashcard")) return "Flashcards";
  if (type.includes("quiz")) return "Quiz";
  if (type.includes("diagram")) return "Diagrams";
  if (type.includes("game")) return "Games";
  return toolType;
};

// Message Component with Copy Button
const MessageComponent = ({
  message,
  selectedModelInfo,
  onOpenToolMessage,
  onLoadToolResponse,
}) => {
  const [copiedStates, setCopiedStates] = useState({});
  const [isLoadingTool, setIsLoadingTool] = useState(false);
  const handleCopy = async (content, messageId) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedStates((prev) => ({ ...prev, [messageId]: true }));

      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [messageId]: false }));
      }, 2000);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  const handleOpenTool = async () => {
    if (!message.toolResponse) return;

    // If we have the content already, open it directly
    if (
      message.toolResponse.content &&
      (Array.isArray(message.toolResponse.content)
        ? message.toolResponse.content.length > 0
        : message.toolResponse.content.length > 0)
    ) {
      onOpenToolMessage(message.toolResponse);
      return;
    }

    // If we have a tool response ID but no content, fetch it
    if (message.toolResponse.toolResponseId) {
      setIsLoadingTool(true);
      try {
        await onLoadToolResponse(
          message.toolResponse.toolResponseId,
          message.toolResponse.type
        );
      } catch (error) {
        console.error("Failed to load tool response:", error);
      } finally {
        setIsLoadingTool(false);
      }
    } else {
      // Fallback: Open with empty content to show loading state or placeholder
      onOpenToolMessage({
        type: message.toolResponse.type,
        content: [],
        toolResponseId: null
      });
    }
  };

  return (
    <div
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-[85%] rounded-xl p-3 shadow-sm border ${
          message.sender === "user"
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-500/20"
            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
        }`}
      >
        {/* Highlighted text context */}
        {message.highlightedText && (
          <div
            className={`mb-3 p-3 rounded-lg border-l-4 ${
              message.sender === "user"
                ? "bg-white/10 border-l-white/30 backdrop-blur-sm"
                : "bg-blue-50 dark:bg-blue-950/30 border-l-blue-400 dark:border-l-blue-500"
            }`}
          >
            <div className="flex items-start gap-2">
              <Quote className="w-4 h-4 mt-0.5 opacity-70 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium mb-1 ${
                  message.sender === "user" ? "text-white/90" : "text-blue-700 dark:text-blue-300"
                }`}>
                  Selected from document:
                </p>
                <p className={`text-xs italic leading-relaxed ${
                  message.sender === "user" ? "text-white/80" : "text-gray-600 dark:text-gray-400"
                }`}>
                  "{message.highlightedText.text}"
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-start justify-between gap-3">
          <div className="text-sm whitespace-pre-wrap flex-1 leading-relaxed">
            {message.content}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(message.content, message.id)}
            className={`h-6 w-6 p-0 flex-shrink-0 rounded-md transition-all ${
              message.sender === "user"
                ? "hover:bg-white/20 text-white/70 hover:text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {copiedStates[message.id] ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>

        {message.toolResponse && (
          <div className="mt-4 space-y-3">
            {/* Tool response buttons */}
            <div className="flex gap-2 flex-wrap">
              {message.toolResponse.type === 'flashcard' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenTool}
                  disabled={isLoadingTool}
                  className={`text-xs gap-2 h-8 px-3 rounded-lg border-2 transition-all ${
                    message.sender === "user" 
                      ? "border-white/30 text-white hover:bg-white/10 hover:border-white/50" 
                      : "border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-950/30"
                  }`}
                >
                  {isLoadingTool ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Brain className="w-3.5 h-3.5" />
                  )}
                  Open Flashcards
                </Button>
              )}
              {message.toolResponse.type === 'quiz' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenTool}
                  disabled={isLoadingTool}
                  className={`text-xs gap-2 h-8 px-3 rounded-lg border-2 transition-all ${
                    message.sender === "user" 
                      ? "border-white/30 text-white hover:bg-white/10 hover:border-white/50" 
                      : "border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-950/30"
                  }`}
                >
                  {isLoadingTool ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <HelpCircle className="w-3.5 h-3.5" />
                  )}
                  Open Quiz
                </Button>
              )}
              {message.toolResponse.type === 'diagram' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenTool}
                  disabled={isLoadingTool}
                  className={`text-xs gap-2 h-8 px-3 rounded-lg border-2 transition-all ${
                    message.sender === "user" 
                      ? "border-white/30 text-white hover:bg-white/10 hover:border-white/50" 
                      : "border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300 dark:border-cyan-700 dark:text-cyan-300 dark:hover:bg-cyan-950/30"
                  }`}
                >
                  {isLoadingTool ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Network className="w-3.5 h-3.5" />
                  )}
                  Open Diagram
                </Button>
              )}
              {message.toolResponse.type === 'game' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenTool}
                  disabled={isLoadingTool}
                  className={`text-xs gap-2 h-8 px-3 rounded-lg border-2 transition-all ${
                    message.sender === "user" 
                      ? "border-white/30 text-white hover:bg-white/10 hover:border-white/50" 
                      : "border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-950/30"
                  }`}
                >
                  {isLoadingTool ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Gamepad2 className="w-3.5 h-3.5" />
                  )}
                  Open Game
                </Button>
              )}
            </div>
            
            {/* Tool info badge */}
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={`text-xs font-medium ${
                  message.sender === "user" 
                    ? "bg-white/20 text-white border-white/30" 
                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {getToolDisplayName(message.toolResponse.type)} Generated
              </Badge>
              {message.toolResponse.content && Array.isArray(message.toolResponse.content) && (
                <span className={`text-xs ${
                  message.sender === "user" ? "text-white/70" : "text-gray-500 dark:text-gray-400"
                }`}>
                  {message.toolResponse.content.length} items
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10 dark:border-gray-700/50">
          <span className={`text-xs ${
            message.sender === "user" ? "text-white/60" : "text-gray-500 dark:text-gray-400"
          }`}>
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {message.sender === "ai" && message.model && selectedModelInfo && (
            <Badge 
              variant="secondary" 
              className={`text-xs h-5 px-2 ${
                message.sender === "user" 
                  ? "bg-white/20 text-white border-white/30" 
                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {selectedModelInfo.name}
            </Badge>
          )}
        </div>
        {message.toolUsed && (
          <Badge 
            variant="outline" 
            className={`text-xs mt-2 h-5 ${
              message.sender === "user" 
                ? "border-white/30 text-white" 
                : "border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400"
            }`}
          >
            📊 {message.toolUsed}
          </Badge>
        )}
      </div>
    </div>
  );
};

export const ToolPanel = forwardRef(
  (
    {
      chatSessionId,
      documentId,
      currentPage,
      tocData,
      initialChatHistory,
      onTextHighlight,
      id,
      type
      
    },
    ref
  ) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [toolResponse, setToolResponse] = useState(null);
    const [contextText, setContextText] = useState(null);
    const [availableModels, setavailableModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState(
      availableModels[0]?.id || null
    );
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const recordingTimerRef = useRef(null);
    const [activeOverlay, setActiveOverlay] = useState(null);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    console.log("dknadnfl", selectedModel,type,id,currentPage);

    useEffect(() => {
      getModelsName();
    }, []);
    const getModelsName = async () => {
      try {
        let resp = await listModels();
        console.log("response is ", resp.data);

        const models = resp.data.map((m) => ({
          id: m.id,
          name: m.display_name,
          provider: m.model_name,
        }));

        setavailableModels(models);

        // set selected model only after data is fetched
        if (models.length > 0) {
          setSelectedModel(models[0].id);
        }
      } catch (error) {
        console.log("error while getting all models");
      }
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      handleHighlightedText: (text, context, toolType) => {
        setContextText({ text, context });
        setInputValue(`Please explain: "${text}"`);
      },
      handleDirectToolGeneration: (text, context, toolType) => {
        // Generate tool content directly and show in chat (no auto-opening overlay)
        const toolName = getToolDisplayName(toolType);
        const toolMessage = `Generate ${toolName.toLowerCase()} from the selected text: "${text}"`;
        handleSendMessage(toolMessage, true, { text, context });
      },
    }));

    // Handle text highlighting from tool overlays
    const handleToolTextHighlight = (selectedText, context) => {
      // Set the context and input for the chat
      setContextText({ text: selectedText, context });
      setInputValue(`Please explain: "${selectedText}"`);
    };

    // Load tool response from API
    const loadToolResponse = async (toolResponseId, toolType) => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch(`/api/tool-responses/${toolResponseId}`);
        const toolResponse = await response.json();

        // Update the message with the loaded tool response
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.toolResponse?.toolResponseId === toolResponseId) {
              return {
                ...msg,
                toolResponse: {
                  ...msg.toolResponse,
                  content: toolResponse.response || [],
                },
              };
            }
            return msg;
          })
        );

        // Open the tool overlay with the loaded content
        setActiveOverlay({
          type: toolType,
          content: toolResponse.response || [],
          toolResponseId,
        });
      } catch (error) {
        console.error("Failed to load tool response:", error);
        throw error;
      }
    };

    // Initialize messages from chat history
    useEffect(() => {
      const convertMessagesFromHistory = async () => {
        if (initialChatHistory && initialChatHistory.messages.length > 0) {
          const convertedMessages = await Promise.all(
            initialChatHistory.messages.map(async (msg) => {
              let toolResponse = undefined;

              if (msg.tool_response_id && msg.tool_type) {
                toolResponse = {
                  type: msg.tool_type,
                  content: msg.tool_response || [], // Use tool_response if available, otherwise load on demand
                  toolResponseId: msg.tool_response_id,
                };
              }

              return {
                id: msg.id,
                content: msg.content,
                sender: msg.role === "user" ? "user" : "ai",
                timestamp: new Date(msg.created_at),
                model: msg.model_id || undefined,
                toolUsed: msg.tool_type || undefined,
                toolResponse,
              };
            })
          );
          setMessages(convertedMessages);
        } else {
          // Start with empty chat
          setMessages([]);
        }
      };

      convertMessagesFromHistory();
    }, [initialChatHistory]);

    // Auto-scroll to bottom when new messages are added
    const scrollToBottom = () => {
      if (messagesEndRef.current && chatContainerRef.current) {
        requestAnimationFrame(() => {
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          });
        });
      }
    };

    useEffect(() => {
      if (chatContainerRef.current) {
        const container = chatContainerRef.current;
        const isNearBottom =
          container.scrollHeight -
            container.scrollTop -
            container.clientHeight <
          100;

        if (isNearBottom) {
          scrollToBottom();
        }
      }
    }, [messages]);

    // Get current section and chapter info
    const getCurrentContext = () => {
      if (!tocData)
        return {
          chapterName: "",
          sectionName: "",
          chapterId: null,
          sectionId: null,
        };

      for (const chapter of tocData.chapters) {
        if (chapter.sections) {
          for (const section of chapter.sections) {
            if (section.page === currentPage) {
              return {
                chapterName: chapter.title,
                sectionName: section.title,
                chapterId: chapter.chapter_id,
                sectionId: section.section_id,
              };
            }
          }
        }
      }
      return {
        chapterName: "",
        sectionName: "",
        chapterId: null,
        sectionId: null,
      };
    };

    // Voice recording functionality
    const startRecording = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error("Audio recording not supported.");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        const chunks = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: "audio/webm" });
          const formData = new FormData();
          formData.append("file", audioBlob, "query.webm");

          console.log("🎤 Sending audio to transcribe endpoint:");
          console.log("- Blob size:", audioBlob.size, "bytes");
          console.log("- Blob type:", audioBlob.type);
          console.log("- FormData:", formData);

          try {
            // Use the same domain as other API calls
            const res = await fetch(
              "https://api.adaptivelearnai.xyz/transcribe",
              {
                method: "POST",
                body: formData,
              }
            );

            console.log("📡 Transcribe response status:", res.status);
            console.log("📡 Transcribe response headers:", res.headers);

            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            console.log("📝 Transcription response:", data);
            const transcribedText =
              data.transcript || data.transcription || data.text || "";

            if (transcribedText.trim()) {
              setInputValue(
                (prev) => prev + (prev ? "\n" : "") + transcribedText
              );
            }
          } catch (err) {
            console.error("❌ Transcription failed:", err);
            console.error("❌ Error details:", {
              message: err.message,
              stack: err.stack,
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
                const transcribedText =
                  fallbackData.transcript ||
                  fallbackData.transcription ||
                  fallbackData.text ||
                  "";

                if (transcribedText.trim()) {
                  setInputValue(
                    (prev) => prev + (prev ? "\n" : "") + transcribedText
                  );
                }
              } else {
                throw new Error(
                  `Fallback failed with status: ${fallbackRes.status}`
                );
              }
            } catch (fallbackErr) {
              console.error("❌ Fallback also failed:", fallbackErr);
              setInputValue(
                (prev) =>
                  prev +
                  (prev ? " " : "") +
                  "[Voice input failed - please type your query]"
              );
            }
          }

          // Clean up
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.onerror = (event) => {
          console.error("MediaRecorder error:", event);
          setIsRecording(false);
          if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
          }
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
        setRecordingTime(0);

        recordingTimerRef.current = window.setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);
      } catch (error) {
        console.error("Recording error:", error);
      }
    };

    const stopRecording = () => {
      try {
        if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);

          if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
            recordingTimerRef.current = null;
          }
        }
      } catch (error) {
        console.error("Stop recording error:", error);
        setIsRecording(false);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
      }
    };

    const toggleRecording = () => {
      if (isRecording) {
        stopRecording();
      } else {
        startRecording();
      }
    };

    const formatRecordingTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
      return () => {
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
        }
        if (mediaRecorderRef.current && isRecording) {
          try {
            mediaRecorderRef.current.stop();
          } catch (error) {
            console.error("Cleanup error:", error);
          }
        }
      };
    }, [isRecording]);

    // Send message API call
    const sendChatMessage = async (
      content,
      autoGenerated = false,
      highlightedText
    ) => {
      const context = getCurrentContext();
      
      try {
     console.log("mock rsponse in try block callig the api");
if (!type) {
  console.error("Type is undefined!");
  return;
}
        let resp=await ChatbotApi(chatSessionId,id,type.toLowerCase(),content,currentPage,selectedModel)
        console.log("mock rsponse",resp.data);

        
        const mockResponse = resp.data
        // {
        //   chat_session_id: chatSessionId,
        //   role: "assistant",
        //   content: highlightedText
        //     ? `Based on the selected text "${
        //         highlightedText.text
        //       }", this refers to ${highlightedText.text.toLowerCase()}. ${
        //         highlightedText.text
        //       } is a fundamental concept that plays a crucial role in algorithm analysis. It represents the upper bound of an algorithm's time complexity, helping us understand the worst-case scenario for performance.`
        //     : autoGenerated
        //     ? "I've analyzed the selected content and generated the requested tool. You can interact with the results using the tool button below."
        //     : "This page discusses important concepts. The content covers fundamental principles that are essential for understanding the subject matter.",
        //   model_id: selectedModel,
        //   tool_type: autoGenerated
        //     ? content.includes("game")
        //       ? "game"
        //       : content.includes("diagram")
        //       ? "diagram"
        //       : content.includes("flashcard")
        //       ? "flashcard"
        //       : "quiz"
        //     : null,
        //   tool_response_id: autoGenerated
        //     ? "mock-response-" + Date.now()
        //     : null,
        //   tool_response: autoGenerated
        //     ? content.includes("game")
        //       ? [
        //           "**Memory Match Game**\n\nMatch the algorithm concepts with their definitions:\n\n1. Big O → Time complexity upper bound\n2. DFS → Depth-first search\n3. BFS → Breadth-first search\n4. Heap → Complete binary tree",
        //           "**Quiz Game**\n\nAnswer these questions to level up:\n\n**Level 1:** What is O(n)?\n**Level 2:** Which is faster: O(log n) or O(n)?\n**Level 3:** Implement bubble sort",
        //         ]
        //       : content.includes("diagram")
        //       ? [
        //           "graph TD\n    Algorithm[Algorithm Analysis] --> TimeComplexity[Time Complexity]\n    Algorithm --> SpaceComplexity[Space Complexity]\n    TimeComplexity --> BigO[Big O Notation]\n    TimeComplexity --> Omega[Omega Notation]\n    TimeComplexity --> Theta[Theta Notation]",
        //           "graph LR\n    Input[Input Size n] --> Linear[O(n)]\n    Input --> Quadratic[O(n²)]\n    Input --> Logarithmic[O(log n)]\n    Input --> Constant[O(1)]",
        //         ]
        //       : content.includes("flashcard")
        //       ? [
        //           {
        //             id: "1",
        //             question:
        //               "What is the primary subject of the book 'Introduction to Algorithms'?",
        //             answer: "Computer algorithms and programming.",
        //             difficulty: 1,
        //             topic: "Book Overview",
        //           },
        //           {
        //             id: "2",
        //             question:
        //               "Who are the authors of 'Introduction to Algorithms'?",
        //             answer:
        //               "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, and Clifford Stein.",
        //             difficulty: 1,
        //             topic: "Book Overview",
        //           },
        //           {
        //             id: "3",
        //             question: "What is Algorithm Analysis?",
        //             answer:
        //               "Algorithm analysis is the process of determining the computational complexity of algorithms - both time and space complexity.",
        //             difficulty: 2,
        //             topic: "Algorithm Analysis",
        //           },
        //           {
        //             id: "4",
        //             question: "What does Big O notation represent?",
        //             answer:
        //               "Big O notation describes the upper bound of time complexity in the worst-case scenario for an algorithm.",
        //             difficulty: 2,
        //             topic: "Algorithm Analysis",
        //           },
        //           {
        //             id: "5",
        //             question:
        //               "What is the difference between O(n) and O(log n)?",
        //             answer:
        //               "O(n) is linear time complexity where runtime increases directly with input size, while O(log n) is logarithmic time where runtime increases much slower.",
        //             difficulty: 3,
        //             topic: "Time Complexity",
        //           },
        //         ]
        //       : content.includes("quiz")
        //       ? [
        //           {
        //             id: "1",
        //             question:
        //               "What does Big O notation represent in algorithm analysis?",
        //             options: [
        //               "a) Best case time complexity",
        //               "b) Average case time complexity",
        //               "c) Worst case time complexity",
        //               "d) Space complexity only",
        //             ],
        //             correct_answer: "c) Worst case time complexity",
        //             explanation:
        //               "Big O notation specifically describes the upper bound of an algorithm's time complexity, representing the worst-case scenario. This helps developers understand how the algorithm will perform under the most challenging conditions.",
        //             difficulty: 2,
        //             topic: "Algorithm Analysis",
        //             question_type: "multiple_choice",
        //           },
        //           {
        //             id: "2",
        //             question:
        //               "Which of the following algorithms has O(log n) time complexity?",
        //             options: [
        //               "a) Linear search",
        //               "b) Binary search",
        //               "c) Bubble sort",
        //               "d) Selection sort",
        //             ],
        //             correct_answer: "b) Binary search",
        //             explanation:
        //               "Binary search achieves O(log n) time complexity because it eliminates half of the remaining elements in each step. This logarithmic behavior makes it very efficient for searching in sorted arrays.",
        //             difficulty: 2,
        //             topic: "Search Algorithms",
        //             question_type: "multiple_choice",
        //           },
        //           {
        //             id: "3",
        //             question:
        //               "What is the time complexity of accessing an element in an array by index?",
        //             options: ["a) O(1)", "b) O(log n)", "c) O(n)", "d) O(n²)"],
        //             correct_answer: "a) O(1)",
        //             explanation:
        //               "Array access by index is O(1) or constant time because arrays store elements in contiguous memory locations. The memory address can be calculated directly using the base address plus the index offset.",
        //             difficulty: 1,
        //             topic: "Data Structures",
        //             question_type: "multiple_choice",
        //           },
        //           {
        //             id: "4",
        //             question:
        //               "Which sorting algorithm is generally considered the most efficient for large datasets?",
        //             options: [
        //               "a) Bubble sort",
        //               "b) Selection sort",
        //               "c) Quick sort",
        //               "d) Insertion sort",
        //             ],
        //             correct_answer: "c) Quick sort",
        //             explanation:
        //               "Quick sort has an average time complexity of O(n log n) and is generally faster in practice than other O(n log n) algorithms like merge sort due to better cache performance and lower constant factors.",
        //             difficulty: 3,
        //             topic: "Sorting Algorithms",
        //             question_type: "multiple_choice",
        //           },
        //           {
        //             id: "5",
        //             question:
        //               "Hash tables provide O(1) average case time complexity for insertions and lookups.",
        //             options: ["a) True", "b) False"],
        //             correct_answer: "a) True",
        //             explanation:
        //               "Hash tables do provide O(1) average case time complexity for basic operations when the hash function distributes elements evenly. However, in the worst case (many collisions), operations can degrade to O(n).",
        //             difficulty: 2,
        //             topic: "Data Structures",
        //             question_type: "true_false",
        //           },
        //         ]
        //       : [
        //           "**Question 1:** What does Big O notation represent?\na) Best case\nb) Average case\nc) Worst case\nd) Space only\n\n**Answer:** c) Worst case",
        //         ]
        //     : null,
        //   created_at: new Date().toISOString(),
        //   highlighted_text: highlightedText
        //     ? {
        //         text: highlightedText.text,
        //         context: highlightedText.context,
        //         page: currentPage,
        //         chapter_id: context.chapterId,
        //         section_id: context.sectionId,
        //       }
        //     : null,
        // };

        return mockResponse;
      } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
      }
    };

    const handleSendMessage = async (
      messageContent,
      autoGenerated = false,
      highlightedTextOverride
    ) => {
      const content = messageContent || inputValue;
      if (!content.trim() || isLoading) return;

      const currentContextText = highlightedTextOverride || contextText;

      const userMessage = {
        id: Date.now().toString(),
        content: content,
        sender: "user",
        timestamp: new Date(),
        highlightedText: currentContextText || undefined,
      };

      setMessages((prev) => [...prev, userMessage]);
      if (!autoGenerated) {
        setInputValue("");
      }

      // Clear context after sending (unless overridden)
      if (!highlightedTextOverride) {
        setContextText(null);
      }

      setIsLoading(true);

      try {
        const response = await sendChatMessage(
          content,
          autoGenerated,
          currentContextText || undefined
        );

        const aiMessage = {
          id: (Date.now() + 1).toString(),
          content: response.content,
          sender: "ai",
          timestamp: new Date(),
          model: selectedModel,
          toolUsed: response.tool_type || undefined,
          toolResponse: response.tool_response
            ? {
                type: response.tool_type,
                content: response.tool_response,
                toolResponseId: response.tool_response_id || undefined,
              }
            : undefined,
        };

        setMessages((prev) => [...prev, aiMessage]);

        // Do NOT auto-open tool overlay - just show in chat
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleToolUse = (tool) => {
      const toolMessage = `Generate a ${tool.name.toLowerCase()} based on the current content on page ${currentPage}`;
      handleSendMessage(toolMessage, true);
    };

    const handleOpenToolMessage = (toolResponse) => {
      setActiveOverlay({
        type: toolResponse.type,
        content: toolResponse.content,
        toolResponseId: toolResponse.toolResponseId
      });
    };

    const selectedModelInfo = availableModels.find(
      (m) => m.id === selectedModel
    );

    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    const handleClearContext = () => {
      setContextText(null);
      setInputValue("");
    };

    return (
      <>
        <div className="w-full h-full bg-card flex flex-col relative overflow-hidden">
        {/* Tool Overlay */}
        {activeOverlay && (
          <ToolPanelOverlay
            toolType={activeOverlay.type}
            content={activeOverlay.content}
            onClose={() => setActiveOverlay(null)}
          />
        )}

        {/* Compact Toolbar */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 space-y-3 flex-shrink-0 bg-white dark:bg-gray-800">
          {/* Model Selector */}
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="h-9 text-sm bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"> 
              {availableModels.map((model) => (
                <SelectItem className="hover:bg-gray-100 dark:hover:bg-gray-700" key={model.id} value={model.id}>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{model.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {model.provider}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Tools in 2 columns with improved styling */}
          <div className="grid grid-cols-2 gap-2">
            {availableTools.map((tool) => (
              <Button
                key={tool.id}
                variant="outline"
                size="sm"
                onClick={() => handleToolUse(tool)}
                disabled={isLoading}
                className={`justify-start gap-2 h-9 text-sm px-3 rounded-lg border-2 transition-all ${tool.color}`}
                title={tool.description}
              >
                {tool.icon}
                {tool.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Tool Response */}
        {toolResponse && (
          <div className="p-2 border-b flex-shrink-0 bg-card">
            <Collapsible
              open={!toolResponse.isCollapsed}
              onOpenChange={(open) =>
                setToolResponse({ ...toolResponse, isCollapsed: !open })
              }
            >
              <Card>
                <CardHeader className="pb-1 p-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs flex items-center gap-2">
                      <Brain className="w-3 h-3" />
                      {toolResponse.tool}
                    </CardTitle>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0 h-5 w-5">
                        <ChevronDown
                          className={`w-3 h-3 transition-transform ${
                            toolResponse.isCollapsed ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="pt-0 p-2">
                    <div className="text-xs whitespace-pre-wrap">
                      {toolResponse.content}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 min-h-0 overflow-hidden bg-gray-50 dark:bg-gray-900">
          <ScrollArea className="h-full">
            <div ref={chatContainerRef} className="p-4 space-y-0">
              {messages.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-4">
                    <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Start a conversation
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
                    Ask questions, generate learning tools, or highlight text in the document to get started with your AI study assistant.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                      💭 Ask questions
                    </span>
                    <span className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                      🎯 Generate tools
                    </span>
                    <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                      ✨ Highlight text
                    </span>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <MessageComponent
                    key={message.id}
                    message={message}
                    selectedModelInfo={selectedModelInfo}
                    onOpenToolMessage={handleOpenToolMessage}
                    onLoadToolResponse={loadToolResponse}
                  />
                ))
              )}

              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">AI is thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Chat Input with Context and Mic Button */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800">
          {/* Context Display */}
          {contextText && (
            <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Quote className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Selected text:
                    </span>
                  </div>
                  <p className="text-sm italic text-blue-700 dark:text-blue-300 leading-relaxed">
                    "{contextText.text}"
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearContext}
                  className="h-7 w-7 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-200 dark:hover:bg-blue-900/50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                contextText
                  ? "Ask about the selected text..."
                  : "Type your message here..."
              }
              className="resize-none text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl px-4 py-3 leading-relaxed"
              rows={2}
              onKeyDown={handleKeyDown}
            />
            <div className="flex flex-col gap-2">
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={toggleRecording}
                className="h-10 w-10 p-0 rounded-xl"
                disabled={isLoading}
                title={
                  isRecording
                    ? `Recording ${formatRecordingTime(recordingTime)}`
                    : "Start recording"
                }
              >
                {isRecording ? (
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className="h-10 w-10 p-0 rounded-xl bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
            Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Enter</kbd> to send • 
            <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs mx-1">Shift+Enter</kbd> for new line • 
            Highlight text to access all learning tools instantly
          </p>
        </div>
      </div>
      <FlipCardStyles />
      </>
    );
  }
);

ToolPanel.displayName = "ToolPanel";
