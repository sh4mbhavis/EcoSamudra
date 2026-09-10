import React, { useState, useEffect } from 'react';
import { Sliders, RotateCcw, TrendingUp, TrendingDown, CheckCircle2, Lightbulb, Ship, Flame, Zap, Anchor } from 'lucide-react';
import { runScenarioSimulation } from '../services/api';
import { MetricCard } from '../components/MetricCard';
import { LoadingState } from '../components/LoadingState';

export const ScenarioAnalysis = ({ countries = [] }) => {
  const [selectedCountry, setSelectedCountry] = useState('IND');
  const [lsciChange, setLsciChange] = useState(15);
  const [teuChange, setTeuChange] = useState(10);
  const [fossilChange, setFossilChange] = useState(-15);
  const [energyImportsChange, setEnergyImportsChange] = useState(-10);

  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await runScenarioSimulation({
        country_code: selectedCountry,
        lsci_change_pct: Number(lsciChange),
        teu_change_pct: Number(teuChange),
        fossil_fuel_change_pct: Number(fossilChange),
        energy_imports_change_pct: Number(energyImportsChange)
      });
      setSimulationResult(res);
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSimulate();
  }, [selectedCountry, lsciChange, teuChange, fossilChange, energyImportsChange]);

  const handleResetSliders = () => {
    setLsciChange(0);
    setTeuChange(0);
    setFossilChange(0);
    setEnergyImportsChange(0);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-maritime-card to-slate-950">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Sliders className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">What-If Scenario Simulation Engine</h1>
            <p className="text-xs text-slate-300">
              Interactive scoring engine simulating future policy impacts on Liner Connectivity, Container Volume, Clean Energy Transition, and Energy Imports.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Control Panel */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-3xl border border-maritime-border/50 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Simulation Controls</h3>
            <button
              onClick={handleResetSliders}
              className="flex items-center space-x-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sliders</span>
            </button>
          </div>

          {/* Country Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400"
            >
              {countries.map(c => (
                <option key={c.country_code} value={c.country_code}>
                  {c.country_name} ({c.country_code})
                </option>
              ))}
            </select>
          </div>

          {/* LSCI Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300 flex items-center gap-1">
                <Ship className="w-3.5 h-3.5 text-cyan-400" /> LSCI Connectivity
              </span>
              <span className={`font-bold ${lsciChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {lsciChange > 0 ? '+' : ''}{lsciChange}%
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              value={lsciChange}
              onChange={(e) => setLsciChange(e.target.value)}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Container TEU Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300 flex items-center gap-1">
                <Anchor className="w-3.5 h-3.5 text-emerald-400" /> Container TEU Volume
              </span>
              <span className={`font-bold ${teuChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {teuChange > 0 ? '+' : ''}{teuChange}%
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              value={teuChange}
              onChange={(e) => setTeuChange(e.target.value)}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>

          {/* Fossil Fuel Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Fossil Fuel % Delta
              </span>
              <span className={`font-bold ${fossilChange <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {fossilChange > 0 ? '+' : ''}{fossilChange}% pts
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              value={fossilChange}
              onChange={(e) => setFossilChange(e.target.value)}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Energy Imports Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-rose-400" /> Net Energy Imports Delta
              </span>
              <span className={`font-bold ${energyImportsChange <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {energyImportsChange > 0 ? '+' : ''}{energyImportsChange}% pts
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              value={energyImportsChange}
              onChange={(e) => setEnergyImportsChange(e.target.value)}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
            />
          </div>
        </div>

        {/* Results & Actionable Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {simulationResult && (
            <>
              {/* Score Delta Card */}
              <div className={`glass-panel p-6 rounded-3xl border ${
                simulationResult.impact_analysis.status === 'improved'
                  ? 'border-emerald-500/40 bg-emerald-950/20'
                  : simulationResult.impact_analysis.status === 'worsened'
                  ? 'border-rose-500/40 bg-rose-950/20'
                  : 'border-slate-700 bg-slate-900/40'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">GMI Score Impact</span>
                    <h3 className="text-3xl font-black text-white mt-1">
                      Baseline: <span className="text-slate-400">{simulationResult.baseline_metrics.gmi_score}</span>
                      <span className="mx-2 text-cyan-400">➔</span>
                      Simulated: <span className="text-cyan-300">{simulationResult.simulated_metrics.gmi_score}</span>
                    </h3>
                  </div>

                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-2xl text-sm font-extrabold border ${
                    simulationResult.impact_analysis.gmi_score_delta > 0
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : simulationResult.impact_analysis.gmi_score_delta < 0
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {simulationResult.impact_analysis.gmi_score_delta > 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    <span>{simulationResult.impact_analysis.gmi_score_delta > 0 ? '+' : ''}{simulationResult.impact_analysis.gmi_score_delta} pts</span>
                  </div>
                </div>
              </div>

              {/* Data-Driven Recommendation Advisor */}
              <div className="glass-panel p-6 rounded-3xl border border-maritime-border/50">
                <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" /> Data-Driven Recommendation Advisor
                </h3>
                <div className="space-y-3">
                  {simulationResult.impact_analysis.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-slate-300 leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
