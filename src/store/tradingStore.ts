import { create } from 'zustand';

// ============================================================
// TRADING AGENT STATE MANAGEMENT (Zustand Store) - v2.0
// Extended with Market Selection, MT5, API, Gateway, Charts
// ============================================================

export type AgentStatus = 'idle' | 'running' | 'simulating' | 'paused' | 'killed';
export type MarketType = 'forex' | 'crypto' | 'stocks' | 'commodities' | 'indices' | 'options';
export type ChartType = 'candlestick' | 'linear' | 'area' | 'heikin_ashi';
export type TimeFrame = '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w';
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface TradeLog {
  id: string;
  timestamp: Date;
  type: 'info' | 'trade' | 'warning' | 'error' | 'ai' | 'system';
  message: string;
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Market Selection
export interface MarketConfig {
  type: MarketType;
  symbol: string;
  pair: string;
  timeFrame: TimeFrame;
  chartType: ChartType;
  lotSize: number;
  leverage: number;
}

// MT5 Settings
export interface MT5Settings {
  enabled: boolean;
  server: string;
  login: string;
  password: string;
  accountType: 'demo' | 'live';
  connectionStatus: ConnectionStatus;
  broker: string;
}

// API Settings
export interface APIConfig {
  id: string;
  name: string;
  provider: string;
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
  enabled: boolean;
  connectionStatus: ConnectionStatus;
  rateLimit: number;
}

// Gateway Multi AI Agent
export interface GatewayNode {
  id: string;
  name: string;
  type: 'technical' | 'sentiment' | 'onchain' | 'ml' | 'custom';
  endpoint: string;
  apiKey: string;
  enabled: boolean;
  weight: number;
  latency: number;
  status: ConnectionStatus;
}

// Auto Trading System
export interface AutoTradeConfig {
  enabled: boolean;
  mode: 'conservative' | 'balanced' | 'aggressive' | 'scalping' | 'swing';
  maxTradesPerDay: number;
  cooldownPeriod: number; // seconds between trades
  autoCompound: boolean;
  compoundPercent: number;
  trailingActivation: number;
  breakEvenTrigger: number;
  partialTP: { enabled: boolean; percent: number; closePercent: number };
  newsFilter: { enabled: boolean; minutesBefore: number };
  sessionFilter: { enabled: boolean; sessions: string[] };
}

// Simulation State
export interface SimulationState {
  isRunning: boolean;
  progress: number;
  currentCandle: number;
  totalCandles: number;
  equity: number;
  initialBalance: number;
  trades: SimulatedTrade[];
  equityCurve: number[];
}

export interface SimulatedTrade {
  id: string;
  entryTime: number;
  exitTime: number;
  type: 'buy' | 'sell';
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  pnlPercent: number;
  reason: string;
}

// Technical Settings
export interface TechnicalSettings {
  rsi: { period: number; overbought: number; oversold: number };
  macd: { fast: number; slow: number; signal: number };
  ema: { periods: number[] };
  bollingerBands: { period: number; stdDev: number };
  ichimoku: { tenkan: number; kijun: number; senkou: number };
  aiPatternRecognition: { enabled: boolean; confidence: number };
  volumeProfile: { enabled: boolean; lookback: number };
  orderBookImbalance: { enabled: boolean; threshold: number };
  stochastic: { k: number; d: number; overbought: number; oversold: number };
  adx: { period: number; threshold: number };
}

// Risk Settings
export interface RiskSettings {
  positionSizing: { method: 'fixed' | 'kelly' | 'volatility'; fixedPercent: number; kellyFraction: number; volatilityMultiplier: number };
  stopLoss: { method: 'fixed' | 'atr' | 'trailing'; fixedPercent: number; atrMultiplier: number; trailingPercent: number };
  takeProfit: { percent: number };
  maxDailyDrawdown: { percent: number };
  maxOpenPositions: { count: number };
  riskRewardRatio: { min: number };
  correlationLimit: { max: number };
}

// AI Settings
export interface AISettings {
  model: 'reinforcement_learning' | 'llm_sentiment' | 'time_series' | 'ensemble' | 'transformer';
  routingWeights: { technical: number; sentiment: number; onchain: number };
  confidenceThreshold: number;
  learningRate: number;
  batchSize: number;
  epochs: number;
  ensembleMethods: string[];
}

interface TradingState {
  // Agent Status
  status: AgentStatus;
  simulationProgress: number;

  // Market Config
  marketConfig: MarketConfig;
  
  // MT5 Settings
  mt5Settings: MT5Settings;
  
  // API Configs
  apiConfigs: APIConfig[];
  
  // Gateway Nodes
  gatewayNodes: GatewayNode[];
  
  // Auto Trading
  autoTradeConfig: AutoTradeConfig;
  
  // Simulation
  simulation: SimulationState;
  
  // Chart Data
  chartData: CandleData[];
  
  // Settings
  technicalSettings: TechnicalSettings;
  riskSettings: RiskSettings;
  aiSettings: AISettings;
  
  // Logs
  logs: TradeLog[];
  
  // Trading Data
  currentPnL: number;
  totalTrades: number;
  winRate: number;
  activePositions: number;
  balance: number;
  equity: number;
  
  // UI State
  activePanel: 'chart' | 'dashboard' | 'logs' | 'simulation';
  settingsTab: 'market' | 'technical' | 'risk' | 'ai' | 'mt5' | 'api' | 'gateway' | 'auto' | 'other';

  // Actions
  setStatus: (status: AgentStatus) => void;
  setSimulationProgress: (progress: number) => void;
  updateMarketConfig: (config: Partial<MarketConfig>) => void;
  updateMT5Settings: (settings: Partial<MT5Settings>) => void;
  addAPIConfig: (config: APIConfig) => void;
  updateAPIConfig: (id: string, config: Partial<APIConfig>) => void;
  removeAPIConfig: (id: string) => void;
  addGatewayNode: (node: GatewayNode) => void;
  updateGatewayNode: (id: string, node: Partial<GatewayNode>) => void;
  removeGatewayNode: (id: string) => void;
  updateAutoTradeConfig: (config: Partial<AutoTradeConfig>) => void;
  updateTechnicalSettings: (settings: Partial<TechnicalSettings>) => void;
  updateRiskSettings: (settings: Partial<RiskSettings>) => void;
  updateAISettings: (settings: Partial<AISettings>) => void;
  updateSimulation: (state: Partial<SimulationState>) => void;
  addChartData: (candle: CandleData) => void;
  generateChartData: (count: number, basePrice: number) => void;
  addLog: (log: Omit<TradeLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  runAgent: () => void;
  pauseAgent: () => void;
  simulateAgent: () => void;
  killSwitch: () => void;
  resetAgent: () => void;
  setActivePanel: (panel: TradingState['activePanel']) => void;
  setSettingsTab: (tab: TradingState['settingsTab']) => void;
  connectMT5: () => void;
  disconnectMT5: () => void;
}

// Default values
const defaultMarketConfig: MarketConfig = {
  type: 'crypto',
  symbol: 'BTCUSDT',
  pair: 'BTC/USDT',
  timeFrame: '1h',
  chartType: 'candlestick',
  lotSize: 0.01,
  leverage: 1,
};

const defaultMT5Settings: MT5Settings = {
  enabled: false,
  server: 'MetaQuotes-Demo',
  login: '',
  password: '',
  accountType: 'demo',
  connectionStatus: 'disconnected',
  broker: 'MetaQuotes',
};

const defaultAPIConfigs: APIConfig[] = [
  { id: '1', name: 'Binance', provider: 'binance', apiKey: '', apiSecret: '', baseUrl: 'https://api.binance.com', enabled: false, connectionStatus: 'disconnected', rateLimit: 1200 },
  { id: '2', name: 'MetaTrader 5', provider: 'mt5', apiKey: '', apiSecret: '', baseUrl: 'ws://localhost:8080', enabled: false, connectionStatus: 'disconnected', rateLimit: 100 },
];

const defaultGatewayNodes: GatewayNode[] = [
  { id: '1', name: 'Technical Agent', type: 'technical', endpoint: 'http://localhost:5001/analyze', apiKey: '', enabled: true, weight: 0.40, latency: 0, status: 'disconnected' },
  { id: '2', name: 'Sentiment Agent', type: 'sentiment', endpoint: 'http://localhost:5002/analyze', apiKey: '', enabled: true, weight: 0.35, latency: 0, status: 'disconnected' },
  { id: '3', name: 'On-Chain Agent', type: 'onchain', endpoint: 'http://localhost:5003/analyze', apiKey: '', enabled: true, weight: 0.25, latency: 0, status: 'disconnected' },
  { id: '4', name: 'ML Forecast Agent', type: 'ml', endpoint: 'http://localhost:5004/predict', apiKey: '', enabled: false, weight: 0, latency: 0, status: 'disconnected' },
];

const defaultAutoTradeConfig: AutoTradeConfig = {
  enabled: false,
  mode: 'balanced',
  maxTradesPerDay: 10,
  cooldownPeriod: 300,
  autoCompound: false,
  compoundPercent: 50,
  trailingActivation: 1.5,
  breakEvenTrigger: 1.0,
  partialTP: { enabled: false, percent: 50, closePercent: 50 },
  newsFilter: { enabled: false, minutesBefore: 30 },
  sessionFilter: { enabled: false, sessions: ['london', 'new_york'] },
};

const defaultTechnicalSettings: TechnicalSettings = {
  rsi: { period: 14, overbought: 70, oversold: 30 },
  macd: { fast: 12, slow: 26, signal: 9 },
  ema: { periods: [9, 21, 50, 200] },
  bollingerBands: { period: 20, stdDev: 2 },
  ichimoku: { tenkan: 9, kijun: 26, senkou: 52 },
  aiPatternRecognition: { enabled: true, confidence: 0.75 },
  volumeProfile: { enabled: true, lookback: 100 },
  orderBookImbalance: { enabled: true, threshold: 0.6 },
  stochastic: { k: 14, d: 3, overbought: 80, oversold: 20 },
  adx: { period: 14, threshold: 25 },
};

const defaultRiskSettings: RiskSettings = {
  positionSizing: { method: 'kelly', fixedPercent: 2, kellyFraction: 0.5, volatilityMultiplier: 1.0 },
  stopLoss: { method: 'atr', fixedPercent: 2, atrMultiplier: 1.5, trailingPercent: 3 },
  takeProfit: { percent: 5 },
  maxDailyDrawdown: { percent: 5 },
  maxOpenPositions: { count: 3 },
  riskRewardRatio: { min: 2.0 },
  correlationLimit: { max: 0.7 },
};

const defaultAISettings: AISettings = {
  model: 'ensemble',
  routingWeights: { technical: 40, sentiment: 35, onchain: 25 },
  confidenceThreshold: 85,
  learningRate: 0.001,
  batchSize: 64,
  epochs: 100,
  ensembleMethods: ['weighted_average', 'stacking', 'voting'],
};

// Generate realistic candle data
function generateCandles(count: number, basePrice: number): CandleData[] {
  const candles: CandleData[] = [];
  let price = basePrice;
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const volatility = price * 0.015;
    const change = (Math.random() - 0.48) * volatility;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.floor(Math.random() * 10000 + 1000);
    
    candles.push({
      time: now - (count - i) * 3600000,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume,
    });
    
    price = close;
  }
  return candles;
}

export const useTradingStore = create<TradingState>((set, get) => ({
  status: 'idle',
  simulationProgress: 0,
  marketConfig: defaultMarketConfig,
  mt5Settings: defaultMT5Settings,
  apiConfigs: defaultAPIConfigs,
  gatewayNodes: defaultGatewayNodes,
  autoTradeConfig: defaultAutoTradeConfig,
  simulation: {
    isRunning: false,
    progress: 0,
    currentCandle: 0,
    totalCandles: 1000,
    equity: 10000,
    initialBalance: 10000,
    trades: [],
    equityCurve: [10000],
  },
  chartData: generateCandles(100, 67000),
  technicalSettings: defaultTechnicalSettings,
  riskSettings: defaultRiskSettings,
  aiSettings: defaultAISettings,
  logs: [],
  currentPnL: 0,
  totalTrades: 0,
  winRate: 0,
  activePositions: 0,
  balance: 10000,
  equity: 10000,
  activePanel: 'chart',
  settingsTab: 'market',

  setStatus: (status) => set({ status }),
  setSimulationProgress: (progress) => set({ simulationProgress: progress }),
  updateMarketConfig: (config) => set((state) => ({
    marketConfig: { ...state.marketConfig, ...config }
  })),
  updateMT5Settings: (settings) => set((state) => ({
    mt5Settings: { ...state.mt5Settings, ...settings }
  })),
  addAPIConfig: (config) => set((state) => ({
    apiConfigs: [...state.apiConfigs, config]
  })),
  updateAPIConfig: (id, config) => set((state) => ({
    apiConfigs: state.apiConfigs.map(api => api.id === id ? { ...api, ...config } : api)
  })),
  removeAPIConfig: (id) => set((state) => ({
    apiConfigs: state.apiConfigs.filter(api => api.id !== id)
  })),
  addGatewayNode: (node) => set((state) => ({
    gatewayNodes: [...state.gatewayNodes, node]
  })),
  updateGatewayNode: (id, node) => set((state) => ({
    gatewayNodes: state.gatewayNodes.map(n => n.id === id ? { ...n, ...node } : n)
  })),
  removeGatewayNode: (id) => set((state) => ({
    gatewayNodes: state.gatewayNodes.filter(n => n.id !== id)
  })),
  updateAutoTradeConfig: (config) => set((state) => ({
    autoTradeConfig: { ...state.autoTradeConfig, ...config }
  })),
  updateTechnicalSettings: (settings) => set((state) => ({
    technicalSettings: { ...state.technicalSettings, ...settings }
  })),
  updateRiskSettings: (settings) => set((state) => ({
    riskSettings: { ...state.riskSettings, ...settings }
  })),
  updateAISettings: (settings) => set((state) => ({
    aiSettings: { ...state.aiSettings, ...settings }
  })),
  updateSimulation: (simState) => set((state) => ({
    simulation: { ...state.simulation, ...simState }
  })),
  addChartData: (candle) => set((state) => ({
    chartData: [...state.chartData.slice(-200), candle]
  })),
  generateChartData: (count, basePrice) => set({
    chartData: generateCandles(count, basePrice)
  }),
  addLog: (log) => set((state) => ({
    logs: [{
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      ...log,
    }, ...state.logs].slice(0, 200)
  })),
  clearLogs: () => set({ logs: [] }),
  
  runAgent: () => {
    set({ status: 'running' });
    get().addLog({ type: 'info', message: '🚀 Agent started - Multi-Routing Neural Engine activated' });
    get().addLog({ type: 'ai', message: '🧠 Initializing sub-agents: Technical, Sentiment, On-Chain...' });
    get().addLog({ type: 'system', message: `📡 Market: ${get().marketConfig.pair} | TF: ${get().marketConfig.timeFrame}` });
  },
  
  pauseAgent: () => {
    set({ status: 'paused' });
    get().addLog({ type: 'warning', message: '⏸️ Agent paused - All positions maintained' });
  },
  
  simulateAgent: () => {
    set({ status: 'simulating', simulationProgress: 0 });
    get().addLog({ type: 'info', message: '📊 Backtest simulation started with historical data...' });
    get().addLog({ type: 'ai', message: '🔬 Loading 50,000 data points for backtesting...' });
  },
  
  killSwitch: () => {
    set({ status: 'killed', activePositions: 0 });
    get().addLog({ type: 'error', message: '🚨 EMERGENCY KILL-SWITCH ACTIVATED - All positions closed!' });
    get().addLog({ type: 'error', message: '🛑 Agent terminated. Manual restart required.' });
  },
  
  resetAgent: () => {
    set({ 
      status: 'idle', simulationProgress: 0, currentPnL: 0, totalTrades: 0, 
      winRate: 0, activePositions: 0, logs: [],
      simulation: { isRunning: false, progress: 0, currentCandle: 0, totalCandles: 1000, equity: 10000, initialBalance: 10000, trades: [], equityCurve: [10000] },
      balance: 10000, equity: 10000,
    });
  },
  
  setActivePanel: (panel) => set({ activePanel: panel }),
  setSettingsTab: (tab) => set({ settingsTab: tab }),
  
  connectMT5: () => {
    set((state) => ({ mt5Settings: { ...state.mt5Settings, connectionStatus: 'connecting' } }));
    get().addLog({ type: 'system', message: '🔌 Connecting to MT5 server...' });
    setTimeout(() => {
      const settings = get().mt5Settings;
      if (settings.login && settings.password) {
        set((state) => ({ mt5Settings: { ...state.mt5Settings, connectionStatus: 'connected' } }));
        get().addLog({ type: 'info', message: `✅ MT5 Connected - Account: ${settings.login} (${settings.accountType})` });
      } else {
        set((state) => ({ mt5Settings: { ...state.mt5Settings, connectionStatus: 'error' } }));
        get().addLog({ type: 'error', message: '❌ MT5 Connection failed - Invalid credentials' });
      }
    }, 2000);
  },
  
  disconnectMT5: () => {
    set((state) => ({ mt5Settings: { ...state.mt5Settings, connectionStatus: 'disconnected' } }));
    get().addLog({ type: 'warning', message: '🔌 MT5 Disconnected' });
  },
}));
