import React, { useState, useEffect } from 'react';
import { X, Flame } from 'lucide-react';

const StreakUpdateModal = ({ isOpen, onClose, streakData }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const { current_streak, updated } = streakData || {};

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
      <div 
        className="bg-white rounded-2xl p-6 max-w-md w-full relative overflow-hidden animate-in zoom-in-95 duration-300 delay-150"
        style={{
          animation: isOpen ? 'modalEnter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : undefined
        }}
      >
        
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
                  background: ['#3b82f6', '#1d4ed8', '#2563eb', '#1e40af', '#1e3a8a', '#312e81'][Math.floor(Math.random() * 6)],
                  animation: `firework-${i % 3} ${0.8 + Math.random() * 0.4}s ease-out forwards`,
                  animationDelay: `${Math.random() * 0.5}s`
                }}
              />
            ))}
            
            {/* Sparkles */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`sparkle-${i}`}
                className="absolute text-blue-400 animate-pulse"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${15 + Math.random() * 40}%`,
                  fontSize: `${12 + Math.random() * 8}px`,
                  animationDelay: `${Math.random() * 1}s`,
                  animationDuration: `${0.8 + Math.random() * 0.6}s`
                }}
              >
                ⭐
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
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
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
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg mb-2 animate-pulse">
                    <span className="text-4xl font-bold text-white">{current_streak}</span>
                  </div>
                  <p className="text-xl font-semibold text-gray-700">
                    day{current_streak !== 1 ? 's' : ''} strong!
                  </p>
                </div>
              </div>

              {/* Milestone Messages */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
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
                  return <p className="text-blue-700 font-medium">{randomQuote}</p>;
                })()}
              </div>

              {/* Action Button */}
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                Keep Going! 🚀
              </button>
            </>
          ) : (
            <>
              {/* Fallback content if no update data */}
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                  <Flame className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Keep Going!
                </h2>
                <p className="text-gray-600 mb-4">
                  Your streak is looking great!
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
              >
                Continue
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StreakUpdateModal;
