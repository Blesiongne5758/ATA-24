import { useTradingStore } from '../store/tradingStore';
import { motion } from 'framer-motion';

// ============================================================
// AUTO TRADING SYSTEM COMPONENT
// Features: Trading mode, filters, auto-compound, partial TP
// ============================================================

export default function AutoTradingSystem() {
  const { autoTradeConfig, updateAutoTradeConfig } = useTradingStore();

  const modes = [
    { id: 'conservative' as const, label: 'Conservative', icon: '🛡️', desc: 'Low risk, high confidence only' },
    { id: 'balanced' as const, label: 'Balanced', icon: '⚖️', desc: 'Medium risk, balanced approach' },
    { id: 'aggressive' as const, label: 'Aggressive', icon: '⚡', desc: 'High risk, more trades' },
    { id: 'scalping' as const, label: 'Scalping', icon: '🎯', desc: 'Quick in/out, small profits' },
    { id: 'swing' as const, label: 'Swing', icon: '🌊', desc: 'Medium-term positions' },
  ];

  return (
    <div className="space-y-3">
      {/* Master Toggle */}
      <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-900/30 border border-gray-800/30">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${autoTradeConfig.enabled ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
          <span className="text-xs font-medium text-gray-200">Auto Trading</span>
        </div>
        <button
          onClick={() => updateAutoTradeConfig({ enabled: !autoTradeConfig.enabled })}
          className={`relative w-10 h-5 rounded-full transition-all ${
            autoTradeConfig.enabled ? 'bg-green-500' : 'bg-gray-700'
          }`}
        >
          <motion.div
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md"
            animate={{ left: autoTradeConfig.enabled ? '22px' : '2px' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      {/* Trading Mode */}
      <div>
        <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5 block">Trading Mode</label>
        <div className="grid grid-cols-1 gap-1">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => updateAutoTradeConfig({ mode: mode.id })}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all ${
                autoTradeConfig.mode === mode.id
                  ? 'bg-purple-500/15 border border-purple-500/40'
                  : 'bg-gray-900/20 border border-gray-800/30 hover:bg-gray-900/40'
              }`}
            >
              <span className="text-sm">{mode.icon}</span>
              <div className="flex-1">
                <div className={`text-[10px] font-medium ${autoTradeConfig.mode === mode.id ? 'text-purple-300' : 'text-gray-300'}`}>
                  {mode.label}
                </div>
                <div className="text-[8px] text-gray-600">{mode.desc}</div>
              </div>
              {autoTradeConfig.mode === mode.id && (
                <div className="w-2 h-2 rounded-full bg-purple-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Trading Limits */}
      <div className="p-2.5 rounded-lg bg-gray-900/30 border border-gray-800/30 space-y-2.5">
        <div className="text-[10px] text-gray-400 font-medium">Trading Limits</div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[8px] text-gray-600 block">Max Trades/Day</label>
            <input
              type="number"
              value={autoTradeConfig.maxTradesPerDay}
              onChange={(e) => updateAutoTradeConfig({ maxTradesPerDay: Number(e.target.value) })}
              min={1}
              max={100}
              className="w-full px-2 py-1 rounded bg-gray-950/50 border border-gray-800/50 text-[10px] text-gray-200 font-mono focus:outline-none focus:border-purple-500/30"
            />
          </div>
          <div>
            <label className="text-[8px] text-gray-600 block">Cooldown (sec)</label>
            <input
              type="number"
              value={autoTradeConfig.cooldownPeriod}
              onChange={(e) => updateAutoTradeConfig({ cooldownPeriod: Number(e.target.value) })}
              min={10}
              max={3600}
              className="w-full px-2 py-1 rounded bg-gray-950/50 border border-gray-800/50 text-[10px] text-gray-200 font-mono focus:outline-none focus:border-purple-500/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[8px] text-gray-600 block">Trailing Activation %</label>
            <input
              type="number"
              value={autoTradeConfig.trailingActivation}
              onChange={(e) => updateAutoTradeConfig({ trailingActivation: Number(e.target.value) })}
              step={0.1}
              min={0.1}
              max={10}
              className="w-full px-2 py-1 rounded bg-gray-950/50 border border-gray-800/50 text-[10px] text-gray-200 font-mono focus:outline-none focus:border-purple-500/30"
            />
          </div>
          <div>
            <label className="text-[8px] text-gray-600 block">Break Even Trigger %</label>
            <input
              type="number"
              value={autoTradeConfig.breakEvenTrigger}
              onChange={(e) => updateAutoTradeConfig({ breakEvenTrigger: Number(e.target.value) })}
              step={0.1}
              min={0.1}
              max={10}
              className="w-full px-2 py-1 rounded bg-gray-950/50 border border-gray-800/50 text-[10px] text-gray-200 font-mono focus:outline-none focus:border-purple-500/30"
            />
          </div>
        </div>
      </div>

      {/* Auto Compound */}
      <div className="p-2.5 rounded-lg bg-gray-900/30 border border-gray-800/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-gray-400 font-medium">Auto Compound</span>
          <button
            onClick={() => updateAutoTradeConfig({ autoCompound: !autoTradeConfig.autoCompound })}
            className={`relative w-8 h-4 rounded-full transition-all ${
              autoTradeConfig.autoCompound ? 'bg-purple-500' : 'bg-gray-700'
            }`}
          >
            <motion.div
              className="absolute top-0.5 w-3 h-3 rounded-full bg-white"
              animate={{ left: autoTradeConfig.autoCompound ? '18px' : '2px' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
        {autoTradeConfig.autoCompound && (
          <div>
            <label className="text-[8px] text-gray-600 block">Compound % of Profits</label>
            <input
              type="range"
              value={autoTradeConfig.compoundPercent}
              onChange={(e) => updateAutoTradeConfig({ compoundPercent: Number(e.target.value) })}
              min={10}
              max={100}
              step={5}
              className="w-full h-1.5 rounded-full bg-gray-700 accent-purple-500 cursor-pointer"
            />
            <div className="text-[8px] text-gray-500 text-right">{autoTradeConfig.compoundPercent}%</div>
          </div>
        )}
      </div>

      {/* Partial TP */}
      <div className="p-2.5 rounded-lg bg-gray-900/30 border border-gray-800/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-gray-400 font-medium">Partial Take Profit</span>
          <button
            onClick={() => updateAutoTradeConfig({ partialTP: { ...autoTradeConfig.partialTP, enabled: !autoTradeConfig.partialTP.enabled } })}
            className={`relative w-8 h-4 rounded-full transition-all ${
              autoTradeConfig.partialTP.enabled ? 'bg-green-500' : 'bg-gray-700'
            }`}
          >
            <motion.div
              className="absolute top-0.5 w-3 h-3 rounded-full bg-white"
              animate={{ left: autoTradeConfig.partialTP.enabled ? '18px' : '2px' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
        {autoTradeConfig.partialTP.enabled && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[8px] text-gray-600 block">Trigger at %</label>
              <input
                type="number"
                value={autoTradeConfig.partialTP.percent}
                onChange={(e) => updateAutoTradeConfig({ partialTP: { ...autoTradeConfig.partialTP, percent: Number(e.target.value) } })}
                className="w-full px-2 py-1 rounded bg-gray-950/50 border border-gray-800/50 text-[10px] text-gray-200 font-mono focus:outline-none focus:border-purple-500/30"
              />
            </div>
            <div>
              <label className="text-[8px] text-gray-600 block">Close %</label>
              <input
                type="number"
                value={autoTradeConfig.partialTP.closePercent}
                onChange={(e) => updateAutoTradeConfig({ partialTP: { ...autoTradeConfig.partialTP, closePercent: Number(e.target.value) } })}
                className="w-full px-2 py-1 rounded bg-gray-950/50 border border-gray-800/50 text-[10px] text-gray-200 font-mono focus:outline-none focus:border-purple-500/30"
              />
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="p-2.5 rounded-lg bg-gray-900/30 border border-gray-800/30 space-y-2">
        <div className="text-[10px] text-gray-400 font-medium">Filters</div>
        
        {/* News Filter */}
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-gray-400">📰 News Filter</span>
          <button
            onClick={() => updateAutoTradeConfig({ newsFilter: { ...autoTradeConfig.newsFilter, enabled: !autoTradeConfig.newsFilter.enabled } })}
            className={`relative w-7 h-3.5 rounded-full transition-all ${
              autoTradeConfig.newsFilter.enabled ? 'bg-yellow-500' : 'bg-gray-700'
            }`}
          >
            <motion.div
              className="absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white"
              animate={{ left: autoTradeConfig.newsFilter.enabled ? '16px' : '2px' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
        {autoTradeConfig.newsFilter.enabled && (
          <div>
            <label className="text-[8px] text-gray-600 block">Pause before news (min)</label>
            <input
              type="number"
              value={autoTradeConfig.newsFilter.minutesBefore}
              onChange={(e) => updateAutoTradeConfig({ newsFilter: { ...autoTradeConfig.newsFilter, minutesBefore: Number(e.target.value) } })}
              className="w-full px-2 py-1 rounded bg-gray-950/50 border border-gray-800/50 text-[10px] text-gray-200 font-mono focus:outline-none focus:border-purple-500/30"
            />
          </div>
        )}

        {/* Session Filter */}
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-gray-400">🕐 Session Filter</span>
          <button
            onClick={() => updateAutoTradeConfig({ sessionFilter: { ...autoTradeConfig.sessionFilter, enabled: !autoTradeConfig.sessionFilter.enabled } })}
            className={`relative w-7 h-3.5 rounded-full transition-all ${
              autoTradeConfig.sessionFilter.enabled ? 'bg-blue-500' : 'bg-gray-700'
            }`}
          >
            <motion.div
              className="absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white"
              animate={{ left: autoTradeConfig.sessionFilter.enabled ? '16px' : '2px' }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
        {autoTradeConfig.sessionFilter.enabled && (
          <div className="flex flex-wrap gap-1">
            {['sydney', 'tokyo', 'london', 'new_york'].map((session) => (
              <button
                key={session}
                onClick={() => {
                  const sessions = autoTradeConfig.sessionFilter.sessions.includes(session)
                    ? autoTradeConfig.sessionFilter.sessions.filter(s => s !== session)
                    : [...autoTradeConfig.sessionFilter.sessions, session];
                  updateAutoTradeConfig({ sessionFilter: { ...autoTradeConfig.sessionFilter, sessions } });
                }}
                className={`px-2 py-0.5 rounded text-[8px] capitalize transition-all ${
                  autoTradeConfig.sessionFilter.sessions.includes(session)
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'bg-gray-900/30 text-gray-600 border border-gray-800/30'
                }`}
              >
                {session.replace('_', ' ')}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
