import { FileQuestion } from "lucide-react";
export const MCQsPage = ({isMobile}) => (
    <div className="p-4 md:p-8">
      <div className="text-center py-12 md:py-20">
        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center">
          <FileQuestion size={isMobile ? 32 : 40} className="text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">MCQs</h2>
        <p className="text-slate-400 text-base md:text-lg">
          Multiple Choice Questions feature coming soon
        </p>
      </div>
    </div>
  );