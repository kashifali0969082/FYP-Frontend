import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  Trophy,
  Target,
  CheckCircle,
  XCircle,
  RotateCcw,
  Download,
  Share2,
  BookOpen,
  Award,
  TrendingUp,
  Loader2,
  AlertCircle
} from 'lucide-react';

export const QuizReview = ({ quizData, onBack, onRetake }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [detailedQuizData, setDetailedQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch detailed quiz data from API
  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        console.log('QuizReview: Starting to fetch quiz details for ID:', quizData?.id);
        setIsLoading(true);
        const response = await fetch(`https://api.adaptivelearnai.xyz/quiz-gen/quiz-history/${quizData.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(document.cookie.includes('access_token') && {
              'Authorization': `Bearer ${document.cookie.split('access_token=')[1]?.split(';')[0]}`
            })
          }
        });

        console.log('QuizReview: API response status:', response.status);

        if (!response.ok) {
          throw new Error('Failed to fetch quiz details');
        }

        const result = await response.json();
        console.log('QuizReview: API response data:', result);
        
        // Transform the API response to match our component structure
        const transformedData = {
          id: result.data.history_id,
          documentName: result.data.doc_name,
          documentType: 'document',
          score: parseInt(result.data.score.split('/')[0]),
          totalQuestions: parseInt(result.data.score.split('/')[1]),
          accuracy: result.data.accuracy,
          timeSpent: result.data.time_taken || 0,
          difficulty: 'Medium', // API doesn't provide this
          completedAt: new Date().toISOString(), // API doesn't provide this
          questions: result.data.quiz_data.map((question, index) => ({
            id: (index + 1).toString(),
            question: question.question,
            options: question.options,
            correctAnswer: question.correct_answer,
            userAnswer: question.user_answer,
            isCorrect: question.user_answer === question.correct_answer,
            explanation: question.explanation,
            timeSpent: Math.floor((result.data.time_taken || 0) / result.data.quiz_data.length) // Distribute time evenly
          }))
        };

        console.log('QuizReview: Transformed data:', transformedData);
        setDetailedQuizData(transformedData);
      } catch (err) {
        console.error('QuizReview: Error fetching quiz details:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    console.log('QuizReview: useEffect triggered with quizData:', quizData);
    if (quizData?.id) {
      fetchQuizDetails();
    } else {
      console.log('QuizReview: No quiz ID found, not fetching');
      setIsLoading(false);
    }
  }, [quizData]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Loading Quiz Review...</h2>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 size={32} className="animate-spin text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Loading Quiz Details</h3>
            <p className="text-slate-400">Please wait while we fetch your quiz data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Quiz Review</h2>
        </div>
        
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-xl flex items-center justify-center">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Error Loading Quiz Details</h3>
          <p className="text-slate-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!detailedQuizData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Quiz Review</h2>
        </div>
        
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-500/20 rounded-xl flex items-center justify-center">
            <AlertCircle size={32} className="text-yellow-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Quiz Data Available</h3>
          <p className="text-slate-400">Unable to load quiz details.</p>
        </div>
      </div>
    );
  }

  // Use the fetched data instead of mock data
  const mockQuizResults = detailedQuizData;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPerformanceMessage = (accuracy) => {
    if (accuracy >= 90) return { message: "Excellent! Outstanding performance!", color: "text-green-400", icon: Award };
    if (accuracy >= 80) return { message: "Great job! Strong understanding shown.", color: "text-blue-400", icon: Trophy };
    if (accuracy >= 70) return { message: "Good work! Room for improvement.", color: "text-yellow-400", icon: Target };
    if (accuracy >= 60) return { message: "Fair performance. Keep studying!", color: "text-orange-400", icon: TrendingUp };
    return { message: "Needs improvement. Review the material.", color: "text-red-400", icon: RotateCcw };
  };

  const performance = getPerformanceMessage(mockQuizResults.accuracy);
  const PerformanceIcon = performance.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Quiz Review</h2>
            <p className="text-slate-400">{mockQuizResults.documentName}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onRetake}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <RotateCcw size={18} />
            <span>Retake Quiz</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
            <Download size={18} />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <PerformanceIcon size={32} className={performance.color} />
              <div>
                <h3 className="text-xl font-bold text-white">{performance.message}</h3>
                <p className="text-slate-400">Completed on {formatDate(mockQuizResults.completedAt)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Final Score</p>
                <p className="text-2xl font-bold text-white">
                  {mockQuizResults.score}/{mockQuizResults.totalQuestions}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Accuracy</p>
                <p className={`text-2xl font-bold ${performance.color}`}>
                  {mockQuizResults.accuracy}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Time Spent</p>
                <p className="text-lg font-semibold text-white">
                  {formatTime(mockQuizResults.timeSpent)}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Difficulty</p>
                <span className={`
                  px-3 py-1 rounded-full text-sm font-medium
                  ${mockQuizResults.difficulty === 'Easy' ? 'bg-green-400/20 text-green-400' :
                    mockQuizResults.difficulty === 'Medium' ? 'bg-yellow-400/20 text-yellow-400' :
                    'bg-red-400/20 text-red-400'
                  }
                `}>
                  {mockQuizResults.difficulty}
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-slate-400 text-sm mb-2">Progress</p>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${mockQuizResults.accuracy}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Review */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <BookOpen size={24} />
          <span>Question by Question Review</span>
        </h3>
        
        <div className="space-y-4">
          {mockQuizResults.questions.map((question, index) => (
            <div
              key={question.id}
              className={`border rounded-xl p-4 transition-all cursor-pointer ${
                question.isCorrect
                  ? 'border-green-500/30 bg-green-500/10'
                  : 'border-red-500/30 bg-red-500/10'
              } ${selectedQuestion === question.id ? 'ring-2 ring-blue-500/50' : ''}`}
              onClick={() => setSelectedQuestion(selectedQuestion === question.id ? null : question.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-sm font-medium text-slate-400">Question {index + 1}</span>
                    {question.isCorrect ? (
                      <CheckCircle size={20} className="text-green-400" />
                    ) : (
                      <XCircle size={20} className="text-red-400" />
                    )}
                    <div className="flex items-center space-x-1 text-xs text-slate-400">
                      <Clock size={14} />
                      <span>{formatTime(question.timeSpent)}</span>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-white mb-3">{question.question}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          option === question.correctAnswer
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : option === question.userAnswer && !question.isCorrect
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-slate-700/50 text-slate-300'
                        }`}
                      >
                        {option}
                        {option === question.correctAnswer && (
                          <span className="ml-2 text-xs">✓ Correct</span>
                        )}
                        {option === question.userAnswer && option !== question.correctAnswer && (
                          <span className="ml-2 text-xs">✗ Your answer</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {selectedQuestion === question.id && (
                <div className="mt-4 pt-4 border-t border-slate-600/50">
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-2">Explanation:</h5>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Study Recommendations */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <TrendingUp size={24} />
          <span>Study Recommendations</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-300">Areas to Improve:</h4>
            <ul className="space-y-2">
              {mockQuizResults.questions
                .filter(q => !q.isCorrect)
                .map((question, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-slate-400">
                    <XCircle size={16} className="text-red-400" />
                    <span>Question {mockQuizResults.questions.indexOf(question) + 1}: Review topic fundamentals</span>
                  </li>
                ))}
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-300">Strengths:</h4>
            <ul className="space-y-2">
              {mockQuizResults.questions
                .filter(q => q.isCorrect)
                .slice(0, 3)
                .map((question, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-slate-400">
                    <CheckCircle size={16} className="text-green-400" />
                    <span>Question {mockQuizResults.questions.indexOf(question) + 1}: Strong understanding shown</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
