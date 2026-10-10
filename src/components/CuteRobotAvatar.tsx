import { motion } from 'framer-motion';
import { useTradingStore } from '../store/tradingStore';

// ============================================================
// CUTE ROBOT WOMAN AVATAR COMPONENT
// Features: SVG illustration, purple aura glow, multi-routing
// particle animation background
// ============================================================

export default function CuteRobotAvatar() {
  const { status } = useTradingStore();
  const isActive = status === 'running' || status === 'simulating';

  return (
    <div className="relative flex items-center justify-center w-full h-[320px] overflow-hidden">
      {/* Multi-Routing Particle Network Background */}
      <ParticleNetwork isActive={isActive} />
      
      {/* Purple Aura Glow Effect */}
      {isActive && (
        <>
          <motion.div
            className="absolute w-48 h-48 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(147, 51, 234, 0.1) 50%, transparent 70%)',
              filter: 'blur(20px)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute w-36 h-36 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(192, 132, 252, 0.5) 0%, rgba(147, 51, 234, 0.2) 50%, transparent 70%)',
              filter: 'blur(10px)',
            }}
            animate={{
              scale: [1.1, 0.9, 1.1],
              opacity: [0.8, 0.4, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          {/* Outer pulse ring */}
          <motion.div
            className="absolute w-56 h-56 rounded-full border-2 border-purple-500/30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        </>
      )}

      {/* Robot Character SVG */}
      <motion.div
        className="relative z-10"
        animate={isActive ? {
          y: [0, -5, 0],
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          filter: isActive 
            ? 'drop-shadow(0 0 20px rgba(147, 51, 234, 0.8)) drop-shadow(0 0 40px rgba(147, 51, 234, 0.4))'
            : 'drop-shadow(0 0 5px rgba(147, 51, 234, 0.3))',
        }}
      >
        <svg width="180" height="220" viewBox="0 0 180 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Antenna */}
          <motion.line
            x1="90" y1="20" x2="90" y2="45"
            stroke="#a855f7" strokeWidth="3" strokeLinecap="round"
            animate={isActive ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.circle
            cx="90" cy="15" r="6"
            fill={isActive ? "#c084fc" : "#7c3aed"}
            animate={isActive ? { 
              r: [6, 8, 6],
              fill: ['#c084fc', '#e9d5ff', '#c084fc']
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          
          {/* Head */}
          <rect x="45" y="45" width="90" height="75" rx="20" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="2" />
          <rect x="50" y="50" width="80" height="65" rx="16" fill="#0f0a2e" />
          
          {/* Face Screen */}
          <rect x="55" y="55" width="70" height="55" rx="12" fill="#1a0533" stroke="#a855f7" strokeWidth="1" opacity="0.8" />
          
          {/* Eyes - Cute style */}
          <motion.g
            animate={isActive ? {
              scaleY: [1, 1, 0.1, 1, 1],
            } : { scaleY: 1 }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
          >
            {/* Left Eye */}
            <ellipse cx="75" cy="78" rx="8" ry="9" fill="#c084fc" />
            <ellipse cx="75" cy="78" rx="5" ry="6" fill="#e9d5ff" />
            <circle cx="73" cy="75" r="2.5" fill="white" />
            <circle cx="78" cy="80" r="1.5" fill="white" opacity="0.7" />
            
            {/* Right Eye */}
            <ellipse cx="105" cy="78" rx="8" ry="9" fill="#c084fc" />
            <ellipse cx="105" cy="78" rx="5" ry="6" fill="#e9d5ff" />
            <circle cx="103" cy="75" r="2.5" fill="white" />
            <circle cx="108" cy="80" r="1.5" fill="white" opacity="0.7" />
          </motion.g>
          
          {/* Blush marks */}
          <ellipse cx="62" cy="88" rx="6" ry="3" fill="#f472b6" opacity="0.5" />
          <ellipse cx="118" cy="88" rx="6" ry="3" fill="#f472b6" opacity="0.5" />
          
          {/* Cute Smile */}
          <motion.path
            d="M 80 92 Q 90 100 100 92"
            stroke="#e9d5ff"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            animate={isActive ? {
              d: [
                "M 80 92 Q 90 100 100 92",
                "M 78 91 Q 90 102 102 91",
                "M 80 92 Q 90 100 100 92",
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          {/* Hair/Crown decoration */}
          <path d="M 45 55 Q 50 35 65 42 Q 75 30 90 38 Q 105 30 115 42 Q 130 35 135 55" 
                fill="none" stroke="#a855f7" strokeWidth="2" />
          <circle cx="65" cy="40" r="3" fill="#c084fc" />
          <circle cx="90" cy="35" r="4" fill="#e879f9" />
          <circle cx="115" cy="40" r="3" fill="#c084fc" />
          
          {/* Body */}
          <rect x="55" y="120" width="70" height="60" rx="15" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="2" />
          <rect x="60" y="125" width="60" height="50" rx="12" fill="#0f0a2e" />
          
          {/* Chest display / heart */}
          <motion.g
            animate={isActive ? {
              scale: [1, 1.15, 1],
            } : {}}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{ transformOrigin: '90px 148px' }}
          >
            <path d="M 82 142 C 82 138 86 135 90 139 C 94 135 98 138 98 142 C 98 148 90 154 90 154 C 90 154 82 148 82 142" 
                  fill="#e879f9" />
          </motion.g>
          
          {/* Arms */}
          <motion.rect
            x="35" y="125" width="18" height="45" rx="9"
            fill="#1e1b4b" stroke="#7c3aed" strokeWidth="2"
            animate={isActive ? {
              rotate: [0, -5, 0, 5, 0],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ transformOrigin: '44px 125px' }}
          />
          <motion.rect
            x="127" y="125" width="18" height="45" rx="9"
            fill="#1e1b4b" stroke="#7c3aed" strokeWidth="2"
            animate={isActive ? {
              rotate: [0, 5, 0, -5, 0],
            } : {}}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            style={{ transformOrigin: '136px 125px' }}
          />
          
          {/* Legs */}
          <rect x="65" y="178" width="16" height="30" rx="8" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="2" />
          <rect x="99" y="178" width="16" height="30" rx="8" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="2" />
          
          {/* Feet */}
          <ellipse cx="73" cy="210" rx="12" ry="6" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="2" />
          <ellipse cx="107" cy="210" rx="12" ry="6" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="2" />
          
          {/* Status indicator on body */}
          <motion.circle
            cx="90" cy="165" r="4"
            fill={isActive ? "#22c55e" : status === 'paused' ? "#eab308" : status === 'killed' ? "#ef4444" : "#6b7280"}
            animate={isActive ? {
              opacity: [1, 0.3, 1],
            } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </svg>
      </motion.div>

      {/* Status Badge */}
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
        style={{
          background: status === 'running' ? 'rgba(34, 197, 94, 0.2)' :
                     status === 'simulating' ? 'rgba(59, 130, 246, 0.2)' :
                     status === 'paused' ? 'rgba(234, 179, 8, 0.2)' :
                     status === 'killed' ? 'rgba(239, 68, 68, 0.2)' :
                     'rgba(107, 114, 128, 0.2)',
          border: `1px solid ${
            status === 'running' ? 'rgba(34, 197, 94, 0.5)' :
            status === 'simulating' ? 'rgba(59, 130, 246, 0.5)' :
            status === 'paused' ? 'rgba(234, 179, 8, 0.5)' :
            status === 'killed' ? 'rgba(239, 68, 68, 0.5)' :
            'rgba(107, 114, 128, 0.5)'
          }`,
          color: status === 'running' ? '#22c55e' :
                 status === 'simulating' ? '#3b82f6' :
                 status === 'paused' ? '#eab308' :
                 status === 'killed' ? '#ef4444' :
                 '#9ca3af',
        }}
        animate={isActive ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {status === 'running' ? '● ACTIVE' : 
         status === 'simulating' ? '◉ SIMULATING' :
         status === 'paused' ? '◐ PAUSED' :
         status === 'killed' ? '✕ TERMINATED' : '○ IDLE'}
      </motion.div>
    </div>
  );
}

// ============================================================
// PARTICLE NETWORK BACKGROUND (Multi-Routing Visualization)
// ============================================================
function ParticleNetwork({ isActive }: { isActive: boolean }) {
  const nodes = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
  }));

  const connections = nodes.slice(0, 12).map((node, i) => ({
    from: node,
    to: nodes[(i + 3) % nodes.length],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden opacity-30">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Connection lines */}
        {connections.map((conn, i) => (
          <motion.line
            key={`conn-${i}`}
            x1={conn.from.x}
            y1={conn.from.y}
            x2={conn.to.x}
            y2={conn.to.y}
            stroke="url(#purpleGradient)"
            strokeWidth="0.2"
            initial={{ opacity: 0 }}
            animate={isActive ? {
              opacity: [0, 0.8, 0],
              strokeDashoffset: [100, 0],
            } : { opacity: 0.1 }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            strokeDasharray="5 3"
          />
        ))}
        
        {/* Nodes */}
        {nodes.map((node) => (
          <motion.circle
            key={`node-${node.id}`}
            cx={node.x}
            cy={node.y}
            r={node.size * 0.3}
            fill="#a855f7"
            animate={isActive ? {
              opacity: [0.3, 1, 0.3],
              r: [node.size * 0.2, node.size * 0.4, node.size * 0.2],
            } : { opacity: 0.2 }}
            transition={{
              duration: 1.5 + Math.random() * 2,
              repeat: Infinity,
              delay: node.id * 0.2,
            }}
          />
        ))}
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#e879f9" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Floating data particles */}
      {isActive && (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 rounded-full bg-purple-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
