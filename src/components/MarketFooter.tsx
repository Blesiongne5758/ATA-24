import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTradingStore } from '../store/tradingStore';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

const MARKET_ASSETS = {
  crypto: [
    { symbol: 'BTCUSDT', name: 'Bitcoin', price: 67523.45, change: 2.34 },
    { symbol: 'ETHUSDT', name: 'Ethereum', price: 3521.89, change: -1.23 },
    { symbol: 'SOLUSDT', name: 'Solana', price: 145.67, change: 5.67 },
    { symbol: 'BNBUSDT', name: 'Binance Coin', price: 598.34, change: 0.89 },
    { symbol: 'XRPUSDT', name: 'Ripple', price: 0.62, change: -0.45 },
    { symbol: 'ADAUSDT', name: 'Cardano', price: 0.45, change: 1.23 },
  ],
  forex: [
    { symbol: 'EURUSD', name: 'Euro/US Dollar', price: 1.0856, change: 0.12 },
    { symbol: 'GBPUSD', name: 'British Pound/US Dollar', price: 1.2678, change: -0.23 },
    { symbol: 'USDJPY', name: 'US Dollar/Japanese Yen', price: 154.56, change: 0.34 },
    { symbol: 'AUDUSD', name: 'Australian Dollar/US Dollar', price: 0.6543, change: -0.56 },
    { symbol: 'USDCHF', name: 'US Dollar/Swiss Franc', price: 0.8876, change: 0.08 },
    { symbol: 'XAUUSD', name: 'Gold/US Dollar', price: 2345.67, change: 1.45 },
  ],
  stocks: [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 185.23, change: 1.56 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.67, change: -2.34 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 175.89, change: 0.78 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 420.34, change: 1.23 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 878.56, change: 3.45 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 185.12, change: -0.89 },
  ],
  commodities: [
    { symbol: 'XAUUSD', name: 'Gold', price: 2345.67, change: 1.45 },
    { symbol: 'XAGUSD', name: 'Silver', price: 28.34, change: -0.67 },
    { symbol: 'WTI', name: 'Crude Oil', price: 78.56, change: 2.12 },
    { symbol: 'NATGAS', name: 'Natural Gas', price: 2.45, change: -1.23 },
  ],
  indices: [
    { symbol: 'SPX500', name: 'S&P 500', price: 5234.56, change: 0.89 },
    { symbol: 'NAS100', name: 'NASDAQ 100', price: 18567.89, change: 1.23 },
    { symbol: 'US30', name: 'Dow Jones', price: 39876.45, change: -0.34 },
    { symbol: 'DAX', name: 'DAX 40', price: 18234.56, change: 0.56 },
    { symbol: 'NIKKEI', name: 'Nikkei 225', price: 38567.89, change: 1.78 },
  ],
  options: [
    { symbol: 'SPY_CALL', name: 'SPY Call Option', price: 450.23, change: 2.34 },
    { symbol: 'SPY_PUT', name: 'SPY Put Option', price: 12.45, change: -5.67 },
    { symbol: 'QQQ_CALL', name: 'QQQ Call Option', price: 480.67, change: 1.89 },
    { symbol: 'QQQ_PUT', name: 'QQQ Put Option', price: 15.23, change: -3.45 },
  ],
  memecoin: [
    { symbol: 'DOGEUSDT', name: 'Dogecoin', price: 0.1523, change: 8.45 },
    { symbol: 'SHIBUSDT', name: 'Shiba Inu', price: 0.00002534, change: 12.34 },
    { symbol: 'PEPEUSDT', name: 'Pepe', price: 0.00001245, change: -5.67 },
    { symbol: 'FLOKIUSDT', name: 'Floki Inu', price: 0.00018765, change: 15.23 },
    { symbol: 'BONKUSDT', name: 'Bonk', price: 0.00002834, change: -8.90 },
    { symbol: 'WIFUSDT', name: 'dogwifhat', price: 2.45, change: 23.45 },
  ],
};

interface MarketFooterProps {
  commandCenterMode?: boolean;
}

export default function MarketFooter({ commandCenterMode = false }: MarketFooterProps) {
  const { updateMarketConfig, generateChartData, updateCommandCenterChart } = useTradingStore();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const markets = [
    { key: 'crypto', icon: '₿', label: 'Crypto', color: 'from-yellow-500/20 to-orange-500/20' },
    { key: 'forex', icon: '💱', label: 'Forex', color: 'from-blue-500/20 to-cyan-500/20' },
    { key: 'stocks', icon: '📊', label: 'Stocks', color: 'from-green-500/20 to-emerald-500/20' },
    { key: 'commodities', icon: '🛢️', label: 'Commodity', color: 'from-amber-500/20 to-yellow-500/20' },
    { key: 'indices', icon: '📈', label: 'Indices', color: 'from-purple-500/20 to-pink-500/20' },
    { key: 'options', icon: '🎯', label: 'Options', color: 'from-red-500/20 to-rose-500/20' },
    { key: 'memecoin', icon: '🐸', label: 'Meme Coin', color: 'from-lime-500/20 to-green-500/20' },
  ];

  const handleMarketClick = (marketKey: string) => {
    if (commandCenterMode) {
      // Di Command Center, tampilkan slot selection dulu
      setActiveDropdown(activeDropdown === marketKey ? null : marketKey);
    } else {
      // Di mode normal, langsung tampilkan assets
      setActiveDropdown(activeDropdown === marketKey ? null : marketKey);
    }
  };

  const handleSlotSelect = (slotId: number) => {
    setSelectedSlot(slotId);
  };

  const handleAssetSelect = (marketKey: string, asset: MarketData) => {
    if (commandCenterMode && selectedSlot) {
      // Update chart di slot yang dipilih
      updateCommandCenterChart(selectedSlot, {
        marketType: marketKey as any,
        symbol: asset.symbol,
        pair: asset.symbol,
        price: asset.price,
      });
      setSelectedSlot(null);
    } else {
      // Mode normal - update main chart
      updateMarketConfig({
        type: marketKey as any,
        symbol: asset.symbol,
        pair: asset.symbol,
      });
      generateChartData(100, asset.price);
    }
    
    setActiveDropdown(null);
  };

  return (
    <div className="relative">
      {/* Market Icons Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {markets.map((market) => (
          <div key={market.key} className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMarketClick(market.key)}
              className={`w-full p-1.5 rounded-lg bg-gradient-to-br ${market.color} border border-gray-800/30 text-center transition-all hover:border-purple-500/50`}
            >
              <div className="text-sm">{market.icon}</div>
              <div className="text-[7px] text-gray-600 mt-0.5">{market.label}</div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {activeDropdown === market.key && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900/95 backdrop-blur-sm border border-purple-500/30 rounded-lg shadow-2xl z-50 overflow-hidden"
                >
                  {/* Header */}
                  <div className="p-2 border-b border-gray-800/50">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{market.icon}</span>
                      <span>{market.label} Assets</span>
                    </div>
                    
                    {/* Slot Selection untuk Command Center */}
                    {commandCenterMode && !selectedSlot && (
                      <div className="mt-2 pt-2 border-t border-gray-800/50">
                        <div className="text-[10px] text-gray-400 mb-1.5">Select Chart Slot:</div>
                        <div className="grid grid-cols-4 gap-1">
                          {[1, 2, 3, 4].map((slot) => (
                            <motion.button
                              key={slot}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleSlotSelect(slot)}
                              className="px-2 py-1 rounded bg-purple-500/20 border border-purple-500/40 text-[10px] text-purple-300 font-bold hover:bg-purple-500/30"
                            >
                              Chart {slot}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Selected Slot Indicator */}
                    {commandCenterMode && selectedSlot && (
                      <div className="mt-2 pt-2 border-t border-gray-800/50">
                        <div className="text-[10px] text-green-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                          Chart {selectedSlot} selected
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Asset List */}
                  <div className="max-h-64 overflow-y-auto custom-scrollbar">
                    {MARKET_ASSETS[market.key as keyof typeof MARKET_ASSETS].map((asset) => (
                      <motion.button
                        key={asset.symbol}
                        whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.1)' }}
                        onClick={() => handleAssetSelect(market.key, asset)}
                        className="w-full px-3 py-2 text-left hover:bg-purple-500/10 transition-colors border-b border-gray-800/30 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-white">{asset.symbol}</div>
                            <div className="text-[10px] text-gray-400">{asset.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-mono text-white">
                              ${asset.price.toLocaleString(undefined, { 
                                minimumFractionDigits: asset.price < 1 ? 6 : 2,
                                maximumFractionDigits: asset.price < 1 ? 6 : 2
                              })}
                            </div>
                            <div className={`text-[10px] font-mono ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {asset.change >= 0 ? '▲' : '▼'} {Math.abs(asset.change).toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Sub-agent Indicators */}
      <div className="mt-2 flex items-center justify-center gap-3 text-[8px] text-gray-600">
        <span className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-purple-500" />
          Technical
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-blue-500" />
          Sentiment
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-cyan-500" />
          On-Chain
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-green-500" />
          ML
        </span>
        <span className="text-purple-500">→ Meta-Agent → Decision</span>
      </div>
    </div>
  );
}
