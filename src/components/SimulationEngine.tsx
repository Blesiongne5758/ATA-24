import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTradingStore } from '../store/tradingStore';

// ============================================================
// SIMULATION ENGINE COMPONENT
// Features: Full backtest simulation with equity curve, trade log
// ============================================================

export default function SimulationEngine() {
  const { 
    status, simulation, updateSimulation, addLog, setStatus, 
    aiSettings, riskSettings, chartData, marketConfig 
  } = useTradingStore();
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runSimulation = useCallback(() => {
    if (status !== 'simulating') return;

    const totalCandles = 1000;
    let currentCandle = 0;
    let equity = 10000;
    const equityCurve: number[] = [10000];
    const trades: any[] = [];
    let wins = 0;
    let losses = 0;

    intervalRef.current = setInterval(() => {
      if (currentCandle >= totalCandles) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setStatus('idle');
        updateSimulation({ isRunning: false, progress: 100 });
        addLog({ type: 'info', message: `✅ Backtest Complete! ${trades.length} trades executed` });
        addLog({ type: 'ai', message: `📊 Results: PnL $${(equity - 10000).toFixed(2)} | Win Rate: ${trades.length > 0 ? ((wins / trades.length) * 100).toFixed(1) : 0}%` });
        addLog({ type: 'system', message: `📈 Final Equity: $${equity.toFixed(2)} | Return: ${((equity / 10000 - 1) * 100).toFixed(2)}%` });
        return;
      }

      currentCandle++;
      const progress = (currentCandle / totalCandles) * 100;

      // Simulate AI decision making
      const confidence = Math.random();
      const shouldTrade = confidence > (aiSettings.confidenceThreshold / 100);

      if (shouldTrade && Math.random() > 0.6) {
        const isWin = Math.random() > 0.4; // 60% win rate simulation
        const pnlPercent = isWin 
          ? (Math.random() * riskSettings.takeProfit.percent * 0.8 + 0.5) 
          : -(Math.random() * riskSettings.stopLoss.fixedPercent * 0.8 + 0.3);
        const pnl = equity * (riskSettings.positionSizing.fixedPercent / 100) * (pnlPercent / 100);
        
        equity += pnl;
        if (isWin) wins++; else losses++;

        const trade = {
          id: `trade-${currentCandle}`,
          entryTime: currentCandle - 1,
          exitTime: currentCandle,
          type: Math.random() > 0.5 ? 'buy' : 'sell',
          entryPrice: 67000 + (Math.random() - 0.5) * 2000,
          exitPrice: 67000 + (Math.random() - 0.5) * 2000,
          pnl,
          pnlPercent,
          reason: isWin ? 'AI Signal: Strong Buy' : 'Stop Loss Hit',
        };
        trades.push(trade);

        if (currentCandle % 50 === 0) {
          const subAgentMessages = [
            `🔍 Sub-Agent 1: Pattern detected at candle #${currentCandle}`,
            `📊 Technical: RSI=${(30 + Math.random() * 40).toFixed(1)} | MACD=${(Math.random() > 0.5 ? '+' : '-')} ${(Math.random() * 50).toFixed(1)}`,
            `🐦 Sentiment: Score ${(Math.random() * 2 - 1).toFixed(2)} | ${isWin ? 'Bullish' : 'Bearish'}`,
            `⛓️ On-Chain: Whale movement detected, confidence ${(confidence * 100).toFixed(0)}%`,
            `🧠 Meta-Agent: Combined signal → ${isWin ? 'LONG' : 'SHORT'} @ conf ${(confidence * 100).toFixed(1)}%`,
          ];
          addLog({ type: 'ai', message: subAgentMessages[Math.floor(Math.random() * subAgentMessages.length)] });
        }
      }

      equityCurve.push(equity);

      updateSimulation({
        isRunning: true,
        progress,
        currentCandle,
        totalCandles,
        equity,
        trades: trades.slice(-50),
        equityCurve,
      });
    }, 30);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

  useEffect(() => {
    if (status === 'simulating') {
      const cleanup = runSimulation();
      return cleanup;
    }
  }, [status, runSimulation]);

  // Equity curve SVG
  const equityCurve = simulation.equityCurve;
  const maxEquity = Math.max(...equityCurve);
  const minEquity = Math.min(...equityCurve);
  const equityRange = maxEquity - minEquity || 1;

  const curveWidth = 560;
  const curveHeight = 120;
  const curvePath = equityCurve.map((eq, i) => {
    const x = (i / (equityCurve.length - 1 || 1)) * curveWidth;
    const y = curveHeight - ((eq - minEquity) / equityRange) * curveHeight;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const areaPath = `${curvePath} L ${curveWidth} ${curveHeight} L 0 ${curveHeight} Z`;
  const finalEquity = equityCurve[equityCurve.length - 1] || 10000;
  const totalReturn = ((finalEquity / 10000 - 1) * 100);
  const isProfit = totalReturn >= 0;

  return (
    <div className="space-y-3">
      {/* Simulation Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Backtest Engine</div>
          <div className="text-xs font-bold text-gray-200">
            {marketConfig.pair} • {marketConfig.timeFrame} • {aiSettings.model.replace(/_/g, ' ')}
          </div>
        </div>
        <div className={`text-right ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
          <div className="text-sm font-bold font-mono">${finalEquity.toFixed(2)}</div>
          <div className="text-[10px] font-mono">{isProfit ? '+' : ''}{totalReturn.toFixed(2)}%</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[9px] text-gray-500">
          <span>Candle {simulation.currentCandle}/{simulation.totalCandles}</span>
          <span>{simulation.progress.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #7c3aed, #3b82f6, #06b6d4)',
            }}
            animate={{ width: `${simulation.progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        {/* Multi-routing indicators */}
        <div className="flex gap-2 text-[8px]">
          <span className={`flex items-center gap-0.5 ${simulation.isRunning ? 'text-purple-400' : 'text-gray-700'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${simulation.isRunning ? 'bg-purple-500 animate-pulse' : 'bg-gray-700'}`} />
            Technical
          </span>
          <span className={`flex items-center gap-0.5 ${simulation.isRunning ? 'text-blue-400' : 'text-gray-700'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${simulation.isRunning ? 'bg-blue-500 animate-pulse' : 'bg-gray-700'}`} />
            Sentiment
          </span>
          <span className={`flex items-center gap-0.5 ${simulation.isRunning ? 'text-cyan-400' : 'text-gray-700'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${simulation.isRunning ? 'bg-cyan-500 animate-pulse' : 'bg-gray-700'}`} />
            On-Chain
          </span>
          <span className={`flex items-center gap-0.5 ${simulation.isRunning ? 'text-green-400' : 'text-gray-700'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${simulation.isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-700'}`} />
            ML Model
          </span>
        </div>
      </div>

      {/* Equity Curve */}
      <div className="rounded-lg bg-gray-950/50 border border-gray-800/50 p-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] text-gray-500">Equity Curve</span>
          <span className="text-[9px] text-gray-500">Initial: $10,000</span>
        </div>
        <svg viewBox={`0 0 ${curveWidth} ${curveHeight}`} className="w-full h-[100px]" preserveAspectRatio="none">
          {/* Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
            <line key={i} x1="0" y1={curveHeight * pct} x2={curveWidth} y2={curveHeight * pct} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          ))}
          
          {/* Initial balance line */}
          <line 
            x1="0" 
            y1={curveHeight - ((10000 - minEquity) / equityRange) * curveHeight} 
            x2={curveWidth} 
            y2={curveHeight - ((10000 - minEquity) / equityRange) * curveHeight} 
            stroke="rgba(255,255,255,0.1)" 
            strokeWidth="0.5" 
            strokeDasharray="3 3" 
          />
          
          {/* Area */}
          <path d={areaPath} fill={isProfit ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'} />
          
          {/* Line */}
          <path d={curvePath} fill="none" stroke={isProfit ? '#22c55e' : '#ef4444'} strokeWidth="1.5" />
          
          {/* Current point */}
          {equityCurve.length > 0 && (
            <motion.circle
              cx={curveWidth}
              cy={curveHeight - ((finalEquity - minEquity) / equityRange) * curveHeight}
              r="3"
              fill={isProfit ? '#22c55e' : '#ef4444'}
              animate={{ r: [3, 5, 3] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </svg>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-1.5">
        <MiniStat label="Trades" value={simulation.trades.length.toString()} />
        <MiniStat 
          label="Win Rate" 
          value={simulation.trades.length > 0 
            ? `${((simulation.trades.filter(t => t.pnl > 0).length / simulation.trades.length) * 100).toFixed(0)}%` 
            : '—'} 
        />
        <MiniStat 
          label="Profit Factor" 
          value={simulation.trades.length > 0 
            ? (simulation.trades.filter(t => t.pnl > 0).reduce((s, t) => s + t.pnl, 0) / 
               Math.abs(simulation.trades.filter(t => t.pnl < 0).reduce((s, t) => s + t.pnl, 0) || 1)).toFixed(2)
            : '—'} 
        />
        <MiniStat 
          label="Max DD" 
          value={`${(Math.min(0, ...equityCurve.map((e, i) => {
            const peak = Math.max(...equityCurve.slice(0, i + 1));
            return ((e - peak) / peak) * 100;
          }))).toFixed(1)}%`}
          color="red"
        />
      </div>

      {/* Recent Trades */}
      {simulation.trades.length > 0 && (
        <div className="space-y-1">
          <div className="text-[9px] text-gray-500 uppercase tracking-wider">Recent Trades</div>
          <div className="max-h-[100px] overflow-y-auto space-y-0.5 custom-scrollbar">
            {simulation.trades.slice(-10).reverse().map((trade) => (
              <div key={trade.id} className={`flex items-center justify-between px-2 py-1 rounded text-[9px] ${
                trade.pnl > 0 ? 'bg-green-500/5 border border-green-500/10' : 'bg-red-500/5 border border-red-500/10'
              }`}>
                <div className="flex items-center gap-1.5">
                  <span className={trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}>
                    {trade.type === 'buy' ? '▲' : '▼'}
                  </span>
                  <span className="text-gray-400 font-mono">{trade.entryPrice.toFixed(0)}</span>
                  <span className="text-gray-600">→</span>
                  <span className="text-gray-400 font-mono">{trade.exitPrice.toFixed(0)}</span>
                </div>
                <span className={`font-mono ${trade.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {trade.pnl > 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="p-1.5 rounded bg-gray-900/30 border border-gray-800/30 text-center">
      <div className="text-[8px] text-gray-600 uppercase">{label}</div>
      <div className={`text-[10px] font-bold font-mono ${
        color === 'red' ? 'text-red-400' : 'text-gray-200'
      }`}>{value}</div>
    </div>
  );
}
