import { motion } from 'framer-motion';
import { useTradingStore } from '../store/tradingStore';

export default function CuteRobotAvatar() {
  const { status } = useTradingStore();
  const isActive = status === 'running' || status === 'simulating';

  return (
    <div className="relative flex items-center justify-center w-full h-[200px] overflow-hidden">
      {isActive && (
        <>
          <motion.div className="absolute w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, transparent 70%)', filter: 'blur(20px)' }} animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute w-56 h-56 rounded-full border-2 border-purple-500/30" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }} />
        </>
      )}
      <motion.div className="relative z-10" animate={isActive ? { y: [0, -5, 0] } : {}} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} style={{ filter: isActive ? 'drop-shadow(0 0 20px rgba(147, 51, 234, 0.8))' : 'drop-shadow(0 0 5px rgba(147, 51, 234, 0.3))' }}>
        <svg width="120" height="150" viewBox="0 0 180 220" fill="none">
          <motion.line x1="90" y1="20" x2="90" y2="45" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" animate={isActive ? { opacity: [1, 0.5, 1] } : {}} transition={{ duration: 1, repeat: Infinity }} />
          <motion.circle cx="90" cy="15" r="6" fill={isActive ? "#c084fc" : "#7c3aed"} animate={isActive ? { r: [6, 8, 6] } : {}} transition={{ duration: 1.5, repeat: Infinity }} />
          <rect x="45" y="45" width="90" height="75" rx="20" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="2" />
          <rect x="50" y="50" width="80" height="65" rx="16" fill="#0f0a2e" />
          <rect x="55" y="55" width="70" height="55" rx="12" fill="#1a0533" stroke="#a855f7" strokeWidth="1" opacity="0.8" />
          <motion.g animate={isActive ? { scaleY: [1, 1, 0.1, 1, 1] } : { scaleY: 1 }} transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}>
            <ellipse cx="75" cy="78" rx="8" ry="9" fill="#c084fc" />
            <ellipse cx="75" cy="78" rx="5" ry="6" fill="#e9d5ff" />
            <circle cx="73" cy="75" r="2.5" fill="white" />
            <ellipse cx="105" cy="78" rx="8" ry="9" fill="#c084fc" />
            <ellipse cx="105" cy="78" rx="5" ry="6" fill="#e9d5ff" />
            <circle cx="103" cy="75" r="2.5" fill="white" />
          </motion.g>
          <ellipse cx="62" cy="88" rx="6" ry="3" fill="#f472b6" opacity="0.5" />
          <ellipse cx="118" cy="88" rx="6" ry="3" fill="#f472b6" opacity="0.5" />
          <motion.path d="M 80 92 Q 90 100 100 92" stroke="#e9d5ff" strokeWidth="2.5" strokeLinecap="round" fill="none" animate={isActive ? { d: ["M 80 92 Q 90 100 100 92", "M 78 91 Q 90 102 102 91", "M 80 92 Q 90 100 100 92"] } : {}} transition={{ duration: 2, repeat: Infinity }} />
          <rect x="55" y="120" width="70" height="60" rx="15" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="2" />
          <motion.g animate={isActive ? { scale: [1, 1.15, 1] } : {}} transition={{ duration: 1.2, repeat: Infinity }} style={{ transformOrigin: '90px 148px' }}>
            <path d="M 82 142 C 82 138 86 135 90 139 C 94 135 98 138 98 142 C 98 148 90 154 90 154 C 90 154 82 148 82 142" fill="#e879f9" />
          </motion.g>
          <motion.circle cx="90" cy="165" r="4" fill={isActive ? "#22c55e" : status === 'paused' ? "#eab308" : status === 'killed' ? "#ef4444" : "#6b7280"} animate={isActive ? { opacity: [1, 0.3, 1] } : {}} transition={{ duration: 1, repeat: Infinity }} />
        </svg>
      </motion.div>
      <motion.div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ background: status === 'running' ? 'rgba(34, 197, 94, 0.2)' : status === 'simulating' ? 'rgba(59, 130, 246, 0.2)' : status === 'paused' ? 'rgba(234, 179, 8, 0.2)' : status === 'killed' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(107, 114, 128, 0.2)', border: `1px solid ${status === 'running' ? 'rgba(34, 197, 94, 0.5)' : status === 'simulating' ? 'rgba(59, 130, 246, 0.5)' : status === 'paused' ? 'rgba(234, 179, 8, 0.5)' : status === 'killed' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(107, 114, 128, 0.5)'}`, color: status === 'running' ? '#22c55e' : status === 'simulating' ? '#3b82f6' : status === 'paused' ? '#eab308' : status === 'killed' ? '#ef4444' : '#9ca3af' }} animate={isActive ? { scale: [1, 1.05, 1] } : {}} transition={{ duration: 2, repeat: Infinity }}>
        {status === 'running' ? '● ACTIVE' : status === 'simulating' ? '◉ SIMULATING' : status === 'paused' ? '◐ PAUSED' : status === 'killed' ? '✕ TERMINATED' : '○ IDLE'}
      </motion.div>
    </div>
  );
}
