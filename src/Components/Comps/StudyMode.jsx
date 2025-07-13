import { BookOpen } from "lucide-react";
export const StudyModePage = ({isMobile}) => (
    <div className="p-4 md:p-8">
      <div className="text-center py-12 md:py-20">
        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center">
          <BookOpen size={isMobile ? 32 : 40} className="text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Study Mode</h2>
        <p className="text-slate-400 text-base md:text-lg mb-8">
          Select a document from Home to start studying
        </p>
        <button 
        //   onClick={() => navigateToPage('home')}
          className="px-6 md:px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg md:rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
        >
          Go to Home
        </button>
      </div>
    </div>
  );