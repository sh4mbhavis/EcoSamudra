import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

export const TrendLineChart = ({ data = [], dataKeys = [], title = "Historical Multi-Metric Trends" }) => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-maritime-border/50">
      <h3 className="text-base font-bold text-white mb-4">{title}</h3>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e406b" opacity={0.4} />
            <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#071527',
                borderColor: '#1e406b',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
            {dataKeys.map((item) => (
              <Line
                key={item.key}
                type="monotone"
                dataKey={item.key}
                name={item.name}
                stroke={item.color || '#00d2d3'}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
