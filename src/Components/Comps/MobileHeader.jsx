import { Menu } from "lucide-react";
export const MobileHeader = () => {
     const toggleMobileSidebar = ({isMobile,setIsMobileSidebarOpen,setIsSidebarCollapsed,isMobileSidebarOpen,isSidebarCollapsed}) => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
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
      <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        AdaptiveLearnAI
      </h1>
      <div className="w-8" /> {/* Spacer for center alignment */}
    </div>
  );
};
