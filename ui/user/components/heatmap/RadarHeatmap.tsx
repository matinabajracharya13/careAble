import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { useRouter } from 'next/navigation'; //  for navigation
import { COMPETENCY_DOMAINS } from '../../constants/skills';

interface HeatmapData {
  id: string;
  score: number;
}

const RadarHeatmap = ({ data }: { data: HeatmapData[] }) => {

  const router = useRouter(); // ✅ NEW: initialize router

  // ✅ NEW: check if user has data (important for UX)
  const hasData = data && data.length > 0;

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

  const sortedDesc = [...formattedData].sort((a, b) => b.score - a.score);

  const strengths = sortedDesc.filter(i => i.score >= 4).slice(0, 3);

  const growth = sortedDesc.filter(i => i.score >= 3 && i.score < 4).slice(0, 3);

  const support = [...formattedData]
    .filter(i => i.score < 3)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  // =========================
  // CustomTooltip Component
  // =========================

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {

      const dataPoint = payload?.find((p: any) => p.dataKey === "score");

      const score = dataPoint?.value || 0;
      const name = dataPoint?.payload.displayName;

      // Determine color based on score
      let themeColor = "text-blue-600 border-blue-100 bg-blue-50";
      if (score >= 4.0) themeColor = "text-green-600 border-green-100 bg-green-50";
      else if (score >= 3.0) themeColor = "text-yellow-600 border-yellow-100 bg-yellow-50";
      else themeColor = "text-red-600 border-red-100 bg-red-50";

      return (
        <div className={`p-3 rounded-xl border-2 backdrop-blur-sm ${themeColor}`}>
          <p className="font-bold text-sm mb-0.5">{name}</p>
          <p className="text-xs font-black uppercase tracking-wider">
            Score: {score.toFixed(1)}
          </p>
        </div>
      );
    }
    return null;
  };

  // =========================
  // EMPTY STATE (NEW)
  // =========================

  if (!hasData) {
    return (
      <div className="bg-white p-10 rounded-2xl text-center shadow-sm">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          You haven't completed your assessment
        </h2>

        <button
          onClick={() => router.push('/assessment')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
        >
          Start Assessment
        </button>
      </div>
    );
  }

  return (
    /* MAIN CONTAINER*/
    <div className="bg-white p-4 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full min-h-fit overflow-hidden">

      {/* HEADER SECTION */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-800 leading-tight">
          Your Competency Profile
        </h3>
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
              stroke="#1e40af"
              strokeWidth={3}
              fill="#3b82f6"
              fillOpacity={0.3}
              dot={{ r: 4, fill: '#1e40af', stroke: '#fff', strokeWidth: 2 }}
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

      {/* TOP 3 CARDS */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">

        <div className="bg-green-50 p-4 rounded-xl">
          <h4 className="font-bold text-green-700 mb-2">Top 3 Strengths</h4>
          {strengths.map(item => (
            <p key={item.id} className="text-sm">
              <span className="text-green-500 italic font-bold">✔</span>
              {item.displayName} ({item.score.toFixed(1)})
            </p>
          ))}
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl">
          <h4 className="font-bold text-yellow-700 mb-2">Growth Areas</h4>
          {growth.map(item => (
            <p key={item.id} className="text-sm">
              <span className="text-yellow-500 font-bold">→</span>
              {item.displayName} ({item.score.toFixed(1)})
            </p>
          ))}
        </div>

        <div className="bg-red-50 p-4 rounded-xl">
          <h4 className="font-bold text-red-700 mb-2">Needs Support</h4>
          {support.map(item => (
            <p key={item.id} className="text-sm">
              <span className="text-red-500 font-bold">⚠</span>
              {item.displayName} ({item.score.toFixed(1)})
            </p>
          ))}
        </div>

      </div>

      {/* =========================
           CERTIFICATE BUTTON 
      ========================= */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => router.push('/certificate')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition"
        >
          View & Download Certificate
        </button>
      </div>

    </div>
  );
};

export default RadarHeatmap;