import { useState } from 'react';
import RobotAnimation from './components/RobotAnimation';
import CommandPrompt from './components/CommandPrompt';

type Tab = 'dashboard' | 'parameters' | 'connection' | 'chart' | 'stresstest' | 'aimodels' | 'terminal' | 'agents';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [mt5Connected, setMt5Connected] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'parameters', label: 'Parameters', icon: '⚙️' },
    { id: 'connection', label: 'Connection', icon: '🔌' },
    { id: 'chart', label: 'Chart Screen', icon: '📊' },
    { id: 'stresstest', label: 'Stress Test', icon: '⚡' },
    { id: 'aimodels', label: 'AI Models', icon: '🧠' },
    { id: 'terminal', label: 'Terminal', icon: '💻' },
    { id: 'agents', label: 'Multi-Agent', icon: '🤖' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white cyber-grid flex flex-col">
      {/* Header */}
      <header className="glass-panel border-b border-orange-900/30 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-sm font-bold">
            S
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              SANOBOT AI Trading Agent
            </h1>
            <p className="text-[10px] text-gray-500">v3.7.2 | Multi-Model AI Trading System</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className={`w-2 h-2 rounded-full ${mt5Connected ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-gray-400">MT5</span>
            <span className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-gray-400">WS</span>
            <span className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-gray-400">API</span>
          </div>
          <button
            onClick={() => setIsAgentActive(!isAgentActive)}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
              isAgentActive
                ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30'
                : 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/30'
            }`}
          >
            {isAgentActive ? '⏹ STOP AGENT' : '▶ START AGENT'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="w-16 lg:w-48 glass-panel border-r border-orange-900/30 flex flex-col py-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2.5 mx-2 rounded-lg text-sm transition-all mb-1 ${
                activeTab === tab.id
                  ? 'bg-orange-600/20 text-orange-400 border border-orange-600/30'
                  : 'text-gray-400 hover:text-orange-300 hover:bg-white/5'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="hidden lg:inline">{tab.label}</span>
            </button>
          ))}
          <div className="mt-auto px-3 py-2 mx-2">
            <div className="text-[10px] text-gray-600 text-center">
              {isAgentActive ? (
                <span className="text-green-400 animate-pulse">● Agent Running</span>
              ) : (
                <span>○ Agent Idle</span>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          {activeTab === 'dashboard' && <DashboardPanel isActive={isAgentActive} />}
          {activeTab === 'parameters' && <ParametersPanel />}
          {activeTab === 'connection' && (
            <ConnectionPanel
              mt5Connected={mt5Connected}
              setMt5Connected={setMt5Connected}
              wsConnected={wsConnected}
              setWsConnected={setWsConnected}
              apiConnected={apiConnected}
              setApiConnected={setApiConnected}
            />
          )}
          {activeTab === 'chart' && <ChartPanel />}
          {activeTab === 'stresstest' && <StressTestPanel />}
          {activeTab === 'aimodels' && <AIModelsPanel />}
          {activeTab === 'terminal' && <TerminalPanel isActive={isAgentActive} />}
          {activeTab === 'agents' && <MultiAgentPanel isActive={isAgentActive} />}
        </main>
      </div>
    </div>
  );
}

/* ==================== DASHBOARD ==================== */
function DashboardPanel({ isActive }: { isActive: boolean }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      {/* Robot Animation */}
      <div className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center min-h-[400px]">
        <h3 className="text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider">AI Agent Core</h3>
        <RobotAnimation isActive={isActive} size="lg" />
        <div className="mt-6 text-center">
          <p className={`text-sm ${isActive ? 'text-orange-400' : 'text-gray-500'}`}>
            {isActive ? '🔥 Processing Market Data...' : 'Awaiting Activation'}
          </p>
          {isActive && (
            <div className="mt-2 flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 bg-orange-500 rounded-full animate-pulse" style={{ height: `${Math.random() * 20 + 5}px`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider">Live Statistics</h3>
        <div className="space-y-3">
          <StatRow label="Total Trades Today" value="47" change="+12" />
          <StatRow label="Win Rate" value="72.3%" change="+2.1%" />
          <StatRow label="Profit Factor" value="2.14" change="+0.3" />
          <StatRow label="Sharpe Ratio" value="1.87" change="+0.12" />
          <StatRow label="Max Drawdown" value="4.2%" change="-0.8%" />
          <StatRow label="Open Positions" value="3" change="" />
          <StatRow label="Daily P&L" value="+$1,247.50" change="+$342" positive />
          <StatRow label="AI Confidence" value="87.3%" change="+5.2%" />
        </div>
      </div>

      {/* Command Prompt */}
      <div className="glass-panel rounded-xl p-4 flex flex-col">
        <h3 className="text-orange-400 font-bold mb-3 text-sm uppercase tracking-wider">Command Terminal</h3>
        <CommandPrompt isActive={isActive} />
      </div>

      {/* Active Signals */}
      <div className="glass-panel rounded-xl p-6 xl:col-span-2">
        <h3 className="text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider">Active Trading Signals</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800">
                <th className="text-left py-2">Pair</th>
                <th className="text-left py-2">Direction</th>
                <th className="text-left py-2">Entry</th>
                <th className="text-left py-2">SL/TP</th>
                <th className="text-left py-2">Confidence</th>
                <th className="text-left py-2">AI Model</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <SignalRow pair="EUR/USD" dir="BUY" entry="1.0845" sltp="1.0820/1.0895" conf="87%" model="GPT-4o" status="Active" />
              <SignalRow pair="XAU/USD" dir="BUY" entry="2,342.50" sltp="2,335/2,360" conf="92%" model="LSTM" status="Active" />
              <SignalRow pair="GBP/JPY" dir="SELL" entry="191.450" sltp="191.80/190.80" conf="78%" model="Claude-3.5" status="Pending" />
              <SignalRow pair="BTC/USD" dir="BUY" entry="67,250" sltp="66,800/68,500" conf="81%" model="Gemini" status="Active" />
              <SignalRow pair="USD/CAD" dir="SELL" entry="1.3620" sltp="1.3660/1.3560" conf="74%" model="XGBoost" status="Monitoring" />
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <ActionButton label="Scan Market" icon="📊" />
          <ActionButton label="Run Backtest" icon="📈" />
          <ActionButton label="Deploy Strategy" icon="🚀" />
          <ActionButton label="Risk Analysis" icon="🛡️" />
          <ActionButton label="News Feed" icon="📰" />
          <ActionButton label="Portfolio" icon="💼" />
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value, change, positive }: { label: string; value: string; change: string; positive?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-800/50">
      <span className="text-gray-400 text-xs">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-white text-sm font-mono">{value}</span>
        {change && (
          <span className={`text-[10px] ${positive !== false && change.startsWith('+') ? 'text-green-400' : change.startsWith('-') ? 'text-red-400' : 'text-gray-500'}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

function SignalRow({ pair, dir, entry, sltp, conf, model, status }: { pair: string; dir: string; entry: string; sltp: string; conf: string; model: string; status: string }) {
  return (
    <tr className="border-b border-gray-800/30 hover:bg-white/5">
      <td className="py-2 font-mono text-white">{pair}</td>
      <td className={`py-2 font-bold ${dir === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>{dir}</td>
      <td className="py-2 font-mono text-gray-300">{entry}</td>
      <td className="py-2 font-mono text-gray-400">{sltp}</td>
      <td className="py-2"><span className="px-2 py-0.5 bg-orange-600/20 text-orange-400 rounded">{conf}</span></td>
      <td className="py-2 text-blue-400">{model}</td>
      <td className="py-2">
        <span className={`px-2 py-0.5 rounded text-[10px] ${
          status === 'Active' ? 'bg-green-600/20 text-green-400' :
          status === 'Pending' ? 'bg-yellow-600/20 text-yellow-400' :
          'bg-blue-600/20 text-blue-400'
        }`}>{status}</span>
      </td>
    </tr>
  );
}

function ActionButton({ label, icon }: { label: string; icon: string }) {
  return (
    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-orange-600/20 border border-gray-800 hover:border-orange-600/30 transition-all text-xs text-gray-300 hover:text-orange-400">
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

/* ==================== PARAMETERS ==================== */
function ParametersPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider">📐 Risk Management</h3>
        <div className="space-y-4">
          <ParamInput label="Max Risk Per Trade (%)" defaultValue="2.0" />
          <ParamInput label="Max Daily Drawdown (%)" defaultValue="5.0" />
          <ParamInput label="Max Open Positions" defaultValue="5" />
          <ParamInput label="Stop Loss (pips)" defaultValue="30" />
          <ParamInput label="Take Profit (pips)" defaultValue="60" />
          <ParamInput label="Trailing Stop (pips)" defaultValue="20" />
          <ParamToggle label="Use Dynamic Lot Size" defaultOn />
          <ParamToggle label="Enable Hedging" defaultOn={false} />
        </div>
      </div>

      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider">📊 Strategy Parameters</h3>
        <div className="space-y-4">
          <ParamSelect label="Strategy Type" options={['Trend Following', 'Mean Reversion', 'Breakout', 'Scalping', 'Swing', 'Arbitrage']} />
          <ParamSelect label="Timeframe" options={['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1']} />
          <ParamInput label="RSI Period" defaultValue="14" />
          <ParamInput label="RSI Overbought" defaultValue="70" />
          <ParamInput label="RSI Oversold" defaultValue="30" />
          <ParamInput label="MACD Fast EMA" defaultValue="12" />
          <ParamInput label="MACD Slow EMA" defaultValue="26" />
          <ParamInput label="MACD Signal" defaultValue="9" />
          <ParamInput label="ATR Period" defaultValue="14" />
        </div>
      </div>

      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider">🧠 AI Parameters</h3>
        <div className="space-y-4">
          <ParamInput label="Confidence Threshold (%)" defaultValue="75" />
          <ParamInput label="Lookback Period (candles)" defaultValue="100" />
          <ParamInput label="Prediction Horizon" defaultValue="24" />
          <ParamInput label="Learning Rate" defaultValue="0.001" />
          <ParamInput label="Batch Size" defaultValue="32" />
          <ParamInput label="Epochs" defaultValue="100" />
          <ParamToggle label="Enable Ensemble Voting" defaultOn />
          <ParamToggle label="Auto-Recalibrate" defaultOn />
          <ParamSelect label="Optimization" options={['Grid Search', 'Random Search', 'Bayesian', 'Genetic Algorithm']} />
        </div>
      </div>

      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider">💱 Trading Instruments</h3>
        <div className="space-y-3">
          <ParamToggle label="Forex Majors" defaultOn />
          <ParamToggle label="Forex Minors" defaultOn />
          <ParamToggle label="Gold (XAU)" defaultOn />
          <ParamToggle label="Silver (XAG)" defaultOn={false} />
          <ParamToggle label="Crypto (BTC, ETH)" defaultOn />
          <ParamToggle label="Indices (US30, NAS100)" defaultOn />
          <ParamToggle label="Oil (WTI, Brent)" defaultOn={false} />
          <ParamInput label="Max Spread (pips)" defaultValue="5" />
        </div>
      </div>

      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider">⏰ Session Settings</h3>
        <div className="space-y-4">
          <ParamToggle label="Trade During Asian Session" defaultOn={false} />
          <ParamToggle label="Trade During London Session" defaultOn />
          <ParamToggle label="Trade During NY Session" defaultOn />
          <ParamToggle label="Avoid News Events" defaultOn />
          <ParamInput label="News Buffer (minutes)" defaultValue="30" />
          <ParamSelect label="Close All On Friday" options={['Never', 'Before NY Close', 'At NY Close']} />
        </div>
      </div>

      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider">🔔 Notifications</h3>
        <div className="space-y-4">
          <ParamToggle label="Trade Opened Alert" defaultOn />
          <ParamToggle label="Trade Closed Alert" defaultOn />
          <ParamToggle label="Drawdown Warning" defaultOn />
          <ParamToggle label="AI Signal Alert" defaultOn />
          <ParamToggle label="Email Notifications" defaultOn={false} />
          <ParamToggle label="Telegram Bot" defaultOn />
          <ParamInput label="Telegram Chat ID" defaultValue="" />
        </div>
      </div>
    </div>
  );
}

function ParamInput({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div>
      <label className="text-xs text-gray-400 block mb-1">{label}</label>
      <input
        type="text"
        defaultValue={defaultValue}
        className="w-full bg-black/40 border border-gray-700 rounded px-3 py-1.5 text-sm text-white focus:border-orange-500 focus:outline-none transition-colors"
      />
    </div>
  );
}

function ParamToggle({ label, defaultOn }: { label: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between">
      <label className="text-xs text-gray-400">{label}</label>
      <button
        onClick={() => setOn(!on)}
        className={`w-10 h-5 rounded-full transition-all ${on ? 'bg-orange-600' : 'bg-gray-700'}`}
      >
        <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

function ParamSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="text-xs text-gray-400 block mb-1">{label}</label>
      <select className="w-full bg-black/40 border border-gray-700 rounded px-3 py-1.5 text-sm text-white focus:border-orange-500 focus:outline-none">
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* MT5 Connection */}
      <div className="glass-panel rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-orange-400 font-bold text-sm uppercase tracking-wider">🔌 MetaTrader 5</h3>
          <span className={`text-xs px-2 py-0.5 rounded ${mt5Connected ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
            {mt5Connected ? '● Connected' : '● Disconnected'}
          </span>
        </div>
        <div className="space-y-3">
          <ParamInput label="Server Address" defaultValue="demo.metaquotes.net" />
          <ParamInput label="Port" defaultValue="443" />
          <ParamInput label="Login ID" defaultValue="51234567" />
          <div>
            <label className="text-xs text-gray-400 block mb-1">Password</label>
            <input type="password" defaultValue="password123" className="w-full bg-black/40 border border-gray-700 rounded px-3 py-1.5 text-sm text-white focus:border-orange-500 focus:outline-none" />
          </div>
          <ParamSelect label="Account Type" options={['Demo', 'Live', 'Contest']} />
          <ParamSelect label="Connection Protocol" options={['TCP/IP', 'WebSocket', 'REST API']} />
          <button
            onClick={() => setMt5Connected(!mt5Connected)}
            className={`w-full py-2 rounded-lg text-sm font-bold transition-all ${mt5Connected ? 'bg-red-600/20 text-red-400 border border-red-600/30' : 'bg-green-600/20 text-green-400 border border-green-600/30'}`}
          >
            {mt5Connected ? '⏹ Disconnect' : '▶ Connect'}
          </button>
        </div>
      </div>

      {/* WebSocket Connection */}
      <div className="glass-panel rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-orange-400 font-bold text-sm uppercase tracking-wider">🌐 WebSocket</h3>
          <span className={`text-xs px-2 py-0.5 rounded ${wsConnected ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
            {wsConnected ? '● Connected' : '● Disconnected'}
          </span>
        </div>
        <div className="space-y-3">
          <ParamInput label="WebSocket URL" defaultValue="wss://api.sanobot.ai/ws" />
          <ParamInput label="API Key" defaultValue="sk-xxxx-xxxx-xxxx" />
          <ParamInput label="Reconnect Interval (ms)" defaultValue="5000" />
          <ParamInput label="Heartbeat Interval (ms)" defaultValue="30000" />
          <ParamToggle label="Auto Reconnect" defaultOn />
          <ParamToggle label="SSL/TLS" defaultOn />
          <button
            onClick={() => setWsConnected(!wsConnected)}
            className={`w-full py-2 rounded-lg text-sm font-bold transition-all ${wsConnected ? 'bg-red-600/20 text-red-400 border border-red-600/30' : 'bg-green-600/20 text-green-400 border border-green-600/30'}`}
          >
            {wsConnected ? '⏹ Disconnect' : '▶ Connect'}
          </button>
        </div>
      </div>

      {/* REST API */}
      <div className="glass-panel rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-orange-400 font-bold text-sm uppercase tracking-wider">🔗 REST API</h3>
          <span className={`text-xs px-2 py-0.5 rounded ${apiConnected ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
            {apiConnected ? '● Connected' : '● Disconnected'}
          </span>
        </div>
        <div className="space-y-3">
          <ParamInput label="Base URL" defaultValue="https://api.sanobot.ai/v3" />
          <ParamInput label="API Token" defaultValue="Bearer eyJhbGciOi..." />
          <ParamInput label="Timeout (ms)" defaultValue="10000" />
          <ParamInput label="Rate Limit (req/min)" defaultValue="60" />
          <ParamSelect label="Auth Method" options={['Bearer Token', 'API Key', 'OAuth 2.0', 'Basic Auth']} />
          <ParamToggle label="Enable Retry" defaultOn />
          <ParamInput label="Max Retries" defaultValue="3" />
          <button
            onClick={() => setApiConnected(!apiConnected)}
            className={`w-full py-2 rounded-lg text-sm font-bold transition-all ${apiConnected ? 'bg-red-600/20 text-red-400 border border-red-600/30' : 'bg-green-600/20 text-green-400 border border-green-600/30'}`}
          >
            {apiConnected ? '⏹ Disconnect' : '▶ Connect'}
          </button>
        </div>
      </div>

      {/* Web/App Integration */}
      <div className="glass-panel rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-orange-400 font-bold text-sm uppercase tracking-wider">📱 Web/App Integration</h3>
          <span className="text-xs px-2 py-0.5 rounded bg-blue-600/20 text-blue-400">● Configured</span>
        </div>
        <div className="space-y-3">
          <ParamSelect label="Platform" options={['Web Dashboard', 'Mobile App (iOS)', 'Mobile App (Android)', 'Desktop App', 'Telegram Bot', 'Discord Bot']} />
          <ParamInput label="Webhook URL" defaultValue="https://hooks.sanobot.ai/trading" />
          <ParamInput label="Callback URL" defaultValue="https://app.sanobot.ai/callback" />
          <ParamToggle label="Enable Web Push" defaultOn />
          <ParamToggle label="Real-time Updates" defaultOn />
          <ParamInput label="Refresh Interval (ms)" defaultValue="1000" />
          <button className="w-full py-2 rounded-lg text-sm font-bold bg-blue-600/20 text-blue-400 border border-blue-600/30">
            🧪 Test Integration
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==================== CHART SCREENING ==================== */
function ChartPanel() {
  const [selectedPair, setSelectedPair] = useState('EUR/USD');
  const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD', 'BTC/USD', 'GBP/JPY', 'USD/CAD', 'AUD/USD'];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
      {/* Pair List */}
      <div className="glass-panel rounded-xl p-4">
        <h3 className="text-orange-400 font-bold mb-3 text-sm uppercase tracking-wider">📋 Pairs</h3>
        <div className="space-y-1">
          {pairs.map(pair => (
            <button
              key={pair}
              onClick={() => setSelectedPair(pair)}
              className={`w-full text-left px-3 py-2 rounded text-xs transition-all ${
                selectedPair === pair ? 'bg-orange-600/20 text-orange-400 border border-orange-600/30' : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-mono">{pair}</span>
                <span className={`text-[10px] ${Math.random() > 0.5 ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.random() > 0.5 ? '▲' : '▼'} {(Math.random() * 2).toFixed(2)}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="xl:col-span-3 glass-panel rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-orange-400 font-bold text-sm uppercase tracking-wider">📊 {selectedPair} - Chart Analysis</h3>
          <div className="flex gap-2">
            {['M5', 'M15', 'H1', 'H4', 'D1'].map(tf => (
              <button key={tf} className="px-2 py-1 text-[10px] rounded bg-white/5 text-gray-400 hover:text-orange-400 hover:bg-orange-600/10">
                {tf}
              </button>
            ))}
          </div>
        </div>
        {/* Simulated Chart */}
        <div className="relative h-64 bg-black/30 rounded-lg border border-gray-800 overflow-hidden">
          <svg viewBox="0 0 800 250" className="w-full h-full">
            {/* Grid */}
            {[...Array(5)].map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 50 + 25} x2="800" y2={i * 50 + 25} stroke="rgba(255,165,0,0.05)" strokeWidth="1" />
            ))}
            {[...Array(10)].map((_, i) => (
              <line key={`v${i}`} x1={i * 80 + 40} y1="0" x2={i * 80 + 40} y2="250" stroke="rgba(255,165,0,0.05)" strokeWidth="1" />
            ))}
            {/* Candlesticks */}
            {generateCandles().map((c, i) => (
              <g key={i}>
                <line x1={i * 25 + 30} y1={c.high} x2={i * 25 + 30} y2={c.low} stroke={c.bullish ? '#00cc66' : '#ff4444'} strokeWidth="1" />
                <rect x={i * 25 + 26} y={c.open} width="8" height={Math.abs(c.close - c.open)} fill={c.bullish ? '#00cc66' : '#ff4444'} />
              </g>
            ))}
            {/* MA Line */}
            <path d={generateMALine()} fill="none" stroke="rgba(255,165,0,0.6)" strokeWidth="1.5" />
            {/* Signal Arrow */}
            <polygon points="400,180 410,200 390,200" fill="#00ff88" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite" />
            </polygon>
          </svg>
          {/* Scan Line */}
          <div className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent animate-scan-line" />
        </div>

        {/* Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <IndicatorCard label="RSI (14)" value="62.4" status="neutral" />
          <IndicatorCard label="MACD" value="+0.0012" status="bullish" />
          <IndicatorCard label="ATR (14)" value="45.2" status="neutral" />
          <IndicatorCard label="ADX" value="28.7" status="bullish" />
          <IndicatorCard label="Stochastic" value="71.2" status="neutral" />
          <IndicatorCard label="Bollinger" value="Upper" status="neutral" />
          <IndicatorCard label="Volume" value="+23%" status="bullish" />
          <IndicatorCard label="AI Score" value="87.3" status="bullish" />
        </div>
      </div>
    </div>
  );
}

function generateCandles() {
  const candles = [];
  let price = 125;
  for (let i = 0; i < 30; i++) {
    const change = (Math.random() - 0.48) * 15;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * 8;
    const low = Math.min(open, close) - Math.random() * 8;
    candles.push({ open, close, high, low, bullish: close > open });
    price = close;
  }
  return candles;
}

function generateMALine() {
  let d = 'M 30 130';
  for (let i = 1; i < 30; i++) {
    const y = 130 + Math.sin(i * 0.3) * 30 + (Math.random() - 0.5) * 10;
    d += ` L ${i * 25 + 30} ${y}`;
  }
  return d;
}

function IndicatorCard({ label, value, status }: { label: string; value: string; status: string }) {
  const colors = {
    bullish: 'text-green-400 bg-green-600/10 border-green-600/30',
    bearish: 'text-red-400 bg-red-600/10 border-red-600/30',
    neutral: 'text-yellow-400 bg-yellow-600/10 border-yellow-600/30',
  };
  return (
    <div className={`p-2 rounded-lg border ${colors[status as keyof typeof colors]}`}>
      <div className="text-[10px] text-gray-500">{label}</div>
      <div className="text-sm font-mono font-bold">{value}</div>
    </div>
  );
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
    }, 100);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider">⚡ API Stress Test</h3>
        <div className="space-y-4">
          <ParamInput label="Target URL" defaultValue="https://api.sanobot.ai/v3/trade" />
          <ParamInput label="Concurrent Requests" defaultValue="1000" />
          <ParamInput label="Duration (seconds)" defaultValue="60" />
          <ParamSelect label="HTTP Method" options={['GET', 'POST', 'PUT', 'DELETE']} />
          <ParamInput label="Payload Size (KB)" defaultValue="2" />
          <ParamToggle label="Randomize Payload" defaultOn />
          <button
            onClick={runTest}
            disabled={running}
            className={`w-full py-2 rounded-lg text-sm font-bold transition-all ${running ? 'bg-yellow-600/20 text-yellow-400' : 'bg-orange-600/20 text-orange-400 border border-orange-600/30 hover:bg-orange-600/30'}`}
          >
            {running ? `⚡ Running... ${progress}%` : '▶ Run Stress Test'}
          </button>
          {running && (
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      </div>

      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider">📊 Test Results</h3>
        <div className="space-y-3">
          <ResultRow label="Total Requests" value="60,000" />
          <ResultRow label="Success Rate" value="99.7%" color="green" />
          <ResultRow label="Avg Response Time" value="12ms" />
          <ResultRow label="P95 Response Time" value="45ms" />
          <ResultRow label="P99 Response Time" value="120ms" />
          <ResultRow label="Max Response Time" value="340ms" color="yellow" />
          <ResultRow label="Requests/sec" value="1,000" />
          <ResultRow label="Error Rate" value="0.3%" color="green" />
          <ResultRow label="Throughput" value="2.4 MB/s" />
          <ResultRow label="CPU Usage" value="45%" color="yellow" />
          <ResultRow label="Memory Usage" value="1.2 GB" />
        </div>
      </div>

      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider">🔗 Connection Stress Test</h3>
        <div className="space-y-4">
          <ParamInput label="MT5 Max Connections" defaultValue="100" />
          <ParamInput label="WebSocket Max Clients" defaultValue="10000" />
          <ParamInput label="DB Connection Pool" defaultValue="50" />
          <ParamToggle label="Test Failover" defaultOn />
          <ParamToggle label="Test Reconnection" defaultOn />
          <ParamInput label="Latency Threshold (ms)" defaultValue="200" />
          <button className="w-full py-2 rounded-lg text-sm font-bold bg-purple-600/20 text-purple-400 border border-purple-600/30 hover:bg-purple-600/30">
            ▶ Run Connection Test
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider">🧠 AI Model Stress Test</h3>
        <div className="space-y-4">
          <ParamInput label="Inference Requests/sec" defaultValue="100" />
          <ParamInput label="Model Batch Size" defaultValue="32" />
          <ParamInput label="Max Latency (ms)" defaultValue="500" />
          <ParamToggle label="GPU Acceleration" defaultOn />
          <ParamToggle label="Model Caching" defaultOn />
          <ParamSelect label="Test Scenario" options={['Normal Load', 'Peak Load', 'Spike Test', 'Soak Test']} />
          <button className="w-full py-2 rounded-lg text-sm font-bold bg-blue-600/20 text-blue-400 border border-blue-600/30 hover:bg-blue-600/30">
            ▶ Run AI Stress Test
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultRow({ label, value, color }: { label: string; value: string; color?: string }) {
  const textColor = color === 'green' ? 'text-green-400' : color === 'yellow' ? 'text-yellow-400' : color === 'red' ? 'text-red-400' : 'text-white';
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-800/50">
      <span className="text-xs text-gray-400">{label}</span>
      <span className={`text-sm font-mono font-bold ${textColor}`}>{value}</span>
    </div>
  );
}

/* ==================== AI MODELS ==================== */
function AIModelsPanel() {
  const models = [
    { name: 'GPT-4o', provider: 'OpenAI', status: 'active', latency: '45ms', accuracy: '87.3%', desc: 'General Trading Analysis & Decision Making' },
    { name: 'Claude-3.5-Sonnet', provider: 'Anthropic', status: 'active', latency: '38ms', accuracy: '85.1%', desc: 'Pattern Recognition & Chart Analysis' },
    { name: 'Gemini-Pro', provider: 'Google', status: 'active', latency: '52ms', accuracy: '82.7%', desc: 'News Sentiment & Market Context' },
    { name: 'Custom-LSTM', provider: 'Internal', status: 'active', latency: '12ms', accuracy: '89.2%', desc: 'Time Series Price Prediction' },
    { name: 'XGBoost-Ensemble', provider: 'Internal', status: 'standby', latency: '8ms', accuracy: '84.5%', desc: 'Risk Assessment & Feature Importance' },
    { name: 'Transformer-XL', provider: 'Internal', status: 'standby', latency: '25ms', accuracy: '86.8%', desc: 'Volatility Forecasting' },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="xl:col-span-2 space-y-3">
        <h3 className="text-orange-400 font-bold text-sm uppercase tracking-wider">🧠 AI Model Registry</h3>
        {models.map((model, i) => (
          <div key={i} className="glass-panel rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${model.status === 'active' ? 'bg-green-600/20' : 'bg-gray-600/20'}`}>
                🤖
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-bold">{model.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${model.status === 'active' ? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'}`}>
                    {model.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500">{model.desc}</div>
                <div className="text-[10px] text-gray-600">Provider: {model.provider}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Latency: <span className="text-white font-mono">{model.latency}</span></div>
              <div className="text-xs text-gray-400">Accuracy: <span className="text-orange-400 font-mono">{model.accuracy}</span></div>
              <button className="mt-1 text-[10px] px-2 py-0.5 rounded bg-orange-600/20 text-orange-400 hover:bg-orange-600/30">
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Routing */}
      <div className="space-y-4">
        <div className="glass-panel rounded-xl p-6">
          <h3 className="text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider">🔀 AI Routing</h3>
          <div className="space-y-3">
            <ParamSelect label="Routing Strategy" options={['Round Robin', 'Weighted', 'Priority', 'Latency-Based', 'Confidence-Based']} />
            <ParamInput label="Fallback Model" defaultValue="Custom-LSTM" />
            <ParamInput label="Max Retry" defaultValue="3" />
            <ParamToggle label="Enable Load Balancing" defaultOn />
            <ParamToggle label="Auto Failover" defaultOn />
            <ParamToggle label="Cache Responses" defaultOn />
          </div>
        </div>

        <div className="glass-panel rounded-xl p-6">
          <h3 className="text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider">📐 Ensemble Config</h3>
          <div className="space-y-3">
            <ParamSelect label="Voting Method" options={['Majority', 'Weighted Average', 'Stacking', 'Boosting']} />
            <ParamInput label="Min Agreement (%)" defaultValue="60" />
            <ParamInput label="Conflict Resolution" defaultValue="conservative" />
            <ParamToggle label="Enable Meta-Learner" defaultOn />
          </div>
        </div>

        <div className="glass-panel rounded-xl p-6">
          <h3 className="text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider">🔑 API Keys</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">OpenAI API Key</label>
              <input type="password" defaultValue="sk-xxxx" className="w-full bg-black/40 border border-gray-700 rounded px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Anthropic API Key</label>
              <input type="password" defaultValue="sk-ant-xxxx" className="w-full bg-black/40 border border-gray-700 rounded px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Google AI Key</label>
              <input type="password" defaultValue="AIza-xxxx" className="w-full bg-black/40 border border-gray-700 rounded px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== TERMINAL ==================== */
function TerminalPanel({ isActive }: { isActive: boolean }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 h-full">
      <div className="xl:col-span-2 flex flex-col gap-4">
        <div className="glass-panel rounded-xl p-4 flex-1">
          <h3 className="text-orange-400 font-bold mb-3 text-sm uppercase tracking-wider">💻 AI Agent Terminal</h3>
          <CommandPrompt isActive={isActive} />
        </div>
        <div className="glass-panel rounded-xl p-6">
          <h3 className="text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider">⚙️ Terminal Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <ParamSelect label="Shell Type" options={['bash', 'zsh', 'powershell', 'custom']} />
            <ParamInput label="Max History Lines" defaultValue="10000" />
            <ParamToggle label="Auto-Complete" defaultOn />
            <ParamToggle label="Syntax Highlighting" defaultOn />
            <ParamSelect label="Font Size" options={['10px', '12px', '14px', '16px']} />
            <ParamToggle label="Show Timestamps" defaultOn />
          </div>
        </div>
      </div>
      <div className="glass-panel rounded-xl p-6">
        <h3 className="text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider">📋 System Logs</h3>
        <div className="space-y-2 font-mono text-[10px] max-h-[500px] overflow-y-auto scrollbar-thin">
          <LogEntry time="14:23:01" level="INFO" msg="Agent initialized successfully" />
          <LogEntry time="14:23:02" level="INFO" msg="Loading AI models..." />
          <LogEntry time="14:23:03" level="INFO" msg="GPT-4o loaded (45ms)" />
          <LogEntry time="14:23:04" level="INFO" msg="LSTM model loaded (12ms)" />
          <LogEntry time="14:23:05" level="WARN" msg="High latency detected on Gemini API" />
          <LogEntry time="14:23:06" level="INFO" msg="MT5 connection established" />
          <LogEntry time="14:23:07" level="INFO" msg="Market data feed active" />
          <LogEntry time="14:23:08" level="INFO" msg="Scanning 28 pairs..." />
          <LogEntry time="14:23:10" level="SUCCESS" msg="Signal: EUR/USD BUY conf:87%" />
          <LogEntry time="14:23:12" level="INFO" msg="Order placed: #12847563" />
          <LogEntry time="14:23:15" level="INFO" msg="Risk check passed" />
          <LogEntry time="14:23:18" level="WARN" msg="Spread widening on GBP/JPY" />
          <LogEntry time="14:23:20" level="INFO" msg="Position #12847563 in profit +12 pips" />
          <LogEntry time="14:23:25" level="SUCCESS" msg="Signal: XAU/USD BUY conf:92%" />
          <LogEntry time="14:23:28" level="INFO" msg="Order placed: #12847564" />
          <LogEntry time="14:23:30" level="ERROR" msg="Timeout on REST API call - retrying" />
          <LogEntry time="14:23:31" level="INFO" msg="REST API retry successful" />
          <LogEntry time="14:23:35" level="INFO" msg="Portfolio P&L: +$342.50" />
          <LogEntry time="14:23:40" level="INFO" msg="Heartbeat OK - all systems nominal" />
        </div>
      </div>
    </div>
  );
}

function LogEntry({ time, level, msg }: { time: string; level: string; msg: string }) {
  const colors: Record<string, string> = {
    INFO: 'text-blue-400',
    WARN: 'text-yellow-400',
    ERROR: 'text-red-400',
    SUCCESS: 'text-green-400',
  };
  return (
    <div className="flex gap-2 py-0.5 border-b border-gray-800/30">
      <span className="text-gray-600">{time}</span>
      <span className={`${colors[level]} w-14`}>{level}</span>
      <span className="text-gray-300">{msg}</span>
    </div>
  );
}

/* ==================== MULTI AGENT ==================== */
function MultiAgentPanel({ isActive }: { isActive: boolean }) {
  const agents = [
    { name: 'Agent-Alpha', role: 'Scalper', tf: 'M5', status: 'running', trades: 23, pnl: '+$456.20', ai: 'GPT-4o' },
    { name: 'Agent-Beta', role: 'Swing Trader', tf: 'H4', status: 'running', trades: 5, pnl: '+$1,234.80', ai: 'LSTM' },
    { name: 'Agent-Gamma', role: 'News Trader', tf: 'M15', status: 'standby', trades: 0, pnl: '$0.00', ai: 'Gemini' },
    { name: 'Agent-Delta', role: 'Arbitrage', tf: 'M1', status: 'running', trades: 47, pnl: '+$189.30', ai: 'XGBoost' },
    { name: 'Agent-Epsilon', role: 'Hedger', tf: 'H1', status: 'monitoring', trades: 3, pnl: '-$45.60', ai: 'Claude-3.5' },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="xl:col-span-2 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-orange-400 font-bold text-sm uppercase tracking-wider">🤖 Multi AI Agent Fleet</h3>
          <button className="px-3 py-1 text-xs rounded-lg bg-orange-600/20 text-orange-400 border border-orange-600/30 hover:bg-orange-600/30">
            + Deploy New Agent
          </button>
        </div>
        {agents.map((agent, i) => (
          <div key={i} className="glass-panel rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  agent.status === 'running' ? 'bg-green-600/20 animate-glow-pulse' :
                  agent.status === 'standby' ? 'bg-yellow-600/20' : 'bg-blue-600/20'
                }`}>
                  <span className="text-lg">🤖</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-bold">{agent.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      agent.status === 'running' ? 'bg-green-600/20 text-green-400' :
                      agent.status === 'standby' ? 'bg-yellow-600/20 text-yellow-400' :
                      'bg-blue-600/20 text-blue-400'
                    }`}>{agent.status}</span>
                  </div>
                  <div className="text-xs text-gray-500">{agent.role} | TF: {agent.tf} | AI: {agent.ai}</div>
                </div>
              </div>
              <div className="text-right flex items-center gap-4">
                <div>
                  <div className="text-xs text-gray-400">Trades: <span className="text-white font-mono">{agent.trades}</span></div>
                  <div className={`text-sm font-mono font-bold ${agent.pnl.startsWith('+') ? 'text-green-400' : agent.pnl.startsWith('-') ? 'text-red-400' : 'text-gray-400'}`}>
                    {agent.pnl}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="w-7 h-7 rounded bg-white/5 hover:bg-green-600/20 text-xs flex items-center justify-center">▶</button>
                  <button className="w-7 h-7 rounded bg-white/5 hover:bg-red-600/20 text-xs flex items-center justify-center">⏹</button>
                  <button className="w-7 h-7 rounded bg-white/5 hover:bg-blue-600/20 text-xs flex items-center justify-center">⚙</button>
                </div>
              </div>
            </div>
            {agent.status === 'running' && isActive && (
              <div className="mt-3 flex items-center gap-1">
                {[...Array(20)].map((_, j) => (
                  <div key={j} className="w-1 bg-green-500/60 rounded-full animate-pulse" style={{ height: `${Math.random() * 15 + 3}px`, animationDelay: `${j * 0.05}s` }} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Agent Config */}
      <div className="space-y-4">
        <div className="glass-panel rounded-xl p-6">
          <h3 className="text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider">🎯 Agent Orchestration</h3>
          <div className="space-y-3">
            <ParamSelect label="Orchestration Mode" options={['Independent', 'Cooperative', 'Hierarchical', 'Competitive']} />
            <ParamInput label="Max Concurrent Agents" defaultValue="5" />
            <ParamInput label="Global Risk Limit (%)" defaultValue="10" />
            <ParamToggle label="Enable Agent Communication" defaultOn />
            <ParamToggle label="Shared Memory Pool" defaultOn />
            <ParamSelect label="Conflict Resolution" options={['Priority-Based', 'Voting', 'Manager Override']} />
          </div>
        </div>

        <div className="glass-panel rounded-xl p-6">
          <h3 className="text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider">📊 Fleet Performance</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Total P&L</span>
              <span className="text-green-400 font-mono font-bold">+$1,834.70</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Total Trades</span>
              <span className="text-white font-mono">78</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Win Rate</span>
              <span className="text-orange-400 font-mono">71.8%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Active Agents</span>
              <span className="text-green-400 font-mono">3/5</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Avg Confidence</span>
              <span className="text-blue-400 font-mono">84.2%</span>
            </div>
            <div className="mt-3 p-2 rounded bg-green-600/10 border border-green-600/20">
              <div className="text-[10px] text-green-400">🟢 Fleet Status: OPTIMAL</div>
              <div className="text-[10px] text-gray-500">All agents performing within parameters</div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-6">
          <h3 className="text-orange-400 font-bold mb-4 text-sm uppercase tracking-wider">🔗 Agent Communication</h3>
          <div className="space-y-3">
            <ParamSelect label="Protocol" options={['gRPC', 'WebSocket', 'Redis Pub/Sub', 'Message Queue']} />
            <ParamInput label="Message TTL (ms)" defaultValue="5000" />
            <ParamToggle label="Encrypt Messages" defaultOn />
            <ParamToggle label="Enable Broadcast" defaultOn />
          </div>
        </div>
      </div>
    </div>
  );
}
