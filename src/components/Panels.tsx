import { motion, AnimatePresence } from 'framer-motion';
import { useTradingStore } from '../store/tradingStore';
import { useState, useRef, useEffect } from 'react';

// ============ Activity Log ============
export function ActivityLog() {
  const { logs, clearLogs } = useTradingStore();
  const typeStyles: Record<string, string> = { info: 'bg-blue-500/5 border-blue-500/20 text-blue-300', trade: 'bg-green-500/5 border-green-500/20 text-green-300', warning: 'bg-yellow-500/5 border-yellow-500/20 text-yellow-300', error: 'bg-red-500/5 border-red-500/20 text-red-300', ai: 'bg-purple-500/5 border-purple-500/20 text-purple-300', system: 'bg-gray-500/5 border-gray-500/20 text-gray-300' };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />AI Activity Log</h3>
        <button onClick={clearLogs} className="text-[10px] text-gray-500 hover:text-gray-300">Clear</button>
      </div>
      <div className="h-[200px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
        {logs.length === 0 ? <div className="text-center text-gray-600 text-xs py-8">No activity yet. Start the agent to see logs.</div> : logs.map((log) => (<motion.div key={log.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`px-2.5 py-1.5 rounded-lg border text-[11px] ${typeStyles[log.type] || typeStyles.info}`}><div className="flex items-start gap-2"><span className="text-[9px] text-gray-500 font-mono whitespace-nowrap mt-0.5">{log.timestamp.toLocaleTimeString('en-US', { hour12: false })}</span><span className="flex-1">{log.message}</span></div></motion.div>))}
      </div>
    </div>
  );
}

// ============ Stats Dashboard ============
export function StatsDashboard() {
  const { status, currentPnL, totalTrades, winRate, activePositions, aiSettings } = useTradingStore();
  const isActive = status === 'running';
  return (
    <div className="grid grid-cols-2 gap-2">
      <StatCard label="P&L" value={`$${currentPnL.toFixed(2)}`} color={currentPnL >= 0 ? 'green' : 'red'} isActive={isActive} />
      <StatCard label="Trades" value={totalTrades.toString()} color="blue" isActive={isActive} />
      <StatCard label="Win Rate" value={`${winRate}%`} color="purple" isActive={isActive} />
      <StatCard label="Positions" value={`${activePositions}/3`} color="cyan" isActive={isActive} />
      <div className="col-span-2 p-2 rounded-lg bg-gray-900/30 border border-gray-800/50">
        <div className="flex justify-between items-center mb-1"><span className="text-[10px] text-gray-400">AI Confidence</span><span className="text-[10px] font-mono text-purple-300">{isActive ? `${(Math.random() * 15 + 80).toFixed(1)}%` : '—'}</span></div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden"><motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }} animate={isActive ? { width: ['60%', '95%', '85%', '92%'] } : { width: '0%' }} transition={isActive ? { duration: 3, repeat: Infinity } : {}} /></div>
        <div className="flex justify-between mt-1"><span className="text-[9px] text-gray-600">Threshold: {aiSettings.confidenceThreshold}%</span><span className="text-[9px] text-gray-600">Model: {aiSettings.model.replace(/_/g, ' ')}</span></div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, isActive }: { label: string; value: string; color: string; isActive: boolean }) {
  const colorMap: Record<string, string> = { green: 'text-green-400 border-green-500/20', red: 'text-red-400 border-red-500/20', blue: 'text-blue-400 border-blue-500/20', purple: 'text-purple-400 border-purple-500/20', cyan: 'text-cyan-400 border-cyan-500/20' };
  return (<motion.div className={`p-2 rounded-lg bg-gray-900/30 border ${colorMap[color]}`} animate={isActive ? { borderColor: ['rgba(147,51,234,0.2)', 'rgba(147,51,234,0.4)', 'rgba(147,51,234,0.2)'] } : {}} transition={{ duration: 2, repeat: Infinity }}><div className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</div><div className={`text-sm font-bold font-mono ${colorMap[color].split(' ')[0]}`}>{value}</div></motion.div>);
}

// ============ Simulation Engine ============
export function SimulationEngine() {
  const { status, simulation, updateSimulation, addLog, setStatus, aiSettings, marketConfig } = useTradingStore();
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (status === 'simulating') {
      let currentCandle = 0, equity = 10000;
      const equityCurve: number[] = [10000];
      const trades: any[] = [];
      intervalRef.current = setInterval(() => {
        if (currentCandle >= 1000) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setStatus('idle');
          updateSimulation({ isRunning: false, progress: 100 });
          addLog({ type: 'info', message: `✅ Backtest Complete! ${trades.length} trades` });
          return;
        }
        currentCandle++;
        const progress = (currentCandle / 1000) * 100;
        if (Math.random() > 0.7) {
          const isWin = Math.random() > 0.4;
          const pnl = isWin ? Math.random() * 100 + 10 : -(Math.random() * 50 + 5);
          equity += pnl;
          trades.push({ pnl, type: Math.random() > 0.5 ? 'buy' : 'sell', entryPrice: 67000 + Math.random() * 1000, exitPrice: 67000 + Math.random() * 1000 });
        }
        equityCurve.push(equity);
        updateSimulation({ isRunning: true, progress, currentCandle, totalCandles: 1000, equity, trades: trades.slice(-50), equityCurve });
      }, 30);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [status]);

  const equityCurve = simulation.equityCurve;
  const maxEq = Math.max(...equityCurve);
  const minEq = Math.min(...equityCurve);
  const range = maxEq - minEq || 1;
  const finalEq = equityCurve[equityCurve.length - 1] || 10000;
  const totalReturn = ((finalEq / 10000 - 1) * 100);
  const isProfit = totalReturn >= 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div><div className="text-[10px] text-gray-500 uppercase tracking-wider">Backtest Engine</div><div className="text-xs font-bold text-gray-200">{marketConfig.pair} • {marketConfig.timeFrame}</div></div>
        <div className={`text-right ${isProfit ? 'text-green-400' : 'text-red-400'}`}><div className="text-sm font-bold font-mono">${finalEq.toFixed(2)}</div><div className="text-[10px] font-mono">{isProfit ? '+' : ''}{totalReturn.toFixed(2)}%</div></div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-[9px] text-gray-500"><span>Candle {simulation.currentCandle}/{simulation.totalCandles}</span><span>{simulation.progress.toFixed(1)}%</span></div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden"><motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #7c3aed, #3b82f6, #06b6d4)' }} animate={{ width: `${simulation.progress}%` }} /></div>
      </div>
      <div className="rounded-lg bg-gray-950/50 border border-gray-800/50 p-2">
        <svg viewBox="0 0 400 80" className="w-full h-[60px]" preserveAspectRatio="none">
          <path d={equityCurve.map((eq, i) => `${i === 0 ? 'M' : 'L'} ${(i / (equityCurve.length - 1 || 1)) * 400} ${80 - ((eq - minEq) / range) * 80}`).join(' ') + ` L 400 80 L 0 80 Z`} fill={isProfit ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'} />
          <path d={equityCurve.map((eq, i) => `${i === 0 ? 'M' : 'L'} ${(i / (equityCurve.length - 1 || 1)) * 400} ${80 - ((eq - minEq) / range) * 80}`).join(' ')} fill="none" stroke={isProfit ? '#22c55e' : '#ef4444'} strokeWidth="1.5" />
        </svg>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        <MiniStat label="Trades" value={simulation.trades.length.toString()} />
        <MiniStat label="Win Rate" value={simulation.trades.length > 0 ? `${((simulation.trades.filter(t => t.pnl > 0).length / simulation.trades.length) * 100).toFixed(0)}%` : '—'} />
        <MiniStat label="Profit Factor" value={simulation.trades.length > 0 ? (Math.abs(simulation.trades.filter(t => t.pnl > 0).reduce((s, t) => s + t.pnl, 0) / (simulation.trades.filter(t => t.pnl < 0).reduce((s, t) => s + t.pnl, 1) || 1))).toFixed(2) : '—'} />
        <MiniStat label="Max DD" value={`${Math.min(0, ...equityCurve.map((e, i) => { const peak = Math.max(...equityCurve.slice(0, i + 1)); return ((e - peak) / peak) * 100; })).toFixed(1)}%`} color="red" />
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (<div className="p-1.5 rounded bg-gray-900/30 border border-gray-800/30 text-center"><div className="text-[8px] text-gray-600 uppercase">{label}</div><div className={`text-[10px] font-bold font-mono ${color === 'red' ? 'text-red-400' : 'text-gray-200'}`}>{value}</div></div>);
}

// ============ Chat AI ============
export function ChatAI() {
  const { addLog, marketConfig } = useTradingStore();
  const [messages, setMessages] = useState<Array<{ id: string; role: 'assistant' | 'user'; content: string }>>([{ id: '1', role: 'assistant', content: '👋 Hello! I\'m your AI Trading Assistant. How can I help you today?' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (msg?: string) => {
    const text = msg || input;
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user' as const, content: text }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      let response = 'I can help with market analysis, trading signals, risk reports, and more. Try "analyze BTC" or "show signals"!';
      if (text.toLowerCase().includes('analyze')) response = `📊 **Market Analysis for ${marketConfig.pair}**\n\n• RSI: ${(45 + Math.random() * 20).toFixed(1)} - Neutral\n• MACD: Bullish crossover detected\n• EMA 9/21: Price above both EMAs\n\n**AI Confidence:** ${(75 + Math.random() * 20).toFixed(1)}%\n**Recommendation:** ${Math.random() > 0.5 ? '🟢 BUY' : '⚪ HOLD'}`;
      else if (text.toLowerCase().includes('signal')) response = `🎯 **Trading Signals**\n\n🟢 BTC/USDT - LONG @ $${(67000 + Math.random() * 1000).toFixed(0)}\n   Confidence: ${(80 + Math.random() * 15).toFixed(1)}%\n\n🔴 ETH/USDT - SHORT @ $${(3500 + Math.random() * 100).toFixed(0)}\n   Confidence: ${(70 + Math.random() * 20).toFixed(1)}%`;
      else if (text.toLowerCase().includes('risk')) response = `⚠️ **Risk Report**\n\n• Open Positions: 2/3\n• Total Risk: 4.5% of balance\n• Daily P&L: +$${(Math.random() * 200).toFixed(2)}\n• Max Drawdown: ${(-2 - Math.random() * 3).toFixed(1)}%\n• Sharpe Ratio: ${(1.5 + Math.random()).toFixed(2)}`;
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant' as const, content: response }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[350px] bg-gray-900/30 border border-gray-800/50 rounded-xl overflow-hidden">
      <div className="px-3 py-2 border-b border-gray-800/50 bg-gray-900/50 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs">🤖</div>
        <div><div className="text-xs font-bold text-white">AI Trading Assistant</div><div className="text-[9px] text-green-400 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />Online</div></div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {messages.map((msg) => (<div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] rounded-lg px-2.5 py-1.5 text-[11px] ${msg.role === 'user' ? 'bg-purple-500/20 border border-purple-500/30 text-purple-100' : 'bg-gray-800/50 border border-gray-700/50 text-gray-200'}`}><div className="whitespace-pre-wrap">{msg.content}</div></div></div>))}
        {isTyping && <div className="flex justify-start"><div className="bg-gray-800/50 rounded-lg px-2.5 py-1.5 flex gap-1">{[0, 1, 2].map(i => <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }} />)}</div></div>}
      </div>
      <div className="px-3 py-1.5 border-t border-gray-800/50 flex gap-1 overflow-x-auto">
        {['📊 Analyze BTC', '🎯 Signals', '⚠️ Risk Report', '🌍 Overview'].map((action) => (<button key={action} onClick={() => handleSend(action.split(' ').slice(1).join(' '))} className="flex-shrink-0 px-2 py-1 rounded bg-gray-800/50 border border-gray-700/50 text-[9px] text-gray-300 hover:bg-purple-500/20 hover:border-purple-500/30">{action}</button>))}
      </div>
      <div className="px-3 py-2 border-t border-gray-800/50 flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask me anything..." className="flex-1 px-2 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700/50 text-xs text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50" />
        <button onClick={() => handleSend()} disabled={!input.trim()} className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs disabled:opacity-30">Send</button>
      </div>
    </div>
  );
}

// ============ Voice Control ============
export function VoiceControl() {
  const { addLog } = useTradingStore();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [waveform, setWaveform] = useState<number[]>(Array(20).fill(0));

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => setWaveform(Array(20).fill(0).map(() => Math.random() * 100)), 100);
      const timeout = setTimeout(() => { const commands = ['analyze bitcoin', 'show trading signals', 'open long position', 'market overview']; setTranscript(commands[Math.floor(Math.random() * commands.length)]); setIsListening(false); setWaveform(Array(20).fill(0)); addLog({ type: 'ai', message: `🎤 Voice: "${transcript}"` }); }, 3000);
      return () => { clearInterval(interval); clearTimeout(timeout); };
    }
  }, [isListening]);

  return (
    <div className="bg-gray-900/30 border border-gray-800/50 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-sm">🎤</div><div><div className="text-xs font-bold text-white">Voice Control</div><div className="text-[9px] text-green-400">Enabled</div></div></div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <motion.button onClick={() => { setIsListening(!isListening); setTranscript(''); if (!isListening) addLog({ type: 'info', message: '🎤 Voice recognition started...' }); }} whileTap={{ scale: 0.95 }} className={`relative w-16 h-16 rounded-full flex items-center justify-center ${isListening ? 'bg-red-500/20 border-2 border-red-500' : 'bg-blue-500/20 border-2 border-blue-500/50'}`}>
          {isListening && <motion.div className="absolute inset-0 rounded-full border-2 border-red-500" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />}
          <span className="text-2xl">{isListening ? '🔴' : '🎤'}</span>
        </motion.button>
        <div className="text-[10px] text-center"><div className={isListening ? 'text-red-400' : 'text-gray-400'}>{isListening ? 'Listening...' : 'Tap to speak'}</div>{transcript && <div className="text-[9px] text-gray-500 mt-0.5">"{transcript}"</div>}</div>
      </div>
      <div className="h-8 flex items-center justify-center gap-0.5">{waveform.map((h, i) => <motion.div key={i} className="w-1 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-full" animate={{ height: isListening ? `${Math.max(10, h)}%` : '10%' }} transition={{ duration: 0.1 }} />)}</div>
      <div className="grid grid-cols-3 gap-1.5">{['📊 Analyze', '🎯 Signals', '🌍 Overview', '⚠️ Risk', '📡 Status', '💰 Trade'].map((cmd) => <button key={cmd} onClick={() => { setTranscript(cmd.split(' ').slice(1).join(' ').toLowerCase()); addLog({ type: 'ai', message: `🎤 Voice: "${cmd}"` }); }} className="px-2 py-1.5 rounded bg-gray-800/50 border border-gray-700/50 text-[9px] text-gray-300 hover:bg-blue-500/20 hover:border-blue-500/30">{cmd}</button>)}</div>
    </div>
  );
}

// ============ Prompt Library ============
export function PromptLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const tasks = [
    { id: 'whale_wallet', name: 'Whale Wallet Monitor', desc: 'Monitor top 100 crypto whale wallets', category: 'monitoring', priority: 'critical', frequency: 'realtime', tags: ['whales', 'crypto', 'onchain'] },
    { id: 'meme_trader', name: 'Meme Trader Tracker', desc: 'Track 50 most active meme coin traders', category: 'monitoring', priority: 'high', frequency: '5min', tags: ['meme', 'traders', 'social'] },
    { id: 'news_analyzer', name: 'Financial News Analyzer', desc: 'Analyze 50+ financial news sources', category: 'analysis', priority: 'critical', frequency: '1min', tags: ['news', 'sentiment', 'economy'] },
    { id: 'telegram_monitor', name: 'Telegram Signal Monitor', desc: 'Monitor 20 major trading Telegram groups', category: 'monitoring', priority: 'high', frequency: 'realtime', tags: ['telegram', 'signals'] },
    { id: 'twitter_monitor', name: 'Twitter/X Influencer Monitor', desc: 'Monitor 100 crypto influencers', category: 'monitoring', priority: 'high', frequency: '5min', tags: ['twitter', 'influencers'] },
    { id: 'policy_tracker', name: 'Policy & Regulation Tracker', desc: 'Track crypto regulations from 50+ countries', category: 'monitoring', priority: 'critical', frequency: '15min', tags: ['regulation', 'policy'] },
    { id: 'technical_analysis', name: 'Multi-Timeframe Technical', desc: 'Analyze across 7 timeframes with 15+ indicators', category: 'analysis', priority: 'critical', frequency: '5min', tags: ['technical', 'indicators'] },
    { id: 'broker_consensus', name: 'Global Broker Consensus', desc: 'Aggregate analysis from 30+ major brokers', category: 'analysis', priority: 'high', frequency: '1hour', tags: ['brokers', 'consensus'] },
    { id: 'orchestrator', name: 'Multi-Agent Orchestrator', desc: 'Coordinate all sub-agents for final decisions', category: 'execution', priority: 'critical', frequency: 'realtime', tags: ['orchestrator', 'decision'] },
    { id: 'risk_manager', name: 'Portfolio Risk Manager', desc: 'Manage portfolio risk and position sizing', category: 'risk_management', priority: 'critical', frequency: 'realtime', tags: ['risk', 'position-sizing'] },
    { id: 'strategy_planner', name: 'Adaptive Strategy Planner', desc: 'Develop and optimize trading strategies', category: 'strategy', priority: 'high', frequency: '1hour', tags: ['strategy', 'optimization'] },
    { id: 'notifications', name: 'Smart Notification System', desc: 'Intelligent notification routing', category: 'notification', priority: 'high', frequency: 'realtime', tags: ['notifications', 'alerts'] },
  ];

  const categories = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'monitoring', label: 'Monitoring', icon: '👁️' },
    { id: 'analysis', label: 'Analysis', icon: '🔍' },
    { id: 'execution', label: 'Execution', icon: '⚡' },
    { id: 'risk_management', label: 'Risk', icon: '🛡️' },
    { id: 'strategy', label: 'Strategy', icon: '🎯' },
    { id: 'notification', label: 'Notify', icon: '🔔' },
  ];

  const filteredTasks = selectedCategory === 'all' ? tasks : tasks.filter(t => t.category === selectedCategory);
  const priorityColors: Record<string, string> = { critical: 'bg-red-500/20 text-red-400 border-red-500/40', high: 'bg-orange-500/20 text-orange-400 border-orange-500/40', medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40', low: 'bg-gray-500/20 text-gray-400 border-gray-500/40' };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div><h2 className="text-sm font-bold text-white flex items-center gap-1.5"><span>📚</span>Prompt Library</h2><p className="text-[9px] text-gray-500">{tasks.length} tasks across {categories.length - 1} categories</p></div>
      </div>
      <div className="flex gap-1 overflow-x-auto pb-1 custom-scrollbar">
        {categories.map((cat) => (<button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex-shrink-0 px-2 py-1 rounded text-[9px] font-medium ${selectedCategory === cat.id ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-gray-800/30 text-gray-400 border border-gray-700/30'}`}><span className="mr-0.5">{cat.icon}</span>{cat.label}</button>))}
      </div>
      <div className="grid grid-cols-1 gap-2 max-h-[280px] overflow-y-auto custom-scrollbar">
        {filteredTasks.map((task) => (<motion.div key={task.id} layout onClick={() => setSelectedTask(task)} className="p-2.5 rounded-lg bg-gray-900/30 border border-gray-800/50 cursor-pointer hover:bg-gray-900/50 hover:border-purple-500/30"><div className="flex items-center gap-1.5 mb-1"><h3 className="text-[11px] font-bold text-white">{task.name}</h3><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /></div><p className="text-[9px] text-gray-400 mb-1.5">{task.desc}</p><div className="flex items-center gap-1.5 flex-wrap"><span className={`px-1.5 py-0.5 rounded text-[8px] font-medium border ${priorityColors[task.priority]}`}>{task.priority.toUpperCase()}</span><span className="px-1.5 py-0.5 rounded bg-gray-800/50 text-gray-400 text-[8px]">{task.frequency}</span>{task.tags.slice(0, 2).map(tag => <span key={tag} className="px-1 py-0.5 rounded bg-gray-800/30 text-gray-500 text-[8px]">#{tag}</span>)}</div></motion.div>))}
      </div>
      <AnimatePresence>{selectedTask && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedTask(null)}><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()} className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full p-4 space-y-3"><div className="flex items-start justify-between"><div><h2 className="text-lg font-bold text-white">{selectedTask.name}</h2><p className="text-xs text-gray-400">{selectedTask.desc}</p></div><button onClick={() => setSelectedTask(null)} className="text-gray-500 hover:text-gray-300">✕</button></div><div className="grid grid-cols-2 gap-2"><div className="p-2 rounded bg-gray-800/30"><div className="text-[8px] text-gray-500">Category</div><div className="text-[10px] text-white capitalize">{selectedTask.category.replace(/_/g, ' ')}</div></div><div className="p-2 rounded bg-gray-800/30"><div className="text-[8px] text-gray-500">Priority</div><div className={`text-[10px] font-bold capitalize ${selectedTask.priority === 'critical' ? 'text-red-400' : 'text-orange-400'}`}>{selectedTask.priority}</div></div></div><div><div className="text-[9px] text-gray-500 mb-1">Tags</div><div className="flex gap-1 flex-wrap">{selectedTask.tags.map((tag: string) => <span key={tag} className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[9px] border border-purple-500/20">#{tag}</span>)}</div></div></motion.div></motion.div>)}</AnimatePresence>
    </div>
  );
}
