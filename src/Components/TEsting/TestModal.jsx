// Simple test component to verify modal functionality
import React, { useState } from "react";
import LearningProfileResultsModal from "./LearningProfileResultsModal";

const TestModal = () => {
  const [showModal, setShowModal] = useState(false);
  
  const mockResults = {
    styleScores: { Visual: 12, ReadingWriting: 8, Kinesthetic: 10 },
    dominantStyle: "Visual"
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Modal Test Page</h1>
        <p className="mb-4">This represents your dashboard or any other page.</p>
        
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Show Learning Profile Results Modal
        </button>
        
        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Dashboard Content</h2>
          <p>This content should be visible behind the modal when it opens.</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded">Card 1</div>
            <div className="bg-green-50 p-4 rounded">Card 2</div>
            <div className="bg-purple-50 p-4 rounded">Card 3</div>
            <div className="bg-yellow-50 p-4 rounded">Card 4</div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <LearningProfileResultsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        resultsData={mockResults}
      />
    </div>
  );
};

export default TestModal;
