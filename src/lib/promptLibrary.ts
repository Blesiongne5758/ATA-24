// ============================================================
// AI AGENT PROMPT LIBRARY
// Comprehensive task definitions for multi-agent trading system
// ============================================================

export type AgentCategory = 
  | 'monitoring'
  | 'analysis'
  | 'execution'
  | 'notification'
  | 'strategy'
  | 'risk_management';

export type SubAgentType = 
  | 'wallet_monitor'
  | 'social_sentiment'
  | 'news_analyzer'
  | 'telegram_monitor'
  | 'twitter_influencer'
  | 'policy_tracker'
  | 'technical_analyst'
  | 'broker_analyst'
  | 'orchestrator'
  | 'risk_manager'
  | 'strategy_planner'
  | 'notification_manager';

export interface PromptTask {
  id: string;
  name: string;
  description: string;
  category: AgentCategory;
  subAgentType: SubAgentType;
  priority: 'critical' | 'high' | 'medium' | 'low';
  frequency: 'realtime' | '1min' | '5min' | '15min' | '1hour' | 'daily';
  enabled: boolean;
  prompt: string;
  parameters: Record<string, any>;
  tags: string[];
  dependencies: string[];
  outputFormat: 'json' | 'text' | 'signal' | 'alert';
}

export interface PromptTemplate {
  id: string;
  name: string;
  category: AgentCategory;
  description: string;
  variables: string[];
  template: string;
}

// ============================================================
// PROMPT TEMPLATES
// ============================================================

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'wallet_monitor_template',
    name: 'Crypto Wallet Monitor',
    category: 'monitoring',
    description: 'Monitor whale wallets and large transactions',
    variables: ['wallet_addresses', 'threshold_usd', 'timeframe'],
    template: `Monitor the following crypto wallets for large transactions:
Wallets: {wallet_addresses}
Threshold: ${'{'}threshold_usd} USD
Timeframe: {timeframe}

Analyze:
1. Transaction volume and frequency
2. Token movements (inflow/outflow)
3. Exchange deposits/withdrawals
4. DeFi protocol interactions
5. NFT transfers

Provide alerts for:
- Transactions exceeding threshold
- Unusual activity patterns
- Exchange inflows (potential sell pressure)
- Large DeFi positions opening/closing`,
  },
  {
    id: 'meme_trader_monitor_template',
    name: 'Meme Trader Activity Monitor',
    category: 'monitoring',
    description: 'Track active meme coin traders and their positions',
    variables: ['trader_list', 'meme_coins', 'alert_threshold'],
    template: `Monitor meme coin traders and their activities:
Traders to track: {trader_list}
Meme coins: {meme_coins}
Alert threshold: ${'{'}alert_threshold}

Track:
1. New positions opened by tracked traders
2. Position sizes and entry prices
3. Profit/loss status
4. Trading frequency and patterns
5. Social media mentions correlated with trades

Alert when:
- Multiple tracked traders enter same token
- Large position changes detected
- Coordinated buying/selling patterns
- New tokens being accumulated`,
  },
  {
    id: 'news_analyzer_template',
    name: 'Financial News Analyzer',
    category: 'analysis',
    description: 'Analyze economic and financial news for market impact',
    variables: ['news_sources', 'keywords', 'impact_threshold'],
    template: `Analyze financial news from these sources:
Sources: {news_sources}
Keywords: {keywords}
Impact threshold: {impact_threshold}

Analyze for:
1. Central bank announcements (Fed, ECB, BOJ)
2. Economic indicators (CPI, GDP, employment)
3. Regulatory changes
4. Corporate earnings and announcements
5. Geopolitical events

Provide:
- Sentiment score (-1 to 1)
- Market impact prediction
- Affected assets
- Confidence level
- Recommended action`,
  },
  {
    id: 'telegram_monitor_template',
    name: 'Telegram Trading Group Monitor',
    category: 'monitoring',
    description: 'Monitor trading signals and discussions in Telegram groups',
    variables: ['group_ids', 'signal_keywords', 'min_members'],
    template: `Monitor Telegram trading groups:
Groups: {group_ids}
Signal keywords: {signal_keywords}
Minimum members: {min_members}

Track:
1. Trading signals shared
2. Token mentions frequency
3. Sentiment analysis
4. Group admin recommendations
5. Member engagement levels

Extract:
- Token calls with entry/exit prices
- Consensus among multiple groups
- Time-stamped signals
- Success rate tracking
- Influential members' calls`,
  },
  {
    id: 'twitter_influencer_template',
    name: 'Twitter/X Market Influencer Monitor',
    category: 'monitoring',
    description: 'Monitor influential accounts that move markets',
    variables: ['influencer_accounts', 'engagement_threshold', 'keywords'],
    template: `Monitor Twitter/X accounts that influence markets:
Accounts: {influencer_accounts}
Engagement threshold: {engagement_threshold}
Keywords: {keywords}

Track:
1. Posts about crypto/stocks/forex
2. Engagement metrics (likes, retweets, replies)
3. Sentiment and tone
4. Price predictions
5. Project endorsements

Alert for:
- High-engagement posts (>10k interactions)
- Coordinated posting patterns
- Sudden sentiment shifts
- New project promotions
- Regulatory warnings`,
  },
  {
    id: 'policy_tracker_template',
    name: 'Government Policy & Market Players Tracker',
    category: 'monitoring',
    description: 'Track government policies and major market players',
    variables: ['governments', 'regulators', 'major_players'],
    template: `Track government policies and major market players:
Governments: {governments}
Regulators: {regulators}
Major players: {major_players}

Monitor:
1. Crypto regulations and bans
2. Tax policy changes
3. Central bank digital currencies (CBDC)
4. Institutional adoption announcements
5. Major fund movements (BlackRock, Fidelity, etc.)

Provide:
- Policy impact analysis
- Market sentiment effect
- Affected sectors
- Timeline predictions
- Risk assessment`,
  },
  {
    id: 'technical_analyst_template',
    name: 'Market Technical Analysis',
    category: 'analysis',
    description: 'Comprehensive technical analysis across multiple timeframes',
    variables: ['symbol', 'timeframes', 'indicators'],
    template: `Perform technical analysis:
Symbol: {symbol}
Timeframes: {timeframes}
Indicators: {indicators}

Analyze:
1. Trend direction (EMA, MACD, ADX)
2. Momentum (RSI, Stochastic, CCI)
3. Volatility (Bollinger Bands, ATR)
4. Volume analysis (OBV, VWAP)
5. Support/Resistance levels
6. Chart patterns (H&S, triangles, flags)
7. Fibonacci levels
8. Ichimoku cloud analysis

Provide:
- Multi-timeframe confluence
- Entry/exit zones
- Stop loss levels
- Take profit targets
- Confidence score`,
  },
  {
    id: 'broker_analyst_template',
    name: 'Global Broker Technical Analysis',
    category: 'analysis',
    description: 'Aggregate technical analysis from major brokers worldwide',
    variables: ['brokers', 'symbols', 'consensus_threshold'],
    template: `Aggregate technical analysis from global brokers:
Brokers: {brokers}
Symbols: {symbols}
Consensus threshold: {consensus_threshold}

Collect from:
- TradingView community
- Investing.com
- Bloomberg Terminal
- Reuters
- Major bank research (Goldman, JP Morgan, etc.)

Provide:
- Consensus buy/sell/hold
- Price target ranges
- Risk ratings
- Time horizon
- Confidence levels`,
  },
  {
    id: 'orchestrator_template',
    name: 'Multi-Agent Orchestrator',
    category: 'execution',
    description: 'Coordinate all sub-agents and make final decisions',
    variables: ['agent_outputs', 'weights', 'confidence_threshold'],
    template: `Orchestrate multi-agent system:
Agent outputs: {agent_outputs}
Routing weights: {weights}
Confidence threshold: {confidence_threshold}

Process:
1. Collect signals from all sub-agents
2. Normalize and weight signals
3. Check for conflicts
4. Calculate consensus
5. Apply risk filters
6. Generate final decision

Output:
- Final signal (BUY/SELL/HOLD)
- Confidence score
- Position size recommendation
- Risk assessment
- Execution priority`,
  },
  {
    id: 'risk_manager_template',
    name: 'Risk Management System',
    category: 'risk_management',
    description: 'Manage portfolio risk and position sizing',
    variables: ['portfolio', 'risk_limits', 'correlation_data'],
    template: `Manage portfolio risk:
Current portfolio: {portfolio}
Risk limits: {risk_limits}
Correlation data: {correlation_data}

Calculate:
1. Position sizing (Kelly Criterion)
2. Portfolio VaR (Value at Risk)
3. Maximum drawdown limits
4. Correlation exposure
5. Leverage recommendations
6. Stop loss optimization

Enforce:
- Max position size limits
- Daily loss limits
- Correlation limits
- Margin requirements
- Liquidation prevention`,
  },
  {
    id: 'strategy_planner_template',
    name: 'Trading Strategy Planner',
    category: 'strategy',
    description: 'Develop and optimize trading strategies',
    variables: ['market_conditions', 'historical_data', 'objectives'],
    template: `Plan trading strategy:
Market conditions: {market_conditions}
Historical data: {historical_data}
Objectives: {objectives}

Develop:
1. Entry criteria
2. Exit criteria
3. Position management
4. Risk management rules
5. Performance metrics
6. Optimization parameters

Backtest:
- Historical performance
- Win rate
- Profit factor
- Sharpe ratio
- Max drawdown`,
  },
  {
    id: 'notification_manager_template',
    name: 'Notification & Alert System',
    category: 'notification',
    description: 'Manage notifications and alerts for trading activities',
    variables: ['alert_rules', 'channels', 'priority_levels'],
    template: `Manage notifications:
Alert rules: {alert_rules}
Channels: {channels}
Priority levels: {priority_levels}

Configure:
1. Price alerts
2. Signal notifications
3. Trade execution alerts
4. Risk warnings
5. System status updates
6. Performance reports

Deliver via:
- In-app notifications
- Email
- SMS
- Telegram
- Discord
- Webhook`,
  },
];

// ============================================================
// DEFAULT PROMPT TASKS
// ============================================================

export const DEFAULT_PROMPT_TASKS: PromptTask[] = [
  // MONITORING TASKS
  {
    id: 'whale_wallet_monitor',
    name: 'Whale Wallet Monitor',
    description: 'Monitor top 100 crypto whale wallets for large transactions',
    category: 'monitoring',
    subAgentType: 'wallet_monitor',
    priority: 'critical',
    frequency: 'realtime',
    enabled: true,
    prompt: PROMPT_TEMPLATES[0].template
      .replace('{wallet_addresses}', 'Top 100 BTC/ETH whale wallets')
      .replace('{threshold_usd}', '1,000,000')
      .replace('{timeframe}', 'Last 24 hours'),
    parameters: {
      wallet_count: 100,
      threshold_usd: 1000000,
      chains: ['bitcoin', 'ethereum', 'solana'],
    },
    tags: ['whales', 'crypto', 'onchain', 'large-transactions'],
    dependencies: [],
    outputFormat: 'alert',
  },
  {
    id: 'meme_trader_tracker',
    name: 'Meme Trader Activity Tracker',
    description: 'Track 50 most active meme coin traders and their positions',
    category: 'monitoring',
    subAgentType: 'social_sentiment',
    priority: 'high',
    frequency: '5min',
    enabled: true,
    prompt: PROMPT_TEMPLATES[1].template
      .replace('{trader_list}', 'Top 50 meme coin traders by volume')
      .replace('{meme_coins}', 'DOGE, SHIB, PEPE, FLOKI, BONK')
      .replace('{alert_threshold}', '10 traders entering same token'),
    parameters: {
      trader_count: 50,
      meme_coins: ['DOGE', 'SHIB', 'PEPE', 'FLOKI', 'BONK'],
      alert_threshold: 10,
    },
    tags: ['meme', 'traders', 'social', 'coordination'],
    dependencies: ['whale_wallet_monitor'],
    outputFormat: 'signal',
  },
  {
    id: 'financial_news_analyzer',
    name: 'Financial News Analyzer',
    description: 'Analyze 50+ financial news sources for market-moving events',
    category: 'analysis',
    subAgentType: 'news_analyzer',
    priority: 'critical',
    frequency: '1min',
    enabled: true,
    prompt: PROMPT_TEMPLATES[2].template
      .replace('{news_sources}', 'Bloomberg, Reuters, CNBC, WSJ, FT, CoinDesk, Cointelegraph')
      .replace('{keywords}', 'Fed, inflation, crypto regulation, ETF, interest rates')
      .replace('{impact_threshold}', 'High impact events only'),
    parameters: {
      sources_count: 50,
      keywords: ['Fed', 'inflation', 'crypto', 'regulation', 'ETF'],
      sentiment_model: 'finbert',
    },
    tags: ['news', 'sentiment', 'economy', 'fundamental'],
    dependencies: [],
    outputFormat: 'signal',
  },
  {
    id: 'telegram_signal_monitor',
    name: 'Telegram Trading Signal Monitor',
    description: 'Monitor 20 major trading Telegram groups for signals',
    category: 'monitoring',
    subAgentType: 'telegram_monitor',
    priority: 'high',
    frequency: 'realtime',
    enabled: true,
    prompt: PROMPT_TEMPLATES[3].template
      .replace('{group_ids}', 'Top 20 crypto trading groups by members')
      .replace('{signal_keywords}', 'BUY, SELL, LONG, SHORT, ENTRY, EXIT')
      .replace('{min_members}', '10000'),
    parameters: {
      group_count: 20,
      min_members: 10000,
      signal_keywords: ['BUY', 'SELL', 'LONG', 'SHORT'],
    },
    tags: ['telegram', 'signals', 'community', 'social'],
    dependencies: [],
    outputFormat: 'signal',
  },
  {
    id: 'twitter_influencer_monitor',
    name: 'Twitter/X Influencer Monitor',
    description: 'Monitor 100 crypto influencers with 500k+ followers',
    category: 'monitoring',
    subAgentType: 'twitter_influencer',
    priority: 'high',
    frequency: '5min',
    enabled: true,
    prompt: PROMPT_TEMPLATES[4].template
      .replace('{influencer_accounts}', '100 crypto influencers with 500k+ followers')
      .replace('{engagement_threshold}', '10000')
      .replace('{keywords}', 'bitcoin, ethereum, altcoin, pump, dump'),
    parameters: {
      influencer_count: 100,
      min_followers: 500000,
      engagement_threshold: 10000,
    },
    tags: ['twitter', 'influencers', 'social', 'sentiment'],
    dependencies: [],
    outputFormat: 'alert',
  },
  {
    id: 'policy_regulation_tracker',
    name: 'Government Policy & Regulation Tracker',
    description: 'Track crypto regulations and policies from 50+ countries',
    category: 'monitoring',
    subAgentType: 'policy_tracker',
    priority: 'critical',
    frequency: '15min',
    enabled: true,
    prompt: PROMPT_TEMPLATES[5].template
      .replace('{governments}', 'US, EU, UK, China, Japan, Singapore, Australia')
      .replace('{regulators}', 'SEC, CFTC, FCA, MAS, FSA')
      .replace('{major_players}', 'BlackRock, Fidelity, Grayscale, MicroStrategy'),
    parameters: {
      countries: 50,
      regulators: ['SEC', 'CFTC', 'FCA', 'MAS'],
      major_players: ['BlackRock', 'Fidelity', 'Grayscale'],
    },
    tags: ['regulation', 'policy', 'government', 'compliance'],
    dependencies: ['financial_news_analyzer'],
    outputFormat: 'alert',
  },
  {
    id: 'multi_timeframe_technical',
    name: 'Multi-Timeframe Technical Analysis',
    description: 'Analyze BTC/ETH across 7 timeframes with 15+ indicators',
    category: 'analysis',
    subAgentType: 'technical_analyst',
    priority: 'critical',
    frequency: '5min',
    enabled: true,
    prompt: PROMPT_TEMPLATES[6].template
      .replace('{symbol}', 'BTC/USDT, ETH/USDT')
      .replace('{timeframes}', '1m, 5m, 15m, 1h, 4h, 1d, 1w')
      .replace('{indicators}', 'RSI, MACD, EMA, BB, Ichimoku, Stochastic, ADX, ATR, OBV, VWAP'),
    parameters: {
      symbols: ['BTC/USDT', 'ETH/USDT'],
      timeframes: ['1m', '5m', '15m', '1h', '4h', '1d', '1w'],
      indicators: ['RSI', 'MACD', 'EMA', 'BB', 'Ichimoku'],
    },
    tags: ['technical', 'indicators', 'analysis', 'multi-timeframe'],
    dependencies: [],
    outputFormat: 'signal',
  },
  {
    id: 'global_broker_consensus',
    name: 'Global Broker Technical Consensus',
    description: 'Aggregate technical analysis from 30+ major brokers',
    category: 'analysis',
    subAgentType: 'broker_analyst',
    priority: 'high',
    frequency: '1hour',
    enabled: true,
    prompt: PROMPT_TEMPLATES[7].template
      .replace('{brokers}', 'TradingView, Investing.com, Bloomberg, Reuters, Goldman Sachs, JP Morgan')
      .replace('{symbols}', 'BTC, ETH, SPX, NASDAQ, Gold, Oil')
      .replace('{consensus_threshold}', '70%'),
    parameters: {
      broker_count: 30,
      symbols: ['BTC', 'ETH', 'SPX', 'NASDAQ'],
      consensus_threshold: 0.7,
    },
    tags: ['brokers', 'consensus', 'technical', 'global'],
    dependencies: ['multi_timeframe_technical'],
    outputFormat: 'signal',
  },
  // EXECUTION TASKS
  {
    id: 'multi_agent_orchestrator',
    name: 'Multi-Agent Orchestrator',
    description: 'Coordinate all sub-agents and make final trading decisions',
    category: 'execution',
    subAgentType: 'orchestrator',
    priority: 'critical',
    frequency: 'realtime',
    enabled: true,
    prompt: PROMPT_TEMPLATES[8].template
      .replace('{agent_outputs}', 'All sub-agent signals')
      .replace('{weights}', 'Technical: 40%, Sentiment: 35%, On-chain: 25%')
      .replace('{confidence_threshold}', '85%'),
    parameters: {
      weights: { technical: 0.4, sentiment: 0.35, onchain: 0.25 },
      confidence_threshold: 0.85,
      max_conflict_tolerance: 0.2,
    },
    tags: ['orchestrator', 'decision', 'multi-agent', 'final'],
    dependencies: [
      'whale_wallet_monitor',
      'financial_news_analyzer',
      'multi_timeframe_technical',
      'twitter_influencer_monitor',
    ],
    outputFormat: 'signal',
  },
  // RISK MANAGEMENT
  {
    id: 'portfolio_risk_manager',
    name: 'Portfolio Risk Manager',
    description: 'Manage portfolio risk, position sizing, and drawdown limits',
    category: 'risk_management',
    subAgentType: 'risk_manager',
    priority: 'critical',
    frequency: 'realtime',
    enabled: true,
    prompt: PROMPT_TEMPLATES[9].template
      .replace('{portfolio}', 'Current positions and balance')
      .replace('{risk_limits}', 'Max 2% per trade, 5% daily drawdown')
      .replace('{correlation_data}', 'Asset correlation matrix'),
    parameters: {
      max_position_size: 0.02,
      max_daily_drawdown: 0.05,
      max_correlation: 0.7,
      kelly_fraction: 0.5,
    },
    tags: ['risk', 'position-sizing', 'drawdown', 'portfolio'],
    dependencies: ['multi_agent_orchestrator'],
    outputFormat: 'json',
  },
  // STRATEGY
  {
    id: 'adaptive_strategy_planner',
    name: 'Adaptive Strategy Planner',
    description: 'Develop and optimize trading strategies based on market conditions',
    category: 'strategy',
    subAgentType: 'strategy_planner',
    priority: 'high',
    frequency: '1hour',
    enabled: true,
    prompt: PROMPT_TEMPLATES[10].template
      .replace('{market_conditions}', 'Current volatility, trend, volume')
      .replace('{historical_data}', 'Last 1000 candles')
      .replace('{objectives}', 'Maximize Sharpe ratio, minimize drawdown'),
    parameters: {
      strategy_types: ['trend_following', 'mean_reversion', 'breakout'],
      optimization_target: 'sharpe_ratio',
      backtest_period: 1000,
    },
    tags: ['strategy', 'optimization', 'backtest', 'adaptive'],
    dependencies: ['multi_timeframe_technical', 'portfolio_risk_manager'],
    outputFormat: 'json',
  },
  // NOTIFICATIONS
  {
    id: 'smart_notification_system',
    name: 'Smart Notification System',
    description: 'Intelligent notification routing based on priority and context',
    category: 'notification',
    subAgentType: 'notification_manager',
    priority: 'high',
    frequency: 'realtime',
    enabled: true,
    prompt: PROMPT_TEMPLATES[11].template
      .replace('{alert_rules}', 'Price alerts, signal alerts, risk warnings')
      .replace('{channels}', 'In-app, Email, Telegram, Discord')
      .replace('{priority_levels}', 'Critical, High, Medium, Low'),
    parameters: {
      channels: ['in-app', 'email', 'telegram', 'discord'],
      priority_levels: ['critical', 'high', 'medium', 'low'],
      rate_limit: 10, // max notifications per minute
    },
    tags: ['notifications', 'alerts', 'routing', 'multi-channel'],
    dependencies: ['multi_agent_orchestrator', 'portfolio_risk_manager'],
    outputFormat: 'alert',
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getTasksByCategory(category: AgentCategory): PromptTask[] {
  return DEFAULT_PROMPT_TASKS.filter(task => task.category === category);
}

export function getTasksBySubAgent(subAgentType: SubAgentType): PromptTask[] {
  return DEFAULT_PROMPT_TASKS.filter(task => task.subAgentType === subAgentType);
}

export function getEnabledTasks(): PromptTask[] {
  return DEFAULT_PROMPT_TASKS.filter(task => task.enabled);
}

export function getTasksByPriority(priority: PromptTask['priority']): PromptTask[] {
  return DEFAULT_PROMPT_TASKS.filter(task => task.priority === priority);
}

export function getTaskDependencies(taskId: string): PromptTask[] {
  const task = DEFAULT_PROMPT_TASKS.find(t => t.id === taskId);
  if (!task) return [];
  return DEFAULT_PROMPT_TASKS.filter(t => task.dependencies.includes(t.id));
}

export function getCategoryStats(): Record<AgentCategory, number> {
  const stats = {} as Record<AgentCategory, number>;
  DEFAULT_PROMPT_TASKS.forEach(task => {
    stats[task.category] = (stats[task.category] || 0) + 1;
  });
  return stats;
}
