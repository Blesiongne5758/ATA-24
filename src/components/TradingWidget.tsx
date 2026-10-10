import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CuteRobotAvatar from './CuteRobotAvatar';
import ControlPanel from './ControlPanel';
import SettingsPanel from './SettingsPanel';
import ActivityLog from './ActivityLog';
import StatsDashboard from './StatsDashboard';
import TradingChart from './TradingChart';
import SimulationEngine from './SimulationEngine';
import { useTradingStore } from '../store/tradingStore';

// ============================================================
// MAIN TRADING WIDGET COMPONENT - v2.0
// Features: Chart, Controls, Settings (9 tabs), Simulation, Logs
// ============================================================

export default function TradingWidget() {
  const [showSettings, setShowSettings] = useState(false);
  const { status, activePanel, setActivePanel, simulation } = useTradingStore();

  const panels = [
    { id: 'chart' as const, label: 'Chart', icon: '📊' },
    { id: 'simulation' as const, label: 'Sim', icon: '🔬' },
    { id: 'dashboard' as const, label: 'Stats', icon: '📈' },
    { id: 'logs' as const, label: 'Logs', icon: '📋' },
  ];

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Main Widget Container - Glassmorphism */}
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(15, 10, 46, 0.97), rgba(10, 5, 30, 0.99))',
          border: '1px solid rgba(147, 51, 234, 0.2)',
          boxShadow: '0 0 60px rgba(147, 51, 234, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="relative px-4 pt-3 pb-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-2 h-2 rounded-full bg-purple-500"
                animate={status === 'running' ? { opacity: [1, 0.3, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <h1 className="text-sm font-bold text-white tracking-wide">
                PJ.BOT <span className="text-purple-400">AI Agent</span>
              </h1>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">v2.0</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-lg transition-all ${
                  showSettings 
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>
          <p className="text-[9px] text-gray-600 mt-0.5 ml-4">Multi-Routing Neural Trading Engine • 6 Markets • 9 Config Tabs</p>
        </div>

        {/* Robot Avatar Section */}
        <CuteRobotAvatar />

        {/* Content Area */}
        <div className="px-3 pb-3 space-y-2.5">
          {/* Control Panel */}
          <ControlPanel />

          {/* Settings Panel (Collapsible) */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-2 border-t border-gray-800/50">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Agent Configuration
                  </h3>
                  <SettingsPanel />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Panel Navigation */}
          <div className="flex gap-0.5 p-0.5 bg-gray-900/50 rounded-lg border border-gray-800/50">
            {panels.map((panel) => (
              <button
                key={panel.id}
                onClick={() => setActivePanel(panel.id)}
                className={`flex-1 px-2 py-1.5 rounded-md text-[10px] font-medium transition-all ${
                  activePanel === panel.id
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {panel.icon} {panel.label}
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <AnimatePresence mode="wait">
            {activePanel === 'chart' && (
              <motion.div key="chart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <TradingChart />
              </motion.div>
            )}
            {activePanel === 'simulation' && (
              <motion.div key="simulation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SimulationEngine />
              </motion.div>
            )}
            {activePanel === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <StatsDashboard />
              </motion.div>
            )}
            {activePanel === 'logs' && (
              <motion.div key="logs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ActivityLog />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-4 py-1.5 border-t border-gray-800/30 bg-gray-900/20">
          <div className="flex items-center justify-between text-[8px] text-gray-600">
            <span>Multi-Routing AI Architecture • 3 Sub-Agents</span>
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${
                status === 'running' ? 'bg-green-500 animate-pulse' :
                status === 'simulating' ? 'bg-blue-500 animate-pulse' :
                status === 'killed' ? 'bg-red-500' : 'bg-gray-600'
              }`} />
              {status === 'running' ? 'Trading Live' :
               status === 'simulating' ? 'Simulating...' :
               status === 'killed' ? 'Terminated' :
               status === 'paused' ? 'Paused' : 'Standby'}
            </span>
          </div>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-purple-500/20 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-purple-500/20 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-purple-500/20 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-500/20 rounded-br-2xl" />
      </motion.div>
    </div>
  );
}
