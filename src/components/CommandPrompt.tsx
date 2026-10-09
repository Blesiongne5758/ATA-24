import { useState, useRef, useEffect } from 'react';

interface Message {
  type: 'input' | 'output' | 'system' | 'error' | 'success';
  text: string;
  timestamp: Date;
}

export default function CommandPrompt({ isActive }: { isActive: boolean }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { type: 'system', text: '🤖 Sanobot AI Trading Agent v3.7.2 - Initialized', timestamp: new Date() },
    { type: 'system', text: '📡 Connection modules loaded: MT5, WebSocket, REST API', timestamp: new Date() },
    { type: 'system', text: '🧠 AI Models: GPT-4o, Claude-3.5, Gemini-Pro, Custom-LSTM', timestamp: new Date() },
    { type: 'system', text: '⚡ Type "help" for available commands', timestamp: new Date() },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const processCommand = (cmd: string) => {
    const lower = cmd.toLowerCase().trim();
    const newMessages: Message[] = [{ type: 'input', text: cmd, timestamp: new Date() }];

    if (lower === 'help') {
      newMessages.push({ type: 'output', text: `Available Commands:
  status       - Check agent status
  connect      - Connect to trading platform
  disconnect   - Disconnect from platform
  scan         - Run market scanner
  trade        - Execute trade analysis
  backtest     - Run backtesting
  stress       - Run stress test
  models       - List AI models
  switch <name> - Switch AI model
  agents       - List active agents
  deploy       - Deploy trading strategy
  stop         - Stop all agents
  clear        - Clear terminal
  ping         - Test connection latency`, timestamp: new Date() });
    } else if (lower === 'status') {
      newMessages.push({ type: 'success', text: `Agent Status: ${isActive ? '🟢 ACTIVE - Trading' : '🔴 IDLE'}\nCPU: ${(Math.random() * 30 + 20).toFixed(1)}% | RAM: ${(Math.random() * 2 + 1.5).toFixed(1)}GB\nUptime: ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m\nOpen Positions: ${Math.floor(Math.random() * 5)}\nDaily P&L: ${Math.random() > 0.5 ? '+' : '-'}$${(Math.random() * 500).toFixed(2)}`, timestamp: new Date() });
    } else if (lower === 'connect') {
      newMessages.push({ type: 'output', text: '🔌 Attempting connection to MT5 server...', timestamp: new Date() });
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'success', text: '✅ Connected to MT5 - Server: MetaQuotes-Demo | Latency: 12ms', timestamp: new Date() }]);
      }, 1000);
    } else if (lower === 'scan') {
      newMessages.push({ type: 'output', text: '📊 Running market scanner across 28 pairs...', timestamp: new Date() });
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'success', text: `Scan Complete:\n  EUR/USD: 🟢 Bullish (RSI: 62, MACD: +0.0012)\n  GBP/USD: 🔴 Bearish (RSI: 38, MACD: -0.0008)\n  USD/JPY: 🟡 Neutral (RSI: 51)\n  XAU/USD: 🟢 Strong Buy (RSI: 71, ADX: 35)\n  BTC/USD: 🟢 Bullish (RSI: 58, Vol: +23%)`, timestamp: new Date() }]);
      }, 1500);
    } else if (lower === 'trade') {
      newMessages.push({ type: 'output', text: '🧠 AI analyzing market conditions...', timestamp: new Date() });
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'success', text: `Trade Signal Generated:\n  Pair: EUR/USD | Direction: BUY\n  Entry: 1.0845 | SL: 1.0820 | TP: 1.0895\n  Confidence: 87.3% | Risk/Reward: 1:2\n  AI Model: GPT-4o + LSTM Ensemble\n  Reasoning: Bullish divergence on H4, support bounce confirmed`, timestamp: new Date() }]);
      }, 2000);
    } else if (lower === 'models') {
      newMessages.push({ type: 'output', text: `AI Models Available:\n  [1] GPT-4o (Active) - General Trading Analysis\n  [2] Claude-3.5-Sonnet - Pattern Recognition\n  [3] Gemini-Pro - News Sentiment Analysis\n  [4] Custom-LSTM - Time Series Prediction\n  [5] XGBoost-Ensemble - Risk Assessment\n  [6] Transformer-XL - Volatility Forecasting`, timestamp: new Date() });
    } else if (lower === 'agents') {
      newMessages.push({ type: 'output', text: `Active AI Agents:\n  🤖 Agent-Alpha: Scalping (M5) - Running\n  🤖 Agent-Beta: Swing Trading (H4) - Running\n  🤖 Agent-Gamma: News Trading - Standby\n  🤖 Agent-Delta: Arbitrage - Monitoring\n  🤖 Agent-Epsilon: Hedging - Active`, timestamp: new Date() });
    } else if (lower === 'stress') {
      newMessages.push({ type: 'output', text: '⚡ Running stress test on API endpoints...', timestamp: new Date() });
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'success', text: `Stress Test Results:\n  MT5 Connection: ✅ 1000 req/s (avg 8ms)\n  REST API: ✅ 5000 req/s (avg 3ms)\n  WebSocket: ✅ 10000 msg/s (avg 1ms)\n  AI Inference: ⚠️ 150 req/s (avg 200ms)\n  Database: ✅ 2000 qps (avg 5ms)`, timestamp: new Date() }]);
      }, 2500);
    } else if (lower === 'deploy') {
      newMessages.push({ type: 'output', text: '🚀 Deploying strategy to production...', timestamp: new Date() });
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'success', text: '✅ Strategy deployed successfully!\n  ID: STRAT-2024-0847\n  Mode: Live Trading\n  Max Drawdown: 5%\n  Lot Size: Dynamic (0.01-0.1)', timestamp: new Date() }]);
      }, 1500);
    } else if (lower === 'stop') {
      newMessages.push({ type: 'error', text: '🛑 All agents stopped. Positions remain open.', timestamp: new Date() });
    } else if (lower === 'clear') {
      setMessages([{ type: 'system', text: '🧹 Terminal cleared.', timestamp: new Date() }]);
      return;
    } else if (lower === 'ping') {
      newMessages.push({ type: 'success', text: `Ping Results:\n  MT5 Server: 12ms\n  AI API: 45ms\n  WebSocket: 3ms\n  Database: 8ms`, timestamp: new Date() });
    } else if (lower.startsWith('switch')) {
      const model = cmd.split(' ')[1] || 'unknown';
      newMessages.push({ type: 'success', text: `🔄 Switched to AI Model: ${model}\n  Loading model weights... Done\n  Calibration complete.`, timestamp: new Date() });
    } else if (lower === 'backtest') {
      newMessages.push({ type: 'output', text: '📈 Running backtest on historical data (2020-2024)...', timestamp: new Date() });
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'success', text: `Backtest Results:\n  Total Trades: 1,247\n  Win Rate: 68.3%\n  Profit Factor: 2.14\n  Max Drawdown: 12.4%\n  Sharpe Ratio: 1.87\n  Net Profit: +$14,523 (145.2%)`, timestamp: new Date() }]);
      }, 2000);
    } else if (lower === '') {
      return;
    } else {
      newMessages.push({ type: 'error', text: `❌ Unknown command: "${cmd}". Type "help" for available commands.`, timestamp: new Date() });
    }

    setMessages(prev => [...prev, ...newMessages]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    processCommand(input);
    setInput('');
  };

  return (
    <div className="glass-panel rounded-lg overflow-hidden flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-2 bg-black/50 border-b border-orange-900/30">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-xs text-orange-400 font-mono ml-2">sanobot@ai-trading:~$</span>
        {isActive && <span className="ml-auto text-xs text-green-400 animate-pulse">● LIVE</span>}
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 font-mono text-xs scrollbar-thin min-h-0" style={{ maxHeight: '300px' }}>
        {messages.map((msg, i) => (
          <div key={i} className="mb-1">
            {msg.type === 'input' && (
              <div className="text-green-400">
                <span className="text-orange-500">$ </span>{msg.text}
              </div>
            )}
            {msg.type === 'output' && (
              <div className="text-gray-300 whitespace-pre-wrap">{msg.text}</div>
            )}
            {msg.type === 'system' && (
              <div className="text-blue-400">{msg.text}</div>
            )}
            {msg.type === 'error' && (
              <div className="text-red-400">{msg.text}</div>
            )}
            {msg.type === 'success' && (
              <div className="text-green-400 whitespace-pre-wrap">{msg.text}</div>
            )}
          </div>
        ))}
        <div className="text-gray-500">
          <span className="animate-blink">█</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex border-t border-orange-900/30 bg-black/30">
        <span className="px-2 py-2 text-orange-500 font-mono text-sm">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent text-green-400 font-mono text-sm py-2 px-1 outline-none placeholder-gray-600"
          placeholder="Type command... (try 'help')"
        />
        <button type="submit" className="px-3 py-2 text-orange-400 hover:text-orange-300 text-sm">
          ↵
        </button>
      </form>
    </div>
  );
}
