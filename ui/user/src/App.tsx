// import HeatmapSkeleton from './components/heatmap/HeatmapSkeleton';
import RadarHeatmap from './components/heatmap/RadarHeatmap';
import heatmapData from './data/heatmapData.json';

export default function App() {
  return (
    
    <div className='min-h-screen bg-background'>
      {/* Navbar */}
      <h1 className='text-2xl font-bold p-4'>Welcome to Cartable</h1>
      <RadarHeatmap data={heatmapData} />
    </div>
  );
}
