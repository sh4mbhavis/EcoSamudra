import React from 'react';
import { Ship, Anchor, Globe, Activity, Sliders, BookOpen, Palette, Download, ShieldCheck } from 'lucide-react';

export const Navbar = ({ activePage, setActivePage, theme, setSpecificTheme, onExport }) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'maritime', label: 'Port Leaders & LSCI', icon: Ship },
    { id: 'explorer', label: 'Country Explorer', icon: Globe },
    { id: 'sustainability', label: 'Green Index (GMI)', icon: Anchor },
    { id: 'scenario', label: 'Scenario Simulator', icon: Sliders },
    { id: 'methodology', label: 'Methodology', icon: BookOpen },
  ];

  const colorPalettes = [
    { id: 'cyan', label: 'Abyssal Cyan', dotBg: 'bg-cyan-400' },
    { id: 'sapphire', label: 'Royal Sapphire', dotBg: 'bg-sky-400' },
    { id: 'teal', label: 'Biolum Teal', dotBg: 'bg-emerald-400' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-maritime-border/30 backdrop-blur-xl bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Title */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group flex-shrink-0" 
            onClick={() => setActivePage('dashboard')}
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-400 to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/20 flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Ship className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  ECO-SAMUDRA
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> GMI v1.0
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Maritime Sustainability Analytics</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/35 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Color Palette Switcher & Export */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {onExport && (
              <button
                onClick={onExport}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all shadow-sm"
                title="Export Filtered CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            )}

            {/* 3-Palette Switcher */}
            <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <Palette className="w-3.5 h-3.5 text-slate-400 ml-1.5 hidden sm:inline" />
              {colorPalettes.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSpecificTheme(p.id)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    theme === p.id
                      ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={`Switch to ${p.label} Palette`}
                >
                  <span className={`w-2 h-2 rounded-full ${p.dotBg}`} />
                  <span className="hidden md:inline">{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex overflow-x-auto py-2 space-x-2 border-t border-slate-800/80 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 bg-slate-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
