import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShibaiAvatar from './ShibaiAvatar';
import ControlPanel from './ControlPanel';
import SettingsPanel from './SettingsPanel';
import TradingChart from './TradingChart';
import { ActivityLog, StatsDashboard, SimulationEngine, ChatAI, VoiceControl, PromptLibrary } from './Panels';
import { useTradingStore } from '../store/tradingStore';

export default function TradingWidget() {
  const [showSettings, setShowSettings] = useState(false);
  const { status, activePanel, setActivePanel } = useTradingStore();

  const panels = [
    { id: 'chart' as const, label: 'Chart', icon: '📊' },
    { id: 'prompts' as const, label: 'Prompts', icon: '📚' },
    { id: 'chat' as const, label: 'Chat', icon: '💬' },
    { id: 'voice' as const, label: 'Voice', icon: '🎤' },
    { id: 'simulation' as const, label: 'Sim', icon: '🔬' },
    { id: 'dashboard' as const, label: 'Stats', icon: '📈' },
    { id: 'logs' as const, label: 'Logs', icon: '📋' },
  ];

  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(145deg, rgba(15, 10, 46, 0.97), rgba(10, 5, 30, 0.99))', border: '1px solid rgba(147, 51, 234, 0.2)', boxShadow: '0 0 60px rgba(147, 51, 234, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="relative px-4 pt-3 pb-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div className="w-2 h-2 rounded-full bg-purple-500" animate={status === 'running' ? { opacity: [1, 0.3, 1] } : {}} transition={{ duration: 1, repeat: Infinity }} />
              <h1 className="text-sm font-bold text-white tracking-wide">PJ.BOT <span className="text-purple-400">AI Agent</span></h1>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">v2.0</span>
            </div>
            <button onClick={() => setShowSettings(!showSettings)} className={`p-1.5 rounded-lg transition-all ${showSettings ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'}`}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m-7-7h6m6 0h6"/></svg>
            </button>
          </div>
          <p className="text-[9px] text-gray-600 mt-0.5 ml-4">Multi-Routing Neural Engine • 6 Markets • MT5 • API Gateway</p>
        </div>

        <ShibaiAvatar />

        <div className="px-3 pb-3 space-y-2.5">
          <ControlPanel />

          <AnimatePresence>
            {showSettings && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="pt-2 border-t border-gray-800/50">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-500" />Agent Configuration</h3>
                  <SettingsPanel />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-0.5 p-0.5 bg-gray-900/50 rounded-lg border border-gray-800/50 overflow-x-auto custom-scrollbar">
            {panels.map((panel) => (<button key={panel.id} onClick={() => setActivePanel(panel.id)} className={`flex-1 flex-shrink-0 px-2 py-1.5 rounded-md text-[10px] font-medium transition-all ${activePanel === panel.id ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-gray-500 hover:text-gray-300'}`}>{panel.icon} {panel.label}</button>))}
          </div>

          <AnimatePresence mode="wait">
            {activePanel === 'chart' && <motion.div key="chart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><TradingChart /></motion.div>}
            {activePanel === 'prompts' && <motion.div key="prompts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PromptLibrary /></motion.div>}
            {activePanel === 'chat' && <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ChatAI /></motion.div>}
            {activePanel === 'voice' && <motion.div key="voice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><VoiceControl /></motion.div>}
            {activePanel === 'simulation' && <motion.div key="simulation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><SimulationEngine /></motion.div>}
            {activePanel === 'dashboard' && <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><StatsDashboard /></motion.div>}
            {activePanel === 'logs' && <motion.div key="logs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ActivityLog /></motion.div>}
          </AnimatePresence>
        </div>

        <div className="px-4 py-1.5 border-t border-gray-800/30 bg-gray-900/20">
          <div className="flex items-center justify-between text-[8px] text-gray-600">
            <span>Multi-Routing AI • 3 Sub-Agents</span>
            <span className="flex items-center gap-1"><span className={`w-1.5 h-1.5 rounded-full ${status === 'running' ? 'bg-green-500 animate-pulse' : status === 'simulating' ? 'bg-blue-500 animate-pulse' : status === 'killed' ? 'bg-red-500' : 'bg-gray-600'}`} />{status === 'running' ? 'Live' : status === 'simulating' ? 'Simulating' : status === 'killed' ? 'Terminated' : status === 'paused' ? 'Paused' : 'Standby'}</span>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-purple-500/20 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-purple-500/20 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-purple-500/20 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-500/20 rounded-br-2xl" />
      </motion.div>
    </div>
  );
}
