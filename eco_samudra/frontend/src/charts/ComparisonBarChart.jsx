import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export const ComparisonBarChart = ({ data = [], country1Code = 'IND', country2Code = 'SGP', title = "Comparative Metrics" }) => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-maritime-border/50">
      <h3 className="text-base font-bold text-white mb-4">{title}</h3>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e406b" opacity={0.4} />
            <XAxis dataKey="metric" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#071527',
                borderColor: '#1e406b',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
            <Bar dataKey={country1Code} name={country1Code} fill="#00d2d3" radius={[6, 6, 0, 0]} />
            <Bar dataKey={country2Code} name={country2Code} fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
