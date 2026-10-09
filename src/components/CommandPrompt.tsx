import { useState, useRef, useEffect } from 'react';

interface Message {
  type: 'input' | 'output' | 'system' | 'error' | 'success';
  text: string;
  timestamp: Date;
}

export default function CommandPrompt({ isActive }: { isActive: boolean }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { type: 'system', text: '🤖 Sanobot AI Trading Agent v4.0.0 — Quantum Neural Engine', timestamp: new Date() },
    { type: 'system', text: '📡 Modules: MT5 | WebSocket | REST API | gRPC', timestamp: new Date() },
    { type: 'system', text: '🧠 Models: GPT-4o | Claude-3.5 | Gemini | LSTM | XGBoost', timestamp: new Date() },
    { type: 'system', text: '⚡ Type "help" for commands | "status" for agent info', timestamp: new Date() },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const processCommand = (cmd: string) => {
    const lower = cmd.toLowerCase().trim();
    const newMessages: Message[] = [{ type: 'input' as const, text: cmd, timestamp: new Date() }];

    const responses: Record<string, () => Message[]> = {
      help: () => [{ type: 'output', text: `Commands:
  status       → Agent status & metrics
  connect      → Connect to MT5
  scan         → Market scanner (28 pairs)
  trade        → AI trade analysis
  backtest     → Historical backtest
  stress       → API stress test
  models       → List AI models
  agents       → Active agent fleet
  deploy       → Deploy strategy
  stop         → Stop all agents
  clear        → Clear terminal
  ping         → Latency test`, timestamp: new Date() }],
      status: () => [{ type: 'success', text: `Agent: ${isActive ? '🟢 ACTIVE' : '🔴 IDLE'}
CPU: ${(Math.random()*30+20).toFixed(1)}% | RAM: ${(Math.random()*2+1.5).toFixed(1)}GB
Positions: ${Math.floor(Math.random()*5)} | P&L: ${Math.random()>0.5?'+':'-'}$${(Math.random()*500).toFixed(2)}`, timestamp: new Date() }],
      connect: () => {
        setTimeout(() => setMessages(p => [...p, { type: 'success', text: '✅ MT5 Connected | Latency: 12ms', timestamp: new Date() }]), 800);
        return [{ type: 'output', text: '🔌 Connecting to MT5...', timestamp: new Date() }];
      },
      scan: () => {
        setTimeout(() => setMessages(p => [...p, { type: 'success', text: `Scan Complete:
  EUR/USD: 🟢 Bullish (RSI:62)
  XAU/USD: 🟢 Strong Buy (ADX:35)
  BTC/USD: 🟢 Bullish (Vol:+23%)
  GBP/JPY: 🔴 Bearish (RSI:38)`, timestamp: new Date() }]), 1200);
        return [{ type: 'output', text: '📊 Scanning markets...', timestamp: new Date() }];
      },
      trade: () => {
        setTimeout(() => setMessages(p => [...p, { type: 'success', text: `Signal: EUR/USD BUY
Entry: 1.0845 | SL: 1.0820 | TP: 1.0895
Confidence: 87.3% | R:R 1:2
Model: GPT-4o + LSTM`, timestamp: new Date() }]), 1500);
        return [{ type: 'output', text: '🧠 AI analyzing...', timestamp: new Date() }];
      },
      models: () => [{ type: 'output', text: `AI Models:
  [1] GPT-4o (Active) — General Analysis
  [2] Claude-3.5 (Active) — Patterns
  [3] Gemini-Pro (Active) — Sentiment
  [4] Custom-LSTM (Active) — Time Series
  [5] XGBoost (Standby) — Risk
  [6] Transformer-XL (Standby) — Volatility`, timestamp: new Date() }],
      agents: () => [{ type: 'output', text: `Fleet:
  🤖 Alpha: Scalping (M5) — Running
  🤖 Beta: Swing (H4) — Running
  🤖 Gamma: News — Standby
  🤖 Delta: Arbitrage — Running
  🤖 Epsilon: Hedging — Monitoring`, timestamp: new Date() }],
      stress: () => {
        setTimeout(() => setMessages(p => [...p, { type: 'success', text: `Results:
  MT5: ✅ 1000 req/s (8ms)
  REST: ✅ 5000 req/s (3ms)
  WS: ✅ 10000 msg/s (1ms)
  AI: ⚠️ 150 req/s (200ms)`, timestamp: new Date() }]), 2000);
        return [{ type: 'output', text: '⚡ Stress testing...', timestamp: new Date() }];
      },
      deploy: () => {
        setTimeout(() => setMessages(p => [...p, { type: 'success', text: '✅ Deployed! ID: STRAT-2024-0847', timestamp: new Date() }]), 1000);
        return [{ type: 'output', text: '🚀 Deploying...', timestamp: new Date() }];
      },
      backtest: () => {
        setTimeout(() => setMessages(p => [...p, { type: 'success', text: `Backtest (2020-2024):
  Trades: 1,247 | Win: 68.3%
  PF: 2.14 | DD: 12.4%
  Sharpe: 1.87 | Net: +$14,523`, timestamp: new Date() }]), 1800);
        return [{ type: 'output', text: '📈 Running backtest...', timestamp: new Date() }];
      },
      stop: () => [{ type: 'error', text: '🛑 All agents stopped.', timestamp: new Date() }],
      clear: () => { setMessages([{ type: 'system', text: '🧹 Terminal cleared.', timestamp: new Date() }]); return []; },
      ping: () => [{ type: 'success', text: `MT5: 12ms | AI: 45ms | WS: 3ms | DB: 8ms`, timestamp: new Date() }],
    };

    if (lower === '') return;
    if (lower === 'clear') { processCommand('clear'); return; }

    const handler = responses[lower];
    if (handler) {
      const results = handler();
      if (results.length > 0) setMessages(p => [...p, ...newMessages, ...results]);
      else setMessages(p => [...p, ...newMessages]);
    } else if (lower.startsWith('switch')) {
      const model = cmd.split(' ')[1] || 'unknown';
      setMessages(p => [...p, ...newMessages, { type: 'success', text: `🔄 Switched to: ${model}`, timestamp: new Date() }]);
    } else {
      setMessages(p => [...p, ...newMessages, { type: 'error', text: `❌ Unknown: "${cmd}". Type "help"`, timestamp: new Date() }]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    processCommand(input);
    setInput('');
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden flex flex-col h-full border border-gray-800/30">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border-b border-gray-800/30">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/80" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
          <div className="w-2 h-2 rounded-full bg-green-500/80" />
        </div>
        <span className="text-[9px] text-cyan-500/60 font-mono ml-1">sanobot@quantum:~$</span>
        {isActive && <span className="ml-auto text-[9px] text-cyan-400 animate-pulse font-mono">● LIVE</span>}
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2.5 font-mono text-[10px] scrollbar-thin min-h-0" style={{ maxHeight: '280px' }}>
        {messages.map((msg, i) => (
          <div key={i} className="mb-0.5">
            {msg.type === 'input' && <div className="text-cyan-400"><span className="text-cyan-600">❯ </span>{msg.text}</div>}
            {msg.type === 'output' && <div className="text-gray-400 whitespace-pre-wrap">{msg.text}</div>}
            {msg.type === 'system' && <div className="text-blue-400/70">{msg.text}</div>}
            {msg.type === 'error' && <div className="text-red-400">{msg.text}</div>}
            {msg.type === 'success' && <div className="text-green-400 whitespace-pre-wrap">{msg.text}</div>}
          </div>
        ))}
        <div className="text-cyan-600"><span className="animate-blink">▊</span></div>
      </div>
      <form onSubmit={handleSubmit} className="flex border-t border-gray-800/30 bg-black/20">
        <span className="px-2 py-1.5 text-cyan-600 font-mono text-[10px]">❯</span>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent text-cyan-400 font-mono text-[10px] py-1.5 px-1 outline-none placeholder-gray-700"
          placeholder="Type command... (try 'help')" />
        <button type="submit" className="px-2.5 py-1.5 text-cyan-600 hover:text-cyan-400 text-[10px]">↵</button>
      </form>
    </div>
  );
}
