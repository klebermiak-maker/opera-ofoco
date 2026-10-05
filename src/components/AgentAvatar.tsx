import React from 'react';

interface AgentAvatarProps {
  mood?: 'ready' | 'celebrating' | 'encouraging' | 'thinking';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBadge?: boolean;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  mood = 'ready',
  size = 'md',
  className = '',
  showBadge = true,
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-44 h-44',
  }[size];

  return (
    <div className={`relative inline-block select-none ${sizeClasses} ${className}`}>
      {/* Outer tech holographic ring */}
      <svg
        viewBox="0 0 160 160"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Agente Foco - Personagem Guia"
      >
        <defs>
          <linearGradient id="agentSuit" x1="20" y1="90" x2="140" y2="150" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E293B" />
            <stop offset="0.5" stopColor="#0F172A" />
            <stop offset="1" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="agentVisor" x1="45" y1="60" x2="115" y2="76" gradientUnits="userSpaceOnUse">
            <stop stopColor="#06B6D4" stopOpacity="0.8" />
            <stop offset="1" stopColor="#3B82F6" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="hairGrad" x1="40" y1="20" x2="120" y2="70" gradientUnits="userSpaceOnUse">
            <stop stopColor="#334155" />
            <stop offset="1" stopColor="#1E293B" />
          </linearGradient>
        </defs>

        {/* Circular backing field */}
        <circle cx="80" cy="80" r="76" fill="#090D16" stroke="#1E293B" strokeWidth="2.5" />
        <circle cx="80" cy="80" r="71" stroke="#0EA5E9" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 3" />

        {/* Tactical Shoulders & Jacket */}
        <path
          d="M32 152C32 124 50 112 80 112C110 112 128 124 128 152H32Z"
          fill="url(#agentSuit)"
          stroke="#334155"
          strokeWidth="2"
        />

        {/* Tech Collar & Cyan Accent */}
        <path d="M62 112L80 128L98 112H62Z" fill="#0EA5E9" />
        <path d="M78 128V152H82V128H78Z" fill="#0284C7" />

        {/* Detective badge pin */}
        {showBadge && (
          <g transform="translate(98, 122)">
            <polygon points="6,0 12,4 10,12 2,12 0,4" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
            <circle cx="6" cy="6" r="2" fill="#FEF3C7" />
          </g>
        )}

        {/* Neck */}
        <rect x="70" y="94" width="20" height="20" rx="4" fill="#FCD34D" opacity="0.9" />

        {/* Head / Face */}
        <rect x="52" y="44" width="56" height="58" rx="22" fill="#FDE68A" />

        {/* Modern styled hair */}
        <path
          d="M48 52C48 30 64 22 80 22C98 22 114 30 112 52C112 40 102 32 80 32C62 32 52 40 48 52Z"
          fill="url(#hairGrad)"
        />
        <path
          d="M50 42C56 34 68 30 84 32C98 34 106 42 110 48C104 42 94 38 82 38C68 38 56 42 50 42Z"
          fill="#475569"
        />

        {/* Eyebrows */}
        {mood === 'celebrating' ? (
          <>
            <path d="M58 52Q66 48 72 52" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M88 52Q94 48 102 52" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : mood === 'encouraging' ? (
          <>
            <path d="M58 51Q65 53 72 51" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M88 51Q95 53 102 51" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M58 53L72 51" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M88 51L102 53" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {/* Smart Glasses / Tactical Visor frames */}
        <rect x="55" y="56" width="22" height="15" rx="5" fill="#0F172A" stroke="#0284C7" strokeWidth="2" />
        <rect x="83" y="56" width="22" height="15" rx="5" fill="#0F172A" stroke="#0284C7" strokeWidth="2" />
        <path d="M77 62H83" stroke="#0284C7" strokeWidth="2.5" />

        {/* Eyes inside visor */}
        {mood === 'celebrating' ? (
          <>
            {/* Happy curved eyes */}
            <path d="M60 65Q66 60 72 65" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M88 65Q94 60 100 65" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            {/* Focused sharp eyes */}
            <circle cx="66" cy="63" r="3.5" fill="#38BDF8" />
            <circle cx="94" cy="63" r="3.5" fill="#38BDF8" />
            <circle cx="67" cy="62" r="1" fill="#FFFFFF" />
            <circle cx="95" cy="62" r="1" fill="#FFFFFF" />
          </>
        )}

        {/* Tech Earpiece Comm unit */}
        <rect x="47" y="60" width="5" height="10" rx="2" fill="#0284C7" />
        <circle cx="49" cy="65" r="1.5" fill="#38BDF8" />

        {/* Mouth expression */}
        {mood === 'celebrating' ? (
          <path d="M73 82Q80 90 87 82" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="#F87171" />
        ) : mood === 'encouraging' ? (
          <path d="M74 83Q80 87 86 83" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M75 83H85" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
        )}
      </svg>
    </div>
  );
};
