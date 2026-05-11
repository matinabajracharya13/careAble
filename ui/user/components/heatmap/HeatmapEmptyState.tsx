"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

// Import competency domains
import { COMPETENCY_DOMAINS } from '../../constants/skills';

const HeatmapEmptyState = () => {

  // Router for navigation
  const router = useRouter();

  return (

    /* =========================
       MAIN CONTAINER
    ========================= */
    <div className="
      w-full
      bg-white
      rounded-2xl
      border
      border-gray-100
      shadow-sm
      p-6
      md:p-8
    ">

      {/* =========================
          HEADER SECTION
      ========================= */}
      <div className="text-center mb-8">

        {/* Main title */}
        <h2 className="text-2xl font-bold text-slate-800">
          Your Competency Profile
        </h2>

        {/* Description */}
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          Complete your first assessment to unlock your personalised
          competency heatmap and professional insights.
        </p>

      </div>

      {/* =========================
          RADAR PLACEHOLDER
      ========================= */}
      <div className="flex justify-center mb-10">

        {/* Outer radar circle */}
        <div className="
          relative
          w-48
          h-48
          md:w-64
          md:h-64
          rounded-full
          border-4
          border-dashed
          border-slate-200
          flex
          items-center
          justify-center
          bg-slate-50
        ">

          {/* Middle circle */}
          <div className="
            w-32
            h-32
            md:w-44
            md:h-44
            rounded-full
            border
            border-slate-200
            flex
            items-center
            justify-center
          ">

            {/* Inner circle */}
            <div className="
              w-16
              h-16
              md:w-24
              md:h-24
              rounded-full
              border
              border-slate-200
            "></div>

          </div>

        </div>

      </div>

      {/* =========================
          COMPETENCY DOMAINS
      ========================= */}
      <div className="
        grid
        grid-cols-2
        md:grid-cols-3
        gap-x-6
        gap-y-4
        mb-10
      ">

        {COMPETENCY_DOMAINS.map((domain) => (

          <div
            key={domain.id}
            className="flex items-center gap-2"
          >

            {/* Small indicator dot */}
            <div className="
              w-2
              h-2
              rounded-full
              bg-slate-300
              flex-shrink-0
            "></div>

            {/* Domain name */}
            <span className="
              text-xs
              text-slate-500
              font-medium
              leading-tight
            ">
              {domain.name}
            </span>

          </div>

        ))}

      </div>

      {/* =========================
          ACTION SECTION
      ========================= */}
      <div className="text-center">

        {/* CTA Button */}
        <button
          onClick={() => router.push('/assessment')}
          className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-6
            py-3
            rounded-xl
            font-semibold
            text-sm
            transition
            shadow-sm
          "
        >
          Start Assessment
        </button>

      </div>

    </div>
  );
};

export default HeatmapEmptyState;