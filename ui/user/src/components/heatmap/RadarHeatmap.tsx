// // ui/user/src/components/heatmap/RadarHeatmap.tsx
// import React from 'react';
// Import core components from the Recharts library we just installed
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';

// Import 12 domains constants
import { COMPETENCY_DOMAINS } from '../../constants/skills';

const RadarHeatmap = ({ data }: { data: any[] }) => {
  // Logic: Map the API data (d1, d2...) to the display names (Communication...)
  const formattedData = data.map(item => {
    const domain = COMPETENCY_DOMAINS.find(d => d.id === item.id);
    return {
      ...item,
      // This is what will show up on the chart's axes
      displayName: domain ? domain.name : item.id 
    };
  });

  return (
    <div className="w-full h-80 md:h-96 bg-white p-4">
      {/* ResponsiveContainer makes the chart adjust to phone/web screens automatically */}
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={formattedData}>
          {/* PolarGrid draws the web-like lines */}
          <PolarGrid stroke="#e5e7eb" />
          
          {/* Axis for the 12 domain names */}
          <PolarAngleAxis 
            dataKey="displayName" 
            tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 500 }} 
          />
          
          {/* Setting the scale from 1 to 5 */}
          <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />

          {/* THE HEATMAP ZONES: Background colors to show Support/Growth/Strength */}
          {/* Green Zone (4.0 - 5.0) */}
          <Radar dataKey="fullMark" stroke="none" fill="#10b981" fillOpacity={0.05} />
          
          {/* The User's Actual Performance Data (Blue Polygon) */}
          <Radar
            name="Skills"
            dataKey="score"
            stroke="#3b82f6"     // Blue border
            fill="#3b82f6"       // Blue fill
            fillOpacity={0.5}    // Semi-transparent
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarHeatmap;