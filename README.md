# 🤖 PJ.BOT AI Trading Agent v2.0

Sistem trading AI multi-agent yang komprehensif dengan chart real-time, chat AI, voice control, prompt library, dan download client untuk multi-platform.

![Version](https://img.shields.io/badge/version-2.0-purple)
![License](https://img.shields.io/badge/license-MIT-blue)
![Build](https://img.shields.io/badge/build-passing-green)

## 🌟 Fitur Utama

### 📊 Live Trading Chart
- **Real-time Updates**: Harga update setiap 500ms
- **Candlestick & Linear**: Dua mode visualisasi chart
- **Multi-Timeframe**: 1m, 5m, 15m, 1h, 4h, 1d, 1w
- **Technical Indicators**: EMA, Bollinger Bands, Volume
- **Live Indicator**: Badge LIVE berkedip saat agent running
- **Smooth Animation**: Pergerakan chart yang halus dan natural

### 💬 Chat AI Assistant
- **AI Trading Assistant**: Chat dengan AI untuk analisis dan sinyal
- **Quick Actions**: Tombol cepat untuk command populer
- **Smart Responses**: AI responses untuk market analysis, signals, risk reports
- **Chat History**: Riwayat chat dengan timestamp
- **Typing Indicator**: Animasi saat AI sedang mengetik

### 🎤 Voice Control
- **Voice Commands**: Kontrol trading dengan suara
- **Waveform Visualization**: Visualisasi suara real-time
- **Quick Commands**: 6 command cepat (analyze, signals, overview, dll)
- **Multi-Language**: Support 6 bahasa (EN, ID, ZH, JA, KO)
- **Wake Word**: Customizable wake word

### 📚 Prompt Library
- **12 Prompt Templates**: Template untuk berbagai tugas agent
- **12 Default Tasks**: Tasks yang sudah dikonfigurasi
- **6 Categories**: Monitoring, Analysis, Execution, Risk, Strategy, Notification
- **12 Sub-Agent Types**: wallet_monitor, social_sentiment, news_analyst, dll
- **Grid/List View**: Toggle tampilan tasks
- **Search & Filter**: Full-text search dan category filter
- **Task Dependencies**: Visualisasi dependensi antar tasks

### 📥 Download Client
- **Multi-Platform**: Windows, Android, iOS
- **API Key Activation**: Sistem aktivasi dengan API key unik
- **License Duration**: 7 hari, 30 hari, 90 hari, 1 tahun
- **Pricing Tiers**: $9.99 - $249.99
- **System Requirements**: Detail requirements per platform
- **Installation Guide**: Step-by-step installation instructions

### 🎨 Robot Avatar
- **Cute Robot Character**: SVG animated robot woman
- **Purple Aura Effect**: Glowing purple aura saat agent active
- **Multi-Routing Particles**: Particle network animation
- **Blinking Eyes**: Animasi mata berkedip
- **Sweet Smile**: Animasi senyum manis

## 📋 Daftar Lengkap Fitur

### 1. Market Selection (6 Markets)
- **Crypto**: BTC, ETH, SOL, BNB, XRP, ADA
- **Forex**: EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CHF, XAU/USD
- **Stocks**: AAPL, TSLA, GOOGL, MSFT, NVDA, AMZN
- **Commodities**: Gold, Silver, Crude Oil, Natural Gas
- **Indices**: S&P 500, NASDAQ 100, Dow Jones, DAX, Nikkei
- **Options**: SPY/QQQ Calls & Puts

### 2. Technical Indicators
- **RSI**: Relative Strength Index (configurable period)
- **MACD**: Moving Average Convergence Divergence
- **EMA**: Exponential Moving Averages (9, 21, 50, 200)
- **Bollinger Bands**: With standard deviation
- **Ichimoku Cloud**: Tenkan, Kijun, Senkou
- **Stochastic**: %K and %D
- **ADX**: Average Directional Index
- **AI Pattern Recognition**: CNN-based pattern detection
- **Volume Profile**: Volume analysis
- **Order Book Imbalance**: Order flow analysis

### 3. Risk Management
- **Position Sizing**: Fixed, Kelly Criterion, Volatility-based
- **Stop Loss**: Fixed, ATR-based, Trailing
- **Take Profit**: Configurable percentage
- **Max Daily Drawdown**: Limit drawdown
- **Max Open Positions**: Limit concurrent positions
- **Risk/Reward Ratio**: Minimum R:R ratio
- **Correlation Limit**: Max correlation between positions

### 4. AI Strategy
- **Model Selection**: Reinforcement Learning, LLM Sentiment, Time-Series, Ensemble, Transformer
- **Multi-Routing Weights**: Technical (40%), Sentiment (35%), On-Chain (25%)
- **Confidence Threshold**: Minimum confidence untuk execute trade
- **Training Parameters**: Learning rate, batch size, epochs
- **Ensemble Methods**: Weighted average, stacking, voting

### 5. MetaTrader 5 Integration
- **Server Selection**: MetaQuotes, ICMarkets, Exness, XM, FBS, Pepperstone
- **Account Types**: Demo & Live
- **Features**: Expert Advisor, Copy Trading, Market Depth, VPS Hosting
- **Connection Status**: Real-time connection monitoring

### 6. API Gateway (Multi-Exchange)
- **Crypto Exchanges**: Binance, Bybit, OKX, Coinbase, Kraken
- **Forex Brokers**: OANDA, IG Markets, cTrader
- **Stock Brokers**: Alpaca, Interactive Brokers
- **Custom API**: Any REST API endpoint
- **Rate Limiting**: Configurable rate limits
- **Connection Management**: Add/remove/configure connections

### 7. Multi AI Agent Gateway
- **Dynamic Nodes**: Add/remove gateway nodes
- **Node Types**: Technical, Sentiment, On-Chain, ML, Custom
- **Weight Adjustment**: Per-node weight configuration
- **Latency Monitoring**: Real-time latency tracking
- **Connection Testing**: Test node connectivity

### 8. Auto Trading System
- **5 Trading Modes**: Conservative, Balanced, Aggressive, Scalping, Swing
- **Auto-Compounding**: Compound profits automatically
- **Partial Take Profit**: Close partial positions at TP
- **Trailing Stop Loss**: Activate trailing SL
- **Break-Even Trigger**: Move SL to break-even
- **News Filter**: Pause before major news events
- **Session Filter**: Trade only in specific sessions (Sydney, Tokyo, London, NY)
- **Max Trades/Day**: Limit daily trades
- **Cooldown Period**: Minimum time between trades

### 9. Simulation Engine
- **Backtest Engine**: Full historical data replay
- **Equity Curve**: Real-time equity visualization
- **Trade Statistics**: Win rate, profit factor, max drawdown
- **Performance Metrics**: Sharpe, Sortino, Calmar ratios
- **Multi-Agent Progress**: Visual progress indicators

### 10. Chat & Voice Settings
- **AI Model**: GPT-4, Claude, Gemini, Local
- **Personality**: Professional, Friendly, Concise
- **Auto-Suggest**: Enable/disable auto-suggestions
- **Max History**: Configurable chat history limit
- **Voice Language**: 6 languages support
- **Wake Word**: Customizable wake word
- **Sensitivity**: Voice recognition sensitivity
- **Voice Speed**: Playback speed control
- **Auto-Execute**: Auto-execute voice commands
- **Voice Feedback**: Enable/disable voice feedback

### 11. Prompt Library Tasks

#### Monitoring Tasks (5 tasks)
1. **Whale Wallet Monitor** - Monitor 100 whale wallets, threshold $1M, realtime
2. **Meme Trader Tracker** - Track 50 meme traders, 5min frequency
3. **Telegram Signal Monitor** - Monitor 20 Telegram groups, realtime
4. **Twitter Influencer Monitor** - Track 100 influencers, 5min
5. **Policy & Regulation Tracker** - Track 50+ countries, 15min

#### Analysis Tasks (3 tasks)
6. **Financial News Analyzer** - 50+ news sources, 1min frequency
7. **Multi-Timeframe Technical** - 7 timeframes, 15+ indicators, 5min
8. **Global Broker Consensus** - 30+ brokers, 1hour

#### Execution Tasks (1 task)
9. **Multi-Agent Orchestrator** - Coordinate all agents, realtime

#### Risk Management Tasks (1 task)
10. **Portfolio Risk Manager** - Max 2% per trade, 5% daily drawdown

#### Strategy Tasks (1 task)
11. **Adaptive Strategy Planner** - Optimize strategies, 1hour

#### Notification Tasks (1 task)
12. **Smart Notification System** - Multi-channel routing, realtime

### 12. Download Client
- **Windows Desktop**: v2.0.3, 145 MB, Win 10/11
- **Android Mobile**: v2.0.3, 85 MB, Android 8.0+
- **iOS Mobile**: v2.0.3, 92 MB, iOS 14.0+
- **API Key Generation**: Unique API key per license
- **License Duration**: 7/30/90/365 days
- **Pricing**: $9.99 - $249.99

## 🏗️ Arsitektur

### Multi-Routing AI Architecture

```
┌─────────────────────────────────────────────────────┐
│              META-AGENT (Orchestrator)               │
│  Dynamic Weight Adjustment + Ensemble Methods        │
├─────────┬──────────────┬────────────────────────────┤
│ Sub-1   │   Sub-2      │      Sub-3                 │
│Technical│  Sentiment   │    On-Chain                │
│ Analysis│  Analysis    │    Analysis                │
├─────────┼──────────────┼────────────────────────────┤
│ RSI     │ Twitter/X    │  Whale Tracking            │
│ MACD    │ News NLP     │  DEX Volume                │
│ EMA     │ Fear/Greed   │  Funding Rates             │
│ BB      │ LLM (GPT-4) │  Token Flows               │
│ Ichimoku│ Reddit       │  Order Book Imbalance      │
│ Stoch   │              │                            │
│ ADX     │              │                            │
│ AI Pat. │              │                            │
└─────────┴──────────────┴────────────────────────────┘
```

### Task Dependencies Flow

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

## 🚀 Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/pjbot-ai-trading-agent.git

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Usage

1. **Start Agent**: Klik "▶ RUN AGENT" untuk memulai
2. **Select Market**: Pilih market dan symbol di Settings
3. **Configure Settings**: Setup technical indicators, risk management, AI strategy
4. **Monitor Chart**: Lihat chart live dengan real-time updates
5. **Chat with AI**: Gunakan tab Chat untuk bertanya ke AI assistant
6. **Voice Control**: Gunakan tab Voice untuk kontrol dengan suara
7. **View Prompts**: Lihat dan manage tasks di Prompt Library
8. **Download Client**: Download client untuk Windows/Android/iOS

## 📖 Documentation

### Main Documentation
- [README.md](./README.md) - This file
- [PROMPT_LIBRARY.md](./PROMPT_LIBRARY.md) - Prompt Library documentation
- [DOWNLOAD_CLIENT.md](./DOWNLOAD_CLIENT.md) - Download Client guide

### Component Documentation
- `src/components/TradingChart.tsx` - Live chart component
- `src/components/ChatAI.tsx` - Chat AI component
- `src/components/VoiceControl.tsx` - Voice control component
- `src/components/PromptLibrary.tsx` - Prompt library UI
- `src/components/DownloadClient.tsx` - Download client component
- `src/components/SettingsPanel.tsx` - Settings panel with 11 tabs

### State Management
- `src/store/tradingStore.ts` - Main Zustand store
- `src/lib/promptLibrary.ts` - Prompt library data and helpers

## 🎨 UI Components

### Main Panels (7 panels)
1. **📊 Chart** - Live trading chart
2. **📚 Prompts** - Prompt library
3. **💬 Chat** - AI chat assistant
4. **🎤 Voice** - Voice control
5. **🔬 Sim** - Simulation engine
6. **📈 Stats** - Statistics dashboard
7. **📋 Logs** - Activity logs

### Settings Tabs (11 tabs)
1. **📊 Market** - Market selection
2. **📈 Tech** - Technical indicators
3. **🛡️ Risk** - Risk management
4. **🧠 AI** - AI strategy
5. **⚡ MT5** - MetaTrader 5
6. **🔑 API** - API gateway
7. **🌐 GW** - AI gateway
8. **🤖 Auto** - Auto trading
9. **💬 Chat** - Chat & voice settings
10. **📥 Download** - Download client
11. **⚙️ Other** - Other settings

## 🔧 Configuration

### Default Settings

#### Market Config
```typescript
{
  type: 'crypto',
  symbol: 'BTCUSDT',
  pair: 'BTC/USDT',
  timeFrame: '1h',
  chartType: 'candlestick',
  lotSize: 0.01,
  leverage: 1
}
```

#### Risk Settings
```typescript
{
  positionSizing: { method: 'kelly', fixedPercent: 2, kellyFraction: 0.5 },
  stopLoss: { method: 'atr', atrMultiplier: 1.5 },
  takeProfit: { percent: 5 },
  maxDailyDrawdown: { percent: 5 },
  maxOpenPositions: { count: 3 }
}
```

#### AI Settings
```typescript
{
  model: 'ensemble',
  routingWeights: { technical: 40, sentiment: 35, onchain: 25 },
  confidenceThreshold: 85,
  learningRate: 0.001,
  batchSize: 64,
  epochs: 100
}
```

## 📊 Performance Metrics

### System Stats
- **Total Components**: 13
- **Total Tasks**: 12
- **Total Templates**: 12
- **Total Categories**: 6
- **Total Sub-Agents**: 12
- **Build Size**: ~390 KB (gzipped: ~116 KB)
- **Load Time**: < 2s

### Browser Support
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI framework
- **TypeScript 5.7.0** - Type safety
- **Tailwind CSS 4.1.7** - Styling
- **Framer Motion 10.18.0** - Animations
- **Zustand 5.0.15** - State management
- **Vite 6.3.5** - Build tool

### Backend (Python)
- **FastAPI** - API framework
- **NumPy** - Numerical computations
- **Async/Await** - Parallel processing
- **MetaTrader5** - MT5 integration
- **ccxt** - Multi-exchange support

## 📱 Platform Support

### Web Application
- ✅ Desktop browsers
- ✅ Mobile browsers
- ✅ Tablet browsers

### Desktop Client
- ✅ Windows 10/11 (64-bit)
- 🔄 macOS (planned)
- 🔄 Linux (planned)

### Mobile Client
- ✅ Android 8.0+
- ✅ iOS 14.0+

## 🔐 Security

### API Key Security
- Unique API key per license
- Encrypted storage
- Expiry date tracking
- Show/hide toggle
- Copy protection

### Data Security
- Secure API key storage
- Encrypted communications
- Rate limiting
- Access control

## 🐛 Troubleshooting

### Common Issues

**Chart not updating?**
- Ensure agent is running (status: "running")
- Check "● Live" button is active (green)
- Check browser console for errors

**API key not working?**
- Verify API key format: `PJBOT-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX`
- Check expiry date
- Ensure correct platform selected

**Voice not working?**
- Check microphone permissions
- Ensure voice control is enabled in settings
- Check browser compatibility

**Download failed?**
- Check internet connection
- Try different browser
- Clear browser cache

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations
- Zustand for simple state management
- All contributors and supporters

## 📞 Contact

- **Email**: support@pjbot.ai
- **Website**: https://pjbot.ai
- **Documentation**: https://docs.pjbot.ai
- **Discord**: https://discord.gg/pjbot
- **Twitter**: https://twitter.com/pjbot_ai

## 🗺️ Roadmap

### Q1 2024
- [x] Live chart with real-time updates
- [x] Chat AI integration
- [x] Voice control
- [x] Prompt library
- [x] Download client

### Q2 2024
- [ ] macOS desktop client
- [ ] Linux desktop client
- [ ] Browser extension
- [ ] Auto-renewal subscriptions
- [ ] Multi-device licensing

### Q3 2024
- [ ] Advanced backtesting engine
- [ ] Strategy marketplace
- [ ] Social trading features
- [ ] Mobile app improvements
- [ ] Performance optimizations

### Q4 2024
- [ ] AI model improvements
- [ ] More exchange integrations
- [ ] Advanced analytics
- [ ] Enterprise features
- [ ] API v2.0

## 📈 Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/pjbot-ai-trading-agent?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/pjbot-ai-trading-agent?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/pjbot-ai-trading-agent)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/pjbot-ai-trading-agent)

---

**Made with ❤️ by PJ.BOT Team**

**Version**: 2.0.0  
**Last Updated**: 2024  
**Status**: ✅ Production Ready
