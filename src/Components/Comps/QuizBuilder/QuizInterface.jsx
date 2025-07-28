import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  Target,
  ChevronLeft,
  ChevronRight,
  Save,
  Download,
  RotateCcw,
  AlertCircle,
  Trophy
} from 'lucide-react';

export const QuizInterface = ({ 
  quizData, 
  quizConfig, 
  onBack, 
  onSaveQuiz 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  // Timer - must be called before any early returns
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Validate quiz data
  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertCircle size={40} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Quiz Data Available</h2>
          <p className="text-slate-400 mb-6">
            There seems to be an issue with the quiz data. Please go back and try again.
          </p>
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors mx-auto"
          >
            <ChevronLeft size={18} />
            <span>Back to Quiz Builder</span>
          </button>
        </div>
      </div>
    );
  }

  const totalQuestions = quizData.questions.length;
  
  // Ensure currentQuestionIndex is within bounds and currentQuestion exists
  const safeQuestionIndex = Math.min(Math.max(0, currentQuestionIndex), totalQuestions - 1);
  const currentQuestion = totalQuestions > 0 ? quizData.questions[safeQuestionIndex] : null;
  const isPerQuestionSubmission = quizConfig?.submissionStyle === 'Submit After Each Question';

  const handleAnswerSelect = (questionId, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const handleSubmitAnswer = (questionId) => {
    const question = quizData.questions.find(q => q.id === questionId);
    const userAnswer = answers[questionId];
    const isCorrect = userAnswer === question.correct_answer;

    // Show explanation immediately after submission if explanations are enabled
    if (quizConfig?.explanation) {
      setShowExplanation(prev => ({
        ...prev,
        [questionId]: true
      }));
    }

    if (isPerQuestionSubmission) {
      // Move to next question after a delay to show the result
      setTimeout(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          handleFinalSubmit();
        }
      }, quizConfig?.explanation ? 3000 : 1500); // Longer delay if showing explanation
    }
  };

  const handleFinalSubmit = async () => {
    let correctAnswers = 0;
    quizData.questions.forEach(question => {
      if (answers[question.id] === question.correct_answer) {
        correctAnswers++;
      }
    });

    setScore(correctAnswers);

    // If explanations are enabled and we're in "Submit at End" mode, show all explanations
    if (quizConfig?.explanation && !isPerQuestionSubmission) {
      const allExplanations = {};
      quizData.questions.forEach(question => {
        allExplanations[question.id] = true;
      });
      setShowExplanation(allExplanations);
    }

    // Prepare payload for quiz history API
    try {
      const quiz_id = String(quizData.quiz_id || quizConfig?.quiz_id || "");
      // doc_ids could be an array or string, ensure it's a string (UUID)
      let doc_id = quizConfig?.doc_id || "";
      if (!doc_id && quizConfig?.doc_ids) {
        if (Array.isArray(quizConfig.doc_ids)) {
          doc_id = quizConfig.doc_ids[0] || "";
        } else {
          doc_id = quizConfig.doc_ids;
        }
      }
      doc_id = String(doc_id);
      const doc_name = String(quizConfig?.doc_name || quizConfig?.user_query || "");
      const scoreStr = `${correctAnswers}/${quizData.questions.length}`;
      const accuracy = quizData.questions.length > 0 ? (correctAnswers / quizData.questions.length) * 100 : 0;
      // Only include required fields in quiz_data
      const quiz_data = quizData.questions.map(q => ({
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        user_answer: answers[q.id] || null,
        explanation: q.explanation
      }));
      const payload = {
        quiz_id,
        doc_id,
        doc_name,
        score: scoreStr,
        accuracy,
        quiz_data: JSON.stringify(quiz_data)
      };
      await fetch("https://api.adaptivelearnai.xyz/quiz-gen/quiz-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(document.cookie.includes('access_token') && {
            'Authorization': `Bearer ${document.cookie.split('access_token=')[1]?.split(';')[0]}`
          })
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("Failed to save quiz history:", err);
    }

    setIsSubmitted(true);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 1: return 'text-green-400 bg-green-400/20';
      case 2: return 'text-yellow-400 bg-yellow-400/20';
      case 3: return 'text-red-400 bg-red-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      default: return 'Unknown';
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isSubmitted) {
    return (
      <div className="space-y-8">
        {/* Results Header */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Trophy size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Quiz Completed!</h2>
          <p className="text-slate-400">Here are your results</p>
        </div>

        {/* Score Card */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">
                {score}/{totalQuestions}
              </div>
              <div className="text-slate-400">Score</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">
                {Math.round((score / totalQuestions) * 100)}%
              </div>
              <div className="text-slate-400">Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">
                {formatTime(timeSpent)}
              </div>
              <div className="text-slate-400">Time Spent</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <RotateCcw size={18} />
            <span>Try Again</span>
          </button>
          <button
            onClick={() => onSaveQuiz({ quizData, answers, score, timeSpent })}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Save size={18} />
            <span>Save Results</span>
          </button>
          <button
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            <Download size={18} />
            <span>Export Quiz</span>
          </button>
        </div>

        {/* Detailed Review - Show if explanations are enabled */}
        {quizConfig?.explanation && (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white text-center mb-6">Question Review</h3>
            {quizData.questions.map((question, index) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer === question.correct_answer;
              
              return (
                <div key={question.id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-medium text-slate-300">
                        Question {index + 1}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
                        {getDifficultyText(question.difficulty)}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-700 text-slate-300">
                        {question.topic}
                      </span>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                      isCorrect 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
                    </div>
                  </div>

                  {/* Question */}
                  <h4 className="text-lg font-medium text-white mb-4">{question.question}</h4>

                  {/* Your Answer vs Correct Answer */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-slate-400">Your Answer:</div>
                      <div className={`p-3 rounded-lg border ${
                        isCorrect 
                          ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                          : 'bg-red-500/10 border-red-500/30 text-red-400'
                      }`}>
                        {userAnswer || 'No answer selected'}
                      </div>
                    </div>
                    {!isCorrect && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-slate-400">Correct Answer:</div>
                        <div className="p-3 rounded-lg border bg-green-500/10 border-green-500/30 text-green-400">
                          {question.correct_answer}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Explanation */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h5 className="font-medium text-blue-400 mb-2">Explanation</h5>
                        <p className="text-slate-300 leading-relaxed">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={18} />
          <span>Back to Customization</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-slate-400">
            <Clock size={16} />
            <span>{formatTime(timeSpent)}</span>
          </div>
          <div className="text-slate-400">
            {safeQuestionIndex + 1} of {totalQuestions}
          </div>
          {/* Submission Mode Indicator */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isPerQuestionSubmission 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          }`}>
            {isPerQuestionSubmission ? 'Submit Each' : 'Submit at End'}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((safeQuestionIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      {currentQuestion ? (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
          {/* Question Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                {getDifficultyText(currentQuestion.difficulty)}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-700 text-slate-300">
                {currentQuestion.topic}
              </span>
            </div>
          </div>

          {/* Question */}
          <h3 className="text-xl font-semibold text-white mb-8 leading-relaxed">
            {currentQuestion.question}
          </h3>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {currentQuestion.options.map((option, index) => {
            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
            const isSelected = answers[currentQuestion.id] === option;
            const isSubmittedAnswer = isPerQuestionSubmission && answers[currentQuestion.id];
            const isCorrect = option === currentQuestion.correct_answer;
            const isWrong = isSubmittedAnswer && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => !isSubmittedAnswer && handleAnswerSelect(currentQuestion.id, option)}
                disabled={isSubmittedAnswer}
                className={`
                  w-full p-4 rounded-lg border text-left transition-all duration-300 
                  ${isSubmittedAnswer
                    ? isCorrect 
                      ? 'bg-green-500/20 border-green-500 text-white'
                      : isWrong
                        ? 'bg-red-500/20 border-red-500 text-white'
                        : 'bg-slate-700/50 border-slate-600 text-slate-300'
                    : isSelected
                      ? 'bg-blue-500/20 border-blue-500 text-white'
                      : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-700/50'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <span className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${isSubmittedAnswer
                      ? isCorrect
                        ? 'bg-green-500 text-white'
                        : isWrong
                          ? 'bg-red-500 text-white'
                          : 'bg-slate-600 text-slate-300'
                      : isSelected
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-600 text-slate-400'
                    }
                  `}>
                    {optionLetter}
                  </span>
                  <span>{option}</span>
                  {isSubmittedAnswer && isCorrect && (
                    <CheckCircle size={20} className="text-green-500 ml-auto" />
                  )}
                  {isSubmittedAnswer && isWrong && (
                    <XCircle size={20} className="text-red-500 ml-auto" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {quizConfig?.explanation && showExplanation[currentQuestion.id] && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-400 mb-2">Explanation</h4>
                <p className="text-slate-300 leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0 || (isPerQuestionSubmission && showExplanation[currentQuestion.id])}
            className="flex items-center space-x-2 px-4 py-2 text-slate-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
            <span>Previous</span>
          </button>

          <div className="flex space-x-3">
            {/* Per-question submission mode */}
            {isPerQuestionSubmission && answers[currentQuestion.id] && !showExplanation[currentQuestion.id] && (
              <button
                onClick={() => handleSubmitAnswer(currentQuestion.id)}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center space-x-2"
              >
                <CheckCircle size={18} />
                <span>Submit Answer</span>
              </button>
            )}

            {/* Submit at end mode */}
            {!isPerQuestionSubmission && (
              <>
                {currentQuestionIndex === totalQuestions - 1 ? (
                  <button
                    onClick={handleFinalSubmit}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center space-x-2"
                  >
                    <Trophy size={18} />
                    <span>Submit Quiz</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                    disabled={currentQuestionIndex === totalQuestions - 1}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Next</span>
                    <ChevronRight size={18} />
                  </button>
                )}
              </>
            )}

            {/* Navigation for per-question mode after submission */}
            {isPerQuestionSubmission && showExplanation[currentQuestion.id] && currentQuestionIndex < totalQuestions - 1 && (
              <button
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all"
              >
                <span>Next Question</span>
                <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
        </div>
      ) : (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Question Not Found</h3>
          <p className="text-slate-400 mb-4">
            Unable to load question {safeQuestionIndex + 1} of {totalQuestions}
          </p>
          <button
            onClick={() => setCurrentQuestionIndex(0)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Go to First Question
          </button>
        </div>
      )}
    </div>
  );
};
