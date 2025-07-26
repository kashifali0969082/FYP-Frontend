import React, { useState } from 'react';
import { DocumentSelection } from './DocumentSelection';
import { QuizCustomization } from './QuizCustomization';
import { QuizInterface } from './QuizInterface';
import { Trophy, Target } from 'lucide-react';
import { useStreakUpdate } from '../../../hooks/useStreakUpdate';
import StreakUpdateModal from '../StreakUpdateModal';

export const QuizBuilderMain = ({ 
  uploadedFiles, 
  isFilesLoading, 
  setCurrentPage,
  setIsMobileSidebarOpen,
  isMobile 
}) => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Document Selection, 2: Customization, 3: Quiz Interface
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [quizConfig, setQuizConfig] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Streak update hook
  const { triggerStreakUpdate, isModalOpen, streakData: streakUpdateData, closeModal } = useStreakUpdate();

  // Mock API call - replace with actual API integration
  const generateQuiz = async (config) => {
    setIsGenerating(true);
    setQuizConfig(config);
    
    // Trigger streak update when generating quiz
    await triggerStreakUpdate();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock quiz data - replace with actual API response
    const mockQuizData = {
      questions: [
        {
          id: '1',
          question: 'What is the time complexity of Binary Search?',
          options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
          correct_answer: 'O(log n)',
          explanation: 'Binary Search divides the search space in half with each comparison, resulting in O(log n) time complexity.',
          difficulty: 2,
          topic: 'Algorithms',
          question_type: 'multiple_choice'
        },
        {
          id: '2',
          question: 'Which data structure uses LIFO principle?',
          options: ['Queue', 'Stack', 'Array', 'Linked List'],
          correct_answer: 'Stack',
          explanation: 'Stack follows Last In, First Out (LIFO) principle where the last element added is the first one to be removed.',
          difficulty: 1,
          topic: 'Data Structures',
          question_type: 'multiple_choice'
        },
        {
          id: '3',
          question: 'What is the worst-case time complexity of Quick Sort?',
          options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
          correct_answer: 'O(n²)',
          explanation: 'Quick Sort has a worst-case time complexity of O(n²) when the pivot is always the smallest or largest element.',
          difficulty: 3,
          topic: 'Sorting Algorithms',
          question_type: 'multiple_choice'
        }
      ]
    };
    
    setQuizData(mockQuizData);
    setIsGenerating(false);
    
    // Check if user wants to download or attempt the quiz
    if (config.quizAction === 'download') {
      // Generate and download the quiz
      downloadQuiz(mockQuizData, config);
      // Stay on the customization page
    } else {
      // Proceed to quiz interface for attempting
      setCurrentStep(3);
    }
  };

  const downloadQuiz = (quizData, config) => {
    // Create quiz content for download
    const quizContent = generateQuizDocument(quizData, config);
    
    // Create blob and download
    const blob = new Blob([quizContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedDocument?.name || 'Quiz'}_${config.query.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Show success message
    alert('Quiz downloaded successfully!');
  };

  const generateQuizDocument = (quizData, config) => {
    let content = `QUIZ: ${config.query}\n`;
    content += `Document: ${selectedDocument?.name}\n`;
    content += `Difficulty: ${config.difficulty}\n`;
    content += `Questions: ${config.numQuestions}\n`;
    content += `Generated on: ${new Date().toLocaleDateString()}\n`;
    content += `\n${'='.repeat(50)}\n\n`;
    
    quizData.questions.forEach((question, index) => {
      content += `Question ${index + 1}: ${question.question}\n\n`;
      question.options.forEach((option, optionIndex) => {
        content += `${String.fromCharCode(65 + optionIndex)}. ${option}\n`;
      });
      content += `\nCorrect Answer: ${question.correct_answer}\n`;
      if (config.includeExplanations) {
        content += `Explanation: ${question.explanation}\n`;
      }
      content += `\n${'-'.repeat(30)}\n\n`;
    });
    
    return content;
  };

  const handleDocumentSelect = (document) => {
    setSelectedDocument(document);
  };

  const handleBackToDocuments = () => {
    setCurrentStep(1);
    setSelectedDocument(null);
  };

  const handleBackToCustomization = () => {
    setCurrentStep(2);
    setQuizData(null);
  };

  const handleSaveQuiz = (quizResults) => {
    console.log('Saving quiz results:', quizResults);
    // Implement save functionality
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <DocumentSelection
            uploadedFiles={uploadedFiles}
            isFilesLoading={isFilesLoading}
            onDocumentSelect={handleDocumentSelect}
            selectedDocument={selectedDocument}
            onNext={() => setCurrentStep(2)}
            setCurrentPage={setCurrentPage}
          />
        );
      case 2:
        return (
          <QuizCustomization
            selectedDocument={selectedDocument}
            onBack={handleBackToDocuments}
            onGenerateQuiz={generateQuiz}
            isGenerating={isGenerating}
          />
        );
      case 3:
        return (
          <QuizInterface
            quizData={quizData}
            quizConfig={quizConfig}
            onBack={handleBackToCustomization}
            onSaveQuiz={handleSaveQuiz}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-3 md:p-6 xl:p-8">
      <div className="max-w-4xl mx-auto">        
        {renderCurrentStep()}
      </div>
      
      {/* Streak Update Modal */}
      <StreakUpdateModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        streakData={streakUpdateData} 
      />
    </div>
  );
};
