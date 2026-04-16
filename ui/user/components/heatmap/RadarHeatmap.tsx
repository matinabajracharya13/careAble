import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer
} from 'recharts';
import { COMPETENCY_DOMAINS } from '../../constants/skills';

interface HeatmapData {
  id: string;
  score: number;
}

const RadarHeatmap = ({ data }: { data: HeatmapData[] }) => {
  // 1. Data Transformation: Map scores and define background zone boundaries
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

  return (
    /* MAIN CONTAINER*/
    <div className="bg-white p-4 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full min-h-fit overflow-hidden">
      
      {/* HEADER SECTION */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-800 leading-tight">Your Competency Profile</h3>
        <p className="text-sm text-slate-500 mt-1 italic">Visual breakdown of your skills across 12 domains</p>
      </div>

      {/* 2. CHART AREA - Dynamic heights for different screen sizes to prevent over-stretching */}
      <div className="w-full h-[320px] sm:h-[400px] md:h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart 
            cx="50%" 
            cy="50%" 
            outerRadius="75%" 
            data={formattedData} 
            style={{ outline: 'none' }}
          >
            {/* Circular grid layout */}
            <PolarGrid gridType="circle" stroke="#e2e8f0" strokeOpacity={0.8} />
            
            {/* Label Axis (Dimensions) */}
            <PolarAngleAxis 
              dataKey="displayName" 
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} 
            />

            {/* Radius Axis: Scale 0 to 5.0 */}
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 5]} 
              tickCount={6}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              axisLine={false} 
            />
            
            {/* --- BACKGROUND HEATMAP ZONES (Ordered from back to front) --- */}
            
            {/* Zone 1: Strength Area (Green - Outer ring) */}
            <Radar 
              dataKey="greenZone" 
              stroke="none" 
              fill="#4ade80" 
              fillOpacity={0.12} 
              isAnimationActive={false} 
            />

            {/* Zone 2: Growth Area (Yellow - Middle ring) */}
            <Radar 
              dataKey="yellowZone" 
              stroke="none" 
              fill="#facc15" 
              fillOpacity={0.15} 
              isAnimationActive={false} 
            />

            {/* Zone 3: Support Area (Red - Inner ring) */}
            <Radar 
              dataKey="redZone" 
              stroke="none" 
              fill="#f87171" 
              fillOpacity={0.18} 
              isAnimationActive={false} 
            />

            {/* --- 3. USER DATA LAYER ---
                - High contrast blue line
                - Visible dots at data points for precision
            */}
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

      {/* 4. LEGEND SECTION */}
      <div className="mt-8 pt-6 border-t border-slate-50 flex flex-wrap justify-center gap-x-5 gap-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 bg-[#f87171] opacity-40 rounded-sm border border-red-200 shadow-sm"></div>
          <span className="text-[6px] sm:text-xs font-bold text-slate-700 tracking-widest">Support Area (0-2.9)</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 bg-[#facc15] opacity-40 rounded-sm border border-yellow-200 shadow-sm"></div>
          <span className="text-[6px] sm:text-xs font-bold text-slate-700  tracking-widest">Growth Area (3.0-3.9)</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 bg-[#4ade80] opacity-40 rounded-sm border border-green-200 shadow-sm"></div>
          <span className="text-[6px] sm:text-xs font-bold text-slate-700  tracking-widest">Strength Area (4.0-5.0)</span>
        </div>
      </div>
    </div>
  );
};

export default RadarHeatmap;