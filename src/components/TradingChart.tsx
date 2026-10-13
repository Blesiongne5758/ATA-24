import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTradingStore } from '../store/tradingStore';

interface TradingChartProps {
  compact?: boolean;
}

export default function TradingChart({ compact = false }: TradingChartProps) {
  const { chartData, marketConfig, updateMarketConfig, status, addChartData } = useTradingStore();
  const [isLive, setIsLive] = useState(true);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (isLive && status === 'running') {
      let trend = 0, momentum = 0;
      intervalRef.current = setInterval(() => {
        const lastCandle = chartData[chartData.length - 1];
        if (!lastCandle) return;
        if (Math.random() < 0.05) trend = (Math.random() - 0.5) * 0.003;
        momentum = momentum * 0.95 + trend * 0.05;
        const volatility = 0.001 + Math.random() * 0.003;
        const noise = (Math.random() - 0.5) * volatility;
        const change = lastCandle.close * (momentum + noise);
        const newPrice = lastCandle.close + change;
        const now = Date.now();
        if (now - lastCandle.time > 5000) {
          addChartData({ time: now, open: newPrice, high: newPrice, low: newPrice, close: newPrice, volume: Math.floor(Math.random() * 5000 + 1000) });
        } else {
          const updatedCandle = { ...lastCandle, high: Math.max(lastCandle.high, newPrice), low: Math.min(lastCandle.low, newPrice), close: newPrice, volume: lastCandle.volume + Math.floor(Math.random() * 500) };
          useTradingStore.setState({ chartData: [...chartData.slice(0, -1), updatedCandle] });
        }
      }, 500);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isLive, status, chartData]);

  const lastPrice = chartData[chartData.length - 1]?.close || 0;
  const prevPrice = chartData[chartData.length - 2]?.close || lastPrice;
  const priceChange = lastPrice - prevPrice;
  const minPrice = Math.min(...chartData.map(c => c.low));
  const maxPrice = Math.max(...chartData.map(c => c.high));
  const priceRange = maxPrice - minPrice || 1;

  return (
    <div className={compact ? '' : 'space-y-2'}>
      {/* Header - only show when not in compact mode */}
      {!compact && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white font-mono">{marketConfig.pair}</span>
            <span className={`text-xs font-mono ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${lastPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              <span className="ml-1 text-[10px]">{priceChange >= 0 ? '▲' : '▼'} {Math.abs((priceChange / prevPrice) * 100).toFixed(2)}%</span>
            </span>
            {isLive && status === 'running' && (
              <motion.div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/20 border border-red-500/40" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span className="text-[9px] text-red-400 font-medium">LIVE</span>
              </motion.div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setIsLive(!isLive)} className={`px-2 py-0.5 rounded text-[10px] font-medium ${isLive ? 'bg-green-500/30 text-green-300 border border-green-500/50' : 'bg-gray-700/30 text-gray-500 border border-gray-700/50'}`}>
              {isLive ? '● Live' : '○ Paused'}
            </button>
            <button onClick={() => updateMarketConfig({ chartType: 'candlestick' })} className={`px-2 py-0.5 rounded text-[10px] ${marketConfig.chartType === 'candlestick' ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' : 'text-gray-500'}`}>🕯️</button>
            <button onClick={() => updateMarketConfig({ chartType: 'linear' })} className={`px-2 py-0.5 rounded text-[10px] ${marketConfig.chartType === 'linear' ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' : 'text-gray-500'}`}>📈</button>
          </div>
        </div>
      )}
      <div className="relative rounded-lg bg-gray-950/50 border border-gray-800/50 overflow-hidden">
        <svg viewBox="0 0 600 200" className="w-full h-[180px]" preserveAspectRatio="none">
          {marketConfig.chartType === 'candlestick' ? (
            chartData.map((candle, i) => {
              const x = (i / (chartData.length - 1)) * 580 + 10;
              const isGreen = candle.close >= candle.open;
              const color = isGreen ? '#22c55e' : '#ef4444';
              const yHigh = 10 + ((maxPrice - candle.high) / priceRange) * 180;
              const yLow = 10 + ((maxPrice - candle.low) / priceRange) * 180;
              const yOpen = 10 + ((maxPrice - candle.open) / priceRange) * 180;
              const yClose = 10 + ((maxPrice - candle.close) / priceRange) * 180;
              return (
                <g key={i}>
                  <line x1={x} y1={yHigh} x2={x} y2={yLow} stroke={color} strokeWidth="1" />
                  <rect x={x - 2} y={Math.min(yOpen, yClose)} width={4} height={Math.abs(yClose - yOpen) || 1} fill={color} />
                </g>
              );
            })
          ) : (
            <path d={chartData.map((c, i) => `${i === 0 ? 'M' : 'L'} ${(i / (chartData.length - 1)) * 580 + 10} ${10 + ((maxPrice - c.close) / priceRange) * 180}`).join(' ')} fill="none" stroke="#a855f7" strokeWidth="2" />
          )}
        </svg>
      </div>
    </div>
  );
}
