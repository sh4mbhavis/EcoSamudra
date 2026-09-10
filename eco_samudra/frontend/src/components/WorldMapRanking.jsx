import React from 'react';
import { Award, Anchor, Activity, Zap } from 'lucide-react';
import { formatTEU } from '../utils/formatters';

export const WorldMapRanking = ({ topPorts = [], topLsci = [] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Top Container Ports Card */}
      <div className="glass-panel p-5 rounded-2xl border border-maritime-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Anchor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Top 10 Global Port Leaders</h3>
              <p className="text-xs text-slate-400">Ranked by Container Port Traffic (TEU)</p>
            </div>
          </div>
          <span className="text-xs font-bold text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">TEU Volume</span>
        </div>

        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
          {topPorts.map((item, idx) => (
            <div
              key={item.country_code}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-extrabold ${
                  idx === 0 ? 'bg-amber-400 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-950' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.country_name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{item.country_code}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-cyan-300 block">{formatTEU(item.container_teu)}</span>
                <span className="text-[10px] text-slate-400">LSCI: {item.lsci}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top LSCI Leaders Card */}
      <div className="glass-panel p-5 rounded-2xl border border-maritime-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Top 10 LSCI Leaders</h3>
              <p className="text-xs text-slate-400">Liner Shipping Connectivity Index Leaderboard</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">Connectivity</span>
        </div>

        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
          {topLsci.map((item, idx) => (
            <div
              key={item.country_code}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-extrabold ${
                  idx === 0 ? 'bg-amber-400 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-950' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.country_name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{item.country_code}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-emerald-300 block">{item.lsci} LSCI</span>
                <span className="text-[10px] text-slate-400">{formatTEU(item.container_teu)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
