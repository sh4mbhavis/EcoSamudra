import React, { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { useMaritimeData } from './hooks/useMaritimeData';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { MaritimeAnalytics } from './pages/MaritimeAnalytics';
import { CountryExplorer } from './pages/CountryExplorer';
import { Sustainability } from './pages/Sustainability';
import { ScenarioAnalysis } from './pages/ScenarioAnalysis';
import { Methodology } from './pages/Methodology';
import { exportToCsv } from './utils/exportCsv';
import { Anchor } from 'lucide-react';

export default function App() {
  const { theme, setSpecificTheme } = useTheme();
  const [activePage, setActivePage] = useState('dashboard');
  
  const {
    countries,
    filters,
    updateFilters,
    resetFilters,
    overviewData,
    loading,
    error,
  } = useMaritimeData();

  const handleExportCsv = () => {
    if (overviewData?.yearly_trends) {
      exportToCsv(`eco_samudra_export_${filters.countryCode}_${filters.minYear}_${filters.maxYear}.csv`, overviewData.yearly_trends);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-maritime-dark text-slate-100 font-sans transition-colors duration-300">
      {/* Navigation Header */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        theme={theme}
        setSpecificTheme={setSpecificTheme}
        onExport={handleExportCsv}
      />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activePage === 'dashboard' && (
          <Dashboard
            data={overviewData}
            loading={loading}
            error={error}
            filters={filters}
            onUpdateFilters={updateFilters}
            onReset={resetFilters}
            countries={countries}
          />
        )}
        {activePage === 'maritime' && <MaritimeAnalytics />}
        {activePage === 'explorer' && <CountryExplorer countries={countries} />}
        {activePage === 'sustainability' && <Sustainability />}
        {activePage === 'scenario' && <ScenarioAnalysis countries={countries} />}
        {activePage === 'methodology' && <Methodology />}
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-maritime-border/40 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <Anchor className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-200">ECO-SAMUDRA Analytics Platform</span>
            <span>— Green Fleet Intelligence</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-[11px] text-slate-400">8,733 Dataset Records (1960 - 2024)</span>
            <span className="text-[11px] text-emerald-400 font-mono">GMI v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
