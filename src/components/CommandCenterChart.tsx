import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTradingStore, type ChartSlot } from '../store/tradingStore';

interface CommandCenterChartProps {
  slot: ChartSlot;
}

export default function CommandCenterChart({ slot }: CommandCenterChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(true);
  const intervalRef = useRef<any>(null);
  const { status } = useTradingStore();

  // Generate initial chart data
  useEffect(() => {
    const generateInitialData = () => {
      const data = [];
      let price = slot.price;
      const now = Date.now();
      
      for (let i = 0; i < 100; i++) {
        const volatility = price * 0.015;
        const change = (Math.random() - 0.48) * volatility;
        const open = price;
        const close = price + change;
        const high = Math.max(open, close) + Math.random() * volatility * 0.5;
        const low = Math.min(open, close) - Math.random() * volatility * 0.5;
        const volume = Math.floor(Math.random() * 10000 + 1000);
        
        data.push({
          time: now - (100 - i) * 3600000,
          open: Math.round(open * 100) / 100,
          high: Math.round(high * 100) / 100,
          low: Math.round(low * 100) / 100,
          close: Math.round(close * 100) / 100,
          volume,
        });
        
        price = close;
      }
      
      return data;
    };
    
    setChartData(generateInitialData());
  }, [slot.symbol, slot.price]);

  // Live update
  useEffect(() => {
    if (isLive && status === 'running' && chartData.length > 0) {
      let trend = 0, momentum = 0;
      
      intervalRef.current = setInterval(() => {
        setChartData(prevData => {
          const lastCandle = prevData[prevData.length - 1];
          if (!lastCandle) return prevData;
          
          if (Math.random() < 0.05) trend = (Math.random() - 0.5) * 0.003;
          momentum = momentum * 0.95 + trend * 0.05;
          const volatility = 0.001 + Math.random() * 0.003;
          const noise = (Math.random() - 0.5) * volatility;
          const change = lastCandle.close * (momentum + noise);
          const newPrice = lastCandle.close + change;
          const now = Date.now();
          
          if (now - lastCandle.time > 5000) {
            // New candle
            const newCandle = {
              time: now,
              open: newPrice,
              high: newPrice,
              low: newPrice,
              close: newPrice,
              volume: Math.floor(Math.random() * 5000 + 1000),
            };
            return [...prevData.slice(-99), newCandle];
          } else {
            // Update current candle
            const updatedCandle = {
              ...lastCandle,
              high: Math.max(lastCandle.high, newPrice),
              low: Math.min(lastCandle.low, newPrice),
              close: newPrice,
              volume: lastCandle.volume + Math.floor(Math.random() * 500),
            };
            return [...prevData.slice(0, -1), updatedCandle];
          }
        });
      }, 500);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLive, status]);

  if (chartData.length === 0) return null;

  const lastPrice = chartData[chartData.length - 1]?.close || slot.price;
  const prevPrice = chartData[chartData.length - 2]?.close || lastPrice;
  const priceChange = lastPrice - prevPrice;
  const minPrice = Math.min(...chartData.map(c => c.low));
  const maxPrice = Math.max(...chartData.map(c => c.high));
  const priceRange = maxPrice - minPrice || 1;

  const colorMap: Record<string, string> = {
    green: '#22c55e',
    blue: '#3b82f6',
    purple: '#a855f7',
    cyan: '#06b6d4',
  };

  const lineColor = colorMap[slot.color] || '#a855f7';

  return (
    <div>
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full bg-${slot.color}-500 animate-pulse`} />
          <span className="text-sm font-bold text-white font-mono">{slot.pair}</span>
          <span className={`text-xs font-mono ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${lastPrice.toLocaleString(undefined, { 
              minimumFractionDigits: lastPrice < 1 ? 6 : 2,
              maximumFractionDigits: lastPrice < 1 ? 6 : 2
            })}
            <span className="ml-1 text-[10px]">
              {priceChange >= 0 ? '▲' : '▼'} {Math.abs((priceChange / prevPrice) * 100).toFixed(2)}%
            </span>
          </span>
          {isLive && status === 'running' && (
            <motion.div 
              className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/20 border border-red-500/40" 
              animate={{ opacity: [1, 0.5, 1] }} 
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-[9px] text-red-400 font-medium">LIVE</span>
            </motion.div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsLive(!isLive)} 
            className={`px-2 py-0.5 rounded text-[10px] font-medium ${
              isLive 
                ? 'bg-green-500/30 text-green-300 border border-green-500/50' 
                : 'bg-gray-700/30 text-gray-500 border border-gray-700/50'
            }`}
          >
            {isLive ? '● Live' : '○ Paused'}
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="relative rounded-lg bg-gray-950/50 border border-gray-800/50 overflow-hidden">
        <svg viewBox="0 0 600 200" className="w-full h-[180px]" preserveAspectRatio="none">
          {/* Candlesticks */}
          {chartData.map((candle, i) => {
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
                <rect 
                  x={x - 2} 
                  y={Math.min(yOpen, yClose)} 
                  width={4} 
                  height={Math.abs(yClose - yOpen) || 1} 
                  fill={color} 
                />
              </g>
            );
          })}

          {/* Current price line */}
          <line
            x1={0}
            y1={10 + ((maxPrice - lastPrice) / priceRange) * 180}
            x2={600}
            y2={10 + ((maxPrice - lastPrice) / priceRange) * 180}
            stroke={lineColor}
            strokeWidth="0.5"
            strokeDasharray="4 4"
            opacity="0.5"
          />
        </svg>
      </div>
    </div>
  );
}
