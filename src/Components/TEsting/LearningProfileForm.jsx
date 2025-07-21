import React, { useState } from "react";
import {
  ChevronRight,
  Brain,
  Clock,
  Music,
  Target,
  Eye,
  PenTool,
  Hand,
} from "lucide-react";
import { createlearningprofileformapi } from "../apiclient/LearningProfileapis";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { setCookie } from "../Security/cookie";
const LearningProfileForm = ({ onComplete}) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [responses, setResponses] = useState({
    section_1: {},
    section_2: {},
  });
  const [submitted, setSubmitted] = useState(false);
   const formData = {
    ratings: [
      {
        question: "I understand better with diagrams or visual aids.",
        style: "Visual",
        score: 5,
      },
      {
        question: "Watching videos or animations helps me learn faster.",
        style: "Visual",
        score: 4,
      },
      {
        question: "I learn effectively by reading or writing about a topic.",
        style: "ReadingWriting",
        score: 3,
      },
      {
        question: "I prefer written instructions over videos or explanations.",
        style: "ReadingWriting",
        score: 4,
      },
      {
        question: "I understand best by doing hands-on activities.",
        style: "Kinesthetic",
        score: 2,
      },
      {
        question: "I enjoy solving real-world problems or doing experiments.",
        style: "Kinesthetic",
        score: 3,
      },
    ],
    mcqs: [
      {
        question: "What time of day do you feel most productive?",
        answer: "Late morning",
      },
      {
        question: "How do you usually study?",
        answer: "In silence",
      },
      {
        question: "What is your main learning goal?",
        answer: "Deep understanding",
      },
      {
        question: "What distracts you the most during study?",
        answer: "Phone notifications",
      },
    ],
  };
  console.log(formData)
  const handleSubmit = async () => {
 //  const token = Cookies.get("access_token")
    if (isSection1Complete() && isSection2Complete()) {
      try {
        //setShowForm(false)
        const response = await createlearningprofileformapi(formData)
            //console.log(response.data.formData)
            setCookie("learningProfileSubmitted", "true", 365);
              onComplete();  // hide form and then go to dashbord
        //console.log("Profile form created:", response.data);
       // onComplete();
        //   navigate("/dashboard")
      }catch (error) {
    if (error.response) {
      console.error("API Error:", error.response.data);
    } else {
      console.error("Unexpected Error:", error.message);
    }
  }

      setSubmitted(true);
      // Here you would typically send the data to a server
      console.log("Form submitted:", responses);
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
          question: "When are you most productive?",
          options: [
            { value: "early_morning", label: "Early Morning (6-9 AM)" },
            { value: "late_morning", label: "Late Morning (9-12 PM)" },
            { value: "afternoon", label: "Afternoon (12-6 PM)" },
            { value: "evening", label: "Evening (6-10 PM)" },
          ],
        },
        {
          question: "How do you usually study?",
          options: [
            { value: "silence", label: "Complete Silence" },
            { value: "music", label: "With Background Music" },
            { value: "cafe_noise", label: "Ambient/Café Noise" },
            { value: "with_person", label: "With Other People" },
          ],
        },
        {
          question: "Your learning goal right now?",
          options: [
            { value: "pass_exams", label: "Pass Exams/Tests" },
            { value: "deep_understanding", label: "Deep Understanding" },
            { value: "job_prep", label: "Job Preparation" },
            { value: "curious", label: "Personal Curiosity" },
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

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Your Learning Profile
              </h2>
              <p className="text-gray-600">Assessment Complete!</p>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Dominant Learning Style
                </h3>
                <div
                  className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${getStyleColor(
                    dominantStyle
                  )}`}
                >
                  {getStyleIcon(dominantStyle)}
                  <span className="font-medium text-lg">
                    {dominantStyle.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </div>
              </div>

              <div className="grid gap-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Style Breakdown
                </h3>
                {Object.entries(styleScores).map(([style, score]) => (
                  <div
                    key={style}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getStyleColor(style)}`}>
                        {getStyleIcon(style)}
                      </div>
                      <span className="font-medium">
                        {style.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
                          style={{ width: `${(score / 15) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {score}/15
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
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

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentSection === 1
                  ? "bg-indigo-600 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              1
            </div>
            <div
              className={`h-1 w-20 rounded ${
                currentSection === 2 ? "bg-indigo-600" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentSection === 2
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              2
            </div>
          </div>
          <p className="text-center text-gray-600">
            Step {currentSection} of 2
          </p>
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
                {LEARNING_PROFILE_FORM.section_1.questions.map((q, index) => (
                  <div
                    key={index}
                    className="p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`p-2 rounded-lg ${getStyleColor(q.style)}`}
                      >
                        {getStyleIcon(q.style)}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">
                          {q.question}
                        </p>
                        <span
                          className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStyleColor(
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
                        <span>Strongly Agree</span>
                      </div>
                      <div className="flex gap-2 justify-center">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => handleRatingChange(index, rating)}
                            className={`w-12 h-12 rounded-full border-2 font-medium transition-all hover:scale-110 ${
                              responses.section_1[index] === rating
                                ? "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                                : "border-gray-300 text-gray-600 hover:border-indigo-300"
                            }`}
                          >
                            {rating}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 px-2">
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                      </div>
                    </div>
                  </div>
                ))}
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
                {LEARNING_PROFILE_FORM.section_2.questions.map((q, qIndex) => (
                  <div key={qIndex} className="p-6 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                      {qIndex === 0 && (
                        <Clock className="w-5 h-5 text-indigo-600" />
                      )}
                      {qIndex === 1 && (
                        <Music className="w-5 h-5 text-indigo-600" />
                      )}
                      {qIndex === 2 && (
                        <Target className="w-5 h-5 text-indigo-600" />
                      )}
                      <h3 className="text-lg font-medium text-gray-800">
                        {q.question}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {q.options.map((option, oIndex) => (
                        <button
                          key={oIndex}
                          onClick={() => handleMCQChange(qIndex, option.value)}
                          className={`p-4 rounded-xl text-left transition-all border-2 ${
                            responses.section_2[qIndex] === option.value
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                              : "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentSection(1)}
                  className="px-8 py-3 rounded-xl font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!isSection2Complete()}
                  className={`px-8 py-3 rounded-xl font-medium transition-all ${
                    isSection2Complete()
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Complete Assessment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningProfileForm;
