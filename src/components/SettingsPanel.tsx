import { motion, AnimatePresence } from 'framer-motion';
import { useTradingStore } from '../store/tradingStore';
import { useState } from 'react';

export default function SettingsPanel() {
  const { settingsTab, setSettingsTab } = useTradingStore();
  const tabs = [
    { id: 'market', label: 'Market', icon: '📊' },
    { id: 'technical', label: 'Tech', icon: '📈' },
    { id: 'risk', label: 'Risk', icon: '🛡️' },
    { id: 'ai', label: 'AI', icon: '🧠' },
    { id: 'mt5', label: 'MT5', icon: '⚡' },
    { id: 'api', label: 'API', icon: '🔑' },
    { id: 'gateway', label: 'GW', icon: '🌐' },
    { id: 'auto', label: 'Auto', icon: '🤖' },
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'websocket', label: 'WebSocket', icon: '🔌' },
    { id: 'download', label: 'Download', icon: '📥' },
    { id: 'other', label: 'Other', icon: '⚙️' },
  ];

  return (
    <div className="space-y-2">
      <div className="flex gap-0.5 overflow-x-auto pb-1 custom-scrollbar">
        {tabs.map((tab) => (<button key={tab.id} onClick={() => setSettingsTab(tab.id as any)} className={`flex-shrink-0 px-2 py-1 rounded-md text-[9px] font-medium ${settingsTab === tab.id ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'}`}><span className="mr-0.5">{tab.icon}</span>{tab.label}</button>))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={settingsTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
          {settingsTab === 'market' && <MarketTab />}
          {settingsTab === 'technical' && <TechnicalTab />}
          {settingsTab === 'risk' && <RiskTab />}
          {settingsTab === 'ai' && <AITab />}
          {settingsTab === 'mt5' && <MT5Tab />}
          {settingsTab === 'api' && <APITab />}
          {settingsTab === 'gateway' && <GatewayTab />}
          {settingsTab === 'auto' && <AutoTab />}
          {settingsTab === 'chat' && <ChatSettingsTab />}
          {settingsTab === 'websocket' && <WebSocketTab />}
          {settingsTab === 'download' && <DownloadTab />}
          {settingsTab === 'other' && <OtherTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) { return <div className="flex items-center gap-2 pt-1"><div className="h-px flex-1 bg-gradient-to-r from-purple-500/30 to-transparent" /><span className="text-[9px] font-bold uppercase tracking-wider text-purple-400/70">{title}</span><div className="h-px flex-1 bg-gradient-to-l from-purple-500/30 to-transparent" /></div>; }
function SettingGroup({ title, children }: { title: string; children: React.ReactNode }) { return <div className="p-2 rounded-lg bg-gray-900/30 border border-gray-800/50 space-y-1.5"><div className="text-[10px] font-medium text-gray-300">{title}</div>{children}</div>; }
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) { return <div className="flex items-center justify-between"><span className="text-[9px] text-gray-400">{label}</span><button onClick={() => onChange(!checked)} className={`relative w-7 h-3.5 rounded-full ${checked ? 'bg-purple-500' : 'bg-gray-700'}`}><motion.div className="absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white" animate={{ left: checked ? '16px' : '2px' }} /></button></div>; }

function MarketTab() {
  const { marketConfig, updateMarketConfig, generateChartData } = useTradingStore();
  const markets = [
    { type: 'crypto', label: 'Crypto', icon: '₿', symbols: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'], leverage: [1, 5, 10, 50, 100] },
    { type: 'forex', label: 'Forex', icon: '💱', symbols: ['EUR/USD', 'GBP/USD', 'USD/JPY'], leverage: [1, 50, 100, 500] },
    { type: 'stocks', label: 'Stocks', icon: '📊', symbols: ['AAPL', 'TSLA', 'NVDA'], leverage: [1, 2, 4] },
    { type: 'commodities', label: 'Commodity', icon: '🛢️', symbols: ['Gold', 'Silver', 'Oil'], leverage: [1, 10, 50] },
    { type: 'indices', label: 'Indices', icon: '📈', symbols: ['S&P 500', 'NASDAQ', 'DAX'], leverage: [1, 50, 100] },
    { type: 'options', label: 'Options', icon: '🎯', symbols: ['SPY Call', 'SPY Put'], leverage: [1, 2, 5] },
  ];
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-1.5">{markets.map((m) => <button key={m.type} onClick={() => { updateMarketConfig({ type: m.type as any, symbol: m.symbols[0], pair: m.symbols[0], leverage: m.leverage[0] }); generateChartData(80, 67000); }} className={`p-2 rounded-lg text-center ${marketConfig.type === m.type ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300' : 'bg-gray-900/30 border border-gray-800/50 text-gray-400'}`}><div className="text-lg">{m.icon}</div><div className="text-[9px]">{m.label}</div></button>)}</div>
      <SettingGroup title="Symbol"><div className="grid grid-cols-3 gap-1">{markets.find(m => m.type === marketConfig.type)?.symbols.map(s => <button key={s} onClick={() => updateMarketConfig({ symbol: s, pair: s })} className={`px-2 py-1 rounded text-[10px] font-mono ${marketConfig.symbol === s ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-gray-900/30 text-gray-500 border border-gray-800/30'}`}>{s}</button>)}</div></SettingGroup>
      <SettingGroup title="Leverage"><div className="flex flex-wrap gap-1">{markets.find(m => m.type === marketConfig.type)?.leverage.map(lev => <button key={lev} onClick={() => updateMarketConfig({ leverage: lev })} className={`px-2 py-1 rounded text-[10px] font-mono ${marketConfig.leverage === lev ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' : 'bg-gray-900/30 text-gray-500 border border-gray-800/30'}`}>{lev}x</button>)}</div></SettingGroup>
    </div>
  );
}

function TechnicalTab() {
  const { technicalSettings: s, updateTechnicalSettings: u } = useTradingStore();
  return (
    <div className="space-y-2">
      <SectionTitle title="Indicators" />
      <SettingGroup title="RSI"><div className="grid grid-cols-3 gap-1.5"><NumInput label="Period" value={s.rsi.period} onChange={(v) => u({ rsi: { ...s.rsi, period: v } })} /><NumInput label="Overbought" value={s.rsi.overbought} onChange={(v) => u({ rsi: { ...s.rsi, overbought: v } })} /><NumInput label="Oversold" value={s.rsi.oversold} onChange={(v) => u({ rsi: { ...s.rsi, oversold: v } })} /></div></SettingGroup>
      <SettingGroup title="MACD"><div className="grid grid-cols-3 gap-1.5"><NumInput label="Fast" value={s.macd.fast} onChange={(v) => u({ macd: { ...s.macd, fast: v } })} /><NumInput label="Slow" value={s.macd.slow} onChange={(v) => u({ macd: { ...s.macd, slow: v } })} /><NumInput label="Signal" value={s.macd.signal} onChange={(v) => u({ macd: { ...s.macd, signal: v } })} /></div></SettingGroup>
      <SettingGroup title="Bollinger Bands"><div className="grid grid-cols-2 gap-1.5"><NumInput label="Period" value={s.bollingerBands.period} onChange={(v) => u({ bollingerBands: { ...s.bollingerBands, period: v } })} /><NumInput label="Std Dev" value={s.bollingerBands.stdDev} onChange={(v) => u({ bollingerBands: { ...s.bollingerBands, stdDev: v } })} step={0.5} /></div></SettingGroup>
      <SettingGroup title="AI Features"><Toggle label="Pattern Recognition" checked={s.aiPatternRecognition.enabled} onChange={(v) => u({ aiPatternRecognition: { ...s.aiPatternRecognition, enabled: v } })} /><Toggle label="Volume Profile" checked={s.volumeProfile.enabled} onChange={(v) => u({ volumeProfile: { ...s.volumeProfile, enabled: v } })} /><Toggle label="Order Book Imbalance" checked={s.orderBookImbalance.enabled} onChange={(v) => u({ orderBookImbalance: { ...s.orderBookImbalance, enabled: v } })} /></SettingGroup>
    </div>
  );
}

function RiskTab() {
  const { riskSettings: s, updateRiskSettings: u } = useTradingStore();
  return (
    <div className="space-y-2">
      <SettingGroup title="Position Sizing"><div className="flex gap-1">{(['fixed', 'kelly', 'volatility'] as const).map(m => <button key={m} onClick={() => u({ positionSizing: { ...s.positionSizing, method: m } })} className={`flex-1 px-2 py-1.5 rounded text-[9px] capitalize ${s.positionSizing.method === m ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' : 'bg-gray-800/50 text-gray-400 border border-gray-700/50'}`}>{m}</button>)}</div></SettingGroup>
      <SettingGroup title="Stop Loss"><div className="flex gap-1">{(['fixed', 'atr', 'trailing'] as const).map(m => <button key={m} onClick={() => u({ stopLoss: { ...s.stopLoss, method: m } })} className={`flex-1 px-2 py-1.5 rounded text-[9px] capitalize ${s.stopLoss.method === m ? 'bg-red-500/30 text-red-300 border border-red-500/50' : 'bg-gray-800/50 text-gray-400 border border-gray-700/50'}`}>{m}</button>)}</div></SettingGroup>
      <SettingGroup title="Take Profit %"><SliderInput label="TP" value={s.takeProfit.percent} onChange={(v) => u({ takeProfit: { percent: v } })} min={1} max={50} format={(v) => `${v}%`} /></SettingGroup>
      <SettingGroup title="Max Daily Drawdown %"><SliderInput label="DD" value={s.maxDailyDrawdown.percent} onChange={(v) => u({ maxDailyDrawdown: { percent: v } })} min={1} max={20} format={(v) => `${v}%`} /></SettingGroup>
      <SettingGroup title="Max Positions"><NumInput label="Count" value={s.maxOpenPositions.count} onChange={(v) => u({ maxOpenPositions: { count: v } })} min={1} max={20} /></SettingGroup>
    </div>
  );
}

function AITab() {
  const { aiSettings: s, updateAISettings: u } = useTradingStore();
  return (
    <div className="space-y-2">
      <SettingGroup title="AI Model">{(['ensemble', 'reinforcement_learning', 'llm_sentiment', 'time_series', 'transformer'] as const).map(m => <button key={m} onClick={() => u({ model: m })} className={`w-full text-left px-2.5 py-1.5 rounded text-[10px] mb-1 ${s.model === m ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300' : 'bg-gray-800/30 border border-gray-700/30 text-gray-400'}`}>{m.replace(/_/g, ' ')}</button>)}</SettingGroup>
      <SettingGroup title="Routing Weights"><SliderInput label="📊 Technical" value={s.routingWeights.technical} onChange={(v) => u({ routingWeights: { ...s.routingWeights, technical: v } })} min={0} max={100} step={5} format={(v) => `${v}%`} /><SliderInput label="🐦 Sentiment" value={s.routingWeights.sentiment} onChange={(v) => u({ routingWeights: { ...s.routingWeights, sentiment: v } })} min={0} max={100} step={5} format={(v) => `${v}%`} /><SliderInput label="⛓️ On-Chain" value={s.routingWeights.onchain} onChange={(v) => u({ routingWeights: { ...s.routingWeights, onchain: v } })} min={0} max={100} step={5} format={(v) => `${v}%`} /></SettingGroup>
      <SettingGroup title="Confidence Threshold"><SliderInput label="Min" value={s.confidenceThreshold} onChange={(v) => u({ confidenceThreshold: v })} min={50} max={99} format={(v) => `${v}%`} /></SettingGroup>
    </div>
  );
}

function MT5Tab() {
  const { mt5Settings, updateMT5Settings, connectMT5, disconnectMT5 } = useTradingStore();
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between p-2 rounded-lg bg-gray-900/30 border border-gray-800/30"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${mt5Settings.connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} /><span className="text-[10px]">{mt5Settings.connectionStatus.toUpperCase()}</span></div>{mt5Settings.connectionStatus === 'connected' ? <button onClick={disconnectMT5} className="px-2 py-0.5 rounded text-[9px] bg-red-500/20 text-red-400">Disconnect</button> : <button onClick={connectMT5} className="px-2 py-0.5 rounded text-[9px] bg-green-500/20 text-green-400">Connect</button>}</div>
      <SettingGroup title="Server"><select value={mt5Settings.server} onChange={(e) => updateMT5Settings({ server: e.target.value })} className="w-full px-2 py-1.5 rounded bg-gray-900/50 border border-gray-700/50 text-[10px] text-gray-200"><option>MetaQuotes-Demo</option><option>ICMarkets-Demo</option><option>Exness-Demo</option></select></SettingGroup>
      <SettingGroup title="Account Type"><div className="flex gap-1">{(['demo', 'live'] as const).map(t => <button key={t} onClick={() => updateMT5Settings({ accountType: t })} className={`flex-1 px-2 py-1.5 rounded text-[10px] uppercase ${mt5Settings.accountType === t ? t === 'demo' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-gray-900/30 text-gray-500 border border-gray-800/30'}`}>{t}</button>)}</div></SettingGroup>
      <SettingGroup title="Login"><input type="text" value={mt5Settings.login} onChange={(e) => updateMT5Settings({ login: e.target.value })} placeholder="Account number" className="w-full px-2 py-1.5 rounded bg-gray-900/50 border border-gray-700/50 text-[10px] text-gray-200 font-mono placeholder:text-gray-700" /></SettingGroup>
      <SettingGroup title="Password"><input type="password" value={mt5Settings.password} onChange={(e) => updateMT5Settings({ password: e.target.value })} placeholder="••••••••" className="w-full px-2 py-1.5 rounded bg-gray-900/50 border border-gray-700/50 text-[10px] text-gray-200 font-mono placeholder:text-gray-700" /></SettingGroup>
    </div>
  );
}

function APITab() {
  const { apiConfigs, updateAPIConfig, addAPIConfig, removeAPIConfig } = useTradingStore();
  return (
    <div className="space-y-2">
      {apiConfigs.map(api => <div key={api.id} className="p-2 rounded-lg bg-gray-900/30 border border-gray-800/30 space-y-1.5"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${api.connectionStatus === 'connected' ? 'bg-green-500' : 'bg-gray-600'}`} /><span className="text-[10px] font-medium text-gray-200">{api.name}</span></div><button onClick={() => removeAPIConfig(api.id)} className="text-[9px] text-gray-600 hover:text-red-400">✕</button></div><div className="grid grid-cols-2 gap-1.5"><input type="password" value={api.apiKey} onChange={(e) => updateAPIConfig(api.id, { apiKey: e.target.value })} placeholder="API Key" className="px-1.5 py-1 rounded bg-gray-950/50 border border-gray-800/50 text-[9px] text-gray-300 font-mono placeholder:text-gray-700" /><input type="password" value={api.apiSecret} onChange={(e) => updateAPIConfig(api.id, { apiSecret: e.target.value })} placeholder="Secret" className="px-1.5 py-1 rounded bg-gray-950/50 border border-gray-800/50 text-[9px] text-gray-300 font-mono placeholder:text-gray-700" /></div><Toggle label="Enable" checked={api.enabled} onChange={(v) => updateAPIConfig(api.id, { enabled: v })} /></div>)}
      <button onClick={() => addAPIConfig({ id: Date.now().toString(), name: 'New API', provider: 'custom', apiKey: '', apiSecret: '', baseUrl: '', enabled: false, connectionStatus: 'disconnected', rateLimit: 1200 })} className="w-full p-2 rounded-lg border border-dashed border-gray-700/50 text-[10px] text-gray-500 hover:text-purple-300 hover:border-purple-500/30">+ Add API</button>
    </div>
  );
}

function GatewayTab() {
  const { gatewayNodes, updateGatewayNode, addGatewayNode, removeGatewayNode } = useTradingStore();
  return (
    <div className="space-y-2">
      {gatewayNodes.map(node => <div key={node.id} className={`p-2 rounded-lg border ${node.enabled ? 'bg-gray-900/30 border-gray-800/40' : 'bg-gray-900/10 border-gray-800/20 opacity-50'}`}><div className="flex items-center justify-between mb-1"><div className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${node.status === 'connected' ? 'bg-green-500' : 'bg-gray-600'}`} /><span className="text-[10px] font-medium text-gray-200">{node.name}</span><span className="text-[8px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">{node.type}</span></div><div className="flex items-center gap-1.5"><input type="checkbox" checked={node.enabled} onChange={(e) => updateGatewayNode(node.id, { enabled: e.target.checked })} className="w-3 h-3 accent-purple-500" /><button onClick={() => removeGatewayNode(node.id)} className="text-[9px] text-gray-600 hover:text-red-400">✕</button></div></div><input type="text" value={node.endpoint} onChange={(e) => updateGatewayNode(node.id, { endpoint: e.target.value })} className="w-full px-1.5 py-1 rounded bg-gray-950/50 border border-gray-800/50 text-[9px] text-gray-300 font-mono" /><div className="flex items-center gap-2 mt-1"><span className="text-[8px] text-gray-600">Weight: {(node.weight * 100).toFixed(0)}%</span><input type="range" value={node.weight * 100} onChange={(e) => updateGatewayNode(node.id, { weight: Number(e.target.value) / 100 })} min={0} max={100} step={5} className="flex-1 h-1 rounded bg-gray-700 accent-purple-500" /></div></div>)}
      <button onClick={() => addGatewayNode({ id: Date.now().toString(), name: 'New Node', type: 'custom', endpoint: '', apiKey: '', enabled: true, weight: 0.2, latency: 0, status: 'disconnected' })} className="w-full p-2 rounded-lg border border-dashed border-gray-700/50 text-[10px] text-gray-500 hover:text-purple-300">+ Add Node</button>
    </div>
  );
}

function AutoTab() {
  const { autoTradeConfig, updateAutoTradeConfig } = useTradingStore();
  const modes = [{ id: 'conservative', label: 'Conservative', icon: '🛡️' }, { id: 'balanced', label: 'Balanced', icon: '⚖️' }, { id: 'aggressive', label: 'Aggressive', icon: '⚡' }, { id: 'scalping', label: 'Scalping', icon: '🎯' }, { id: 'swing', label: 'Swing', icon: '🌊' }];
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-900/30 border border-gray-800/30"><div className="flex items-center gap-2"><div className={`w-2.5 h-2.5 rounded-full ${autoTradeConfig.enabled ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} /><span className="text-xs font-medium text-gray-200">Auto Trading</span></div><Toggle label="" checked={autoTradeConfig.enabled} onChange={(v) => updateAutoTradeConfig({ enabled: v })} /></div>
      <div className="grid grid-cols-1 gap-1">{modes.map(m => <button key={m.id} onClick={() => updateAutoTradeConfig({ mode: m.id as any })} className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left ${autoTradeConfig.mode === m.id ? 'bg-purple-500/15 border border-purple-500/40' : 'bg-gray-900/20 border border-gray-800/30'}`}><span className="text-sm">{m.icon}</span><span className={`text-[10px] font-medium ${autoTradeConfig.mode === m.id ? 'text-purple-300' : 'text-gray-300'}`}>{m.label}</span></button>)}</div>
      <SettingGroup title="Limits"><div className="grid grid-cols-2 gap-2"><NumInput label="Max Trades/Day" value={autoTradeConfig.maxTradesPerDay} onChange={(v) => updateAutoTradeConfig({ maxTradesPerDay: v })} min={1} max={100} /><NumInput label="Cooldown (sec)" value={autoTradeConfig.cooldownPeriod} onChange={(v) => updateAutoTradeConfig({ cooldownPeriod: v })} min={10} max={3600} /></div></SettingGroup>
      <SettingGroup title="Features"><Toggle label="Auto Compound" checked={autoTradeConfig.autoCompound} onChange={(v) => updateAutoTradeConfig({ autoCompound: v })} /><Toggle label="Partial TP" checked={autoTradeConfig.partialTP.enabled} onChange={(v) => updateAutoTradeConfig({ partialTP: { ...autoTradeConfig.partialTP, enabled: v } })} /><Toggle label="News Filter" checked={autoTradeConfig.newsFilter.enabled} onChange={(v) => updateAutoTradeConfig({ newsFilter: { ...autoTradeConfig.newsFilter, enabled: v } })} /><Toggle label="Session Filter" checked={autoTradeConfig.sessionFilter.enabled} onChange={(v) => updateAutoTradeConfig({ sessionFilter: { ...autoTradeConfig.sessionFilter, enabled: v } })} /></SettingGroup>
    </div>
  );
}

function ChatSettingsTab() {
  const { chatSettings, voiceSettings, updateChatSettings, updateVoiceSettings } = useTradingStore();
  return (
    <div className="space-y-2">
      <SectionTitle title="AI Chat" />
      <SettingGroup title="Configuration"><Toggle label="Enable Chat" checked={chatSettings.enabled} onChange={(v) => updateChatSettings({ enabled: v })} /><div className="grid grid-cols-2 gap-1">{(['gpt4', 'claude', 'gemini', 'local'] as const).map(m => <button key={m} onClick={() => updateChatSettings({ model: m })} className={`px-2 py-1 rounded text-[9px] ${chatSettings.model === m ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-gray-800/30 text-gray-400 border border-gray-700/30'}`}>{m.toUpperCase()}</button>)}</div></SettingGroup>
      <SectionTitle title="Voice Control" />
      <SettingGroup title="Configuration"><Toggle label="Enable Voice" checked={voiceSettings.enabled} onChange={(v) => updateVoiceSettings({ enabled: v })} /><div><label className="text-[9px] text-gray-400 block mb-1">Language</label><select value={voiceSettings.language} onChange={(e) => updateVoiceSettings({ language: e.target.value })} className="w-full px-2 py-1 rounded bg-gray-800/80 border border-gray-700/50 text-[10px] text-gray-200"><option value="en-US">English (US)</option><option value="id-ID">Indonesian</option><option value="zh-CN">Chinese</option><option value="ja-JP">Japanese</option></select></div><Toggle label="Auto-execute" checked={voiceSettings.autoExecute} onChange={(v) => updateVoiceSettings({ autoExecute: v })} /><Toggle label="Voice Feedback" checked={voiceSettings.voiceFeedback} onChange={(v) => updateVoiceSettings({ voiceFeedback: v })} /></SettingGroup>
    </div>
  );
}

function DownloadTab() {
  const { addLog } = useTradingStore();
  const [platform, setPlatform] = useState<'windows' | 'android' | 'ios'>('windows');
  const [apiKey, setApiKey] = useState('');
  const [duration, setDuration] = useState(30);
  const platforms = [{ id: 'windows', name: 'Windows', icon: '🪟', size: '145 MB' }, { id: 'android', name: 'Android', icon: '🤖', size: '85 MB' }, { id: 'ios', name: 'iOS', icon: '🍎', size: '92 MB' }];
  const generateKey = () => { const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; let key = 'PJBOT-'; for (let i = 0; i < 5; i++) { let seg = ''; for (let j = 0; j < 5; j++) seg += chars[Math.floor(Math.random() * chars.length)]; key += seg + (i < 4 ? '-' : ''); } setApiKey(key); addLog({ type: 'system', message: `🔑 API Key generated - Expires in ${duration} days` }); };
  return (
    <div className="space-y-3">
      <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20"><div className="flex items-center gap-2 mb-1"><span className="text-lg">📦</span><h3 className="text-sm font-bold text-white">Download Client</h3></div><p className="text-[10px] text-gray-400">Install on Windows, Android, or iOS</p></div>
      <div className="grid grid-cols-3 gap-2">{platforms.map(p => <button key={p.id} onClick={() => setPlatform(p.id as any)} className={`p-3 rounded-lg border text-center ${platform === p.id ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'bg-gray-900/30 border-gray-800/50 text-gray-400'}`}><div className="text-2xl">{p.icon}</div><div className="text-[10px] font-medium">{p.name}</div><div className="text-[8px] opacity-60">{p.size}</div></button>)}</div>
      <SettingGroup title="License Duration"><div className="grid grid-cols-4 gap-1.5">{[7, 30, 90, 365].map(d => <button key={d} onClick={() => setDuration(d)} className={`px-2 py-1.5 rounded text-[10px] ${duration === d ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-gray-800/30 text-gray-400 border border-gray-700/30'}`}>{d === 7 ? '7 Days' : d === 30 ? '30 Days' : d === 90 ? '90 Days' : '1 Year'}</button>)}</div><div className="text-[9px] text-gray-500 mt-1">💰 {duration === 7 ? '$9.99' : duration === 30 ? '$29.99' : duration === 90 ? '$79.99' : '$249.99'}</div></SettingGroup>
      {!apiKey ? <button onClick={generateKey} className="w-full px-3 py-2 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-medium">🔑 Generate API Key</button> : <div className="space-y-2"><div className="p-2 rounded bg-gray-950/50 border border-gray-800/50"><div className="text-[9px] text-gray-500 mb-1">API Key</div><div className="text-[10px] text-gray-200 font-mono break-all">{apiKey}</div></div><button onClick={() => { addLog({ type: 'info', message: `📥 Download started for ${platform}` }); }} className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-sm">📥 Download {platforms.find(p => p.id === platform)?.name}</button></div>}
    </div>
  );
}

function OtherTab() {
  return (
    <div className="space-y-2">
      <SettingGroup title="Notifications"><Toggle label="Trade Executed" checked={true} onChange={() => {}} /><Toggle label="Stop Loss Hit" checked={true} onChange={() => {}} /><Toggle label="AI Signal Alert" checked={true} onChange={() => {}} /><Toggle label="Daily Report" checked={true} onChange={() => {}} /></SettingGroup>
      <SettingGroup title="Data Export"><div className="grid grid-cols-2 gap-1.5"><button className="px-2 py-1.5 rounded text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/30">📥 Export Trades</button><button className="px-2 py-1.5 rounded text-[9px] bg-green-500/10 text-green-400 border border-green-500/30">📥 Export Settings</button></div></SettingGroup>
      <SettingGroup title="System"><div className="space-y-1.5 text-[9px]"><div className="flex justify-between"><span className="text-gray-500">CPU</span><span className="text-gray-300">12%</span></div><div className="flex justify-between"><span className="text-gray-500">Memory</span><span className="text-gray-300">256 MB</span></div><div className="flex justify-between"><span className="text-gray-500">Uptime</span><span className="text-gray-300">2h 34m</span></div></div></SettingGroup>
      <div className="text-[9px] text-gray-500 text-center p-2">PJ.BOT AI Trading Agent v3.0<br/>Build: 2024</div>
    </div>
  );
}

function WebSocketTab() {
  const { websocketConfig, updateWebSocketConfig } = useTradingStore();
  
  return (
    <div className="space-y-2">
      <SectionTitle title="WebSocket Configuration" />
      <SettingGroup title="Connection">
        <Toggle label="Enable WebSocket" checked={websocketConfig.enabled} onChange={(v) => updateWebSocketConfig({ enabled: v })} />
        <div className="mt-2">
          <label className="text-[9px] text-gray-400 block mb-1">WebSocket URL</label>
          <input
            type="text"
            value={websocketConfig.url}
            onChange={(e) => updateWebSocketConfig({ url: e.target.value })}
            placeholder="ws://localhost:3001"
            className="w-full px-2 py-1.5 rounded bg-gray-800/80 border border-gray-700/50 text-[10px] text-gray-200 font-mono placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50"
          />
        </div>
        <div className="mt-2 p-2 rounded bg-gray-950/50 border border-gray-800/30">
          <div className="flex items-center justify-between text-[9px]">
            <span className="text-gray-500">Status</span>
            <span className={`font-medium ${
              websocketConfig.connectionStatus === 'connected' ? 'text-green-400' :
              websocketConfig.connectionStatus === 'connecting' ? 'text-yellow-400' :
              websocketConfig.connectionStatus === 'error' ? 'text-red-400' : 'text-gray-400'
            }`}>
              {websocketConfig.connectionStatus.toUpperCase()}
            </span>
          </div>
        </div>
      </SettingGroup>
      
      <SectionTitle title="Connection Settings" />
      <SettingGroup title="Reconnection">
        <div className="grid grid-cols-2 gap-2">
          <NumInput label="Reconnect Interval (ms)" value={websocketConfig.reconnectInterval} onChange={(v) => updateWebSocketConfig({ reconnectInterval: v })} min={1000} max={60000} step={1000} />
          <NumInput label="Max Reconnect Attempts" value={websocketConfig.maxReconnectAttempts} onChange={(v) => updateWebSocketConfig({ maxReconnectAttempts: v })} min={1} max={20} />
        </div>
      </SettingGroup>
      
      <SettingGroup title="Heartbeat">
        <NumInput label="Heartbeat Interval (ms)" value={websocketConfig.heartbeatInterval} onChange={(v) => updateWebSocketConfig({ heartbeatInterval: v })} min={5000} max={120000} step={5000} />
      </SettingGroup>
      
      <SectionTitle title="Channels" />
      <SettingGroup title="Subscribe Channels">
        <div className="space-y-1.5">
          {['trades', 'ticker', 'orderbook', 'kline', 'depth'].map((channel) => (
            <Toggle
              key={channel}
              label={channel.charAt(0).toUpperCase() + channel.slice(1)}
              checked={websocketConfig.channels.includes(channel)}
              onChange={(checked) => {
                const channels = checked
                  ? [...websocketConfig.channels, channel]
                  : websocketConfig.channels.filter(c => c !== channel);
                updateWebSocketConfig({ channels });
              }}
            />
          ))}
        </div>
      </SettingGroup>
    </div>
  );
}

function NumInput({ label, value, onChange, min, max, step = 1 }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) { return <div className="space-y-0.5"><label className="text-[8px] text-gray-500">{label}</label><input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} min={min} max={max} step={step} className="w-full px-1.5 py-1 rounded bg-gray-800/80 border border-gray-700/50 text-[10px] text-gray-200 focus:outline-none focus:border-purple-500/50" /></div>; }
function SliderInput({ label, value, onChange, min, max, step = 1, format }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; format?: (v: number) => string }) { return <div className="space-y-0.5"><div className="flex justify-between"><label className="text-[9px] text-gray-400">{label}</label><span className="text-[9px] text-gray-300 font-mono">{format ? format(value) : value}</span></div><input type="range" value={value} onChange={(e) => onChange(Number(e.target.value))} min={min} max={max} step={step} className="w-full h-1.5 rounded-full bg-gray-700 accent-purple-500 cursor-pointer" /></div>; }
