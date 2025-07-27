import { Menu } from "lucide-react";

export const MobileHeader = ({ 
  isMobile, 
  setIsMobileSidebarOpen, 
  setIsSidebarCollapsed, 
  isMobileSidebarOpen, 
  isSidebarCollapsed,
  onNavigateHome
}) => {
  const toggleMobileSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const goToHomePage = () => {
    // Use the navigation function passed from parent to go to home tab
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      // Fallback to landing page if no navigation function provided
      window.location.href = '/';
    }
  };

  return (
    <div className="md:hidden bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 p-4 flex items-center justify-between sticky top-0 z-40">
      <button
        onClick={toggleMobileSidebar}
        className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
      >
        <Menu size={20} />
      </button>
      <button
        onClick={goToHomePage}
        className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300 transition-all duration-200 cursor-pointer"
      >
        AdaptiveLearnAI
      </button>
      <div className="w-8" /> {/* Spacer for center alignment */}
    </div>
  );
};