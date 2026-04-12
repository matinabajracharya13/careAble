import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { COMPETENCY_DOMAINS } from '../../constants/skills';

const RadarHeatmap = ({ data }: { data: any[] }) => {
  const formattedData = data.map(item => {
    const domain = COMPETENCY_DOMAINS?.find(d => d.id === item.id);
    return {
      ...item,
      displayName: domain ? domain.name : item.id,
    };
  });

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      {/* Title */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800">Caregiving Competency Map</h3>
        <p className="text-sm text-slate-500 italic">Visual breakdown of your skills across 12 domains</p>
      </div>

      {/* Radar Chart Area */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formattedData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis 
              dataKey="displayName" 
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} 
            />
            <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#2563eb"
              strokeWidth={2.5}
              fill="#3b82f6"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadarHeatmap;