import React from 'react';
import { BookOpen, Database, ShieldCheck, Cpu, Code2, Layers } from 'lucide-react';

export const Methodology = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-maritime-card to-slate-950">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-3 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">System Methodology & Data Integrity</h1>
            <p className="text-xs text-slate-300">
              Full transparency on World Bank dataset provenance, cleaning protocols, GMI formulation, and future ML roadmap contracts.
            </p>
          </div>
        </div>
      </div>

      {/* Data Provenance & Cleaning Section */}
      <div className="glass-panel p-6 rounded-3xl border border-maritime-border/50 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-cyan-400" /> Data Provenance & Preprocessing Architecture
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          The ECO-SAMUDRA analytics engine ingests 8,733 records spanning 205 sovereign nations and 45 regional economic aggregates from 1960 to 2024.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-4">
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-cyan-400 mb-1">1. Aggregate Separation</h3>
            Identifies sovereign countries (<code className="text-cyan-300">is_aggregate == False</code>) vs economic groupings (e.g. World, OECD, High Income) to prevent double-counting in global KPIs.
          </div>
          <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-emerald-400 mb-1">2. Missing Value Imputation</h3>
            Applies country-level forward fill for historical reporting gaps combined with baseline mean imputation for missing values.
          </div>
        </div>
      </div>

      {/* Green Maritime Index Formulation */}
      <div className="glass-panel p-6 rounded-3xl border border-maritime-border/50 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" /> Green Maritime Index (GMI) Scoring Formulation
        </h2>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-300 space-y-2">
          <p>GMI = 0.25 * Norm(LSCI) + 0.25 * LogNorm(TEU) + 0.30 * (100 - FossilFuel%) + 0.20 * Norm(EnergyIndep)</p>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          The GMI is explicitly presented as a project-defined analytical index scoring maritime fleet connectivity, container scale, energy transition, and energy self-reliance.
        </p>
      </div>

      {/* Future Machine Learning Roadmap Contracts */}
      <div className="glass-panel p-6 rounded-3xl border border-maritime-border/50 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" /> Machine Learning Roadmap & Interface Contracts
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Future machine learning modules are architected as formal abstract interfaces in <code className="text-cyan-300">prediction_service.py</code>:
        </p>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
          <pre>{`class MaritimeMLModelInterface(ABC):
    @abstractmethod
    def train(self, data: Any) -> Dict[str, float]: pass

    @abstractmethod
    def predict(self, input_features: Dict[str, Any]) -> Dict[str, Any]: pass

    @abstractmethod
    def evaluate(self, test_data: Any) -> Dict[str, float]: pass`}</pre>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mt-4">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <span className="font-bold text-cyan-400 block mb-1">AIS Vessel Emission Model</span>
            Predict vessel fuel consumption and GHG emissions from live AIS trajectory data.
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <span className="font-bold text-emerald-400 block mb-1">Voyage Weather Routing</span>
            Optimize vessel speeds and routes to minimize ocean hydrodynamic drag and carbon intensity.
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
            <span className="font-bold text-amber-400 block mb-1">Port Congestion Predictor</span>
            Forecast port dwell times and container berth bottleneck risks.
          </div>
        </div>
      </div>
    </div>
  );
};
