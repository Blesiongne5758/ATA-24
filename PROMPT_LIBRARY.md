# 📚 Prompt Library - AI Trading Agent

Sistem Prompt Library yang komprehensif untuk mengelola tugas-tugas agent dan sub-agent dalam sistem trading AI multi-routing.

## 🎯 Fitur Utama

### 1. **Kategorisasi Tugas**
- **Monitoring** 👁️ - Pemantauan real-time (wallet, social, news, telegram)
- **Analysis** 🔍 - Analisis teknikal dan fundamental
- **Execution** ⚡ - Eksekusi trading dan orchestrator
- **Risk Management** 🛡️ - Manajemen risiko dan position sizing
- **Strategy** 🎯 - Perencanaan strategi trading
- **Notification** 🔔 - Sistem notifikasi multi-channel

### 2. **Sub-Agent Types**
- `wallet_monitor` - Monitor whale wallets dan large transactions
- `social_sentiment` - Track meme traders dan social signals
- `news_analyzer` - Analisis berita ekonomi dan keuangan
- `telegram_monitor` - Monitor grup trading Telegram
- `twitter_influencer` - Track akun X/Twitter berpengaruh
- `policy_tracker` - Monitor kebijakan pemerintah dan regulasi
- `technical_analyst` - Analisis teknikal multi-timeframe
- `broker_analyst` - Agregasi analisis dari broker global
- `orchestrator` - Koordinasi multi-agent dan decision making
- `risk_manager` - Manajemen risiko portfolio
- `strategy_planner` - Pengembangan strategi trading
- `notification_manager` - Routing notifikasi cerdas

### 3. **12 Prompt Templates**

#### Monitoring Templates
1. **Crypto Wallet Monitor** - Monitor whale wallets
2. **Meme Trader Activity Monitor** - Track meme coin traders
3. **Telegram Trading Group Monitor** - Monitor sinyal Telegram
4. **Twitter/X Market Influencer Monitor** - Track influencers
5. **Government Policy & Regulation Tracker** - Monitor regulasi

#### Analysis Templates
6. **Financial News Analyzer** - Analisis berita keuangan
7. **Market Technical Analysis** - Analisis teknikal lengkap
8. **Global Broker Technical Analysis** - Konsensus broker global

#### Execution Templates
9. **Multi-Agent Orchestrator** - Koordinasi dan decision making

#### Risk Management Templates
10. **Risk Management System** - Position sizing dan risk limits

#### Strategy Templates
11. **Trading Strategy Planner** - Pengembangan strategi

#### Notification Templates
12. **Notification & Alert System** - Multi-channel notifications

## 📋 Default Tasks (12 Tasks)

### Critical Priority
1. **Whale Wallet Monitor** - Monitor 100 whale wallets, threshold $1M, realtime
2. **Financial News Analyzer** - 50+ news sources, 1min frequency
3. **Policy & Regulation Tracker** - 50+ countries, 15min frequency
4. **Multi-Timeframe Technical** - 7 timeframes, 15+ indicators, 5min
5. **Multi-Agent Orchestrator** - Coordinate all agents, realtime
6. **Portfolio Risk Manager** - Max 2% per trade, 5% daily drawdown

### High Priority
7. **Meme Trader Tracker** - 50 traders, 5min frequency
8. **Telegram Signal Monitor** - 20 groups, realtime
9. **Twitter Influencer Monitor** - 100 influencers, 5min
10. **Global Broker Consensus** - 30+ brokers, 1hour
11. **Adaptive Strategy Planner** - Optimize strategies, 1hour
12. **Smart Notification System** - Multi-channel routing, realtime

## 🎨 UI Features

### Grid/List View
- Toggle antara grid view dan list view
- Responsive design untuk mobile dan desktop

### Category Filter
- Filter tasks berdasarkan kategori
- Badge counter untuk setiap kategori
- Color-coded categories

### Search & Tags
- Full-text search (name, description, tags)
- Tag-based filtering
- Real-time search results

### Task Detail Modal
- Complete task information
- Prompt template preview
- Parameters configuration
- Dependencies visualization
- Status indicator (enabled/disabled)

### Priority & Frequency
- Color-coded priority badges (Critical, High, Medium, Low)
- Frequency indicators dengan icons
- Sub-agent type badges

## 🔧 Cara Penggunaan

### 1. Akses Prompt Library
```
Klik tab "📚 Prompts" di TradingWidget
```

### 2. Filter Tasks
```
- Pilih kategori dari filter bar
- Gunakan search box untuk pencarian
- Toggle view mode (Grid/List)
```

### 3. View Task Details
```
- Klik task card untuk melihat detail
- Lihat prompt template
- Check parameters dan dependencies
- Lihat tags dan metadata
```

### 4. Task Management
```
- Enable/disable tasks
- Edit parameters
- Configure dependencies
- Set priority dan frequency
```

## 📊 Task Dependencies

```
Whale Wallet Monitor
    ↓
Meme Trader Tracker
    ↓
Financial News Analyzer
    ↓
Multi-Timeframe Technical
    ↓
Global Broker Consensus
    ↓
Multi-Agent Orchestrator
    ↓
Portfolio Risk Manager
    ↓
Smart Notification System
```

## 🎯 Contoh Implementasi

### Whale Wallet Monitoring
```typescript
{
  id: 'whale_wallet_monitor',
  name: 'Whale Wallet Monitor',
  category: 'monitoring',
  subAgentType: 'wallet_monitor',
  priority: 'critical',
  frequency: 'realtime',
  prompt: `Monitor top 100 crypto whale wallets...`,
  parameters: {
    wallet_count: 100,
    threshold_usd: 1000000,
    chains: ['bitcoin', 'ethereum', 'solana']
  }
}
```

### Multi-Agent Orchestration
```typescript
{
  id: 'multi_agent_orchestrator',
  name: 'Multi-Agent Orchestrator',
  category: 'execution',
  subAgentType: 'orchestrator',
  priority: 'critical',
  frequency: 'realtime',
  prompt: `Coordinate all sub-agents...`,
  parameters: {
    weights: { technical: 0.4, sentiment: 0.35, onchain: 0.25 },
    confidence_threshold: 0.85
  },
  dependencies: [
    'whale_wallet_monitor',
    'financial_news_analyzer',
    'multi_timeframe_technical'
  ]
}
```

## 🚀 Advanced Features

### Dynamic Prompt Generation
- Template variables replacement
- Conditional logic dalam prompts
- Multi-language support

### Real-time Monitoring
- Task execution status
- Performance metrics
- Error tracking dan alerts

### Integration Points
- Chat AI integration
- Voice control commands
- Notification routing
- Strategy execution

## 📈 Performance Metrics

- **Total Tasks**: 12
- **Categories**: 6
- **Sub-Agent Types**: 12
- **Templates**: 12
- **Average Frequency**: 5 minutes
- **Critical Tasks**: 6
- **High Priority**: 6

## 🔐 Security & Privacy

- API keys encrypted
- Secure prompt storage
- Access control per task
- Audit logging

## 📝 Customization

### Add New Task
```typescript
const newTask: PromptTask = {
  id: 'custom_task',
  name: 'Custom Task',
  description: 'Custom description',
  category: 'monitoring',
  subAgentType: 'wallet_monitor',
  priority: 'medium',
  frequency: '15min',
  enabled: true,
  prompt: 'Custom prompt template',
  parameters: {},
  tags: ['custom'],
  dependencies: [],
  outputFormat: 'json'
};
```

### Create Template
```typescript
const newTemplate: PromptTemplate = {
  id: 'custom_template',
  name: 'Custom Template',
  category: 'analysis',
  description: 'Custom analysis template',
  variables: ['symbol', 'timeframe'],
  template: 'Analyze {symbol} on {timeframe}...'
};
```

## 🎓 Best Practices

1. **Start with Critical Tasks** - Prioritize critical tasks first
2. **Monitor Dependencies** - Ensure dependencies are enabled
3. **Test Prompts** - Test prompts before deployment
4. **Review Performance** - Monitor task execution metrics
5. **Adjust Frequencies** - Optimize based on resource usage

## 🔗 Related Components

- **Chat AI** - Interact with agents via chat
- **Voice Control** - Voice commands untuk task management
- **Trading Chart** - Visualize monitored data
- **Settings Panel** - Configure task parameters
- **Activity Log** - Monitor task execution

## 📞 Support

Untuk pertanyaan dan support:
- Documentation: `/docs/prompt-library`
- Examples: `/examples/prompts`
- API Reference: `/api/prompts`

---

**Version**: 2.0  
**Last Updated**: 2024  
**Status**: ✅ Production Ready
