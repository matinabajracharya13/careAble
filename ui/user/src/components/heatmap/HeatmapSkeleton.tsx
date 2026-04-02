
const HeatmapSkeleton = () => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm animate-pulse">
      {/* Title occupation of the simulated heat map */}
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-8"></div>
      
      {/* Simulated circular radar chart/heat map body */}
      <div className="flex justify-center mb-8">
        <div className="w-64 h-64 bg-gray-200 rounded-full"></div>
      </div>
      
      {/* Simulated bottom 12 domain score placeholders */}
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-100 rounded w-full"></div>
        ))}
      </div>
    </div>
  );
};

export default HeatmapSkeleton;