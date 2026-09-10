import React from 'react';
import { Ship } from 'lucide-react';

export const LoadingState = ({ message = "Loading Maritime Intelligence Engine..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 glass-panel rounded-3xl border border-cyan-500/20 my-8">
      <div className="relative mb-6">
        <div className="absolute -inset-4 rounded-full bg-cyan-500/20 animate-ping opacity-75"></div>
        <div className="relative p-4 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 text-maritime-dark shadow-xl shadow-cyan-500/30">
          <Ship className="w-10 h-10 animate-bounce" />
        </div>
      </div>
      <h4 className="text-lg font-bold text-white mb-2 tracking-tight">{message}</h4>
      <p className="text-xs text-slate-400 font-mono animate-pulse">Analyzing 8,733 records across 200+ countries...</p>
      
      {/* Wave animation line */}
      <div className="w-48 h-1 bg-slate-800 rounded-full mt-6 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-500 animate-wave-slow"></div>
      </div>
    </div>
  );
};
