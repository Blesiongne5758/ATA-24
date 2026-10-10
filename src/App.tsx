import { motion } from 'framer-motion';
import TradingWidget from './components/TradingWidget';

// ============================================================
// APP ENTRY POINT
// AI Trading Agent Widget - Main Application
// ============================================================

function App() {
  return (
    <div className="min-h-screen w-full bg-[#050211] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-900/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-900/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-950/10 blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Animated scanning line */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Title Header */}
      <motion.div
        className="relative z-10 text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          <span className="text-purple-400">AI</span> Trading Agent
        </h1>
        <p className="text-xs text-gray-500 mt-1 tracking-wider uppercase">
          Multi-Routing Neural Engine • Real-Time Decision Making
        </p>
      </motion.div>

      {/* Main Widget */}
      <div className="relative z-10 w-full max-w-md">
        <TradingWidget />
      </div>

      {/* Architecture Info */}
      <motion.div
        className="relative z-10 mt-6 max-w-md w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="grid grid-cols-3 gap-2">
          <ArchCard icon="📊" label="Technical" sublabel="RSI • MACD • EMA • BB" />
          <ArchCard icon="🐦" label="Sentiment" sublabel="Twitter • News • LLM" />
          <ArchCard icon="⛓️" label="On-Chain" sublabel="Whales • DEX • Flows" />
        </div>
        <div className="mt-2 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-[10px] text-purple-300 font-medium">Meta-Agent Orchestrator • Dynamic Routing</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ArchCard({ icon, label, sublabel }: { icon: string; label: string; sublabel: string }) {
  return (
    <div className="p-2 rounded-lg bg-gray-900/30 border border-gray-800/40 text-center">
      <div className="text-lg mb-0.5">{icon}</div>
      <div className="text-[10px] font-bold text-gray-300">{label}</div>
      <div className="text-[8px] text-gray-600 mt-0.5">{sublabel}</div>
    </div>
  );
}

export default App;
