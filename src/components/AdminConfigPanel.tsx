import { motion } from 'framer-motion';
import { useTradingStore } from '../store/tradingStore';

// ============================================================
// ADMIN CONFIGURATION PANEL
// Features: Toggle all features, modules, and security settings
// ============================================================

export default function AdminConfigPanel() {
  const { adminConfig, toggleFeature, toggleModule, updateSecurity, addLog } = useTradingStore();

  const features: Array<{ key: keyof typeof adminConfig.features; label: string; icon: string; desc: string }> = [
    { key: 'liveChart', label: 'Live Trading Chart', icon: '📊', desc: 'Real-time chart with 500ms updates' },
    { key: 'chatAI', label: 'Chat AI Assistant', icon: '💬', desc: 'AI-powered trading assistant' },
    { key: 'voiceControl', label: 'Voice Control', icon: '🎤', desc: 'Voice commands for trading' },
    { key: 'promptLibrary', label: 'Prompt Library', icon: '📚', desc: '12 AI agent tasks' },
    { key: 'simulationEngine', label: 'Simulation Engine', icon: '🔬', desc: 'Backtesting with equity curve' },
    { key: 'statsDashboard', label: 'Stats Dashboard', icon: '📈', desc: 'Performance metrics' },
    { key: 'activityLog', label: 'Activity Log', icon: '📋', desc: 'Real-time trading logs' },
    { key: 'commandCenter', label: 'Command Center', icon: '⚡', desc: '4 live charts monitoring' },
    { key: 'strategyMarketplace', label: 'Strategy Marketplace', icon: '🏪', desc: 'Buy/sell trading strategies' },
    { key: 'socialTrading', label: 'Social Trading', icon: '👥', desc: 'Copy trading & leaderboard' },
    { key: 'realMarketData', label: 'Real Market Data', icon: '📡', desc: 'Live data from 5 exchanges' },
    { key: 'advancedIndicators', label: 'Advanced Indicators', icon: '📉', desc: '16 technical indicators' },
    { key: 'advancedBacktest', label: 'Advanced Backtest', icon: '🧪', desc: 'Walk-forward & Monte Carlo' },
    { key: 'downloadClient', label: 'Download Client', icon: '📥', desc: 'Multi-platform installer' },
  ];

  const modules: Array<{ key: keyof typeof adminConfig.modules; label: string; icon: string; desc: string }> = [
    { key: 'mt5Integration', label: 'MetaTrader 5', icon: '⚡', desc: 'MT5 connection & trading' },
    { key: 'apiGateway', label: 'API Gateway', icon: '🔑', desc: 'Multi-exchange API integration' },
    { key: 'aiGateway', label: 'AI Gateway', icon: '🌐', desc: 'Multi-agent orchestration' },
    { key: 'autoTrading', label: 'Auto Trading', icon: '🤖', desc: 'Automated trading system' },
    { key: 'websocketConnection', label: 'WebSocket', icon: '🔌', desc: 'Real-time data streaming' },
  ];

  const handleToggleFeature = (key: keyof typeof adminConfig.features) => {
    toggleFeature(key);
    const feature = features.find(f => f.key === key);
    const newState = !adminConfig.features[key];
    addLog({ 
      type: 'system', 
      message: `${newState ? '✅ Enabled' : '❌ Disabled'} ${feature?.label}` 
    });
  };

  const handleToggleModule = (key: keyof typeof adminConfig.modules) => {
    toggleModule(key);
    const module = modules.find(m => m.key === key);
    const newState = !adminConfig.modules[key];
    addLog({ 
      type: 'system', 
      message: `${newState ? '✅ Enabled' : '❌ Disabled'} ${module?.label} module` 
    });
  };

  const enabledFeaturesCount = Object.values(adminConfig.features).filter(v => v).length;
  const enabledModulesCount = Object.values(adminConfig.modules).filter(v => v).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🛡️</span> Admin Configuration
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Control all features, modules, and security settings
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Active Features</div>
          <div className="text-sm font-bold text-green-400">{enabledFeaturesCount}/{features.length}</div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Application Features
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                features.forEach(f => {
                  if (!adminConfig.features[f.key]) toggleFeature(f.key);
                });
                addLog({ type: 'system', message: '✅ All features enabled' });
              }}
              className="px-2 py-1 rounded text-[10px] bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/30"
            >
              Enable All
            </button>
            <button
              onClick={() => {
                features.forEach(f => {
                  if (adminConfig.features[f.key]) toggleFeature(f.key);
                });
                addLog({ type: 'system', message: '❌ All features disabled' });
              }}
              className="px-2 py-1 rounded text-[10px] bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30"
            >
              Disable All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {features.map((feature) => (
            <motion.div
              key={feature.key}
              layout
              className={`p-3 rounded-lg border transition-all ${
                adminConfig.features[feature.key]
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-gray-800/30 border-gray-700/30 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{feature.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-white">{feature.label}</div>
                    <div className="text-[9px] text-gray-400">{feature.desc}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleFeature(feature.key)}
                  className={`relative w-10 h-5 rounded-full transition-all ${
                    adminConfig.features[feature.key] ? 'bg-green-500' : 'bg-gray-700'
                  }`}
                >
                  <motion.div
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md"
                    animate={{ left: adminConfig.features[feature.key] ? '22px' : '2px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modules Section */}
      <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Integration Modules
          </div>
          <div className="text-xs text-gray-500">
            {enabledModulesCount}/{modules.length} active
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {modules.map((module) => (
            <motion.div
              key={module.key}
              layout
              className={`p-3 rounded-lg border transition-all ${
                adminConfig.modules[module.key]
                  ? 'bg-blue-500/10 border-blue-500/30'
                  : 'bg-gray-800/30 border-gray-700/30 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{module.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-white">{module.label}</div>
                    <div className="text-[9px] text-gray-400">{module.desc}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleModule(module.key)}
                  className={`relative w-10 h-5 rounded-full transition-all ${
                    adminConfig.modules[module.key] ? 'bg-blue-500' : 'bg-gray-700'
                  }`}
                >
                  <motion.div
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md"
                    animate={{ left: adminConfig.modules[module.key] ? '22px' : '2px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Security Settings
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-800/30 border border-gray-700/30">
            <div>
              <div className="text-xs font-bold text-white">Login Required</div>
              <div className="text-[9px] text-gray-400">Require authentication to access</div>
            </div>
            <button
              onClick={() => {
                updateSecurity({ loginRequired: !adminConfig.security.loginRequired });
                addLog({ 
                  type: 'system', 
                  message: `${!adminConfig.security.loginRequired ? '🔒 Enabled' : '🔓 Disabled'} login requirement` 
                });
              }}
              className={`relative w-10 h-5 rounded-full transition-all ${
                adminConfig.security.loginRequired ? 'bg-purple-500' : 'bg-gray-700'
              }`}
            >
              <motion.div
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md"
                animate={{ left: adminConfig.security.loginRequired ? '22px' : '2px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-800/30 border border-gray-700/30">
            <div>
              <div className="text-xs font-bold text-white">Captcha Protection</div>
              <div className="text-[9px] text-gray-400">Image captcha for login security</div>
            </div>
            <button
              onClick={() => {
                updateSecurity({ captchaEnabled: !adminConfig.security.captchaEnabled });
                addLog({ 
                  type: 'system', 
                  message: `${!adminConfig.security.captchaEnabled ? '🔒 Enabled' : '🔓 Disabled'} captcha` 
                });
              }}
              className={`relative w-10 h-5 rounded-full transition-all ${
                adminConfig.security.captchaEnabled ? 'bg-purple-500' : 'bg-gray-700'
              }`}
            >
              <motion.div
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md"
                animate={{ left: adminConfig.security.captchaEnabled ? '22px' : '2px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-800/30 border border-gray-700/30">
            <div>
              <div className="text-xs font-bold text-white">Two-Factor Authentication</div>
              <div className="text-[9px] text-gray-400">Additional security layer</div>
            </div>
            <button
              onClick={() => {
                updateSecurity({ twoFactorAuth: !adminConfig.security.twoFactorAuth });
                addLog({ 
                  type: 'system', 
                  message: `${!adminConfig.security.twoFactorAuth ? '🔒 Enabled' : '🔓 Disabled'} 2FA` 
                });
              }}
              className={`relative w-10 h-5 rounded-full transition-all ${
                adminConfig.security.twoFactorAuth ? 'bg-purple-500' : 'bg-gray-700'
              }`}
            >
              <motion.div
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md"
                animate={{ left: adminConfig.security.twoFactorAuth ? '22px' : '2px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          <div className="p-2 rounded-lg bg-gray-800/30 border border-gray-700/30">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-xs font-bold text-white">Session Timeout</div>
                <div className="text-[9px] text-gray-400">Auto-logout after inactivity</div>
              </div>
              <span className="text-xs font-mono text-purple-400">
                {adminConfig.security.sessionTimeout / 60} min
              </span>
            </div>
            <input
              type="range"
              min={300}
              max={7200}
              step={300}
              value={adminConfig.security.sessionTimeout}
              onChange={(e) => {
                updateSecurity({ sessionTimeout: Number(e.target.value) });
              }}
              className="w-full h-1.5 rounded-full bg-gray-700 accent-purple-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          System Status
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
            <div className="text-2xl font-bold text-green-400">{enabledFeaturesCount}</div>
            <div className="text-[10px] text-gray-400">Features Active</div>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-center">
            <div className="text-2xl font-bold text-blue-400">{enabledModulesCount}</div>
            <div className="text-[10px] text-gray-400">Modules Active</div>
          </div>
          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {adminConfig.security.loginRequired && adminConfig.security.captchaEnabled ? '🔒' : '🔓'}
            </div>
            <div className="text-[10px] text-gray-400">Security Level</div>
          </div>
        </div>
      </div>
    </div>
  );
}
