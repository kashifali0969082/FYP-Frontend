import { useState } from 'react';
import { updatestreakapi } from '../Components/apiclient/Studystreakapi';

/**
 * Custom hook for managing streak updates
 * Call triggerStreakUpdate() when user opens a doc in study mode or generates a quiz
 */
export const useStreakUpdate = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [streakData, setStreakData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const triggerStreakUpdate = async () => {
    try {
      setIsLoading(true);
      console.log("🔥 Triggering streak update...");
      
      const response = await updatestreakapi();
      const data = response.data;
      
      console.log("🔥 Streak update response:", data);
      
      // If streak was updated, show the modal
      if (data && data.updated === true) {
        setStreakData(data);
        setIsModalOpen(true);
        console.log("✅ Streak updated! Opening modal...");
      } else {
        console.log("ℹ️ No streak update needed");
      }
      
      return data;
    } catch (error) {
      console.error("❌ Error updating streak:", error);
      // Don't show error modal for streak updates, just log it
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setStreakData(null);
  };

  return {
    triggerStreakUpdate,
    isModalOpen,
    streakData,
    closeModal,
    isLoading
  };
};
