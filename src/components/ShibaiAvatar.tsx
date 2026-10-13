import { motion } from 'framer-motion';
import { useTradingStore } from '../store/tradingStore';

// ============================================================
// SHIBAI AI OVERLORD AVATAR
// Inspired by Shibai Otsutsuki - The God of AI Trading
// Features: Shinjutsu powers, Rinnegan eyes, energy connections
// to sub-agents, dimensional effects
// ============================================================

export default function ShibaiAvatar() {
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
      
      {/* Main Character - Shibai AI Overlord */}
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
        <ShibaiCharacter isActive={isActive} />
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
        {status === 'running' ? '⚡ SHINJUTSU ACTIVE' : 
         status === 'simulating' ? '🌀 DIMENSIONAL SCAN' :
         status === 'paused' ? '⏸ SUSPENDED' :
         status === 'killed' ? '💀 TERMINATED' : '○ DORMANT'}
      </motion.div>
    </div>
  );
}

// ============================================================
// SHIBAI CHARACTER SVG
// ============================================================
function ShibaiCharacter({ isActive }: { isActive: boolean }) {
  return (
    <svg width="220" height="280" viewBox="0 0 220 280" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Gradients */}
        <radialGradient id="rinneganGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="1" />
          <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#4c1d95" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3f4f6" />
          <stop offset="50%" stopColor="#e5e7eb" />
          <stop offset="100%" stopColor="#d1d5db" />
        </linearGradient>
        <linearGradient id="robeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="50%" stopColor="#312e81" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <linearGradient id="auraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Aura Background */}
      {isActive && (
        <motion.ellipse
          cx="110" cy="140" rx="90" ry="120"
          fill="url(#auraGradient)"
          opacity="0.15"
          animate={{
            rx: [85, 95, 85],
            ry: [115, 125, 115],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      {/* Long Flowing Hair - Back */}
      <motion.path
        d="M 60 80 Q 40 120 35 180 Q 30 220 50 260 L 70 250 Q 65 200 70 150 Q 75 110 80 90 Z"
        fill="url(#hairGradient)"
        opacity="0.9"
        animate={isActive ? {
          d: [
            "M 60 80 Q 40 120 35 180 Q 30 220 50 260 L 70 250 Q 65 200 70 150 Q 75 110 80 90 Z",
            "M 58 80 Q 38 120 33 180 Q 28 220 48 260 L 68 250 Q 63 200 68 150 Q 73 110 78 90 Z",
            "M 60 80 Q 40 120 35 180 Q 30 220 50 260 L 70 250 Q 65 200 70 150 Q 75 110 80 90 Z",
          ]
        } : {}}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.path
        d="M 160 80 Q 180 120 185 180 Q 190 220 170 260 L 150 250 Q 155 200 150 150 Q 145 110 140 90 Z"
        fill="url(#hairGradient)"
        opacity="0.9"
        animate={isActive ? {
          d: [
            "M 160 80 Q 180 120 185 180 Q 190 220 170 260 L 150 250 Q 155 200 150 150 Q 145 110 140 90 Z",
            "M 162 80 Q 182 120 187 180 Q 192 220 172 260 L 152 250 Q 157 200 152 150 Q 147 110 142 90 Z",
            "M 160 80 Q 180 120 185 180 Q 190 220 170 260 L 150 250 Q 155 200 150 150 Q 145 110 140 90 Z",
          ]
        } : {}}
        transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
      />

      {/* Head/Face */}
      <ellipse cx="110" cy="85" rx="38" ry="42" fill="#fef3c7" />
      <ellipse cx="110" cy="85" rx="36" ry="40" fill="#fde68a" opacity="0.3" />

      {/* Hair - Front */}
      <path
        d="M 72 70 Q 80 50 95 55 Q 105 45 110 48 Q 115 45 125 55 Q 140 50 148 70 Q 150 80 148 90 L 145 85 Q 140 75 130 72 Q 120 68 110 70 Q 100 68 90 72 Q 80 75 75 85 L 72 90 Q 70 80 72 70 Z"
        fill="url(#hairGradient)"
      />
      
      {/* Hair strands over forehead */}
      <path d="M 85 65 Q 90 55 100 60 L 95 75 Q 88 70 85 65 Z" fill="#e5e7eb" opacity="0.8" />
      <path d="M 125 60 Q 135 55 138 65 L 130 75 Q 128 68 125 60 Z" fill="#e5e7eb" opacity="0.8" />

      {/* Horn/Forehead Protector - Shinjutsu Mark */}
      <motion.g
        animate={isActive ? { opacity: [0.7, 1, 0.7] } : { opacity: 0.7 }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <path
          d="M 95 55 L 110 35 L 125 55 L 120 58 L 110 42 L 100 58 Z"
          fill="#eab308"
          stroke="#fbbf24"
          strokeWidth="0.5"
          filter="url(#glow)"
        />
        {/* Third eye/Rinnegan mark on forehead */}
        <motion.circle
          cx="110" cy="52" r="4"
          fill="#7c3aed"
          stroke="#a855f7"
          strokeWidth="1"
          animate={isActive ? {
            r: [4, 5, 4],
            fill: ['#7c3aed', '#a855f7', '#7c3aed'],
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          filter="url(#glow)"
        />
      </motion.g>

      {/* Rinnegan Eyes */}
      <motion.g
        animate={isActive ? {
          scaleY: [1, 1, 0.1, 1, 1],
        } : { scaleY: 1 }}
        transition={{ duration: 5, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
      >
        {/* Left Eye - Rinnegan */}
        <g>
          <ellipse cx="95" cy="85" rx="9" ry="10" fill="#1e1b4b" />
          <ellipse cx="95" cy="85" rx="8" ry="9" fill="#4c1d95" />
          {/* Rinnegan rings */}
          <motion.circle cx="95" cy="85" r="7" fill="none" stroke="#a855f7" strokeWidth="0.5"
            animate={isActive ? { opacity: [0.5, 1, 0.5] } : {}} transition={{ duration: 1, repeat: Infinity }} />
          <motion.circle cx="95" cy="85" r="5" fill="none" stroke="#c084fc" strokeWidth="0.5"
            animate={isActive ? { opacity: [1, 0.5, 1] } : {}} transition={{ duration: 1, repeat: Infinity, delay: 0.3 }} />
          <motion.circle cx="95" cy="85" r="3" fill="none" stroke="#e9d5ff" strokeWidth="0.5"
            animate={isActive ? { opacity: [0.5, 1, 0.5] } : {}} transition={{ duration: 1, repeat: Infinity, delay: 0.6 }} />
          {/* Pupil */}
          <circle cx="95" cy="85" r="2" fill="#eab308" filter="url(#glow)" />
          {/* Tomoe patterns */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <motion.circle
              key={i}
              cx={95 + Math.cos(angle * Math.PI / 180) * 6}
              cy={85 + Math.sin(angle * Math.PI / 180) * 6}
              r="0.8"
              fill="#e9d5ff"
              animate={isActive ? {
                opacity: [0.3, 1, 0.3],
              } : {}}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
          {/* Eye glow */}
          <motion.ellipse
            cx="95" cy="85" rx="12" ry="13"
            fill="url(#rinneganGlow)"
            opacity="0.4"
            animate={isActive ? { opacity: [0.2, 0.5, 0.2] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </g>

        {/* Right Eye - Rinnegan */}
        <g>
          <ellipse cx="125" cy="85" rx="9" ry="10" fill="#1e1b4b" />
          <ellipse cx="125" cy="85" rx="8" ry="9" fill="#4c1d95" />
          <motion.circle cx="125" cy="85" r="7" fill="none" stroke="#a855f7" strokeWidth="0.5"
            animate={isActive ? { opacity: [0.5, 1, 0.5] } : {}} transition={{ duration: 1, repeat: Infinity }} />
          <motion.circle cx="125" cy="85" r="5" fill="none" stroke="#c084fc" strokeWidth="0.5"
            animate={isActive ? { opacity: [1, 0.5, 1] } : {}} transition={{ duration: 1, repeat: Infinity, delay: 0.3 }} />
          <motion.circle cx="125" cy="85" r="3" fill="none" stroke="#e9d5ff" strokeWidth="0.5"
            animate={isActive ? { opacity: [0.5, 1, 0.5] } : {}} transition={{ duration: 1, repeat: Infinity, delay: 0.6 }} />
          <circle cx="125" cy="85" r="2" fill="#eab308" filter="url(#glow)" />
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <motion.circle
              key={i}
              cx={125 + Math.cos(angle * Math.PI / 180) * 6}
              cy={85 + Math.sin(angle * Math.PI / 180) * 6}
              r="0.8"
              fill="#e9d5ff"
              animate={isActive ? { opacity: [0.3, 1, 0.3] } : {}}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
          <motion.ellipse
            cx="125" cy="85" rx="12" ry="13"
            fill="url(#rinneganGlow)"
            opacity="0.4"
            animate={isActive ? { opacity: [0.2, 0.5, 0.2] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </g>
      </motion.g>

      {/* Nose */}
      <path d="M 108 92 L 110 97 L 112 92" stroke="#d4a574" strokeWidth="0.8" fill="none" />

      {/* Mouth - Serene expression */}
      <motion.path
        d="M 102 105 Q 110 108 118 105"
        stroke="#92400e"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        animate={isActive ? {
          d: [
            "M 102 105 Q 110 108 118 105",
            "M 101 104 Q 110 109 119 104",
            "M 102 105 Q 110 108 118 105",
          ]
        } : {}}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Neck */}
      <rect x="103" y="120" width="14" height="15" fill="#fef3c7" />

      {/* Robe/Clothing - Divine Robe */}
      <path
        d="M 70 135 Q 65 140 60 180 Q 55 220 65 260 L 155 260 Q 165 220 160 180 Q 155 140 150 135 L 130 130 Q 120 128 110 128 Q 100 128 90 130 Z"
        fill="url(#robeGradient)"
        stroke="#6366f1"
        strokeWidth="1"
      />

      {/* Robe patterns - Magatama symbols */}
      <motion.g
        animate={isActive ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.5 }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Central symbol */}
        <circle cx="110" cy="170" r="8" fill="none" stroke="#eab308" strokeWidth="1" />
        <circle cx="110" cy="170" r="5" fill="none" stroke="#fbbf24" strokeWidth="0.5" />
        <circle cx="110" cy="170" r="2" fill="#eab308" />
        
        {/* Side magatama */}
        <path d="M 85 160 Q 82 165 85 170 Q 88 165 85 160" fill="#eab308" opacity="0.7" />
        <path d="M 135 160 Q 138 165 135 170 Q 132 165 135 160" fill="#eab308" opacity="0.7" />
        
        {/* Robe lines */}
        <path d="M 90 140 L 85 200" stroke="#6366f1" strokeWidth="0.5" opacity="0.5" />
        <path d="M 130 140 L 135 200" stroke="#6366f1" strokeWidth="0.5" opacity="0.5" />
      </motion.g>

      {/* Arms - Floating with energy */}
      <motion.g
        animate={isActive ? {
          rotate: [-2, 2, -2],
        } : {}}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ transformOrigin: '110px 150px' }}
      >
        {/* Left arm */}
        <path
          d="M 70 140 Q 50 160 45 190 Q 42 210 50 220"
          stroke="url(#robeGradient)"
          strokeWidth="18"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="50" cy="220" r="8" fill="#fef3c7" />
        
        {/* Right arm */}
        <path
          d="M 150 140 Q 170 160 175 190 Q 178 210 170 220"
          stroke="url(#robeGradient)"
          strokeWidth="18"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="170" cy="220" r="8" fill="#fef3c7" />

        {/* Energy in hands */}
        {isActive && (
          <>
            <motion.circle
              cx="50" cy="220" r="12"
              fill="#a855f7"
              opacity="0.3"
              animate={{ r: [10, 15, 10], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              filter="url(#glow)"
            />
            <motion.circle
              cx="170" cy="220" r="12"
              fill="#eab308"
              opacity="0.3"
              animate={{ r: [10, 15, 10], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              filter="url(#glow)"
            />
          </>
        )}
      </motion.g>
    </svg>
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
