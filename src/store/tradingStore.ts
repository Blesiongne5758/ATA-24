import { create } from 'zustand';

// ============================================================
// TRADING AGENT STATE MANAGEMENT (Zustand Store)
// ============================================================

export type AgentStatus = 'idle' | 'running' | 'simulating' | 'paused' | 'killed';

export interface TradeLog {
  id: string;
  timestamp: Date;
  type: 'info' | 'trade' | 'warning' | 'error' | 'ai';
  message: string;
}

export interface TechnicalSettings {
  rsi: { period: number; overbought: number; oversold: number };
  macd: { fast: number; slow: number; signal: number };
  ema: { periods: number[] };
  bollingerBands: { period: number; stdDev: number };
  ichimoku: { tenkan: number; kijun: number; senkou: number };
  aiPatternRecognition: { enabled: boolean; confidence: number };
  volumeProfile: { enabled: boolean; lookback: number };
  orderBookImbalance: { enabled: boolean; threshold: number };
}

export interface RiskSettings {
  positionSizing: {
    method: 'fixed' | 'kelly' | 'volatility';
    fixedPercent: number;
    kellyFraction: number;
    volatilityMultiplier: number;
  };
  stopLoss: {
    method: 'fixed' | 'atr' | 'trailing';
    fixedPercent: number;
    atrMultiplier: number;
    trailingPercent: number;
  };
  takeProfit: { percent: number };
  maxDailyDrawdown: { percent: number };
  maxOpenPositions: { count: number };
}

export interface AISettings {
  model: 'reinforcement_learning' | 'llm_sentiment' | 'time_series';
  routingWeights: {
    technical: number;
    sentiment: number;
    onchain: number;
  };
  confidenceThreshold: number;
  learningRate: number;
  batchSize: number;
  epochs: number;
}

interface TradingState {
  // Agent Status
  status: AgentStatus;
  simulationProgress: number;
  
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
  
  // Actions
  setStatus: (status: AgentStatus) => void;
  setSimulationProgress: (progress: number) => void;
  updateTechnicalSettings: (settings: Partial<TechnicalSettings>) => void;
  updateRiskSettings: (settings: Partial<RiskSettings>) => void;
  updateAISettings: (settings: Partial<AISettings>) => void;
  addLog: (log: Omit<TradeLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  runAgent: () => void;
  pauseAgent: () => void;
  simulateAgent: () => void;
  killSwitch: () => void;
  resetAgent: () => void;
}

// Default settings
const defaultTechnicalSettings: TechnicalSettings = {
  rsi: { period: 14, overbought: 70, oversold: 30 },
  macd: { fast: 12, slow: 26, signal: 9 },
  ema: { periods: [9, 21, 50, 200] },
  bollingerBands: { period: 20, stdDev: 2 },
  ichimoku: { tenkan: 9, kijun: 26, senkou: 52 },
  aiPatternRecognition: { enabled: true, confidence: 0.75 },
  volumeProfile: { enabled: true, lookback: 100 },
  orderBookImbalance: { enabled: true, threshold: 0.6 },
};

const defaultRiskSettings: RiskSettings = {
  positionSizing: {
    method: 'kelly',
    fixedPercent: 2,
    kellyFraction: 0.5,
    volatilityMultiplier: 1.0,
  },
  stopLoss: {
    method: 'atr',
    fixedPercent: 2,
    atrMultiplier: 1.5,
    trailingPercent: 3,
  },
  takeProfit: { percent: 5 },
  maxDailyDrawdown: { percent: 5 },
  maxOpenPositions: { count: 3 },
};

const defaultAISettings: AISettings = {
  model: 'reinforcement_learning',
  routingWeights: {
    technical: 40,
    sentiment: 35,
    onchain: 25,
  },
  confidenceThreshold: 85,
  learningRate: 0.001,
  batchSize: 64,
  epochs: 100,
};

export const useTradingStore = create<TradingState>((set, get) => ({
  status: 'idle',
  simulationProgress: 0,
  
  technicalSettings: defaultTechnicalSettings,
  riskSettings: defaultRiskSettings,
  aiSettings: defaultAISettings,
  
  logs: [],
  
  currentPnL: 0,
  totalTrades: 0,
  winRate: 0,
  activePositions: 0,
  
  setStatus: (status) => set({ status }),
  setSimulationProgress: (progress) => set({ simulationProgress: progress }),
  
  updateTechnicalSettings: (settings) => set((state) => ({
    technicalSettings: { ...state.technicalSettings, ...settings }
  })),
  
  updateRiskSettings: (settings) => set((state) => ({
    riskSettings: { ...state.riskSettings, ...settings }
  })),
  
  updateAISettings: (settings) => set((state) => ({
    aiSettings: { ...state.aiSettings, ...settings }
  })),
  
  addLog: (log) => set((state) => ({
    logs: [{
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      ...log,
    }, ...state.logs].slice(0, 100)
  })),
  
  clearLogs: () => set({ logs: [] }),
  
  runAgent: () => {
    set({ status: 'running' });
    get().addLog({ type: 'info', message: '🚀 Agent started - Multi-Routing Neural Engine activated' });
    get().addLog({ type: 'ai', message: '🧠 Initializing sub-agents: Technical, Sentiment, On-Chain...' });
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
      status: 'idle', 
      simulationProgress: 0, 
      currentPnL: 0, 
      totalTrades: 0, 
      winRate: 0,
      activePositions: 0,
      logs: []
    });
  },
}));
