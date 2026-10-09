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

  const routingNodes: RoutingNode[] = useMemo(() => [
    { id: 'core', x: 150, y: 150, label: 'CORE', color: '#00d4ff' },
    { id: 'mt5', x: 50, y: 60, label: 'MT5', color: '#00ff88' },
    { id: 'api', x: 250, y: 60, label: 'API', color: '#ff8800' },
    { id: 'ai1', x: 50, y: 240, label: 'GPT-4o', color: '#aa66ff' },
    { id: 'ai2', x: 250, y: 240, label: 'LSTM', color: '#ff4488' },
    { id: 'data', x: 150, y: 30, label: 'DATA', color: '#44ffcc' },
    { id: 'trade', x: 150, y: 270, label: 'EXEC', color: '#ffcc00' },
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
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 120,
      delay: Math.random() * 2,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 1 + 0.8,
    })), []
  );

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      {isActive && (
        <>
          {/* Outer Energy Field */}
          <div className="absolute inset-[-40px] rounded-full animate-aura-pulse"
            style={{
              background: `conic-gradient(from ${pulsePhase}deg, 
                rgba(0,200,255,0.15), rgba(0,100,255,0.05), 
                rgba(0,200,255,0.2), rgba(100,0,255,0.05), 
                rgba(0,200,255,0.15))`,
              filter: 'blur(15px)',
            }}
          />

          {/* Rotating Energy Rings */}
          <div className="absolute inset-[-30px] rounded-full animate-aura-rotate"
            style={{
              border: '2px solid transparent',
              borderTopColor: 'rgba(0,200,255,0.6)',
              borderRightColor: 'rgba(0,150,255,0.3)',
              borderBottomColor: 'rgba(100,0,255,0.4)',
            }}
          />
          <div className="absolute inset-[-45px] rounded-full animate-aura-rotate"
            style={{
              border: '1px solid transparent',
              borderTopColor: 'rgba(0,255,200,0.3)',
              borderLeftColor: 'rgba(0,200,255,0.2)',
              animationDirection: 'reverse',
              animationDuration: '5s',
            }}
          />
          <div className="absolute inset-[-55px] rounded-full animate-aura-rotate"
            style={{
              border: '1px dashed rgba(0,200,255,0.15)',
              animationDuration: '8s',
            }}
          />

          {/* Hex Grid Overlay */}
          <div className="absolute inset-[-35px] rounded-full overflow-hidden opacity-30 animate-hex-rotate">
            <div className="w-full h-full hex-pattern" />
          </div>

          {/* Fire/Energy Particles */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full animate-particle-rise"
              style={{
                left: `calc(50% + ${p.x}px)`,
                bottom: '30%',
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: `radial-gradient(circle, #00d4ff, #0066ff)`,
                boxShadow: '0 0 4px #00d4ff, 0 0 8px #0066ff',
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                '--px': `${p.x * 0.5}px`,
              } as React.CSSProperties}
            />
          ))}

          {/* Lightning Bolts */}
          <div className="absolute inset-0 animate-lightning pointer-events-none">
            <svg viewBox="0 0 300 300" className="w-full h-full">
              <path d="M150 30 L140 100 L160 90 L135 180 L155 165 L130 250"
                fill="none" stroke="rgba(0,200,255,0.7)" strokeWidth="1.5"
                filter="url(#glow)" />
              <path d="M80 80 L120 130 L100 125 L140 200"
                fill="none" stroke="rgba(100,0,255,0.5)" strokeWidth="1" />
              <path d="M220 80 L180 130 L200 125 L160 200"
                fill="none" stroke="rgba(0,255,200,0.5)" strokeWidth="1" />
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
            </svg>
          </div>

          {/* Inner Plasma Field */}
          <div className="absolute inset-[-8px] rounded-full animate-fire-flicker"
            style={{
              background: `conic-gradient(from ${pulsePhase * 2}deg, 
                rgba(0,200,255,0.3), rgba(0,100,255,0.1), 
                rgba(100,0,255,0.2), rgba(0,200,255,0.3))`,
              filter: 'blur(10px)',
            }}
          />
        </>
      )}

      {/* 3D Robot SVG */}
      <div className={`relative z-10 ${isActive ? 'animate-shake' : 'animate-float'}`}>
        <svg viewBox="0 0 200 240" className="w-full h-full" style={{ filter: isActive ? 'drop-shadow(0 0 15px rgba(0,200,255,0.4))' : 'drop-shadow(0 0 5px rgba(0,100,200,0.2))' }}>
          <defs>
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isActive ? '#1a2a4a' : '#0d1525'} />
              <stop offset="50%" stopColor={isActive ? '#0f1f3a' : '#080d1a'} />
              <stop offset="100%" stopColor={isActive ? '#1a2a4a' : '#0d1525'} />
            </linearGradient>
            <linearGradient id="metalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2a3a5a" />
              <stop offset="50%" stopColor="#1a2540" />
              <stop offset="100%" stopColor="#0f1a30" />
            </linearGradient>
            <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#0066ff" />
            </linearGradient>
            <radialGradient id="eyeGlow">
              <stop offset="0%" stopColor="#00ffff" />
              <stop offset="50%" stopColor="#0088ff" />
              <stop offset="100%" stopColor="#0044aa" />
            </radialGradient>
            <filter id="neonGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="strongGlow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* === HEAD === */}
          {/* Head base - 3D effect */}
          <path d="M65 25 L135 25 L140 30 L140 70 L135 75 L65 75 L60 70 L60 30 Z"
            fill="url(#bodyGrad)" stroke={isActive ? '#00d4ff' : '#1a3050'} strokeWidth="1.5" />
          {/* Head top highlight */}
          <path d="M65 25 L135 25 L140 30 L60 30 Z"
            fill="rgba(0,200,255,0.08)" />
          {/* Head side panels */}
          <rect x="62" y="35" width="4" height="30" rx="2" fill={isActive ? 'rgba(0,200,255,0.3)' : 'rgba(30,60,100,0.3)'} />
          <rect x="134" y="35" width="4" height="30" rx="2" fill={isActive ? 'rgba(0,200,255,0.3)' : 'rgba(30,60,100,0.3)'} />
          
          {/* Antenna */}
          <line x1="100" y1="25" x2="100" y2="10" stroke={isActive ? '#00d4ff' : '#1a3050'} strokeWidth="2" />
          <circle cx="100" cy="8" r="4" fill={isActive ? '#00d4ff' : '#1a3050'} filter={isActive ? 'url(#neonGlow)' : ''}>
            {isActive && <animate attributeName="r" values="4;6;4" dur="1s" repeatCount="indefinite" />}
            {isActive && <animate attributeName="fill" values="#00d4ff;#00ffcc;#00d4ff" dur="1.5s" repeatCount="indefinite" />}
          </circle>

          {/* Visor / Eyes */}
          <rect x="70" y="38" width="60" height="18" rx="9" fill="rgba(0,0,0,0.6)" stroke={isActive ? '#00d4ff' : '#1a3050'} strokeWidth="1" />
          {/* Left Eye */}
          <ellipse cx="85" cy="47" rx="8" ry="6" fill={isActive ? 'url(#eyeGlow)' : '#0a1520'} filter={isActive ? 'url(#neonGlow)' : ''}>
            {isActive && <animate attributeName="rx" values="8;7;8" dur="3s" repeatCount="indefinite" />}
          </ellipse>
          {/* Right Eye */}
          <ellipse cx="115" cy="47" rx="8" ry="6" fill={isActive ? 'url(#eyeGlow)' : '#0a1520'} filter={isActive ? 'url(#neonGlow)' : ''}>
            {isActive && <animate attributeName="rx" values="8;7;8" dur="3s" repeatCount="indefinite" />}
          </ellipse>
          {/* Eye inner glow */}
          {isActive && (
            <>
              <ellipse cx="85" cy="47" rx="4" ry="3" fill="#ffffff" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="115" cy="47" rx="4" ry="3" fill="#ffffff" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
              </ellipse>
            </>
          )}

          {/* Mouth / Speaker grill */}
          <rect x="82" y="62" width="36" height="6" rx="3" fill="rgba(0,0,0,0.5)" stroke={isActive ? 'rgba(0,200,255,0.4)' : '#1a3050'} strokeWidth="0.5" />
          {[0,1,2,3,4,5].map(i => (
            <rect key={i} x={86 + i * 5} y="63" width="2" height="4" rx="1"
              fill={isActive ? '#00d4ff' : '#1a3050'} opacity={isActive ? 0.6 + Math.sin(i) * 0.3 : 0.3}>
              {isActive && <animate attributeName="opacity" values="0.3;0.9;0.3" dur={`${0.5 + i * 0.1}s`} repeatCount="indefinite" />}
            </rect>
          ))}

          {/* === NECK === */}
          <rect x="88" y="75" width="24" height="10" fill="url(#metalGrad)" stroke={isActive ? 'rgba(0,200,255,0.3)' : '#1a3050'} strokeWidth="0.5" />
          <line x1="92" y1="78" x2="92" y2="83" stroke={isActive ? '#00d4ff' : '#1a3050'} strokeWidth="0.5" opacity="0.5" />
          <line x1="100" y1="78" x2="100" y2="83" stroke={isActive ? '#00d4ff' : '#1a3050'} strokeWidth="0.5" opacity="0.5" />
          <line x1="108" y1="78" x2="108" y2="83" stroke={isActive ? '#00d4ff' : '#1a3050'} strokeWidth="0.5" opacity="0.5" />

          {/* === BODY === */}
          <path d="M55 85 L145 85 L150 90 L150 155 L145 160 L55 160 L50 155 L50 90 Z"
            fill="url(#bodyGrad)" stroke={isActive ? '#00d4ff' : '#1a3050'} strokeWidth="1.5" />
          {/* Body top highlight */}
          <path d="M55 85 L145 85 L150 90 L50 90 Z" fill="rgba(0,200,255,0.06)" />
          {/* Body panel lines */}
          <line x1="60" y1="95" x2="60" y2="150" stroke={isActive ? 'rgba(0,200,255,0.2)' : 'rgba(30,60,100,0.2)'} strokeWidth="0.5" />
          <line x1="140" y1="95" x2="140" y2="150" stroke={isActive ? 'rgba(0,200,255,0.2)' : 'rgba(30,60,100,0.2)'} strokeWidth="0.5" />
          <line x1="70" y1="130" x2="130" y2="130" stroke={isActive ? 'rgba(0,200,255,0.15)' : 'rgba(30,60,100,0.15)'} strokeWidth="0.5" />

          {/* Chest Core - Reactor */}
          <circle cx="100" cy="115" r="18" fill="rgba(0,0,0,0.5)" stroke={isActive ? '#00d4ff' : '#1a3050'} strokeWidth="1.5" />
          <circle cx="100" cy="115" r="14" fill="none" stroke={isActive ? 'rgba(0,200,255,0.3)' : 'rgba(30,60,100,0.2)'} strokeWidth="0.5" strokeDasharray="3 3">
            {isActive && <animateTransform attributeName="transform" type="rotate" from="0 100 115" to="360 100 115" dur="4s" repeatCount="indefinite" />}
          </circle>
          <circle cx="100" cy="115" r="10" fill={isActive ? 'url(#coreGrad)' : '#0a1520'} filter={isActive ? 'url(#strongGlow)' : ''}>
            {isActive && <animate attributeName="r" values="10;12;10" dur="1.5s" repeatCount="indefinite" />}
          </circle>
          <circle cx="100" cy="115" r="5" fill="#ffffff" opacity={isActive ? 0.9 : 0.2}>
            {isActive && <animate attributeName="opacity" values="0.9;0.5;0.9" dur="1s" repeatCount="indefinite" />}
          </circle>
          {/* Core energy arcs */}
          {isActive && (
            <>
              <circle cx="100" cy="115" r="22" fill="none" stroke="rgba(0,200,255,0.2)" strokeWidth="0.5">
                <animate attributeName="r" values="18;28;18" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
              </circle>
            </>
          )}

          {/* Status LEDs on body */}
          <circle cx="70" cy="100" r="2" fill={isActive ? '#00ff88' : '#1a3050'}>
            {isActive && <animate attributeName="fill" values="#00ff88;#00cc66;#00ff88" dur="1s" repeatCount="indefinite" />}
          </circle>
          <circle cx="78" cy="100" r="2" fill={isActive ? '#ffaa00' : '#1a3050'}>
            {isActive && <animate attributeName="fill" values="#ffaa00;#ff8800;#ffaa00" dur="1.3s" repeatCount="indefinite" />}
          </circle>
          <circle cx="86" cy="100" r="2" fill={isActive ? '#00d4ff' : '#1a3050'}>
            {isActive && <animate attributeName="fill" values="#00d4ff;#0088ff;#00d4ff" dur="0.8s" repeatCount="indefinite" />}
          </circle>

          {/* === ARMS === */}
          {/* Left Arm */}
          <path d="M35 90 L50 88 L50 130 L45 135 L35 135 L30 130 Z"
            fill="url(#metalGrad)" stroke={isActive ? 'rgba(0,200,255,0.4)' : '#1a3050'} strokeWidth="1">
            {isActive && <animate attributeName="d" values="M35 90 L50 88 L50 130 L45 135 L35 135 L30 130 Z;M33 88 L48 86 L50 128 L45 133 L33 133 L28 128 Z;M35 90 L50 88 L50 130 L45 135 L35 135 L30 130 Z" dur="3s" repeatCount="indefinite" />}
          </path>
          {/* Left hand */}
          <circle cx="38" cy="140" r="6" fill="url(#metalGrad)" stroke={isActive ? 'rgba(0,200,255,0.3)' : '#1a3050'} strokeWidth="0.5" />
          <circle cx="38" cy="140" r="3" fill={isActive ? '#00d4ff' : '#0a1520'} opacity="0.5" />

          {/* Right Arm */}
          <path d="M150 88 L165 90 L170 130 L165 135 L155 135 L150 130 Z"
            fill="url(#metalGrad)" stroke={isActive ? 'rgba(0,200,255,0.4)' : '#1a3050'} strokeWidth="1">
            {isActive && <animate attributeName="d" values="M150 88 L165 90 L170 130 L165 135 L155 135 L150 130 Z;M152 86 L167 88 L172 128 L167 133 L157 133 L152 128 Z;M150 88 L165 90 L170 130 L165 135 L155 135 L150 130 Z" dur="3s" repeatCount="indefinite" />}
          </path>
          {/* Right hand */}
          <circle cx="162" cy="140" r="6" fill="url(#metalGrad)" stroke={isActive ? 'rgba(0,200,255,0.3)' : '#1a3050'} strokeWidth="0.5" />
          <circle cx="162" cy="140" r="3" fill={isActive ? '#00d4ff' : '#0a1520'} opacity="0.5" />

          {/* === LEGS === */}
          {/* Left Leg */}
          <path d="M70 160 L90 160 L92 200 L88 210 L72 210 L68 200 Z"
            fill="url(#metalGrad)" stroke={isActive ? 'rgba(0,200,255,0.3)' : '#1a3050'} strokeWidth="1" />
          {/* Left Foot */}
          <path d="M68 210 L92 210 L95 218 L92 222 L65 222 L62 218 Z"
            fill="url(#bodyGrad)" stroke={isActive ? 'rgba(0,200,255,0.3)' : '#1a3050'} strokeWidth="1" />
          <rect x="72" y="215" width="16" height="2" rx="1" fill={isActive ? 'rgba(0,200,255,0.4)' : 'rgba(30,60,100,0.3)'} />

          {/* Right Leg */}
          <path d="M110 160 L130 160 L132 200 L128 210 L112 210 L108 200 Z"
            fill="url(#metalGrad)" stroke={isActive ? 'rgba(0,200,255,0.3)' : '#1a3050'} strokeWidth="1" />
          {/* Right Foot */}
          <path d="M108 210 L132 210 L135 218 L132 222 L105 222 L102 218 Z"
            fill="url(#bodyGrad)" stroke={isActive ? 'rgba(0,200,255,0.3)' : '#1a3050'} strokeWidth="1" />
          <rect x="112" y="215" width="16" height="2" rx="1" fill={isActive ? 'rgba(0,200,255,0.4)' : 'rgba(30,60,100,0.3)'} />

          {/* Knee joints */}
          <circle cx="80" cy="185" r="4" fill={isActive ? 'rgba(0,200,255,0.2)' : 'rgba(30,60,100,0.2)'} stroke={isActive ? 'rgba(0,200,255,0.3)' : '#1a3050'} strokeWidth="0.5" />
          <circle cx="120" cy="185" r="4" fill={isActive ? 'rgba(0,200,255,0.2)' : 'rgba(30,60,100,0.2)'} stroke={isActive ? 'rgba(0,200,255,0.3)' : '#1a3050'} strokeWidth="0.5" />

          {/* Shoulder joints */}
          <circle cx="50" cy="90" r="5" fill={isActive ? 'rgba(0,200,255,0.2)' : 'rgba(30,60,100,0.2)'} stroke={isActive ? 'rgba(0,200,255,0.4)' : '#1a3050'} strokeWidth="0.5" />
          <circle cx="150" cy="90" r="5" fill={isActive ? 'rgba(0,200,255,0.2)' : 'rgba(30,60,100,0.2)'} stroke={isActive ? 'rgba(0,200,255,0.4)' : '#1a3050'} strokeWidth="0.5" />
        </svg>
      </div>

      {/* Agentic Mode Routing Overlay */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          <svg viewBox="0 0 300 300" className="w-full h-full opacity-60">
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
                    stroke={isActiveLink ? '#00ffcc' : 'rgba(0,200,255,0.15)'}
                    strokeWidth={isActiveLink ? 2 : 0.5}
                    strokeDasharray={isActiveLink ? '4 4' : '2 6'}
                    className={isActiveLink ? 'animate-dash-flow' : ''}
                  />
                  {isActiveLink && (
                    <circle r="3" fill="#00ffcc" filter="url(#glow)">
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
                    fill={isNodeActive ? node.color : 'rgba(0,200,255,0.3)'}
                    filter={isNodeActive ? 'url(#glow)' : ''}
                  />
                  <text x={node.x} y={node.y - 10} textAnchor="middle"
                    fill={isNodeActive ? node.color : 'rgba(0,200,255,0.4)'}
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
            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 animate-glow-pulse' 
            : 'bg-gray-800/50 text-gray-500 border border-gray-700/30'
        }`}>
          {isActive ? '⚡ AGENTIC MODE' : '○ STANDBY'}
        </span>
      </div>
    </div>
  );
}
