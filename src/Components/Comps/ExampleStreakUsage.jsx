// Example usage of the useStreakUpdate hook
// You can copy this implementation to any component where you want to trigger streak updates

import React from 'react';
import { useStreakUpdate } from '../../hooks/useStreakUpdate';
import StreakUpdateModal from './StreakUpdateModal';

const ExampleComponent = () => {
  const { triggerStreakUpdate, isModalOpen, streakData, closeModal, isLoading } = useStreakUpdate();

  const handleOpenDocument = async () => {
    // When user opens a document in study mode
    console.log("📖 Opening document in study mode...");
    
    // Trigger streak update
    await triggerStreakUpdate();
    
    // Continue with your document opening logic
    // ... rest of your code
  };

  const handleGenerateQuiz = async () => {
    // When user generates a quiz
    console.log("📝 Generating quiz...");
    
    // Trigger streak update
    await triggerStreakUpdate();
    
    // Continue with your quiz generation logic
    // ... rest of your code
  };

  return (
    <div>
      {/* Your component content */}
      <button 
        onClick={handleOpenDocument}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
      >
        {isLoading ? "Loading..." : "Open Document"}
      </button>
      
      <button 
        onClick={handleGenerateQuiz}
        disabled={isLoading}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        {isLoading ? "Loading..." : "Generate Quiz"}
      </button>

      {/* Streak Update Modal */}
      <StreakUpdateModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        streakData={streakData} 
      />
    </div>
  );
};

export default ExampleComponent;

/*
HOW TO USE IN YOUR EXISTING COMPONENTS:

1. Import the hook and modal:
   import { useStreakUpdate } from '../../hooks/useStreakUpdate';
   import StreakUpdateModal from './StreakUpdateModal';

2. Use the hook in your component:
   const { triggerStreakUpdate, isModalOpen, streakData, closeModal } = useStreakUpdate();

3. Call triggerStreakUpdate() when:
   - User opens a document in study mode
   - User generates a quiz
   - Any other action that should update streak

4. Add the modal to your JSX:
   <StreakUpdateModal 
     isOpen={isModalOpen} 
     onClose={closeModal} 
     streakData={streakData} 
   />

EXAMPLE IMPLEMENTATIONS:

// In StudyMode component:
const handleStartStudy = async () => {
  await triggerStreakUpdate();
  // ... existing study mode logic
};

// In QuizBuilder component:
const handleGenerateQuiz = async () => {
  await triggerStreakUpdate();
  // ... existing quiz generation logic
};

// In FilePage component when opening a document:
const handleOpenDocument = async () => {
  await triggerStreakUpdate();
  // ... existing document opening logic
};
*/
