import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TradingWidget from './components/TradingWidget';
import LiveTradingDemo from './components/LiveTradingDemo';

// ============================================================
// APP ENTRY POINT - AI Trading Agent Widget v2.0
// ============================================================

function App() {
  const [activeView, setActiveView] = useState<'widget' | 'demo'>('demo');

  return (
    <div className="min-h-screen w-full bg-[#050211] flex flex-col items-center py-6 px-4 relative overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-900/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-900/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-950/10 blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Title Header */}
      <motion.div
        className="relative z-10 text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          <span className="text-purple-400">🤖</span> PJ.BOT <span className="text-purple-400">AI</span> Trading Agent
          <span className="text-[10px] ml-2 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-normal">v2.0</span>
        </h1>
        <p className="text-[10px] text-gray-500 mt-1 tracking-wider uppercase">
          Multi-Routing Neural Engine • Live AI Trading Demo • $10,000 USD
        </p>
      </motion.div>

      {/* View Switcher */}
      <motion.div
        className="relative z-10 flex gap-1 p-1 bg-gray-900/50 rounded-xl border border-gray-800/50 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <button
          onClick={() => setActiveView('demo')}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            activeView === 'demo'
              ? 'bg-green-500/20 text-green-400 border border-green-500/40'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          🔴 LIVE DEMO
        </button>
        <button
          onClick={() => setActiveView('widget')}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
            activeView === 'widget'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          ⚙️ Control Panel
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          {activeView === 'demo' ? (
            <motion.div
              key="demo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LiveTradingDemo />
            </motion.div>
          ) : (
            <motion.div
              key="widget"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-lg mx-auto"
            >
              <TradingWidget />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Architecture Info Footer */}
      <motion.div
        className="relative z-10 mt-6 max-w-6xl w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="grid grid-cols-6 gap-1.5">
          {[
            { icon: '₿', label: 'Crypto' },
            { icon: '💱', label: 'Forex' },
            { icon: '📊', label: 'Stocks' },
            { icon: '🛢️', label: 'Commodity' },
            { icon: '📈', label: 'Indices' },
            { icon: '🎯', label: 'Options' },
          ].map((market) => (
            <div key={market.label} className="p-1.5 rounded-lg bg-gray-900/30 border border-gray-800/30 text-center">
              <div className="text-sm">{market.icon}</div>
              <div className="text-[7px] text-gray-600 mt-0.5">{market.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-center gap-3 text-[8px] text-gray-600 flex-wrap">
          <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-purple-500" />Technical</span>
          <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-blue-500" />Sentiment</span>
          <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-cyan-500" />On-Chain</span>
          <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-green-500" />ML</span>
          <span className="text-purple-500">→ Meta-Agent → Decision</span>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
