import React from 'react';

export const TdsGemIcon: React.FC<{ className?: string }> = ({
  className = 'w-3.5 h-3.5 inline-block shrink-0'
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 0 3px rgba(217, 70, 239, 0.85))' }}
      aria-label="TDS Purple Gem"
    >
      <defs>
        <linearGradient id="tdsGemTopLight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#f5d0fe" />
          <stop offset="100%" stopColor="#e879f9" />
        </linearGradient>

        <linearGradient id="tdsGemMid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="45%" stopColor="#d946ef" />
          <stop offset="100%" stopColor="#a21caf" />
        </linearGradient>

        <linearGradient id="tdsGemDark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a21caf" />
          <stop offset="60%" stopColor="#701a75" />
          <stop offset="100%" stopColor="#4a044e" />
        </linearGradient>
      </defs>

      {/* Main crystalline faceted gem shard shape based on TDS Hardcore Gem currency */}
      {/* Top light facet */}
      <polygon points="12,2 17,6 13,10 9,8" fill="url(#tdsGemTopLight)" />

      {/* Top right facet */}
      <polygon points="17,6 21,11 16,14 13,10" fill="url(#tdsGemMid)" />

      {/* Top left facet */}
      <polygon points="12,2 9,8 4,9 6,5" fill="#e879f9" opacity="0.95" />

      {/* Center main facet */}
      <polygon points="9,8 13,10 16,14 11,19 7,14" fill="url(#tdsGemMid)" />

      {/* Left side facet */}
      <polygon points="4,9 9,8 7,14 3,15" fill="#c026d3" />

      {/* Bottom right shadow facet */}
      <polygon points="16,14 21,11 19,19 14,22 11,19" fill="url(#tdsGemDark)" />

      {/* Bottom left shadow facet */}
      <polygon points="7,14 11,19 14,22 8,22 3,15" fill="#701a75" />

      {/* Shimmer highlight line */}
      <line
        x1="12"
        y1="3"
        x2="16"
        y2="7"
        stroke="#ffffff"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
};
