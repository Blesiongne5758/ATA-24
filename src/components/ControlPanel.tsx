import { motion, AnimatePresence } from 'framer-motion';
import { useTradingStore } from '../store/tradingStore';
import { useEffect, useRef } from 'react';

// ============================================================
// CONTROL PANEL COMPONENT
// Features: RUN/PAUSE, SIMULATE/BACKTEST, EMERGENCY KILL-SWITCH
// ============================================================

export default function ControlPanel() {
  const { 
    status, 
    simulationProgress, 
    runAgent, 
    pauseAgent, 
    simulateAgent, 
    killSwitch, 
    resetAgent,
    addLog,
    setSimulationProgress,
    setStatus,
  } = useTradingStore();

  const simulationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const runInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulation progress handler
  useEffect(() => {
    if (status === 'simulating') {
      simulationInterval.current = setInterval(() => {
        const current = useTradingStore.getState().simulationProgress;
        if (current >= 100) {
          if (simulationInterval.current) clearInterval(simulationInterval.current);
          setStatus('idle');
          setSimulationProgress(0);
          addLog({ type: 'info', message: '✅ Backtest completed! Analyzing results...' });
          addLog({ type: 'ai', message: '📈 Win Rate: 67.3% | Sharpe Ratio: 2.14 | Max DD: 4.2%' });
        } else {
          setSimulationProgress(current + Math.random() * 3 + 1);
          // Random AI logs during simulation
          if (Math.random() > 0.7) {
            const messages = [
              '🔍 Sub-Agent 1: Detected bullish divergence on RSI...',
              '📊 Sub-Agent 2: Sentiment score: +0.72 (Bullish)',
              '⛓️ Sub-Agent 3: Whale accumulation detected...',
              '🧠 Meta-Agent: Combining signals... Confidence: 87%',
              '📉 Processing candlestick patterns...',
              '🔮 Neural network inference: Layer 3/5...',
              '⚡ Order flow analysis: Buy pressure increasing...',
              '🎯 Pattern match: Head & Shoulders (inverse) - 92% match',
            ];
            addLog({ type: 'ai', message: messages[Math.floor(Math.random() * messages.length)] });
          }
        }
      }, 200);
    }
    return () => {
      if (simulationInterval.current) clearInterval(simulationInterval.current);
    };
  }, [status]);

  // Running agent simulation
  useEffect(() => {
    if (status === 'running') {
      runInterval.current = setInterval(() => {
        if (Math.random() > 0.6) {
          const messages = [
            '🧠 Multi-routing analysis in progress...',
            '📊 Technical sub-agent: EMA crossover detected (9/21)',
            '🐦 Sentiment sub-agent: Twitter buzz score +0.45',
            '⛓️ On-chain sub-agent: DEX volume spike +340%',
            '✅ Trade executed: LONG BTC @ $67,420 | SL: $66,800 | TP: $69,200',
            '🎯 Confidence: 91% - Above threshold (85%)',
            '📈 Position PnL: +$247.50 (+0.37%)',
            '🔄 Rebalancing portfolio weights...',
          ];
          addLog({ type: messages[Math.floor(Math.random() * messages.length)].includes('executed') ? 'trade' : 'ai', 
            message: messages[Math.floor(Math.random() * messages.length)] });
        }
      }, 3000);
    }
    return () => {
      if (runInterval.current) clearInterval(runInterval.current);
    };
  }, [status]);

  return (
    <div className="space-y-4">
      {/* Main Control Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {/* RUN/PAUSE Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={status === 'running' ? pauseAgent : runAgent}
          disabled={status === 'killed' || status === 'simulating'}
          className={`relative overflow-hidden px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
            status === 'running'
              ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30'
              : 'bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30'
          } disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          <AnimatePresence mode="wait">
            {status === 'running' ? (
              <motion.span key="pause" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                ⏸ PAUSE
              </motion.span>
            ) : (
              <motion.span key="run" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                ▶ RUN AGENT
              </motion.span>
            )}
          </AnimatePresence>
          {status === 'running' && (
            <motion.div
              className="absolute inset-0 bg-green-500/10"
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>

        {/* SIMULATE/BACKTEST Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={simulateAgent}
          disabled={status === 'running' || status === 'simulating' || status === 'killed'}
          className="px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-wider bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          🔬 BACKTEST
        </motion.button>
      </div>

      {/* Simulation Progress Bar */}
      <AnimatePresence>
        {status === 'simulating' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex justify-between text-xs text-gray-400">
              <span>Backtest Progress</span>
              <span>{Math.min(Math.round(simulationProgress), 100)}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #7c3aed, #3b82f6, #06b6d4)',
                }}
                animate={{ width: `${Math.min(simulationProgress, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex gap-2 text-xs">
              <span className="text-purple-400">◉ Technical</span>
              <span className="text-blue-400">◉ Sentiment</span>
              <span className="text-cyan-400">◉ On-Chain</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EMERGENCY KILL-SWITCH */}
      <motion.button
        whileHover={{ scale: status !== 'killed' ? 1.02 : 1 }}
        whileTap={{ scale: status !== 'killed' ? 0.95 : 1 }}
        onClick={killSwitch}
        disabled={status === 'killed'}
        className={`w-full px-4 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
          status === 'killed'
            ? 'bg-red-900/30 border border-red-900/50 text-red-800 cursor-not-allowed'
            : 'bg-red-500/20 border-2 border-red-500/60 text-red-400 hover:bg-red-500/30 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20'
        }`}
      >
        <AnimatePresence mode="wait">
          {status === 'killed' ? (
            <motion.span key="killed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              ☠️ AGENT TERMINATED
            </motion.span>
          ) : (
            <motion.span key="kill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              🚨 EMERGENCY KILL-SWITCH
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Reset Button */}
      {status === 'killed' && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={resetAgent}
          className="w-full px-4 py-2 rounded-xl text-sm bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:bg-gray-700 transition-all"
        >
          🔄 Reset Agent
        </motion.button>
      )}
    </div>
  );
}
