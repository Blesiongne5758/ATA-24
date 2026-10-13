import { motion } from 'framer-motion';
import { useTradingStore } from '../store/tradingStore';
import TradingChart from './TradingChart';
import ControlPanel from './ControlPanel';
import MarketFooter from './MarketFooter';
import { ActivityLog, StatsDashboard } from './Panels';

// ============================================================
// SUPREME AGENT COMMAND CENTER
// Features: 4 live charts, multi-trading server, full controls
// ============================================================

export default function SupremeCommandCenter() {
  const { toggleCommandCenter, status, marketConfig } = useTradingStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#050211] flex flex-col h-screen"
    >
      {/* Header */}
      <div className="flex-shrink-0 bg-gray-900/95 backdrop-blur-sm border-b border-purple-500/20 px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <motion.div
              className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <h1 className="text-xl font-bold text-white truncate">
              <span className="text-purple-400">⚡</span> Supreme Agent Command Center
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 flex-shrink-0 hidden sm:inline-block">
              MULTI-TRADING SERVER
            </span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right hidden md:block">
              <div className="text-[10px] text-gray-400">Status</div>
              <div className={`text-xs font-bold ${
                status === 'running' ? 'text-green-400' :
                status === 'simulating' ? 'text-blue-400' :
                status === 'paused' ? 'text-yellow-400' :
                status === 'killed' ? 'text-red-400' : 'text-gray-400'
              }`}>
                {status.toUpperCase()}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleCommandCenter}
              className="px-3 py-1.5 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-300 text-xs font-medium hover:bg-gray-700 transition-all whitespace-nowrap"
            >
              ✕ Exit
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Control Panel */}
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
          <ControlPanel />
        </div>

        {/* 4 Live Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Chart 1 - Primary Market */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Chart 1: {marketConfig.pair} (Primary)
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                  LIVE
                </span>
              </div>
            </div>
            <TradingChart compact={true} />
          </div>

          {/* Chart 2 - Secondary Market */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Chart 2: ETH/USDT (Secondary)
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  LIVE
                </span>
              </div>
            </div>
            <TradingChart compact={true} />
          </div>

          {/* Chart 3 - Meme Coin */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                Chart 3: DOGE/USDT (Meme)
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  LIVE
                </span>
              </div>
            </div>
            <TradingChart compact={true} />
          </div>

          {/* Chart 4 - Forex */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                Chart 4: EUR/USD (Forex)
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  LIVE
                </span>
              </div>
            </div>
            <TradingChart compact={true} />
          </div>
        </div>

        {/* Stats & Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Stats Dashboard */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span>📈</span> Performance Dashboard
            </h3>
            <StatsDashboard />
          </div>

          {/* Activity Log */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span>📋</span> Activity Log
            </h3>
            <ActivityLog />
          </div>
        </div>

        {/* Multi-Trading Server Info */}
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <span>🌐</span> Multi-Trading Server Status
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ServerStatus name="Primary Server" status="online" latency={12} />
            <ServerStatus name="Backup Server" status="online" latency={18} />
            <ServerStatus name="WebSocket Hub" status="online" latency={8} />
            <ServerStatus name="Data Feed" status="online" latency={15} />
          </div>
        </div>

      </div>

      {/* Interactive Market Footer - Always at bottom with flex-shrink-0 */}
      <div className="flex-shrink-0 border-t border-gray-800/30 bg-gray-900/95 backdrop-blur-sm px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <MarketFooter />
        </div>
      </div>
    </motion.div>
  );
}

function ServerStatus({ name, status, latency }: { name: string; status: 'online' | 'offline' | 'warning'; latency: number }) {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    warning: 'bg-yellow-500',
  };

  const statusTextColors = {
    online: 'text-green-400',
    offline: 'text-red-400',
    warning: 'text-yellow-400',
  };

  return (
    <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
      <div className="flex items-center gap-2 mb-1">
        <motion.div
          className={`w-2 h-2 rounded-full ${statusColors[status]}`}
          animate={status === 'online' ? { opacity: [1, 0.3, 1] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-xs font-medium text-gray-200">{name}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] ${statusTextColors[status]} uppercase`}>
          {status}
        </span>
        <span className="text-[10px] text-gray-400 font-mono">
          {latency}ms
        </span>
      </div>
    </div>
  );
}
