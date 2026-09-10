import React, { useState, useEffect } from 'react';
import { Globe, Search, ArrowLeftRight, Ship, Anchor, Flame, Zap } from 'lucide-react';
import { fetchCountryDetail, fetchComparison } from '../services/api';
import { MetricCard } from '../components/MetricCard';
import { TrendLineChart } from '../charts/TrendLineChart';
import { ComparisonBarChart } from '../charts/ComparisonBarChart';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { formatTEU } from '../utils/formatters';

export const CountryExplorer = ({ countries = [] }) => {
  const [selectedCountry, setSelectedCountry] = useState('IND');
  const [countryDetail, setCountryDetail] = useState(null);
  
  // Comparison Mode state
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareCountry, setCompareCountry] = useState('SGP');
  const [comparisonData, setComparisonData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load single country detail
  useEffect(() => {
    if (!isCompareMode && selectedCountry) {
      setLoading(true);
      fetchCountryDetail(selectedCountry)
        .then(data => {
          setCountryDetail(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Country detail error:", err);
          setError(`Failed to load country details for ${selectedCountry}`);
          setLoading(false);
        });
    }
  }, [selectedCountry, isCompareMode]);

  // Load side-by-side comparison data
  useEffect(() => {
    if (isCompareMode && selectedCountry && compareCountry) {
      setLoading(true);
      fetchComparison(selectedCountry, compareCountry)
        .then(data => {
          setComparisonData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Comparison error:", err);
          setError("Failed to load country comparison.");
          setLoading(false);
        });
    }
  }, [isCompareMode, selectedCountry, compareCountry]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Controls */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Country Maritime & Energy Explorer</h1>
              <p className="text-xs text-slate-400">Search sovereign countries or perform side-by-side comparative analysis</p>
            </div>
          </div>

          {/* Toggle Compare Mode */}
          <button
            onClick={() => setIsCompareMode(!isCompareMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isCompareMode
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-lg shadow-cyan-500/10'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
            <span>{isCompareMode ? 'Exit Comparison Mode' : 'Enable Side-by-Side Comparison'}</span>
          </button>
        </div>

        {/* Country Selector Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Primary Country</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              {countries.map(c => (
                <option key={c.country_code} value={c.country_code}>
                  {c.country_name} ({c.country_code})
                </option>
              ))}
            </select>
          </div>

          {isCompareMode && (
            <div>
              <label className="block text-xs font-semibold text-emerald-400 mb-1">Comparison Target Country</label>
              <select
                value={compareCountry}
                onChange={(e) => setCompareCountry(e.target.value)}
                className="w-full bg-slate-900 border border-emerald-500/50 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                {countries.map(c => (
                  <option key={c.country_code} value={c.country_code}>
                    {c.country_name} ({c.country_code})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {loading && <LoadingState message="Fetching Detailed Country Time-Series Data..." />}
      {error && <ErrorState message={error} />}

      {/* Single Country View Mode */}
      {!isCompareMode && countryDetail && !loading && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-700 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">{countryDetail.country_name} ({countryDetail.country_code})</h2>
              <p className="text-xs text-slate-400">Latest Recorded Data Year: {countryDetail.latest_year}</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {countryDetail.is_aggregate ? 'Economic Aggregate' : 'Sovereign Nation'}
            </span>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <MetricCard
              title="LSCI Connectivity"
              value={countryDetail.latest_metrics.lsci}
              subtitle="Liner Shipping Index"
              icon={Ship}
              color="cyan"
            />
            <MetricCard
              title="Container Traffic"
              value={formatTEU(countryDetail.latest_metrics.container_port_traffic_teu)}
              subtitle="TEU Throughput"
              icon={Anchor}
              color="emerald"
            />
            <MetricCard
              title="Fossil Fuel %"
              value={`${countryDetail.latest_metrics.fossil_fuel_pct}%`}
              subtitle="Energy Mix Share"
              icon={Flame}
              color="amber"
            />
            <MetricCard
              title="Energy Imports %"
              value={`${countryDetail.latest_metrics.energy_imports_pct}%`}
              subtitle="Net Dependency"
              icon={Zap}
              color="rose"
            />
          </div>

          {/* Multi-Metric History Trend Lines */}
          <TrendLineChart
            data={countryDetail.history}
            title={`${countryDetail.country_name} Historical Indicators (1960 - 2024)`}
            dataKeys={[
              { key: 'lsci', name: 'LSCI Connectivity', color: '#00d2d3' },
              { key: 'fossil_fuel_pct', name: 'Fossil Fuel %', color: '#f59e0b' },
              { key: 'energy_imports_pct', name: 'Energy Imports %', color: '#f43f5e' }
            ]}
          />
        </div>
      )}

      {/* Side-by-Side Comparison Mode */}
      {isCompareMode && comparisonData && !loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Country 1 Card */}
            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30">
              <h3 className="text-xl font-extrabold text-cyan-300">{comparisonData.country1.name} ({comparisonData.country1.code})</h3>
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div className="bg-slate-900/60 p-3 rounded-xl">
                  <span className="text-slate-400 block">LSCI Connectivity</span>
                  <span className="text-lg font-bold text-white">{comparisonData.country1.latest.lsci}</span>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl">
                  <span className="text-slate-400 block">Container Volume</span>
                  <span className="text-lg font-bold text-emerald-400">{formatTEU(comparisonData.country1.latest.teu)}</span>
                </div>
              </div>
            </div>

            {/* Country 2 Card */}
            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30">
              <h3 className="text-xl font-extrabold text-emerald-300">{comparisonData.country2.name} ({comparisonData.country2.code})</h3>
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div className="bg-slate-900/60 p-3 rounded-xl">
                  <span className="text-slate-400 block">LSCI Connectivity</span>
                  <span className="text-lg font-bold text-white">{comparisonData.country2.latest.lsci}</span>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl">
                  <span className="text-slate-400 block">Container Volume</span>
                  <span className="text-lg font-bold text-emerald-400">{formatTEU(comparisonData.country2.latest.teu)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Synchronized Comparative Time Series Chart */}
          <TrendLineChart
            data={comparisonData.comparison_history}
            title={`Comparative LSCI Time Series (${comparisonData.country1.code} vs ${comparisonData.country2.code})`}
            dataKeys={[
              { key: `${comparisonData.country1.code}_lsci`, name: `${comparisonData.country1.code} LSCI`, color: '#00d2d3' },
              { key: `${comparisonData.country2.code}_lsci`, name: `${comparisonData.country2.code} LSCI`, color: '#10b981' }
            ]}
          />
        </div>
      )}
    </div>
  );
};
