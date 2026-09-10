import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const MetricCard = ({ title, value, subtitle, icon: Icon, delta, color = 'cyan', sparklineData = [] }) => {
  const colorClasses = {
    cyan: {
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      icon: 'text-cyan-400',
      glow: 'shadow-cyan-500/10',
      gradient: 'from-cyan-500 to-blue-500'
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      icon: 'text-emerald-400',
      glow: 'shadow-emerald-500/10',
      gradient: 'from-emerald-500 to-teal-500'
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      icon: 'text-amber-400',
      glow: 'shadow-amber-500/10',
      gradient: 'from-amber-500 to-orange-500'
    },
    rose: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      icon: 'text-rose-400',
      glow: 'shadow-rose-500/10',
      gradient: 'from-rose-500 to-pink-500'
    },
    indigo: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/30',
      icon: 'text-indigo-400',
      glow: 'shadow-indigo-500/10',
      gradient: 'from-indigo-500 to-purple-500'
    }
  };

  const themeConfig = colorClasses[color] || colorClasses.cyan;

  return (
    <div className={`glass-panel glass-panel-hover p-5 rounded-2xl border ${themeConfig.border} relative overflow-hidden group`}>
      {/* Decorative background glow */}
      <div className={`absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-gradient-to-br ${themeConfig.gradient} opacity-10 blur-xl group-hover:opacity-25 transition-opacity duration-500`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${themeConfig.bg} ${themeConfig.icon} border ${themeConfig.border}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-700/40">
        <span className="text-xs text-slate-400 font-medium">{subtitle}</span>
        {delta !== undefined && (
          <div className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
            delta > 0
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : delta < 0
              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              : 'bg-slate-700/40 text-slate-400 border border-slate-600/40'
          }`}>
            {delta > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : delta < 0 ? <TrendingDown className="w-3 h-3 mr-1" /> : <Minus className="w-3 h-3 mr-1" />}
            <span>{Math.abs(delta)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};
