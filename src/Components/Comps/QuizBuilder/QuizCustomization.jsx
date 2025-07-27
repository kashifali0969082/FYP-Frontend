import React, { useState } from 'react';
import {
  Settings,
  Hash,
  Target,
  Brain,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Play,
  ArrowLeft,
  Loader2,
  Download,
  FileText
} from 'lucide-react';
import { quizgenerateapi } from '../../apiclient/QuizGeneratorapi';
import { FileUpload } from '../../apiclient/Filesapi';

export const QuizCustomization = ({ 
  selectedDocument, 
  onBack, 
  onGenerateQuiz,
  isGenerating = false 
}) => {
  const [quizConfig, setQuizConfig] = useState({
    sections: [],
    numQuestions: 10,
    difficulty: 'Medium',
    query: '',
    model: 'OpenAI GPT-4',
    includeExplanations: true,
    submissionStyle: 'Submit At the End',
    quizAction: 'attempt' // 'attempt' or 'download'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const difficultyOptions = ['Easy', 'Medium', 'Hard', 'Mix'];
  const modelOptions = [
    'OpenAI GPT-4',
    'Claude 3',
    'Gemini 1.5',
    'Groq Mixtral'
  ];

  const handleSubmit = () => {
    // Validate that query is not empty
    if (!quizConfig.query.trim()) {
      alert('Please specify a topic for the quiz.');
      return;
    }
    onGenerateQuiz(quizConfig);
  };

  const updateConfig = (key, value) => {
    setQuizConfig(prev => {
      const newConfig = { ...prev, [key]: value };
      
      // Automatically set includeExplanations to true when download is selected
      if (key === 'quizAction' && value === 'download') {
        newConfig.includeExplanations = true;
      }
      
      return newConfig;
    });
  };
 
  return (
    <div className="space-y-8">
      {/* Header with Breadcrumb */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-sm text-slate-400 mb-2">
            <span>Step 1: Document Selection</span>
            <ChevronDown size={16} className="rotate-[-90deg]" />
            <span className="text-blue-400">Step 2: Customize Your Quiz</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Customize Your Quiz
          </h2>
        </div>
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </div>

      {/* Selected Document Display */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MessageSquare size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-medium text-white">{selectedDocument.name}</h3>
            <p className="text-sm text-slate-400">{selectedDocument.type} • {selectedDocument.uploadDate}</p>
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="space-y-6">
        {/* Number of Questions */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-white font-medium">
            <Hash size={18} className="text-blue-400" />
            <span>Number of Questions</span>
          </label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => updateConfig('numQuestions', Math.max(5, quizConfig.numQuestions - 5))}
              className="w-10 h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              −
            </button>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg px-4 py-2 min-w-[80px] text-center">
              <span className="text-white font-medium">{quizConfig.numQuestions}</span>
            </div>
            <button
              onClick={() => updateConfig('numQuestions', Math.min(50, quizConfig.numQuestions + 5))}
              className="w-10 h-10 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              +
            </button>
            <span className="text-slate-400 text-sm">Max: 50 questions</span>
          </div>
        </div>

        {/* Difficulty Level */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-white font-medium">
            <Target size={18} className="text-blue-400" />
            <span>Difficulty Level</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {difficultyOptions.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => updateConfig('difficulty', difficulty)}
                className={`
                  px-4 py-3 rounded-lg border transition-all duration-300 text-center
                  ${quizConfig.difficulty === difficulty
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-blue-500 text-white'
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-slate-600/50'
                  }
                `}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        {/* Quiz Action */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-white font-medium">
            <FileText size={18} className="text-blue-400" />
            <span>What would you like to do?</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => updateConfig('quizAction', 'attempt')}
              className={`
                flex items-center justify-center space-x-3 px-6 py-4 rounded-lg border transition-all duration-300
                ${quizConfig.quizAction === 'attempt'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-blue-500 text-white shadow-lg'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-slate-600/50 hover:bg-slate-800/70'
                }
              `}
            >
              <Play size={20} />
              <div className="text-left">
                <div className="font-medium">Attempt Quiz</div>
                <div className="text-sm opacity-80">Take the quiz immediately</div>
              </div>
            </button>
            
            <button
              onClick={() => updateConfig('quizAction', 'download')}
              className={`
                flex items-center justify-center space-x-3 px-6 py-4 rounded-lg border transition-all duration-300
                ${quizConfig.quizAction === 'download'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-500 text-white shadow-lg'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-slate-600/50 hover:bg-slate-800/70'
                }
              `}
            >
              <Download size={20} />
              <div className="text-left">
                <div className="font-medium">Download Quiz</div>
                <div className="text-sm opacity-80">Save as PDF/Document</div>
              </div>
            </button>
          </div>
        </div>

        {/* Query/Topic Input */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-white font-medium">
            <MessageSquare size={18} className="text-blue-400" />
            <span>Specific Topic <span className="text-red-400">*</span></span>
          </label>
          <input
            type="text"
            placeholder="e.g., Sorting Algorithms from Chapter 2"
            value={quizConfig.query}
            onChange={(e) => updateConfig('query', e.target.value)}
            className={`w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm border rounded-lg text-white placeholder-slate-400 focus:outline-none transition-all ${
              quizConfig.query.trim() 
                ? 'border-slate-700/50 focus:border-blue-500/50' 
                : 'border-red-500/50 focus:border-red-500/70'
            }`}
            required
          />
          {!quizConfig.query.trim() && (
            <p className="text-red-400 text-sm">Topic specification is required</p>
          )}
        </div>

        {/* Model Selector */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-white font-medium">
            <Brain size={18} className="text-blue-400" />
            <span>AI Model</span>
          </label>
          <select
            value={quizConfig.model}
            onChange={(e) => updateConfig('model', e.target.value)}
            className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-blue-500/50 transition-all"
          >
            {modelOptions.map((model) => (
              <option key={model} value={model} className="bg-slate-800">
                {model}
              </option>
            ))}
          </select>
        </div>

        {/* Include Explanations Toggle */}
        <div className={`flex items-center justify-between p-4 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg transition-all ${
          quizConfig.quizAction === 'download' ? 'opacity-50 cursor-not-allowed' : ''
        }`}>
          <div>
            <h4 className="text-white font-medium">Include Explanations</h4>
            <p className="text-sm text-slate-400">
              {quizConfig.quizAction === 'download' 
                ? 'Explanations are automatically included in downloads' 
                : 'Show explanations for each answer'
              }
            </p>
          </div>
          <button
            onClick={() => {
              if (quizConfig.quizAction !== 'download') {
                updateConfig('includeExplanations', !quizConfig.includeExplanations);
              }
            }}
            disabled={quizConfig.quizAction === 'download'}
            className={`
              relative w-12 h-6 rounded-full transition-colors duration-300 disabled:cursor-not-allowed
              ${quizConfig.quizAction === 'download' 
                ? 'bg-blue-500' 
                : quizConfig.includeExplanations 
                  ? 'bg-blue-500' 
                  : 'bg-slate-600'
              }
            `}
          >
            <div
              className={`
                absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300
                ${(quizConfig.includeExplanations || quizConfig.quizAction === 'download') 
                  ? 'transform translate-x-7' 
                  : 'transform translate-x-1'
                }
              `}
            />
          </button>
        </div>

        {/* Advanced Options - Only show for attempt quiz */}
        {quizConfig.quizAction === 'attempt' && (
          <div className="space-y-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
            >
              <Settings size={18} />
              <span>Advanced Options</span>
              {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showAdvanced && (
              <div className="space-y-4 p-4 bg-slate-800/20 backdrop-blur-sm border border-slate-700/30 rounded-lg">
                <div className="space-y-3">
                  <label className="text-white font-medium">Submission Style</label>
                  <div className="space-y-2">
                    {['Submit After Each Question', 'Submit At the End'].map((style) => (
                      <label key={style} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="submissionStyle"
                          value={style}
                          checked={quizConfig.submissionStyle === style}
                          onChange={(e) => updateConfig('submissionStyle', e.target.value)}
                          className="w-4 h-4 text-blue-500"
                        />
                        <span className="text-slate-300">{style}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Generate Button */}
      <div className="flex justify-end pt-6 border-t border-slate-700/50">
        <button
          onClick={handleSubmit}
          disabled={isGenerating || !quizConfig.query.trim()}
          className={`
            flex items-center space-x-2 px-8 py-3 rounded-lg transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
            ${quizConfig.quizAction === 'attempt'
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-blue-500/25'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-green-500/25'
            }
          `}
        >
          {isGenerating ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Generating Quiz...</span>
            </>
          ) : (
            <>
              {quizConfig.quizAction === 'attempt' ? (
                <>
                  <Play size={18} />
                  <span>Generate & Start Quiz</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span>Generate & Download</span>
                </>
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
