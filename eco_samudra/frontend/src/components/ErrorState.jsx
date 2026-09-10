import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export const ErrorState = ({ message = "Failed to load maritime dataset.", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 glass-panel rounded-3xl border border-rose-500/30 my-8">
      <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-white mb-1">Service Unreachable</h4>
      <p className="text-xs text-rose-300/80 mb-6 text-center max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-all shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
};
