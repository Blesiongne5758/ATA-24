import { useEffect, useState } from 'react';

interface RobotAnimationProps {
  isActive: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function RobotAnimation({ isActive, size = 'lg' }: RobotAnimationProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isActive]);

  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      {/* Outer Aura Ring */}
      {isActive && (
        <>
          <div className="absolute inset-0 rounded-full animate-aura-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(255,165,0,0.3) 0%, rgba(255,69,0,0.1) 50%, transparent 70%)',
            }}
          />
          <div className="absolute inset-[-20px] rounded-full animate-aura-rotate"
            style={{
              border: '2px solid rgba(255,165,0,0.4)',
              borderTopColor: 'rgba(255,69,0,0.8)',
              borderRightColor: 'transparent',
            }}
          />
          <div className="absolute inset-[-35px] rounded-full animate-aura-rotate"
            style={{
              border: '1px solid rgba(255,165,0,0.2)',
              borderBottomColor: 'rgba(255,200,0,0.6)',
              borderLeftColor: 'transparent',
              animationDirection: 'reverse',
              animationDuration: '4s',
            }}
          />

          {/* Energy Rings */}
          <div className="absolute inset-[-10px] rounded-full animate-energy-ring"
            style={{ border: '3px solid rgba(255,165,0,0.6)', borderStyle: 'dashed' }}
          />

          {/* Fire Particles */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute w-2 h-2 rounded-full animate-particle-rise"
              style={{
                left: `calc(50% + ${p.x}px)`,
                bottom: `${p.y * 0.5}px`,
                background: `radial-gradient(circle, #ff6600, #ff3300)`,
                animationDelay: `${p.delay}s`,
                boxShadow: '0 0 6px #ff6600, 0 0 12px #ff3300',
              }}
            />
          ))}

          {/* Lightning Bolts */}
          <div className="absolute inset-0 animate-lightning">
            <svg viewBox="0 0 100 100" className="w-full h-full opacity-60">
              <path d="M50 10 L45 40 L55 35 L48 70 L60 45 L52 48 L58 20 Z"
                fill="none" stroke="rgba(255,200,0,0.8)" strokeWidth="1" />
            </svg>
          </div>

          {/* Fire Aura Body Effect */}
          <div className="absolute inset-[-5px] rounded-full animate-fire-flicker"
            style={{
              background: 'conic-gradient(from 0deg, rgba(255,69,0,0.4), rgba(255,165,0,0.6), rgba(255,200,0,0.4), rgba(255,69,0,0.6), rgba(255,69,0,0.4))',
              filter: 'blur(8px)',
            }}
          />

          {/* Inner Glow */}
          <div className="absolute inset-2 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,100,0,0.2) 0%, transparent 70%)',
              animation: 'aura-pulse 0.8s ease-in-out infinite',
            }}
          />
        </>
      )}

      {/* Robot Body */}
      <div className={`relative z-10 ${isActive ? 'animate-shake' : ''}`}>
        <svg viewBox="0 0 120 140" className="w-full h-full drop-shadow-lg">
          {/* Robot Head */}
          <rect x="35" y="10" width="50" height="40" rx="8"
            fill={isActive ? '#1a1a3a' : '#0d0d2a'}
            stroke={isActive ? '#ff8c00' : '#444'}
            strokeWidth="2"
          />
          {/* Antenna */}
          <line x1="60" y1="10" x2="60" y2="2" stroke={isActive ? '#ff8c00' : '#444'} strokeWidth="2" />
          <circle cx="60" cy="2" r="3" fill={isActive ? '#ff6600' : '#333'}>
            {isActive && <animate attributeName="fill" values="#ff6600;#ffcc00;#ff6600" dur="0.5s" repeatCount="indefinite" />}
          </circle>
          {/* Eyes */}
          <circle cx="48" cy="28" r="6" fill={isActive ? '#ff4400' : '#222'}>
            {isActive && <animate attributeName="fill" values="#ff4400;#ffaa00;#ff4400" dur="1s" repeatCount="indefinite" />}
          </circle>
          <circle cx="72" cy="28" r="6" fill={isActive ? '#ff4400' : '#222'}>
            {isActive && <animate attributeName="fill" values="#ff4400;#ffaa00;#ff4400" dur="1s" repeatCount="indefinite" />}
          </circle>
          {/* Eye Glow */}
          {isActive && (
            <>
              <circle cx="48" cy="28" r="8" fill="none" stroke="rgba(255,100,0,0.5)" strokeWidth="1">
                <animate attributeName="r" values="8;12;8" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="72" cy="28" r="8" fill="none" stroke="rgba(255,100,0,0.5)" strokeWidth="1">
                <animate attributeName="r" values="8;12;8" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite" />
              </circle>
            </>
          )}
          {/* Mouth */}
          <rect x="45" y="38" width="30" height="4" rx="2"
            fill={isActive ? '#ff6600' : '#333'}
          >
            {isActive && <animate attributeName="width" values="30;20;30" dur="0.8s" repeatCount="indefinite" />}
            {isActive && <animate attributeName="x" values="45;50;45" dur="0.8s" repeatCount="indefinite" />}
          </rect>

          {/* Neck */}
          <rect x="52" y="50" width="16" height="8" fill={isActive ? '#1a1a3a' : '#0d0d2a'} stroke={isActive ? '#ff8c00' : '#444'} strokeWidth="1" />

          {/* Body */}
          <rect x="25" y="58" width="70" height="50" rx="10"
            fill={isActive ? '#1a1a3a' : '#0d0d2a'}
            stroke={isActive ? '#ff8c00' : '#444'}
            strokeWidth="2"
          />
          {/* Chest Core */}
          <circle cx="60" cy="80" r="12" fill={isActive ? 'rgba(255,100,0,0.3)' : 'rgba(50,50,50,0.3)'} stroke={isActive ? '#ff6600' : '#333'} strokeWidth="2">
            {isActive && <animate attributeName="r" values="12;14;12" dur="1s" repeatCount="indefinite" />}
          </circle>
          <circle cx="60" cy="80" r="6" fill={isActive ? '#ff4400' : '#222'}>
            {isActive && <animate attributeName="fill" values="#ff4400;#ffcc00;#ff4400" dur="0.7s" repeatCount="indefinite" />}
          </circle>
          {/* Body Lines */}
          <line x1="35" y1="65" x2="35" y2="100" stroke={isActive ? 'rgba(255,165,0,0.4)' : 'rgba(100,100,100,0.3)'} strokeWidth="1" />
          <line x1="85" y1="65" x2="85" y2="100" stroke={isActive ? 'rgba(255,165,0,0.4)' : 'rgba(100,100,100,0.3)'} strokeWidth="1" />

          {/* Arms */}
          <rect x="10" y="62" width="15" height="35" rx="5"
            fill={isActive ? '#1a1a3a' : '#0d0d2a'}
            stroke={isActive ? '#ff8c00' : '#444'}
            strokeWidth="1.5"
          >
            {isActive && <animate attributeName="y" values="62;60;62" dur="2s" repeatCount="indefinite" />}
          </rect>
          <rect x="95" y="62" width="15" height="35" rx="5"
            fill={isActive ? '#1a1a3a' : '#0d0d2a'}
            stroke={isActive ? '#ff8c00' : '#444'}
            strokeWidth="1.5"
          >
            {isActive && <animate attributeName="y" values="62;64;62" dur="2s" repeatCount="indefinite" />}
          </rect>

          {/* Legs */}
          <rect x="35" y="108" width="18" height="25" rx="5"
            fill={isActive ? '#1a1a3a' : '#0d0d2a'}
            stroke={isActive ? '#ff8c00' : '#444'}
            strokeWidth="1.5"
          />
          <rect x="67" y="108" width="18" height="25" rx="5"
            fill={isActive ? '#1a1a3a' : '#0d0d2a'}
            stroke={isActive ? '#ff8c00' : '#444'}
            strokeWidth="1.5"
          />

          {/* Status Indicator */}
          <circle cx="60" cy="115" r="3" fill={isActive ? '#00ff00' : '#666'}>
            {isActive && <animate attributeName="fill" values="#00ff00;#00cc00;#00ff00" dur="1s" repeatCount="indefinite" />}
          </circle>
        </svg>
      </div>

      {/* Status Label */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${isActive ? 'bg-orange-600/30 text-orange-400' : 'bg-gray-800/50 text-gray-500'}`}>
          {isActive ? '⚡ ACTIVE' : '○ IDLE'}
        </span>
      </div>
    </div>
  );
}
