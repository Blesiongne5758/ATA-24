import { motion, AnimatePresence } from 'framer-motion';
import { useTradingStore } from '../store/tradingStore';
import MarketSelector from './MarketSelector';
import ConnectionPanel from './ConnectionPanel';
import AutoTradingSystem from './AutoTradingSystem';

// ============================================================
// SETTINGS PANEL COMPONENT - v2.0
// Features: 8 tabs - Market, Technical, Risk, AI, MT5, API, Gateway, Auto, Other
// ============================================================

export default function SettingsPanel() {
  const { settingsTab, setSettingsTab, technicalSettings, riskSettings, aiSettings, updateTechnicalSettings, updateRiskSettings, updateAISettings } = useTradingStore();

  const tabs = [
    { id: 'market' as const, label: 'Market', icon: '📊' },
    { id: 'technical' as const, label: 'Tech', icon: '📈' },
    { id: 'risk' as const, label: 'Risk', icon: '🛡️' },
    { id: 'ai' as const, label: 'AI', icon: '🧠' },
    { id: 'mt5' as const, label: 'MT5', icon: '⚡' },
    { id: 'api' as const, label: 'API', icon: '🔑' },
    { id: 'gateway' as const, label: 'GW', icon: '🌐' },
    { id: 'auto' as const, label: 'Auto', icon: '🤖' },
    { id: 'other' as const, label: 'Other', icon: '⚙️' },
  ];

  return (
    <div className="space-y-2">
      {/* Tab Navigation - Scrollable */}
      <div className="flex gap-0.5 overflow-x-auto pb-1 custom-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSettingsTab(tab.id)}
            className={`flex-shrink-0 px-2 py-1 rounded-md text-[9px] font-medium transition-all ${
              settingsTab === tab.id
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'
            }`}
          >
            <span className="mr-0.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={settingsTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.15 }}
          className="max-h-[350px] overflow-y-auto pr-1 custom-scrollbar"
        >
          {settingsTab === 'market' && <MarketSelector />}
          {settingsTab === 'technical' && <TechnicalTab />}
          {settingsTab === 'risk' && <RiskTab />}
          {settingsTab === 'ai' && <AITab />}
          {settingsTab === 'mt5' && <ConnectionPanel initialTab="mt5" />}
          {settingsTab === 'api' && <ConnectionPanel initialTab="api" />}
          {settingsTab === 'gateway' && <ConnectionPanel initialTab="gateway" />}
          {settingsTab === 'auto' && <AutoTradingSystem />}
          {settingsTab === 'other' && <OtherSettings />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// TAB: Technical Analysis
// ============================================================
function TechnicalTab() {
  const { technicalSettings: s, updateTechnicalSettings: u } = useTradingStore();

  return (
    <div className="space-y-2">
      <SectionTitle title="Standard Indicators" />
      <SettingGroup title="RSI">
        <div className="grid grid-cols-3 gap-1.5">
          <NumberInput label="Period" value={s.rsi.period} onChange={(v) => u({ rsi: { ...s.rsi, period: v } })} min={2} max={50} />
          <NumberInput label="Overbought" value={s.rsi.overbought} onChange={(v) => u({ rsi: { ...s.rsi, overbought: v } })} min={50} max={95} />
          <NumberInput label="Oversold" value={s.rsi.oversold} onChange={(v) => u({ rsi: { ...s.rsi, oversold: v } })} min={5} max={50} />
        </div>
      </SettingGroup>
      <SettingGroup title="MACD">
        <div className="grid grid-cols-3 gap-1.5">
          <NumberInput label="Fast" value={s.macd.fast} onChange={(v) => u({ macd: { ...s.macd, fast: v } })} min={2} max={50} />
          <NumberInput label="Slow" value={s.macd.slow} onChange={(v) => u({ macd: { ...s.macd, slow: v } })} min={10} max={100} />
          <NumberInput label="Signal" value={s.macd.signal} onChange={(v) => u({ macd: { ...s.macd, signal: v } })} min={2} max={50} />
        </div>
      </SettingGroup>
      <SettingGroup title="Bollinger Bands">
        <div className="grid grid-cols-2 gap-1.5">
          <NumberInput label="Period" value={s.bollingerBands.period} onChange={(v) => u({ bollingerBands: { ...s.bollingerBands, period: v } })} min={5} max={50} />
          <NumberInput label="Std Dev" value={s.bollingerBands.stdDev} onChange={(v) => u({ bollingerBands: { ...s.bollingerBands, stdDev: v } })} min={1} max={4} step={0.5} />
        </div>
      </SettingGroup>
      <SettingGroup title="Ichimoku Cloud">
        <div className="grid grid-cols-3 gap-1.5">
          <NumberInput label="Tenkan" value={s.ichimoku.tenkan} onChange={(v) => u({ ichimoku: { ...s.ichimoku, tenkan: v } })} min={5} max={20} />
          <NumberInput label="Kijun" value={s.ichimoku.kijun} onChange={(v) => u({ ichimoku: { ...s.ichimoku, kijun: v } })} min={10} max={50} />
          <NumberInput label="Senkou" value={s.ichimoku.senkou} onChange={(v) => u({ ichimoku: { ...s.ichimoku, senkou: v } })} min={20} max={100} />
        </div>
      </SettingGroup>
      <SettingGroup title="Stochastic">
        <div className="grid grid-cols-2 gap-1.5">
          <NumberInput label="%K" value={s.stochastic.k} onChange={(v) => u({ stochastic: { ...s.stochastic, k: v } })} min={5} max={50} />
          <NumberInput label="%D" value={s.stochastic.d} onChange={(v) => u({ stochastic: { ...s.stochastic, d: v } })} min={1} max={20} />
        </div>
      </SettingGroup>
      <SettingGroup title="ADX">
        <div className="grid grid-cols-2 gap-1.5">
          <NumberInput label="Period" value={s.adx.period} onChange={(v) => u({ adx: { ...s.adx, period: v } })} min={5} max={50} />
          <NumberInput label="Threshold" value={s.adx.threshold} onChange={(v) => u({ adx: { ...s.adx, threshold: v } })} min={10} max={50} />
        </div>
      </SettingGroup>

      <SectionTitle title="AI / Custom Indicators" />
      <SettingGroup title="AI Pattern Recognition">
        <ToggleSwitch label="Enable" checked={s.aiPatternRecognition.enabled} onChange={(v) => u({ aiPatternRecognition: { ...s.aiPatternRecognition, enabled: v } })} />
        <div className="mt-1.5">
          <SliderInput label="Min Confidence" value={s.aiPatternRecognition.confidence} onChange={(v) => u({ aiPatternRecognition: { ...s.aiPatternRecognition, confidence: v } })} min={0} max={1} step={0.05} format={(v) => `${(v * 100).toFixed(0)}%`} />
        </div>
      </SettingGroup>
      <SettingGroup title="Volume Profile">
        <ToggleSwitch label="Enable" checked={s.volumeProfile.enabled} onChange={(v) => u({ volumeProfile: { ...s.volumeProfile, enabled: v } })} />
        <div className="mt-1.5">
          <NumberInput label="Lookback" value={s.volumeProfile.lookback} onChange={(v) => u({ volumeProfile: { ...s.volumeProfile, lookback: v } })} min={20} max={500} />
        </div>
      </SettingGroup>
      <SettingGroup title="Order Book Imbalance">
        <ToggleSwitch label="Enable" checked={s.orderBookImbalance.enabled} onChange={(v) => u({ orderBookImbalance: { ...s.orderBookImbalance, enabled: v } })} />
        <div className="mt-1.5">
          <SliderInput label="Threshold" value={s.orderBookImbalance.threshold} onChange={(v) => u({ orderBookImbalance: { ...s.orderBookImbalance, threshold: v } })} min={0} max={1} step={0.05} format={(v) => v.toFixed(2)} />
        </div>
      </SettingGroup>
    </div>
  );
}

// ============================================================
// TAB: Risk Management
// ============================================================
function RiskTab() {
  const { riskSettings: s, updateRiskSettings: u } = useTradingStore();

  return (
    <div className="space-y-2">
      <SectionTitle title="Position Sizing" />
      <SettingGroup title="Method">
        <div className="flex gap-1">
          {(['fixed', 'kelly', 'volatility'] as const).map((method) => (
            <button key={method} onClick={() => u({ positionSizing: { ...s.positionSizing, method } })}
              className={`flex-1 px-2 py-1.5 rounded text-[9px] font-medium capitalize transition-all ${
                s.positionSizing.method === method ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' : 'bg-gray-800/50 text-gray-400 border border-gray-700/50'
              }`}>{method}</button>
          ))}
        </div>
        <div className="mt-1.5">
          {s.positionSizing.method === 'fixed' && <SliderInput label="Fixed %" value={s.positionSizing.fixedPercent} onChange={(v) => u({ positionSizing: { ...s.positionSizing, fixedPercent: v } })} min={0.5} max={10} step={0.5} format={(v) => `${v}%`} />}
          {s.positionSizing.method === 'kelly' && <SliderInput label="Kelly Fraction" value={s.positionSizing.kellyFraction} onChange={(v) => u({ positionSizing: { ...s.positionSizing, kellyFraction: v } })} min={0.1} max={1} step={0.1} format={(v) => v.toFixed(1)} />}
          {s.positionSizing.method === 'volatility' && <SliderInput label="Vol Multiplier" value={s.positionSizing.volatilityMultiplier} onChange={(v) => u({ positionSizing: { ...s.positionSizing, volatilityMultiplier: v } })} min={0.5} max={3} step={0.1} format={(v) => `${v}x`} />}
        </div>
      </SettingGroup>

      <SectionTitle title="Stop Loss" />
      <SettingGroup title="SL Method">
        <div className="flex gap-1">
          {(['fixed', 'atr', 'trailing'] as const).map((method) => (
            <button key={method} onClick={() => u({ stopLoss: { ...s.stopLoss, method } })}
              className={`flex-1 px-2 py-1.5 rounded text-[9px] font-medium capitalize transition-all ${
                s.stopLoss.method === method ? 'bg-red-500/30 text-red-300 border border-red-500/50' : 'bg-gray-800/50 text-gray-400 border border-gray-700/50'
              }`}>{method}</button>
          ))}
        </div>
        <div className="mt-1.5">
          {s.stopLoss.method === 'fixed' && <SliderInput label="SL %" value={s.stopLoss.fixedPercent} onChange={(v) => u({ stopLoss: { ...s.stopLoss, fixedPercent: v } })} min={0.5} max={10} step={0.5} format={(v) => `${v}%`} />}
          {s.stopLoss.method === 'atr' && <SliderInput label="ATR Multiplier" value={s.stopLoss.atrMultiplier} onChange={(v) => u({ stopLoss: { ...s.stopLoss, atrMultiplier: v } })} min={0.5} max={5} step={0.1} format={(v) => `${v}x ATR`} />}
          {s.stopLoss.method === 'trailing' && <SliderInput label="Trail %" value={s.stopLoss.trailingPercent} onChange={(v) => u({ stopLoss: { ...s.stopLoss, trailingPercent: v } })} min={0.5} max={10} step={0.5} format={(v) => `${v}%`} />}
        </div>
      </SettingGroup>

      <SectionTitle title="Take Profit & Limits" />
      <SettingGroup title="Take Profit">
        <SliderInput label="TP %" value={s.takeProfit.percent} onChange={(v) => u({ takeProfit: { percent: v } })} min={1} max={50} step={1} format={(v) => `${v}%`} />
      </SettingGroup>
      <SettingGroup title="Max Daily Drawdown">
        <SliderInput label="Max DD %" value={s.maxDailyDrawdown.percent} onChange={(v) => u({ maxDailyDrawdown: { percent: v } })} min={1} max={20} step={1} format={(v) => `${v}%`} />
      </SettingGroup>
      <SettingGroup title="Max Open Positions">
        <NumberInput label="Count" value={s.maxOpenPositions.count} onChange={(v) => u({ maxOpenPositions: { count: v } })} min={1} max={20} />
      </SettingGroup>
      <SettingGroup title="Risk/Reward Ratio">
        <SliderInput label="Min R:R" value={s.riskRewardRatio.min} onChange={(v) => u({ riskRewardRatio: { min: v } })} min={1} max={5} step={0.5} format={(v) => `1:${v}`} />
      </SettingGroup>
      <SettingGroup title="Correlation Limit">
        <SliderInput label="Max Correlation" value={s.correlationLimit.max} onChange={(v) => u({ correlationLimit: { max: v } })} min={0.1} max={1} step={0.1} format={(v) => v.toFixed(1)} />
      </SettingGroup>
    </div>
  );
}

// ============================================================
// TAB: AI Strategy
// ============================================================
function AITab() {
  const { aiSettings: s, updateAISettings: u } = useTradingStore();

  return (
    <div className="space-y-2">
      <SectionTitle title="AI Model Selection" />
      <SettingGroup title="Primary Model">
        <div className="space-y-1">
          {([
            { id: 'reinforcement_learning', label: 'Reinforcement Learning', desc: 'DQN / PPO / A3C' },
            { id: 'llm_sentiment', label: 'LLM Sentiment', desc: 'GPT-4 / Fine-tuned BERT' },
            { id: 'time_series', label: 'Time-Series', desc: 'Transformer / LSTM' },
            { id: 'ensemble', label: 'Ensemble', desc: 'Multi-model fusion' },
            { id: 'transformer', label: 'Transformer', desc: 'Attention-based prediction' },
          ] as const).map((model) => (
            <button key={model.id} onClick={() => u({ model: model.id })}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[10px] transition-all ${
                s.model === model.id ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300' : 'bg-gray-800/30 border border-gray-700/30 text-gray-400 hover:bg-gray-800/50'
              }`}>
              <div className="font-medium">{model.label}</div>
              <div className="text-[8px] opacity-60">{model.desc}</div>
            </button>
          ))}
        </div>
      </SettingGroup>

      <SectionTitle title="Multi-Routing Weights" />
      <SettingGroup title="Signal Source Distribution">
        <div className="space-y-2">
          <SliderInput label="📊 Technical" value={s.routingWeights.technical} onChange={(v) => u({ routingWeights: { ...s.routingWeights, technical: v } })} min={0} max={100} step={5} format={(v) => `${v}%`} color="purple" />
          <SliderInput label="🐦 Sentiment" value={s.routingWeights.sentiment} onChange={(v) => u({ routingWeights: { ...s.routingWeights, sentiment: v } })} min={0} max={100} step={5} format={(v) => `${v}%`} color="blue" />
          <SliderInput label="⛓️ On-Chain" value={s.routingWeights.onchain} onChange={(v) => u({ routingWeights: { ...s.routingWeights, onchain: v } })} min={0} max={100} step={5} format={(v) => `${v}%`} color="cyan" />
          <div className="text-[9px] text-gray-500 text-center">
            Total: {s.routingWeights.technical + s.routingWeights.sentiment + s.routingWeights.onchain}%
            {(s.routingWeights.technical + s.routingWeights.sentiment + s.routingWeights.onchain) !== 100 && <span className="text-yellow-500 ml-1">⚠ Should = 100%</span>}
          </div>
        </div>
      </SettingGroup>

      <SectionTitle title="Confidence & Training" />
      <SettingGroup title="Min Confidence Threshold">
        <SliderInput label="Threshold" value={s.confidenceThreshold} onChange={(v) => u({ confidenceThreshold: v })} min={50} max={99} step={1} format={(v) => `${v}%`} color="green" />
      </SettingGroup>
      <SettingGroup title="Training Parameters">
        <div className="grid grid-cols-3 gap-1.5">
          <NumberInput label="LR" value={s.learningRate} onChange={(v) => u({ learningRate: v })} min={0.0001} max={0.1} step={0.0001} />
          <NumberInput label="Batch" value={s.batchSize} onChange={(v) => u({ batchSize: v })} min={16} max={512} />
          <NumberInput label="Epochs" value={s.epochs} onChange={(v) => u({ epochs: v })} min={10} max={1000} />
        </div>
      </SettingGroup>
    </div>
  );
}

// ============================================================
// TAB: Other Settings
// ============================================================
function OtherSettings() {
  return (
    <div className="space-y-2">
      <SectionTitle title="Display Settings" />
      <SettingGroup title="Theme">
        <div className="flex gap-1">
          {['Dark', 'OLED Black', 'Midnight'].map((theme) => (
            <button key={theme} className="flex-1 px-2 py-1.5 rounded text-[9px] bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50">
              {theme}
            </button>
          ))}
        </div>
      </SettingGroup>
      <SettingGroup title="Notifications">
        <div className="space-y-1.5">
          {['Trade Executed', 'Stop Loss Hit', 'Take Profit Hit', 'AI Signal Alert', 'System Error', 'Daily Report'].map((notif) => (
            <label key={notif} className="flex items-center justify-between text-[10px] text-gray-400">
              <span>{notif}</span>
              <input type="checkbox" defaultChecked className="w-3 h-3 rounded accent-purple-500" />
            </label>
          ))}
        </div>
      </SettingGroup>

      <SectionTitle title="Data & Backup" />
      <SettingGroup title="Data Export">
        <div className="grid grid-cols-2 gap-1.5">
          <button className="px-2 py-1.5 rounded text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20">
            📥 Export Trades
          </button>
          <button className="px-2 py-1.5 rounded text-[9px] bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20">
            📥 Export Settings
          </button>
          <button className="px-2 py-1.5 rounded text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20">
            📤 Import Settings
          </button>
          <button className="px-2 py-1.5 rounded text-[9px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/20">
            📊 Full Report
          </button>
        </div>
      </SettingGroup>

      <SectionTitle title="System" />
      <SettingGroup title="Performance">
        <div className="space-y-1.5 text-[9px]">
          <div className="flex justify-between"><span className="text-gray-500">CPU Usage</span><span className="text-gray-300">12%</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Memory</span><span className="text-gray-300">256 MB</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Network Latency</span><span className="text-gray-300">45ms</span></div>
          <div className="flex justify-between"><span className="text-gray-500">WebSocket Status</span><span className="text-green-400">Connected</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Uptime</span><span className="text-gray-300">2h 34m</span></div>
        </div>
      </SettingGroup>
      <SettingGroup title="Version">
        <div className="text-[9px] text-gray-500 text-center">
          PJ.BOT AI Trading Agent v2.0.0<br/>
          Multi-Routing Neural Engine<br/>
          Build: 2026.01.15
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
      <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400/70">{title}</span>
      <div className="h-px flex-1 bg-gradient-to-l from-purple-500/30 to-transparent" />
    </div>
  );
}

function SettingGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-2 rounded-lg bg-gray-900/30 border border-gray-800/50 space-y-1.5">
      <div className="text-[10px] font-medium text-gray-300">{title}</div>
      {children}
    </div>
  );
}

function NumberInput({ label, value, onChange, min, max, step = 1 }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number }) {
  return (
    <div className="space-y-0.5">
      <label className="text-[8px] text-gray-500">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} min={min} max={max} step={step}
        className="w-full px-1.5 py-1 rounded bg-gray-800/80 border border-gray-700/50 text-[10px] text-gray-200 focus:outline-none focus:border-purple-500/50" />
    </div>
  );
}

function SliderInput({ label, value, onChange, min, max, step, format, color = 'purple' }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; format?: (v: number) => string; color?: string }) {
  const colorMap: Record<string, string> = { purple: 'accent-purple-500', blue: 'accent-blue-500', cyan: 'accent-cyan-500', green: 'accent-green-500', red: 'accent-red-500' };
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between">
        <label className="text-[9px] text-gray-400">{label}</label>
        <span className="text-[9px] text-gray-300 font-mono">{format ? format(value) : value}</span>
      </div>
      <input type="range" value={value} onChange={(e) => onChange(Number(e.target.value))} min={min} max={max} step={step}
        className={`w-full h-1.5 rounded-full bg-gray-700 ${colorMap[color]} cursor-pointer`} />
    </div>
  );
}

function ToggleSwitch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[9px] text-gray-400">{label}</span>
      <button onClick={() => onChange(!checked)} className={`relative w-7 h-3.5 rounded-full transition-all ${checked ? 'bg-purple-500' : 'bg-gray-700'}`}>
        <motion.div className="absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white"
          animate={{ left: checked ? '16px' : '2px' }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
      </button>
    </div>
  );
}
