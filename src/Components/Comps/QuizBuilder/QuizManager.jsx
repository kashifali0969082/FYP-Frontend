import React, { useState } from 'react';
import { QuizHistory } from './QuizHistory';
import { QuizReview } from './QuizReview';

export const QuizManager = ({ isMobile, setCurrentPage }) => {
  const [currentView, setCurrentView] = useState('history'); // 'history' or 'review'
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const handleReviewQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentView('review');
  };

  const handleRetakeQuiz = (quiz) => {
    // Navigate to quiz builder with the same document pre-selected
    console.log('Retaking quiz:', quiz);
    setCurrentPage('quiz-builder');
  };

  const handleBackToHistory = () => {
    setCurrentView('history');
    setSelectedQuiz(null);
  };

  const handleRetakeFromReview = () => {
    // Navigate to quiz builder with the same document
    console.log('Retaking quiz from review:', selectedQuiz);
    setCurrentPage('quiz-builder');
  };

  if (currentView === 'review' && selectedQuiz) {
    return (
      <QuizReview
        quizData={selectedQuiz}
        onBack={handleBackToHistory}
        onRetake={handleRetakeFromReview}
      />
    );
  }

  return (
    <QuizHistory
      isMobile={isMobile}
      onReviewQuiz={handleReviewQuiz}
      onRetakeQuiz={handleRetakeQuiz}
    />
  );
};
