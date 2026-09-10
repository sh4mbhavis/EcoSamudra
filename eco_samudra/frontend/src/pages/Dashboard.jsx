import React, { useState } from 'react';
import { Ship, Globe, Anchor, Flame, Zap, HelpCircle, Info, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { FilterBar } from '../components/FilterBar';
import { WorldMapRanking } from '../components/WorldMapRanking';
import { TrendLineChart } from '../charts/TrendLineChart';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { formatTEU } from '../utils/formatters';

export const Dashboard = ({ data, loading, error, filters, onUpdateFilters, onReset, countries }) => {
  const [showGuide, setShowGuide] = useState(false);

  if (loading && !data) return <LoadingState message="Loading Maritime Overview Intelligence..." />;
  if (error && !data) return <ErrorState message={error} onRetry={onReset} />;

  const summary = data?.summary || {};
  const yearlyTrends = data?.yearly_trends || [];

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Clean Hero Header with Simple User Guide Toggle */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-3">
              <Ship className="w-3.5 h-3.5" />
              <span>Global Maritime & Energy Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Global Maritime Connectivity & Sustainability Overview
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore global liner shipping connectivity (LSCI), container traffic (TEU), fossil fuel energy reliance, and net energy import dependencies across 200+ nations.
            </p>
          </div>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25 transition-all shadow-sm flex-shrink-0"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{showGuide ? 'Hide Beginner Guide' : 'What Do These Metrics Mean?'}</span>
            {showGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible User Onboarding Explanation Guide */}
        {showGuide && (
          <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs mb-1">
                <Ship className="w-4 h-4" />
                <span>1. LSCI Connectivity</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                Measures how well a nation's ports are integrated into global container shipping routes.
              </p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs mb-1">
                <Anchor className="w-4 h-4" />
                <span>2. Container Traffic (TEU)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                Twenty-foot Equivalent Unit (TEU) annual container cargo volume handled by sea ports.
              </p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs mb-1">
                <Flame className="w-4 h-4" />
                <span>3. Fossil Fuel Reliance</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                Percentage of national energy consumption derived from fossil fuels vs clean renewables.
              </p>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs mb-1">
                <Zap className="w-4 h-4" />
                <span>4. Energy Imports</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                Net energy imports dependency percentage indicating national energy self-sufficiency.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Global Filter Bar */}
      <FilterBar
        countries={countries}
        filters={filters}
        onUpdateFilters={onUpdateFilters}
        onReset={onReset}
      />

      {/* 5 Dynamic KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Countries Analyzed"
          value={summary.countries_analyzed || 0}
          subtitle={`Dataset Span: ${filters.minYear} - ${filters.maxYear}`}
          icon={Globe}
          color="cyan"
        />
        <MetricCard
          title="Container Volume"
          value={formatTEU(summary.total_container_traffic_teu)}
          subtitle="Annual Port Throughput"
          icon={Anchor}
          color="emerald"
        />
        <MetricCard
          title="Average LSCI"
          value={summary.avg_lsci || 0}
          subtitle="Liner Connectivity Index"
          icon={Ship}
          color="indigo"
        />
        <MetricCard
          title="Fossil Fuel Reliance"
          value={`${summary.avg_fossil_fuel_pct || 0}%`}
          subtitle="National Energy Mix"
          icon={Flame}
          color="amber"
        />
        <MetricCard
          title="Net Energy Imports"
          value={`${summary.avg_energy_imports_pct || 0}%`}
          subtitle="Dependency Ratio"
          icon={Zap}
          color="rose"
        />
      </div>

      {/* Decluttered Multi-Series Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendLineChart
          data={yearlyTrends}
          title="Historical Liner Shipping Connectivity (LSCI)"
          dataKeys={[
            { key: 'avg_lsci', name: 'Avg LSCI Connectivity', color: '#00d2d3' }
          ]}
        />
        <TrendLineChart
          data={yearlyTrends}
          title="Global Port Container Traffic (TEU Volume)"
          dataKeys={[
            { key: 'total_teu', name: 'Total Port Traffic (TEU)', color: '#10b981' }
          ]}
        />
        <TrendLineChart
          data={yearlyTrends}
          title="Clean Energy Transition (Fossil Fuel %)"
          dataKeys={[
            { key: 'avg_fossil_fuel_pct', name: 'Fossil Fuel Energy %', color: '#f59e0b' }
          ]}
        />
        <TrendLineChart
          data={yearlyTrends}
          title="Net Energy Imports Dependency"
          dataKeys={[
            { key: 'avg_energy_imports_pct', name: 'Net Energy Imports %', color: '#f43f5e' }
          ]}
        />
      </div>
    </div>
  );
};
