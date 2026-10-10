import { useEffect, useState, useMemo } from 'react';

interface RobotAnimationProps {
  isActive: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface RoutingNode {
  id: string;
  x: number;
  y: number;
  label: string;
  color: string;
}

interface RoutingLink {
  from: string;
  to: string;
  active: boolean;
}

export default function RobotAnimation({ isActive, size = 'lg' }: RobotAnimationProps) {
  const [pulsePhase, setPulsePhase] = useState(0);
  const [activeRoute, setActiveRoute] = useState(0);
  const [eyeBlink, setEyeBlink] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setPulsePhase(p => (p + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setActiveRoute(r => (r + 1) % 6);
    }, 800);
    return () => clearInterval(interval);
  }, [isActive]);

  // Eye blink animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 180);
    }, 3500 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  const routingNodes: RoutingNode[] = useMemo(() => [
    { id: 'core', x: 150, y: 150, label: 'CORE', color: '#cc88ff' },
    { id: 'mt5', x: 50, y: 60, label: 'MT5', color: '#ff88cc' },
    { id: 'api', x: 250, y: 60, label: 'API', color: '#ffaa88' },
    { id: 'ai1', x: 50, y: 240, label: 'GPT-4o', color: '#aa66ff' },
    { id: 'ai2', x: 250, y: 240, label: 'LSTM', color: '#ff66aa' },
    { id: 'data', x: 150, y: 30, label: 'DATA', color: '#88ddff' },
    { id: 'trade', x: 150, y: 270, label: 'EXEC', color: '#ffcc88' },
  ], []);

  const routingLinks: RoutingLink[] = useMemo(() => [
    { from: 'core', to: 'mt5', active: true },
    { from: 'core', to: 'api', active: true },
    { from: 'core', to: 'ai1', active: true },
    { from: 'core', to: 'ai2', active: true },
    { from: 'data', to: 'core', active: true },
    { from: 'core', to: 'trade', active: true },
  ], []);

  const sizeClasses = {
    sm: 'w-40 h-40',
    md: 'w-56 h-56',
    lg: 'w-72 h-72',
  };

  const particles = useMemo(() => 
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 130,
      delay: Math.random() * 2,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 1 + 0.8,
      hue: Math.random() > 0.5 ? '#cc88ff' : '#ff88cc',
    })), []
  );

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      {isActive && (
        <>
          {/* Outer Energy Field - Purple/Pink */}
          <div className="absolute inset-[-40px] rounded-full animate-aura-pulse"
            style={{
              background: `conic-gradient(from ${pulsePhase}deg, 
                rgba(200,130,255,0.18), rgba(255,130,200,0.08), 
                rgba(180,100,255,0.2), rgba(255,150,220,0.08), 
                rgba(200,130,255,0.18))`,
              filter: 'blur(15px)',
            }}
          />

          {/* Rotating Energy Rings - Purple */}
          <div className="absolute inset-[-30px] rounded-full animate-aura-rotate"
            style={{
              border: '2px solid transparent',
              borderTopColor: 'rgba(200,130,255,0.7)',
              borderRightColor: 'rgba(255,130,200,0.4)',
              borderBottomColor: 'rgba(180,100,255,0.5)',
            }}
          />
          <div className="absolute inset-[-45px] rounded-full animate-aura-rotate"
            style={{
              border: '1px solid transparent',
              borderTopColor: 'rgba(255,180,230,0.4)',
              borderLeftColor: 'rgba(200,130,255,0.3)',
              animationDirection: 'reverse',
              animationDuration: '5s',
            }}
          />
          <div className="absolute inset-[-55px] rounded-full animate-aura-rotate"
            style={{
              border: '1px dashed rgba(200,130,255,0.2)',
              animationDuration: '8s',
            }}
          />

          {/* Hex Grid Overlay */}
          <div className="absolute inset-[-35px] rounded-full overflow-hidden opacity-25 animate-hex-rotate">
            <div className="w-full h-full hex-pattern" />
          </div>

          {/* Purple/Pink Particles */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full animate-particle-rise"
              style={{
                left: `calc(50% + ${p.x}px)`,
                bottom: '30%',
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: `radial-gradient(circle, ${p.hue}, #8844cc)`,
                boxShadow: `0 0 4px ${p.hue}, 0 0 8px #8844cc`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                '--px': `${p.x * 0.5}px`,
              } as React.CSSProperties}
            />
          ))}

          {/* Purple Lightning Bolts */}
          <div className="absolute inset-0 animate-lightning pointer-events-none">
            <svg viewBox="0 0 300 300" className="w-full h-full">
              <defs>
                <filter id="purpleGlow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <path d="M150 30 L140 100 L160 90 L135 180 L155 165 L130 250"
                fill="none" stroke="rgba(200,130,255,0.8)" strokeWidth="2"
                filter="url(#purpleGlow)" />
              <path d="M80 80 L120 130 L100 125 L140 200"
                fill="none" stroke="rgba(255,150,220,0.6)" strokeWidth="1.5"
                filter="url(#purpleGlow)" />
              <path d="M220 80 L180 130 L200 125 L160 200"
                fill="none" stroke="rgba(180,120,255,0.6)" strokeWidth="1.5"
                filter="url(#purpleGlow)" />
              <path d="M100 50 L90 90 L105 85 L85 140"
                fill="none" stroke="rgba(255,180,230,0.5)" strokeWidth="1" />
              <path d="M200 50 L210 90 L195 85 L215 140"
                fill="none" stroke="rgba(200,150,255,0.5)" strokeWidth="1" />
            </svg>
          </div>

          {/* Inner Plasma Field - Purple/Pink */}
          <div className="absolute inset-[-8px] rounded-full animate-fire-flicker"
            style={{
              background: `conic-gradient(from ${pulsePhase * 2}deg, 
                rgba(200,130,255,0.35), rgba(255,150,220,0.15), 
                rgba(180,100,255,0.25), rgba(255,180,230,0.35))`,
              filter: 'blur(10px)',
            }}
          />
        </>
      )}

      {/* Feminine Cute Robot SVG */}
      <div className={`relative z-10 ${isActive ? 'animate-shake' : 'animate-float'}`}>
        <svg viewBox="0 0 200 260" className="w-full h-full" style={{ filter: isActive ? 'drop-shadow(0 0 20px rgba(200,130,255,0.5))' : 'drop-shadow(0 0 8px rgba(200,150,255,0.3))' }}>
          <defs>
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#fff0f8" />
              <stop offset="100%" stopColor="#f0e0ff" />
            </linearGradient>
            <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff88cc" />
              <stop offset="100%" stopColor="#cc88ff" />
            </linearGradient>
            <radialGradient id="eyeGlow">
              <stop offset="0%" stopColor="#ff88dd" />
              <stop offset="60%" stopColor="#cc66ff" />
              <stop offset="100%" stopColor="#8833cc" />
            </radialGradient>
            <radialGradient id="cheekGlow">
              <stop offset="0%" stopColor="rgba(255,130,180,0.7)" />
              <stop offset="100%" stopColor="rgba(255,130,180,0)" />
            </radialGradient>
            <linearGradient id="bowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff66aa" />
              <stop offset="100%" stopColor="#cc44ff" />
            </linearGradient>
            <linearGradient id="skirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff0f8" />
              <stop offset="100%" stopColor="#f0d0ff" />
            </linearGradient>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="strongGlow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* === HEAD (Round, Elegant) === */}
          {/* Head shadow */}
          <ellipse cx="100" cy="100" rx="52" ry="7" fill="rgba(100,50,150,0.08)" />
          
          {/* Main head - elegant round shape */}
          <ellipse cx="100" cy="58" rx="50" ry="46" fill="url(#bodyGrad)" stroke="rgba(200,130,255,0.4)" strokeWidth="1.8" />
          
          {/* Head highlight - glossy */}
          <ellipse cx="82" cy="38" rx="18" ry="14" fill="rgba(255,255,255,0.7)" />
          <ellipse cx="115" cy="32" rx="8" ry="6" fill="rgba(255,255,255,0.4)" />
          
          {/* === BOW / RIBBON on head === */}
          <g transform="translate(100, 14)">
            {/* Bow left */}
            <path d="M -2 0 Q -14 -6 -12 2 Q -10 8 -2 4 Z" fill="url(#bowGrad)" stroke="rgba(200,50,150,0.3)" strokeWidth="0.5" />
            {/* Bow right */}
            <path d="M 2 0 Q 14 -6 12 2 Q 10 8 2 4 Z" fill="url(#bowGrad)" stroke="rgba(200,50,150,0.3)" strokeWidth="0.5" />
            {/* Bow center */}
            <circle cx="0" cy="2" r="3" fill="#ff44aa" stroke="rgba(200,50,150,0.4)" strokeWidth="0.5" />
            {/* Bow tails */}
            <path d="M -1 4 Q -4 10 -6 14" fill="none" stroke="url(#bowGrad)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 1 4 Q 4 10 6 14" fill="none" stroke="url(#bowGrad)" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Antenna with heart */}
          <line x1="100" y1="14" x2="100" y2="6" stroke="rgba(200,130,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 100 6 Q 97 3 98 1 Q 100 -1 100 2 Q 100 -1 102 1 Q 103 3 100 6 Z" 
            fill={isActive ? '#ff66aa' : '#ffaacc'} filter={isActive ? 'url(#strongGlow)' : ''}>
            {isActive && <animate attributeName="fill" values="#ff66aa;#cc66ff;#ff66aa" dur="1.5s" repeatCount="indefinite" />}
          </path>

          {/* === EYES (Big, Feminine, with Eyelashes) === */}
          {/* Left eye */}
          <g>
            {/* Eye white */}
            <ellipse cx="80" cy="58" rx="14" ry={eyeBlink ? 2 : 17} fill="white" stroke="rgba(200,130,255,0.2)" strokeWidth="0.8" />
            {!eyeBlink && (
              <>
                {/* Iris */}
                <ellipse cx="80" cy="58" rx="10" ry="12" fill="url(#eyeGlow)" filter="url(#softGlow)">
                  {isActive && <animate attributeName="rx" values="10;9;10" dur="3s" repeatCount="indefinite" />}
                </ellipse>
                {/* Pupil */}
                <ellipse cx="80" cy="58" rx="5" ry="6" fill="#1a0033" />
                {/* Star highlight */}
                <ellipse cx="77" cy="53" rx="3" ry="3.5" fill="white" opacity="0.95" />
                <ellipse cx="83" cy="62" rx="1.5" ry="2" fill="white" opacity="0.6" />
                {/* Eyelashes - left eye */}
                <path d="M 68 48 Q 66 44 64 42" fill="none" stroke="#6633aa" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M 72 45 Q 70 41 69 38" fill="none" stroke="#6633aa" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M 77 43 Q 76 39 76 36" fill="none" stroke="#6633aa" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M 83 43 Q 84 39 85 37" fill="none" stroke="#6633aa" strokeWidth="1" strokeLinecap="round" />
                {/* Upper eyelid line */}
                <path d="M 67 50 Q 80 44 93 50" fill="none" stroke="rgba(100,50,170,0.4)" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
          </g>

          {/* Right eye */}
          <g>
            {/* Eye white */}
            <ellipse cx="120" cy="58" rx="14" ry={eyeBlink ? 2 : 17} fill="white" stroke="rgba(200,130,255,0.2)" strokeWidth="0.8" />
            {!eyeBlink && (
              <>
                {/* Iris */}
                <ellipse cx="120" cy="58" rx="10" ry="12" fill="url(#eyeGlow)" filter="url(#softGlow)">
                  {isActive && <animate attributeName="rx" values="10;9;10" dur="3s" repeatCount="indefinite" />}
                </ellipse>
                {/* Pupil */}
                <ellipse cx="120" cy="58" rx="5" ry="6" fill="#1a0033" />
                {/* Star highlight */}
                <ellipse cx="117" cy="53" rx="3" ry="3.5" fill="white" opacity="0.95" />
                <ellipse cx="123" cy="62" rx="1.5" ry="2" fill="white" opacity="0.6" />
                {/* Eyelashes - right eye */}
                <path d="M 132 48 Q 134 44 136 42" fill="none" stroke="#6633aa" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M 128 45 Q 130 41 131 38" fill="none" stroke="#6633aa" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M 123 43 Q 124 39 124 36" fill="none" stroke="#6633aa" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M 117 43 Q 116 39 115 37" fill="none" stroke="#6633aa" strokeWidth="1" strokeLinecap="round" />
                {/* Upper eyelid line */}
                <path d="M 107 50 Q 120 44 133 50" fill="none" stroke="rgba(100,50,170,0.4)" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
          </g>

          {/* Cute blush cheeks - bigger and more visible */}
          <ellipse cx="65" cy="70" rx="9" ry="6" fill="url(#cheekGlow)" />
          <ellipse cx="135" cy="70" rx="9" ry="6" fill="url(#cheekGlow)" />

          {/* === MOUTH (Cute small smile with lips) === */}
          <path d="M 92 78 Q 100 83 108 78" fill="none" stroke={isActive ? '#ff66aa' : '#ffaacc'} strokeWidth="2" strokeLinecap="round">
            {isActive && <animate attributeName="d" values="M 92 78 Q 100 83 108 78;M 92 77 Q 100 81 108 77;M 92 78 Q 100 83 108 78" dur="2s" repeatCount="indefinite" />}
          </path>
          {/* Small lip highlight */}
          <ellipse cx="100" cy="80" rx="3" ry="1" fill="rgba(255,150,200,0.4)" />

          {/* === NECK (Slender) === */}
          <rect x="94" y="98" width="12" height="8" rx="4" fill="url(#bodyGrad)" stroke="rgba(200,130,255,0.2)" strokeWidth="0.5" />
          {/* Necklace detail */}
          <ellipse cx="100" cy="102" rx="4" ry="2" fill="none" stroke="rgba(255,130,200,0.5)" strokeWidth="0.8" />
          <circle cx="100" cy="104" r="1.5" fill="#ff88cc" />

          {/* === BODY (Elegant, Feminine) === */}
          {/* Main body - elegant shape */}
          <path d="M 70 108 Q 65 130 68 155 Q 72 170 100 172 Q 128 170 132 155 Q 135 130 130 108 Q 115 104 100 104 Q 85 104 70 108 Z" 
            fill="url(#bodyGrad)" stroke="rgba(200,130,255,0.4)" strokeWidth="1.8" />
          
          {/* Body highlight */}
          <ellipse cx="85" cy="125" rx="12" ry="18" fill="rgba(255,255,255,0.5)" />
          
          {/* Chest accent line */}
          <path d="M 78 115 Q 100 120 122 115" fill="none" stroke="rgba(200,130,255,0.3)" strokeWidth="0.8" />
          
          {/* Belly core - heart-shaped glow */}
          <circle cx="100" cy="140" r="11" fill={isActive ? 'rgba(200,130,255,0.3)' : 'rgba(200,130,255,0.1)'} stroke={isActive ? '#cc88ff' : '#ddbbff'} strokeWidth="1.5" />
          <path d="M 100 143 Q 96 138 97 135 Q 99 132 100 134 Q 101 132 103 135 Q 104 138 100 143 Z" 
            fill={isActive ? '#cc88ff' : '#ddbbff'} filter={isActive ? 'url(#strongGlow)' : ''}>
            {isActive && <animate attributeName="fill" values="#cc88ff;#ff88cc;#cc88ff" dur="1.2s" repeatCount="indefinite" />}
          </path>
          <circle cx="100" cy="138" r="2" fill="white" opacity={isActive ? 0.9 : 0.5}>
            {isActive && <animate attributeName="opacity" values="0.9;0.5;0.9" dur="1s" repeatCount="indefinite" />}
          </circle>

          {/* Waist accent - ribbon/belt */}
          <path d="M 72 158 Q 100 162 128 158" fill="none" stroke="url(#accentGrad)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="100" cy="160" r="2.5" fill="#ff66aa" />

          {/* === SKIRT (Cute mini skirt) === */}
          <path d="M 68 165 Q 60 180 55 190 Q 75 195 100 195 Q 125 195 145 190 Q 140 180 132 165 Q 115 168 100 168 Q 85 168 68 165 Z" 
            fill="url(#skirtGrad)" stroke="rgba(200,130,255,0.4)" strokeWidth="1.2" />
          {/* Skirt pleats */}
          <path d="M 75 168 Q 72 180 70 190" fill="none" stroke="rgba(200,130,255,0.2)" strokeWidth="0.5" />
          <path d="M 88 168 Q 86 180 85 192" fill="none" stroke="rgba(200,130,255,0.2)" strokeWidth="0.5" />
          <path d="M 100 168 Q 100 180 100 194" fill="none" stroke="rgba(200,130,255,0.2)" strokeWidth="0.5" />
          <path d="M 112 168 Q 114 180 115 192" fill="none" stroke="rgba(200,130,255,0.2)" strokeWidth="0.5" />
          <path d="M 125 168 Q 128 180 130 190" fill="none" stroke="rgba(200,130,255,0.2)" strokeWidth="0.5" />
          {/* Skirt lace trim */}
          <path d="M 55 190 Q 60 192 65 190 Q 70 192 75 190 Q 80 192 85 190 Q 90 192 95 190 Q 100 192 105 190 Q 110 192 115 190 Q 120 192 125 190 Q 130 192 135 190 Q 140 192 145 190" 
            fill="none" stroke="rgba(200,130,255,0.4)" strokeWidth="0.8" />

          {/* === ARMS (Slender, Elegant) === */}
          {/* Left arm */}
          <path d="M 68 112 Q 58 115 52 125 Q 48 135 50 145 Q 52 150 56 152" 
            fill="none" stroke="url(#bodyGrad)" strokeWidth="10" strokeLinecap="round" />
          <path d="M 68 112 Q 58 115 52 125 Q 48 135 50 145 Q 52 150 56 152" 
            fill="none" stroke="rgba(200,130,255,0.3)" strokeWidth="10" strokeLinecap="round" opacity="0.3" />
          {/* Left hand - cute round */}
          <circle cx="56" cy="153" r="7" fill="url(#bodyGrad)" stroke="rgba(200,130,255,0.3)" strokeWidth="1" />
          {/* Bracelet */}
          <ellipse cx="54" cy="147" rx="5" ry="2" fill="none" stroke="url(#accentGrad)" strokeWidth="1.2" />
          {isActive && <animateTransform attributeName="transform" type="rotate" values="0 68 112;-3 68 112;0 68 112" dur="2s" repeatCount="indefinite" xlinkHref="#leftArm" />}

          {/* Right arm */}
          <path d="M 132 112 Q 142 115 148 125 Q 152 135 150 145 Q 148 150 144 152" 
            fill="none" stroke="url(#bodyGrad)" strokeWidth="10" strokeLinecap="round" />
          <path d="M 132 112 Q 142 115 148 125 Q 152 135 150 145 Q 148 150 144 152" 
            fill="none" stroke="rgba(200,130,255,0.3)" strokeWidth="10" strokeLinecap="round" opacity="0.3" />
          {/* Right hand */}
          <circle cx="144" cy="153" r="7" fill="url(#bodyGrad)" stroke="rgba(200,130,255,0.3)" strokeWidth="1" />
          {/* Bracelet */}
          <ellipse cx="146" cy="147" rx="5" ry="2" fill="none" stroke="url(#accentGrad)" strokeWidth="1.2" />

          {/* === LEGS (Slender, Elegant with boots) === */}
          {/* Left leg */}
          <path d="M 85 190 Q 83 205 82 215 Q 82 220 84 222" 
            fill="none" stroke="url(#bodyGrad)" strokeWidth="9" strokeLinecap="round" />
          <path d="M 85 190 Q 83 205 82 215 Q 82 220 84 222" 
            fill="none" stroke="rgba(200,130,255,0.2)" strokeWidth="9" strokeLinecap="round" opacity="0.3" />
          {/* Left boot */}
          <path d="M 78 218 Q 76 222 78 225 Q 82 228 88 226 Q 90 224 88 220 Q 86 218 82 218 Z" 
            fill="url(#accentGrad)" stroke="rgba(200,50,150,0.3)" strokeWidth="0.8" />
          {/* Boot detail */}
          <path d="M 79 222 Q 83 224 87 222" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />

          {/* Right leg */}
          <path d="M 115 190 Q 117 205 118 215 Q 118 220 116 222" 
            fill="none" stroke="url(#bodyGrad)" strokeWidth="9" strokeLinecap="round" />
          <path d="M 115 190 Q 117 205 118 215 Q 118 220 116 222" 
            fill="none" stroke="rgba(200,130,255,0.2)" strokeWidth="9" strokeLinecap="round" opacity="0.3" />
          {/* Right boot */}
          <path d="M 112 218 Q 110 222 112 225 Q 116 228 122 226 Q 124 224 122 220 Q 120 218 116 218 Z" 
            fill="url(#accentGrad)" stroke="rgba(200,50,150,0.3)" strokeWidth="0.8" />
          {/* Boot detail */}
          <path d="M 113 222 Q 117 224 121 222" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />

          {/* === DECORATIVE DETAILS === */}
          {/* Small heart accessories */}
          <path d="M 72 120 Q 70 118 71 116 Q 72 115 73 116 Q 74 115 75 116 Q 76 118 73 120 Z" 
            fill="#ff88cc" opacity="0.6" />
          <path d="M 127 120 Q 125 118 126 116 Q 127 115 128 116 Q 129 115 130 116 Q 131 118 128 120 Z" 
            fill="#cc88ff" opacity="0.6" />

          {/* Status LEDs - purple theme */}
          <circle cx="92" cy="115" r="1.8" fill={isActive ? '#ff88cc' : '#ddbbff'}>
            {isActive && <animate attributeName="fill" values="#ff88cc;#cc66ff;#ff88cc" dur="1s" repeatCount="indefinite" />}
          </circle>
          <circle cx="100" cy="113" r="1.8" fill={isActive ? '#cc88ff' : '#ddbbff'}>
            {isActive && <animate attributeName="fill" values="#cc88ff;#ff88cc;#cc88ff" dur="1.3s" repeatCount="indefinite" />}
          </circle>
          <circle cx="108" cy="115" r="1.8" fill={isActive ? '#aa66ff' : '#ddbbff'}>
            {isActive && <animate attributeName="fill" values="#aa66ff;#ff66aa;#aa66ff" dur="0.8s" repeatCount="indefinite" />}
          </circle>

          {/* Sparkle effects when active */}
          {isActive && (
            <>
              <path d="M 60 40 L 62 38 L 64 40 L 62 42 Z" fill="#ff88cc" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.5s" repeatCount="indefinite" />
              </path>
              <path d="M 140 45 L 142 43 L 144 45 L 142 47 Z" fill="#cc88ff" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.8s" repeatCount="indefinite" />
              </path>
              <path d="M 55 130 L 57 128 L 59 130 L 57 132 Z" fill="#ff88cc" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite" />
              </path>
              <path d="M 145 135 L 147 133 L 149 135 L 147 137 Z" fill="#cc88ff" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.6s" repeatCount="indefinite" />
              </path>
            </>
          )}
        </svg>
      </div>

      {/* Agentic Mode Routing Overlay */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          <svg viewBox="0 0 300 300" className="w-full h-full opacity-60">
            <defs>
              <filter id="routeGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Routing Links */}
            {routingLinks.map((link, i) => {
              const fromNode = routingNodes.find(n => n.id === link.from);
              const toNode = routingNodes.find(n => n.id === link.to);
              if (!fromNode || !toNode) return null;
              const isActiveLink = i === activeRoute;
              return (
                <g key={i}>
                  <line
                    x1={fromNode.x} y1={fromNode.y}
                    x2={toNode.x} y2={toNode.y}
                    stroke={isActiveLink ? '#cc88ff' : 'rgba(200,130,255,0.15)'}
                    strokeWidth={isActiveLink ? 2 : 0.5}
                    strokeDasharray={isActiveLink ? '4 4' : '2 6'}
                    className={isActiveLink ? 'animate-dash-flow' : ''}
                  />
                  {isActiveLink && (
                    <circle r="3" fill="#cc88ff" filter="url(#routeGlow)">
                      <animateMotion
                        dur="0.8s"
                        repeatCount="indefinite"
                        path={`M${fromNode.x},${fromNode.y} L${toNode.x},${toNode.y}`}
                      />
                    </circle>
                  )}
                </g>
              );
            })}
            {/* Routing Nodes */}
            {routingNodes.map((node, i) => {
              const isNodeActive = i === activeRoute || i === 0;
              return (
                <g key={node.id}>
                  {isNodeActive && (
                    <circle cx={node.x} cy={node.y} r="8" fill="none" stroke={node.color} strokeWidth="1" opacity="0.5">
                      <animate attributeName="r" values="8;16;8" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={node.x} cy={node.y} r={isNodeActive ? 5 : 3}
                    fill={isNodeActive ? node.color : 'rgba(200,130,255,0.3)'}
                    filter={isNodeActive ? 'url(#routeGlow)' : ''}
                  />
                  <text x={node.x} y={node.y - 10} textAnchor="middle"
                    fill={isNodeActive ? node.color : 'rgba(200,130,255,0.4)'}
                    fontSize="7" fontFamily="monospace" fontWeight="bold">
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Status Badge */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider ${
          isActive 
            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-glow-pulse' 
            : 'bg-gray-800/50 text-gray-500 border border-gray-700/30'
        }`}>
          {isActive ? '⚡ AGENTIC MODE' : '○ STANDBY'}
        </span>
      </div>
    </div>
  );
}
