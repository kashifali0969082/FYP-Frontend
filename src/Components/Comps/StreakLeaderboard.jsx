import React, { useState, useEffect } from 'react';
import { Trophy, Flame, Award, Crown, Star, TrendingUp, Zap, Target, Calendar } from 'lucide-react';

const StreakLeaderboard = ({ data, isMobile }) => {
  const [animatedRanks, setAnimatedRanks] = useState([]);

  useEffect(() => {
    // Animate ranks on mount
    const timer = setTimeout(() => {
      setAnimatedRanks(data?.top_users?.map((_, i) => i) || []);
    }, 100);
    return () => clearTimeout(timer);
  }, [data]);

  // Return loading state if no data
  if (!data || !data.top_users) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 border border-gray-700/50 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Flame className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-400">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return (
          <div className="relative">
            <Crown className="w-6 h-6 text-yellow-400 drop-shadow-lg" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
          </div>
        );
      case 2:
        return (
          <div className="relative">
            <Award className="w-6 h-6 text-slate-300 drop-shadow-lg" />
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse"></div>
          </div>
        );
      case 3:
        return (
          <div className="relative">
            <Trophy className="w-6 h-6 text-amber-600 drop-shadow-lg" />
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 flex items-center justify-center">
            <span className="text-gray-300 font-black text-base tracking-tight">#{rank}</span>
          </div>
        );
    }
  };

  const getRankBadgeStyle = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-xl shadow-yellow-500/30 ring-2 ring-yellow-300/50";
      case 2:
        return "bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 text-white shadow-xl shadow-slate-400/30 ring-2 ring-slate-300/50";
      case 3:
        return "bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white shadow-xl shadow-amber-600/30 ring-2 ring-amber-400/50";
      case 4:
        return "bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25 ring-1 ring-purple-400/30";
      case 5:
        return "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-400/30";
      default:
        return "bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 text-gray-200 shadow-lg ring-1 ring-gray-500/30";
    }
  };

  const getStreakColor = (streak) => {
    if (streak >= 100) return "from-red-400 to-red-500";
    if (streak >= 50) return "from-orange-400 to-orange-500";
    if (streak >= 20) return "from-yellow-400 to-yellow-500";
    if (streak >= 10) return "from-green-400 to-green-500";
    return "from-blue-400 to-blue-500";
  };

  const getStreakTextColor = (streak) => {
    if (streak >= 100) return "text-red-400";
    if (streak >= 50) return "text-orange-400";
    if (streak >= 20) return "text-yellow-400";
    if (streak >= 10) return "text-green-400";
    return "text-blue-400";
  };

  const getStreakLevel = (streak) => {
    if (streak >= 200) return { label: "Legendary", icon: "👑" };
    if (streak >= 100) return { label: "Master", icon: "🔥" };
    if (streak >= 50) return { label: "Expert", icon: "⚡" };
    if (streak >= 20) return { label: "Advanced", icon: "🌟" };
    if (streak >= 10) return { label: "Rising", icon: "📈" };
    return { label: "Beginner", icon: "🌱" };
  };

  const getProgressWidth = (current, longest) => {
    return Math.min((current / longest) * 100, 100);
  };

  return (
    <>
      {/* Custom CSS animations */}
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl md:rounded-2xl xl:rounded-3xl p-4 md:p-6 border border-gray-700/50 shadow-2xl backdrop-blur-sm">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4 sm:gap-0">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative">
              <div className="p-2 md:p-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl md:rounded-2xl shadow-lg shadow-purple-500/25">
                <Flame className="w-5 h-5 md:w-7 md:h-7 text-white animate-pulse" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full border-2 border-gray-800 animate-ping"></div>
            </div>
            <div>
              <h2 className="text-lg md:text-xl xl:text-2xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Streak Champions
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                  <span className="text-gray-400 text-xs md:text-sm">{data.stats?.total_active_users || 0} active learners</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-500 rounded-full"></div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                  <span className="text-green-400 text-xs md:text-sm">Live rankings</span>
                </div>
              </div>
            </div>
          </div>
          {data.stats?.you_are_top && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 px-4 py-3 rounded-xl backdrop-blur-sm">
              <Star className="w-5 h-5 text-green-400 animate-spin-slow" />
              <div className="flex flex-col">
                <span className="text-green-400 text-sm font-bold">Champion!</span>
                <span className="text-green-300 text-xs">You're leading</span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Leaderboard */}
        <div className="space-y-4">
          {data.top_users.map((user, index) => {
            const streakLevel = getStreakLevel(user.current_streak);
            const progressWidth = getProgressWidth(user.current_streak, user.longest_streak);
            
            return (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-xl md:rounded-2xl transition-all duration-500 hover:scale-[1.01] md:hover:scale-[1.02] hover:shadow-xl ${
                  user.is_you 
                    ? 'bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-pink-500/15 border border-blue-500/30 shadow-lg shadow-blue-500/10' 
                    : 'bg-gradient-to-r from-gray-750 to-gray-800 border border-gray-700/50 hover:border-gray-600/50'
                } ${animatedRanks.includes(index) ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Rank glow effect for top 3 */}
                {user.rank <= 3 && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                )}
                
                <div className="flex items-center justify-between p-3 md:p-4 xl:p-5 gap-2 md:gap-3">
                  <div className="flex items-center gap-2 md:gap-3 xl:gap-4 flex-1 min-w-0 overflow-hidden">
                    {/* Enhanced Rank Badge */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-8 h-8 md:w-10 md:h-10 xl:w-12 xl:h-12 rounded-lg md:rounded-xl xl:rounded-2xl flex items-center justify-center ${getRankBadgeStyle(user.rank)} transform group-hover:scale-110 transition-all duration-300`}>
                        {user.rank <= 3 ? getRankIcon(user.rank) : (
                          <span className="text-xs md:text-sm xl:text-lg font-black tracking-tight">#{user.rank}</span>
                        )}
                      </div>
                      {user.rank === 1 && (
                        <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-3 h-3 md:w-4 md:h-4">
                          <div className="w-full h-full bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full animate-ping"></div>
                          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                        </div>
                      )}
                      {user.rank === 2 && (
                        <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-slate-300 to-slate-400 rounded-full animate-pulse"></div>
                      )}
                      {user.rank === 3 && (
                        <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full animate-pulse"></div>
                      )}
                    </div>

                    {/* Enhanced User Info */}
                    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2 min-w-0">
                        <span className={`font-bold text-xs md:text-sm xl:text-base truncate ${user.is_you ? 'text-blue-300' : 'text-white'} max-w-[120px] md:max-w-none`}>
                          {user.name.length > (isMobile ? 12 : 20) ? `${user.name.substring(0, isMobile ? 12 : 20)}...` : user.name}
                        </span>
                        {user.is_you && (
                          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-1.5 md:px-2 py-0.5 rounded-full font-medium shadow-lg flex-shrink-0">
                            You
                          </span>
                        )}
                        <div className="flex items-center gap-1 text-xs flex-shrink-0">
                          <span>{streakLevel.icon}</span>
                          <span className="text-gray-400 font-medium hidden lg:inline">{streakLevel.label}</span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="flex items-center gap-1 md:gap-2 mb-1 min-w-0">
                        <div className="flex-1 bg-gray-700 rounded-full h-1 md:h-1.5 overflow-hidden min-w-0">
                          <div 
                            className={`h-full bg-gradient-to-r ${getStreakColor(user.current_streak)} transition-all duration-1000 ease-out rounded-full`}
                            style={{ width: `${progressWidth}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-400 text-xs min-w-[35px] md:min-w-[50px] flex-shrink-0">
                          {user.current_streak}/{user.longest_streak}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-1 min-w-0">
                          <Target className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-500 flex-shrink-0" />
                          <span className="text-gray-400 truncate">Best: <span className="text-gray-300 font-medium">{user.longest_streak}</span></span>
                        </div>
                        {user.current_streak === user.longest_streak && user.current_streak > 0 && (
                          <div className="flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5 md:w-3 md:h-3 text-yellow-400 flex-shrink-0" />
                            <span className="text-yellow-400 text-xs font-medium">Personal Best!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Current Streak Display */}
                  <div className="flex flex-col items-end gap-0.5 md:gap-1 flex-shrink-0">
                    <div className="flex items-center gap-1 md:gap-2">
                      <Flame className={`w-3 h-3 md:w-4 md:h-4 xl:w-5 xl:h-5 ${getStreakTextColor(user.current_streak)} drop-shadow-sm animate-pulse`} />
                      <div className="text-right">
                        <div className={`font-black text-sm md:text-lg xl:text-xl ${getStreakTextColor(user.current_streak)} tracking-tight`}>
                          {user.current_streak}
                        </div>
                        <div className="text-gray-400 text-xs font-medium -mt-0.5">days</div>
                      </div>
                    </div>
                    
                    {/* Streak difference from #1 */}
                    {user.rank > 1 && data.top_users[0] && (
                      <div className="text-xs text-gray-500 bg-gray-800 px-1 md:px-1.5 py-0.5 rounded-md whitespace-nowrap">
                        -{data.top_users[0].current_streak - user.current_streak}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Enhanced Your Position (if not in top 5) */}
          {data.your_position?.show_gap && (
            <>
              <div className="flex items-center justify-center py-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-gray-600 w-16"></div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-600 to-gray-600 w-16"></div>
                </div>
              </div>
              
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-pink-500/15 border border-blue-500/30 shadow-xl shadow-blue-500/10">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-shimmer"></div>
                
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-5 flex-1">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 text-white shadow-xl shadow-blue-500/30 ring-2 ring-blue-400/50">
                      <span className="text-xl font-black tracking-tight">#{data.your_position.rank}</span>
                    </div>
                    
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-lg text-blue-300">Your Position</span>
                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                          Keep Going!
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-1">
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-full bg-gradient-to-r ${getStreakColor(data.your_position.current_streak)} transition-all duration-1000 ease-out rounded-full`}
                            style={{ width: `${getProgressWidth(data.your_position.current_streak, data.your_position.longest_streak)}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-400 text-xs min-w-[60px]">
                          {data.your_position.current_streak}/{data.your_position.longest_streak}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">
                          Best streak: <span className="text-gray-300 font-medium">{data.your_position.longest_streak} days</span>
                        </span>
                        {data.top_users[4] && (
                          <span className="text-blue-400 text-xs">
                            +{data.top_users[4].current_streak - data.your_position.current_streak + 1} to reach top 5
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <Flame className={`w-6 h-6 ${getStreakTextColor(data.your_position.current_streak)} animate-pulse`} />
                      <div className="text-right">
                        <div className={`font-black text-2xl ${getStreakTextColor(data.your_position.current_streak)}`}>
                          {data.your_position.current_streak}
                        </div>
                        <div className="text-gray-400 text-xs font-medium -mt-1">days</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="mt-8 pt-6 border-t border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Study daily to climb up!</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium">
                  {data.stats?.total_active_users || 0} competing
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StreakLeaderboard;
