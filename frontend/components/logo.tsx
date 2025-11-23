export const LogoCrest = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="crestGradient" x1="0" y1="0" x2="24" y2="24">
        <stop offset="0%" stopColor="#3b82f6" /> {/* Blue */}
        <stop offset="100%" stopColor="#10b981" /> {/* Emerald */}
      </linearGradient>
    </defs>
    <path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      stroke="url(#crestGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 12l2 2 4-4"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="8" r="1" fill="url(#crestGradient)" />
    <circle cx="12" cy="17" r="1" fill="url(#crestGradient)" />
  </svg>
);
