import { useState } from 'react';
import { motion } from 'framer-motion';

// ============================================================
// SOCIAL TRADING FEATURES
// Features: Copy trading, leaderboards, social feed, trader profiles
// ============================================================

interface Trader {
  id: string;
  username: string;
  avatar: string;
  rank: number;
  totalReturn: number;
  winRate: number;
  followers: number;
  isFollowing: boolean;
  isVerified: boolean;
  strategy: string;
}

interface Trade {
  id: string;
  trader: string;
  avatar: string;
  symbol: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  timestamp: string;
  isCopied: boolean;
}

export default function SocialTrading() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'feed' | 'copy'>('leaderboard');

  const topTraders: Trader[] = [
    {
      id: '1',
      username: 'CryptoKing',
      avatar: '👑',
      rank: 1,
      totalReturn: 345.67,
      winRate: 78.5,
      followers: 12500,
      isFollowing: false,
      isVerified: true,
      strategy: 'Trend Following',
    },
    {
      id: '2',
      username: 'AlphaTrader',
      avatar: '🎯',
      rank: 2,
      totalReturn: 289.34,
      winRate: 72.3,
      followers: 9800,
      isFollowing: true,
      isVerified: true,
      strategy: 'Mean Reversion',
    },
    {
      id: '3',
      username: 'QuantMaster',
      avatar: '🧠',
      rank: 3,
      totalReturn: 256.78,
      winRate: 69.8,
      followers: 8500,
      isFollowing: false,
      isVerified: true,
      strategy: 'Statistical Arbitrage',
    },
    {
      id: '4',
      username: 'SwingPro',
      avatar: '🌊',
      rank: 4,
      totalReturn: 234.56,
      winRate: 67.2,
      followers: 7200,
      isFollowing: true,
      isVerified: false,
      strategy: 'Swing Trading',
    },
    {
      id: '5',
      username: 'ScalpKing',
      avatar: '⚡',
      rank: 5,
      totalReturn: 212.89,
      winRate: 71.5,
      followers: 6800,
      isFollowing: false,
      isVerified: true,
      strategy: 'Scalping',
    },
  ];

  const recentTrades: Trade[] = [
    {
      id: '1',
      trader: 'CryptoKing',
      avatar: '👑',
      symbol: 'BTC/USDT',
      type: 'buy',
      entryPrice: 67500,
      currentPrice: 68200,
      pnl: 700,
      pnlPercent: 1.04,
      timestamp: '2 min ago',
      isCopied: false,
    },
    {
      id: '2',
      trader: 'AlphaTrader',
      avatar: '🎯',
      symbol: 'ETH/USDT',
      type: 'sell',
      entryPrice: 3520,
      currentPrice: 3480,
      pnl: 400,
      pnlPercent: 1.14,
      timestamp: '5 min ago',
      isCopied: true,
    },
    {
      id: '3',
      trader: 'QuantMaster',
      avatar: '🧠',
      symbol: 'SOL/USDT',
      type: 'buy',
      entryPrice: 145,
      currentPrice: 148,
      pnl: 300,
      pnlPercent: 2.07,
      timestamp: '8 min ago',
      isCopied: false,
    },
    {
      id: '4',
      trader: 'SwingPro',
      avatar: '🌊',
      symbol: 'EUR/USD',
      type: 'buy',
      entryPrice: 1.085,
      currentPrice: 1.088,
      pnl: 300,
      pnlPercent: 0.28,
      timestamp: '12 min ago',
      isCopied: true,
    },
    {
      id: '5',
      trader: 'ScalpKing',
      avatar: '⚡',
      symbol: 'DOGE/USDT',
      type: 'sell',
      entryPrice: 0.152,
      currentPrice: 0.148,
      pnl: 400,
      pnlPercent: 2.63,
      timestamp: '15 min ago',
      isCopied: false,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>👥</span> Social Trading
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Follow top traders and copy their trades automatically
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-900/50 rounded-lg border border-gray-800/50">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          🏆 Leaderboard
        </button>
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
            activeTab === 'feed'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          📰 Feed
        </button>
        <button
          onClick={() => setActiveTab('copy')}
          className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${
            activeTab === 'copy'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          📋 Copy Trading
        </button>
      </div>

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          {topTraders.map((trader) => (
            <div
              key={trader.id}
              className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 hover:border-purple-500/30 transition-all"
            >
              <div className="flex items-center gap-3">
                {/* Rank */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 flex items-center justify-center">
                  <span className="text-sm font-bold text-yellow-400">#{trader.rank}</span>
                </div>

                {/* Avatar & Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{trader.avatar}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white">{trader.username}</span>
                        {trader.isVerified && <span className="text-blue-400 text-xs">✓</span>}
                      </div>
                      <div className="text-[10px] text-gray-400">{trader.strategy}</div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right space-y-1">
                  <div>
                    <div className="text-[9px] text-gray-500">Return</div>
                    <div className="text-sm font-bold text-green-400">+{trader.totalReturn.toFixed(0)}%</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-gray-500">Win Rate</div>
                    <div className="text-xs font-bold text-purple-400">{trader.winRate.toFixed(0)}%</div>
                  </div>
                </div>

                {/* Follow Button */}
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    trader.isFollowing
                      ? 'bg-gray-800/50 text-gray-400 border border-gray-700/50'
                      : 'bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30'
                  }`}
                >
                  {trader.isFollowing ? '✓ Following' : '+ Follow'}
                </button>
              </div>

              {/* Followers */}
              <div className="mt-2 pt-2 border-t border-gray-800/30 flex items-center justify-between">
                <span className="text-[10px] text-gray-500">
                  👥 {trader.followers.toLocaleString()} followers
                </span>
                <button className="text-[10px] text-purple-400 hover:text-purple-300">
                  View Profile →
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Feed Tab */}
      {activeTab === 'feed' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          {recentTrades.map((trade) => (
            <div
              key={trade.id}
              className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 hover:border-purple-500/30 transition-all"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0 text-2xl">{trade.avatar}</div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{trade.trader}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
                      trade.type === 'buy'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {trade.type.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-gray-500">{trade.timestamp}</span>
                  </div>

                  <div className="text-xs text-gray-300 mb-2">
                    Opened <span className="font-bold text-white">{trade.symbol}</span> @ ${trade.entryPrice.toLocaleString()}
                  </div>

                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-[9px] text-gray-500">Current</div>
                      <div className="text-xs font-mono text-white">${trade.currentPrice.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-gray-500">P&L</div>
                      <div className={`text-xs font-bold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.pnl >= 0 ? '+' : ''}${trade.pnl}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] text-gray-500">Return</div>
                      <div className={`text-xs font-bold ${trade.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {trade.pnlPercent >= 0 ? '+' : ''}{trade.pnlPercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Copy Button */}
                <button
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    trade.isCopied
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30'
                  }`}
                >
                  {trade.isCopied ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Copy Trading Tab */}
      {activeTab === 'copy' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Copy Trading Settings */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Copy Trading Settings</div>
            
            <div>
              <label className="text-[10px] text-gray-500 block mb-1">Allocation per Trader (%)</label>
              <input
                type="number"
                defaultValue={10}
                className="w-full px-2 py-1.5 rounded bg-gray-800/50 border border-gray-700/50 text-xs text-gray-200"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 block mb-1">Max Open Positions</label>
              <input
                type="number"
                defaultValue={5}
                className="w-full px-2 py-1.5 rounded bg-gray-800/50 border border-gray-700/50 text-xs text-gray-200"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-500 block mb-1">Risk per Trade (%)</label>
              <input
                type="number"
                defaultValue={2}
                step={0.5}
                className="w-full px-2 py-1.5 rounded bg-gray-800/50 border border-gray-700/50 text-xs text-gray-200"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-gray-300">
              <input type="checkbox" defaultChecked className="w-3 h-3 rounded accent-purple-500" />
              Auto-copy new trades
            </label>

            <label className="flex items-center gap-2 text-xs text-gray-300">
              <input type="checkbox" defaultChecked className="w-3 h-3 rounded accent-purple-500" />
              Send notifications
            </label>

            <button className="w-full px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-medium hover:bg-purple-500/30">
              💾 Save Settings
            </button>
          </div>

          {/* Active Copy Trades */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Active Copy Trades</div>
            <div className="space-y-2">
              {recentTrades.filter(t => t.isCopied).map((trade) => (
                <div key={trade.id} className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{trade.avatar}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{trade.trader}</div>
                        <div className="text-[10px] text-gray-400">{trade.symbol}</div>
                      </div>
                    </div>
                    <div className={`text-sm font-bold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {trade.pnl >= 0 ? '+' : ''}${trade.pnl}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-500">Opened {trade.timestamp}</span>
                    <button className="text-red-400 hover:text-red-300">Stop Copying</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
