import React, { useState, useEffect } from "react";
import {
  Brain,
  Eye,
  PenTool,
  Hand,
  CheckCircle,
} from "lucide-react";

const LearningProfileResultsModal = ({ isOpen, onClose, resultsData }) => {
  const [countdown, setCountdown] = useState(15);

  // Auto-close countdown
  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isOpen && countdown === 0) {
      onClose();
    }
  }, [isOpen, countdown, onClose]);

  // Reset countdown when modal opens
  useEffect(() => {
    if (isOpen) {
      setCountdown(15);
    }
  }, [isOpen]);

  const getStyleIcon = (style) => {
    switch (style) {
      case "Visual":
        return <Eye className="w-5 h-5" />;
      case "ReadingWriting":
        return <PenTool className="w-5 h-5" />;
      case "Kinesthetic":
        return <Hand className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getStyleColor = (style) => {
    switch (style) {
      case "Visual":
        return "text-blue-600 bg-blue-50";
      case "ReadingWriting":
        return "text-green-600 bg-green-50";
      case "Kinesthetic":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStyleDescription = (style) => {
    switch (style) {
      case "Visual":
        return "You learn best through visual aids like diagrams, charts, and videos.";
      case "ReadingWriting":
        return "You prefer learning through reading and writing with text-based information.";
      case "Kinesthetic":
        return "You learn best through hands-on activities and practical experiences.";
      default:
        return "You have a balanced learning style combining multiple approaches.";
    }
  };

  if (!isOpen || !resultsData) return null;

  const { styleScores, dominantStyle } = resultsData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 animate-slideUp">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Your Learning Profile
          </h2>
          <p className="text-gray-600">Assessment Complete! 🎉</p>
        </div>

        {/* Dominant Style */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Your Dominant Learning Style
            </h3>
            <div className="text-center mb-4">
              <div
                className={`inline-flex items-center gap-3 px-5 py-3 rounded-full ${getStyleColor(
                  dominantStyle
                )} text-xl font-bold`}
              >
                <div className="text-2xl">
                  {getStyleIcon(dominantStyle)}
                </div>
                <span className="text-gray-800">
                  {dominantStyle.replace(/([A-Z])/g, " $1").trim()}
                </span>
              </div>
            </div>
            <p className="text-gray-700 text-center leading-relaxed">
              {getStyleDescription(dominantStyle)}
            </p>
          </div>
        </div>

        {/* Style Breakdown */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Style Breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(styleScores).map(([style, score]) => (
              <div
                key={style}
                className="bg-gray-50 p-3 rounded-xl border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${getStyleColor(style)}`}>
                      {getStyleIcon(style)}
                    </div>
                    <span className="font-medium text-gray-800 text-sm">
                      {style.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-600">
                    {score}/15
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000"
                    style={{ width: `${(score / 15) * 100}%` }}
                  ></div>
                </div>
                <div className="text-right mt-1">
                  <span className="text-xs text-gray-500">
                    {Math.round((score / 15) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="text-center pt-4 border-t border-gray-200">
          <div className="mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-blue-800 text-sm">
                Modal closes automatically in <span className="font-bold text-blue-600">{countdown}</span> seconds
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 justify-center"
            >
              <CheckCircle className="w-4 h-4" />
              Close & Continue
            </button>
            
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2 justify-center"
            >
              <Brain className="w-4 h-4" />
              Save Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningProfileResultsModal;
