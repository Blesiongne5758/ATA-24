import { motion, AnimatePresence } from 'framer-motion';
import { useTradingStore } from '../store/tradingStore';
import { useEffect, useRef } from 'react';

export default function ControlPanel() {
  const { status, runAgent, pauseAgent, simulateAgent, killSwitch, resetAgent, addLog, setActivePanel } = useTradingStore();
  const runInterval = useRef<any>(null);

  useEffect(() => {
    if (status === 'running') {
      runInterval.current = setInterval(() => {
        if (Math.random() > 0.6) {
          const messages = ['🧠 Multi-routing analysis in progress...', '📊 Technical sub-agent: EMA crossover detected', '🐦 Sentiment sub-agent: Twitter buzz score +0.45', '⛓️ On-chain sub-agent: DEX volume spike +340%', '🎯 Confidence: 91% - Above threshold (85%)'];
          addLog({ type: 'ai', message: messages[Math.floor(Math.random() * messages.length)] });
        }
      }, 2500);
    }
    return () => { if (runInterval.current) clearInterval(runInterval.current); };
  }, [status]);

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { if (status === 'running') { pauseAgent(); } else { runAgent(); setActivePanel('logs'); } }} disabled={status === 'killed' || status === 'simulating'} className={`relative overflow-hidden px-3 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider ${status === 'running' ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400' : 'bg-green-500/20 border border-green-500/50 text-green-400'} disabled:opacity-30`}>
          <AnimatePresence mode="wait">{status === 'running' ? <motion.span key="pause" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>⏸ PAUSE</motion.span> : <motion.span key="run" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>▶ RUN AGENT</motion.span>}</AnimatePresence>
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { simulateAgent(); setActivePanel('simulation'); }} disabled={status === 'running' || status === 'simulating' || status === 'killed'} className="px-3 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-blue-500/20 border border-blue-500/50 text-blue-400 disabled:opacity-30">
          🔬 BACKTEST
        </motion.button>
      </div>
      <motion.button whileHover={{ scale: status !== 'killed' ? 1.02 : 1 }} whileTap={{ scale: status !== 'killed' ? 0.95 : 1 }} onClick={killSwitch} disabled={status === 'killed'} className={`w-full px-3 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider ${status === 'killed' ? 'bg-red-900/30 border border-red-900/50 text-red-800' : 'bg-red-500/15 border-2 border-red-500/50 text-red-400 hover:bg-red-500/25'}`}>
        <AnimatePresence mode="wait">{status === 'killed' ? <motion.span key="killed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>☠️ AGENT TERMINATED</motion.span> : <motion.span key="kill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>🚨 EMERGENCY KILL-SWITCH</motion.span>}</AnimatePresence>
      </motion.button>
      {status === 'killed' && <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={resetAgent} className="w-full px-3 py-2 rounded-xl text-xs bg-gray-700/50 border border-gray-600/50 text-gray-300">🔄 Reset Agent</motion.button>}
    </div>
  );
}
