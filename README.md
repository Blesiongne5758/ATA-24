# 🤖 AI Trading Agent Widget - Multi-Routing Neural Engine

A comprehensive, embeddable AI Trading Agent widget with real-time visualization, multi-routing architecture, and advanced configuration.

## 📁 Project Structure

```
├── src/
│   ├── App.tsx                      # Main application entry
│   ├── index.css                    # Global styles + custom scrollbar
│   ├── store/
│   │   └── tradingStore.ts          # Zustand state management
│   └── components/
│       ├── TradingWidget.tsx         # Main widget container (glassmorphism)
│       ├── CuteRobotAvatar.tsx       # SVG robot character + purple aura
│       ├── ControlPanel.tsx          # RUN/PAUSE/SIMULATE/KILL-SWITCH
│       ├── SettingsPanel.tsx         # Multi-tab settings (Technical/Risk/AI)
│       ├── ActivityLog.tsx           # Real-time AI activity log
│       └── StatsDashboard.tsx        # Trading metrics display
├── backend/
│   └── ai_agent.py                  # Python AI architecture (Multi-Routing)
└── README.md
```

## 🎨 Features

### Visual & Animation
- **Cute Robot Character**: SVG-animated robot woman with blinking eyes and sweet smile
- **Purple Aura Effect**: Pulsing neon glow when agent is active (CSS + Framer Motion)
- **Multi-Routing Particles**: Dynamic node connections representing parallel AI processing
- **Glassmorphism Design**: Modern dark UI with frosted glass panels

### Control Panel
- ▶ **RUN AGENT**: Start real-time trading simulation
- ⏸ **PAUSE**: Pause agent while maintaining positions
- 🔬 **BACKTEST**: Run historical data simulation with progress bar
- 🚨 **EMERGENCY KILL-SWITCH**: Force-close all positions immediately

### Settings (3 Tabs)
1. **Technical Analysis**: RSI, MACD, EMA, Bollinger Bands, Ichimoku, AI Pattern Recognition, Volume Profile, Order Book Imbalance
2. **Risk Management**: Position Sizing (Fixed/Kelly/Volatility), Stop Loss (Fixed/ATR/Trailing), Take Profit, Max Drawdown, Max Positions
3. **AI Strategy**: Model selection (RL/LLM/Time-Series), Multi-Routing weights, Confidence threshold, Training parameters

## 🧠 AI Architecture (Multi-Routing)

```
┌─────────────────────────────────────────────────┐
│              META-AGENT (Orchestrator)           │
│  Combines signals → Final Decision (Buy/Sell)   │
├─────────┬──────────────┬────────────────────────┤
│ Sub-1   │   Sub-2      │      Sub-3             │
│Technical│  Sentiment   │    On-Chain            │
│ Analysis│  Analysis    │    Analysis            │
├─────────┼──────────────┼────────────────────────┤
│ RSI/MACD│ Twitter/News │  Whale Tracking        │
│ EMA/BB  │ Fear/Greed   │  DEX Volume            │
│ Patterns│ LLM/BERT    │  Order Flow            │
└─────────┴──────────────┴────────────────────────┘
```

### Key Concepts
- **Parallel Processing**: All sub-agents analyze data simultaneously
- **Dynamic Routing**: Weights adjust based on sub-agent historical accuracy
- **Confidence Threshold**: Only trades when combined confidence > threshold (default: 85%)
- **Risk Management**: Kelly Criterion, ATR-based stops, max drawdown limits

## 🚀 Tech Stack

### Frontend
- **React 18** + TypeScript
- **Tailwind CSS** (dark mode, glassmorphism)
- **Framer Motion** (animations, transitions)
- **Zustand** (state management)
- **Vite** (build tool)

### Backend (Python)
- **FastAPI** (WebSocket server)
- **NumPy** (numerical computations)
- **Async/Await** (parallel sub-agent execution)

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🔌 Embedding the Widget

The widget is designed to be embeddable in any platform:

```tsx
import TradingWidget from './components/TradingWidget';

function MyPage() {
  return <TradingWidget />;
}
```

## 📊 State Management

Uses Zustand for lightweight, reactive state:

```typescript
// Agent states: idle | running | simulating | paused | killed
const { status, runAgent, pauseAgent, killSwitch } = useTradingStore();
```

## 🎯 Configuration

All parameters are configurable through the UI:
- Technical indicators (periods, thresholds)
- Risk limits (position size, SL/TP, drawdown)
- AI model settings (routing weights, confidence threshold)

## 📝 License

MIT
