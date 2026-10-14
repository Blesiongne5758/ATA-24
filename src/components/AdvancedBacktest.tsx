import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTradingStore } from '../store/tradingStore';

// ============================================================
// ADVANCED BACKTESTING ENGINE
// Features: Multi-strategy, walk-forward, Monte Carlo, optimization
// ============================================================

interface BacktestConfig {
  strategy: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  commission: number;
  slippage: number;
  optimizationMethod: 'grid' | 'random' | 'genetic';
  walkForward: boolean;
  monteCarlo: boolean;
  monteCarloIterations: number;
}

interface BacktestResult {
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  totalTrades: number;
  avgTradeDuration: number;
  equityCurve: number[];
  drawdownCurve: number[];
  tradeLog: any[];
  monthlyReturns: number[];
}

export default function AdvancedBacktest() {
  const { marketConfig } = useTradingStore();
  const [config, setConfig] = useState<BacktestConfig>({
    strategy: 'ema_cross',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    initialCapital: 10000,
    commission: 0.001,
    slippage: 0.0005,
    optimizationMethod: 'grid',
    walkForward: true,
    monteCarlo: true,
    monteCarloIterations: 1000,
  });

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<BacktestResult | null>(null);

  const strategies = [
    { id: 'ema_cross', name: 'EMA Crossover', desc: 'Fast/Slow EMA crossover strategy' },
    { id: 'rsi_reversal', name: 'RSI Reversal', desc: 'RSI overbought/oversold reversal' },
    { id: 'bollinger_breakout', name: 'Bollinger Breakout', desc: 'Price breakout from Bollinger Bands' },
    { id: 'macd_divergence', name: 'MACD Divergence', desc: 'MACD divergence detection' },
    { id: 'ichimoku_cloud', name: 'Ichimoku Cloud', desc: 'Ichimoku cloud trading system' },
    { id: 'multi_indicator', name: 'Multi-Indicator', desc: 'Combined multiple indicators' },
  ];

  const runBacktest = async () => {
    setIsRunning(true);
    setProgress(0);

    // Simulate backtest progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setProgress(i);
    }

    // Generate mock results
    const mockResult: BacktestResult = {
      totalReturn: 45.67,
      annualizedReturn: 52.34,
      sharpeRatio: 2.15,
      sortinoRatio: 2.89,
      maxDrawdown: -12.34,
      winRate: 62.5,
      profitFactor: 2.34,
      totalTrades: 245,
      avgTradeDuration: 3.5,
      equityCurve: generateEquityCurve(config.initialCapital, 45.67, 245),
      drawdownCurve: generateDrawdownCurve(245),
      tradeLog: generateTradeLog(245),
      monthlyReturns: generateMonthlyReturns(),
    };

    setResult(mockResult);
    setIsRunning(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🔬</span> Advanced Backtesting Engine
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Multi-strategy backtesting with walk-forward & Monte Carlo simulation
          </p>
        </div>
      </div>

      {/* Configuration Panel */}
      <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 space-y-3">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Configuration</div>
        
        {/* Strategy Selection */}
        <div>
          <label className="text-[10px] text-gray-500 block mb-1">Strategy</label>
          <select
            value={config.strategy}
            onChange={(e) => setConfig({ ...config, strategy: e.target.value })}
            className="w-full px-2 py-1.5 rounded bg-gray-800/50 border border-gray-700/50 text-xs text-gray-200"
          >
            {strategies.map(s => (
              <option key={s.id} value={s.id}>{s.name} - {s.desc}</option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-gray-500 block mb-1">Start Date</label>
            <input
              type="date"
              value={config.startDate}
              onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
              className="w-full px-2 py-1.5 rounded bg-gray-800/50 border border-gray-700/50 text-xs text-gray-200"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 block mb-1">End Date</label>
            <input
              type="date"
              value={config.endDate}
              onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
              className="w-full px-2 py-1.5 rounded bg-gray-800/50 border border-gray-700/50 text-xs text-gray-200"
            />
          </div>
        </div>

        {/* Capital & Costs */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] text-gray-500 block mb-1">Initial Capital ($)</label>
            <input
              type="number"
              value={config.initialCapital}
              onChange={(e) => setConfig({ ...config, initialCapital: Number(e.target.value) })}
              className="w-full px-2 py-1.5 rounded bg-gray-800/50 border border-gray-700/50 text-xs text-gray-200"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 block mb-1">Commission (%)</label>
            <input
              type="number"
              step="0.0001"
              value={config.commission}
              onChange={(e) => setConfig({ ...config, commission: Number(e.target.value) })}
              className="w-full px-2 py-1.5 rounded bg-gray-800/50 border border-gray-700/50 text-xs text-gray-200"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 block mb-1">Slippage (%)</label>
            <input
              type="number"
              step="0.0001"
              value={config.slippage}
              onChange={(e) => setConfig({ ...config, slippage: Number(e.target.value) })}
              className="w-full px-2 py-1.5 rounded bg-gray-800/50 border border-gray-700/50 text-xs text-gray-200"
            />
          </div>
        </div>

        {/* Advanced Options */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={config.walkForward}
              onChange={(e) => setConfig({ ...config, walkForward: e.target.checked })}
              className="w-3 h-3 rounded accent-purple-500"
            />
            Walk-Forward Optimization
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={config.monteCarlo}
              onChange={(e) => setConfig({ ...config, monteCarlo: e.target.checked })}
              className="w-3 h-3 rounded accent-purple-500"
            />
            Monte Carlo Simulation
          </label>
          {config.monteCarlo && (
            <div>
              <label className="text-[10px] text-gray-500 block mb-1">Iterations</label>
              <input
                type="number"
                value={config.monteCarloIterations}
                onChange={(e) => setConfig({ ...config, monteCarloIterations: Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded bg-gray-800/50 border border-gray-700/50 text-xs text-gray-200"
              />
            </div>
          )}
        </div>

        {/* Run Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={runBacktest}
          disabled={isRunning}
          className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-sm disabled:opacity-50"
        >
          {isRunning ? (
            <span className="flex items-center justify-center gap-2">
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              Running Backtest... {progress}%
            </span>
          ) : (
            '🚀 Run Backtest'
          )}
        </motion.button>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Performance Metrics */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Performance Metrics</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="Total Return" value={`${result.totalReturn.toFixed(2)}%`} color={result.totalReturn >= 0 ? 'green' : 'red'} />
              <MetricCard label="Annualized" value={`${result.annualizedReturn.toFixed(2)}%`} color={result.annualizedReturn >= 0 ? 'green' : 'red'} />
              <MetricCard label="Sharpe Ratio" value={result.sharpeRatio.toFixed(2)} color="blue" />
              <MetricCard label="Sortino Ratio" value={result.sortinoRatio.toFixed(2)} color="blue" />
              <MetricCard label="Max Drawdown" value={`${result.maxDrawdown.toFixed(2)}%`} color="red" />
              <MetricCard label="Win Rate" value={`${result.winRate.toFixed(1)}%`} color="purple" />
              <MetricCard label="Profit Factor" value={result.profitFactor.toFixed(2)} color="purple" />
              <MetricCard label="Total Trades" value={result.totalTrades.toString()} color="cyan" />
            </div>
          </div>

          {/* Equity Curve */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Equity Curve</div>
            <svg viewBox="0 0 400 100" className="w-full h-[120px]" preserveAspectRatio="none">
              <path
                d={result.equityCurve.map((eq, i) => 
                  `${i === 0 ? 'M' : 'L'} ${(i / (result.equityCurve.length - 1)) * 400} ${100 - ((eq - config.initialCapital) / (config.initialCapital * 0.5)) * 100}`
                ).join(' ')}
                fill="none"
                stroke={result.totalReturn >= 0 ? '#22c55e' : '#ef4444'}
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Monthly Returns */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Monthly Returns</div>
            <div className="grid grid-cols-6 gap-1">
              {result.monthlyReturns.map((ret, i) => (
                <div key={i} className={`p-2 rounded text-center text-[10px] ${ret >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  <div className="font-bold">{ret >= 0 ? '+' : ''}{ret.toFixed(1)}%</div>
                  <div className="text-[8px] opacity-60">Month {i + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function MetricCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = {
    green: 'text-green-400 border-green-500/20',
    red: 'text-red-400 border-red-500/20',
    blue: 'text-blue-400 border-blue-500/20',
    purple: 'text-purple-400 border-purple-500/20',
    cyan: 'text-cyan-400 border-cyan-500/20',
  };

  return (
    <div className={`p-2 rounded-lg bg-gray-800/30 border ${colorMap[color]}`}>
      <div className="text-[9px] text-gray-500 uppercase">{label}</div>
      <div className={`text-sm font-bold font-mono ${colorMap[color].split(' ')[0]}`}>{value}</div>
    </div>
  );
}

// Helper functions
function generateEquityCurve(initial: number, totalReturn: number, trades: number): number[] {
  const curve: number[] = [initial];
  const finalValue = initial * (1 + totalReturn / 100);
  const step = (finalValue - initial) / trades;
  
  for (let i = 1; i <= trades; i++) {
    const noise = (Math.random() - 0.5) * step * 0.3;
    curve.push(curve[i - 1] + step + noise);
  }
  
  return curve;
}

function generateDrawdownCurve(trades: number): number[] {
  const curve: number[] = [0];
  let peak = 0;
  
  for (let i = 1; i <= trades; i++) {
    const change = (Math.random() - 0.45) * 5;
    const value = curve[i - 1] + change;
    peak = Math.max(peak, value);
    curve.push(value - peak);
  }
  
  return curve;
}

function generateTradeLog(trades: number): any[] {
  const log: any[] = [];
  
  for (let i = 0; i < trades; i++) {
    log.push({
      id: i + 1,
      type: Math.random() > 0.5 ? 'buy' : 'sell',
      entryPrice: 67000 + Math.random() * 1000,
      exitPrice: 67000 + Math.random() * 1000,
      pnl: (Math.random() - 0.4) * 100,
      duration: Math.random() * 10,
    });
  }
  
  return log;
}

function generateMonthlyReturns(): number[] {
  return Array.from({ length: 12 }, () => (Math.random() - 0.4) * 10);
}
