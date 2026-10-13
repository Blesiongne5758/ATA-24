import { useTradingStore, type MarketType } from '../store/tradingStore';
import { motion } from 'framer-motion';

// ============================================================
// MARKET SELECTOR COMPONENT
// Features: Market type selection, symbol picker, leverage
// ============================================================

const MARKETS: Record<MarketType, { label: string; icon: string; symbols: { symbol: string; pair: string }[]; leverage: number[] }> = {
  crypto: {
    label: 'Crypto',
    icon: '₿',
    symbols: [
      { symbol: 'BTCUSDT', pair: 'BTC/USDT' },
      { symbol: 'ETHUSDT', pair: 'ETH/USDT' },
      { symbol: 'SOLUSDT', pair: 'SOL/USDT' },
      { symbol: 'BNBUSDT', pair: 'BNB/USDT' },
      { symbol: 'XRPUSDT', pair: 'XRP/USDT' },
      { symbol: 'ADAUSDT', pair: 'ADA/USDT' },
    ],
    leverage: [1, 2, 5, 10, 20, 50, 100],
  },
  forex: {
    label: 'Forex',
    icon: '💱',
    symbols: [
      { symbol: 'EURUSD', pair: 'EUR/USD' },
      { symbol: 'GBPUSD', pair: 'GBP/USD' },
      { symbol: 'USDJPY', pair: 'USD/JPY' },
      { symbol: 'AUDUSD', pair: 'AUD/USD' },
      { symbol: 'USDCHF', pair: 'USD/CHF' },
      { symbol: 'XAUUSD', pair: 'XAU/USD' },
    ],
    leverage: [1, 10, 50, 100, 200, 500],
  },
  stocks: {
    label: 'Stocks',
    icon: '📊',
    symbols: [
      { symbol: 'AAPL', pair: 'AAPL' },
      { symbol: 'TSLA', pair: 'TSLA' },
      { symbol: 'GOOGL', pair: 'GOOGL' },
      { symbol: 'MSFT', pair: 'MSFT' },
      { symbol: 'NVDA', pair: 'NVDA' },
      { symbol: 'AMZN', pair: 'AMZN' },
    ],
    leverage: [1, 2, 4],
  },
  commodities: {
    label: 'Commodities',
    icon: '🛢️',
    symbols: [
      { symbol: 'XAUUSD', pair: 'Gold/USD' },
      { symbol: 'XAGUSD', pair: 'Silver/USD' },
      { symbol: 'WTI', pair: 'Crude Oil' },
      { symbol: 'NATGAS', pair: 'Natural Gas' },
    ],
    leverage: [1, 10, 50, 100],
  },
  indices: {
    label: 'Indices',
    icon: '📈',
    symbols: [
      { symbol: 'SPX500', pair: 'S&P 500' },
      { symbol: 'NAS100', pair: 'NASDAQ 100' },
      { symbol: 'US30', pair: 'Dow Jones' },
      { symbol: 'DAX', pair: 'DAX 40' },
      { symbol: 'NIKKEI', pair: 'Nikkei 225' },
    ],
    leverage: [1, 10, 50, 100, 200],
  },
  options: {
    label: 'Options',
    icon: '🎯',
    symbols: [
      { symbol: 'SPY_CALL', pair: 'SPY Call' },
      { symbol: 'SPY_PUT', pair: 'SPY Put' },
      { symbol: 'QQQ_CALL', pair: 'QQQ Call' },
      { symbol: 'QQQ_PUT', pair: 'QQQ Put' },
    ],
    leverage: [1, 2, 5],
  },
};

export default function MarketSelector() {
  const { marketConfig, updateMarketConfig, generateChartData } = useTradingStore();

  const handleMarketChange = (type: MarketType) => {
    const market = MARKETS[type];
    const firstSymbol = market.symbols[0];
    updateMarketConfig({ 
      type, 
      symbol: firstSymbol.symbol, 
      pair: firstSymbol.pair,
      leverage: market.leverage[0],
    });
    
    // Generate appropriate chart data
    const basePrices: Record<MarketType, number> = {
      crypto: 67000,
      forex: 1.0850,
      stocks: 185,
      commodities: 2350,
      indices: 5200,
      options: 450,
    };
    generateChartData(80, basePrices[type]);
  };

  const handleSymbolChange = (symbol: string, pair: string) => {
    updateMarketConfig({ symbol, pair });
    const basePrices: Record<string, number> = {
      BTCUSDT: 67000, ETHUSDT: 3500, SOLUSDT: 145, BNBUSDT: 600, XRPUSDT: 0.62, ADAUSDT: 0.45,
      EURUSD: 1.0850, GBPUSD: 1.2650, USDJPY: 154.50, AUDUSD: 0.6550, USDCHF: 0.8850, XAUUSD: 2350,
      AAPL: 185, TSLA: 245, GOOGL: 175, MSFT: 420, NVDA: 880, AMZN: 185,
      SPX500: 5200, NAS100: 18500, US30: 39500, DAX: 18200, NIKKEI: 38500,
      WTI: 78, NATGAS: 2.5, XAGUSD: 28,
    };
    generateChartData(80, basePrices[symbol] || 100);
  };

  return (
    <div className="space-y-3">
      {/* Market Type Grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {(Object.entries(MARKETS) as [MarketType, typeof MARKETS[MarketType]][]).map(([type, market]) => (
          <motion.button
            key={type}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMarketChange(type)}
            className={`p-2 rounded-lg text-center transition-all ${
              marketConfig.type === type
                ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300'
                : 'bg-gray-900/30 border border-gray-800/50 text-gray-400 hover:bg-gray-800/30'
            }`}
          >
            <div className="text-lg">{market.icon}</div>
            <div className="text-[9px] font-medium mt-0.5">{market.label}</div>
          </motion.button>
        ))}
      </div>

      {/* Symbol Selection */}
      <div>
        <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Symbol</label>
        <div className="grid grid-cols-3 gap-1">
          {MARKETS[marketConfig.type].symbols.map((s) => (
            <button
              key={s.symbol}
              onClick={() => handleSymbolChange(s.symbol, s.pair)}
              className={`px-2 py-1.5 rounded text-[10px] font-mono transition-all ${
                marketConfig.symbol === s.symbol
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-gray-900/30 text-gray-500 border border-gray-800/30 hover:text-gray-300'
              }`}
            >
              {s.pair}
            </button>
          ))}
        </div>
      </div>

      {/* Leverage & Lot Size */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Leverage</label>
          <div className="flex flex-wrap gap-1">
            {MARKETS[marketConfig.type].leverage.map((lev) => (
              <button
                key={lev}
                onClick={() => updateMarketConfig({ leverage: lev })}
                className={`px-2 py-1 rounded text-[10px] font-mono transition-all ${
                  marketConfig.leverage === lev
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                    : 'bg-gray-900/30 text-gray-500 border border-gray-800/30 hover:text-gray-300'
                }`}
              >
                {lev}x
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 block">Lot Size</label>
          <input
            type="number"
            value={marketConfig.lotSize}
            onChange={(e) => updateMarketConfig({ lotSize: Number(e.target.value) })}
            step={marketConfig.type === 'forex' ? 0.01 : 0.001}
            min={0.001}
            className="w-full px-2 py-1.5 rounded bg-gray-900/50 border border-gray-700/50 text-xs text-gray-200 font-mono focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Active Market Info */}
      <div className="p-2 rounded-lg bg-gray-900/30 border border-gray-800/30">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-gray-500">Active Market</span>
          <span className="text-purple-300 font-medium">
            {MARKETS[marketConfig.type].icon} {marketConfig.pair}
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px] mt-1">
          <span className="text-gray-500">Leverage</span>
          <span className="text-yellow-300 font-mono">{marketConfig.leverage}x</span>
        </div>
        <div className="flex items-center justify-between text-[10px] mt-1">
          <span className="text-gray-500">Time Frame</span>
          <span className="text-cyan-300 font-mono">{marketConfig.timeFrame}</span>
        </div>
      </div>
    </div>
  );
}
