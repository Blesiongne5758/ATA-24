import { motion, AnimatePresence } from 'framer-motion';
import { useTradingStore } from '../store/tradingStore';

// ============================================================
// ACTIVITY LOG COMPONENT
// Features: Real-time AI log display with color-coded entries
// ============================================================

export default function ActivityLog() {
  const { logs, clearLogs } = useTradingStore();

  const typeStyles: Record<string, { bg: string; border: string; text: string }> = {
    info: { bg: 'bg-blue-500/5', border: 'border-blue-500/20', text: 'text-blue-300' },
    trade: { bg: 'bg-green-500/5', border: 'border-green-500/20', text: 'text-green-300' },
    warning: { bg: 'bg-yellow-500/5', border: 'border-yellow-500/20', text: 'text-yellow-300' },
    error: { bg: 'bg-red-500/5', border: 'border-red-500/20', text: 'text-red-300' },
    ai: { bg: 'bg-purple-500/5', border: 'border-purple-500/20', text: 'text-purple-300' },
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          AI Activity Log
        </h3>
        <button 
          onClick={clearLogs}
          className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>
      
      <div className="h-[180px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
        <AnimatePresence initial={false}>
          {logs.length === 0 ? (
            <div className="text-center text-gray-600 text-xs py-8">
              No activity yet. Start the agent to see logs.
            </div>
          ) : (
            logs.map((log) => {
              const style = typeStyles[log.type] || typeStyles.info;
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className={`px-2.5 py-1.5 rounded-lg border text-[11px] ${style.bg} ${style.border} ${style.text}`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-[9px] text-gray-500 font-mono whitespace-nowrap mt-0.5">
                      {log.timestamp.toLocaleTimeString('en-US', { hour12: false })}
                    </span>
                    <span className="flex-1">{log.message}</span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
