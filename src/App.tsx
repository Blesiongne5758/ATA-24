import { useState, useEffect, useRef, useCallback } from 'react';

// ============ TYPES ============
interface Trade {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  entry: number;
  current: number;
  size: number;
  pnl: number;
  pnlPercent: number;
  agent: string;
  timestamp: Date;
  status: 'OPEN' | 'CLOSED';
  stopLoss: number;
  takeProfit: number;
}

interface LogEntry {
  id: string;
  time: Date;
  agent: string;
  type: 'signal' | 'trade' | 'risk' | 'system' | 'analysis';
  message: string;
  level: 'info' | 'success' | 'warning' | 'error';
}

interface Agent {
  name: string;
  icon: string;
  status: 'active' | 'analyzing' | 'idle';
  accuracy: number;
  trades: number;
  pnl: number;
  color: string;
}

interface MarketData {
  pair: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  history: number[];
}

// ============ CONSTANTS ============
const PAIRS = [
  { symbol: 'EUR/USD', base: 1.0850, volatility: 0.0008 },
  { symbol: 'GBP/USD', base: 1.2650, volatility: 0.0010 },
  { symbol: 'USD/JPY', base: 149.50, volatility: 0.08 },
  { symbol: 'BTC/USDT', base: 67500, volatility: 150 },
  { symbol: 'ETH/USDT', base: 3450, volatility: 12 },
  { symbol: 'XAU/USD', base: 2340, volatility: 3.5 },
  { symbol: 'AAPL', base: 189.50, volatility: 0.8 },
  { symbol: 'TSLA', base: 245.00, volatility: 3.2 },
];

const AGENTS: Agent[] = [
  { name: 'Trend Agent', icon: '📈', status: 'active', accuracy: 72.5, trades: 145, pnl: 12450.80, color: 'from-green-500 to-emerald-500' },
  { name: 'Mean Revert', icon: '🔄', status: 'analyzing', accuracy: 68.3, trades: 98, pnl: 8320.50, color: 'from-blue-500 to-cyan-500' },
  { name: 'Scalp Agent', icon: '⚡', status: 'active', accuracy: 65.8, trades: 312, pnl: 5680.25, color: 'from-yellow-500 to-orange-500' },
  { name: 'News Agent', icon: '📰', status: 'idle', accuracy: 71.2, trades: 67, pnl: 9870.00, color: 'from-purple-500 to-pink-500' },
  { name: 'Sentiment AI', icon: '💬', status: 'analyzing', accuracy: 69.7, trades: 89, pnl: 7230.40, color: 'from-pink-500 to-rose-500' },
  { name: 'Risk Manager', icon: '🛡️', status: 'active', accuracy: 95.0, trades: 0, pnl: 0, color: 'from-red-500 to-orange-500' },
];

const SIGNAL_MESSAGES = [
  'Bullish divergence detected on RSI(14)',
  'MACD crossover confirmed - signal line crossed',
  'Price approaching key support at {level}',
  'Volume spike detected - 3x average',
  'Bollinger Band squeeze - breakout imminent',
  'Fibonacci 61.8% retracement holding',
  'Moving average golden cross forming',
  'Overbought condition on Stochastic(14,3,3)',
  'Head & Shoulders pattern identified',
  'Ichimoku cloud breakout confirmed',
  'VWAP deviation > 2σ - mean reversion signal',
  'Order flow imbalance detected - institutional buying',
  'Correlation breakdown with SPX - relative value opportunity',
  'Volatility compression - ATR at 30-day low',
  'Momentum shift detected - ADX rising above 25',
];

const NEWS_MESSAGES = [
  'Fed minutes suggest hawkish stance - USD strengthening',
  'ECB rate decision upcoming - EUR volatility expected',
  'US NFP data released - better than expected',
  'China PMI data disappoints - risk-off sentiment',
  'Oil inventory draw larger than expected',
  'Bitcoin ETF inflows hit new record',
  'Tesla earnings beat expectations by 15%',
  'Gold reaches all-time high on geopolitical tensions',
];

// ============ HELPERS ============
function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function formatNumber(n: number, decimals = 2) {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function formatTime(d: Date) {
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// ============ MAIN APP ============
export default function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [balance, setBalance] = useState(100000);
  const [equity, setEquity] = useState(100000);
  const [totalPnl, setTotalPnl] = useState(0);
  const [totalTrades, setTotalTrades] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [maxDrawdown, setMaxDrawdown] = useState(0);
  const [peakEquity, setPeakEquity] = useState(100000);
  const [sharpeRatio, setSharpeRatio] = useState(0);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [tickCount, setTickCount] = useState(0);
  const [uptime, setUptime] = useState(0);
  const [riskLevel, setRiskLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
  const [chartData, setChartData] = useState<number[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize market data
  useEffect(() => {
    const initial = PAIRS.map(p => ({
      pair: p.symbol,
      price: p.base,
      change: 0,
      changePercent: 0,
      volume: Math.floor(randomBetween(10000, 500000)),
      high: p.base * 1.002,
      low: p.base * 0.998,
      history: Array.from({ length: 50 }, () => p.base + (Math.random() - 0.5) * p.volatility * 10),
    }));
    setMarketData(initial);
    setChartData(Array.from({ length: 100 }, () => 100000 + (Math.random() - 0.48) * 500));
  }, []);

  const addLog = useCallback((agent: string, type: LogEntry['type'], message: string, level: LogEntry['level'] = 'info') => {
    setLogs(prev => [{
      id: generateId(),
      time: new Date(),
      agent,
      type,
      message,
      level,
    }, ...prev].slice(0, 200));
  }, []);

  const openTrade = useCallback((pair: string, type: 'BUY' | 'SELL', agent: string) => {
    const pairData = PAIRS.find(p => p.symbol === pair);
    if (!pairData) return;

    const price = pairData.base + (Math.random() - 0.5) * pairData.volatility * 2;
    const size = randomBetween(0.01, 0.5);
    const slDistance = pairData.volatility * randomBetween(15, 30);
    const tpDistance = pairData.volatility * randomBetween(30, 60);

    const trade: Trade = {
      id: generateId(),
      pair,
      type,
      entry: price,
      current: price,
      size,
      pnl: 0,
      pnlPercent: 0,
      agent,
      timestamp: new Date(),
      status: 'OPEN',
      stopLoss: type === 'BUY' ? price - slDistance : price + slDistance,
      takeProfit: type === 'BUY' ? price + tpDistance : price - tpDistance,
    };

    setTrades(prev => [trade, ...prev]);
    setTotalTrades(prev => prev + 1);
    addLog(agent, 'trade', `${type} ${pair} @ ${formatNumber(price, pair.includes('JPY') ? 3 : 5)} | Size: ${size.toFixed(2)} lots`, 'success');
  }, [addLog]);

  const closeTrade = useCallback((tradeId: string) => {
    setTrades(prev => prev.map(t => {
      if (t.id === tradeId && t.status === 'OPEN') {
        const isWin = t.pnl > 0;
        if (isWin) setWins(w => w + 1);
        else setLosses(l => l + 1);
        setBalance(b => b + t.pnl);
        setTotalPnl(p => p + t.pnl);
        addLog(t.agent, 'trade', `CLOSED ${t.type} ${t.pair} | PnL: ${t.pnl >= 0 ? '+' : ''}$${formatNumber(t.pnl)} (${t.pnlPercent >= 0 ? '+' : ''}${formatNumber(t.pnlPercent)}%)`, t.pnl >= 0 ? 'success' : 'warning');
        return { ...t, status: 'CLOSED' as const };
      }
      return t;
    }));
  }, [addLog]);

  // Main simulation loop
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTickCount(prev => prev + 1);
      setUptime(prev => prev + 1);

      // Update market data
      setMarketData(prev => prev.map((md, i) => {
        const pairConfig = PAIRS[i];
        const change = (Math.random() - 0.48) * pairConfig.volatility;
        const newPrice = md.price + change;
        const newHistory = [...md.history.slice(1), newPrice];
        return {
          ...md,
          price: newPrice,
          change: newPrice - pairConfig.base,
          changePercent: ((newPrice - pairConfig.base) / pairConfig.base) * 100,
          high: Math.max(md.high, newPrice),
          low: Math.min(md.low, newPrice),
          volume: md.volume + Math.floor(randomBetween(100, 5000)),
          history: newHistory,
        };
      }));

      // Update open trades
      setTrades(prev => prev.map(t => {
        if (t.status !== 'OPEN') return t;
        const md = PAIRS.find(p => p.symbol === t.pair);
        if (!md) return t;
        const currentPrice = md.base + (Math.random() - 0.5) * md.volatility * 2;
        const direction = t.type === 'BUY' ? 1 : -1;
        const pnl = (currentPrice - t.entry) * direction * t.size * 100000;
        const pnlPercent = ((currentPrice - t.entry) / t.entry) * direction * 100;

        // Check SL/TP
        if ((t.type === 'BUY' && currentPrice <= t.stopLoss) || (t.type === 'SELL' && currentPrice >= t.stopLoss)) {
          setTimeout(() => closeTrade(t.id), 0);
        }
        if ((t.type === 'BUY' && currentPrice >= t.takeProfit) || (t.type === 'SELL' && currentPrice <= t.takeProfit)) {
          setTimeout(() => closeTrade(t.id), 0);
        }

        return { ...t, current: currentPrice, pnl, pnlPercent };
      }));

      // Random agent actions
      if (Math.random() < 0.3) {
        const agentIdx = Math.floor(Math.random() * (AGENTS.length - 1));
        const agent = AGENTS[agentIdx];
        const pairIdx = Math.floor(Math.random() * PAIRS.length);
        const pair = PAIRS[pairIdx].symbol;
        const type = Math.random() > 0.5 ? 'BUY' : 'SELL';
        
        if (Math.random() < 0.4) {
          openTrade(pair, type, agent.name);
        }
      }

      // Random signals
      if (Math.random() < 0.5) {
        const agent = AGENTS[Math.floor(Math.random() * (AGENTS.length - 1))];
        const msg = SIGNAL_MESSAGES[Math.floor(Math.random() * SIGNAL_MESSAGES.length)];
        addLog(agent.name, 'signal', msg, 'info');
      }

      // Random news
      if (Math.random() < 0.1) {
        const news = NEWS_MESSAGES[Math.floor(Math.random() * NEWS_MESSAGES.length)];
        addLog('News Agent', 'analysis', news, 'warning');
      }

      // System logs
      if (Math.random() < 0.15) {
        addLog('System', 'system', `Heartbeat OK | Latency: ${Math.floor(randomBetween(1, 15))}ms | CPU: ${Math.floor(randomBetween(20, 65))}%`, 'info');
      }

      // Risk assessment
      if (Math.random() < 0.08) {
        const risk = Math.random();
        if (risk < 0.3) setRiskLevel('HIGH');
        else if (risk < 0.6) setRiskLevel('MEDIUM');
        else setRiskLevel('LOW');
        addLog('Risk Manager', 'risk', `Portfolio risk level: ${risk < 0.3 ? 'HIGH' : risk < 0.6 ? 'MEDIUM' : 'LOW'} | VaR(95%): $${formatNumber(randomBetween(500, 3000))}`, risk < 0.3 ? 'error' : risk < 0.6 ? 'warning' : 'info');
      }

      // Update agents
      setAgents(prev => prev.map((a, i) => {
        if (i === AGENTS.length - 1) return a; // Risk Manager stays active
        const statuses: Agent['status'][] = ['active', 'analyzing', 'idle'];
        const newStatus = statuses[Math.floor(Math.random() * 3)];
        return {
          ...a,
          status: newStatus,
          accuracy: Math.max(50, Math.min(95, a.accuracy + (Math.random() - 0.5) * 0.5)),
          pnl: a.pnl + (Math.random() - 0.45) * 50,
        };
      }));

      // Update equity
      setEquity(prev => {
        const newEquity = prev + (Math.random() - 0.47) * 100;
        setPeakEquity(currentPeak => {
          const newPeak = Math.max(currentPeak, newEquity);
          const dd = ((newPeak - newEquity) / newPeak) * 100;
          setMaxDrawdown(currentDD => Math.max(currentDD, dd));
          return newPeak;
        });
        return newEquity;
      });

      // Update chart
      setChartData(prev => {
        const last = prev[prev.length - 1];
        const newPoint = last + (Math.random() - 0.48) * 200;
        return [...prev.slice(1), newPoint];
      });

      // Update sharpe
      setSharpeRatio(prev => Math.max(0.5, Math.min(3.5, prev + (Math.random() - 0.5) * 0.05)));



    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, addLog, openTrade, closeTrade]);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [logs]);

  // Calculate win rate from wins/losses
  useEffect(() => {
    const total = wins + losses;
    if (total > 0) {
      setWinRate((wins / total) * 100);
    }
  }, [wins, losses]);

  const openPositions = trades.filter(t => t.status === 'OPEN');
  const closedPositions = trades.filter(t => t.status === 'CLOSED');
  const totalOpenPnl = openPositions.reduce((sum, t) => sum + t.pnl, 0);

  return (
    <div className="min-h-screen bg-[#060a14] text-white font-mono">
      {/* Header */}
      <header className="bg-[#0a0e1a] border-b border-cyan-900/30 px-4 py-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black shadow-lg ${isRunning ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30 animate-pulse' : 'bg-gradient-to-br from-gray-600 to-gray-700'}`}>
              🤖
            </div>
            <div>
              <h1 className="text-lg font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                PJ.BOT AI Trading Agent
              </h1>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase">
                Quantum Neural Trading System v4.0 | Uptime: {Math.floor(uptime / 60)}:{String(uptime % 60).padStart(2, '0')} | Ticks: {tickCount.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${isRunning ? 'bg-green-500/10 text-green-400 border-green-500/30 animate-pulse' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
              {isRunning ? '● LIVE TRADING' : '○ STOPPED'}
            </div>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${isRunning ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'}`}
            >
              {isRunning ? '⏹ STOP' : '▶ START AGENT'}
            </button>
          </div>
        </div>
      </header>

      <div className="p-3 md:p-4 space-y-4">
        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          <StatCard label="Balance" value={`$${formatNumber(balance)}`} color="text-cyan-300" />
          <StatCard label="Equity" value={`$${formatNumber(equity)}`} color="text-blue-300" />
          <StatCard label="Total PnL" value={`${totalPnl >= 0 ? '+' : ''}$${formatNumber(totalPnl)}`} color={totalPnl >= 0 ? 'text-green-400' : 'text-red-400'} />
          <StatCard label="Open PnL" value={`${totalOpenPnl >= 0 ? '+' : ''}$${formatNumber(totalOpenPnl)}`} color={totalOpenPnl >= 0 ? 'text-green-400' : 'text-red-400'} />
          <StatCard label="Win Rate" value={`${formatNumber(winRate, 1)}%`} color="text-purple-300" />
          <StatCard label="Sharpe" value={formatNumber(sharpeRatio, 2)} color="text-yellow-300" />
          <StatCard label="Max DD" value={`${formatNumber(maxDrawdown, 2)}%`} color="text-orange-300" />
          <StatCard label="Risk" value={riskLevel} color={riskLevel === 'LOW' ? 'text-green-400' : riskLevel === 'MEDIUM' ? 'text-yellow-400' : 'text-red-400'} />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Chart & Market */}
          <div className="lg:col-span-2 space-y-4">
            {/* Equity Chart */}
            <div className="bg-[#0d1220] rounded-xl border border-gray-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">📊 Equity Curve</h3>
                <span className="text-xs text-gray-500">Real-time P&L</span>
              </div>
              <EquityChart data={chartData} />
            </div>

            {/* Market Data */}
            <div className="bg-[#0d1220] rounded-xl border border-gray-800 p-4">
              <h3 className="text-sm font-bold text-white mb-3">🌐 Live Market Data</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {marketData.map((md, i) => (
                  <div key={i} className="bg-[#111827] rounded-lg p-3 border border-gray-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{md.pair}</span>
                      <span className={`text-[10px] ${md.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {md.changePercent >= 0 ? '▲' : '▼'} {Math.abs(md.changePercent).toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white">
                      {formatNumber(md.price, md.pair.includes('JPY') ? 2 : md.pair.includes('BTC') ? 0 : 5)}
                    </div>
                    <MiniChart data={md.history} positive={md.changePercent >= 0} />
                  </div>
                ))}
              </div>
            </div>

            {/* Open Positions */}
            <div className="bg-[#0d1220] rounded-xl border border-gray-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">💼 Open Positions ({openPositions.length})</h3>
                <span className="text-xs text-gray-500">Total: {totalOpenPnl >= 0 ? '+' : ''}${formatNumber(totalOpenPnl)}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500 border-b border-gray-800">
                      <th className="text-left py-2 px-2">Pair</th>
                      <th className="text-left py-2 px-2">Type</th>
                      <th className="text-right py-2 px-2">Entry</th>
                      <th className="text-right py-2 px-2">Current</th>
                      <th className="text-right py-2 px-2">Size</th>
                      <th className="text-right py-2 px-2">PnL</th>
                      <th className="text-left py-2 px-2">Agent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openPositions.slice(0, 10).map(t => (
                      <tr key={t.id} className="border-b border-gray-800/50 hover:bg-white/5">
                        <td className="py-2 px-2 font-bold text-white">{t.pair}</td>
                        <td className="py-2 px-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${t.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-right text-gray-300">{formatNumber(t.entry, 5)}</td>
                        <td className="py-2 px-2 text-right text-white">{formatNumber(t.current, 5)}</td>
                        <td className="py-2 px-2 text-right text-gray-300">{t.size.toFixed(2)}</td>
                        <td className={`py-2 px-2 text-right font-bold ${t.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {t.pnl >= 0 ? '+' : ''}${formatNumber(t.pnl)}
                        </td>
                        <td className="py-2 px-2 text-gray-400">{t.agent}</td>
                      </tr>
                    ))}
                    {openPositions.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-600">
                          {isRunning ? '⏳ Waiting for signals...' : '▶ Start agent to begin trading'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Agents & Logs */}
          <div className="space-y-4">
            {/* Multi-Agent Status */}
            <div className="bg-[#0d1220] rounded-xl border border-gray-800 p-4">
              <h3 className="text-sm font-bold text-white mb-3">🤝 Multi-Agent System</h3>
              <div className="space-y-2">
                {agents.map((agent, i) => (
                  <div key={i} className="bg-[#111827] rounded-lg p-3 border border-gray-800">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{agent.icon}</span>
                        <span className="text-xs font-bold text-white">{agent.name}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        agent.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        agent.status === 'analyzing' ? 'bg-yellow-500/20 text-yellow-400 animate-pulse' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {agent.status === 'active' ? '● Active' : agent.status === 'analyzing' ? '◐ Analyzing' : '○ Idle'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-500">
                      <span>Acc: {formatNumber(agent.accuracy, 1)}%</span>
                      <span>Trades: {agent.trades}</span>
                      <span className={agent.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {agent.pnl >= 0 ? '+' : ''}${formatNumber(agent.pnl)}
                      </span>
                    </div>
                    <div className="mt-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${agent.color} rounded-full transition-all duration-500`} style={{ width: `${agent.accuracy}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-[#0d1220] rounded-xl border border-gray-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">📋 Activity Log</h3>
                <span className="text-[10px] text-gray-500">{logs.length} entries</span>
              </div>
              <div ref={logContainerRef} className="h-80 overflow-y-auto space-y-1 scrollbar-thin">
                {logs.map(log => (
                  <div key={log.id} className="flex items-start gap-2 text-[10px] py-1 border-b border-gray-800/30">
                    <span className="text-gray-600 shrink-0">{formatTime(log.time)}</span>
                    <span className={`shrink-0 px-1 rounded ${
                      log.level === 'success' ? 'bg-green-500/20 text-green-400' :
                      log.level === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                      log.level === 'error' ? 'bg-red-500/20 text-red-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {log.agent}
                    </span>
                    <span className="text-gray-400">{log.message}</span>
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-center text-gray-600 py-8 text-xs">
                    {isRunning ? 'Monitoring activity...' : 'Start agent to see logs'}
                  </div>
                )}
              </div>
            </div>

            {/* Trade History */}
            <div className="bg-[#0d1220] rounded-xl border border-gray-800 p-4">
              <h3 className="text-sm font-bold text-white mb-3">📜 Trade History ({closedPositions.length})</h3>
              <div className="h-40 overflow-y-auto space-y-1 scrollbar-thin">
                {closedPositions.slice(0, 20).map(t => (
                  <div key={t.id} className="flex items-center justify-between text-[10px] py-1 border-b border-gray-800/30">
                    <div className="flex items-center gap-2">
                      <span className={`px-1 rounded ${t.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {t.type}
                      </span>
                      <span className="text-white font-bold">{t.pair}</span>
                    </div>
                    <span className={t.pnl >= 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                      {t.pnl >= 0 ? '+' : ''}${formatNumber(t.pnl)}
                    </span>
                  </div>
                ))}
                {closedPositions.length === 0 && (
                  <div className="text-center text-gray-600 py-4 text-xs">No closed trades yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ SUB COMPONENTS ============

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[#0d1220] rounded-lg border border-gray-800 p-3 text-center">
      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-sm font-bold ${color}`}>{value}</div>
    </div>
  );
}

function EquityChart({ data }: { data: number[] }) {
  if (data.length < 2) return <div className="h-32" />;
  
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 800;
  const height = 150;
  const padding = 10;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;
  const isPositive = data[data.length - 1] >= data[0];

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32 md:h-40">
        <defs>
          <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#equityGradient)" />
        <polyline points={points} fill="none" stroke={isPositive ? '#10b981' : '#ef4444'} strokeWidth="2" />
        {/* Current point */}
        <circle
          cx={padding + ((data.length - 1) / (data.length - 1)) * (width - padding * 2)}
          cy={height - padding - ((data[data.length - 1] - min) / range) * (height - padding * 2)}
          r="4"
          fill={isPositive ? '#10b981' : '#ef4444'}
          className="animate-pulse"
        />
      </svg>
      <div className="absolute top-2 right-2 text-xs">
        <span className={`font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          ${formatNumber(data[data.length - 1])}
        </span>
      </div>
    </div>
  );
}

function MiniChart({ data, positive }: { data: number[]; positive: boolean }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 20;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-5 mt-1">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? '#10b981' : '#ef4444'}
        strokeWidth="1.5"
        opacity="0.7"
      />
    </svg>
  );
}
