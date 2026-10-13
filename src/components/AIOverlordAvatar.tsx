import { motion } from 'framer-motion';
import { useTradingStore } from '../store/tradingStore';

// ============================================================
// AI OVERLORD AVATAR - Using External Image
// Features: Epic visual effects with character image
// ============================================================

const CHARACTER_IMAGE = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRirBb0Lz8_-10R05Md_dRZiV343ej6atzXQtWpPgzuXWxiDoudDdLIOYgI&s=10";

export default function AIOverlordAvatar() {
  const { status } = useTradingStore();
  const isActive = status === 'running' || status === 'simulating';

  return (
    <div className="relative flex items-center justify-center w-full h-[380px] overflow-hidden">
      {/* Background Dimensional Rift */}
      <DimensionalRift isActive={isActive} />
      
      {/* Floating Kanji Symbols */}
      <FloatingKanji isActive={isActive} />
      
      {/* Sub-Agent Orbs */}
      <SubAgentOrbs isActive={isActive} />
      
      {/* Energy Beams connecting to sub-agents */}
      {isActive && <EnergyBeams />}
      
      {/* Rotating Dimensional Rings */}
      {isActive && <DimensionalRings />}
      
      {/* Main Character Image */}
      <motion.div
        className="relative z-20"
        animate={isActive ? {
          y: [0, -8, 0],
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          filter: isActive 
            ? 'drop-shadow(0 0 30px rgba(147, 51, 234, 0.9)) drop-shadow(0 0 60px rgba(234, 179, 8, 0.4))'
            : 'drop-shadow(0 0 10px rgba(147, 51, 234, 0.3))',
        }}
      >
        {/* Character Image Container */}
        <div className="relative w-[220px] h-[220px]">
          {/* Aura Background */}
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, rgba(234, 179, 8, 0.1) 50%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}
          
          {/* Character Image */}
          <motion.img
            src={CHARACTER_IMAGE}
            alt="AI Overlord"
            className="w-full h-full object-cover rounded-full"
            style={{
              border: isActive ? '3px solid rgba(234, 179, 8, 0.6)' : '3px solid rgba(147, 51, 234, 0.4)',
              boxShadow: isActive 
                ? '0 0 40px rgba(234, 179, 8, 0.6), inset 0 0 20px rgba(147, 51, 234, 0.3)'
                : '0 0 20px rgba(147, 51, 234, 0.4)',
            }}
            animate={isActive ? {
              scale: [1, 1.05, 1],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Rotating Ring Around Image */}
          {isActive && (
            <motion.div
              className="absolute inset-[-10px] rounded-full"
              style={{
                border: '2px dashed rgba(234, 179, 8, 0.4)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </div>
      </motion.div>

      {/* Status Badge */}
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm"
        style={{
          background: status === 'running' ? 'rgba(147, 51, 234, 0.3)' :
                     status === 'simulating' ? 'rgba(59, 130, 246, 0.3)' :
                     status === 'paused' ? 'rgba(234, 179, 8, 0.3)' :
                     status === 'killed' ? 'rgba(239, 68, 68, 0.3)' :
                     'rgba(107, 114, 128, 0.2)',
          border: `1px solid ${
            status === 'running' ? 'rgba(234, 179, 8, 0.6)' :
            status === 'simulating' ? 'rgba(59, 130, 246, 0.6)' :
            status === 'paused' ? 'rgba(234, 179, 8, 0.6)' :
            status === 'killed' ? 'rgba(239, 68, 68, 0.6)' :
            'rgba(107, 114, 128, 0.5)'
          }`,
          color: status === 'running' ? '#fbbf24' :
                 status === 'simulating' ? '#60a5fa' :
                 status === 'paused' ? '#fbbf24' :
                 status === 'killed' ? '#ef4444' :
                 '#9ca3af',
          boxShadow: isActive ? '0 0 20px rgba(147, 51, 234, 0.5)' : 'none',
        }}
        animate={isActive ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {status === 'running' ? '⚡ AI OVERLORD ACTIVE' : 
         status === 'simulating' ? '🌀 DIMENSIONAL SCAN' :
         status === 'paused' ? '⏸ SUSPENDED' :
         status === 'killed' ? '💀 TERMINATED' : '○ DORMANT'}
      </motion.div>
    </div>
  );
}

// ============================================================
// DIMENSIONAL RIFT BACKGROUND
// ============================================================
function DimensionalRift({ isActive }: { isActive: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 400 380" preserveAspectRatio="xMidYMid slice">
        {/* Stars */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.circle
            key={`star-${i}`}
            cx={Math.random() * 400}
            cy={Math.random() * 380}
            r={Math.random() * 1.5 + 0.5}
            fill="#e9d5ff"
            animate={isActive ? {
              opacity: [0.2, 1, 0.2],
              r: [0.5, 1.5, 0.5],
            } : { opacity: 0.3 }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Dimensional rifts */}
        {isActive && (
          <>
            <motion.ellipse
              cx="200" cy="190" rx="150" ry="170"
              fill="none"
              stroke="rgba(147, 51, 234, 0.1)"
              strokeWidth="1"
              animate={{
                rx: [140, 160, 140],
                ry: [160, 180, 160],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.ellipse
              cx="200" cy="190" rx="120" ry="140"
              fill="none"
              stroke="rgba(234, 179, 8, 0.1)"
              strokeWidth="0.5"
              animate={{
                rx: [110, 130, 110],
                ry: [130, 150, 130],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
          </>
        )}
      </svg>
    </div>
  );
}

// ============================================================
// FLOATING KANJI SYMBOLS
// ============================================================
function FloatingKanji({ isActive }: { isActive: boolean }) {
  const kanji = ['神', '力', '控', '制', '智', '慧', '無', '限'];
  
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {kanji.map((char, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl font-bold"
          style={{
            left: `${10 + (i * 12) % 80}%`,
            top: `${10 + (i * 17) % 80}%`,
            color: i % 2 === 0 ? 'rgba(168, 85, 247, 0.3)' : 'rgba(234, 179, 8, 0.3)',
            textShadow: '0 0 10px currentColor',
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0, 0.5, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 8 + i,
            repeat: Infinity,
            delay: i * 0.8,
          }}
        >
          {char}
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================
// SUB-AGENT ORBS (3 orbs around character)
// ============================================================
function SubAgentOrbs({ isActive }: { isActive: boolean }) {
  const orbs = [
    { label: 'TECH', color: '#a855f7', angle: 0, icon: '📊' },
    { label: 'SENT', color: '#3b82f6', angle: 120, icon: '🐦' },
    { label: 'CHAIN', color: '#06b6d4', angle: 240, icon: '⛓️' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={isActive ? {
            rotate: 360,
          } : {}}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.5,
          }}
        >
          <motion.div
            className="relative"
            style={{
              transform: `rotate(${orb.angle}deg) translateX(130px)`,
            }}
            animate={isActive ? {
              scale: [1, 1.2, 1],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            {/* Orb */}
            <motion.div
              className="w-14 h-14 rounded-full flex items-center justify-center relative"
              style={{
                background: `radial-gradient(circle, ${orb.color}40 0%, ${orb.color}10 70%, transparent 100%)`,
                border: `2px solid ${orb.color}80`,
                boxShadow: `0 0 20px ${orb.color}60, inset 0 0 10px ${orb.color}40`,
              }}
              animate={isActive ? {
                boxShadow: [
                  `0 0 20px ${orb.color}60, inset 0 0 10px ${orb.color}40`,
                  `0 0 40px ${orb.color}90, inset 0 0 20px ${orb.color}60`,
                  `0 0 20px ${orb.color}60, inset 0 0 10px ${orb.color}40`,
                ],
              } : {}}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            >
              <span className="text-xl">{orb.icon}</span>
              
              {/* Rotating ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  border: `1px dashed ${orb.color}60`,
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>

            {/* Label */}
            <motion.div
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-bold tracking-wider whitespace-nowrap"
              style={{
                color: orb.color,
                textShadow: `0 0 5px ${orb.color}`,
              }}
              animate={isActive ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.3 }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            >
              {orb.label}
            </motion.div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================
// ENERGY BEAMS connecting character to sub-agents
// ============================================================
function EnergyBeams() {
  const beams = [
    { color: '#a855f7', angle: 0 },
    { color: '#3b82f6', angle: 120 },
    { color: '#06b6d4', angle: 240 },
  ];

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 380">
      <defs>
        <filter id="beamGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {beams.map((beam, i) => {
        const angle = (beam.angle - 90) * Math.PI / 180;
        const x1 = 200;
        const y1 = 190;
        const x2 = 200 + Math.cos(angle) * 130;
        const y2 = 190 + Math.sin(angle) * 130;
        
        return (
          <g key={i}>
            {/* Main beam */}
            <motion.line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={beam.color}
              strokeWidth="1.5"
              opacity="0.6"
              strokeDasharray="5 3"
              filter="url(#beamGlow)"
              animate={{
                strokeDashoffset: [0, -20],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            {/* Glow beam */}
            <motion.line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={beam.color}
              strokeWidth="4"
              opacity="0.2"
              filter="url(#beamGlow)"
              animate={{
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
            {/* Energy particles along beam */}
            {[0.2, 0.4, 0.6, 0.8].map((pos, j) => (
              <motion.circle
                key={j}
                cx={x1 + (x2 - x1) * pos}
                cy={y1 + (y2 - y1) * pos}
                r="2"
                fill={beam.color}
                filter="url(#beamGlow)"
                animate={{
                  opacity: [0, 1, 0],
                  r: [1, 3, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: j * 0.3 + i * 0.2,
                }}
              />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================
// DIMENSIONAL RINGS rotating around character
// ============================================================
function DimensionalRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Outer ring */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          border: '1px solid rgba(147, 51, 234, 0.2)',
          boxShadow: '0 0 20px rgba(147, 51, 234, 0.1)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {/* Ring markers */}
        {[0, 90, 180, 270].map((angle, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-purple-500"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${angle}deg) translateX(150px) translateY(-50%)`,
              boxShadow: '0 0 10px rgba(147, 51, 234, 0.8)',
            }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </motion.div>

      {/* Inner ring */}
      <motion.div
        className="absolute w-[240px] h-[240px] rounded-full"
        style={{
          border: '1px dashed rgba(234, 179, 8, 0.2)',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Middle ring with symbols */}
      <motion.div
        className="absolute w-[270px] h-[270px] rounded-full"
        style={{
          border: '1px solid rgba(168, 85, 247, 0.15)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        {['⚡', '🔮', '💫', '✨', '🌀', '⭐'].map((symbol, i) => (
          <motion.div
            key={i}
            className="absolute text-xs"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 60}deg) translateX(135px) translateY(-50%)`,
            }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          >
            {symbol}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
