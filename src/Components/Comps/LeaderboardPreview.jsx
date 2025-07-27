import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Award, Flame, ChevronRight } from 'lucide-react';
// Removed streakLeaderboardapi import - data now comes from parent to eliminate duplicate API calls

const LeaderboardPreview = ({ 
  isMobile, 
  setCurrentPage, 
  setIsMobileSidebarOpen,
  // New props to receive data from parent to eliminate duplicate API calls
  leaderboardData,
  isLeaderboardLoading = false
}) => {
  // No local state needed - use props from parent
  const loading = isLeaderboardLoading;

  // No useEffect needed - data comes from parent to eliminate duplicate API calls
  // This eliminates the duplicate streakLeaderboardapi() call

  const handleViewFull = () => {
    setCurrentPage("leaderboard");
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case 2:
        return <Award className="w-4 h-4 text-slate-300" />;
      case 3:
        return <Trophy className="w-4 h-4 text-amber-600" />;
      default:
        return <span className="text-xs font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getStreakColor = (streak) => {
    if (streak >= 50) return "text-red-400";
    if (streak >= 20) return "text-orange-400";
    if (streak >= 10) return "text-yellow-400";
    return "text-blue-400";
  };

  if (loading) {
    return (
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl md:rounded-2xl blur-lg opacity-20"></div>
        <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl md:rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <Trophy className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-pulse" />
              <p className="text-gray-400 text-sm">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!leaderboardData || !leaderboardData.top_users) {
    return null;
  }

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg md:rounded-xl xl:rounded-2xl blur-lg opacity-20"></div>
      <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg md:rounded-xl xl:rounded-2xl p-3 md:p-4 xl:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 xl:w-12 xl:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg xl:rounded-xl flex items-center justify-center">
              <Trophy size={isMobile ? 16 : 20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm md:text-base">Top Streaks</h3>
              <p className="text-slate-400 text-xs">Current leaders</p>
            </div>
          </div>
          <button
            onClick={handleViewFull}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Top 3 Users */}
        <div className="space-y-2 md:space-y-3">
          {leaderboardData.top_users.slice(0, 3).map((user, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-2 md:p-3 rounded-lg transition-all duration-200 ${
                user.is_you
                  ? 'bg-blue-500/20 border border-blue-500/30'
                  : 'bg-slate-700/30 hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  user.rank === 1 ? 'bg-yellow-400/20' :
                  user.rank === 2 ? 'bg-slate-300/20' :
                  'bg-amber-600/20'
                }`}>
                  {getRankIcon(user.rank)}
                </div>
                <div>
                  <p className={`font-medium text-sm ${user.is_you ? 'text-blue-300' : 'text-white'}`}>
                    {user.name}
                    {user.is_you && <span className="text-blue-400 text-xs ml-1">(You)</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Flame className={`w-4 h-4 ${getStreakColor(user.current_streak)}`} />
                <span className={`font-bold text-sm ${getStreakColor(user.current_streak)}`}>
                  {user.current_streak}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Your Position (if not in top 3) */}
        {leaderboardData.your_position?.show_gap && (
          <div className="mt-3 md:mt-4 pt-3 border-t border-slate-600/50">
            <div className="flex items-center justify-between p-2 md:p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center bg-blue-500/20">
                  <span className="text-xs font-bold text-blue-400">#{leaderboardData.your_position.rank}</span>
                </div>
                <div>
                  <p className="font-medium text-xs md:text-sm text-blue-300">Your Position</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Flame className={`w-3 h-3 md:w-4 md:h-4 ${getStreakColor(leaderboardData.your_position.current_streak)}`} />
                <span className={`font-bold text-xs md:text-sm ${getStreakColor(leaderboardData.your_position.current_streak)}`}>
                  {leaderboardData.your_position.current_streak}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* View Full Button */}
        <button
          onClick={handleViewFull}
          className="w-full mt-3 md:mt-4 py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs md:text-sm font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Trophy size={14} />
          <span>View Full Leaderboard</span>
        </button>
      </div>
    </div>
  );
};

export default LeaderboardPreview;
