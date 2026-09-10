import React, { useState, useEffect } from 'react';
import { Anchor, Award, Info, ShieldCheck, Zap, Leaf } from 'lucide-react';
import { fetchSustainability } from '../services/api';
import { MetricCard } from '../components/MetricCard';
import { MaritimeRadarChart } from '../charts/MaritimeRadarChart';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { getTierBadge, formatTEU } from '../utils/formatters';

export const Sustainability = () => {
  const [sustainabilityData, setSustainabilityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);

  useEffect(() => {
    fetchSustainability()
      .then(data => {
        setSustainabilityData(data);
        if (data.leaderboard && data.leaderboard.length > 0) {
          setSelectedCountry(data.leaderboard[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Sustainability fetch error:", err);
        setError("Failed to fetch Green Maritime Index (GMI) leaderboard.");
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingState message="Calculating Green Maritime Index (GMI) Scores..." />;
  if (error) return <ErrorState message={error} />;

  const leaderboard = sustainabilityData?.leaderboard || [];
  const radarData = selectedCountry ? [
    { axis: 'Connectivity (LSCI)', value: selectedCountry.components.lsci_score },
    { axis: 'Port Volume (TEU)', value: selectedCountry.components.teu_score },
    { axis: 'Clean Energy', value: selectedCountry.components.clean_energy_score },
    { axis: 'Energy Independence', value: selectedCountry.components.energy_indep_score },
  ] : [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-slate-950 via-maritime-card to-slate-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Anchor className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black text-white">Green Maritime Index (GMI)</h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Project Analytical Index
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Composite evaluation integrating normalized LSCI (25%), log-scale TEU (25%), Clean Energy transition (30%), and Energy Independence (20%).
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowMethodologyModal(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all shadow-sm"
          >
            <Info className="w-4 h-4" />
            <span>Formula Methodology</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <MetricCard
          title="Countries Scored"
          value={sustainabilityData.total_countries_scored}
          subtitle="Non-Aggregate Countries"
          icon={Award}
          color="emerald"
        />
        <MetricCard
          title="Average Global GMI"
          value={`${sustainabilityData.average_gmi_score} / 100`}
          subtitle="Global Sustainability Baseline"
          icon={ShieldCheck}
          color="cyan"
        />
        <MetricCard
          title="Top GMI Score"
          value={`${sustainabilityData.highest_gmi_score} / 100`}
          subtitle="Global Sustainability Leader"
          icon={Leaf}
          color="amber"
        />
      </div>

      {/* Radar & Leaderboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart Panel */}
        <div className="lg:col-span-1 space-y-4">
          {selectedCountry && (
            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white">{selectedCountry.country_name}</h3>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getTierBadge(selectedCountry.tier).bg} ${getTierBadge(selectedCountry.tier).text} ${getTierBadge(selectedCountry.tier).border}`}>
                  {selectedCountry.tier}
                </span>
              </div>
              <p className="text-xs font-semibold text-emerald-400 mb-4">GMI Score: {selectedCountry.gmi_score} / 100</p>
              
              <MaritimeRadarChart data={radarData} title={`${selectedCountry.country_code} Sustainability Profile`} />
            </div>
          )}
        </div>

        {/* GMI Leaderboard Table */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-maritime-border/50">
          <h3 className="text-base font-bold text-white mb-4">Global GMI Leaderboard (Rank 1 - {leaderboard.length})</h3>
          
          <div className="overflow-x-auto max-h-[460px] overflow-y-auto pr-1">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Country</th>
                  <th className="py-2.5 px-3">GMI Score</th>
                  <th className="py-2.5 px-3">Tier</th>
                  <th className="py-2.5 px-3">LSCI</th>
                  <th className="py-2.5 px-3">TEU</th>
                  <th className="py-2.5 px-3">Clean Energy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leaderboard.map((item) => {
                  const isSelected = selectedCountry?.country_code === item.country_code;
                  const tierInfo = getTierBadge(item.tier);
                  return (
                    <tr
                      key={item.country_code}
                      onClick={() => setSelectedCountry(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-emerald-500/15 font-semibold text-white' : 'hover:bg-slate-900/60 text-slate-300'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono font-extrabold text-cyan-400">#{item.rank}</td>
                      <td className="py-2.5 px-3 font-bold text-white">{item.country_name} ({item.country_code})</td>
                      <td className="py-2.5 px-3 font-extrabold text-emerald-300">{item.gmi_score}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] border ${tierInfo.bg} ${tierInfo.text} ${tierInfo.border}`}>
                          {item.tier}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">{item.raw_indicators.lsci}</td>
                      <td className="py-2.5 px-3">{formatTEU(item.raw_indicators.container_teu)}</td>
                      <td className="py-2.5 px-3">{item.components.clean_energy_score}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Formula Methodology Disclosure Modal */}
      {showMethodologyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/40 max-w-2xl w-full text-slate-200">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" /> Green Maritime Index (GMI) Formulation
            </h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              The GMI is a project-defined transparent analytical index designed to score countries on fleet connectivity, port container scale, energy transition, and energy self-reliance.
            </p>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-cyan-400 block mb-1">1. Liner Shipping Connectivity (Weight: 25%)</span>
                Min-Max normalized LSCI representing maritime port network integration.
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-1">2. Container Traffic Scale (Weight: 25%)</span>
                Log-scaled normalized annual TEU volume reflecting container trade scale.
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">3. Clean Energy Transition (Weight: 30%)</span>
                Inverted Fossil Fuel energy reliance score: <code className="text-emerald-300">Clean Energy Score = 100 - Fossil Fuel %</code>.
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-rose-400 block mb-1">4. Energy Independence (Weight: 20%)</span>
                Normalized net energy import dependency score measuring energy autonomy.
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowMethodologyModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all shadow-md"
              >
                Close Disclosure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
