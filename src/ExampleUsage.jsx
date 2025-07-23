// Example usage in your main App component or Dashboard component

import React, { useState } from "react";
import LearningProfileForm from "./Components/TEsting/LearningProfileForm";
import LearningProfileResultsModal from "./Components/TEsting/LearningProfileResultsModal";

const App = () => {
  const [showLearningProfile, setShowLearningProfile] = useState(true);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [learningProfileResults, setLearningProfileResults] = useState(null);

  const handleLearningProfileComplete = () => {
    // Hide the learning profile form and show dashboard
    setShowLearningProfile(false);
    // Your dashboard navigation logic here
    console.log("Navigating to dashboard...");
  };

  const handleShowResults = (resultsData) => {
    // Store results and show modal over dashboard
    setLearningProfileResults(resultsData);
    setShowResultsModal(true);
  };

  const handleCloseResultsModal = () => {
    setShowResultsModal(false);
    setLearningProfileResults(null);
  };

  return (
    <div>
      {showLearningProfile ? (
        <LearningProfileForm
          onComplete={handleLearningProfileComplete}
          onShowResults={handleShowResults}
        />
      ) : (
        // Your Dashboard Component
        <div className="min-h-screen bg-gray-100 p-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome to your learning dashboard!</p>
          {/* Your dashboard content here */}
        </div>
      )}

      {/* Results Modal - Shows over any page */}
      <LearningProfileResultsModal
        isOpen={showResultsModal}
        onClose={handleCloseResultsModal}
        resultsData={learningProfileResults}
      />
    </div>
  );
};

export default App;
