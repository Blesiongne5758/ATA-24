import { useState, useEffect, useRef, useCallback } from 'react';

type Tab = 'dashboard' | 'parameters' | 'connection' | 'chart' | 'stresstest' | 'aimodels' | 'terminal' | 'agents';
type TradingType = 'saham' | 'crypto' | 'forex' | 'komoditas';

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

const tradingTypes: { id: TradingType; label: string; icon: string; color: string; desc: string; pairs: string[] }[] = [
  { id: 'saham', label: 'Saham', icon: '📈', color: 'from-blue-500 to-cyan-500', desc: 'Stock Market Trading', pairs: ['AAPL', 'GOOGL', 'TSLA', 'AMZN', 'MSFT', 'NVDA'] },
  { id: 'crypto', label: 'Crypto', icon: '₿', color: 'from-orange-500 to-yellow-500', desc: 'Cryptocurrency Trading', pairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT'] },
  { id: 'forex', label: 'Forex', icon: '💱', color: 'from-green-500 to-emerald-500', desc: 'Foreign Exchange', pairs: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CHF'] },
  { id: 'komoditas', label: 'Komoditas', icon: '🪙', color: 'from-purple-500 to-pink-500', desc: 'Commodities Trading', pairs: ['XAU/USD', 'XAG/USD', 'WTI/USD', 'BRENT', 'NATGAS'] },
];

const PAIRS_CONFIG: Record<string, { base: number; volatility: number }> = {
  'EUR/USD': { base: 1.0850, volatility: 0.0008 },
  'GBP/USD': { base: 1.2650, volatility: 0.0010 },
  'USD/JPY': { base: 149.50, volatility: 0.08 },
  'AUD/USD': { base: 0.6540, volatility: 0.0006 },
  'USD/CHF': { base: 0.8820, volatility: 0.0007 },
  'BTC/USDT': { base: 67500, volatility: 150 },
  'ETH/USDT': { base: 3450, volatility: 12 },
  'SOL/USDT': { base: 145, volatility: 2.5 },
  'BNB/USDT': { base: 580, volatility: 5 },
  'XRP/USDT': { base: 0.52, volatility: 0.008 },
  'AAPL': { base: 189.50, volatility: 0.8 },
  'GOOGL': { base: 141.20, volatility: 1.2 },
  'TSLA': { base: 245.00, volatility: 3.2 },
  'AMZN': { base: 178.50, volatility: 1.5 },
  'MSFT': { base: 415.00, volatility: 1.8 },
  'NVDA': { base: 875.00, volatility: 8.5 },
  'XAU/USD': { base: 2340, volatility: 3.5 },
  'XAG/USD': { base: 27.50, volatility: 0.15 },
  'WTI/USD': { base: 78.50, volatility: 0.5 },
  'BRENT': { base: 82.30, volatility: 0.55 },
  'NATGAS': { base: 2.15, volatility: 0.04 },
};

const AGENTS_DATA: Agent[] = [
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
  'Price approaching key support level',
  'Volume spike detected - 3x average',
  'Bollinger Band squeeze - breakout imminent',
  'Fibonacci 61.8% retracement holding',
  'Moving average golden cross forming',
  'Overbought condition on Stochastic(14,3,3)',
  'Head & Shoulders pattern identified',
  'Ichimoku cloud breakout confirmed',
  'VWAP deviation > 2σ - mean reversion signal',
  'Order flow imbalance detected - institutional buying',
  'Volatility compression - ATR at 30-day low',
  'Momentum shift detected - ADX rising above 25',
  'Neural network confidence > 85% - strong signal',
  'LSTM prediction: upward momentum next 5 bars',
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

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [tradingType, setTradingType] = useState<TradingType>('forex');
  const [mt5Connected, setMt5Connected] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);

  // Trading state
  const [balance, setBalance] = useState(100000);
  const [equity, setEquity] = useState(100000);
  const [totalPnl, setTotalPnl] = useState(0);
  const [totalTrades, setTotalTrades] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [maxDrawdown, setMaxDrawdown] = useState(0);
  const [peakEquity, setPeakEquity] = useState(100000);
  const [sharpeRatio, setSharpeRatio] = useState(1.85);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [agents, setAgents] = useState<Agent[]>(AGENTS_DATA);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [tickCount, setTickCount] = useState(0);
  const [uptime, setUptime] = useState(0);
  const [riskLevel, setRiskLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
  const [chartData, setChartData] = useState<number[]>([]);
  const [terminalLines, setTerminalLines] = useState<string[]>([
    '$ pjbot --init',
    '[OK] Loading AI Trading Agent v4.0.0...',
    '[OK] Neural network models loaded (6 models)',
    '[OK] Risk management module initialized',
    '[OK] Multi-agent system ready (6 agents)',
    '$ _',
  ]);

  // Parameters state
  const [params, setParams] = useState({
    riskPerTrade: 2,
    maxPositions: 5,
    slMultiplier: 2.0,
    tpMultiplier: 3.0,
    trailingStop: true,
    maxDrawdown: 10,
    lotSize: 0.1,
    magicNumber: 234000,
    timeframe: 'M15',
    aiConfidence: 75,
  });

  const logContainerRef = useRef<HTMLDivElement>(null);

  // Initialize market data
  useEffect(() => {
    const currentPairs = tradingTypes.find(t => t.id === tradingType)?.pairs || [];
    const initial = currentPairs.map(symbol => {
      const config = PAIRS_CONFIG[symbol] || { base: 100, volatility: 1 };
      return {
        pair: symbol,
        price: config.base,
        change: 0,
        changePercent: 0,
        volume: Math.floor(randomBetween(10000, 500000)),
        high: config.base * 1.002,
        low: config.base * 0.998,
        history: Array.from({ length: 50 }, () => config.base + (Math.random() - 0.5) * config.volatility * 10),
      };
    });
    setMarketData(initial);
    setChartData(Array.from({ length: 100 }, () => 100000 + (Math.random() - 0.48) * 500));
  }, [tradingType]);

  // Calculate win rate
  useEffect(() => {
    const total = wins + losses;
    if (total > 0) setWinRate((wins / total) * 100);
  }, [wins, losses]);

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
    const config = PAIRS_CONFIG[pair];
    if (!config) return;

    const price = config.base + (Math.random() - 0.5) * config.volatility * 2;
    const size = params.lotSize;
    const slDistance = config.volatility * params.slMultiplier * 10;
    const tpDistance = config.volatility * params.tpMultiplier * 10;

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
    const decimals = pair.includes('JPY') ? 3 : pair.includes('BTC') ? 0 : 5;
    addLog(agent, 'trade', `${type} ${pair} @ ${formatNumber(price, decimals)} | Size: ${size.toFixed(2)} lots`, 'success');
  }, [addLog, params.lotSize, params.slMultiplier, params.tpMultiplier]);

  const closeTrade = useCallback((tradeId: string) => {
    setTrades(prev => prev.map(t => {
      if (t.id === tradeId && t.status === 'OPEN') {
        const isWin = t.pnl > 0;
        if (isWin) setWins(w => w + 1);
        else setLosses(l => l + 1);
        setBalance(b => b + t.pnl);
        setTotalPnl(p => p + t.pnl);
        addLog(t.agent, 'trade', `CLOSED ${t.type} ${t.pair} | PnL: ${t.pnl >= 0 ? '+' : ''}$${formatNumber(t.pnl)}`, t.pnl >= 0 ? 'success' : 'warning');
        return { ...t, status: 'CLOSED' as const };
      }
      return t;
    }));
  }, [addLog]);

  // Main simulation loop
  useEffect(() => {
    if (!isAgentActive) return;

    const interval = setInterval(() => {
      setTickCount(prev => prev + 1);
      setUptime(prev => prev + 1);

      // Update market data
      setMarketData(prev => prev.map(md => {
        const config = PAIRS_CONFIG[md.pair];
        if (!config) return md;
        const change = (Math.random() - 0.48) * config.volatility;
        const newPrice = md.price + change;
        const newHistory = [...md.history.slice(1), newPrice];
        return {
          ...md,
          price: newPrice,
          change: newPrice - config.base,
          changePercent: ((newPrice - config.base) / config.base) * 100,
          high: Math.max(md.high, newPrice),
          low: Math.min(md.low, newPrice),
          volume: md.volume + Math.floor(randomBetween(100, 5000)),
          history: newHistory,
        };
      }));

      // Update open trades
      setTrades(prev => prev.map(t => {
        if (t.status !== 'OPEN') return t;
        const config = PAIRS_CONFIG[t.pair];
        if (!config) return t;
        const currentPrice = config.base + (Math.random() - 0.5) * config.volatility * 2;
        const direction = t.type === 'BUY' ? 1 : -1;
        const pnl = (currentPrice - t.entry) * direction * t.size * 100000;
        const pnlPercent = ((currentPrice - t.entry) / t.entry) * direction * 100;

        if ((t.type === 'BUY' && currentPrice <= t.stopLoss) || (t.type === 'SELL' && currentPrice >= t.stopLoss)) {
          setTimeout(() => closeTrade(t.id), 0);
        }
        if ((t.type === 'BUY' && currentPrice >= t.takeProfit) || (t.type === 'SELL' && currentPrice <= t.takeProfit)) {
          setTimeout(() => closeTrade(t.id), 0);
        }

        return { ...t, current: currentPrice, pnl, pnlPercent };
      }));

      // Random agent actions
      if (Math.random() < 0.25) {
        const currentPairs = tradingTypes.find(t => t.id === tradingType)?.pairs || [];
        const agentIdx = Math.floor(Math.random() * (AGENTS_DATA.length - 1));
        const agent = AGENTS_DATA[agentIdx];
        const pair = currentPairs[Math.floor(Math.random() * currentPairs.length)];
        const type = Math.random() > 0.5 ? 'BUY' : 'SELL';
        const openCount = trades.filter(t => t.status === 'OPEN').length;

        if (Math.random() < 0.35 && openCount < params.maxPositions && pair) {
          openTrade(pair, type, agent.name);
        }
      }

      // Random signals
      if (Math.random() < 0.4) {
        const agent = AGENTS_DATA[Math.floor(Math.random() * (AGENTS_DATA.length - 1))];
        const msg = SIGNAL_MESSAGES[Math.floor(Math.random() * SIGNAL_MESSAGES.length)];
        addLog(agent.name, 'signal', msg, 'info');
      }

      // Random news
      if (Math.random() < 0.08) {
        const news = NEWS_MESSAGES[Math.floor(Math.random() * NEWS_MESSAGES.length)];
        addLog('News Agent', 'analysis', news, 'warning');
      }

      // System logs
      if (Math.random() < 0.12) {
        addLog('System', 'system', `Heartbeat OK | Latency: ${Math.floor(randomBetween(1, 15))}ms | CPU: ${Math.floor(randomBetween(20, 65))}%`, 'info');
      }

      // Risk assessment
      if (Math.random() < 0.06) {
        const risk = Math.random();
        const newRisk = risk < 0.3 ? 'HIGH' as const : risk < 0.6 ? 'MEDIUM' as const : 'LOW' as const;
        setRiskLevel(newRisk);
        addLog('Risk Manager', 'risk', `Portfolio risk: ${newRisk} | VaR(95%): $${formatNumber(randomBetween(500, 3000))}`, newRisk === 'HIGH' ? 'error' : newRisk === 'MEDIUM' ? 'warning' : 'info');
      }

      // Update agents
      setAgents(prev => prev.map((a, i) => {
        if (i === AGENTS_DATA.length - 1) return a;
        const statuses: Agent['status'][] = ['active', 'analyzing', 'idle'];
        return {
          ...a,
          status: statuses[Math.floor(Math.random() * 3)],
          accuracy: Math.max(50, Math.min(95, a.accuracy + (Math.random() - 0.5) * 0.3)),
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
        return [...prev.slice(1), last + (Math.random() - 0.48) * 200];
      });

      // Update sharpe
      setSharpeRatio(prev => Math.max(0.5, Math.min(3.5, prev + (Math.random() - 0.5) * 0.02)));

      // Terminal updates
      if (Math.random() < 0.1) {
        const terminalMsgs = [
          `[${formatTime(new Date())}] Neural inference: ${Math.floor(randomBetween(5, 50))}ms`,
          `[${formatTime(new Date())}] Model accuracy: ${(randomBetween(65, 85)).toFixed(1)}%`,
          `[${formatTime(new Date())}] Signal strength: ${(randomBetween(0.5, 1.0)).toFixed(3)}`,
          `[${formatTime(new Date())}] Market regime: ${['trending', 'ranging', 'volatile'][Math.floor(Math.random() * 3)]}`,
        ];
        setTerminalLines(prev => [...prev.slice(-50), terminalMsgs[Math.floor(Math.random() * terminalMsgs.length)]]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAgentActive, addLog, openTrade, closeTrade, tradingType, params.maxPositions, trades]);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) logContainerRef.current.scrollTop = 0;
  }, [logs]);

  const currentTrading = tradingTypes.find(t => t.id === tradingType)!;
  const openPositions = trades.filter(t => t.status === 'OPEN');
  const closedPositions = trades.filter(t => t.status === 'CLOSED');
  const totalOpenPnl = openPositions.reduce((sum, t) => sum + t.pnl, 0);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '⬡' },
    { id: 'parameters', label: 'Parameters', icon: '◈' },
    { id: 'connection', label: 'Connection', icon: '◉' },
    { id: 'chart', label: 'Chart Screen', icon: '◇' },
    { id: 'stresstest', label: 'Stress Test', icon: '⚡' },
    { id: 'aimodels', label: 'AI Models', icon: '◊' },
    { id: 'terminal', label: 'Terminal', icon: '▣' },
    { id: 'agents', label: 'Multi-Agent', icon: '⬢' },
  ];

  return (
    <div className="min-h-screen bg-[#060a14] text-white font-mono cyber-grid flex flex-col overflow-hidden">
      {/* Top Bar */}
      <header className="glass-panel border-b border-cyan-900/20 px-4 py-2 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-black shadow-lg shadow-cyan-500/20">
            <span className="text-white">PJ</span>
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent neon-text">PJ.BOT</span>
              <span className="text-gray-400 font-normal text-xs ml-2">AI Trading Agent</span>
            </h1>
            <p className="text-[9px] text-gray-600 tracking-widest uppercase">PJ.BOT v4.0.0 | Quantum Neural Trading System | Uptime: {Math.floor(uptime / 60)}:{String(uptime % 60).padStart(2, '0')}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${isAgentActive ? 'bg-green-500/10 text-green-400 border-green-500/30 animate-pulse' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
            {isAgentActive ? '● LIVE' : '○ OFFLINE'}
          </div>
          <button
            onClick={() => setIsAgentActive(!isAgentActive)}
            className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-all ${isAgentActive ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'}`}
          >
            {isAgentActive ? '⏹ STOP' : '▶ START'}
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="glass-panel border-b border-cyan-900/20 px-2 py-1 flex gap-1 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Trading Type Selector */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto border-b border-gray-800/50">
        {tradingTypes.map(tt => (
          <button
            key={tt.id}
            onClick={() => setTradingType(tt.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-2 border ${
              tradingType === tt.id
                ? `bg-gradient-to-r ${tt.color} bg-opacity-20 border-white/20 text-white`
                : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:text-gray-300'
            }`}
          >
            <span>{tt.icon}</span>
            {tt.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'dashboard' && (
          <DashboardTab
            balance={balance} equity={equity} totalPnl={totalPnl} totalOpenPnl={totalOpenPnl}
            winRate={winRate} sharpeRatio={sharpeRatio} maxDrawdown={maxDrawdown} riskLevel={riskLevel}
            totalTrades={totalTrades} chartData={chartData} marketData={marketData}
            openPositions={openPositions} logs={logs} agents={agents}
            closedPositions={closedPositions} logContainerRef={logContainerRef}
            isAgentActive={isAgentActive} tickCount={tickCount}
          />
        )}
        {activeTab === 'parameters' && (
          <ParametersTab params={params} setParams={setParams} />
        )}
        {activeTab === 'connection' && (
          <ConnectionTab
            mt5Connected={mt5Connected} setMt5Connected={setMt5Connected}
            wsConnected={wsConnected} setWsConnected={setWsConnected}
            apiConnected={apiConnected} setApiConnected={setApiConnected}
            isAgentActive={isAgentActive}
          />
        )}
        {activeTab === 'chart' && (
          <ChartTab marketData={marketData} isAgentActive={isAgentActive} />
        )}
        {activeTab === 'stresstest' && (
          <StressTestTab isAgentActive={isAgentActive} totalPnl={totalPnl} maxDrawdown={maxDrawdown} />
        )}
        {activeTab === 'aimodels' && (
          <AIModelsTab isAgentActive={isAgentActive} />
        )}
        {activeTab === 'terminal' && (
          <TerminalTab terminalLines={terminalLines} isAgentActive={isAgentActive} setTerminalLines={setTerminalLines} />
        )}
        {activeTab === 'agents' && (
          <AgentsTab agents={agents} isAgentActive={isAgentActive} />
        )}
      </div>
    </div>
  );
}

// ============ DASHBOARD TAB ============
function DashboardTab({ balance, equity, totalPnl, totalOpenPnl, winRate, sharpeRatio, maxDrawdown, riskLevel, totalTrades, chartData, marketData, openPositions, logs, agents, closedPositions, logContainerRef, isAgentActive, tickCount }: any) {
  return (
    <>
      {/* Stats Row */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Equity Chart */}
          <div className="glass-panel rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">📊 Equity Curve</h3>
              <span className="text-[10px] text-gray-500">Ticks: {tickCount.toLocaleString()}</span>
            </div>
            <EquityChart data={chartData} />
          </div>

          {/* Market Data */}
          <div className="glass-panel rounded-xl p-4">
            <h3 className="text-sm font-bold text-white mb-3">🌐 Live Market Data</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {marketData.map((md: MarketData, i: number) => (
                <div key={i} className="bg-[#111827] rounded-lg p-3 border border-gray-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-white">{md.pair}</span>
                    <span className={`text-[9px] ${md.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {md.changePercent >= 0 ? '▲' : '▼'}{Math.abs(md.changePercent).toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white">
                    {formatNumber(md.price, md.pair.includes('JPY') ? 2 : md.pair.includes('BTC') ? 0 : md.price > 100 ? 2 : 5)}
                  </div>
                  <MiniChart data={md.history} positive={md.changePercent >= 0} />
                </div>
              ))}
            </div>
          </div>

          {/* Open Positions */}
          <div className="glass-panel rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">💼 Open Positions ({openPositions.length})</h3>
              <span className="text-[10px] text-gray-500">Total: {totalOpenPnl >= 0 ? '+' : ''}${formatNumber(totalOpenPnl)}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-800">
                    <th className="text-left py-2 px-1">Pair</th>
                    <th className="text-left py-2 px-1">Type</th>
                    <th className="text-right py-2 px-1">Entry</th>
                    <th className="text-right py-2 px-1">Current</th>
                    <th className="text-right py-2 px-1">PnL</th>
                    <th className="text-left py-2 px-1">Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {openPositions.slice(0, 8).map((t: Trade) => (
                    <tr key={t.id} className="border-b border-gray-800/50 hover:bg-white/5">
                      <td className="py-1.5 px-1 font-bold text-white">{t.pair}</td>
                      <td className="py-1.5 px-1">
                        <span className={`px-1 rounded ${t.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{t.type}</span>
                      </td>
                      <td className="py-1.5 px-1 text-right text-gray-300">{formatNumber(t.entry, 5)}</td>
                      <td className="py-1.5 px-1 text-right text-white">{formatNumber(t.current, 5)}</td>
                      <td className={`py-1.5 px-1 text-right font-bold ${t.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {t.pnl >= 0 ? '+' : ''}${formatNumber(t.pnl)}
                      </td>
                      <td className="py-1.5 px-1 text-gray-400">{t.agent}</td>
                    </tr>
                  ))}
                  {openPositions.length === 0 && (
                    <tr><td colSpan={6} className="py-6 text-center text-gray-600">{isAgentActive ? '⏳ Waiting for signals...' : '▶ Start agent to begin trading'}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Agent Status */}
          <div className="glass-panel rounded-xl p-4">
            <h3 className="text-sm font-bold text-white mb-3">🤝 Multi-Agent Status</h3>
            <div className="space-y-2">
              {agents.slice(0, 5).map((agent: Agent, i: number) => (
                <div key={i} className="bg-[#111827] rounded-lg p-2 border border-gray-800">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{agent.icon}</span>
                      <span className="text-[10px] font-bold text-white">{agent.name}</span>
                    </div>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${
                      agent.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      agent.status === 'analyzing' ? 'bg-yellow-500/20 text-yellow-400 animate-pulse' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {agent.status === 'active' ? '●' : agent.status === 'analyzing' ? '◐' : '○'} {agent.status}
                    </span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${agent.color} rounded-full transition-all duration-500`} style={{ width: `${agent.accuracy}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="glass-panel rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white">📋 Activity Log</h3>
              <span className="text-[9px] text-gray-500">{logs.length}</span>
            </div>
            <div ref={logContainerRef} className="h-64 overflow-y-auto space-y-0.5 scrollbar-thin">
              {logs.map((log: LogEntry) => (
                <div key={log.id} className="flex items-start gap-1.5 text-[9px] py-0.5 border-b border-gray-800/30">
                  <span className="text-gray-600 shrink-0">{formatTime(log.time)}</span>
                  <span className={`shrink-0 px-1 rounded ${
                    log.level === 'success' ? 'bg-green-500/20 text-green-400' :
                    log.level === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                    log.level === 'error' ? 'bg-red-500/20 text-red-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>{log.agent}</span>
                  <span className="text-gray-400 truncate">{log.message}</span>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center text-gray-600 py-8 text-[10px]">{isAgentActive ? 'Monitoring...' : 'Start agent'}</div>
              )}
            </div>
          </div>

          {/* Trade History */}
          <div className="glass-panel rounded-xl p-4">
            <h3 className="text-sm font-bold text-white mb-2">📜 History ({closedPositions.length})</h3>
            <div className="h-32 overflow-y-auto space-y-0.5 scrollbar-thin">
              {closedPositions.slice(0, 15).map((t: Trade) => (
                <div key={t.id} className="flex items-center justify-between text-[9px] py-0.5 border-b border-gray-800/30">
                  <div className="flex items-center gap-1">
                    <span className={`px-1 rounded ${t.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{t.type}</span>
                    <span className="text-white font-bold">{t.pair}</span>
                  </div>
                  <span className={t.pnl >= 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                    {t.pnl >= 0 ? '+' : ''}${formatNumber(t.pnl)}
                  </span>
                </div>
              ))}
              {closedPositions.length === 0 && <div className="text-center text-gray-600 py-4 text-[10px]">No trades yet</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ============ PARAMETERS TAB ============
function ParametersTab({ params, setParams }: { params: any; setParams: any }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-white">◈ Trading Parameters</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ParamInput label="Risk Per Trade (%)" value={params.riskPerTrade} onChange={(v: number) => setParams({ ...params, riskPerTrade: v })} min={0.5} max={10} step={0.5} />
        <ParamInput label="Max Positions" value={params.maxPositions} onChange={(v: number) => setParams({ ...params, maxPositions: v })} min={1} max={20} step={1} />
        <ParamInput label="SL Multiplier (ATR)" value={params.slMultiplier} onChange={(v: number) => setParams({ ...params, slMultiplier: v })} min={0.5} max={5} step={0.5} />
        <ParamInput label="TP Multiplier (ATR)" value={params.tpMultiplier} onChange={(v: number) => setParams({ ...params, tpMultiplier: v })} min={1} max={10} step={0.5} />
        <ParamInput label="Lot Size" value={params.lotSize} onChange={(v: number) => setParams({ ...params, lotSize: v })} min={0.01} max={10} step={0.01} />
        <ParamInput label="Max Drawdown (%)" value={params.maxDrawdown} onChange={(v: number) => setParams({ ...params, maxDrawdown: v })} min={5} max={50} step={1} />
        <ParamInput label="AI Confidence Threshold (%)" value={params.aiConfidence} onChange={(v: number) => setParams({ ...params, aiConfidence: v })} min={50} max={95} step={5} />
        <ParamInput label="Magic Number" value={params.magicNumber} onChange={(v: number) => setParams({ ...params, magicNumber: v })} min={100000} max={999999} step={1} />
        <div className="glass-panel rounded-xl p-4">
          <label className="text-xs text-gray-400 block mb-2">Timeframe</label>
          <select value={params.timeframe} onChange={(e) => setParams({ ...params, timeframe: e.target.value })} className="w-full bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
            {['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1'].map(tf => (
              <option key={tf} value={tf}>{tf}</option>
            ))}
          </select>
        </div>
        <div className="glass-panel rounded-xl p-4 flex items-center justify-between">
          <div>
            <label className="text-xs text-gray-400 block">Trailing Stop</label>
            <span className="text-sm text-white">{params.trailingStop ? 'Enabled' : 'Disabled'}</span>
          </div>
          <button onClick={() => setParams({ ...params, trailingStop: !params.trailingStop })} className={`w-12 h-6 rounded-full transition-all ${params.trailingStop ? 'bg-green-500' : 'bg-gray-700'}`}>
            <div className={`w-5 h-5 rounded-full bg-white transition-all ${params.trailingStop ? 'translate-x-6' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ParamInput({ label, value, onChange, min, max, step }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number }) {
  return (
    <div className="glass-panel rounded-xl p-4">
      <label className="text-xs text-gray-400 block mb-2">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} min={min} max={max} step={step} className="w-full bg-[#111827] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
    </div>
  );
}

// ============ CONNECTION TAB ============
function ConnectionTab({ mt5Connected, setMt5Connected, wsConnected, setWsConnected, apiConnected, setApiConnected, isAgentActive }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-white">◉ Connection Manager</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ConnectionCard name="MetaTrader 5" icon="📊" connected={mt5Connected} onToggle={() => setMt5Connected(!mt5Connected)} details={['Server: ICMarkets-Live', 'Login: 50124789', 'Balance: $100,000.00']} />
        <ConnectionCard name="WebSocket Feed" icon="🔌" connected={wsConnected} onToggle={() => setWsConnected(!wsConnected)} details={['URL: wss://feed.pjbot.ai', 'Latency: 2ms', 'Pairs: 21 active']} />
        <ConnectionCard name="AI API Gateway" icon="🧠" connected={apiConnected} onToggle={() => setApiConnected(!apiConnected)} details={['Endpoint: api.pjbot.ai/v4', 'Models: 6 loaded', 'GPU: RTX 4090 (98% VRAM)']} />
      </div>
      <div className="glass-panel rounded-xl p-4">
        <h3 className="text-sm font-bold text-white mb-3">Connection Status</h3>
        <div className="space-y-2">
          {[
            { name: 'MetaTrader 5', status: mt5Connected, latency: '2ms' },
            { name: 'WebSocket Feed', status: wsConnected, latency: '1ms' },
            { name: 'AI API Gateway', status: apiConnected, latency: '5ms' },
            { name: 'Database (TimescaleDB)', status: true, latency: '3ms' },
            { name: 'Redis Cache', status: true, latency: '<1ms' },
          ].map((conn, i) => (
            <div key={i} className="flex items-center justify-between bg-[#111827] rounded-lg p-3 border border-gray-800">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${conn.status ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                <span className="text-sm text-white">{conn.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">{conn.latency}</span>
                <span className={`text-xs font-bold ${conn.status ? 'text-green-400' : 'text-red-400'}`}>{conn.status ? 'CONNECTED' : 'DISCONNECTED'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isAgentActive && (
        <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
          <p className="text-sm text-green-300">✅ All systems operational. Agent is actively trading with {mt5Connected && wsConnected && apiConnected ? 'full' : 'partial'} connectivity.</p>
        </div>
      )}
    </div>
  );
}

function ConnectionCard({ name, icon, connected, onToggle, details }: { name: string; icon: string; connected: boolean; onToggle: () => void; details: string[] }) {
  return (
    <div className={`glass-panel rounded-xl p-4 border ${connected ? 'border-green-500/30' : 'border-gray-800'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="text-sm font-bold text-white">{name}</span>
        </div>
        <span className={`w-3 h-3 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
      </div>
      <div className="space-y-1 mb-3">
        {details.map((d, i) => (
          <p key={i} className="text-[10px] text-gray-500">{d}</p>
        ))}
      </div>
      <button onClick={onToggle} className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${connected ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
        {connected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
}

// ============ CHART TAB ============
function ChartTab({ marketData, isAgentActive }: { marketData: MarketData[]; isAgentActive: boolean }) {
  const [selectedPair, setSelectedPair] = useState(0);
  const md = marketData[selectedPair];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white">◇ Chart Screen</h2>
        <div className="flex gap-1">
          {marketData.map((m, i) => (
            <button key={i} onClick={() => setSelectedPair(i)} className={`px-2 py-1 rounded text-[10px] ${i === selectedPair ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-gray-500 hover:text-white'}`}>
              {m.pair}
            </button>
          ))}
        </div>
      </div>
      {md && (
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">{md.pair}</h3>
              <p className="text-xs text-gray-500">{isAgentActive ? 'Live feed active' : 'Feed paused'}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-white">{formatNumber(md.price, md.pair.includes('JPY') ? 2 : md.price > 100 ? 2 : 5)}</p>
              <p className={`text-xs ${md.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {md.changePercent >= 0 ? '+' : ''}{formatNumber(md.changePercent)}% ({md.change >= 0 ? '+' : ''}{formatNumber(md.change, 5)})
              </p>
            </div>
          </div>
          <LargeChart data={md.history} positive={md.changePercent >= 0} />
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="text-center"><p className="text-[10px] text-gray-500">High</p><p className="text-xs font-bold text-green-400">{formatNumber(md.high, 5)}</p></div>
            <div className="text-center"><p className="text-[10px] text-gray-500">Low</p><p className="text-xs font-bold text-red-400">{formatNumber(md.low, 5)}</p></div>
            <div className="text-center"><p className="text-[10px] text-gray-500">Volume</p><p className="text-xs font-bold text-white">{md.volume.toLocaleString()}</p></div>
            <div className="text-center"><p className="text-[10px] text-gray-500">Spread</p><p className="text-xs font-bold text-yellow-400">{(randomBetween(0.5, 2.5)).toFixed(1)} pips</p></div>
          </div>
        </div>
      )}
    </div>
  );
}

function LargeChart({ data, positive }: { data: number[]; positive: boolean }) {
  if (data.length < 2) return <div className="h-64" />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 800;
  const height = 250;
  const padding = 20;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 md:h-64">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={positive ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={positive ? '#10b981' : '#ef4444'} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map(p => (
        <line key={p} x1={padding} y1={padding + p * (height - padding * 2)} x2={width - padding} y2={padding + p * (height - padding * 2)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}
      <polygon points={areaPoints} fill="url(#chartGrad)" />
      <polyline points={points} fill="none" stroke={positive ? '#10b981' : '#ef4444'} strokeWidth="2" />
      <circle cx={width - padding} cy={height - padding - ((data[data.length - 1] - min) / range) * (height - padding * 2)} r="4" fill={positive ? '#10b981' : '#ef4444'} className="animate-pulse" />
    </svg>
  );
}

// ============ STRESS TEST TAB ============
function StressTestTab({ isAgentActive, totalPnl, maxDrawdown }: { isAgentActive: boolean; totalPnl: number; maxDrawdown: number }) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsRunning(false);
          setResults({
            scenarios: 1000,
            worstCase: '-$' + formatNumber(randomBetween(5000, 15000)),
            bestCase: '+$' + formatNumber(randomBetween(10000, 30000)),
            avgReturn: '$' + formatNumber(randomBetween(2000, 8000)),
            survivalRate: (randomBetween(85, 99)).toFixed(1) + '%',
            var95: '$' + formatNumber(randomBetween(3000, 8000)),
            cvar95: '$' + formatNumber(randomBetween(5000, 12000)),
          });
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-white">⚡ Stress Test & Monte Carlo</h2>
      <div className="glass-panel rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Monte Carlo Simulation</h3>
            <p className="text-[10px] text-gray-500">1000 scenarios | 252 trading days</p>
          </div>
          <button onClick={() => { setIsRunning(true); setProgress(0); setResults(null); }} disabled={isRunning} className="px-4 py-2 rounded-lg text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 disabled:opacity-50">
            {isRunning ? 'Running...' : 'Run Simulation'}
          </button>
        </div>
        {isRunning && (
          <div className="space-y-2">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-[10px] text-gray-500">Progress: {progress}% | Simulating market scenarios...</p>
          </div>
        )}
        {results && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <ResultCard label="Worst Case" value={results.worstCase} color="text-red-400" />
            <ResultCard label="Best Case" value={results.bestCase} color="text-green-400" />
            <ResultCard label="Avg Return" value={results.avgReturn} color="text-cyan-400" />
            <ResultCard label="Survival Rate" value={results.survivalRate} color="text-purple-400" />
            <ResultCard label="VaR (95%)" value={results.var95} color="text-orange-400" />
            <ResultCard label="CVaR (95%)" value={results.cvar95} color="text-yellow-400" />
            <ResultCard label="Scenarios" value="1,000" color="text-blue-400" />
            <ResultCard label="Current DD" value={`${formatNumber(maxDrawdown, 2)}%`} color="text-red-400" />
          </div>
        )}
      </div>
      <div className="glass-panel rounded-xl p-4">
        <h3 className="text-sm font-bold text-white mb-3">Stress Scenarios</h3>
        <div className="space-y-2">
          {[
            { name: 'Flash Crash (-10% in 5min)', impact: 'HIGH', status: isAgentActive ? 'MONITORED' : 'IDLE' },
            { name: 'Black Swan Event', impact: 'CRITICAL', status: isAgentActive ? 'MONITORED' : 'IDLE' },
            { name: 'Liquidity Crisis', impact: 'HIGH', status: isAgentActive ? 'MONITORED' : 'IDLE' },
            { name: 'Volatility Spike (5x)', impact: 'MEDIUM', status: isAgentActive ? 'MONITORED' : 'IDLE' },
            { name: 'Correlation Breakdown', impact: 'MEDIUM', status: isAgentActive ? 'MONITORED' : 'IDLE' },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between bg-[#111827] rounded-lg p-3 border border-gray-800">
              <span className="text-xs text-white">{s.name}</span>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] px-2 py-0.5 rounded ${s.impact === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : s.impact === 'HIGH' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{s.impact}</span>
                <span className={`text-[10px] ${s.status === 'MONITORED' ? 'text-green-400' : 'text-gray-500'}`}>{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-[#111827] rounded-lg p-3 border border-gray-800 text-center">
      <p className="text-[10px] text-gray-500 mb-1">{label}</p>
      <p className={`text-sm font-bold ${color}`}>{value}</p>
    </div>
  );
}

// ============ AI MODELS TAB ============
function AIModelsTab({ isAgentActive }: { isAgentActive: boolean }) {
  const models = [
    { name: 'LSTM Price Predictor', type: 'Deep Learning', accuracy: 72.3, status: 'active', params: '2.4M', latency: '12ms' },
    { name: 'Transformer Signal', type: 'Attention', accuracy: 74.1, status: 'active', params: '8.7M', latency: '25ms' },
    { name: 'XGBoost Classifier', type: 'Gradient Boost', accuracy: 68.5, status: 'active', params: '150K', latency: '3ms' },
    { name: 'PPO Trading Agent', type: 'Reinforcement', accuracy: 71.2, status: 'active', params: '5.1M', latency: '8ms' },
    { name: 'BERT Sentiment', type: 'NLP', accuracy: 76.8, status: isAgentActive ? 'active' : 'idle', params: '110M', latency: '45ms' },
    { name: 'CNN Pattern Rec', type: 'Computer Vision', accuracy: 65.4, status: isAgentActive ? 'active' : 'idle', params: '3.2M', latency: '15ms' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-white">◊ AI Models</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model, i) => (
          <div key={i} className="glass-panel rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">{model.name}</h3>
              <span className={`text-[9px] px-2 py-0.5 rounded-full ${model.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                {model.status === 'active' ? '● Active' : '○ Idle'}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">Type</span>
                <span className="text-cyan-300">{model.type}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">Parameters</span>
                <span className="text-white">{model.params}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">Latency</span>
                <span className="text-yellow-300">{model.latency}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">Accuracy</span>
                <span className="text-green-300">{model.accuracy}%</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${model.accuracy}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="glass-panel rounded-xl p-4">
        <h3 className="text-sm font-bold text-white mb-3">🧬 Ensemble Configuration</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="bg-[#111827] rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-cyan-300">6</p>
            <p className="text-[10px] text-gray-500">Active Models</p>
          </div>
          <div className="bg-[#111827] rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-purple-300">130.5M</p>
            <p className="text-[10px] text-gray-500">Total Parameters</p>
          </div>
          <div className="bg-[#111827] rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-green-300">71.4%</p>
            <p className="text-[10px] text-gray-500">Ensemble Accuracy</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ TERMINAL TAB ============
function TerminalTab({ terminalLines, isAgentActive, setTerminalLines }: { terminalLines: string[]; isAgentActive: boolean; setTerminalLines: (lines: string[]) => void }) {
  const [input, setInput] = useState('');
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [terminalLines]);

  const handleCommand = (cmd: string) => {
    const responses: Record<string, string> = {
      'help': 'Available commands: status, agents, models, pnl, risk, clear, help',
      'status': `Agent: ${isAgentActive ? 'ACTIVE' : 'INACTIVE'} | Uptime: ${isAgentActive ? 'Running' : 'Stopped'}`,
      'agents': '6 agents loaded: Trend, MeanRevert, Scalp, News, Sentiment, RiskManager',
      'models': '6 models: LSTM, Transformer, XGBoost, PPO, BERT, CNN',
      'pnl': `Total PnL: Calculating...`,
      'risk': 'Risk level: MONITORED | VaR(95%): Active',
      'clear': '__CLEAR__',
    };

    const response = responses[cmd.toLowerCase()] || `Unknown command: ${cmd}. Type 'help' for available commands.`;
    
    if (response === '__CLEAR__') {
      setTerminalLines(['$ _']);
    } else {
      setTerminalLines([...terminalLines, `$ ${cmd}`, response]);
    }
    setInput('');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-white">▣ Terminal</h2>
      <div className="glass-panel rounded-xl overflow-hidden border border-gray-800">
        <div className="bg-[#0a0e1a] px-4 py-2 border-b border-gray-800 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-[10px] text-gray-500 ml-2">pjbot@trading:~$</span>
        </div>
        <div ref={termRef} className="p-4 h-96 overflow-y-auto font-mono text-xs space-y-1 scrollbar-thin">
          {terminalLines.map((line, i) => (
            <div key={i} className={`${line.startsWith('$') ? 'text-green-400' : line.startsWith('[OK]') ? 'text-cyan-300' : line.startsWith('[') ? 'text-yellow-300' : 'text-gray-400'}`}>
              {line}
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 px-4 py-2 flex items-center gap-2">
          <span className="text-green-400 text-xs">$</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && input.trim()) handleCommand(input.trim()); }}
            className="flex-1 bg-transparent text-xs text-white outline-none"
            placeholder="Type a command... (help, status, agents, models, clear)"
          />
        </div>
      </div>
    </div>
  );
}

// ============ AGENTS TAB ============
function AgentsTab({ agents, isAgentActive }: { agents: Agent[]; isAgentActive: boolean }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-black text-white">⬢ Multi-Agent System</h2>
      
      {/* Architecture Diagram */}
      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-sm font-bold text-white mb-4">System Architecture</h3>
        <div className="flex flex-col items-center gap-3">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-3 border border-purple-500/30 text-center w-full max-w-sm">
            <span className="text-xl">🎛️</span>
            <h4 className="font-bold text-purple-200 text-xs mt-1">ORCHESTRATOR</h4>
            <p className="text-[9px] text-gray-500">Strategy Selection & Allocation</p>
          </div>
          <span className="text-cyan-400">↓</span>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 w-full max-w-2xl">
            {agents.slice(0, 5).map((agent, i) => (
              <div key={i} className={`rounded-xl p-2 border text-center ${agent.status === 'active' ? 'bg-green-500/10 border-green-500/30' : agent.status === 'analyzing' ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-gray-800/50 border-gray-700'}`}>
                <span className="text-lg">{agent.icon}</span>
                <h4 className="font-bold text-white text-[9px] mt-1">{agent.name}</h4>
                <p className={`text-[8px] ${agent.status === 'active' ? 'text-green-400' : agent.status === 'analyzing' ? 'text-yellow-400' : 'text-gray-500'}`}>
                  {agent.status}
                </p>
              </div>
            ))}
          </div>
          <span className="text-cyan-400">↓</span>
          <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
            <div className="bg-orange-500/10 rounded-xl p-2 border border-orange-500/30 text-center">
              <span className="text-lg">🛡️</span>
              <h4 className="font-bold text-orange-200 text-[9px] mt-1">RISK MANAGER</h4>
            </div>
            <div className="bg-green-500/10 rounded-xl p-2 border border-green-500/30 text-center">
              <span className="text-lg">⚡</span>
              <h4 className="font-bold text-green-200 text-[9px] mt-1">EXECUTION</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent, i) => (
          <div key={i} className="glass-panel rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{agent.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full ${
                    agent.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    agent.status === 'analyzing' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {agent.status === 'active' ? '● Active' : agent.status === 'analyzing' ? '◐ Analyzing' : '○ Idle'}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">Accuracy</span>
                <span className="text-green-300">{formatNumber(agent.accuracy, 1)}%</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">Total Trades</span>
                <span className="text-white">{agent.trades}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">PnL</span>
                <span className={agent.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>{agent.pnl >= 0 ? '+' : ''}${formatNumber(agent.pnl)}</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${agent.color} rounded-full transition-all duration-500`} style={{ width: `${agent.accuracy}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Communication */}
      <div className="glass-panel rounded-xl p-4">
        <h3 className="text-sm font-bold text-white mb-3">🔗 Agent Communication</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Message Passing', desc: 'Agent-to-agent', active: isAgentActive },
            { name: 'Shared Memory', desc: 'Common state', active: isAgentActive },
            { name: 'Blackboard', desc: 'Knowledge base', active: isAgentActive },
            { name: 'Negotiation', desc: 'Consensus', active: isAgentActive },
          ].map((item, i) => (
            <div key={i} className={`rounded-lg p-3 border text-center ${item.active ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-gray-800/50 border-gray-700'}`}>
              <h4 className={`text-xs font-bold ${item.active ? 'text-cyan-200' : 'text-gray-500'}`}>{item.name}</h4>
              <p className="text-[9px] text-gray-500 mt-1">{item.desc}</p>
              <span className={`text-[8px] mt-1 inline-block ${item.active ? 'text-green-400' : 'text-gray-600'}`}>{item.active ? '● Active' : '○ Inactive'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ SHARED COMPONENTS ============
function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="glass-panel rounded-lg p-2.5 text-center">
      <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">{label}</div>
      <div className={`text-xs font-bold ${color}`}>{value}</div>
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
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32 md:h-40">
      <defs>
        <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#eqGrad)" />
      <polyline points={points} fill="none" stroke={isPositive ? '#10b981' : '#ef4444'} strokeWidth="2" />
      <circle cx={width - padding} cy={height - padding - ((data[data.length - 1] - min) / range) * (height - padding * 2)} r="4" fill={isPositive ? '#10b981' : '#ef4444'} className="animate-pulse" />
    </svg>
  );
}

function MiniChart({ data, positive }: { data: number[]; positive: boolean }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 16;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-4 mt-1">
      <polyline points={points} fill="none" stroke={positive ? '#10b981' : '#ef4444'} strokeWidth="1.5" opacity="0.7" />
    </svg>
  );
}
