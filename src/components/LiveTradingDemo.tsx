import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveTradingStore } from '../store/liveTradingStore';

// ============================================================
// LIVE TRADING DEMO COMPONENT
// Real-time AI trading simulation with $10,000 USD
// ============================================================

export default function LiveTradingDemo() {
  const {
    balance, equity, initialBalance, unrealizedPnL, realizedPnL,
    candles, currentPrice, tickCount, positions, closedPositions,
    totalTrades, winCount, lossCount,
    aiBrain, aiThoughts, signals, equityCurve,
    isRunning, speed,
    startDemo, stopDemo, resetDemo, setSpeed, tick,
  } = useLiveTradingStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Live tick loop
  useEffect(() => {
    if (isRunning) {
      const intervalMs = speed === 1 ? 200 : speed === 2 ? 100 : 50;
      intervalRef.current = setInterval(() => {
        tick();
      }, intervalMs);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, speed, tick]);

  // Calculate stats
  const totalReturn = ((equity - initialBalance) / initialBalance) * 100;
  const winRate = totalTrades > 0 ? (winCount / (winCount + lossCount)) * 100 : 0;
  const closedTrades = closedPositions.length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 flex-wrap">
            <span className="text-purple-400">🤖</span> AI Live Trading Demo
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
              isRunning 
                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                : 'bg-gray-700/30 text-gray-400 border-gray-600/30'
            }`}>
              {isRunning ? '● LIVE' : '○ STOPPED'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              BTC/USDT Perpetual
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time AI trading • Neural Multi-Routing Engine • Balance: <span className="text-white font-mono">$10,000.00 USD</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button
              onClick={startDemo}
              className="px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 font-bold text-sm hover:bg-green-500/30 transition-all"
            >
              ▶ START DEMO
            </button>
          ) : (
            <button
              onClick={stopDemo}
              className="px-4 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 font-bold text-sm hover:bg-yellow-500/30 transition-all"
            >
              ⏸ PAUSE
            </button>
          )}
          <button
            onClick={resetDemo}
            className="px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-300 font-bold text-sm hover:bg-gray-700 transition-all"
          >
            🔄 RESET
          </button>
        </div>
      </div>

      {/* Speed Control */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Speed:</span>
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              speed === s
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                : 'bg-gray-800/50 text-gray-500 border border-gray-700/50 hover:bg-gray-700/50'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Chart + Positions */}
        <div className="lg:col-span-2 space-y-4">
          {/* Live Chart */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
            {/* Chart Header with Price */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">BTC/USDT</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Perp
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    5x Lev
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold text-white font-mono tracking-tight">
                    ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  {candles.length > 1 && (
                    <span className={`text-sm font-mono font-bold ${
                      currentPrice >= candles[candles.length - 2].close
                        ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {currentPrice >= candles[candles.length - 2].close ? '▲' : '▼'}
                      {Math.abs(((currentPrice - candles[candles.length - 2].close) / candles[candles.length - 2].close) * 100).toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right space-y-1">
                <div>
                  <div className="text-[9px] text-gray-500 uppercase">AI Decision</div>
                  <div className={`text-base font-black ${
                    aiBrain.signal === 'strong_buy' ? 'text-green-400' :
                    aiBrain.signal === 'buy' ? 'text-green-300' :
                    aiBrain.signal === 'strong_sell' ? 'text-red-400' :
                    aiBrain.signal === 'sell' ? 'text-red-300' :
                    'text-gray-500'
                  }`}>
                    {aiBrain.signal === 'strong_buy' ? '🟢 STRONG BUY' :
                     aiBrain.signal === 'buy' ? '🟢 BUY' :
                     aiBrain.signal === 'strong_sell' ? '🔴 STRONG SELL' :
                     aiBrain.signal === 'sell' ? '🔴 SELL' :
                     '⚪ HOLD'}
                  </div>
                </div>
                <div className="flex items-center gap-1 justify-end">
                  <div className="text-[9px] text-gray-500">Confidence:</div>
                  <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: aiBrain.confidence > 0.7 ? 'linear-gradient(90deg, #22c55e, #10b981)' :
                                    aiBrain.confidence > 0.4 ? 'linear-gradient(90deg, #eab308, #f59e0b)' :
                                    'linear-gradient(90deg, #6b7280, #9ca3af)',
                      }}
                      animate={{ width: `${aiBrain.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-300 font-mono">{(aiBrain.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {/* Mini Stats Bar */}
            <div className="flex items-center gap-3 mb-2 text-[9px] text-gray-500 border-b border-gray-800/30 pb-2">
              <span>24h H: <span className="text-gray-300 font-mono">${Math.max(...candles.slice(-48).map(c => c.high)).toFixed(0)}</span></span>
              <span>24h L: <span className="text-gray-300 font-mono">${Math.min(...candles.slice(-48).map(c => c.low)).toFixed(0)}</span></span>
              <span>Vol: <span className="text-gray-300 font-mono">{(candles.slice(-10).reduce((s, c) => s + c.volume, 0) / 1000).toFixed(1)}K</span></span>
              <span className="ml-auto">Tick: <span className="text-purple-400 font-mono">{tickCount}</span></span>
            </div>

            {/* Chart SVG */}
            <LiveChart />

            {/* Open Positions Markers */}
            {positions.length > 0 && (
              <div className="mt-3 space-y-1">
                {positions.map((pos) => (
                  <div
                    key={pos.id}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
                      pos.side === 'long'
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${
                        pos.side === 'long' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {pos.side === 'long' ? '▲ LONG' : '▼ SHORT'}
                      </span>
                      <span className="text-xs text-gray-400">
                        Entry: ${pos.entryPrice.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-gray-600">
                        SL: ${pos.stopLoss.toFixed(2)} | TP: ${pos.takeProfit.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-bold font-mono ${
                        pos.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                      </div>
                      <div className={`text-[10px] font-mono ${
                        pos.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {pos.pnlPercent >= 0 ? '+' : ''}{pos.pnlPercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Equity Curve */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-400">Equity Curve</span>
              <span className={`text-sm font-bold font-mono ${
                totalReturn >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
              </span>
            </div>
            <EquityCurve />
          </div>
        </div>

        {/* Right Column: Stats + AI Brain + Trade History */}
        <div className="space-y-4">
          {/* Balance & Stats */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 space-y-3">
            <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Balance</div>
              <div className="text-2xl font-bold text-white font-mono">
                ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-[10px] text-gray-500">Equity</div>
                <div className="text-sm font-bold text-white font-mono">
                  ${equity.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500">Unrealized P&L</div>
                <div className={`text-sm font-bold font-mono ${
                  unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {unrealizedPnL >= 0 ? '+' : ''}${unrealizedPnL.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500">Realized P&L</div>
                <div className={`text-sm font-bold font-mono ${
                  realizedPnL >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {realizedPnL >= 0 ? '+' : ''}${realizedPnL.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500">Total Return</div>
                <div className={`text-sm font-bold font-mono ${
                  totalReturn >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-800/50 grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-[10px] text-gray-500">Trades</div>
                <div className="text-sm font-bold text-white">{closedTrades}</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-gray-500">Win Rate</div>
                <div className="text-sm font-bold text-green-400">{winRate.toFixed(0)}%</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] text-gray-500">W/L</div>
                <div className="text-sm font-bold text-white">
                  <span className="text-green-400">{winCount}</span>
                  /
                  <span className="text-red-400">{lossCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Brain */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">🧠</span>
              <span className="text-xs font-bold text-gray-400">AI Neural Engine</span>
              {isRunning && (
                <motion.div
                  className="w-2 h-2 rounded-full bg-purple-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">RSI</span>
                <span className="text-gray-300 font-mono">{aiBrain.rsi.toFixed(1)}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">MACD</span>
                <span className="text-gray-300 font-mono">{aiBrain.macd.toFixed(3)}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">Trend</span>
                <span className={`font-mono ${
                  aiBrain.trend === 'bullish' ? 'text-green-400' :
                  aiBrain.trend === 'bearish' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {aiBrain.trend.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">Momentum</span>
                <span className={`font-mono ${
                  aiBrain.momentum >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {aiBrain.momentum >= 0 ? '+' : ''}{aiBrain.momentum.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-gray-500">Volatility</span>
                <span className="text-gray-300 font-mono">{aiBrain.volatility.toFixed(2)}%</span>
              </div>
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
              AI Reasoning
            </div>
            <div className="space-y-1 max-h-[120px] overflow-y-auto custom-scrollbar">
              <AnimatePresence>
                {aiBrain.reasoning.slice(0, 5).map((reason, i) => (
                  <motion.div
                    key={`${reason}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] text-gray-400"
                  >
                    {reason}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* AI Thoughts / Activity Log */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
            <div className="text-xs font-bold text-gray-400 mb-2">📋 AI Activity Log</div>
            <div className="space-y-1 max-h-[150px] overflow-y-auto custom-scrollbar">
              <AnimatePresence>
                {aiThoughts.slice(0, 10).map((thought, i) => (
                  <motion.div
                    key={`${thought}-${i}`}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] text-gray-400"
                  >
                    {thought}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Recent Trades */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
            <div className="text-xs font-bold text-gray-400 mb-2">📊 Recent Trades</div>
            <div className="space-y-1 max-h-[150px] overflow-y-auto custom-scrollbar">
              {closedPositions.slice(0, 10).map((trade) => (
                <div
                  key={trade.id}
                  className={`flex items-center justify-between px-2 py-1.5 rounded text-[10px] ${
                    trade.pnl >= 0
                      ? 'bg-green-500/5 border border-green-500/10'
                      : 'bg-red-500/5 border border-red-500/10'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={trade.side === 'long' ? 'text-green-400' : 'text-red-400'}>
                      {trade.side === 'long' ? '▲' : '▼'}
                    </span>
                    <span className="text-gray-400 font-mono">
                      ${trade.entryPrice.toFixed(0)} → ${trade.exitPrice?.toFixed(0)}
                    </span>
                  </div>
                  <span className={`font-mono font-bold ${
                    trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                  </span>
                </div>
              ))}
              {closedPositions.length === 0 && (
                <div className="text-[10px] text-gray-600 text-center py-2">
                  No closed trades yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LIVE CHART COMPONENT
// ============================================================
function LiveChart() {
  const { candles, positions, signals } = useLiveTradingStore();

  const width = 800;
  const height = 300;
  const padding = { top: 20, right: 60, bottom: 30, left: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Price range
  const prices = candles.flatMap(c => [c.high, c.low]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;
  const pricePadding = priceRange * 0.1;

  // Scale functions
  const xScale = (i: number) => padding.left + (i / (candles.length - 1)) * chartWidth;
  const yScale = (price: number) => padding.top + chartHeight - ((price - (minPrice - pricePadding)) / (priceRange + pricePadding * 2)) * chartHeight;

  const candleWidth = Math.max(3, (chartWidth / candles.length) * 0.7);

  // EMA lines
  const closes = candles.map(c => c.close);
  const ema9 = calcEMAArray(closes, 9);
  const ema21 = calcEMAArray(closes, 21);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[250px]" preserveAspectRatio="none">
      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
        const price = minPrice - pricePadding + (priceRange + pricePadding * 2) * (1 - pct);
        return (
          <g key={i}>
            <line
              x1={padding.left}
              y1={padding.top + chartHeight * pct}
              x2={width - padding.right}
              y2={padding.top + chartHeight * pct}
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="0.5"
            />
            <text
              x={width - padding.right + 5}
              y={padding.top + chartHeight * pct + 3}
              fill="rgba(255,255,255,0.3)"
              fontSize="9"
              fontFamily="monospace"
            >
              ${price.toFixed(0)}
            </text>
          </g>
        );
      })}

      {/* EMA Lines */}
      <path
        d={ema9.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(v)}`).join(' ')}
        fill="none"
        stroke="#eab308"
        strokeWidth="1"
        opacity="0.6"
      />
      <path
        d={ema21.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(v)}`).join(' ')}
        fill="none"
        stroke="#f97316"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Candles */}
      {candles.map((candle, i) => {
        const isGreen = candle.close >= candle.open;
        const color = isGreen ? '#22c55e' : '#ef4444';
        const x = xScale(i);
        const bodyTop = yScale(Math.max(candle.open, candle.close));
        const bodyBottom = yScale(Math.min(candle.open, candle.close));
        const bodyHeight = Math.max(1, bodyBottom - bodyTop);

        return (
          <g key={i}>
            {/* Wick */}
            <line
              x1={x}
              y1={yScale(candle.high)}
              x2={x}
              y2={yScale(candle.low)}
              stroke={color}
              strokeWidth="1"
            />
            {/* Body */}
            <rect
              x={x - candleWidth / 2}
              y={bodyTop}
              width={candleWidth}
              height={bodyHeight}
              fill={color}
              stroke={color}
              strokeWidth="0.5"
            />
          </g>
        );
      })}

      {/* Position Entry/Exit Markers */}
      {positions.map((pos) => {
        const entryIndex = candles.findIndex(c => Math.abs(c.time - pos.entryTime) < 10000);
        if (entryIndex === -1) return null;

        return (
          <g key={pos.id}>
            {/* Entry marker */}
            <circle
              cx={xScale(entryIndex)}
              cy={yScale(pos.entryPrice)}
              r="4"
              fill={pos.side === 'long' ? '#22c55e' : '#ef4444'}
              stroke="white"
              strokeWidth="1"
            />
            {/* Entry line */}
            <line
              x1={padding.left}
              y1={yScale(pos.entryPrice)}
              x2={width - padding.right}
              y2={yScale(pos.entryPrice)}
              stroke={pos.side === 'long' ? '#22c55e' : '#ef4444'}
              strokeWidth="0.5"
              strokeDasharray="3 3"
              opacity="0.5"
            />
            {/* SL line */}
            <line
              x1={padding.left}
              y1={yScale(pos.stopLoss)}
              x2={width - padding.right}
              y2={yScale(pos.stopLoss)}
              stroke="#ef4444"
              strokeWidth="0.5"
              strokeDasharray="2 2"
              opacity="0.3"
            />
            {/* TP line */}
            <line
              x1={padding.left}
              y1={yScale(pos.takeProfit)}
              x2={width - padding.right}
              y2={yScale(pos.takeProfit)}
              stroke="#22c55e"
              strokeWidth="0.5"
              strokeDasharray="2 2"
              opacity="0.3"
            />
          </g>
        );
      })}

      {/* Current price line */}
      <line
        x1={padding.left}
        y1={yScale(candles[candles.length - 1]?.close || 0)}
        x2={width - padding.right}
        y2={yScale(candles[candles.length - 1]?.close || 0)}
        stroke="#a855f7"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.6"
      />
    </svg>
  );
}

// ============================================================
// EQUITY CURVE COMPONENT
// ============================================================
function EquityCurve() {
  const { equityCurve, initialBalance } = useLiveTradingStore();

  const width = 400;
  const height = 100;
  const padding = 10;

  const minEquity = Math.min(...equityCurve, initialBalance);
  const maxEquity = Math.max(...equityCurve, initialBalance);
  const equityRange = maxEquity - minEquity || 1;

  const xScale = (i: number) => padding + (i / (equityCurve.length - 1 || 1)) * (width - padding * 2);
  const yScale = (eq: number) => padding + (height - padding * 2) - ((eq - minEquity) / equityRange) * (height - padding * 2);

  const path = equityCurve.map((eq, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(eq)}`).join(' ');
  const areaPath = `${path} L ${xScale(equityCurve.length - 1)} ${height - padding} L ${xScale(0)} ${height - padding} Z`;

  const finalEquity = equityCurve[equityCurve.length - 1] || initialBalance;
  const isProfit = finalEquity >= initialBalance;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[80px]" preserveAspectRatio="none">
      {/* Initial balance line */}
      <line
        x1={padding}
        y1={yScale(initialBalance)}
        x2={width - padding}
        y2={yScale(initialBalance)}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="0.5"
        strokeDasharray="3 3"
      />
      {/* Area */}
      <path
        d={areaPath}
        fill={isProfit ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'}
      />
      {/* Line */}
      <path
        d={path}
        fill="none"
        stroke={isProfit ? '#22c55e' : '#ef4444'}
        strokeWidth="1.5"
      />
      {/* Current point */}
      {equityCurve.length > 0 && (
        <circle
          cx={xScale(equityCurve.length - 1)}
          cy={yScale(finalEquity)}
          r="3"
          fill={isProfit ? '#22c55e' : '#ef4444'}
        />
      )}
    </svg>
  );
}

// Helper: Calculate EMA array
function calcEMAArray(data: number[], period: number): number[] {
  if (data.length < period) return data;
  const multiplier = 2 / (period + 1);
  const result: number[] = [];
  let ema = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(data[i]);
    } else if (i === period - 1) {
      result.push(ema);
    } else {
      ema = (data[i] - ema) * multiplier + ema;
      result.push(ema);
    }
  }
  return result;
}
