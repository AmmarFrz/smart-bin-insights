export function EcoPhoraLogo({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="leaf-grad" x1="20" y1="16" x2="44" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="currentColor" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <path
        d="M32 8C20 15 13 27 15 41c2 14 17 17 17 17s2-7 5-14c3-7 7-16 12-21C53 19 46 8 32 8z"
        fill="url(#leaf-grad)"
        opacity="0.95"
      />
      <path d="M32 46c0-12 4-21 7-28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.4" />
      <path d="M27 36c5-2 9-3 14-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.3" />
      <path d="M25 44c6-2 12-3 17-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.3" />
    </svg>
  );
}
