import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { COMPETENCY_DOMAINS } from '../../constants/skills';

interface HeatmapData {
  id: string;
  score: number;
}

const RadarHeatmap = ({ data }: { data: HeatmapData[] }) => {

  // Map data and attach display names + zone values
  const formattedData = data.map(item => {
    const domain = COMPETENCY_DOMAINS?.find(d => d.id === item.id);
    return {
      ...item,
      displayName: domain ? (domain.name || domain.name) : item.id,
      // Fixed boundaries for background "Heatmap" zones
      greenZone: 5.0,  // Strength Area boundary
      yellowZone: 3.9, // Growth Area boundary
      redZone: 2.9,    // Support Area boundary
    };
  });

  // =========================
  //  TOP 3 LOGIC
  // =========================

  // Sort descending for strengths/growth
  const sortedDesc = [...formattedData].sort((a, b) => b.score - a.score);

  // Top strengths (>=4)
  const strengths = sortedDesc.filter(i => i.score >= 4).slice(0, 3);

  // Growth (3–3.9)
  const growth = sortedDesc.filter(i => i.score >= 3 && i.score < 4).slice(0, 3);

  // Support (<3) sorted ascending (lowest first)
  const support = [...formattedData]
    .filter(i => i.score < 3)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  // =========================
  // CustomTooltip Component - Tooltip
  // This renders the floating bubble when a user hovers over a data point.
  // =========================

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    // Only render if the tooltip is active and has data
    if (active && payload && payload.length) {

      // Ensure we get the correct "score" value
      const dataPoint = payload?.find((p: any) => p.dataKey === "score");

      const score = dataPoint?.value || 0;
      const name = dataPoint?.payload.displayName;

       // Determine the color theme based on the score zone
      let themeColor = "text-blue-600 border-blue-100 bg-blue-50";
      if (score >= 4.0) themeColor = "text-green-600 border-green-100 bg-green-50";
      else if (score >= 3.0) themeColor = "text-yellow-600 border-yellow-100 bg-yellow-50";
      else themeColor = "text-red-600 border-red-100 bg-red-50";

      return (
        <div className={`p-3 rounded-xl border-2 backdrop-blur-sm ${themeColor}`}>
          <p className="font-bold text-sm mb-0.5">{name}</p>
          <p className="text-xs font-black uppercase tracking-wider">Score: {score.toFixed(1)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    /* MAIN CONTAINER*/
    <div className="bg-white p-4 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full min-h-fit overflow-hidden">

       {/* HEADER SECTION */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-800 leading-tight">Your Competency Profile</h3>
        <p className="text-sm text-slate-500 italic">
          Visual breakdown of your skills across domains
        </p>
      </div>

      {/* CHART */}
      <div className="w-full h-[320px] sm:h-[400px] md:h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart 
            cx="50%" 
            cy="50%" 
            outerRadius="75%" 
            style={{ outline: 'none', border: 'none' }} 
            data={formattedData}
            >
            
            {/* Add Tooltip here - it must be inside RadarChart */}
            <Tooltip content={<CustomTooltip />} cursor={false} />

            {/* Background zones */}
            <Radar dataKey="greenZone" fill="#4ade80" fillOpacity={0.1} />
            <Radar dataKey="yellowZone" fill="#facc15" fillOpacity={0.15} />
            <Radar dataKey="redZone" fill="#f87171" fillOpacity={0.2} />

            

            <PolarGrid />
            <PolarAngleAxis 
              dataKey="displayName" 
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} 
            />
            <PolarRadiusAxis  
              angle={90} 
              domain={[0, 5]} 
              tickCount={6}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={false} 
            />

            {/* User data */}
            <Radar
               name="Current Score"
              dataKey="score"
              stroke="#1e40af"     // Deep blue border
              strokeWidth={3}
              fill="#3b82f6"       // Primary blue fill
              fillOpacity={0.3}
              dot={{ r: 4, fill: '#1e40af', stroke: '#fff', strokeWidth: 2 }} // Added dots like the reference
              activeDot={{ r: 6, strokeWidth: 0 }}
            />

          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* LEGEND */}
      <div className="flex justify-center gap-6 mt-6 text-sm">
        <span className="text-red-500">● Support Area(0-2.9)</span>
        <span className="text-yellow-500">● Growth Area (3.0-3.9)</span>
        <span className="text-green-500">● Strength Area(4.0-5.0)</span>
      </div>

      {/* =========================
           TOP 3 CARDS UI
      ========================= */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">

        {/* Strength */}
        <div className="bg-green-50 p-4 rounded-xl">
          <h4 className="font-bold text-green-700 mb-2">Top Strengths</h4>
          {strengths.map(item => (
            <p key={item.id} className="text-sm">
              <span className="text-green-500 italic font-bold">✔</span> {item.displayName} ({item.score.toFixed(1)})
            </p>
          ))}
        </div>

        {/* Growth */}
        <div className="bg-yellow-50 p-4 rounded-xl">
          <h4 className="font-bold text-yellow-700 mb-2">Growth Areas</h4>
          {growth.map(item => (
            <p key={item.id} className="text-sm">
              <span className="text-yellow-500 font-bold">→</span> {item.displayName} ({item.score.toFixed(1)})
            </p>
          ))}
        </div>

        {/* Support */}
        <div className="bg-red-50 p-4 rounded-xl">
          <h4 className="font-bold text-red-700 mb-2">Needs Support</h4>
          {support.map(item => (
            <p key={item.id} className="text-sm">
              <span className="text-red-500 font-bold">⚠</span> {item.displayName} ({item.score.toFixed(1)})
            </p>
          ))}
        </div>

      </div>

    </div>
  );
};

export default RadarHeatmap;