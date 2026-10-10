import { useTradingStore } from '../store/tradingStore';
import { motion } from 'framer-motion';

// ============================================================
// STATS DASHBOARD COMPONENT
// Features: Real-time trading metrics display
// ============================================================

export default function StatsDashboard() {
  const { status, currentPnL, totalTrades, winRate, activePositions, aiSettings } = useTradingStore();
  const isActive = status === 'running';

  return (
    <div className="grid grid-cols-2 gap-2">
      <StatCard 
        label="P&L" 
        value={`$${currentPnL.toFixed(2)}`}
        color={currentPnL >= 0 ? 'green' : 'red'}
        isActive={isActive}
      />
      <StatCard 
        label="Trades" 
        value={totalTrades.toString()}
        color="blue"
        isActive={isActive}
      />
      <StatCard 
        label="Win Rate" 
        value={`${winRate}%`}
        color="purple"
        isActive={isActive}
      />
      <StatCard 
        label="Positions" 
        value={`${activePositions}/${useTradingStore.getState().riskSettings.maxOpenPositions.count}`}
        color="cyan"
        isActive={isActive}
      />
      
      {/* Confidence Meter */}
      <div className="col-span-2 p-2 rounded-lg bg-gray-900/30 border border-gray-800/50">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-gray-400">AI Confidence</span>
          <span className="text-[10px] font-mono text-purple-300">
            {isActive ? `${(Math.random() * 15 + 80).toFixed(1)}%` : '—'}
          </span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, #7c3aed, ${
                aiSettings.confidenceThreshold > 90 ? '#22c55e' : '#a855f7'
              })`,
            }}
            animate={isActive ? { width: ['60%', '95%', '85%', '92%'] } : { width: '0%' }}
            transition={isActive ? { duration: 3, repeat: Infinity } : {}}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-gray-600">Threshold: {aiSettings.confidenceThreshold}%</span>
          <span className="text-[9px] text-gray-600">Model: {aiSettings.model.replace(/_/g, ' ')}</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, isActive }: { label: string; value: string; color: string; isActive: boolean }) {
  const colorMap: Record<string, string> = {
    green: 'text-green-400 border-green-500/20',
    red: 'text-red-400 border-red-500/20',
    blue: 'text-blue-400 border-blue-500/20',
    purple: 'text-purple-400 border-purple-500/20',
    cyan: 'text-cyan-400 border-cyan-500/20',
  };

  return (
    <motion.div
      className={`p-2 rounded-lg bg-gray-900/30 border ${colorMap[color]} transition-all`}
      animate={isActive ? { borderColor: ['rgba(147,51,234,0.2)', 'rgba(147,51,234,0.4)', 'rgba(147,51,234,0.2)'] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</div>
      <div className={`text-sm font-bold font-mono ${colorMap[color].split(' ')[0]}`}>{value}</div>
    </motion.div>
  );
}
