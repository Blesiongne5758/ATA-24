import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CuteRobotAvatar from './CuteRobotAvatar';
import ControlPanel from './ControlPanel';
import SettingsPanel from './SettingsPanel';
import ActivityLog from './ActivityLog';
import StatsDashboard from './StatsDashboard';

// ============================================================
// MAIN TRADING WIDGET COMPONENT
// Features: Embeddable widget with glassmorphism design,
// dark mode, neon accents, and all sub-components
// ============================================================

export default function TradingWidget() {
  const [showSettings, setShowSettings] = useState(false);
  const [activeSection, setActiveSection] = useState<'dashboard' | 'logs'>('dashboard');

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Widget Container - Glassmorphism */}
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(15, 10, 46, 0.95), rgba(10, 5, 30, 0.98))',
          border: '1px solid rgba(147, 51, 234, 0.2)',
          boxShadow: '0 0 60px rgba(147, 51, 234, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="relative px-4 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <h1 className="text-sm font-bold text-white tracking-wide">
                PJ.BOT <span className="text-purple-400">AI Agent</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-lg transition-all ${
                  showSettings 
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5 ml-4">Multi-Routing Neural Trading Engine v2.0</p>
        </div>

        {/* Robot Avatar Section */}
        <CuteRobotAvatar />

        {/* Content Area */}
        <div className="px-4 pb-4 space-y-3">
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
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Agent Configuration
                  </h3>
                  <SettingsPanel />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section Toggle */}
          <div className="flex gap-1 p-0.5 bg-gray-900/50 rounded-lg border border-gray-800/50">
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeSection === 'dashboard'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              📈 Dashboard
            </button>
            <button
              onClick={() => setActiveSection('logs')}
              className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeSection === 'logs'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              📋 Activity Log
            </button>
          </div>

          {/* Dashboard or Logs */}
          <AnimatePresence mode="wait">
            {activeSection === 'dashboard' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <StatsDashboard />
              </motion.div>
            ) : (
              <motion.div
                key="logs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ActivityLog />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-800/30 bg-gray-900/20">
          <div className="flex items-center justify-between text-[9px] text-gray-600">
            <span>Powered by Multi-Routing AI Architecture</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              System Online
            </span>
          </div>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-500/30 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-purple-500/30 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-purple-500/30 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple-500/30 rounded-br-2xl" />
      </motion.div>
    </div>
  );
}
