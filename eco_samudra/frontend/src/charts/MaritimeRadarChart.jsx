import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';

export const MaritimeRadarChart = ({ data = [], title = "4-Axis Sustainability Balance Radar" }) => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-maritime-border/50">
      <h3 className="text-base font-bold text-white mb-4">{title}</h3>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#1e406b" opacity={0.5} />
            <PolarAngleAxis dataKey="axis" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 10 }} />
            <Radar name="Country Score" dataKey="value" stroke="#00d2d3" fill="#00d2d3" fillOpacity={0.4} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#071527',
                borderColor: '#1e406b',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '12px'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
