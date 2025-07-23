import { useState, useEffect } from 'react';
import { Calendar, Flame, Trophy, Target, X } from 'lucide-react';
import { useParams } from 'react-router-dom';


// Main Streak Component for Dashboard
const StreakComponent = ({ streakData, isLoading }) => {
  // Always render component with available data or defaults
  const displayData = streakData || {
    current_streak: 0,
    longest_streak: 0,
    last_active_date: new Date().toISOString().split('T')[0],
  };

  const { current_streak, longest_streak, last_active_date } = displayData;
  
  // Generate days for the streak visualization
  const generateStreakDays = () => {
    const days = [];
    const today = new Date();
    const lastActiveDate = new Date(last_active_date);
    
    console.log("🔥 Streak Debug Info:");
    console.log("  - Current streak:", current_streak);
    console.log("  - Last active date:", last_active_date);
    console.log("  - Today:", today.toISOString().split('T')[0]);
    
    // Generate 7 days (3 past, today, 3 future)
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayOfMonth = date.getDate();
      
      let status = 'future';
      
      // Improved logic for determining streak status
      if (date.toDateString() === today.toDateString()) {
        // Today should be 'active' if current streak > 0, otherwise 'today'
        status = current_streak > 0 ? 'active' : 'today';
      } else if (date < today) {
        // Past dates: check if they're within the current streak from last active date
        const daysDiff = Math.floor((lastActiveDate - date) / (1000 * 60 * 60 * 24));
        const isWithinStreak = daysDiff >= 0 && daysDiff < current_streak;
        status = isWithinStreak ? 'active' : 'inactive';
      } else {
        // Future dates
        status = 'future';
      }
      
      console.log(`  - ${date.toISOString().split('T')[0]}: ${status}`);
      
      days.push({
        date: date,
        dayOfWeek,
        dayOfMonth,
        status,
        isToday: date.toDateString() === today.toDateString()
      });
    }
    
    return days;
  };

  const streakDays = generateStreakDays();



  return (
    <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-xl p-6 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Study Streak</h3>
            <p className="text-white/80 text-sm">Keep it up!</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{current_streak}</div>
          <div className="text-white/80 text-sm">days</div>
        </div>
      </div>

      {/* Streak Days Visualization */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-white/80">Your streak</span>
          <span className="text-sm text-white/80">This week</span>
        </div>
        <div className="flex justify-between gap-1">
          {streakDays.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-xs text-white/70 mb-1">{day.dayOfWeek}</div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                day.status === 'active' 
                  ? 'bg-white text-orange-500 shadow-lg' 
                  : day.status === 'today' 
                  ? 'bg-white/30 text-white border-2 border-white' 
                  : day.status === 'future' 
                  ? 'bg-white/10 text-white/60 border border-white/30' 
                  : 'bg-white/5 text-white/40'
              }`}>
                {day.dayOfMonth}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center pt-3 border-t border-white/20">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-300" />
          <span className="text-sm">Best: {longest_streak} days</span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-green-300" />
          <span className="text-sm">Goal: 30 days</span>
        </div>
      </div>
    </div>
  );
};

// Streak Update Modal
const StreakUpdateModal = ({ isOpen, onClose, updateData, streakData }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const { current_streak, updated } = updateData || {};

  useEffect(() => {
    if (isOpen && updated) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, updated]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full relative overflow-hidden animate-in zoom-in-95 duration-300 delay-150"
           style={{
             animation: isOpen ? 'modalEnter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : undefined
           }}>
        
        {/* Modal entrance animation */}
        <style jsx>{`
          @keyframes modalEnter {
            0% { 
              transform: scale(0.8) translateY(20px); 
              opacity: 0; 
            }
            100% { 
              transform: scale(1) translateY(0); 
              opacity: 1; 
            }
          }
        `}</style>
        {/* Fireworks Animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Firework bursts */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  left: `${30 + Math.random() * 40}%`,
                  top: `${20 + Math.random() * 30}%`,
                  background: ['#fbbf24', '#f59e0b', '#ef4444', '#dc2626', '#10b981', '#3b82f6'][Math.floor(Math.random() * 6)],
                  animation: `firework-${i % 3} ${0.8 + Math.random() * 0.4}s ease-out forwards`,
                  animationDelay: `${Math.random() * 0.5}s`
                }}
              />
            ))}
            
            {/* Sparkles */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="absolute text-yellow-400 animate-pulse"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${15 + Math.random() * 40}%`,
                  fontSize: `${12 + Math.random() * 8}px`,
                  animationDelay: `${Math.random() * 1}s`,
                  animationDuration: `${0.8 + Math.random() * 0.6}s`
                }}
              >
                ✨
              </div>
            ))}
          </div>
        )}

        {/* Keyframe styles */}
        <style jsx>{`
          @keyframes firework-0 {
            0% { transform: scale(0) rotate(0deg); opacity: 1; }
            50% { transform: scale(1.5) rotate(180deg); opacity: 0.8; }
            100% { transform: scale(3) rotate(360deg); opacity: 0; }
          }
          @keyframes firework-1 {
            0% { transform: scale(0) translate(0, 0); opacity: 1; }
            50% { transform: scale(2) translate(20px, -15px); opacity: 0.9; }
            100% { transform: scale(4) translate(40px, -30px); opacity: 0; }
          }
          @keyframes firework-2 {
            0% { transform: scale(0) translate(0, 0); opacity: 1; }
            50% { transform: scale(2) translate(-20px, -10px); opacity: 0.9; }
            100% { transform: scale(4) translate(-40px, -20px); opacity: 0; }
          }
        `}</style>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="text-center">
          {updated ? (
            <>
              {/* Streak Updated */}
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <Flame className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Streak Updated! 🎉
                </h2>
                <p className="text-gray-600 mb-4">
                  You're on fire! Your streak is now
                </p>
                {/* Emphasized Day Count */}
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-lg mb-2 animate-pulse">
                    <span className="text-4xl font-bold text-white">{current_streak}</span>
                  </div>
                  <p className="text-xl font-semibold text-gray-700">
                    day{current_streak !== 1 ? 's' : ''} strong!
                  </p>
                </div>
              </div>

              {/* Milestone Messages */}
              <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                {(() => {
                  const quotes = [
                    "🌟 Great start! Every journey begins with a single step.",
                    "🎯 Day one is done! You're already ahead of yesterday's you.",
                    "💫 First day in the books! Momentum starts now.",
                    "🚀 One day down, infinity to go! You've got this.",
                    "⭐ The hardest part is starting - and you just did it!"
                  ];
                  
                  const weekQuotes = [
                    "🔥 One week strong! You're building an amazing habit.",
                    "💪 Seven days of dedication! You're on fire.",
                    "🏆 A full week! You're proving consistency is your superpower.",
                    "🌟 Week one conquered! You're officially in the zone.",
                    "🎉 Seven days straight! Your future self is thanking you."
                  ];
                  
                  const monthQuotes = [
                    "🏆 30 days! You're officially a study champion!",
                    "👑 One month of excellence! You're absolutely crushing it.",
                    "🌟 30 days strong! You've built something truly special.",
                    "💎 A full month! You're a habit-building legend.",
                    "🎊 30 days of dedication! You're unstoppable now."
                  ];
                  
                  const generalQuotes = [
                    "💪 Keep going! You're building momentum.",
                    "🎯 Every day counts! You're proving your commitment.",
                    "🔥 Consistency is king! You're wearing the crown.",
                    "⚡ You're on a roll! Keep this energy flowing.",
                    "🌟 Small steps, big results! You're doing amazing.",
                    "🚀 Progress over perfection! You're nailing it.",
                    "💫 Your dedication is inspiring! Keep shining.",
                    "🎉 Another day, another victory! You're unstoppable."
                  ];
                  
                  const excellenceQuotes = [
                    "🚀 Incredible consistency! You're on your way to greatness.",
                    "💎 You're in the zone! Excellence is becoming your habit.",
                    "🌟 Your dedication is paying off! Keep reaching for the stars.",
                    "🏆 You're building something extraordinary! Don't stop now.",
                    "⚡ This is what commitment looks like! You're inspiring.",
                    "🔥 You're on fire! Your consistency is absolutely amazing.",
                    "💪 Beast mode activated! You're crushing every single day.",
                    "🎯 Precision and dedication! You're hitting every target."
                  ];
                  
                  let selectedQuotes;
                  if (current_streak === 1) {
                    selectedQuotes = quotes;
                  } else if (current_streak === 7) {
                    selectedQuotes = weekQuotes;
                  } else if (current_streak === 30) {
                    selectedQuotes = monthQuotes;
                  } else if (current_streak > 1 && current_streak < 7) {
                    selectedQuotes = generalQuotes;
                  } else {
                    selectedQuotes = excellenceQuotes;
                  }
                  
                  const randomQuote = selectedQuotes[Math.floor(Math.random() * selectedQuotes.length)];
                  return <p className="text-orange-700 font-medium">{randomQuote}</p>;
                })()}
              </div>
            </>
          ) : (
            <>
              {/* Streak Not Updated */}
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Welcome Back!
                </h2>
                <p className="text-gray-600 mb-4">
                  Your streak remains at
                </p>
                {/* Emphasized Day Count */}
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full shadow-lg mb-2">
                    <span className="text-4xl font-bold text-white">{current_streak}</span>
                  </div>
                  <p className="text-xl font-semibold text-gray-700">
                    day{current_streak !== 1 ? 's' : ''} strong!
                  </p>
                </div>
                <p className="text-gray-600">
                  Keep studying to maintain your momentum!
                </p>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-700 font-medium">📚 Ready to learn something new today?</p>
              </div>
            </>
          )}

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full py-3 px-6 bg-gradient-to-r from-orange-400 to-red-500 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
          >
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  );
};

// Demo Component
const StreakDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('updated'); // 'updated' or 'not-updated'

  // Mock data
  const streakData = {
    user_id: "db391bfe-d580-4855-b4be-19ec6d45e7cc",
    current_streak: 7,
    longest_streak: 12,
    last_active_date: "2025-07-18",
    updated_at: "2025-07-18T01:53:45.384593"
  };

  const updateDataUpdated = {
    current_streak: 8,
    updated: true
  };

  const updateDataNotUpdated = {
    current_streak: 7,
    updated: false
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center mb-8">Streak Component Demo</h1>
        
        {/* Dashboard Component */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Dashboard Component</h2>
          <StreakComponent streakData={streakData} />
        </div>

        {/* Modal Triggers */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Modal Demos</h2>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setModalType('updated');
                setIsModalOpen(true);
              }}
              className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Show Updated Modal
            </button>
            <button
              onClick={() => {
                setModalType('not-updated');
                setIsModalOpen(true);
              }}
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Show Not Updated Modal
            </button>
          </div>
        </div>

        {/* Modal */}
        <StreakUpdateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          updateData={modalType === 'updated' ? updateDataUpdated : updateDataNotUpdated}
          streakData={streakData}
        />
      </div>
    </div>
  );
};

export default StreakDemo;
export { StreakComponent, StreakUpdateModal };