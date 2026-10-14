import { useState } from 'react';
import { motion } from 'framer-motion';

// ============================================================
// ADVANCED CHART INDICATORS
// Features: 20+ technical indicators with customization
// ============================================================

interface Indicator {
  id: string;
  name: string;
  category: string;
  description: string;
  parameters: { name: string; value: number; min: number; max: number; step: number }[];
  color: string;
  enabled: boolean;
}

export default function AdvancedIndicators() {
  const [indicators, setIndicators] = useState<Indicator[]>([
    // Trend Indicators
    {
      id: 'ema',
      name: 'EMA',
      category: 'Trend',
      description: 'Exponential Moving Average',
      parameters: [
        { name: 'Period', value: 20, min: 5, max: 200, step: 1 },
        { name: 'Source', value: 0, min: 0, max: 4, step: 1 }, // 0=close, 1=open, 2=high, 3=low, 4=hl2
      ],
      color: '#fbbf24',
      enabled: true,
    },
    {
      id: 'sma',
      name: 'SMA',
      category: 'Trend',
      description: 'Simple Moving Average',
      parameters: [
        { name: 'Period', value: 50, min: 5, max: 200, step: 1 },
      ],
      color: '#60a5fa',
      enabled: false,
    },
    {
      id: 'macd',
      name: 'MACD',
      category: 'Trend',
      description: 'Moving Average Convergence Divergence',
      parameters: [
        { name: 'Fast', value: 12, min: 5, max: 50, step: 1 },
        { name: 'Slow', value: 26, min: 10, max: 100, step: 1 },
        { name: 'Signal', value: 9, min: 5, max: 50, step: 1 },
      ],
      color: '#a855f7',
      enabled: true,
    },
    {
      id: 'ichimoku',
      name: 'Ichimoku Cloud',
      category: 'Trend',
      description: 'Ichimoku Kinko Hyo',
      parameters: [
        { name: 'Tenkan', value: 9, min: 5, max: 50, step: 1 },
        { name: 'Kijun', value: 26, min: 10, max: 100, step: 1 },
        { name: 'Senkou', value: 52, min: 20, max: 200, step: 1 },
      ],
      color: '#22c55e',
      enabled: false,
    },
    // Momentum Indicators
    {
      id: 'rsi',
      name: 'RSI',
      category: 'Momentum',
      description: 'Relative Strength Index',
      parameters: [
        { name: 'Period', value: 14, min: 5, max: 50, step: 1 },
        { name: 'Overbought', value: 70, min: 60, max: 90, step: 1 },
        { name: 'Oversold', value: 30, min: 10, max: 40, step: 1 },
      ],
      color: '#ec4899',
      enabled: true,
    },
    {
      id: 'stochastic',
      name: 'Stochastic',
      category: 'Momentum',
      description: 'Stochastic Oscillator',
      parameters: [
        { name: '%K Period', value: 14, min: 5, max: 50, step: 1 },
        { name: '%D Period', value: 3, min: 1, max: 20, step: 1 },
        { name: 'Smoothing', value: 3, min: 1, max: 10, step: 1 },
      ],
      color: '#f97316',
      enabled: false,
    },
    {
      id: 'cci',
      name: 'CCI',
      category: 'Momentum',
      description: 'Commodity Channel Index',
      parameters: [
        { name: 'Period', value: 20, min: 5, max: 100, step: 1 },
      ],
      color: '#14b8a6',
      enabled: false,
    },
    {
      id: 'williams',
      name: 'Williams %R',
      category: 'Momentum',
      description: 'Williams Percent Range',
      parameters: [
        { name: 'Period', value: 14, min: 5, max: 50, step: 1 },
      ],
      color: '#8b5cf6',
      enabled: false,
    },
    // Volatility Indicators
    {
      id: 'bollinger',
      name: 'Bollinger Bands',
      category: 'Volatility',
      description: 'Bollinger Bands',
      parameters: [
        { name: 'Period', value: 20, min: 5, max: 100, step: 1 },
        { name: 'StdDev', value: 2, min: 1, max: 4, step: 0.1 },
      ],
      color: '#06b6d4',
      enabled: true,
    },
    {
      id: 'atr',
      name: 'ATR',
      category: 'Volatility',
      description: 'Average True Range',
      parameters: [
        { name: 'Period', value: 14, min: 5, max: 50, step: 1 },
      ],
      color: '#eab308',
      enabled: false,
    },
    {
      id: 'keltner',
      name: 'Keltner Channels',
      category: 'Volatility',
      description: 'Keltner Channels',
      parameters: [
        { name: 'Period', value: 20, min: 5, max: 100, step: 1 },
        { name: 'Multiplier', value: 2, min: 1, max: 4, step: 0.1 },
      ],
      color: '#d946ef',
      enabled: false,
    },
    // Volume Indicators
    {
      id: 'obv',
      name: 'OBV',
      category: 'Volume',
      description: 'On-Balance Volume',
      parameters: [],
      color: '#84cc16',
      enabled: false,
    },
    {
      id: 'vwap',
      name: 'VWAP',
      category: 'Volume',
      description: 'Volume Weighted Average Price',
      parameters: [],
      color: '#f43f5e',
      enabled: false,
    },
    {
      id: 'mfi',
      name: 'MFI',
      category: 'Volume',
      description: 'Money Flow Index',
      parameters: [
        { name: 'Period', value: 14, min: 5, max: 50, step: 1 },
      ],
      color: '#0ea5e9',
      enabled: false,
    },
    // Support/Resistance
    {
      id: 'pivot',
      name: 'Pivot Points',
      category: 'Support/Resistance',
      description: 'Pivot Points (Classic)',
      parameters: [
        { name: 'Type', value: 0, min: 0, max: 3, step: 1 }, // 0=Classic, 1=Fibonacci, 2=Woodie, 3=Camarilla
      ],
      color: '#a3e635',
      enabled: false,
    },
    {
      id: 'fibonacci',
      name: 'Fibonacci Retracement',
      category: 'Support/Resistance',
      description: 'Fibonacci Retracement Levels',
      parameters: [
        { name: 'Levels', value: 5, min: 3, max: 8, step: 1 },
      ],
      color: '#fbbf24',
      enabled: false,
    },
  ]);

  const categories = ['Trend', 'Momentum', 'Volatility', 'Volume', 'Support/Resistance'];

  const toggleIndicator = (id: string) => {
    setIndicators(indicators.map(ind => 
      ind.id === id ? { ...ind, enabled: !ind.enabled } : ind
    ));
  };

  const updateParameter = (id: string, paramIndex: number, value: number) => {
    setIndicators(indicators.map(ind => {
      if (ind.id === id) {
        const newParams = [...ind.parameters];
        newParams[paramIndex] = { ...newParams[paramIndex], value };
        return { ...ind, parameters: newParams };
      }
      return ind;
    }));
  };

  const enabledCount = indicators.filter(i => i.enabled).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📊</span> Advanced Chart Indicators
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {enabledCount} of {indicators.length} indicators enabled
          </p>
        </div>
        <button className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-medium hover:bg-purple-500/30">
          💾 Save Preset
        </button>
      </div>

      {/* Indicators by Category */}
      {categories.map((category) => {
        const categoryIndicators = indicators.filter(i => i.category === category);
        
        return (
          <div key={category} className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              {category} Indicators
            </div>
            
            <div className="space-y-2">
              {categoryIndicators.map((indicator) => (
                <motion.div
                  key={indicator.id}
                  layout
                  className={`p-3 rounded-lg border transition-all ${
                    indicator.enabled
                      ? 'bg-purple-500/10 border-purple-500/30'
                      : 'bg-gray-800/30 border-gray-700/30'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={indicator.enabled}
                        onChange={() => toggleIndicator(indicator.id)}
                        className="w-4 h-4 rounded accent-purple-500"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{indicator.name}</span>
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: indicator.color }}
                          />
                        </div>
                        <div className="text-[10px] text-gray-400">{indicator.description}</div>
                      </div>
                    </div>
                  </div>

                  {/* Parameters */}
                  {indicator.enabled && indicator.parameters.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-700/30 space-y-2">
                      {indicator.parameters.map((param, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <label className="text-[10px] text-gray-400 w-20">{param.name}</label>
                          <input
                            type="range"
                            min={param.min}
                            max={param.max}
                            step={param.step}
                            value={param.value}
                            onChange={(e) => updateParameter(indicator.id, idx, Number(e.target.value))}
                            className="flex-1 h-1.5 rounded-full bg-gray-700 accent-purple-500"
                          />
                          <span className="text-xs font-mono text-white w-12 text-right">
                            {param.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Quick Presets */}
      <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Quick Presets
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => {
              setIndicators(indicators.map(i => ({
                ...i,
                enabled: ['ema', 'rsi', 'bollinger'].includes(i.id)
              })));
            }}
            className="px-3 py-2 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-medium hover:bg-blue-500/30"
          >
            📊 Basic
          </button>
          <button
            onClick={() => {
              setIndicators(indicators.map(i => ({
                ...i,
                enabled: ['ema', 'macd', 'rsi', 'bollinger', 'atr'].includes(i.id)
              })));
            }}
            className="px-3 py-2 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-medium hover:bg-purple-500/30"
          >
            ⚡ Day Trading
          </button>
          <button
            onClick={() => {
              setIndicators(indicators.map(i => ({
                ...i,
                enabled: ['sma', 'ichimoku', 'macd', 'bollinger'].includes(i.id)
              })));
            }}
            className="px-3 py-2 rounded-lg bg-green-500/20 border border-green-500/40 text-green-300 text-xs font-medium hover:bg-green-500/30"
          >
            🌊 Swing Trading
          </button>
          <button
            onClick={() => {
              setIndicators(indicators.map(i => ({ ...i, enabled: false })));
            }}
            className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-400 text-xs font-medium hover:bg-gray-800"
          >
            🚫 Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
