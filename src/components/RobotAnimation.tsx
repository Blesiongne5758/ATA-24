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
      setTimeout(() => setEyeBlink(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

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

      {/* Cute 3D Robot SVG */}
      <div className={`relative z-10 ${isActive ? 'animate-shake' : 'animate-float'}`}>
        <svg viewBox="0 0 200 240" className="w-full h-full" style={{ filter: isActive ? 'drop-shadow(0 0 20px rgba(0,200,255,0.5))' : 'drop-shadow(0 0 8px rgba(0,150,255,0.3))' }}>
          <defs>
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#e8f4ff" />
              <stop offset="100%" stopColor="#d0e8ff" />
            </linearGradient>
            <linearGradient id="bodyShadow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(0,150,255,0.1)" />
              <stop offset="100%" stopColor="rgba(0,100,200,0.2)" />
            </linearGradient>
            <radialGradient id="eyeGlow">
              <stop offset="0%" stopColor="#00ffff" />
              <stop offset="70%" stopColor="#0088ff" />
              <stop offset="100%" stopColor="#0044aa" />
            </radialGradient>
            <radialGradient id="cheekGlow">
              <stop offset="0%" stopColor="rgba(255,150,200,0.6)" />
              <stop offset="100%" stopColor="rgba(255,150,200,0)" />
            </radialGradient>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="strongGlow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* === HEAD (Large, Round, Cute) === */}
          {/* Head shadow */}
          <ellipse cx="100" cy="95" rx="58" ry="8" fill="rgba(0,0,0,0.1)" />
          
          {/* Main head - big and round */}
          <ellipse cx="100" cy="55" rx="55" ry="50" fill="url(#bodyGrad)" stroke="rgba(0,180,255,0.3)" strokeWidth="2" />
          
          {/* Head highlight */}
          <ellipse cx="85" cy="35" rx="20" ry="15" fill="rgba(255,255,255,0.6)" />
          
          {/* Antenna */}
          <line x1="100" y1="10" x2="100" y2="0" stroke="rgba(0,180,255,0.5)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="100" cy="0" r="4" fill={isActive ? '#00d4ff' : '#88ccff'} filter={isActive ? 'url(#strongGlow)' : ''}>
            {isActive && <animate attributeName="r" values="4;6;4" dur="1s" repeatCount="indefinite" />}
            {isActive && <animate attributeName="fill" values="#00d4ff;#00ffcc;#00d4ff" dur="1.5s" repeatCount="indefinite" />}
          </circle>

          {/* === EYES (Big, Expressive, Cute) === */}
          {/* Left eye white */}
          <ellipse cx="78" cy="55" rx="15" ry={eyeBlink ? 2 : 18} fill="white" stroke="rgba(0,150,255,0.2)" strokeWidth="1">
            {eyeBlink && <animate attributeName="ry" values="2;18" dur="0.15s" />}
          </ellipse>
          {/* Left eye iris */}
          {!eyeBlink && (
            <>
              <ellipse cx="78" cy="55" rx="10" ry="12" fill="url(#eyeGlow)" filter="url(#softGlow)">
                {isActive && <animate attributeName="rx" values="10;9;10" dur="3s" repeatCount="indefinite" />}
              </ellipse>
              {/* Left eye pupil */}
              <ellipse cx="78" cy="55" rx="5" ry="6" fill="#001133" />
              {/* Left eye highlight */}
              <ellipse cx="75" cy="50" rx="3" ry="4" fill="white" opacity="0.9" />
              <ellipse cx="81" cy="58" rx="1.5" ry="2" fill="white" opacity="0.6" />
            </>
          )}

          {/* Right eye white */}
          <ellipse cx="122" cy="55" rx="15" ry={eyeBlink ? 2 : 18} fill="white" stroke="rgba(0,150,255,0.2)" strokeWidth="1">
            {eyeBlink && <animate attributeName="ry" values="2;18" dur="0.15s" />}
          </ellipse>
          {/* Right eye iris */}
          {!eyeBlink && (
            <>
              <ellipse cx="122" cy="55" rx="10" ry="12" fill="url(#eyeGlow)" filter="url(#softGlow)">
                {isActive && <animate attributeName="rx" values="10;9;10" dur="3s" repeatCount="indefinite" />}
              </ellipse>
              {/* Right eye pupil */}
              <ellipse cx="122" cy="55" rx="5" ry="6" fill="#001133" />
              {/* Right eye highlight */}
              <ellipse cx="119" cy="50" rx="3" ry="4" fill="white" opacity="0.9" />
              <ellipse cx="125" cy="58" rx="1.5" ry="2" fill="white" opacity="0.6" />
            </>
          )}

          {/* Cute blush cheeks */}
          <ellipse cx="65" cy="65" rx="8" ry="5" fill="url(#cheekGlow)" />
          <ellipse cx="135" cy="65" rx="8" ry="5" fill="url(#cheekGlow)" />

          {/* === MOUTH (Cute smile) === */}
          <path d="M 85 75 Q 100 82 115 75" fill="none" stroke={isActive ? '#00aaff' : '#88bbdd'} strokeWidth="2.5" strokeLinecap="round">
            {isActive && <animate attributeName="d" values="M 85 75 Q 100 82 115 75;M 85 73 Q 100 80 115 73;M 85 75 Q 100 82 115 75" dur="2s" repeatCount="indefinite" />}
          </path>

          {/* === BODY (Chubby, Cute) === */}
          {/* Body shadow */}
          <ellipse cx="100" cy="195" rx="45" ry="6" fill="rgba(0,0,0,0.1)" />
          
          {/* Main body - round and chubby */}
          <ellipse cx="100" cy="145" rx="42" ry="48" fill="url(#bodyGrad)" stroke="rgba(0,180,255,0.3)" strokeWidth="2" />
          
          {/* Body highlight */}
          <ellipse cx="85" cy="125" rx="15" ry="20" fill="rgba(255,255,255,0.5)" />
          
          {/* Belly button / core */}
          <circle cx="100" cy="145" r="12" fill={isActive ? 'rgba(0,200,255,0.3)' : 'rgba(0,150,255,0.1)'} stroke={isActive ? '#00d4ff' : '#88ccff'} strokeWidth="1.5" />
          <circle cx="100" cy="145" r="7" fill={isActive ? '#00d4ff' : '#88ccff'} filter={isActive ? 'url(#strongGlow)' : ''}>
            {isActive && <animate attributeName="r" values="7;9;7" dur="1.5s" repeatCount="indefinite" />}
            {isActive && <animate attributeName="fill" values="#00d4ff;#00ffcc;#00d4ff" dur="1s" repeatCount="indefinite" />}
          </circle>
          <circle cx="100" cy="145" r="3" fill="white" opacity={isActive ? 0.9 : 0.5}>
            {isActive && <animate attributeName="opacity" values="0.9;0.5;0.9" dur="1s" repeatCount="indefinite" />}
          </circle>

          {/* === ARMS (Short, Cute) === */}
          {/* Left arm */}
          <ellipse cx="55" cy="140" rx="12" ry="20" fill="url(#bodyGrad)" stroke="rgba(0,180,255,0.3)" strokeWidth="1.5" transform="rotate(-20 55 140)">
            {isActive && <animateTransform attributeName="transform" type="rotate" values="-20 55 140;-15 55 140;-20 55 140" dur="2s" repeatCount="indefinite" />}
          </ellipse>
          {/* Left hand */}
          <circle cx="50" cy="155" r="8" fill="url(#bodyGrad)" stroke="rgba(0,180,255,0.3)" strokeWidth="1" />

          {/* Right arm */}
          <ellipse cx="145" cy="140" rx="12" ry="20" fill="url(#bodyGrad)" stroke="rgba(0,180,255,0.3)" strokeWidth="1.5" transform="rotate(20 145 140)">
            {isActive && <animateTransform attributeName="transform" type="rotate" values="20 145 140;15 145 140;20 145 140" dur="2s" repeatCount="indefinite" />}
          </ellipse>
          {/* Right hand */}
          <circle cx="150" cy="155" r="8" fill="url(#bodyGrad)" stroke="rgba(0,180,255,0.3)" strokeWidth="1" />

          {/* === LEGS (Short, Stubby) === */}
          {/* Left leg */}
          <ellipse cx="85" cy="190" rx="10" ry="15" fill="url(#bodyGrad)" stroke="rgba(0,180,255,0.3)" strokeWidth="1.5" />
          {/* Left foot */}
          <ellipse cx="85" cy="205" rx="12" ry="6" fill="url(#bodyGrad)" stroke="rgba(0,180,255,0.3)" strokeWidth="1" />

          {/* Right leg */}
          <ellipse cx="115" cy="190" rx="10" ry="15" fill="url(#bodyGrad)" stroke="rgba(0,180,255,0.3)" strokeWidth="1.5" />
          {/* Right foot */}
          <ellipse cx="115" cy="205" rx="12" ry="6" fill="url(#bodyGrad)" stroke="rgba(0,180,255,0.3)" strokeWidth="1" />

          {/* === DECORATIVE DETAILS === */}
          {/* Ear antennas */}
          <circle cx="50" cy="45" r="5" fill="url(#bodyGrad)" stroke="rgba(0,180,255,0.3)" strokeWidth="1" />
          <circle cx="150" cy="45" r="5" fill="url(#bodyGrad)" stroke="rgba(0,180,255,0.3)" strokeWidth="1" />
          
          {/* Small status LEDs */}
          <circle cx="90" cy="110" r="2" fill={isActive ? '#00ff88' : '#88ccff'}>
            {isActive && <animate attributeName="fill" values="#00ff88;#00cc66;#00ff88" dur="1s" repeatCount="indefinite" />}
          </circle>
          <circle cx="100" cy="108" r="2" fill={isActive ? '#ffaa00' : '#88ccff'}>
            {isActive && <animate attributeName="fill" values="#ffaa00;#ff8800;#ffaa00" dur="1.3s" repeatCount="indefinite" />}
          </circle>
          <circle cx="110" cy="110" r="2" fill={isActive ? '#00d4ff' : '#88ccff'}>
            {isActive && <animate attributeName="fill" values="#00d4ff;#0088ff;#00d4ff" dur="0.8s" repeatCount="indefinite" />}
          </circle>
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
