import React, { useState, useEffect } from 'react';
import { Trophy, RefreshCw, AlertCircle } from 'lucide-react';
import StreakLeaderboard from './StreakLeaderboard';
import { streakLeaderboardapi } from '../apiclient/Studystreakapi';

const LeaderboardPage = ({ isMobile }) => {
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      setError(null);
      console.log("Fetching streak leaderboard...");
      const response = await streakLeaderboardapi();
      console.log("Leaderboard response:", response.data);
      setLeaderboardData(response.data);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError(err.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLeaderboard();
  };

  useEffect(() => {
    fetchLeaderboard();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchLeaderboard, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6 p-4 md:p-6 xl:p-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl xl:text-3xl font-bold text-white mb-1 md:mb-2">
              Leaderboard
            </h1>
            <p className="text-sm md:text-base text-slate-400">See how you rank among other learners</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl md:rounded-2xl xl:rounded-3xl p-4 md:p-6 border border-gray-700/50 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center justify-center h-48 md:h-64">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-3 md:mb-4"></div>
              <p className="text-sm md:text-base text-gray-400">Loading leaderboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 md:space-y-6 p-4 md:p-6 xl:p-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h1 className="text-xl md:text-2xl xl:text-3xl font-bold text-white mb-1 md:mb-2">
              Leaderboard
            </h1>
            <p className="text-sm md:text-base text-slate-400">See how you rank among other learners</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm md:text-base w-fit"
          >
            <RefreshCw className={`w-3 h-3 md:w-4 md:h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Retry
          </button>
        </div>
        
        <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 rounded-xl md:rounded-2xl xl:rounded-3xl p-4 md:p-6 border border-red-500/30 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center justify-center h-48 md:h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-red-400 mx-auto mb-3 md:mb-4" />
              <p className="text-sm md:text-base text-red-400 mb-2">Failed to load leaderboard</p>
              <p className="text-xs md:text-sm text-gray-400">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6 xl:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl md:text-2xl xl:text-3xl font-bold text-white mb-1 md:mb-2">
            Leaderboard
          </h1>
          <p className="text-sm md:text-base text-slate-400">See how you rank among other learners</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm md:text-base w-fit"
        >
          <RefreshCw className={`w-3 h-3 md:w-4 md:h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Leaderboard Component */}
      <StreakLeaderboard data={leaderboardData} isMobile={isMobile} />
    </div>
  );
};

export default LeaderboardPage;
