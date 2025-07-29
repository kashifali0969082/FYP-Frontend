import React, { useState, useEffect } from 'react';
import {
  Clock,
  Trophy,
  Target,
  Calendar,
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

export const QuizHistory = ({ isMobile, onReviewQuiz }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [quizHistory, setQuizHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch quiz history from API
  useEffect(() => {
    const fetchQuizHistory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://api.adaptivelearnai.xyz/quiz-gen/user-quiz-history", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(document.cookie.includes('access_token') && {
              'Authorization': `Bearer ${document.cookie.split('access_token=')[1]?.split(';')[0]}`
            })
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch quiz history');
        }

        const data = await response.json();
        
        // Transform the API response to match our component structure
        const transformedHistory = data.data.map(quiz => {
          const [score, totalQuestions] = quiz.score.split('/').map(Number);
          return {
            id: quiz.history_id,
            documentName: quiz.doc_name,
            documentType: 'document', // API doesn't provide this, using default
            score: score,
            totalQuestions: totalQuestions,
            accuracy: quiz.accuracy,
            timeSpent: quiz.time_taken || 0, // Use 0 if time_taken is null
            difficulty: 'Medium', // API doesn't provide this, using default
            completedAt: new Date().toISOString(), // API doesn't provide this, using current date
            status: 'completed',
            quiz_id: quiz.quiz_id,
            doc_id: quiz.doc_id
          };
        });

        setQuizHistory(transformedHistory);
      } catch (err) {
        console.error('Error fetching quiz history:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizHistory();
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getScoreColor = (accuracy) => {
    if (accuracy >= 80) return 'text-green-400';
    if (accuracy >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (accuracy) => {
    if (accuracy >= 80) return 'bg-green-400/20';
    if (accuracy >= 60) return 'bg-yellow-400/20';
    return 'bg-red-400/20';
  };

  // Calculate total stats from quiz history
  const totalQuizzes = quizHistory.length;
  const totalQuestions = quizHistory.reduce((acc, quiz) => acc + quiz.totalQuestions, 0);
  const totalTimeSpent = quizHistory.reduce((acc, quiz) => acc + quiz.timeSpent, 0);
  const averageAccuracy = totalQuizzes > 0 
    ? Math.round(quizHistory.reduce((acc, quiz) => acc + quiz.accuracy, 0) / totalQuizzes) 
    : 0;

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6 overflow-hidden">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 size={32} className="animate-spin text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Loading Quiz History</h3>
            <p className="text-slate-400">Please wait while we fetch your quiz data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 md:space-y-6 overflow-hidden">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-xl flex items-center justify-center">
            <XCircle size={32} className="text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Error Loading Quiz History</h3>
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

  return (
    <div className="space-y-4 md:space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl md:text-2xl xl:text-3xl font-bold text-white mb-1 md:mb-2 truncate">
            Quiz History
          </h2>
          <p className="text-xs md:text-sm text-slate-400 break-words">
            Track your learning progress and review past quiz attempts
          </p>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
          >
            <Filter size={16} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">Filter</span>
            <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''} md:w-4 md:h-4`} />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 md:p-6 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="min-w-0">
              <label className="block text-xs md:text-sm font-medium text-slate-300 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="score">Highest Score</option>
                <option value="accuracy">Best Accuracy</option>
                <option value="time">Fastest Time</option>
              </select>
            </div>
            <div className="min-w-0">
              <label className="block text-xs md:text-sm font-medium text-slate-300 mb-2">Document Type</label>
              <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm">
                <option value="all">All Types</option>
                <option value="book">Books</option>
                <option value="presentation">Presentations</option>
                <option value="notes">Notes</option>
              </select>
            </div>
            <div className="min-w-0">
              <label className="block text-xs md:text-sm font-medium text-slate-300 mb-2">Difficulty</label>
              <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm">
                <option value="all">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={isMobile ? 16 : 20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search quiz history..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 md:py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 transition-all text-sm md:text-base"
        />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg md:rounded-xl p-3 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-slate-400 text-xs md:text-sm truncate">Total Quizzes</p>
              <p className="text-lg md:text-2xl font-bold text-white">{totalQuizzes}</p>
            </div>
            <Trophy size={isMobile ? 16 : 24} className="text-blue-400 flex-shrink-0" />
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg md:rounded-xl p-3 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-slate-400 text-xs md:text-sm truncate">Avg. Accuracy</p>
              <p className="text-lg md:text-2xl font-bold text-white">{averageAccuracy}%</p>
            </div>
            <Target size={isMobile ? 16 : 24} className="text-green-400 flex-shrink-0" />
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg md:rounded-xl p-3 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-slate-400 text-xs md:text-sm truncate">Total Questions</p>
              <p className="text-lg md:text-2xl font-bold text-white">{totalQuestions}</p>
            </div>
            <CheckCircle size={isMobile ? 16 : 24} className="text-purple-400 flex-shrink-0" />
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg md:rounded-xl p-3 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-slate-400 text-xs md:text-sm truncate">Time Spent</p>
              <p className="text-lg md:text-2xl font-bold text-white">
                {formatTime(totalTimeSpent)}
              </p>
            </div>
            <Clock size={isMobile ? 16 : 24} className="text-orange-400 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Quiz History List */}
      <div className="space-y-3 md:space-y-4">
        {quizHistory.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg md:rounded-xl p-4 md:p-6 hover:bg-slate-800/70 transition-all duration-300 overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 md:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2 md:mb-3 gap-2">
                  <h3 className="font-semibold text-white text-sm md:text-lg truncate min-w-0 flex-1">
                    {(() => {
                      const name = quiz.documentName;
                      const maxLength = isMobile ? 20 : 40;
                      return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
                    })()}
                  </h3>
                  <span className="text-xs md:text-sm text-slate-400 flex-shrink-0">{formatDate(quiz.completedAt)}</span>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm">
                  <div className="min-w-0">
                    <p className="text-slate-400 truncate">Score</p>
                    <p className="font-medium text-white">
                      {quiz.score}/{quiz.totalQuestions}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-400 truncate">Accuracy</p>
                    <p className={`font-medium ${getScoreColor(quiz.accuracy)}`}>
                      {quiz.accuracy}%
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-400 truncate">Time</p>
                    <p className="font-medium text-white">{formatTime(quiz.timeSpent)}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-400 truncate">Difficulty</p>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium inline-block
                      ${quiz.difficulty === 'Easy' ? 'bg-green-400/20 text-green-400' :
                        quiz.difficulty === 'Medium' ? 'bg-yellow-400/20 text-yellow-400' :
                        'bg-red-400/20 text-red-400'
                      }
                    `}>
                      {quiz.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                <button 
                  onClick={() => onReviewQuiz && onReviewQuiz(quiz)}
                  className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-xs md:text-sm"
                >
                  <Eye size={isMobile ? 14 : 16} />
                  <span>Review</span>
                </button>
                <button className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-xs md:text-sm">
                  <Download size={isMobile ? 14 : 16} />
                  <span className="hidden sm:inline">Export</span>
                </button>
                <button className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors">
                  <Trash2 size={isMobile ? 14 : 16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {quizHistory.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/50 rounded-xl flex items-center justify-center">
            <Trophy size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Quiz History</h3>
          <p className="text-slate-400 mb-6">
            Take your first quiz to start tracking your progress
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all">
            Create Your First Quiz
          </button>
        </div>
      )}
    </div>
  );
};
