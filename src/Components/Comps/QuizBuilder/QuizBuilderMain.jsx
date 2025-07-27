import React, { useState } from 'react';
import { DocumentSelection } from './DocumentSelection';
import { QuizCustomization } from './QuizCustomization';
import { QuizInterface } from './QuizInterface';
import { Trophy, Target } from 'lucide-react';
import { useStreakUpdate } from '../../../hooks/useStreakUpdate';
import StreakUpdateModal from '../StreakUpdateModal';
import { generateQuizApi } from '../../apiclient/quizApiClient';

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

  const generateQuiz = async (formData, isDownload) => {
    try {
      setIsGenerating(true);
      // Trigger streak update when generating quiz
      await triggerStreakUpdate();
      const response = await generateQuizApi(formData, isDownload);
      if (response.status !== 200) {
        throw new Error('Failed to generate quiz');
      }
      if (isDownload) {
        // Handle file download
        const blob = new Blob([response.data]);
        const contentDisposition = response.headers.get('content-disposition');
        const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
        const filename = filenameMatch?.[1] || 'quiz.' + formData.get('file_type');
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        alert('Quiz downloaded successfully!');
      } else {
        // Handle quiz attempt
        const { data } = response;
        if (data.status === 'success') {
          setQuizData({
            questions: data.generated_mcqs,
            quiz_id: data.quiz_id
          });
          setQuizConfig({
            num_mcqs: parseInt(formData.get('num_mcqs')),
            difficulty_level: formData.get('difficulty_level'),
            user_query: formData.get('user_query'),
            explanation: formData.get('explanation') === 'true',
            model_id: formData.get('model_id'),
            doc_ids: formData.get('doc_ids')
          });
          setCurrentStep(3); // Move to quiz interface
        } else {
          throw new Error(data.message || 'Failed to generate quiz');
        }
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert(error.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
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

  const handleSaveQuiz = async (quizResults) => {
    console.log('Saving quiz results:', quizResults);
    // TODO: Implement quiz results submission to backend
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
            isMobile={isMobile}
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
