import { useState } from 'react';
import RobotAnimation from './components/RobotAnimation';
import CommandPrompt from './components/CommandPrompt';

type Tab = 'dashboard' | 'parameters' | 'connection' | 'chart' | 'stresstest' | 'aimodels' | 'terminal' | 'agents';
type TradingType = 'saham' | 'crypto' | 'forex' | 'komoditas';

const tradingTypes: { id: TradingType; label: string; icon: string; color: string; desc: string; pairs: string[] }[] = [
  { id: 'saham', label: 'Saham', icon: '📈', color: 'from-blue-500 to-cyan-500', desc: 'Stock Market Trading', pairs: ['AAPL', 'GOOGL', 'TSLA', 'AMZN', 'MSFT', 'NVDA'] },
  { id: 'crypto', label: 'Crypto', icon: '₿', color: 'from-orange-500 to-yellow-500', desc: 'Cryptocurrency Trading', pairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT'] },
  { id: 'forex', label: 'Forex', icon: '💱', color: 'from-green-500 to-emerald-500', desc: 'Foreign Exchange', pairs: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CHF'] },
  { id: 'komoditas', label: 'Komoditas', icon: '🪙', color: 'from-purple-500 to-pink-500', desc: 'Commodities Trading', pairs: ['XAU/USD', 'XAG/USD', 'WTI/USD', 'BRENT', 'NATGAS'] },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [tradingType, setTradingType] = useState<TradingType>('forex');
  const [mt5Connected, setMt5Connected] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);

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

  const currentTrading = tradingTypes.find(t => t.id === tradingType)!;

  return (
    <div className="min-h-screen bg-[#060a14] text-white cyber-grid flex flex-col overflow-hidden">
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
            <p className="text-[9px] text-gray-600 tracking-widest uppercase">PJ.BOT v4.0.0 | Quantum Neural Trading System</p>
          </div>
        </div>

        {/* Trading Type Selector */}
        <div className="hidden lg:flex items-center gap-1 bg-black/30 rounded-xl p-1 border border-gray-800/50">
          {tradingTypes.map(tt => (
            <button
              key={tt.id}
              onClick={() => setTradingType(tt.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                tradingType === tt.id
                  ? `bg-gradient-to-r ${tt.color} text-white shadow-lg`
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tt.icon}</span>
              <span>{tt.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-[10px]">
            <StatusDot connected={mt5Connected} label="MT5" />
            <StatusDot connected={wsConnected} label="WS" />
            <StatusDot connected={apiConnected} label="API" />
          </div>
          <button
            onClick={() => setIsAgentActive(!isAgentActive)}
            className={`relative px-4 py-1.5 rounded-lg text-xs font-bold transition-all overflow-hidden ${
              isAgentActive
                ? 'bg-gradient-to-r from-red-600 to-orange-600 shadow-lg shadow-red-600/30'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 shadow-lg shadow-cyan-600/30'
            }`}
          >
            {isAgentActive && <div className="absolute inset-0 animate-wave bg-gradient-to-r from-transparent via-white/20 to-transparent" />}
            <span className="relative">{isAgentActive ? '⏹ STOP AGENT' : '▶ START AGENT'}</span>
          </button>
        </div>
      </header>

      {/* Mobile Trading Type Selector */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 bg-black/30 border-b border-gray-800/30 overflow-x-auto">
        {tradingTypes.map(tt => (
          <button
            key={tt.id}
            onClick={() => setTradingType(tt.id)}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
              tradingType === tt.id
                ? `bg-gradient-to-r ${tt.color} text-white`
                : 'text-gray-400 bg-white/5'
            }`}
          >
            <span>{tt.icon}</span>
            <span>{tt.label}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="w-14 lg:w-44 glass-panel border-r border-cyan-900/10 flex flex-col py-4 gap-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 mx-1.5 rounded-lg text-xs transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/5'
                  : 'text-gray-500 hover:text-cyan-300 hover:bg-white/3'
              }`}
            >
              <span className="text-base w-5 text-center">{tab.icon}</span>
              <span className="hidden lg:inline font-medium">{tab.label}</span>
            </button>
          ))}
          <div className="mt-auto px-2 py-3">
            <div className="text-[9px] text-gray-600 text-center space-y-1">
              <div className={isAgentActive ? 'text-cyan-400 animate-pulse' : ''}>
                {isAgentActive ? '● AGENT ACTIVE' : '○ IDLE'}
              </div>
              <div className="text-[8px] text-gray-700">{currentTrading.label} Mode</div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-3 lg:p-4 scrollbar-thin">
          {/* Trading Type Info Bar */}
          <div className={`mb-4 glass-panel rounded-xl p-3 flex items-center justify-between border-l-2 ${
            tradingType === 'saham' ? 'border-l-blue-500' :
            tradingType === 'crypto' ? 'border-l-orange-500' :
            tradingType === 'forex' ? 'border-l-green-500' :
            'border-l-purple-500'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentTrading.icon}</span>
              <div>
                <h2 className="text-sm font-bold text-white">{currentTrading.desc}</h2>
                <p className="text-[10px] text-gray-500">Active instruments: {currentTrading.pairs.join(' • ')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentTrading.pairs.slice(0, 3).map(p => (
                <span key={p} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400 font-mono">{p}</span>
              ))}
            </div>
          </div>

          {activeTab === 'dashboard' && <DashboardPanel isActive={isAgentActive} tradingType={tradingType} />}
          {activeTab === 'parameters' && <ParametersPanel tradingType={tradingType} />}
          {activeTab === 'connection' && (
            <ConnectionPanel
              mt5Connected={mt5Connected} setMt5Connected={setMt5Connected}
              wsConnected={wsConnected} setWsConnected={setWsConnected}
              apiConnected={apiConnected} setApiConnected={setApiConnected}
            />
          )}
          {activeTab === 'chart' && <ChartPanel tradingType={tradingType} />}
          {activeTab === 'stresstest' && <StressTestPanel />}
          {activeTab === 'aimodels' && <AIModelsPanel />}
          {activeTab === 'terminal' && <TerminalPanel isActive={isAgentActive} />}
          {activeTab === 'agents' && <MultiAgentPanel isActive={isAgentActive} />}
        </main>
      </div>
    </div>
  );
}

function StatusDot({ connected, label }: { connected: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-400 shadow-sm shadow-green-400/50' : 'bg-red-400'}`} />
      <span className="text-gray-500">{label}</span>
    </div>
  );
}

/* ==================== DASHBOARD ==================== */
function DashboardPanel({ isActive, tradingType }: { isActive: boolean; tradingType: TradingType }) {
  const currentTrading = tradingTypes.find(t => t.id === tradingType)!;
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
      {/* Robot + Stats */}
      <div className="xl:col-span-4 glass-panel-accent rounded-2xl p-5 flex flex-col items-center justify-center min-h-[420px] relative overflow-hidden">
        <div className="absolute inset-0 hex-pattern opacity-20" />
        <h3 className="text-cyan-400 font-bold mb-2 text-[10px] uppercase tracking-[0.2em] relative z-10">AI Agent Core</h3>
        <div className="relative z-10">
          <RobotAnimation isActive={isActive} size="lg" />
        </div>
        <div className="mt-4 text-center relative z-10">
          <p className={`text-xs ${isActive ? 'text-cyan-400 neon-text' : 'text-gray-600'}`}>
            {isActive ? '🔥 Agentic Mode Active — Processing...' : 'Awaiting Activation'}
          </p>
          {isActive && (
            <div className="mt-2 flex items-center justify-center gap-0.5">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-0.5 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-full animate-pulse"
                  style={{ height: `${Math.random() * 20 + 4}px`, animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Live Stats */}
      <div className="xl:col-span-4 glass-panel rounded-2xl p-5">
        <h3 className="text-cyan-400 font-bold mb-3 text-[10px] uppercase tracking-[0.2em]">Live Statistics — {currentTrading.label}</h3>
        <div className="space-y-2">
          <StatRow label="Total Trades Today" value="47" change="+12" />
          <StatRow label="Win Rate" value="72.3%" change="+2.1%" />
          <StatRow label="Profit Factor" value="2.14" change="+0.3" />
          <StatRow label="Sharpe Ratio" value="1.87" change="+0.12" />
          <StatRow label="Max Drawdown" value="4.2%" change="-0.8%" />
          <StatRow label="Open Positions" value="3" change="" />
          <StatRow label="Daily P&L" value="+$1,247.50" change="+$342" positive />
          <StatRow label="AI Confidence" value="87.3%" change="+5.2%" />
        </div>
        {/* Mini chart */}
        <div className="mt-4 h-16 relative">
          <svg viewBox="0 0 200 50" className="w-full h-full">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(0,200,255,0.3)" />
                <stop offset="100%" stopColor="rgba(0,200,255,0)" />
              </linearGradient>
            </defs>
            <path d="M0 40 Q20 35 40 30 T80 25 T120 20 T160 15 T200 10 V50 H0 Z" fill="url(#chartGrad)" />
            <path d="M0 40 Q20 35 40 30 T80 25 T120 20 T160 15 T200 10" fill="none" stroke="#00d4ff" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Command Terminal */}
      <div className="xl:col-span-4 glass-panel rounded-2xl p-4 flex flex-col">
        <h3 className="text-cyan-400 font-bold mb-2 text-[10px] uppercase tracking-[0.2em]">Command Terminal</h3>
        <CommandPrompt isActive={isActive} />
      </div>

      {/* Active Signals */}
      <div className="xl:col-span-8 glass-panel rounded-2xl p-5">
        <h3 className="text-cyan-400 font-bold mb-3 text-[10px] uppercase tracking-[0.2em]">Active Trading Signals — {currentTrading.label}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-600 border-b border-gray-800/50">
                <th className="text-left py-2 font-medium">Instrument</th>
                <th className="text-left py-2 font-medium">Direction</th>
                <th className="text-left py-2 font-medium">Entry</th>
                <th className="text-left py-2 font-medium">SL/TP</th>
                <th className="text-left py-2 font-medium">Confidence</th>
                <th className="text-left py-2 font-medium">AI Model</th>
                <th className="text-left py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentTrading.pairs.slice(0, 5).map((pair, i) => (
                <SignalRow key={pair} pair={pair} dir={i % 3 === 0 ? 'BUY' : i % 3 === 1 ? 'SELL' : 'BUY'}
                  entry={(Math.random() * 100 + 50).toFixed(2)}
                  sltp={`${(Math.random() * 100 + 40).toFixed(2)}/${(Math.random() * 100 + 60).toFixed(2)}`}
                  conf={`${(Math.random() * 20 + 70).toFixed(0)}%`}
                  model={['GPT-4o', 'LSTM', 'Claude-3.5', 'Gemini', 'XGBoost'][i % 5]}
                  status={['Active', 'Pending', 'Active', 'Active', 'Monitoring'][i % 5]} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="xl:col-span-4 glass-panel rounded-2xl p-5">
        <h3 className="text-cyan-400 font-bold mb-3 text-[10px] uppercase tracking-[0.2em]">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Scan Market', icon: '◈' },
            { label: 'Backtest', icon: '◇' },
            { label: 'Deploy', icon: '⬡' },
            { label: 'Risk Analysis', icon: '⬢' },
            { label: 'News Feed', icon: '◉' },
            { label: 'Portfolio', icon: '◊' },
          ].map(a => (
            <button key={a.label} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/3 hover:bg-cyan-500/10 border border-gray-800/50 hover:border-cyan-500/30 transition-all text-xs text-gray-400 hover:text-cyan-400">
              <span className="text-cyan-500">{a.icon}</span>
              <span>{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value, change, positive }: { label: string; value: string; change: string; positive?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-800/30">
      <span className="text-gray-500 text-[11px]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-white text-xs font-mono font-medium">{value}</span>
        {change && (
          <span className={`text-[9px] px-1 py-0.5 rounded ${
            positive !== false && change.startsWith('+') ? 'text-green-400 bg-green-500/10' :
            change.startsWith('-') ? 'text-red-400 bg-red-500/10' : 'text-gray-600'
          }`}>{change}</span>
        )}
      </div>
    </div>
  );
}

function SignalRow({ pair, dir, entry, sltp, conf, model, status }: { pair: string; dir: string; entry: string; sltp: string; conf: string; model: string; status: string }) {
  return (
    <tr className="border-b border-gray-800/20 hover:bg-cyan-500/3 transition-colors">
      <td className="py-2.5 font-mono text-white text-[11px]">{pair}</td>
      <td className={`py-2.5 font-bold text-[11px] ${dir === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
        <span className={`px-1.5 py-0.5 rounded ${dir === 'BUY' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>{dir}</span>
      </td>
      <td className="py-2.5 font-mono text-gray-300 text-[11px]">{entry}</td>
      <td className="py-2.5 font-mono text-gray-500 text-[11px]">{sltp}</td>
      <td className="py-2.5"><span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded text-[10px] font-mono">{conf}</span></td>
      <td className="py-2.5 text-purple-400 text-[11px]">{model}</td>
      <td className="py-2.5">
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${
          status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
          'bg-blue-500/10 text-blue-400 border border-blue-500/20'
        }`}>{status}</span>
      </td>
    </tr>
  );
}

/* ==================== PARAMETERS ==================== */
function ParametersPanel({ tradingType }: { tradingType: TradingType }) {
  const currentTrading = tradingTypes.find(t => t.id === tradingType)!;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
      <ParamCard title="📐 Risk Management" icon="⬡">
        <ParamInput label="Max Risk Per Trade (%)" defaultValue="2.0" />
        <ParamInput label="Max Daily Drawdown (%)" defaultValue="5.0" />
        <ParamInput label="Max Open Positions" defaultValue="5" />
        <ParamInput label="Stop Loss" defaultValue={tradingType === 'crypto' ? '500' : '30'} />
        <ParamInput label="Take Profit" defaultValue={tradingType === 'crypto' ? '1000' : '60'} />
        <ParamInput label="Trailing Stop" defaultValue={tradingType === 'forex' ? '20' : '100'} />
        <ParamToggle label="Dynamic Lot Size" defaultOn />
        <ParamToggle label="Enable Hedging" defaultOn={false} />
      </ParamCard>

      <ParamCard title="📊 Strategy Parameters" icon="◈">
        <ParamSelect label="Strategy Type" options={['Trend Following', 'Mean Reversion', 'Breakout', 'Scalping', 'Swing', 'Arbitrage']} />
        <ParamSelect label="Timeframe" options={['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1']} />
        <ParamInput label="RSI Period" defaultValue="14" />
        <ParamInput label="RSI Overbought" defaultValue="70" />
        <ParamInput label="RSI Oversold" defaultValue="30" />
        <ParamInput label="MACD Fast EMA" defaultValue="12" />
        <ParamInput label="MACD Slow EMA" defaultValue="26" />
        <ParamInput label="ATR Period" defaultValue="14" />
      </ParamCard>

      <ParamCard title="🧠 AI Parameters" icon="◊">
        <ParamInput label="Confidence Threshold (%)" defaultValue="75" />
        <ParamInput label="Lookback Period (candles)" defaultValue="100" />
        <ParamInput label="Prediction Horizon" defaultValue="24" />
        <ParamInput label="Learning Rate" defaultValue="0.001" />
        <ParamInput label="Batch Size" defaultValue="32" />
        <ParamInput label="Epochs" defaultValue="100" />
        <ParamToggle label="Ensemble Voting" defaultOn />
        <ParamToggle label="Auto-Recalibrate" defaultOn />
      </ParamCard>

      <ParamCard title={`${currentTrading.icon} ${currentTrading.label} Instruments`} icon="◉">
        {currentTrading.pairs.map(p => (
          <ParamToggle key={p} label={p} defaultOn />
        ))}
        {tradingType === 'saham' && <ParamToggle label="ETF Trading" defaultOn={false} />}
        {tradingType === 'crypto' && <ParamToggle label="DeFi Tokens" defaultOn={false} />}
        {tradingType === 'forex' && <ParamToggle label="Exotic Pairs" defaultOn={false} />}
        {tradingType === 'komoditas' && <ParamToggle label="Agricultural" defaultOn={false} />}
        <ParamInput label="Max Spread" defaultValue={tradingType === 'crypto' ? '50' : '5'} />
      </ParamCard>

      <ParamCard title="⏰ Session Settings" icon="⬢">
        <ParamToggle label="Asian Session" defaultOn={tradingType === 'crypto'} />
        <ParamToggle label="London Session" defaultOn={tradingType !== 'crypto'} />
        <ParamToggle label="NY Session" defaultOn={tradingType !== 'crypto'} />
        <ParamToggle label="24/7 Mode (Crypto)" defaultOn={tradingType === 'crypto'} />
        <ParamToggle label="Avoid News Events" defaultOn />
        <ParamInput label="News Buffer (min)" defaultValue="30" />
        <ParamSelect label="Friday Close" options={['Never', 'Before Close', 'At Close']} />
      </ParamCard>

      <ParamCard title="🔔 Notifications" icon="◇">
        <ParamToggle label="Trade Opened" defaultOn />
        <ParamToggle label="Trade Closed" defaultOn />
        <ParamToggle label="Drawdown Warning" defaultOn />
        <ParamToggle label="AI Signal Alert" defaultOn />
        <ParamToggle label="Email Alerts" defaultOn={false} />
        <ParamToggle label="Telegram Bot" defaultOn />
        <ParamInput label="Telegram Chat ID" defaultValue="" />
      </ParamCard>
    </div>
  );
}

function ParamCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <h3 className="text-cyan-400 font-bold mb-4 text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
        <span className="text-cyan-500/50">{icon}</span>{title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ParamInput({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div>
      <label className="text-[10px] text-gray-500 block mb-1 uppercase tracking-wider">{label}</label>
      <input type="text" defaultValue={defaultValue}
        className="w-full bg-black/40 border border-gray-800/50 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-500/50 focus:outline-none focus:shadow-lg focus:shadow-cyan-500/5 transition-all" />
    </div>
  );
}

function ParamToggle({ label, defaultOn }: { label: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between">
      <label className="text-[10px] text-gray-400">{label}</label>
      <button onClick={() => setOn(!on)}
        className={`w-9 h-4.5 rounded-full transition-all relative ${on ? 'bg-cyan-600/80 shadow-sm shadow-cyan-500/30' : 'bg-gray-800'}`}
        style={{ height: '18px' }}>
        <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-all ${on ? 'left-[18px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

function ParamSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="text-[10px] text-gray-500 block mb-1 uppercase tracking-wider">{label}</label>
      <select className="w-full bg-black/40 border border-gray-800/50 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-500/50 focus:outline-none transition-all">
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

/* ==================== CONNECTION ==================== */
function ConnectionPanel({ mt5Connected, setMt5Connected, wsConnected, setWsConnected, apiConnected, setApiConnected }: {
  mt5Connected: boolean; setMt5Connected: (v: boolean) => void;
  wsConnected: boolean; setWsConnected: (v: boolean) => void;
  apiConnected: boolean; setApiConnected: (v: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <ConnectionCard title="🔌 MetaTrader 5" connected={mt5Connected} onToggle={() => setMt5Connected(!mt5Connected)}>
        <ParamInput label="Server Address" defaultValue="demo.metaquotes.net" />
        <ParamInput label="Port" defaultValue="443" />
        <ParamInput label="Login ID" defaultValue="51234567" />
        <div><label className="text-[10px] text-gray-500 block mb-1 uppercase tracking-wider">Password</label>
          <input type="password" defaultValue="password" className="w-full bg-black/40 border border-gray-800/50 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-500/50 focus:outline-none" /></div>
        <ParamSelect label="Account Type" options={['Demo', 'Live', 'Contest']} />
        <ParamSelect label="Protocol" options={['TCP/IP', 'WebSocket', 'REST']} />
      </ConnectionCard>

      <ConnectionCard title="🌐 WebSocket" connected={wsConnected} onToggle={() => setWsConnected(!wsConnected)}>
        <ParamInput label="WebSocket URL" defaultValue="wss://api.pjbot.ai/ws" />
        <ParamInput label="API Key" defaultValue="sk-xxxx-xxxx" />
        <ParamInput label="Reconnect (ms)" defaultValue="5000" />
        <ParamInput label="Heartbeat (ms)" defaultValue="30000" />
        <ParamToggle label="Auto Reconnect" defaultOn />
        <ParamToggle label="SSL/TLS" defaultOn />
      </ConnectionCard>

      <ConnectionCard title="🔗 REST API" connected={apiConnected} onToggle={() => setApiConnected(!apiConnected)}>
        <ParamInput label="Base URL" defaultValue="https://api.pjbot.ai/v4" />
        <ParamInput label="API Token" defaultValue="Bearer eyJhbGci..." />
        <ParamInput label="Timeout (ms)" defaultValue="10000" />
        <ParamInput label="Rate Limit (req/min)" defaultValue="60" />
        <ParamSelect label="Auth Method" options={['Bearer', 'API Key', 'OAuth 2.0']} />
        <ParamToggle label="Enable Retry" defaultOn />
      </ConnectionCard>

      <ConnectionCard title="📱 Web/App Integration" connected={true} onToggle={() => {}}>
        <ParamSelect label="Platform" options={['Web Dashboard', 'iOS App', 'Android App', 'Desktop', 'Telegram Bot', 'Discord Bot']} />
        <ParamInput label="Webhook URL" defaultValue="https://hooks.pjbot.ai/trading" />
        <ParamInput label="Callback URL" defaultValue="https://app.pjbot.ai/callback" />
        <ParamToggle label="Web Push" defaultOn />
        <ParamToggle label="Real-time Updates" defaultOn />
        <ParamInput label="Refresh (ms)" defaultValue="1000" />
      </ConnectionCard>
    </div>
  );
}

function ConnectionCard({ title, connected, onToggle, children }: { title: string; connected: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-cyan-400 font-bold text-[10px] uppercase tracking-[0.2em]">{title}</h3>
        <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${connected ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {connected ? '● Connected' : '● Disconnected'}
        </span>
      </div>
      <div className="space-y-3">{children}</div>
      <button onClick={onToggle}
        className={`w-full mt-4 py-2 rounded-lg text-xs font-bold transition-all ${
          connected ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20'
        }`}>
        {connected ? '⏹ Disconnect' : '▶ Connect'}
      </button>
    </div>
  );
}

/* ==================== CHART SCREENING ==================== */
function ChartPanel({ tradingType }: { tradingType: TradingType }) {
  const currentTrading = tradingTypes.find(t => t.id === tradingType)!;
  const [selectedPair, setSelectedPair] = useState(currentTrading.pairs[0]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
      <div className="glass-panel rounded-2xl p-4">
        <h3 className="text-cyan-400 font-bold mb-3 text-[10px] uppercase tracking-[0.2em]">{currentTrading.icon} {currentTrading.label} Pairs</h3>
        <div className="space-y-1">
          {currentTrading.pairs.map(pair => (
            <button key={pair} onClick={() => setSelectedPair(pair)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex justify-between items-center ${
                selectedPair === pair ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:bg-white/3 border border-transparent'
              }`}>
              <span className="font-mono font-medium">{pair}</span>
              <span className={`text-[10px] font-mono ${Math.random() > 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                {Math.random() > 0.5 ? '▲' : '▼'} {(Math.random() * 3).toFixed(2)}%
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="xl:col-span-3 glass-panel rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-cyan-400 font-bold text-[10px] uppercase tracking-[0.2em]">{selectedPair} — Chart Analysis</h3>
            <p className="text-[10px] text-gray-600 mt-0.5">AI-Powered Technical Analysis</p>
          </div>
          <div className="flex gap-1">
            {['M5', 'M15', 'H1', 'H4', 'D1'].map(tf => (
              <button key={tf} className="px-2.5 py-1 text-[10px] rounded-lg bg-white/3 text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 transition-all">{tf}</button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="relative h-56 bg-black/30 rounded-xl border border-gray-800/30 overflow-hidden">
          <svg viewBox="0 0 800 220" className="w-full h-full">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(0,200,255,0.15)" />
                <stop offset="100%" stopColor="rgba(0,200,255,0)" />
              </linearGradient>
            </defs>
            {/* Grid */}
            {[...Array(5)].map((_, i) => <line key={`h${i}`} x1="0" y1={i * 44 + 22} x2="800" y2={i * 44 + 22} stroke="rgba(0,180,255,0.04)" />)}
            {[...Array(12)].map((_, i) => <line key={`v${i}`} x1={i * 67 + 33} y1="0" x2={i * 67 + 33} y2="220" stroke="rgba(0,180,255,0.04)" />)}
            {/* Candles */}
            {generateCandles().map((c, i) => (
              <g key={i}>
                <line x1={i * 25 + 30} y1={c.high} x2={i * 25 + 30} y2={c.low} stroke={c.bullish ? '#00cc88' : '#ff4466'} strokeWidth="1" />
                <rect x={i * 25 + 26} y={Math.min(c.open, c.close)} width="8" height={Math.max(2, Math.abs(c.close - c.open))} fill={c.bullish ? '#00cc88' : '#ff4466'} rx="1" />
              </g>
            ))}
            {/* MA */}
            <path d={generateMALine()} fill="none" stroke="rgba(0,200,255,0.5)" strokeWidth="1.5" strokeDasharray="4 2" />
            {/* Signal */}
            <polygon points="400,170 408,185 392,185" fill="#00ffaa" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite" />
            </polygon>
          </svg>
          <div className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent animate-scan-line" />
        </div>

        {/* Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
          {[
            { label: 'RSI (14)', value: '62.4', status: 'neutral' },
            { label: 'MACD', value: '+0.0012', status: 'bullish' },
            { label: 'ATR (14)', value: '45.2', status: 'neutral' },
            { label: 'ADX', value: '28.7', status: 'bullish' },
            { label: 'Stochastic', value: '71.2', status: 'neutral' },
            { label: 'Bollinger', value: 'Upper', status: 'neutral' },
            { label: 'Volume', value: '+23%', status: 'bullish' },
            { label: 'AI Score', value: '87.3', status: 'bullish' },
          ].map(ind => (
            <div key={ind.label} className={`p-2 rounded-xl border ${
              ind.status === 'bullish' ? 'border-green-500/20 bg-green-500/5' : 'border-yellow-500/20 bg-yellow-500/5'
            }`}>
              <div className="text-[9px] text-gray-600 uppercase">{ind.label}</div>
              <div className={`text-xs font-mono font-bold ${ind.status === 'bullish' ? 'text-green-400' : 'text-yellow-400'}`}>{ind.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function generateCandles() {
  const candles = [];
  let price = 110;
  for (let i = 0; i < 30; i++) {
    const change = (Math.random() - 0.47) * 12;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * 6;
    const low = Math.min(open, close) - Math.random() * 6;
    candles.push({ open, close, high, low, bullish: close > open });
    price = close;
  }
  return candles;
}

function generateMALine() {
  let d = 'M 30 120';
  for (let i = 1; i < 30; i++) {
    const y = 120 + Math.sin(i * 0.25) * 25 + (Math.random() - 0.5) * 8;
    d += ` L ${i * 25 + 30} ${y}`;
  }
  return d;
}

/* ==================== STRESS TEST ==================== */
function StressTestPanel() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const runTest = () => {
    setRunning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setRunning(false); return 100; }
        return prev + 2;
      });
    }, 80);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div className="glass-panel rounded-2xl p-5">
        <h3 className="text-cyan-400 font-bold mb-4 text-[10px] uppercase tracking-[0.2em]">⚡ API Stress Test</h3>
        <div className="space-y-3">
          <ParamInput label="Target URL" defaultValue="https://api.pjbot.ai/v4/trade" />
          <ParamInput label="Concurrent Requests" defaultValue="1000" />
          <ParamInput label="Duration (seconds)" defaultValue="60" />
          <ParamSelect label="HTTP Method" options={['GET', 'POST', 'PUT']} />
          <ParamToggle label="Randomize Payload" defaultOn />
          <button onClick={runTest} disabled={running}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${running ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20'}`}>
            {running ? `⚡ Running... ${progress}%` : '▶ Run Stress Test'}
          </button>
          {running && (
            <div className="w-full h-1.5 bg-gray-800/50 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-75 rounded-full" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-5">
        <h3 className="text-cyan-400 font-bold mb-4 text-[10px] uppercase tracking-[0.2em]">📊 Test Results</h3>
        <div className="space-y-2">
          {[
            { l: 'Total Requests', v: '60,000' },
            { l: 'Success Rate', v: '99.7%', c: 'green' },
            { l: 'Avg Response', v: '12ms' },
            { l: 'P95 Response', v: '45ms' },
            { l: 'P99 Response', v: '120ms' },
            { l: 'Max Response', v: '340ms', c: 'yellow' },
            { l: 'Req/sec', v: '1,000' },
            { l: 'Error Rate', v: '0.3%', c: 'green' },
            { l: 'Throughput', v: '2.4 MB/s' },
            { l: 'CPU Usage', v: '45%', c: 'yellow' },
          ].map(r => (
            <div key={r.l} className="flex justify-between py-1 border-b border-gray-800/20">
              <span className="text-[10px] text-gray-500">{r.l}</span>
              <span className={`text-xs font-mono font-medium ${r.c === 'green' ? 'text-green-400' : r.c === 'yellow' ? 'text-yellow-400' : 'text-white'}`}>{r.v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-5">
        <h3 className="text-cyan-400 font-bold mb-4 text-[10px] uppercase tracking-[0.2em]">🔗 Connection Stress</h3>
        <div className="space-y-3">
          <ParamInput label="MT5 Max Connections" defaultValue="100" />
          <ParamInput label="WebSocket Max Clients" defaultValue="10000" />
          <ParamInput label="DB Pool Size" defaultValue="50" />
          <ParamToggle label="Test Failover" defaultOn />
          <ParamToggle label="Test Reconnection" defaultOn />
          <button className="w-full py-2.5 rounded-xl text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20">▶ Run Connection Test</button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-5">
        <h3 className="text-cyan-400 font-bold mb-4 text-[10px] uppercase tracking-[0.2em]">🧠 AI Model Stress</h3>
        <div className="space-y-3">
          <ParamInput label="Inference req/sec" defaultValue="100" />
          <ParamInput label="Batch Size" defaultValue="32" />
          <ParamInput label="Max Latency (ms)" defaultValue="500" />
          <ParamToggle label="GPU Acceleration" defaultOn />
          <ParamSelect label="Scenario" options={['Normal', 'Peak', 'Spike', 'Soak']} />
          <button className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20">▶ Run AI Stress Test</button>
        </div>
      </div>
    </div>
  );
}

/* ==================== AI MODELS ==================== */
function AIModelsPanel() {
  const models = [
    { name: 'GPT-4o', provider: 'OpenAI', status: 'active', latency: '45ms', accuracy: '87.3%', desc: 'General Trading Analysis' },
    { name: 'Claude-3.5', provider: 'Anthropic', status: 'active', latency: '38ms', accuracy: '85.1%', desc: 'Pattern Recognition' },
    { name: 'Gemini-Pro', provider: 'Google', status: 'active', latency: '52ms', accuracy: '82.7%', desc: 'News Sentiment' },
    { name: 'Custom-LSTM', provider: 'Internal', status: 'active', latency: '12ms', accuracy: '89.2%', desc: 'Time Series Prediction' },
    { name: 'XGBoost', provider: 'Internal', status: 'standby', latency: '8ms', accuracy: '84.5%', desc: 'Risk Assessment' },
    { name: 'Transformer-XL', provider: 'Internal', status: 'standby', latency: '25ms', accuracy: '86.8%', desc: 'Volatility Forecasting' },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
      <div className="xl:col-span-2 space-y-2">
        <h3 className="text-cyan-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-3">🧠 AI Model Registry</h3>
        {models.map((m, i) => (
          <div key={i} className="glass-panel rounded-xl p-4 flex items-center justify-between hover:border-cyan-500/20 transition-all">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm ${m.status === 'active' ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-gray-800/50 border border-gray-700/30'}`}>🤖</div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-xs font-bold">{m.name}</span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${m.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{m.status}</span>
                </div>
                <div className="text-[10px] text-gray-500">{m.desc} — {m.provider}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-500">Lat: <span className="text-white font-mono">{m.latency}</span></div>
              <div className="text-[10px] text-gray-500">Acc: <span className="text-cyan-400 font-mono">{m.accuracy}</span></div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="glass-panel rounded-2xl p-5">
          <h3 className="text-cyan-400 font-bold mb-3 text-[10px] uppercase tracking-[0.2em]">🔀 AI Routing</h3>
          <div className="space-y-3">
            <ParamSelect label="Strategy" options={['Round Robin', 'Weighted', 'Priority', 'Latency-Based', 'Confidence-Based']} />
            <ParamInput label="Fallback Model" defaultValue="Custom-LSTM" />
            <ParamInput label="Max Retry" defaultValue="3" />
            <ParamToggle label="Load Balancing" defaultOn />
            <ParamToggle label="Auto Failover" defaultOn />
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-5">
          <h3 className="text-cyan-400 font-bold mb-3 text-[10px] uppercase tracking-[0.2em]">📐 Ensemble</h3>
          <div className="space-y-3">
            <ParamSelect label="Voting" options={['Majority', 'Weighted Avg', 'Stacking', 'Boosting']} />
            <ParamInput label="Min Agreement (%)" defaultValue="60" />
            <ParamToggle label="Meta-Learner" defaultOn />
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-5">
          <h3 className="text-cyan-400 font-bold mb-3 text-[10px] uppercase tracking-[0.2em]">🔑 API Keys</h3>
          <div className="space-y-2">
            <div><label className="text-[10px] text-gray-500 block mb-1">OpenAI</label><input type="password" defaultValue="sk-xxxx" className="w-full bg-black/40 border border-gray-800/50 rounded-lg px-3 py-1.5 text-[10px] text-white focus:border-cyan-500/50 focus:outline-none" /></div>
            <div><label className="text-[10px] text-gray-500 block mb-1">Anthropic</label><input type="password" defaultValue="sk-ant-xxxx" className="w-full bg-black/40 border border-gray-800/50 rounded-lg px-3 py-1.5 text-[10px] text-white focus:border-cyan-500/50 focus:outline-none" /></div>
            <div><label className="text-[10px] text-gray-500 block mb-1">Google AI</label><input type="password" defaultValue="AIza-xxxx" className="w-full bg-black/40 border border-gray-800/50 rounded-lg px-3 py-1.5 text-[10px] text-white focus:border-cyan-500/50 focus:outline-none" /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== TERMINAL ==================== */
function TerminalPanel({ isActive }: { isActive: boolean }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
      <div className="xl:col-span-2 flex flex-col gap-3">
        <div className="glass-panel rounded-2xl p-4 flex-1">
          <h3 className="text-cyan-400 font-bold mb-2 text-[10px] uppercase tracking-[0.2em]">💻 AI Agent Terminal</h3>
          <CommandPrompt isActive={isActive} />
        </div>
        <div className="glass-panel rounded-2xl p-5">
          <h3 className="text-cyan-400 font-bold mb-3 text-[10px] uppercase tracking-[0.2em]">⚙️ Terminal Settings</h3>
          <div className="grid grid-cols-2 gap-3">
            <ParamSelect label="Shell" options={['bash', 'zsh', 'powershell', 'custom']} />
            <ParamInput label="Max History" defaultValue="10000" />
            <ParamToggle label="Auto-Complete" defaultOn />
            <ParamToggle label="Syntax Highlight" defaultOn />
            <ParamSelect label="Font Size" options={['10px', '12px', '14px', '16px']} />
            <ParamToggle label="Timestamps" defaultOn />
          </div>
        </div>
      </div>
      <div className="glass-panel rounded-2xl p-5">
        <h3 className="text-cyan-400 font-bold mb-3 text-[10px] uppercase tracking-[0.2em]">📋 System Logs</h3>
        <div className="space-y-1 font-mono text-[9px] max-h-[500px] overflow-y-auto scrollbar-thin">
          {[
            { t: '14:23:01', l: 'INFO', m: 'Agent initialized' },
            { t: '14:23:02', l: 'INFO', m: 'Loading AI models...' },
            { t: '14:23:03', l: 'INFO', m: 'GPT-4o loaded (45ms)' },
            { t: '14:23:04', l: 'INFO', m: 'LSTM model loaded (12ms)' },
            { t: '14:23:05', l: 'WARN', m: 'High latency on Gemini' },
            { t: '14:23:06', l: 'INFO', m: 'MT5 connected' },
            { t: '14:23:07', l: 'INFO', m: 'Market data active' },
            { t: '14:23:08', l: 'INFO', m: 'Scanning 28 pairs...' },
            { t: '14:23:10', l: 'OK', m: 'Signal: EUR/USD BUY 87%' },
            { t: '14:23:12', l: 'INFO', m: 'Order #12847563' },
            { t: '14:23:15', l: 'INFO', m: 'Risk check passed' },
            { t: '14:23:18', l: 'WARN', m: 'Spread widening GBP/JPY' },
            { t: '14:23:20', l: 'INFO', m: 'Position +12 pips' },
            { t: '14:23:25', l: 'OK', m: 'Signal: XAU/USD BUY 92%' },
            { t: '14:23:30', l: 'ERR', m: 'REST timeout - retrying' },
            { t: '14:23:31', l: 'INFO', m: 'Retry successful' },
            { t: '14:23:35', l: 'INFO', m: 'P&L: +$342.50' },
            { t: '14:23:40', l: 'INFO', m: 'Heartbeat OK' },
          ].map((log, i) => (
            <div key={i} className="flex gap-2 py-0.5 border-b border-gray-800/20">
              <span className="text-gray-700">{log.t}</span>
              <span className={`w-8 ${log.l === 'OK' ? 'text-green-400' : log.l === 'WARN' ? 'text-yellow-400' : log.l === 'ERR' ? 'text-red-400' : 'text-blue-400'}`}>{log.l}</span>
              <span className="text-gray-400">{log.m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==================== MULTI AGENT ==================== */
function MultiAgentPanel({ isActive }: { isActive: boolean }) {
  const agents = [
    { name: 'Agent-Alpha', role: 'Scalper', tf: 'M5', status: 'running', trades: 23, pnl: '+$456', ai: 'GPT-4o' },
    { name: 'Agent-Beta', role: 'Swing', tf: 'H4', status: 'running', trades: 5, pnl: '+$1,234', ai: 'LSTM' },
    { name: 'Agent-Gamma', role: 'News', tf: 'M15', status: 'standby', trades: 0, pnl: '$0', ai: 'Gemini' },
    { name: 'Agent-Delta', role: 'Arbitrage', tf: 'M1', status: 'running', trades: 47, pnl: '+$189', ai: 'XGBoost' },
    { name: 'Agent-Epsilon', role: 'Hedger', tf: 'H1', status: 'monitoring', trades: 3, pnl: '-$45', ai: 'Claude' },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
      <div className="xl:col-span-2 space-y-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-cyan-400 font-bold text-[10px] uppercase tracking-[0.2em]">🤖 Multi AI Agent Fleet</h3>
          <button className="px-3 py-1 text-[10px] rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20">+ Deploy Agent</button>
        </div>
        {agents.map((a, i) => (
          <div key={i} className="glass-panel rounded-xl p-4 hover:border-cyan-500/20 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  a.status === 'running' ? 'bg-cyan-500/10 border border-cyan-500/20 animate-glow-pulse' :
                  a.status === 'standby' ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-blue-500/10 border border-blue-500/20'
                }`}><span>🤖</span></div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xs font-bold">{a.name}</span>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${
                      a.status === 'running' ? 'bg-green-500/10 text-green-400' :
                      a.status === 'standby' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>{a.status}</span>
                  </div>
                  <div className="text-[10px] text-gray-600">{a.role} | {a.tf} | {a.ai}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] text-gray-500">Trades: <span className="text-white font-mono">{a.trades}</span></div>
                  <div className={`text-xs font-mono font-bold ${a.pnl.startsWith('+') ? 'text-green-400' : a.pnl.startsWith('-') ? 'text-red-400' : 'text-gray-500'}`}>{a.pnl}</div>
                </div>
                <div className="flex gap-1">
                  <button className="w-6 h-6 rounded bg-white/3 hover:bg-green-500/10 text-[10px] flex items-center justify-center text-gray-500 hover:text-green-400">▶</button>
                  <button className="w-6 h-6 rounded bg-white/3 hover:bg-red-500/10 text-[10px] flex items-center justify-center text-gray-500 hover:text-red-400">⏹</button>
                </div>
              </div>
            </div>
            {a.status === 'running' && isActive && (
              <div className="mt-2 flex items-center gap-px">
                {[...Array(30)].map((_, j) => (
                  <div key={j} className="w-px bg-gradient-to-t from-cyan-500/60 to-blue-400/30 rounded-full animate-pulse"
                    style={{ height: `${Math.random() * 12 + 2}px`, animationDelay: `${j * 0.04}s` }} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="glass-panel rounded-2xl p-5">
          <h3 className="text-cyan-400 font-bold mb-3 text-[10px] uppercase tracking-[0.2em]">🎯 Orchestration</h3>
          <div className="space-y-3">
            <ParamSelect label="Mode" options={['Independent', 'Cooperative', 'Hierarchical', 'Competitive']} />
            <ParamInput label="Max Agents" defaultValue="5" />
            <ParamInput label="Global Risk (%)" defaultValue="10" />
            <ParamToggle label="Agent Communication" defaultOn />
            <ParamToggle label="Shared Memory" defaultOn />
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-5">
          <h3 className="text-cyan-400 font-bold mb-3 text-[10px] uppercase tracking-[0.2em]">📊 Fleet Performance</h3>
          <div className="space-y-2">
            {[
              { l: 'Total P&L', v: '+$1,834', c: 'text-green-400' },
              { l: 'Total Trades', v: '78', c: 'text-white' },
              { l: 'Win Rate', v: '71.8%', c: 'text-cyan-400' },
              { l: 'Active Agents', v: '3/5', c: 'text-green-400' },
              { l: 'Avg Confidence', v: '84.2%', c: 'text-blue-400' },
            ].map(s => (
              <div key={s.l} className="flex justify-between text-[10px]">
                <span className="text-gray-500">{s.l}</span>
                <span className={`font-mono font-medium ${s.c}`}>{s.v}</span>
              </div>
            ))}
            <div className="mt-2 p-2 rounded-lg bg-green-500/5 border border-green-500/10">
              <div className="text-[9px] text-green-400">● Fleet: OPTIMAL</div>
            </div>
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-5">
          <h3 className="text-cyan-400 font-bold mb-3 text-[10px] uppercase tracking-[0.2em]">🔗 Communication</h3>
          <div className="space-y-3">
            <ParamSelect label="Protocol" options={['gRPC', 'WebSocket', 'Redis Pub/Sub', 'MQ']} />
            <ParamInput label="Message TTL (ms)" defaultValue="5000" />
            <ParamToggle label="Encrypt" defaultOn />
            <ParamToggle label="Broadcast" defaultOn />
          </div>
        </div>
      </div>
    </div>
  );
}
