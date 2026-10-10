import { create } from 'zustand';

// ============================================================
// LIVE TRADING DEMO STORE
// Real-time trading simulation with $10,000 USD starting balance
// ============================================================

export type PositionSide = 'long' | 'short';
export type OrderStatus = 'open' | 'closed' | 'cancelled';

export interface LivePosition {
  id: string;
  side: PositionSide;
  entryPrice: number;
  currentPrice: number;
  size: number; // in USD
  leverage: number;
  stopLoss: number;
  takeProfit: number;
  entryTime: number;
  pnl: number;
  pnlPercent: number;
  status: OrderStatus;
  reason: string;
  exitPrice?: number;
  exitTime?: number;
  exitReason?: string;
}

export interface LiveCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isClosed: boolean;
}

export interface TradeSignal {
  time: number;
  type: 'buy' | 'sell' | 'close_long' | 'close_short';
  price: number;
  reason: string;
  confidence: number;
  positionId?: string;
}

export interface AIBrainState {
  rsi: number;
  macd: number;
  ema9: number;
  ema21: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  momentum: number;
  volatility: number;
  signal: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
  confidence: number;
  reasoning: string[];
}

interface LiveTradingState {
  // Balance & Equity
  balance: number;
  equity: number;
  initialBalance: number;
  unrealizedPnL: number;
  realizedPnL: number;
  
  // Live Chart
  candles: LiveCandle[];
  currentPrice: number;
  priceHistory: number[];
  tickCount: number;
  
  // Positions
  positions: LivePosition[];
  closedPositions: LivePosition[];
  totalTrades: number;
  winCount: number;
  lossCount: number;
  
  // AI Brain
  aiBrain: AIBrainState;
  aiThoughts: string[];
  
  // Signals
  signals: TradeSignal[];
  
  // Equity Curve
  equityCurve: number[];
  
  // Control
  isRunning: boolean;
  speed: number; // 1 = normal, 2 = fast, 3 = ultra
  
  // Actions
  startDemo: () => void;
  stopDemo: () => void;
  resetDemo: () => void;
  setSpeed: (speed: number) => void;
  tick: () => void;
  addCandle: () => void;
  updatePrice: (price: number) => void;
  openPosition: (side: PositionSide, reason: string, confidence: number) => void;
  closePosition: (id: string, reason: string) => void;
  updateAIBrain: () => void;
}

// Helper: Calculate EMA
function calcEMA(values: number[], period: number): number {
  if (values.length < period) return values[values.length - 1] || 0;
  const multiplier = 2 / (period + 1);
  let ema = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < values.length; i++) {
    ema = (values[i] - ema) * multiplier + ema;
  }
  return ema;
}

// Helper: Calculate RSI
function calcRSI(closes: number[], period: number = 14): number {
  if (closes.length < period + 1) return 50;
  const recent = closes.slice(-(period + 1));
  let gains = 0, losses = 0;
  for (let i = 1; i < recent.length; i++) {
    const diff = recent[i] - recent[i - 1];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period || 0.001;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

// Generate initial candles
function generateInitialCandles(count: number, basePrice: number): LiveCandle[] {
  const candles: LiveCandle[] = [];
  let price = basePrice;
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const volatility = price * 0.008;
    const trend = Math.sin(i / 15) * volatility * 0.5;
    const change = (Math.random() - 0.48) * volatility + trend;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.6;
    const low = Math.min(open, close) - Math.random() * volatility * 0.6;
    const volume = Math.floor(Math.random() * 5000 + 1000);
    
    candles.push({
      time: now - (count - i) * 5000,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume,
      isClosed: true,
    });
    
    price = close;
  }
  return candles;
}

const INITIAL_BALANCE = 10000;
const BASE_PRICE = 67500; // BTC price

export const useLiveTradingStore = create<LiveTradingState>((set, get) => ({
  balance: INITIAL_BALANCE,
  equity: INITIAL_BALANCE,
  initialBalance: INITIAL_BALANCE,
  unrealizedPnL: 0,
  realizedPnL: 0,
  
  candles: generateInitialCandles(60, BASE_PRICE),
  currentPrice: BASE_PRICE,
  priceHistory: Array.from({ length: 60 }, () => BASE_PRICE),
  tickCount: 0,
  
  positions: [],
  closedPositions: [],
  totalTrades: 0,
  winCount: 0,
  lossCount: 0,
  
  aiBrain: {
    rsi: 50,
    macd: 0,
    ema9: BASE_PRICE,
    ema21: BASE_PRICE,
    trend: 'neutral',
    momentum: 0,
    volatility: 0,
    signal: 'hold',
    confidence: 0,
    reasoning: ['Initializing AI neural engine...'],
  },
  
  aiThoughts: ['🧠 AI Agent initialized. Scanning market conditions...'],
  signals: [],
  equityCurve: [INITIAL_BALANCE],
  
  isRunning: false,
  speed: 1,
  
  startDemo: () => {
    set({ isRunning: true });
    get().aiThoughts = ['🚀 Live trading demo started!', '🧠 AI analyzing market structure...'];
  },
  
  stopDemo: () => set({ isRunning: false }),
  
  resetDemo: () => {
    set({
      balance: INITIAL_BALANCE,
      equity: INITIAL_BALANCE,
      unrealizedPnL: 0,
      realizedPnL: 0,
      candles: generateInitialCandles(60, BASE_PRICE),
      currentPrice: BASE_PRICE,
      priceHistory: Array.from({ length: 60 }, () => BASE_PRICE),
      tickCount: 0,
      positions: [],
      closedPositions: [],
      totalTrades: 0,
      winCount: 0,
      lossCount: 0,
      signals: [],
      equityCurve: [INITIAL_BALANCE],
      isRunning: false,
      aiThoughts: ['🔄 Demo reset. Ready to start.'],
      aiBrain: {
        rsi: 50, macd: 0, ema9: BASE_PRICE, ema21: BASE_PRICE,
        trend: 'neutral', momentum: 0, volatility: 0,
        signal: 'hold', confidence: 0,
        reasoning: ['System reset. Awaiting start...'],
      },
    });
  },
  
  setSpeed: (speed) => set({ speed }),
  
  tick: () => {
    const state = get();
    if (!state.isRunning) return;
    
    const lastCandle = state.candles[state.candles.length - 1];
    const closes = state.candles.map(c => c.close);
    
    // Generate new price tick (micro-movements within candle)
    const volatility = state.currentPrice * 0.001;
    const trend = state.aiBrain.trend === 'bullish' ? 0.0001 : 
                  state.aiBrain.trend === 'bearish' ? -0.0001 : 0;
    const noise = (Math.random() - 0.5) * volatility;
    const newPrice = Math.max(100, state.currentPrice + noise + trend * state.currentPrice);
    
    // Update current candle
    const updatedCandles = [...state.candles];
    const currentCandle = { ...updatedCandles[updatedCandles.length - 1] };
    currentCandle.close = Math.round(newPrice * 100) / 100;
    currentCandle.high = Math.max(currentCandle.high, currentCandle.close);
    currentCandle.low = Math.min(currentCandle.low, currentCandle.close);
    currentCandle.volume += Math.floor(Math.random() * 50);
    updatedCandles[updatedCandles.length - 1] = currentCandle;
    
    // New candle every 20 ticks
    const newTickCount = state.tickCount + 1;
    if (newTickCount % 20 === 0) {
      currentCandle.isClosed = true;
      const newCandle: LiveCandle = {
        time: Date.now(),
        open: newPrice,
        high: newPrice,
        low: newPrice,
        close: newPrice,
        volume: 0,
        isClosed: false,
      };
      updatedCandles.push(newCandle);
      if (updatedCandles.length > 100) updatedCandles.shift();
      
      // AI makes decisions on new candle
      get().updateAIBrain();
    }
    
    // Update positions P&L
    let unrealizedPnL = 0;
    const updatedPositions = state.positions.map(pos => {
      const currentPnl = pos.side === 'long' 
        ? (newPrice - pos.entryPrice) / pos.entryPrice * pos.size * pos.leverage
        : (pos.entryPrice - newPrice) / pos.entryPrice * pos.size * pos.leverage;
      const pnlPercent = currentPnl / pos.size * 100;
      unrealizedPnL += currentPnl;
      
      // Check SL/TP
      if (pos.side === 'long') {
        if (newPrice <= pos.stopLoss) {
          setTimeout(() => get().closePosition(pos.id, '🛑 Stop Loss hit'), 0);
        } else if (newPrice >= pos.takeProfit) {
          setTimeout(() => get().closePosition(pos.id, '🎯 Take Profit hit'), 0);
        }
      } else {
        if (newPrice >= pos.stopLoss) {
          setTimeout(() => get().closePosition(pos.id, '🛑 Stop Loss hit'), 0);
        } else if (newPrice <= pos.takeProfit) {
          setTimeout(() => get().closePosition(pos.id, '🎯 Take Profit hit'), 0);
        }
      }
      
      return { ...pos, currentPrice: newPrice, pnl: currentPnl, pnlPercent };
    });
    
    const equity = state.balance + unrealizedPnL;
    const newPriceHistory = [...state.priceHistory.slice(-200), newPrice];
    const newEquityCurve = [...state.equityCurve.slice(-500), equity];
    
    set({
      candles: updatedCandles,
      currentPrice: Math.round(newPrice * 100) / 100,
      priceHistory: newPriceHistory,
      tickCount: newTickCount,
      positions: updatedPositions,
      unrealizedPnL,
      equity,
      equityCurve: newEquityCurve,
    });
  },
  
  updateAIBrain: () => {
    const state = get();
    const closes = state.candles.filter(c => c.isClosed).map(c => c.close);
    
    if (closes.length < 25) return;
    
    // Calculate indicators
    const rsi = calcRSI(closes);
    const ema9 = calcEMA(closes, 9);
    const ema21 = calcEMA(closes, 21);
    const macd = (ema9 - ema21) / state.currentPrice * 100;
    
    // Trend detection
    const trend = ema9 > ema21 ? 'bullish' : ema9 < ema21 ? 'bearish' : 'neutral';
    
    // Momentum (rate of change)
    const momentum = closes.length > 5 
      ? (closes[closes.length - 1] - closes[closes.length - 5]) / closes[closes.length - 5] * 100 
      : 0;
    
    // Volatility
    const recentCloses = closes.slice(-20);
    const returns = recentCloses.slice(1).map((c, i) => (c - recentCloses[i]) / recentCloses[i]);
    const volatility = Math.sqrt(returns.reduce((s, r) => s + r * r, 0) / returns.length) * 100;
    
    // AI Decision Logic
    const reasoning: string[] = [];
    let score = 0;
    
    // RSI Analysis
    if (rsi < 30) { score += 2; reasoning.push(`📊 RSI oversold (${rsi.toFixed(1)}) → Bullish`); }
    else if (rsi > 70) { score -= 2; reasoning.push(`📊 RSI overbought (${rsi.toFixed(1)}) → Bearish`); }
    else if (rsi < 45) { score += 0.5; reasoning.push(`📊 RSI neutral-low (${rsi.toFixed(1)})`); }
    else if (rsi > 55) { score -= 0.5; reasoning.push(`📊 RSI neutral-high (${rsi.toFixed(1)})`); }
    else { reasoning.push(`📊 RSI neutral (${rsi.toFixed(1)})`); }
    
    // EMA Cross
    if (ema9 > ema21 && closes[closes.length - 2] <= calcEMA(closes.slice(0, -1), 21)) {
      score += 3; reasoning.push('📈 EMA Golden Cross detected! Strong bullish signal');
    } else if (ema9 < ema21 && closes[closes.length - 2] >= calcEMA(closes.slice(0, -1), 21)) {
      score -= 3; reasoning.push('📉 EMA Death Cross detected! Strong bearish signal');
    } else if (ema9 > ema21) {
      score += 1; reasoning.push('📈 EMA 9 > EMA 21 (Uptrend)');
    } else {
      score -= 1; reasoning.push('📉 EMA 9 < EMA 21 (Downtrend)');
    }
    
    // MACD
    if (macd > 0.1) { score += 1; reasoning.push(`📊 MACD positive (${macd.toFixed(3)}) → Bullish momentum`); }
    else if (macd < -0.1) { score -= 1; reasoning.push(`📊 MACD negative (${macd.toFixed(3)}) → Bearish momentum`); }
    
    // Momentum
    if (momentum > 0.5) { score += 1; reasoning.push(`⚡ Strong upward momentum (+${momentum.toFixed(2)}%)`); }
    else if (momentum < -0.5) { score -= 1; reasoning.push(`⚡ Strong downward momentum (${momentum.toFixed(2)}%)`); }
    
    // Determine signal
    let signal: AIBrainState['signal'];
    let confidence: number;
    
    if (score >= 4) { signal = 'strong_buy'; confidence = Math.min(0.95, 0.7 + score * 0.05); }
    else if (score >= 2) { signal = 'buy'; confidence = Math.min(0.85, 0.6 + score * 0.05); }
    else if (score <= -4) { signal = 'strong_sell'; confidence = Math.min(0.95, 0.7 + Math.abs(score) * 0.05); }
    else if (score <= -2) { signal = 'sell'; confidence = Math.min(0.85, 0.6 + Math.abs(score) * 0.05); }
    else { signal = 'hold'; confidence = 0.3 + Math.abs(score) * 0.1; }
    
    // Execute trades based on signal
    const openPositions = state.positions;
    const hasLong = openPositions.some(p => p.side === 'long');
    const hasShort = openPositions.some(p => p.side === 'short');
    const maxPositions = 2;
    
    // Close opposing positions
    if ((signal === 'strong_sell' || signal === 'sell') && hasLong && confidence > 0.7) {
      const longPos = openPositions.find(p => p.side === 'long');
      if (longPos) {
        setTimeout(() => get().closePosition(longPos.id, `🧠 AI Signal: ${signal} (conf: ${(confidence * 100).toFixed(0)}%)`), 100);
      }
    }
    if ((signal === 'strong_buy' || signal === 'buy') && hasShort && confidence > 0.7) {
      const shortPos = openPositions.find(p => p.side === 'short');
      if (shortPos) {
        setTimeout(() => get().closePosition(shortPos.id, `🧠 AI Signal: ${signal} (conf: ${(confidence * 100).toFixed(0)}%)`), 100);
      }
    }
    
    // Open new positions
    if (openPositions.length < maxPositions) {
      if ((signal === 'strong_buy' || signal === 'buy') && !hasLong && confidence > 0.72) {
        reasoning.push(`🎯 EXECUTING: Long position | Confidence: ${(confidence * 100).toFixed(0)}%`);
        setTimeout(() => get().openPosition('long', `AI ${signal} signal`, confidence), 200);
      }
      if ((signal === 'strong_sell' || signal === 'sell') && !hasShort && confidence > 0.72) {
        reasoning.push(`🎯 EXECUTING: Short position | Confidence: ${(confidence * 100).toFixed(0)}%`);
        setTimeout(() => get().openPosition('short', `AI ${signal} signal`, confidence), 200);
      }
    }
    
    if (signal === 'hold') {
      reasoning.push('⏸️ AI decides to HOLD - Waiting for clearer signal');
    }
    
    set({
      aiBrain: {
        rsi, macd, ema9, ema21, trend, momentum, volatility,
        signal, confidence, reasoning,
      },
      aiThoughts: [
        ...reasoning.slice(-3),
        ...state.aiThoughts.slice(0, 15),
      ].slice(0, 20),
    });
  },
  
  openPosition: (side, reason, confidence) => {
    const state = get();
    const riskPercent = 0.02; // 2% risk per trade
    const positionSize = state.balance * riskPercent;
    const slPercent = 0.015; // 1.5% SL
    const tpPercent = 0.035; // 3.5% TP (R:R = 2.33)
    
    const entryPrice = state.currentPrice;
    let stopLoss: number, takeProfit: number;
    
    if (side === 'long') {
      stopLoss = entryPrice * (1 - slPercent);
      takeProfit = entryPrice * (1 + tpPercent);
    } else {
      stopLoss = entryPrice * (1 + slPercent);
      takeProfit = entryPrice * (1 - tpPercent);
    }
    
    const position: LivePosition = {
      id: `pos-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      side,
      entryPrice,
      currentPrice: entryPrice,
      size: positionSize,
      leverage: 5,
      stopLoss: Math.round(stopLoss * 100) / 100,
      takeProfit: Math.round(takeProfit * 100) / 100,
      entryTime: Date.now(),
      pnl: 0,
      pnlPercent: 0,
      status: 'open',
      reason,
    };
    
    const signal: TradeSignal = {
      time: Date.now(),
      type: side === 'long' ? 'buy' : 'sell',
      price: entryPrice,
      reason,
      confidence,
      positionId: position.id,
    };
    
    set({
      positions: [...state.positions, position],
      signals: [signal, ...state.signals].slice(0, 50),
      totalTrades: state.totalTrades + 1,
    });
  },
  
  closePosition: (id, reason) => {
    const state = get();
    const posIndex = state.positions.findIndex(p => p.id === id);
    if (posIndex === -1) return;
    
    const pos = state.positions[posIndex];
    const exitPrice = state.currentPrice;
    const pnl = pos.side === 'long'
      ? (exitPrice - pos.entryPrice) / pos.entryPrice * pos.size * pos.leverage
      : (pos.entryPrice - exitPrice) / pos.entryPrice * pos.size * pos.leverage;
    
    const closedPos: LivePosition = {
      ...pos,
      exitPrice,
      exitTime: Date.now(),
      exitReason: reason,
      pnl,
      pnlPercent: pnl / pos.size * 100,
      status: 'closed',
    };
    
    const newBalance = state.balance + pnl;
    const isWin = pnl > 0;
    
    const signal: TradeSignal = {
      time: Date.now(),
      type: pos.side === 'long' ? 'close_long' : 'close_short',
      price: exitPrice,
      reason: `${reason} | PnL: ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)}`,
      confidence: 0,
      positionId: id,
    };
    
    set({
      positions: state.positions.filter(p => p.id !== id),
      closedPositions: [closedPos, ...state.closedPositions].slice(0, 100),
      balance: Math.round(newBalance * 100) / 100,
      realizedPnL: state.realizedPnL + pnl,
      totalTrades: state.totalTrades,
      winCount: state.winCount + (isWin ? 1 : 0),
      lossCount: state.lossCount + (isWin ? 0 : 1),
      signals: [signal, ...state.signals].slice(0, 50),
      aiThoughts: [
        `${isWin ? '✅' : '❌'} Position closed: ${pos.side.toUpperCase()} | PnL: ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)} (${pos.pnlPercent.toFixed(1)}%)`,
        ...state.aiThoughts.slice(0, 19),
      ],
    });
  },
  
  addCandle: () => {},
  updatePrice: () => {},
}));
