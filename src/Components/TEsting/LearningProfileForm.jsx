import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Brain,
  Clock,
  Music,
  Target,
  Eye,
  PenTool,
  Hand,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { createlearningprofileformapi } from "../apiclient/LearningProfileapis";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { setCookie } from "../Security/cookie";

const LearningProfileForm = ({ onComplete }) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [responses, setResponses] = useState({
    section_1: {},
    section_2: {},
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [progress, setProgress] = useState({ section1: 0, section2: 0 });
  const [countdown, setCountdown] = useState(15);
  const [showResultsModal, setShowResultsModal] = useState(false);

  // Load saved progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('learningProfileProgress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setResponses(parsed);
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage whenever responses change
  useEffect(() => {
    localStorage.setItem('learningProfileProgress', JSON.stringify(responses));
    
    // Update progress percentages
    const section1Progress = (Object.keys(responses.section_1).length / LEARNING_PROFILE_FORM.section_1.questions.length) * 100;
    const section2Progress = (Object.keys(responses.section_2).length / LEARNING_PROFILE_FORM.section_2.questions.length) * 100;
    
    setProgress({ 
      section1: Math.round(section1Progress), 
      section2: Math.round(section2Progress) 
    });
  }, [responses]);

  // Auto-redirect countdown for results modal
  useEffect(() => {
    if (showResultsModal && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showResultsModal && countdown === 0) {
      setShowResultsModal(false);
      onComplete();
    }
  }, [showResultsModal, countdown, onComplete]);

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSection]);

  const handleSubmit = async () => {
    if (isSection1Complete() && isSection2Complete()) {
      setIsSubmitting(true);
      setSubmitError(null);
      
      try {
        // Build dynamic data from actual user responses
        const formData = {
          ratings: LEARNING_PROFILE_FORM.section_1.questions.map((q, index) => ({
            question: q.question,
            style: q.style,
            score: responses.section_1[index] || 0
          })),
          mcqs: [
            // Hardcoded responses for first two questions
            {
              question: "When are you most productive?",
              answer: "Afternoon (12-6 PM)" // Default hardcoded value
            },
            {
              question: "How do you usually study?",
              answer: "Complete Silence" // Default hardcoded value
            },
            // User responses for remaining questions
            ...LEARNING_PROFILE_FORM.section_2.questions.map((q, index) => {
              const selectedOption = q.options.find(opt => opt.value === responses.section_2[index]);
              return {
                question: q.question,
                answer: selectedOption ? selectedOption.label : ""
              };
            })
          ]
        };

        console.log("Submitting actual user data:", formData);
        const response = await createlearningprofileformapi(formData);
        
        // Clear saved progress on successful submission
        localStorage.removeItem('learningProfileProgress');
        setCookie("learningProfileSubmitted", "true", 365);
        
        setSubmitted(true);
        
        // Show results modal immediately
        setShowResultsModal(true);
        setCountdown(15); // Reset countdown
        
      } catch (error) {
        console.error("Submission error:", error);
        setSubmitError(
          error.response?.data?.message || 
          "Failed to submit assessment. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const LEARNING_PROFILE_FORM = {
    section_1: {
      title: "Learning Style Preferences",
      instruction:
        "Rate how much you agree with the following: 1 (Strongly Disagree) → 5 (Strongly Agree)",
      type: "rating",
      questions: [
        {
          style: "Visual",
          question: "I understand better with diagrams or visual aids.",
        },
        {
          style: "Visual",
          question: "Watching videos or animations helps me learn faster.",
        },
        {
          style: "ReadingWriting",
          question: "I learn effectively by reading or writing about a topic.",
        },
        {
          style: "ReadingWriting",
          question:
            "I prefer written instructions over videos or explanations.",
        },
        {
          style: "Kinesthetic",
          question: "I understand best by doing hands-on activities.",
        },
        {
          style: "Kinesthetic",
          question: "I enjoy solving real-world problems or doing experiments.",
        },
        {
          style: "Visual",
          question: "I remember things best when I visualize them.",
        },
        {
          style: "ReadingWriting",
          question: "I retain info better when I write it down.",
        },
        {
          style: "Kinesthetic",
          question: "I get bored quickly in passive learning situations.",
        },
      ],
    },
    section_2: {
      title: "Behavior & Preferences",
      instruction: "Select the one that best describes you.",
      type: "mcq",
      questions: [
        {
          question: "Your learning goal right now?",
          options: [
            { value: "pass_exams", label: "Pass Exams/Tests" },
            { value: "deep_understanding", label: "Deep Understanding" },
            { value: "job_prep", label: "Job Preparation" },
            { value: "curious", label: "Personal Curiosity" },
          ],
        },
        {
          question: "What distracts you the most during study?",
          options: [
            { value: "phone_notifications", label: "Phone Notifications" },
            { value: "social_media", label: "Social Media" },
            { value: "noise", label: "Background Noise" },
            { value: "fatigue", label: "Fatigue/Tiredness" },
          ],
        },
      ],
    },
  };

  const handleRatingChange = (questionIndex, rating) => {
    setResponses((prev) => ({
      ...prev,
      section_1: {
        ...prev.section_1,
        [questionIndex]: rating,
      },
    }));
  };

  const handleMCQChange = (questionIndex, value) => {
    setResponses((prev) => ({
      ...prev,
      section_2: {
        ...prev.section_2,
        [questionIndex]: value,
      },
    }));
  };

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

  const isSection1Complete = () => {
    return (
      Object.keys(responses.section_1).length ===
      LEARNING_PROFILE_FORM.section_1.questions.length
    );
  };

  const isSection2Complete = () => {
    return (
      Object.keys(responses.section_2).length ===
      LEARNING_PROFILE_FORM.section_2.questions.length
    );
  };
  //  const navigate = useNavigate();

  const calculateResults = () => {
    const styleScores = { Visual: 0, ReadingWriting: 0, Kinesthetic: 0 };

    LEARNING_PROFILE_FORM.section_1.questions.forEach((q, index) => {
      const score = responses.section_1[index] || 0;
      styleScores[q.style] += score;
    });

    const dominantStyle = Object.entries(styleScores).reduce((a, b) =>
      styleScores[a[0]] > styleScores[b[0]] ? a : b
    )[0];

    return { styleScores, dominantStyle };
  };

  if (submitted) {
    const { styleScores, dominantStyle } = calculateResults();

    const getStyleDescription = (style) => {
      switch (style) {
        case "Visual":
          return "You learn best through visual aids like diagrams, charts, and videos. Visual learners benefit from mind maps, infographics, and colorful notes.";
        case "ReadingWriting":
          return "You prefer learning through reading and writing. You excel with text-based information, note-taking, and written assignments.";
        case "Kinesthetic":
          return "You learn best through hands-on activities and movement. You benefit from interactive exercises, experiments, and practical applications.";
        default:
          return "You have a balanced learning style that combines multiple approaches.";
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-3">
                Your Learning Profile
              </h2>
              <p className="text-gray-600 text-lg">Assessment Complete! 🎉</p>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Dominant Style */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                  Your Dominant Learning Style
                </h3>
                <div className="text-center mb-6">
                  <div
                    className={`inline-flex items-center gap-4 px-6 py-4 rounded-full ${getStyleColor(
                      dominantStyle
                    )} text-2xl font-bold`}
                  >
                    <div className="text-3xl">
                      {getStyleIcon(dominantStyle)}
                    </div>
                    <span className="text-gray-800">
                      {dominantStyle.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 text-center leading-relaxed text-lg">
                  {getStyleDescription(dominantStyle)}
                </p>
              </div>
            </div>

            {/* Style Breakdown */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                Style Breakdown
              </h3>
              <div className="space-y-2">
                {Object.entries(styleScores).map(([style, score]) => (
                  <div
                    key={style}
                    className="bg-gray-50 p-2 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${getStyleColor(style)}`}>
                          <div className="w-4 h-4 flex items-center justify-center">
                            {style === "Visual" && <Eye className="w-3.5 h-3.5" />}
                            {style === "ReadingWriting" && <PenTool className="w-3.5 h-3.5" />}
                            {style === "Kinesthetic" && <Hand className="w-3.5 h-3.5" />}
                          </div>
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
                    <div className="text-right mt-0.5">
                      <span className="text-xs text-gray-500">
                        {Math.round((score / 15) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center pt-6 border-t border-gray-200">
              <div className="mb-6">
                <p className="text-gray-600 mb-3">
                  Your learning profile has been saved and will be used to personalize your experience.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm">
                    🎉 <strong>Success!</strong> Redirecting to dashboard in <span className="font-bold text-blue-600">{countdown}</span> seconds...
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  localStorage.removeItem('learningProfileProgress');
                  onComplete();
                }}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 justify-center mx-auto"
              >
                <CheckCircle className="w-5 h-5" />
                Go to Dashboard Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Modal - Shows immediately after submission
  if (showResultsModal) {
    const { styleScores, dominantStyle } = calculateResults();

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

    return (
      <>
        {/* Dashboard Background */}
        <div className="min-h-screen bg-gray-100 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Your Learning Stats</h2>
                <p>View your learning progress and achievements.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
                <p>Check out your recent learning activities.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
                <p>Personalized learning recommendations for you.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto transform transition-all duration-300">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center animate-pulse">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Your Learning Profile
              </h2>
              <p className="text-gray-600">Assessment Complete! 🎉</p>
            </div>

            {/* Dominant Style */}
            <div className="mb-4">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                  Your Dominant Learning Style
                </h3>
                <div className="text-center mb-3">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStyleColor(
                      dominantStyle
                    )} text-lg font-bold`}
                  >
                    <div className="text-xl">
                      {getStyleIcon(dominantStyle)}
                    </div>
                    <span className="text-gray-800">
                      {dominantStyle.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 text-center leading-relaxed text-sm">
                  {getStyleDescription(dominantStyle)}
                </p>
              </div>
            </div>

            {/* Style Breakdown */}
            <div className="mb-4">
              <h3 className="text-md font-semibold text-gray-800 mb-2 text-center">
                Style Breakdown
              </h3>
              <div className="space-y-1">
                {Object.entries(styleScores).map(([style, score]) => (
                  <div
                    key={style}
                    className="bg-gray-50 p-1.5 rounded border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5">
                        <div className={`p-0.5 rounded ${getStyleColor(style)}`}>
                          <div className="w-3 h-3 flex items-center justify-center">
                            {style === "Visual" && <Eye className="w-2.5 h-2.5" />}
                            {style === "ReadingWriting" && <PenTool className="w-2.5 h-2.5" />}
                            {style === "Kinesthetic" && <Hand className="w-2.5 h-2.5" />}
                          </div>
                        </div>
                        <span className="font-medium text-gray-800 text-xs">
                          {style.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-600">
                        {score}/15
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="h-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000"
                        style={{ width: `${(score / 15) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-right mt-0.5">
                      <span className="text-xs text-gray-500">
                        {Math.round((score / 15) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="text-center pt-3 border-t border-gray-200">
              <div className="mb-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3">
                  <p className="text-blue-800 text-xs">
                    Modal closes automatically in <span className="font-bold text-blue-600">{countdown}</span> seconds
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setShowResultsModal(false);
                  onComplete();
                }}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 justify-center mx-auto"
              >
                <CheckCircle className="w-4 h-4" />
                Close & Continue to Dashboard
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Learning Profile Assessment
          </h1>
          <p className="text-gray-600 text-lg">
            Discover your unique learning style and preferences
          </p>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  currentSection === 1
                    ? "bg-indigo-600 text-white ring-4 ring-indigo-200"
                    : progress.section1 === 100
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {progress.section1 === 100 ? <CheckCircle className="w-6 h-6" /> : "1"}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {progress.section1}% Complete
              </span>
            </div>
            
            <div className="flex flex-col items-center">
              <div
                className={`h-2 w-24 rounded-full transition-all ${
                  currentSection === 2 ? "bg-indigo-600" : "bg-gray-300"
                }`}
              >
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${currentSection === 2 ? 100 : progress.section1}%` }}
                />
              </div>
            </div>
            
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  currentSection === 2
                    ? "bg-indigo-600 text-white ring-4 ring-indigo-200"
                    : progress.section2 === 100
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {progress.section2 === 100 ? <CheckCircle className="w-6 h-6" /> : "2"}
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {progress.section2}% Complete
              </span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 text-lg font-medium">
              Step {currentSection} of 2
            </p>
            <p className="text-sm text-gray-500">
              {currentSection === 1 
                ? "Learning Style Assessment" 
                : "Behavior & Preferences"
              }
            </p>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          {currentSection === 1 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {LEARNING_PROFILE_FORM.section_1.title}
                </h2>
                <p className="text-gray-600">
                  {LEARNING_PROFILE_FORM.section_1.instruction}
                </p>
              </div>

              <div className="space-y-6">
                {LEARNING_PROFILE_FORM.section_1.questions.map((q, index) => {
                  const isAnswered = responses.section_1[index] !== undefined;
                  const selectedRating = responses.section_1[index];
                  
                  return (
                    <div
                      key={index}
                      className={`p-6 rounded-2xl transition-all duration-300 ${
                        isAnswered 
                          ? 'bg-green-50 border-2 border-green-200' 
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`p-2 rounded-lg ${getStyleColor(q.style)}`}
                          >
                            {getStyleIcon(q.style)}
                          </div>
                          {isAnswered && (
                            <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <p className="text-gray-800 font-medium pr-4">
                              {index + 1}. {q.question}
                            </p>
                            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full whitespace-nowrap">
                              Question {index + 1} of {LEARNING_PROFILE_FORM.section_1.questions.length}
                            </span>
                          </div>
                          <span
                            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getStyleColor(
                              q.style
                            )}`}
                          >
                            {q.style.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm font-medium text-gray-600 px-2">
                          <span>Strongly Disagree</span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {selectedRating ? `Selected: ${selectedRating}` : 'Not answered'}
                          </span>
                          <span>Strongly Agree</span>
                        </div>
                        <div className="flex gap-2 justify-center">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => handleRatingChange(index, rating)}
                              className={`w-14 h-14 rounded-full border-2 font-medium transition-all hover:scale-110 flex items-center justify-center ${
                                responses.section_1[index] === rating
                                  ? "bg-indigo-600 border-indigo-600 text-white shadow-lg scale-110"
                                  : "border-gray-300 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50"
                              }`}
                            >
                              {rating}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setCurrentSection(2)}
                  disabled={!isSection1Complete()}
                  className={`px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
                    isSection1Complete()
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Next Section
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentSection === 2 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {LEARNING_PROFILE_FORM.section_2.title}
                </h2>
                <p className="text-gray-600">
                  {LEARNING_PROFILE_FORM.section_2.instruction}
                </p>
              </div>

              <div className="space-y-8">
                {LEARNING_PROFILE_FORM.section_2.questions.map((q, qIndex) => {
                  const isAnswered = responses.section_2[qIndex] !== undefined;
                  const selectedOption = responses.section_2[qIndex];
                  
                  const getQuestionIcon = (index) => {
                    switch (index) {
                      case 0: return <Target className="w-5 h-5 text-indigo-600" />;
                      case 1: return <AlertCircle className="w-5 h-5 text-indigo-600" />;
                      default: return <Brain className="w-5 h-5 text-indigo-600" />;
                    }
                  };

                  return (
                    <div 
                      key={qIndex} 
                      className={`p-6 rounded-2xl transition-all duration-300 ${
                        isAnswered 
                          ? 'bg-green-50 border-2 border-green-200' 
                          : 'bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex items-center gap-2">
                          {getQuestionIcon(qIndex)}
                          {isAnswered && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-800">
                            {qIndex + 1}. {q.question}
                          </h3>
                          {selectedOption && (
                            <p className="text-sm text-green-600 mt-1">
                              Selected: {q.options.find(opt => opt.value === selectedOption)?.label}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                          Question {qIndex + 1} of {LEARNING_PROFILE_FORM.section_2.questions.length}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((option, oIndex) => (
                          <button
                            key={oIndex}
                            onClick={() => handleMCQChange(qIndex, option.value)}
                            className={`p-4 rounded-xl text-left transition-all border-2 hover:scale-105 ${
                              responses.section_2[qIndex] === option.value
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg scale-105"
                                : "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md hover:bg-indigo-50 text-gray-800"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-current">{option.label}</span>
                              {responses.section_2[qIndex] === option.value && (
                                <CheckCircle className="w-5 h-5 text-white" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentSection(1)}
                  className="px-8 py-3 rounded-xl font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="flex flex-col items-end">
                  {submitError && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {submitError}
                    </div>
                  )}
                  
                  <button
                    onClick={handleSubmit}
                    disabled={!isSection2Complete() || isSubmitting}
                    className={`px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                      isSection2Complete() && !isSubmitting
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:scale-105"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Complete Assessment
                      </>
                    )}
                  </button>
                  
                  {!isSection2Complete() && (
                    <p className="text-xs text-gray-500 mt-2">
                      Please answer all questions to continue
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningProfileForm;
