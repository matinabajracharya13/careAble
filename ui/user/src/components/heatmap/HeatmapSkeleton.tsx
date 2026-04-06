
// Import the 12 competency domains we defined in the constants file
import { COMPETENCY_DOMAINS } from '../../constants/skills';

const HeatmapSkeleton = () => {
  return (
    /* Main Container: 
       - Mobile: Full width (w-full), no rounded corners, no shadow for a seamless app feel.
       - Desktop (md:): Max width 448px (max-w-md), centered (mx-auto), with shadow and border.
    */
    <div className="w-full p-4 bg-white animate-pulse rounded-none md:max-w-md md:mx-auto md:p-8 md:rounded-2xl md:shadow-lg md:border md:border-gray-100 md:mt-10">
      
      {/* Skeleton Title: Simulating "Your Skills Profile" text */}
      <div className=" h-6 bg-gray-200 rounded w-1/3 mb-8">Your Skills Profile</div>

      {/* Radar Chart Placeholder:
         - Centered using flex justify-center.
         - Responsive sizing: Smaller on mobile (w-40), larger on desktop (md:w-56).
      */}
      <div className="flex justify-center mb-10 w-full">
        <div className="w-40 h-40 md:w-56 md:h-56 bg-gray-100 rounded-full border-4 border-gray-50 flex items-center justify-center">
            {/* Inner decorative circle to mimic radar grid lines */}
            <div className="w-24 h-24 md:w-32 md:h-32 border border-gray-200 rounded-full opacity-50"></div>
        </div>
      </div>

      {/* Competency Labels Grid:
         - 2-column grid for all screen sizes.
         - Gap-x-12 on desktop to provide enough breathing room for long text.
      */}
      <div className="grid grid-cols-2 gap-x-6 md:gap-x-12 gap-y-4 px-2">
        {COMPETENCY_DOMAINS.map((domain) => (
          <div key={domain.id} className="flex items-center space-x-2">
            {/* Small bullet point for each domain */}
            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full flex-shrink-0"></div>
            
            {/* Domain Name Text: 
               - Using text-[10px] to prevent overlapping on narrow mobile screens.
               - Medium font weight for a professional look.
            */}
            <span className="text-[10px] text-gray-500 font-medium leading-tight uppercase tracking-tight">
              {domain.name}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Action Placeholder: Simulating a "Retake Test" or "Download" button */}
      <div className="mt-10 h-10 bg-gray-100 rounded-lg w-full"></div>
    </div>
  );
};

export default HeatmapSkeleton;