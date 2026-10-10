import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTradingStore } from '../store/tradingStore';

// ============================================================
// CONNECTION PANEL COMPONENT
// Features: MT5, API Keys, Gateway Multi AI Agent configuration
// ============================================================

type ConnectionTab = 'mt5' | 'api' | 'gateway';

interface ConnectionPanelProps {
  initialTab?: ConnectionTab;
}

export default function ConnectionPanel({ initialTab }: ConnectionPanelProps = {}) {
  const [tab, setTab] = useState<ConnectionTab>(initialTab || 'mt5');

  return (
    <div className="space-y-3">
      {/* Tab Navigation */}
      <div className="flex gap-1 p-0.5 bg-gray-900/50 rounded-lg border border-gray-800/50">
        {([
          { id: 'mt5' as const, label: 'MT5', icon: '📊' },
          { id: 'api' as const, label: 'API Keys', icon: '🔑' },
          { id: 'gateway' as const, label: 'AI Gateway', icon: '🌐' },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 px-2 py-1.5 rounded-md text-[10px] font-medium transition-all ${
              tab === t.id
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'mt5' && <MT5Panel />}
          {tab === 'api' && <APIPanel />}
          {tab === 'gateway' && <GatewayPanel />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// MT5 PANEL
// ============================================================
function MT5Panel() {
  const { mt5Settings, updateMT5Settings, connectMT5, disconnectMT5, addLog } = useTradingStore();

  const statusColors: Record<string, string> = {
    disconnected: 'text-gray-500',
    connecting: 'text-yellow-400',
    connected: 'text-green-400',
    error: 'text-red-400',
  };

  return (
    <div className="space-y-3">
      {/* Status */}
      <div className="flex items-center justify-between p-2 rounded-lg bg-gray-900/30 border border-gray-800/30">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            mt5Settings.connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' :
            mt5Settings.connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
            mt5Settings.connectionStatus === 'error' ? 'bg-red-500' : 'bg-gray-600'
          }`} />
          <span className={`text-[10px] font-medium ${statusColors[mt5Settings.connectionStatus]}`}>
            {mt5Settings.connectionStatus.toUpperCase()}
          </span>
        </div>
        {mt5Settings.connectionStatus === 'connected' ? (
          <button onClick={disconnectMT5} className="px-2 py-0.5 rounded text-[9px] bg-red-500/20 text-red-400 border border-red-500/30">
            Disconnect
          </button>
        ) : (
          <button onClick={connectMT5} className="px-2 py-0.5 rounded text-[9px] bg-green-500/20 text-green-400 border border-green-500/30">
            Connect
          </button>
        )}
      </div>

      {/* MT5 Settings Form */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[9px] text-gray-500 block mb-0.5">Server</label>
            <select
              value={mt5Settings.server}
              onChange={(e) => updateMT5Settings({ server: e.target.value })}
              className="w-full px-2 py-1.5 rounded bg-gray-900/50 border border-gray-700/50 text-[10px] text-gray-200 focus:outline-none focus:border-purple-500/50"
            >
              <option>MetaQuotes-Demo</option>
              <option>ICMarkets-Demo</option>
              <option>Exness-Demo</option>
              <option>XMGlobal-Demo</option>
              <option>FBS-Demo</option>
              <option>Pepperstone-Demo</option>
            </select>
          </div>
          <div>
            <label className="text-[9px] text-gray-500 block mb-0.5">Account Type</label>
            <div className="flex gap-1">
              {(['demo', 'live'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => updateMT5Settings({ accountType: type })}
                  className={`flex-1 px-2 py-1.5 rounded text-[10px] font-medium uppercase transition-all ${
                    mt5Settings.accountType === type
                      ? type === 'demo' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : 'bg-gray-900/30 text-gray-500 border border-gray-800/30'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-[9px] text-gray-500 block mb-0.5">Login (Account Number)</label>
          <input
            type="text"
            value={mt5Settings.login}
            onChange={(e) => updateMT5Settings({ login: e.target.value })}
            placeholder="e.g., 501234567"
            className="w-full px-2 py-1.5 rounded bg-gray-900/50 border border-gray-700/50 text-[10px] text-gray-200 font-mono placeholder:text-gray-700 focus:outline-none focus:border-purple-500/50"
          />
        </div>

        <div>
          <label className="text-[9px] text-gray-500 block mb-0.5">Password</label>
          <input
            type="password"
            value={mt5Settings.password}
            onChange={(e) => updateMT5Settings({ password: e.target.value })}
            placeholder="••••••••"
            className="w-full px-2 py-1.5 rounded bg-gray-900/50 border border-gray-700/50 text-[10px] text-gray-200 font-mono placeholder:text-gray-700 focus:outline-none focus:border-purple-500/50"
          />
        </div>

        <div>
          <label className="text-[9px] text-gray-500 block mb-0.5">Broker</label>
          <input
            type="text"
            value={mt5Settings.broker}
            onChange={(e) => updateMT5Settings({ broker: e.target.value })}
            className="w-full px-2 py-1.5 rounded bg-gray-900/50 border border-gray-700/50 text-[10px] text-gray-200 focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* MT5 Features */}
      <div className="p-2 rounded-lg bg-gray-900/20 border border-gray-800/30">
        <div className="text-[9px] text-gray-500 mb-1.5 uppercase tracking-wider">MT5 Features</div>
        <div className="grid grid-cols-2 gap-1">
          {['Expert Advisor', 'Copy Trading', 'Market Depth', 'VPS Hosting', 'Auto Trading', 'Signal Service'].map((feature) => (
            <label key={feature} className="flex items-center gap-1.5 text-[10px] text-gray-400">
              <input type="checkbox" className="w-3 h-3 rounded accent-purple-500" />
              {feature}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// API PANEL
// ============================================================
function APIPanel() {
  const { apiConfigs, updateAPIConfig, addAPIConfig, removeAPIConfig, addLog } = useTradingStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newApi, setNewApi] = useState({ name: '', provider: '', apiKey: '', apiSecret: '', baseUrl: '' });

  const providers = [
    { id: 'binance', name: 'Binance', icon: '🟡' },
    { id: 'bybit', name: 'Bybit', icon: '🔶' },
    { id: 'okx', name: 'OKX', icon: '⬜' },
    { id: 'coinbase', name: 'Coinbase', icon: '🔵' },
    { id: 'kraken', name: 'Kraken', icon: '🐙' },
    { id: 'mt5', name: 'MetaTrader 5', icon: '📊' },
    { id: 'ctrader', name: 'cTrader', icon: '📈' },
    { id: 'oanda', name: 'OANDA', icon: '🏦' },
    { id: 'ig', name: 'IG Markets', icon: '🔴' },
    { id: 'alpaca', name: 'Alpaca', icon: '🦙' },
    { id: 'interactive', name: 'Interactive Brokers', icon: '🏛️' },
    { id: 'custom', name: 'Custom API', icon: '⚙️' },
  ];

  const handleAdd = () => {
    if (!newApi.name || !newApi.provider) return;
    addAPIConfig({
      id: Date.now().toString(),
      name: newApi.name,
      provider: newApi.provider,
      apiKey: newApi.apiKey,
      apiSecret: newApi.apiSecret,
      baseUrl: newApi.baseUrl || `https://api.${newApi.provider}.com`,
      enabled: false,
      connectionStatus: 'disconnected',
      rateLimit: 1200,
    });
    setNewApi({ name: '', provider: '', apiKey: '', apiSecret: '', baseUrl: '' });
    setShowAdd(false);
    addLog({ type: 'system', message: `🔑 New API added: ${newApi.name}` });
  };

  return (
    <div className="space-y-3">
      {/* API List */}
      <div className="space-y-1.5">
        {apiConfigs.map((api) => (
          <div key={api.id} className="p-2 rounded-lg bg-gray-900/30 border border-gray-800/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">{providers.find(p => p.id === api.provider)?.icon || '⚙️'}</span>
                <div>
                  <div className="text-[10px] font-medium text-gray-200">{api.name}</div>
                  <div className="text-[8px] text-gray-600">{api.baseUrl}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  api.connectionStatus === 'connected' ? 'bg-green-500' :
                  api.connectionStatus === 'error' ? 'bg-red-500' : 'bg-gray-600'
                }`} />
                <button
                  onClick={() => removeAPIConfig(api.id)}
                  className="text-[9px] text-gray-600 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label className="text-[8px] text-gray-600 block">API Key</label>
                <input
                  type="password"
                  value={api.apiKey}
                  onChange={(e) => updateAPIConfig(api.id, { apiKey: e.target.value })}
                  placeholder="Enter API key..."
                  className="w-full px-1.5 py-1 rounded bg-gray-950/50 border border-gray-800/50 text-[9px] text-gray-300 font-mono placeholder:text-gray-700 focus:outline-none focus:border-purple-500/30"
                />
              </div>
              <div>
                <label className="text-[8px] text-gray-600 block">API Secret</label>
                <input
                  type="password"
                  value={api.apiSecret}
                  onChange={(e) => updateAPIConfig(api.id, { apiSecret: e.target.value })}
                  placeholder="Enter secret..."
                  className="w-full px-1.5 py-1 rounded bg-gray-950/50 border border-gray-800/50 text-[9px] text-gray-300 font-mono placeholder:text-gray-700 focus:outline-none focus:border-purple-500/30"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-[9px] text-gray-400">
                <input
                  type="checkbox"
                  checked={api.enabled}
                  onChange={(e) => updateAPIConfig(api.id, { enabled: e.target.checked })}
                  className="w-3 h-3 rounded accent-purple-500"
                />
                Enable
              </label>
              <span className="text-[8px] text-gray-600">Rate: {api.rateLimit}/min</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add New API */}
      {showAdd ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-2 rounded-lg bg-gray-900/30 border border-purple-500/30 space-y-2"
        >
          <div className="text-[10px] font-medium text-purple-300">Add New API</div>
          <div className="grid grid-cols-2 gap-1.5">
            <div>
              <label className="text-[8px] text-gray-600 block">Name</label>
              <input
                type="text"
                value={newApi.name}
                onChange={(e) => setNewApi({ ...newApi, name: e.target.value })}
                placeholder="My Exchange"
                className="w-full px-1.5 py-1 rounded bg-gray-950/50 border border-gray-800/50 text-[9px] text-gray-300 placeholder:text-gray-700 focus:outline-none focus:border-purple-500/30"
              />
            </div>
            <div>
              <label className="text-[8px] text-gray-600 block">Provider</label>
              <select
                value={newApi.provider}
                onChange={(e) => setNewApi({ ...newApi, provider: e.target.value })}
                className="w-full px-1.5 py-1 rounded bg-gray-950/50 border border-gray-800/50 text-[9px] text-gray-300 focus:outline-none focus:border-purple-500/30"
              >
                <option value="">Select...</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>{p.icon} {p.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[8px] text-gray-600 block">Base URL (optional)</label>
            <input
              type="text"
              value={newApi.baseUrl}
              onChange={(e) => setNewApi({ ...newApi, baseUrl: e.target.value })}
              placeholder="https://api.example.com"
              className="w-full px-1.5 py-1 rounded bg-gray-950/50 border border-gray-800/50 text-[9px] text-gray-300 font-mono placeholder:text-gray-700 focus:outline-none focus:border-purple-500/30"
            />
          </div>
          <div className="flex gap-1.5">
            <button onClick={handleAdd} className="flex-1 px-2 py-1 rounded text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Add API
            </button>
            <button onClick={() => setShowAdd(false)} className="px-2 py-1 rounded text-[9px] bg-gray-800/50 text-gray-400 border border-gray-700/30">
              Cancel
            </button>
          </div>
        </motion.div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full p-2 rounded-lg border border-dashed border-gray-700/50 text-[10px] text-gray-500 hover:text-purple-300 hover:border-purple-500/30 transition-all"
        >
          + Add New API Connection
        </button>
      )}
    </div>
  );
}

// ============================================================
// GATEWAY MULTI AI AGENT PANEL
// ============================================================
function GatewayPanel() {
  const { gatewayNodes, updateGatewayNode, addGatewayNode, removeGatewayNode, addLog } = useTradingStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newNode, setNewNode] = useState({ name: '', type: 'custom' as const, endpoint: '', apiKey: '' });

  const handleAdd = () => {
    if (!newNode.name || !newNode.endpoint) return;
    addGatewayNode({
      id: Date.now().toString(),
      name: newNode.name,
      type: newNode.type,
      endpoint: newNode.endpoint,
      apiKey: newNode.apiKey,
      enabled: true,
      weight: 0.2,
      latency: 0,
      status: 'disconnected',
    });
    setNewNode({ name: '', type: 'custom', endpoint: '', apiKey: '' });
    setShowAdd(false);
    addLog({ type: 'system', message: `🌐 New Gateway Node added: ${newNode.name}` });
  };

  const typeColors: Record<string, string> = {
    technical: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    sentiment: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    onchain: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    ml: 'text-green-400 bg-green-500/10 border-green-500/30',
    custom: 'text-gray-400 bg-gray-500/10 border-gray-500/30',
  };

  const totalWeight = gatewayNodes.filter(n => n.enabled).reduce((sum, n) => sum + n.weight, 0);

  return (
    <div className="space-y-3">
      {/* Gateway Overview */}
      <div className="p-2 rounded-lg bg-gray-900/30 border border-gray-800/30">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] text-gray-500 uppercase tracking-wider">Gateway Status</span>
          <span className="text-[9px] text-purple-300">
            {gatewayNodes.filter(n => n.enabled).length}/{gatewayNodes.length} Active
          </span>
        </div>
        <div className="flex items-center gap-1">
          {gatewayNodes.map((node) => (
            <div
              key={node.id}
              className={`flex-1 h-2 rounded-full ${node.enabled ? 'bg-purple-500/40' : 'bg-gray-800'}`}
              title={`${node.name}: ${(node.weight * 100).toFixed(0)}%`}
            />
          ))}
        </div>
        <div className="text-[8px] text-gray-600 mt-1 text-center">
          Total Weight: {(totalWeight * 100).toFixed(0)}% {Math.abs(totalWeight - 1) > 0.01 && <span className="text-yellow-500">⚠ Should = 100%</span>}
        </div>
      </div>

      {/* Node List */}
      <div className="space-y-1.5">
        {gatewayNodes.map((node) => (
          <motion.div
            key={node.id}
            layout
            className={`p-2 rounded-lg border transition-all ${
              node.enabled ? 'bg-gray-900/30 border-gray-800/40' : 'bg-gray-900/10 border-gray-800/20 opacity-50'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  node.status === 'connected' ? 'bg-green-500' :
                  node.status === 'error' ? 'bg-red-500' : 'bg-gray-600'
                }`} />
                <span className="text-[10px] font-medium text-gray-200">{node.name}</span>
                <span className={`text-[8px] px-1.5 py-0.5 rounded border ${typeColors[node.type]}`}>
                  {node.type}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <label className="flex items-center gap-1 text-[8px] text-gray-500">
                  <input
                    type="checkbox"
                    checked={node.enabled}
                    onChange={(e) => updateGatewayNode(node.id, { enabled: e.target.checked })}
                    className="w-2.5 h-2.5 rounded accent-purple-500"
                  />
                </label>
                <button
                  onClick={() => removeGatewayNode(node.id)}
                  className="text-[9px] text-gray-600 hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div>
                <label className="text-[8px] text-gray-600 block">Endpoint</label>
                <input
                  type="text"
                  value={node.endpoint}
                  onChange={(e) => updateGatewayNode(node.id, { endpoint: e.target.value })}
                  className="w-full px-1.5 py-1 rounded bg-gray-950/50 border border-gray-800/50 text-[9px] text-gray-300 font-mono focus:outline-none focus:border-purple-500/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="text-[8px] text-gray-600 block">API Key</label>
                  <input
                    type="password"
                    value={node.apiKey}
                    onChange={(e) => updateGatewayNode(node.id, { apiKey: e.target.value })}
                    placeholder="Optional..."
                    className="w-full px-1.5 py-1 rounded bg-gray-950/50 border border-gray-800/50 text-[9px] text-gray-300 font-mono placeholder:text-gray-700 focus:outline-none focus:border-purple-500/30"
                  />
                </div>
                <div>
                  <label className="text-[8px] text-gray-600 block">Weight: {(node.weight * 100).toFixed(0)}%</label>
                  <input
                    type="range"
                    value={node.weight * 100}
                    onChange={(e) => updateGatewayNode(node.id, { weight: Number(e.target.value) / 100 })}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full h-1 rounded-full bg-gray-700 accent-purple-500 cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-[8px]">
                <span className="text-gray-600">Latency: {node.latency}ms</span>
                <button 
                  onClick={() => {
                    updateGatewayNode(node.id, { status: 'connecting' });
                    setTimeout(() => {
                      updateGatewayNode(node.id, { 
                        status: Math.random() > 0.3 ? 'connected' : 'error',
                        latency: Math.floor(Math.random() * 100 + 20)
                      });
                    }, 1500);
                  }}
                  className="text-purple-400 hover:text-purple-300"
                >
                  {node.status === 'connected' ? '🔄 Reconnect' : '▶ Test'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Node */}
      {showAdd ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-2 rounded-lg bg-gray-900/30 border border-purple-500/30 space-y-2"
        >
          <div className="text-[10px] font-medium text-purple-300">Add Gateway Node</div>
          <div className="grid grid-cols-2 gap-1.5">
            <input
              type="text"
              value={newNode.name}
              onChange={(e) => setNewNode({ ...newNode, name: e.target.value })}
              placeholder="Node name..."
              className="px-1.5 py-1 rounded bg-gray-950/50 border border-gray-800/50 text-[9px] text-gray-300 placeholder:text-gray-700 focus:outline-none focus:border-purple-500/30"
            />
            <select
              value={newNode.type}
              onChange={(e) => setNewNode({ ...newNode, type: e.target.value as any })}
              className="px-1.5 py-1 rounded bg-gray-950/50 border border-gray-800/50 text-[9px] text-gray-300 focus:outline-none focus:border-purple-500/30"
            >
              <option value="technical">Technical</option>
              <option value="sentiment">Sentiment</option>
              <option value="onchain">On-Chain</option>
              <option value="ml">ML/AI</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <input
            type="text"
            value={newNode.endpoint}
            onChange={(e) => setNewNode({ ...newNode, endpoint: e.target.value })}
            placeholder="http://localhost:5000/analyze"
            className="w-full px-1.5 py-1 rounded bg-gray-950/50 border border-gray-800/50 text-[9px] text-gray-300 font-mono placeholder:text-gray-700 focus:outline-none focus:border-purple-500/30"
          />
          <div className="flex gap-1.5">
            <button onClick={handleAdd} className="flex-1 px-2 py-1 rounded text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Add Node
            </button>
            <button onClick={() => setShowAdd(false)} className="px-2 py-1 rounded text-[9px] bg-gray-800/50 text-gray-400">
              Cancel
            </button>
          </div>
        </motion.div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full p-2 rounded-lg border border-dashed border-gray-700/50 text-[10px] text-gray-500 hover:text-purple-300 hover:border-purple-500/30 transition-all"
        >
          + Add Gateway Node
        </button>
      )}
    </div>
  );
}
