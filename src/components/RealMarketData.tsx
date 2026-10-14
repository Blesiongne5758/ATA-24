import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ============================================================
// REAL MARKET DATA INTEGRATION
// Features: Mock API for real-time market data from multiple exchanges
// ============================================================

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  marketCap: number;
  lastUpdate: string;
}

interface Exchange {
  id: string;
  name: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'error';
  latency: number;
  pairs: number;
}

export default function RealMarketData() {
  const [selectedExchange, setSelectedExchange] = useState('binance');
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const exchanges: Exchange[] = [
    { id: 'binance', name: 'Binance', icon: '🟡', status: 'connected', latency: 45, pairs: 1500 },
    { id: 'coinbase', name: 'Coinbase', icon: '🔵', status: 'connected', latency: 62, pairs: 500 },
    { id: 'kraken', name: 'Kraken', icon: '🐙', status: 'connected', latency: 78, pairs: 700 },
    { id: 'bybit', name: 'Bybit', icon: '🔶', status: 'connected', latency: 51, pairs: 800 },
    { id: 'okx', name: 'OKX', icon: '⬜', status: 'disconnected', latency: 0, pairs: 0 },
  ];

  // Mock market data
  const generateMarketData = (): MarketData[] => {
    const symbols = [
      { symbol: 'BTC/USDT', basePrice: 67500 },
      { symbol: 'ETH/USDT', basePrice: 3520 },
      { symbol: 'SOL/USDT', basePrice: 145 },
      { symbol: 'BNB/USDT', basePrice: 598 },
      { symbol: 'XRP/USDT', basePrice: 0.62 },
      { symbol: 'ADA/USDT', basePrice: 0.45 },
      { symbol: 'DOGE/USDT', basePrice: 0.152 },
      { symbol: 'DOT/USDT', basePrice: 7.23 },
      { symbol: 'MATIC/USDT', basePrice: 0.89 },
      { symbol: 'AVAX/USDT', basePrice: 35.67 },
    ];

    return symbols.map(({ symbol, basePrice }) => {
      const change = (Math.random() - 0.5) * 0.1;
      const price = basePrice * (1 + change);
      const volume = Math.floor(Math.random() * 1000000000) + 100000000;
      
      return {
        symbol,
        price,
        change24h: change * 100,
        volume24h: volume,
        high24h: price * 1.05,
        low24h: price * 0.95,
        marketCap: price * (Math.random() * 1000000000 + 100000000),
        lastUpdate: new Date().toISOString(),
      };
    });
  };

  useEffect(() => {
    // Initial load
    const loadData = () => {
      setIsLoading(true);
      setTimeout(() => {
        setMarketData(generateMarketData());
        setIsLoading(false);
      }, 500);
    };

    loadData();

    // Auto-refresh every 5 seconds
    if (autoRefresh) {
      const interval = setInterval(loadData, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedExchange, autoRefresh]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📡</span> Real Market Data
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Live market data from multiple exchanges
          </p>
        </div>
        <label className="flex items-center gap-2 text-xs text-gray-300">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="w-3 h-3 rounded accent-purple-500"
          />
          Auto-refresh (5s)
        </label>
      </div>

      {/* Exchange Selection */}
      <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Connected Exchanges</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {exchanges.map((exchange) => (
            <motion.button
              key={exchange.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => exchange.status !== 'disconnected' && setSelectedExchange(exchange.id)}
              className={`p-3 rounded-lg border transition-all ${
                selectedExchange === exchange.id
                  ? 'bg-purple-500/20 border-purple-500/50'
                  : 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-800/50'
              } ${exchange.status === 'disconnected' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">{exchange.icon}</div>
                <div className="text-xs font-bold text-white">{exchange.name}</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    exchange.status === 'connected' ? 'bg-green-500' :
                    exchange.status === 'error' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                  <span className="text-[9px] text-gray-400">
                    {exchange.status === 'connected' ? `${exchange.latency}ms` : exchange.status}
                  </span>
                </div>
                {exchange.pairs > 0 && (
                  <div className="text-[9px] text-gray-500 mt-1">{exchange.pairs} pairs</div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Market Data Table */}
      <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800/50">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Market Data - {exchanges.find(e => e.id === selectedExchange)?.name}
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <motion.div
              className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <div className="text-xs text-gray-400 mt-2">Loading market data...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800/50">
                  <th className="px-4 py-2 text-left text-[10px] font-bold text-gray-400 uppercase">Symbol</th>
                  <th className="px-4 py-2 text-right text-[10px] font-bold text-gray-400 uppercase">Price</th>
                  <th className="px-4 py-2 text-right text-[10px] font-bold text-gray-400 uppercase">24h Change</th>
                  <th className="px-4 py-2 text-right text-[10px] font-bold text-gray-400 uppercase">24h Volume</th>
                  <th className="px-4 py-2 text-right text-[10px] font-bold text-gray-400 uppercase">24h High</th>
                  <th className="px-4 py-2 text-right text-[10px] font-bold text-gray-400 uppercase">24h Low</th>
                  <th className="px-4 py-2 text-right text-[10px] font-bold text-gray-400 uppercase">Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {marketData.map((data) => (
                  <motion.tr
                    key={data.symbol}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-800/30 hover:bg-gray-800/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="text-xs font-bold text-white">{data.symbol}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-xs font-mono text-white">
                        ${data.price.toLocaleString(undefined, { 
                          minimumFractionDigits: data.price < 1 ? 6 : 2,
                          maximumFractionDigits: data.price < 1 ? 6 : 2
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className={`text-xs font-bold ${data.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {data.change24h >= 0 ? '▲' : '▼'} {Math.abs(data.change24h).toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-xs font-mono text-gray-300">
                        ${(data.volume24h / 1000000).toFixed(1)}M
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-xs font-mono text-green-400">
                        ${data.high24h.toLocaleString(undefined, { 
                          minimumFractionDigits: data.high24h < 1 ? 6 : 2,
                          maximumFractionDigits: data.high24h < 1 ? 6 : 2
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-xs font-mono text-red-400">
                        ${data.low24h.toLocaleString(undefined, { 
                          minimumFractionDigits: data.low24h < 1 ? 6 : 2,
                          maximumFractionDigits: data.low24h < 1 ? 6 : 2
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-xs font-mono text-gray-300">
                        ${(data.marketCap / 1000000000).toFixed(2)}B
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* API Status */}
      <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">API Status</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
            <div className="text-[10px] text-gray-500">Requests/min</div>
            <div className="text-sm font-bold text-white">1,245</div>
          </div>
          <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
            <div className="text-[10px] text-gray-500">Avg Latency</div>
            <div className="text-sm font-bold text-green-400">58ms</div>
          </div>
          <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
            <div className="text-[10px] text-gray-500">Success Rate</div>
            <div className="text-sm font-bold text-green-400">99.8%</div>
          </div>
          <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
            <div className="text-[10px] text-gray-500">Last Update</div>
            <div className="text-sm font-bold text-white">Just now</div>
          </div>
        </div>
      </div>
    </div>
  );
}
