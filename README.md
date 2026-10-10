# 🤖 PJ.BOT AI Trading Agent v2.0

A comprehensive, embeddable AI Trading Agent widget with real-time visualization, multi-routing architecture, 6 market types, MT5 integration, API gateway, and full simulation engine.

## 📁 Project Structure

```
├── src/
│   ├── App.tsx                          # Main application entry
│   ├── index.css                        # Global styles + custom scrollbar
│   ├── store/
│   │   └── tradingStore.ts              # Zustand state management (v2.0)
│   └── components/
│       ├── TradingWidget.tsx             # Main widget container
│       ├── CuteRobotAvatar.tsx           # SVG robot + purple aura
│       ├── TradingChart.tsx              # Candlestick + Linear chart
│       ├── ControlPanel.tsx              # RUN/PAUSE/BACKTEST/KILL-SWITCH
│       ├── SettingsPanel.tsx             # 9-tab settings panel
│       ├── MarketSelector.tsx            # 6 market types
│       ├── ConnectionPanel.tsx           # MT5 + API + Gateway
│       ├── AutoTradingSystem.tsx         # Auto trading config
│       ├── SimulationEngine.tsx          # Full backtest engine
│       ├── ActivityLog.tsx               # Real-time AI logs
│       └── StatsDashboard.tsx            # Trading metrics
├── backend/
│   └── ai_agent.py                      # Python AI architecture (v2.0)
└── README.md
```

## 🎨 Features

### Visual & Animation
- **Cute Robot Character**: SVG-animated robot with blinking eyes and sweet smile
- **Purple Aura Effect**: Pulsing neon glow when agent is active
- **Multi-Routing Particles**: Dynamic node connections representing parallel AI processing
- **Glassmorphism Design**: Modern dark UI with frosted glass panels

### 📊 Trading Chart
- **Candlestick Chart**: Full OHLCV visualization with wicks
- **Linear Chart**: Smooth line chart with gradient area fill
- **Technical Overlays**: EMA (9/21), Bollinger Bands
- **Volume Bars**: Color-coded buy/sell volume
- **Time Frames**: 1m, 5m, 15m, 1h, 4h, 1d, 1w
- **Interactive**: Hover tooltips with OHLC data

### 🌍 Market Selection (6 Types)
- **Crypto**: BTC, ETH, SOL, BNB, XRP, ADA
- **Forex**: EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CHF, XAU/USD
- **Stocks**: AAPL, TSLA, GOOGL, MSFT, NVDA, AMZN
- **Commodities**: Gold, Silver, Crude Oil, Natural Gas
- **Indices**: S&P 500, NASDAQ 100, Dow Jones, DAX, Nikkei
- **Options**: SPY/QQQ Calls & Puts

### ⚡ MetaTrader 5 Integration
- Demo/Live account switching
- Server selection (MetaQuotes, ICMarkets, Exness, XM, FBS, Pepperstone)
- Expert Advisor support
- Copy Trading
- Market Depth
- VPS Hosting

### 🔑 API Gateway (Multi-Exchange)
- **Crypto**: Binance, Bybit, OKX, Coinbase, Kraken
- **Forex**: OANDA, IG Markets, cTrader
- **Stocks**: Alpaca, Interactive Brokers
- **Custom**: Any REST API endpoint
- Rate limiting, connection status, API key management

### 🌐 Multi AI Agent Gateway
- Dynamic node management (add/remove/configure)
- Per-node weight adjustment
- Latency monitoring
- Connection testing
- Types: Technical, Sentiment, On-Chain, ML, Custom
- Visual weight distribution display

### 🤖 Auto Trading System
- **5 Trading Modes**: Conservative, Balanced, Aggressive, Scalping, Swing
- Auto-compounding with configurable percentage
- Partial Take Profit
- Trailing Stop Loss activation
- Break-even trigger
- News Filter (pause before major events)
- Session Filter (Sydney, Tokyo, London, New York)
- Max trades per day & cooldown period

### 🔬 Simulation / Backtest Engine
- Full historical data replay
- Real-time equity curve visualization
- Trade-by-trade log
- Performance metrics:
  - Win Rate
  - Profit Factor
  - Max Drawdown
  - Sharpe Ratio
  - Sortino Ratio
  - Calmar Ratio
- Multi-agent progress indicators

### 📈 Settings (9 Tabs)
1. **Market**: Market type, symbol, leverage, lot size
2. **Technical**: RSI, MACD, EMA, BB, Ichimoku, Stochastic, ADX, AI Patterns, Volume Profile, Order Book
3. **Risk**: Position sizing (Fixed/Kelly/Volatility), SL (Fixed/ATR/Trailing), TP, Max DD, R:R Ratio
4. **AI**: Model selection, Multi-routing weights, Confidence threshold, Training params
5. **MT5**: Server, credentials, account type, features
6. **API**: Multi-exchange API key management
7. **Gateway**: AI agent node configuration
8. **Auto**: Trading mode, filters, compounding
9. **Other**: Theme, notifications, data export, system info

## 🧠 AI Architecture (Multi-Routing)

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

## 🚀 Tech Stack

### Frontend
- **React 18** + TypeScript
- **Tailwind CSS** (dark mode, glassmorphism, neon accents)
- **Framer Motion** (animations, transitions)
- **Zustand** (state management)
- **Vite** (build tool)

### Backend (Python)
- **FastAPI** (WebSocket + REST API)
- **NumPy** (numerical computations)
- **Async/Await** (parallel sub-agent execution)
- **MetaTrader5** integration
- **ccxt** (multi-exchange support)

## 📦 Installation

```bash
npm install
npm run dev      # Development
npm run build    # Production build
```

## 🔌 Embedding

```tsx
import TradingWidget from './components/TradingWidget';

function MyPage() {
  return <TradingWidget />;
}
```

## 📊 State Management

```typescript
const { 
  status, marketConfig, mt5Settings, apiConfigs, 
  gatewayNodes, autoTradeConfig, simulation,
  runAgent, pauseAgent, simulateAgent, killSwitch 
} = useTradingStore();
```

## 📝 License

MIT
