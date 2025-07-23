import React, { useState } from 'react';
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
  RotateCcw
} from 'lucide-react';

export const QuizHistory = ({ isMobile, onReviewQuiz, onRetakeQuiz }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);

  // Mock quiz history data - replace with actual API data
  const quizHistory = [
    {
      id: '1',
      documentName: 'Introduction to Algorithms',
      documentType: 'book',
      score: 8,
      totalQuestions: 10,
      accuracy: 80,
      timeSpent: 325, // seconds
      difficulty: 'Medium',
      completedAt: '2025-01-20T10:30:00Z',
      status: 'completed'
    },
    {
      id: '2', 
      documentName: 'React Fundamentals',
      documentType: 'presentation',
      score: 15,
      totalQuestions: 15,
      accuracy: 100,
      timeSpent: 420,
      difficulty: 'Easy',
      completedAt: '2025-01-19T14:20:00Z',
      status: 'completed'
    },
    {
      id: '3',
      documentName: 'Machine Learning Notes',
      documentType: 'notes',
      score: 6,
      totalQuestions: 12,
      accuracy: 50,
      timeSpent: 890,
      difficulty: 'Hard',
      completedAt: '2025-01-18T16:45:00Z',
      status: 'completed'
    }
  ];

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Quiz History
          </h2>
          <p className="text-slate-400">
            Track your learning progress and review past quiz attempts
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <Filter size={18} />
            <span>Filter</span>
            <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="score">Highest Score</option>
                <option value="accuracy">Best Accuracy</option>
                <option value="time">Fastest Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Document Type</label>
              <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500">
                <option value="all">All Types</option>
                <option value="book">Books</option>
                <option value="presentation">Presentations</option>
                <option value="notes">Notes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
              <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500">
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
        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search quiz history..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 transition-all"
        />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Quizzes</p>
              <p className="text-2xl font-bold text-white">{quizHistory.length}</p>
            </div>
            <Trophy size={24} className="text-blue-400" />
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Avg. Accuracy</p>
              <p className="text-2xl font-bold text-white">
                {Math.round(quizHistory.reduce((acc, quiz) => acc + quiz.accuracy, 0) / quizHistory.length)}%
              </p>
            </div>
            <Target size={24} className="text-green-400" />
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Questions</p>
              <p className="text-2xl font-bold text-white">
                {quizHistory.reduce((acc, quiz) => acc + quiz.totalQuestions, 0)}
              </p>
            </div>
            <CheckCircle size={24} className="text-purple-400" />
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Time Spent</p>
              <p className="text-2xl font-bold text-white">
                {formatTime(quizHistory.reduce((acc, quiz) => acc + quiz.timeSpent, 0))}
              </p>
            </div>
            <Clock size={24} className="text-orange-400" />
          </div>
        </div>
      </div>

      {/* Quiz History List */}
      <div className="space-y-4">
        {quizHistory.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white text-lg">{quiz.documentName}</h3>
                  <span className="text-sm text-slate-400">{formatDate(quiz.completedAt)}</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Score</p>
                    <p className="font-medium text-white">
                      {quiz.score}/{quiz.totalQuestions}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">Accuracy</p>
                    <p className={`font-medium ${getScoreColor(quiz.accuracy)}`}>
                      {quiz.accuracy}%
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400">Time</p>
                    <p className="font-medium text-white">{formatTime(quiz.timeSpent)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Difficulty</p>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
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

              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => onReviewQuiz && onReviewQuiz(quiz)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <Eye size={16} />
                  <span>Review</span>
                </button>
                <button 
                  onClick={() => onRetakeQuiz && onRetakeQuiz(quiz)}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  <RotateCcw size={16} />
                  <span>Retake</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                  <Download size={16} />
                  <span>Export</span>
                </button>
                <button className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {quizHistory.length === 0 && (
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
