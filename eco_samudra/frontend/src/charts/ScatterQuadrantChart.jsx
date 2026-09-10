import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid } from 'recharts';

export const ScatterQuadrantChart = ({ data = [], title = "Connectivity vs Container Traffic Matrix" }) => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-maritime-border/50">
      <h3 className="text-base font-bold text-white mb-2">{title}</h3>
      <p className="text-xs text-slate-400 mb-4">Correlation scatter matrix mapping LSCI Connectivity (X) vs Container Volume TEU (Y)</p>
      
      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e406b" opacity={0.4} />
            <XAxis type="number" dataKey="lsci" name="LSCI" stroke="#94a3b8" tick={{ fontSize: 11 }} label={{ value: 'LSCI Connectivity', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 12 }} />
            <YAxis type="number" dataKey="container_teu" name="TEU" stroke="#94a3b8" tick={{ fontSize: 11 }} label={{ value: 'Container TEU', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }} />
            <ZAxis type="number" range={[40, 200]} />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-950 border border-slate-700 p-3 rounded-xl shadow-xl text-xs">
                      <p className="font-bold text-cyan-300">{data.country_name} ({data.country_code})</p>
                      <p className="text-slate-300">LSCI: <span className="font-bold text-white">{data.lsci}</span></p>
                      <p className="text-slate-300">TEU: <span className="font-bold text-white">{data.container_teu?.toLocaleString()}</span></p>
                      <p className="text-emerald-400 mt-1 font-semibold">{data.quadrant}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Ports" data={data} fill="#00d2d3" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
