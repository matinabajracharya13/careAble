import HeatmapSkeleton from './components/heatmap/HeatmapSkeleton';

export default function App() {
  return (
    
    <div className='min-h-screen bg-background'>
      {/* Navbar */}
      <h1 className='text-2xl font-bold p-4'>Welcome to Cartable</h1>
      <HeatmapSkeleton />
    </div>
  );
}
