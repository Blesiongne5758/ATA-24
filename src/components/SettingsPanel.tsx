import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTradingStore } from '../store/tradingStore';

// ============================================================
// SETTINGS PANEL COMPONENT
// Features: Multi-tab settings for Technical, Risk, and AI
// ============================================================

type TabType = 'technical' | 'risk' | 'ai';

export default function SettingsPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('technical');
  const { technicalSettings, riskSettings, aiSettings, updateTechnicalSettings, updateRiskSettings, updateAISettings } = useTradingStore();

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'technical', label: 'Technical', icon: '📊' },
    { id: 'risk', label: 'Risk Mgmt', icon: '🛡️' },
    { id: 'ai', label: 'AI Strategy', icon: '🧠' },
  ];

  return (
    <div className="space-y-3">
      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-gray-900/50 rounded-xl border border-gray-700/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar"
        >
          {activeTab === 'technical' && <TechnicalTab settings={technicalSettings} onUpdate={updateTechnicalSettings} />}
          {activeTab === 'risk' && <RiskTab settings={riskSettings} onUpdate={updateRiskSettings} />}
          {activeTab === 'ai' && <AITab settings={aiSettings} onUpdate={updateAISettings} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// TAB A: Technical Analysis Settings
// ============================================================
function TechnicalTab({ settings, onUpdate }: { settings: any; onUpdate: (s: any) => void }) {
  return (
    <div className="space-y-3">
      <SectionTitle title="Standard Indicators" />
      
      {/* RSI */}
      <SettingGroup title="RSI (Relative Strength Index)">
        <div className="grid grid-cols-3 gap-2">
          <NumberInput label="Period" value={settings.rsi.period} onChange={(v) => onUpdate({ rsi: { ...settings.rsi, period: v } })} min={2} max={50} />
          <NumberInput label="Overbought" value={settings.rsi.overbought} onChange={(v) => onUpdate({ rsi: { ...settings.rsi, overbought: v } })} min={50} max={95} />
          <NumberInput label="Oversold" value={settings.rsi.oversold} onChange={(v) => onUpdate({ rsi: { ...settings.rsi, oversold: v } })} min={5} max={50} />
        </div>
      </SettingGroup>

      {/* MACD */}
      <SettingGroup title="MACD">
        <div className="grid grid-cols-3 gap-2">
          <NumberInput label="Fast" value={settings.macd.fast} onChange={(v) => onUpdate({ macd: { ...settings.macd, fast: v } })} min={2} max={50} />
          <NumberInput label="Slow" value={settings.macd.slow} onChange={(v) => onUpdate({ macd: { ...settings.macd, slow: v } })} min={10} max={100} />
          <NumberInput label="Signal" value={settings.macd.signal} onChange={(v) => onUpdate({ macd: { ...settings.macd, signal: v } })} min={2} max={50} />
        </div>
      </SettingGroup>

      {/* Bollinger Bands */}
      <SettingGroup title="Bollinger Bands">
        <div className="grid grid-cols-2 gap-2">
          <NumberInput label="Period" value={settings.bollingerBands.period} onChange={(v) => onUpdate({ bollingerBands: { ...settings.bollingerBands, period: v } })} min={5} max={50} />
          <NumberInput label="Std Dev" value={settings.bollingerBands.stdDev} onChange={(v) => onUpdate({ bollingerBands: { ...settings.bollingerBands, stdDev: v } })} min={1} max={4} step={0.5} />
        </div>
      </SettingGroup>

      {/* Ichimoku */}
      <SettingGroup title="Ichimoku Cloud">
        <div className="grid grid-cols-3 gap-2">
          <NumberInput label="Tenkan" value={settings.ichimoku.tenkan} onChange={(v) => onUpdate({ ichimoku: { ...settings.ichimoku, tenkan: v } })} min={5} max={20} />
          <NumberInput label="Kijun" value={settings.ichimoku.kijun} onChange={(v) => onUpdate({ ichimoku: { ...settings.ichimoku, kijun: v } })} min={10} max={50} />
          <NumberInput label="Senkou" value={settings.ichimoku.senkou} onChange={(v) => onUpdate({ ichimoku: { ...settings.ichimoku, senkou: v } })} min={20} max={100} />
        </div>
      </SettingGroup>

      <SectionTitle title="AI / Custom Indicators" />
      
      {/* AI Pattern Recognition */}
      <SettingGroup title="AI Pattern Recognition">
        <ToggleSwitch 
          label="Enable" 
          checked={settings.aiPatternRecognition.enabled} 
          onChange={(v) => onUpdate({ aiPatternRecognition: { ...settings.aiPatternRecognition, enabled: v } })} 
        />
        <div className="mt-2">
          <SliderInput 
            label="Min Confidence" 
            value={settings.aiPatternRecognition.confidence} 
            onChange={(v) => onUpdate({ aiPatternRecognition: { ...settings.aiPatternRecognition, confidence: v } })} 
            min={0} max={1} step={0.05} 
            format={(v) => `${(v * 100).toFixed(0)}%`}
          />
        </div>
      </SettingGroup>

      {/* Volume Profile */}
      <SettingGroup title="Volume Profile">
        <ToggleSwitch 
          label="Enable" 
          checked={settings.volumeProfile.enabled} 
          onChange={(v) => onUpdate({ volumeProfile: { ...settings.volumeProfile, enabled: v } })} 
        />
        <div className="mt-2">
          <NumberInput label="Lookback" value={settings.volumeProfile.lookback} onChange={(v) => onUpdate({ volumeProfile: { ...settings.volumeProfile, lookback: v } })} min={20} max={500} />
        </div>
      </SettingGroup>

      {/* Order Book Imbalance */}
      <SettingGroup title="Order Book Imbalance">
        <ToggleSwitch 
          label="Enable" 
          checked={settings.orderBookImbalance.enabled} 
          onChange={(v) => onUpdate({ orderBookImbalance: { ...settings.orderBookImbalance, enabled: v } })} 
        />
        <div className="mt-2">
          <SliderInput 
            label="Threshold" 
            value={settings.orderBookImbalance.threshold} 
            onChange={(v) => onUpdate({ orderBookImbalance: { ...settings.orderBookImbalance, threshold: v } })} 
            min={0} max={1} step={0.05} 
            format={(v) => v.toFixed(2)}
          />
        </div>
      </SettingGroup>
    </div>
  );
}

// ============================================================
// TAB B: Risk Management Settings
// ============================================================
function RiskTab({ settings, onUpdate }: { settings: any; onUpdate: (s: any) => void }) {
  return (
    <div className="space-y-3">
      <SectionTitle title="Position Sizing" />
      <SettingGroup title="Method">
        <div className="flex gap-1">
          {(['fixed', 'kelly', 'volatility'] as const).map((method) => (
            <button
              key={method}
              onClick={() => onUpdate({ positionSizing: { ...settings.positionSizing, method } })}
              className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                settings.positionSizing.method === method
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
        <div className="mt-2">
          {settings.positionSizing.method === 'fixed' && (
            <SliderInput label="Fixed %" value={settings.positionSizing.fixedPercent} onChange={(v) => onUpdate({ positionSizing: { ...settings.positionSizing, fixedPercent: v } })} min={0.5} max={10} step={0.5} format={(v) => `${v}%`} />
          )}
          {settings.positionSizing.method === 'kelly' && (
            <SliderInput label="Kelly Fraction" value={settings.positionSizing.kellyFraction} onChange={(v) => onUpdate({ positionSizing: { ...settings.positionSizing, kellyFraction: v } })} min={0.1} max={1} step={0.1} format={(v) => v.toFixed(1)} />
          )}
          {settings.positionSizing.method === 'volatility' && (
            <SliderInput label="Vol Multiplier" value={settings.positionSizing.volatilityMultiplier} onChange={(v) => onUpdate({ positionSizing: { ...settings.positionSizing, volatilityMultiplier: v } })} min={0.5} max={3} step={0.1} format={(v) => `${v}x`} />
          )}
        </div>
      </SettingGroup>

      <SectionTitle title="Stop Loss" />
      <SettingGroup title="SL Method">
        <div className="flex gap-1">
          {(['fixed', 'atr', 'trailing'] as const).map((method) => (
            <button
              key={method}
              onClick={() => onUpdate({ stopLoss: { ...settings.stopLoss, method } })}
              className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                settings.stopLoss.method === method
                  ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
        <div className="mt-2">
          {settings.stopLoss.method === 'fixed' && (
            <SliderInput label="SL %" value={settings.stopLoss.fixedPercent} onChange={(v) => onUpdate({ stopLoss: { ...settings.stopLoss, fixedPercent: v } })} min={0.5} max={10} step={0.5} format={(v) => `${v}%`} />
          )}
          {settings.stopLoss.method === 'atr' && (
            <SliderInput label="ATR Multiplier" value={settings.stopLoss.atrMultiplier} onChange={(v) => onUpdate({ stopLoss: { ...settings.stopLoss, atrMultiplier: v } })} min={0.5} max={5} step={0.1} format={(v) => `${v}x ATR`} />
          )}
          {settings.stopLoss.method === 'trailing' && (
            <SliderInput label="Trail %" value={settings.stopLoss.trailingPercent} onChange={(v) => onUpdate({ stopLoss: { ...settings.stopLoss, trailingPercent: v } })} min={0.5} max={10} step={0.5} format={(v) => `${v}%`} />
          )}
        </div>
      </SettingGroup>

      <SectionTitle title="Take Profit & Limits" />
      <SettingGroup title="Take Profit">
        <SliderInput label="TP %" value={settings.takeProfit.percent} onChange={(v) => onUpdate({ takeProfit: { percent: v } })} min={1} max={50} step={1} format={(v) => `${v}%`} />
      </SettingGroup>
      <SettingGroup title="Max Daily Drawdown">
        <SliderInput label="Max DD %" value={settings.maxDailyDrawdown.percent} onChange={(v) => onUpdate({ maxDailyDrawdown: { percent: v } })} min={1} max={20} step={1} format={(v) => `${v}%`} />
      </SettingGroup>
      <SettingGroup title="Max Open Positions">
        <NumberInput label="Count" value={settings.maxOpenPositions.count} onChange={(v) => onUpdate({ maxOpenPositions: { count: v } })} min={1} max={20} />
      </SettingGroup>
    </div>
  );
}

// ============================================================
// TAB C: AI Strategy & Multi-Routing Settings
// ============================================================
function AITab({ settings, onUpdate }: { settings: any; onUpdate: (s: any) => void }) {
  return (
    <div className="space-y-3">
      <SectionTitle title="AI Model Selection" />
      <SettingGroup title="Primary Model">
        <div className="space-y-1">
          {([
            { id: 'reinforcement_learning', label: 'Reinforcement Learning', desc: 'Deep Q-Network / PPO' },
            { id: 'llm_sentiment', label: 'LLM Sentiment Analysis', desc: 'GPT-4 / Fine-tuned BERT' },
            { id: 'time_series', label: 'Time-Series Forecasting', desc: 'Transformer / LSTM' },
          ] as const).map((model) => (
            <button
              key={model.id}
              onClick={() => onUpdate({ model: model.id })}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                settings.model === model.id
                  ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300'
                  : 'bg-gray-800/30 border border-gray-700/30 text-gray-400 hover:bg-gray-800/50'
              }`}
            >
              <div className="font-medium">{model.label}</div>
              <div className="text-[10px] opacity-60 mt-0.5">{model.desc}</div>
            </button>
          ))}
        </div>
      </SettingGroup>

      <SectionTitle title="Multi-Routing Weights" />
      <SettingGroup title="Signal Source Distribution">
        <div className="space-y-3">
          <SliderInput 
            label="📊 Technical Analysis" 
            value={settings.routingWeights.technical} 
            onChange={(v) => onUpdate({ routingWeights: { ...settings.routingWeights, technical: v } })} 
            min={0} max={100} step={5} 
            format={(v) => `${v}%`}
            color="purple"
          />
          <SliderInput 
            label="🐦 Sentiment Analysis" 
            value={settings.routingWeights.sentiment} 
            onChange={(v) => onUpdate({ routingWeights: { ...settings.routingWeights, sentiment: v } })} 
            min={0} max={100} step={5} 
            format={(v) => `${v}%`}
            color="blue"
          />
          <SliderInput 
            label="⛓️ On-Chain Data" 
            value={settings.routingWeights.onchain} 
            onChange={(v) => onUpdate({ routingWeights: { ...settings.routingWeights, onchain: v } })} 
            min={0} max={100} step={5} 
            format={(v) => `${v}%`}
            color="cyan"
          />
          <div className="text-[10px] text-gray-500 text-center">
            Total: {settings.routingWeights.technical + settings.routingWeights.sentiment + settings.routingWeights.onchain}%
            {(settings.routingWeights.technical + settings.routingWeights.sentiment + settings.routingWeights.onchain) !== 100 && (
              <span className="text-yellow-500 ml-2">⚠ Should equal 100%</span>
            )}
          </div>
        </div>
      </SettingGroup>

      <SectionTitle title="Confidence & Training" />
      <SettingGroup title="Min Confidence Threshold">
        <SliderInput 
          label="Threshold" 
          value={settings.confidenceThreshold} 
          onChange={(v) => onUpdate({ confidenceThreshold: v })} 
          min={50} max={99} step={1} 
          format={(v) => `${v}%`}
          color="green"
        />
        <p className="text-[10px] text-gray-500 mt-1">Only execute trades when AI confidence exceeds this threshold</p>
      </SettingGroup>
      <SettingGroup title="Training Parameters">
        <div className="grid grid-cols-3 gap-2">
          <NumberInput label="LR" value={settings.learningRate} onChange={(v) => onUpdate({ learningRate: v })} min={0.0001} max={0.1} step={0.0001} />
          <NumberInput label="Batch" value={settings.batchSize} onChange={(v) => onUpdate({ batchSize: v })} min={16} max={512} />
          <NumberInput label="Epochs" value={settings.epochs} onChange={(v) => onUpdate({ epochs: v })} min={10} max={1000} />
        </div>
      </SettingGroup>
    </div>
  );
}

// ============================================================
// REUSABLE UI COMPONENTS
// ============================================================

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <div className="h-px flex-1 bg-gradient-to-r from-purple-500/30 to-transparent" />
      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400/70">{title}</span>
      <div className="h-px flex-1 bg-gradient-to-l from-purple-500/30 to-transparent" />
    </div>
  );
}

function SettingGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-2.5 rounded-lg bg-gray-900/30 border border-gray-800/50 space-y-2">
      <div className="text-xs font-medium text-gray-300">{title}</div>
      {children}
    </div>
  );
}

function NumberInput({ label, value, onChange, min, max, step = 1 }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] text-gray-500">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full px-2 py-1 rounded bg-gray-800/80 border border-gray-700/50 text-xs text-gray-200 focus:outline-none focus:border-purple-500/50"
      />
    </div>
  );
}

function SliderInput({ label, value, onChange, min, max, step, format, color = 'purple' }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; format?: (v: number) => string; color?: string }) {
  const colorMap: Record<string, string> = {
    purple: 'accent-purple-500',
    blue: 'accent-blue-500',
    cyan: 'accent-cyan-500',
    green: 'accent-green-500',
    red: 'accent-red-500',
  };
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <label className="text-[10px] text-gray-400">{label}</label>
        <span className="text-[10px] text-gray-300 font-mono">{format ? format(value) : value}</span>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className={`w-full h-1.5 rounded-full bg-gray-700 ${colorMap[color]} cursor-pointer`}
      />
    </div>
  );
}

function ToggleSwitch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-gray-400">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-8 h-4 rounded-full transition-all ${
          checked ? 'bg-purple-500' : 'bg-gray-700'
        }`}
      >
        <motion.div
          className="absolute top-0.5 w-3 h-3 rounded-full bg-white"
          animate={{ left: checked ? '18px' : '2px' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}
