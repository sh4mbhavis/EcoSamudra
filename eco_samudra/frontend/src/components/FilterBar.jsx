import React from 'react';
import { Filter, RotateCcw, Globe, Calendar, Layers } from 'lucide-react';

export const FilterBar = ({ countries, filters, onUpdateFilters, onReset }) => {
  return (
    <div className="glass-panel p-4 rounded-2xl border border-maritime-border/50 mb-8 bg-maritime-card/80">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Title Tag */}
        <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-sm">
          <Filter className="w-4 h-4" />
          <span>Global Filter Control</span>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-4 flex-1 lg:max-w-4xl">
          {/* Country Selector */}
          <div className="relative flex-1">
            <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
              <Globe className="w-3 h-3 text-cyan-400" /> Target Country / Region
            </label>
            <select
              value={filters.countryCode}
              onChange={(e) => onUpdateFilters({ countryCode: e.target.value })}
              className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-400 transition-colors"
            >
              <option value="ALL">🌍 Global Aggregate (All Countries)</option>
              {countries.map((c) => (
                <option key={c.country_code} value={c.country_code}>
                  {c.country_name} ({c.country_code}) {c.is_aggregate ? '[Aggregate]' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Start Year */}
          <div className="w-full lg:w-32">
            <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-cyan-400" /> Start Year
            </label>
            <select
              value={filters.minYear}
              onChange={(e) => onUpdateFilters({ minYear: Number(e.target.value) })}
              className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-400 transition-colors"
            >
              {[1960, 1970, 1980, 1990, 2000, 2010, 2015, 2020].map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          {/* End Year */}
          <div className="w-full lg:w-32">
            <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-cyan-400" /> End Year
            </label>
            <select
              value={filters.maxYear}
              onChange={(e) => onUpdateFilters({ maxYear: Number(e.target.value) })}
              className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-400 transition-colors"
            >
              {[1980, 1990, 2000, 2010, 2015, 2020, 2024].map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>

          {/* Include Aggregates Toggle */}
          <div className="flex items-center space-x-2 pt-5">
            <input
              type="checkbox"
              id="includeAggregates"
              checked={filters.includeAggregates}
              onChange={(e) => onUpdateFilters({ includeAggregates: e.target.checked })}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-400 cursor-pointer"
            />
            <label htmlFor="includeAggregates" className="text-xs text-slate-300 font-medium cursor-pointer flex items-center gap-1 select-none">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Include Regional Aggregates
            </label>
          </div>
        </div>

        {/* Reset Button */}
        <div>
          <button
            onClick={onReset}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all shadow-sm"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
