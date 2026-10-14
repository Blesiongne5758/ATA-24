import { useState } from 'react';
import { motion } from 'framer-motion';

// ============================================================
// STRATEGY MARKETPLACE
// Features: Browse, buy, sell, and share trading strategies
// ============================================================

interface Strategy {
  id: string;
  name: string;
  author: string;
  description: string;
  category: string;
  performance: {
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
  };
  price: number;
  rating: number;
  downloads: number;
  tags: string[];
  isPremium: boolean;
  createdAt: string;
}

export default function StrategyMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All', icon: '📊' },
    { id: 'trend', label: 'Trend', icon: '📈' },
    { id: 'momentum', label: 'Momentum', icon: '⚡' },
    { id: 'mean_reversion', label: 'Mean Rev', icon: '🔄' },
    { id: 'breakout', label: 'Breakout', icon: '💥' },
    { id: 'scalping', label: 'Scalping', icon: '🎯' },
    { id: 'swing', label: 'Swing', icon: '🌊' },
  ];

  const strategies: Strategy[] = [
    {
      id: '1',
      name: 'Golden Cross Pro',
      author: 'TradingMaster',
      description: 'Advanced EMA crossover strategy with RSI confirmation and volume filter',
      category: 'trend',
      performance: {
        totalReturn: 145.67,
        sharpeRatio: 2.34,
        maxDrawdown: -12.5,
        winRate: 68.5,
      },
      price: 99,
      rating: 4.8,
      downloads: 1250,
      tags: ['ema', 'rsi', 'volume'],
      isPremium: true,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Bollinger Squeeze',
      author: 'QuantTrader',
      description: 'Bollinger Band squeeze detection with momentum breakout confirmation',
      category: 'breakout',
      performance: {
        totalReturn: 89.34,
        sharpeRatio: 1.89,
        maxDrawdown: -15.2,
        winRate: 62.3,
      },
      price: 0,
      rating: 4.5,
      downloads: 3420,
      tags: ['bollinger', 'breakout', 'momentum'],
      isPremium: false,
      createdAt: '2024-02-20',
    },
    {
      id: '3',
      name: 'RSI Divergence Hunter',
      author: 'AlphaQuant',
      description: 'Detects RSI divergences with price action confirmation',
      category: 'momentum',
      performance: {
        totalReturn: 112.45,
        sharpeRatio: 2.12,
        maxDrawdown: -18.3,
        winRate: 65.8,
      },
      price: 149,
      rating: 4.9,
      downloads: 890,
      tags: ['rsi', 'divergence', 'reversal'],
      isPremium: true,
      createdAt: '2024-03-10',
    },
    {
      id: '4',
      name: 'Mean Reversion Master',
      author: 'StatArb',
      description: 'Statistical mean reversion with z-score entry and exit',
      category: 'mean_reversion',
      performance: {
        totalReturn: 78.92,
        sharpeRatio: 1.76,
        maxDrawdown: -10.8,
        winRate: 71.2,
      },
      price: 79,
      rating: 4.6,
      downloads: 1560,
      tags: ['mean_reversion', 'zscore', 'statistical'],
      isPremium: true,
      createdAt: '2024-01-28',
    },
    {
      id: '5',
      name: 'Scalper Pro',
      author: 'FastTrader',
      description: 'High-frequency scalping strategy with tight stop losses',
      category: 'scalping',
      performance: {
        totalReturn: 234.56,
        sharpeRatio: 2.89,
        maxDrawdown: -8.5,
        winRate: 73.4,
      },
      price: 199,
      rating: 4.7,
      downloads: 670,
      tags: ['scalping', 'high_frequency', 'tight_sl'],
      isPremium: true,
      createdAt: '2024-02-15',
    },
    {
      id: '6',
      name: 'Swing Trading Elite',
      author: 'PositionTrader',
      description: 'Multi-day swing trading with trend and momentum filters',
      category: 'swing',
      performance: {
        totalReturn: 156.78,
        sharpeRatio: 2.23,
        maxDrawdown: -14.2,
        winRate: 64.7,
      },
      price: 129,
      rating: 4.8,
      downloads: 980,
      tags: ['swing', 'trend', 'momentum'],
      isPremium: true,
      createdAt: '2024-03-05',
    },
  ];

  const filteredStrategies = strategies.filter(s => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🏪</span> Strategy Marketplace
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Browse, buy, and share profitable trading strategies
          </p>
        </div>
        <button className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-medium hover:bg-purple-500/30">
          + Sell Strategy
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-3 space-y-3">
        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search strategies..."
          className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-xs text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50"
        />

        {/* Categories */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-gray-800/30 text-gray-400 border border-gray-700/30 hover:bg-gray-800/50'
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Strategy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredStrategies.map((strategy) => (
          <motion.div
            key={strategy.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setSelectedStrategy(strategy)}
            className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 cursor-pointer hover:bg-gray-900/70 hover:border-purple-500/30 transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-white">{strategy.name}</h3>
                  {strategy.isPremium && (
                    <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 text-[9px] border border-yellow-500/40">
                      PREMIUM
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400">by {strategy.author}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white">
                  {strategy.price === 0 ? 'FREE' : `$${strategy.price}`}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-400 mb-3 line-clamp-2">{strategy.description}</p>

            {/* Performance */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div>
                <div className="text-[9px] text-gray-500">Return</div>
                <div className={`text-xs font-bold ${strategy.performance.totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  +{strategy.performance.totalReturn.toFixed(0)}%
                </div>
              </div>
              <div>
                <div className="text-[9px] text-gray-500">Sharpe</div>
                <div className="text-xs font-bold text-blue-400">{strategy.performance.sharpeRatio.toFixed(1)}</div>
              </div>
              <div>
                <div className="text-[9px] text-gray-500">Win Rate</div>
                <div className="text-xs font-bold text-purple-400">{strategy.performance.winRate.toFixed(0)}%</div>
              </div>
              <div>
                <div className="text-[9px] text-gray-500">Max DD</div>
                <div className="text-xs font-bold text-red-400">{strategy.performance.maxDrawdown.toFixed(0)}%</div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-yellow-400">⭐ {strategy.rating}</span>
                <span className="text-[10px] text-gray-500">({strategy.downloads} downloads)</span>
              </div>
              <div className="flex gap-1">
                {strategy.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-1.5 py-0.5 rounded bg-gray-800/50 text-gray-400 text-[9px]">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Strategy Detail Modal */}
      {selectedStrategy && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedStrategy(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto custom-scrollbar"
          >
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-white">{selectedStrategy.name}</h2>
                    {selectedStrategy.isPremium && (
                      <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 text-xs border border-yellow-500/40">
                        PREMIUM
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">by {selectedStrategy.author} • {selectedStrategy.createdAt}</p>
                </div>
                <button
                  onClick={() => setSelectedStrategy(null)}
                  className="text-gray-500 hover:text-gray-300 text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-300">{selectedStrategy.description}</p>

              {/* Performance */}
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
                  <div className="text-[10px] text-gray-500">Total Return</div>
                  <div className={`text-lg font-bold ${selectedStrategy.performance.totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    +{selectedStrategy.performance.totalReturn.toFixed(1)}%
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
                  <div className="text-[10px] text-gray-500">Sharpe Ratio</div>
                  <div className="text-lg font-bold text-blue-400">{selectedStrategy.performance.sharpeRatio.toFixed(2)}</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
                  <div className="text-[10px] text-gray-500">Win Rate</div>
                  <div className="text-lg font-bold text-purple-400">{selectedStrategy.performance.winRate.toFixed(1)}%</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
                  <div className="text-[10px] text-gray-500">Max Drawdown</div>
                  <div className="text-lg font-bold text-red-400">{selectedStrategy.performance.maxDrawdown.toFixed(1)}%</div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="text-xs text-gray-500 mb-2">Tags</div>
                <div className="flex gap-1.5 flex-wrap">
                  {selectedStrategy.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 text-xs border border-purple-500/20">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
                  <div className="text-[10px] text-gray-500">Rating</div>
                  <div className="text-sm font-bold text-yellow-400">⭐ {selectedStrategy.rating} / 5.0</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
                  <div className="text-[10px] text-gray-500">Downloads</div>
                  <div className="text-sm font-bold text-cyan-400">{selectedStrategy.downloads.toLocaleString()}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-sm hover:from-purple-600 hover:to-blue-600">
                  {selectedStrategy.price === 0 ? '📥 Download Free' : `💰 Buy for $${selectedStrategy.price}`}
                </button>
                <button className="px-4 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-300 text-sm font-medium hover:bg-gray-800">
                  👁️ Preview
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
