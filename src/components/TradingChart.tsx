import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTradingStore, type CandleData } from '../store/tradingStore';

// ============================================================
// TRADING CHART COMPONENT
// Features: Candlestick + Linear chart, volume bars, indicators
// ============================================================

export default function TradingChart() {
  const { chartData, marketConfig, updateMarketConfig, status } = useTradingStore();
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);
  const [showVolume, setShowVolume] = useState(true);
  const [showEMA, setShowEMA] = useState(true);
  const [showBB, setShowBB] = useState(false);

  const chartTypes: { id: 'candlestick' | 'linear'; label: string; icon: string }[] = [
    { id: 'candlestick', label: 'Candle', icon: '🕯️' },
    { id: 'linear', label: 'Line', icon: '📈' },
  ];

  const timeFrames = ['1m', '5m', '15m', '1h', '4h', '1d', '1w'] as const;

  // Calculate EMA values
  const emaValues = useMemo(() => {
    if (!showEMA || chartData.length < 21) return null;
    const closes = chartData.map(c => c.close);
    return {
      ema9: calcEMA(closes, 9),
      ema21: calcEMA(closes, 21),
    };
  }, [chartData, showEMA]);

  // Calculate Bollinger Bands
  const bbValues = useMemo(() => {
    if (!showBB || chartData.length < 20) return null;
    const closes = chartData.map(c => c.close);
    const period = 20;
    const stdDev = 2;
    const result: { upper: number; middle: number; lower: number }[] = [];
    
    for (let i = period - 1; i < closes.length; i++) {
      const slice = closes.slice(i - period + 1, i + 1);
      const mean = slice.reduce((a, b) => a + b, 0) / period;
      const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;
      const sd = Math.sqrt(variance);
      result.push({
        upper: mean + stdDev * sd,
        middle: mean,
        lower: mean - stdDev * sd,
      });
    }
    return result;
  }, [chartData, showBB]);

  // Chart dimensions
  const width = 600;
  const height = 280;
  const padding = { top: 20, right: 60, bottom: showVolume ? 60 : 30, left: 10 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const volumeHeight = showVolume ? 40 : 0;
  const priceHeight = chartHeight - volumeHeight;

  // Price range
  const prices = chartData.flatMap(c => [c.high, c.low]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;
  const pricePadding = priceRange * 0.05;

  const maxVolume = Math.max(...chartData.map(c => c.volume));

  // Scale functions
  const xScale = (i: number) => padding.left + (i / (chartData.length - 1)) * chartWidth;
  const yScale = (price: number) => padding.top + priceHeight - ((price - (minPrice - pricePadding)) / (priceRange + pricePadding * 2)) * priceHeight;
  const vScale = (vol: number) => (vol / maxVolume) * volumeHeight;

  // Build linear path
  const linearPath = chartData.map((c, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(c.close)}`).join(' ');

  // Build area path
  const areaPath = `${linearPath} L ${xScale(chartData.length - 1)} ${padding.top + priceHeight} L ${xScale(0)} ${padding.top + priceHeight} Z`;

  // Candle width
  const candleWidth = Math.max(2, (chartWidth / chartData.length) * 0.7);

  // Price labels
  const priceLabels = Array.from({ length: 5 }, (_, i) => {
    const price = minPrice + (priceRange * i) / 4;
    return { price, y: yScale(price) };
  });

  const lastPrice = chartData[chartData.length - 1]?.close || 0;
  const prevPrice = chartData[chartData.length - 2]?.close || lastPrice;
  const priceChange = lastPrice - prevPrice;
  const priceChangePercent = ((priceChange / prevPrice) * 100);

  return (
    <div className="space-y-2">
      {/* Chart Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white font-mono">{marketConfig.pair}</span>
          <span className={`text-xs font-mono ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {lastPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            <span className="ml-1 text-[10px]">{priceChange >= 0 ? '▲' : '▼'} {Math.abs(priceChangePercent).toFixed(2)}%</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          {chartTypes.map((ct) => (
            <button
              key={ct.id}
              onClick={() => updateMarketConfig({ chartType: ct.id })}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                marketConfig.chartType === ct.id
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {ct.icon} {ct.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time Frame Selector */}
      <div className="flex items-center gap-1">
        {timeFrames.map((tf) => (
          <button
            key={tf}
            onClick={() => {
              updateMarketConfig({ timeFrame: tf });
              const basePrice = marketConfig.type === 'crypto' ? 67000 : 
                               marketConfig.type === 'forex' ? 1.0850 :
                               marketConfig.type === 'stocks' ? 185 : 2050;
              useTradingStore.getState().generateChartData(80, basePrice);
            }}
            className={`px-1.5 py-0.5 rounded text-[9px] font-medium transition-all ${
              marketConfig.timeFrame === tf
                ? 'bg-purple-500/20 text-purple-300'
                : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            {tf}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setShowEMA(!showEMA)} className={`text-[9px] ${showEMA ? 'text-yellow-400' : 'text-gray-600'}`}>EMA</button>
          <button onClick={() => setShowBB(!showBB)} className={`text-[9px] ${showBB ? 'text-blue-400' : 'text-gray-600'}`}>BB</button>
          <button onClick={() => setShowVolume(!showVolume)} className={`text-[9px] ${showVolume ? 'text-cyan-400' : 'text-gray-600'}`}>VOL</button>
        </div>
      </div>

      {/* Chart SVG */}
      <div className="relative rounded-lg bg-gray-950/50 border border-gray-800/50 overflow-hidden">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-[200px]"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {priceLabels.map((label, i) => (
            <g key={i}>
              <line x1={padding.left} y1={label.y} x2={width - padding.right} y2={label.y} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              <text x={width - padding.right + 5} y={label.y + 3} fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">
                {label.price.toFixed(label.price > 100 ? 0 : 4)}
              </text>
            </g>
          ))}

          {/* Bollinger Bands */}
          {showBB && bbValues && (
            <g opacity="0.3">
              <path
                d={bbValues.map((bb, i) => {
                  const idx = i + 19;
                  return `${i === 0 ? 'M' : 'L'} ${xScale(idx)} ${yScale(bb.upper)}`;
                }).join(' ')}
                fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2 2"
              />
              <path
                d={bbValues.map((bb, i) => {
                  const idx = i + 19;
                  return `${i === 0 ? 'M' : 'L'} ${xScale(idx)} ${yScale(bb.lower)}`;
                }).join(' ')}
                fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2 2"
              />
            </g>
          )}

          {/* EMA Lines */}
          {showEMA && emaValues && (
            <g>
              <path
                d={emaValues.ema9.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i + 8)} ${yScale(v)}`).join(' ')}
                fill="none" stroke="#eab308" strokeWidth="1" opacity="0.7"
              />
              <path
                d={emaValues.ema21.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i + 20)} ${yScale(v)}`).join(' ')}
                fill="none" stroke="#f97316" strokeWidth="1" opacity="0.7"
              />
            </g>
          )}

          {/* Chart Content */}
          {marketConfig.chartType === 'candlestick' ? (
            <g>
              {chartData.map((candle, i) => {
                const isGreen = candle.close >= candle.open;
                const color = isGreen ? '#22c55e' : '#ef4444';
                const x = xScale(i);
                const bodyTop = yScale(Math.max(candle.open, candle.close));
                const bodyBottom = yScale(Math.min(candle.open, candle.close));
                const bodyHeight = Math.max(1, bodyBottom - bodyTop);
                
                return (
                  <g key={i} 
                     onMouseEnter={() => setHoveredCandle(candle)}
                     onMouseLeave={() => setHoveredCandle(null)}
                  >
                    {/* Wick */}
                    <line x1={x} y1={yScale(candle.high)} x2={x} y2={yScale(candle.low)} stroke={color} strokeWidth="0.8" />
                    {/* Body */}
                    <rect 
                      x={x - candleWidth / 2} 
                      y={bodyTop} 
                      width={candleWidth} 
                      height={bodyHeight} 
                      fill={isGreen ? color : color}
                      stroke={color}
                      strokeWidth="0.5"
                      opacity={isGreen ? 0.9 : 0.9}
                    />
                  </g>
                );
              })}
            </g>
          ) : (
            <g>
              {/* Area fill */}
              <path d={areaPath} fill="url(#areaGradient)" opacity="0.3" />
              {/* Line */}
              <path d={linearPath} fill="none" stroke="#a855f7" strokeWidth="1.5" />
              {/* Glow */}
              <path d={linearPath} fill="none" stroke="#a855f7" strokeWidth="3" opacity="0.2" filter="blur(2)" />
              
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                </linearGradient>
              </defs>
            </g>
          )}

          {/* Volume bars */}
          {showVolume && (
            <g>
              <line x1={padding.left} y1={padding.top + priceHeight} x2={width - padding.right} y2={padding.top + priceHeight} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
              {chartData.map((candle, i) => {
                const isGreen = candle.close >= candle.open;
                const x = xScale(i);
                const barHeight = vScale(candle.volume);
                const y = height - padding.bottom + (volumeHeight - barHeight);
                return (
                  <rect
                    key={`vol-${i}`}
                    x={x - candleWidth / 2}
                    y={y}
                    width={candleWidth}
                    height={barHeight}
                    fill={isGreen ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}
                  />
                );
              })}
            </g>
          )}

          {/* Current price line */}
          <line 
            x1={padding.left} 
            y1={yScale(lastPrice)} 
            x2={width - padding.right} 
            y2={yScale(lastPrice)} 
            stroke={priceChange >= 0 ? '#22c55e' : '#ef4444'} 
            strokeWidth="0.5" 
            strokeDasharray="3 3" 
            opacity="0.5" 
          />
          <rect 
            x={width - padding.right} 
            y={yScale(lastPrice) - 7} 
            width="55" 
            height="14" 
            rx="2"
            fill={priceChange >= 0 ? '#22c55e' : '#ef4444'} 
          />
          <text 
            x={width - padding.right + 5} 
            y={yScale(lastPrice) + 3} 
            fill="white" 
            fontSize="8" 
            fontFamily="monospace"
            fontWeight="bold"
          >
            {lastPrice.toFixed(lastPrice > 100 ? 2 : 4)}
          </text>

          {/* Active indicator */}
          {(status === 'running' || status === 'simulating') && (
            <motion.circle
              cx={xScale(chartData.length - 1)}
              cy={yScale(lastPrice)}
              r="3"
              fill="#a855f7"
              animate={{ r: [3, 6, 3], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </svg>

        {/* Hover tooltip */}
        {hoveredCandle && (
          <div className="absolute top-2 left-2 bg-gray-900/90 border border-gray-700/50 rounded px-2 py-1 text-[9px] font-mono text-gray-300 pointer-events-none">
            <div>O: {hoveredCandle.open.toFixed(2)} H: {hoveredCandle.high.toFixed(2)}</div>
            <div>L: {hoveredCandle.low.toFixed(2)} C: {hoveredCandle.close.toFixed(2)}</div>
            <div>Vol: {hoveredCandle.volume.toLocaleString()}</div>
          </div>
        )}
      </div>

      {/* Chart Footer */}
      <div className="flex items-center justify-between text-[9px] text-gray-600">
        <span>Candles: {chartData.length} | {marketConfig.timeFrame}</span>
        <span className="flex items-center gap-2">
          {showEMA && <span className="text-yellow-500">━ EMA 9/21</span>}
          {showBB && <span className="text-blue-500">━ BB(20,2)</span>}
        </span>
      </div>
    </div>
  );
}

// EMA calculation helper
function calcEMA(data: number[], period: number): number[] {
  const multiplier = 2 / (period + 1);
  const result: number[] = [];
  let ema = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(0);
    } else if (i === period - 1) {
      result.push(ema);
    } else {
      ema = (data[i] - ema) * multiplier + ema;
      result.push(ema);
    }
  }
  return result;
}
