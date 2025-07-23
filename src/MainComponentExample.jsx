// How to implement in your main App/Dashboard component

import React, { useState } from "react";
import LearningProfileForm from "./Components/TEsting/LearningProfileForm";
import LearningProfileResultsModal from "./Components/TEsting/LearningProfileResultsModal";

const YourMainComponent = () => {
  const [currentView, setCurrentView] = useState('learning-profile'); // or 'dashboard'
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [learningResults, setLearningResults] = useState(null);

  const handleLearningProfileComplete = () => {
    // Navigate to dashboard
    setCurrentView('dashboard');
    console.log("Navigated to dashboard");
  };

  const handleShowResults = (resultsData) => {
    // Store results and show modal immediately
    console.log("Showing results modal with data:", resultsData);
    setLearningResults(resultsData);
    setShowResultsModal(true);
  };

  const handleCloseModal = () => {
    setShowResultsModal(false);
    setLearningResults(null);
  };

  return (
    <div>
      {/* Main Content */}
      {currentView === 'learning-profile' && (
        <LearningProfileForm
          onComplete={handleLearningProfileComplete}
          onShowResults={handleShowResults}
        />
      )}

      {currentView === 'dashboard' && (
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
      )}

      {/* Results Modal - Shows over any content */}
      <LearningProfileResultsModal
        isOpen={showResultsModal}
        onClose={handleCloseModal}
        resultsData={learningResults}
      />
    </div>
  );
};

export default YourMainComponent;
