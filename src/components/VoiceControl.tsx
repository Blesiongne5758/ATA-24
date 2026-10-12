import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTradingStore } from '../store/tradingStore';

// ============================================================
// VOICE CONTROL COMPONENT
// Features: Voice commands, waveform visualization, settings
// ============================================================

export default function VoiceControl() {
  const { addLog, status, marketConfig } = useTradingStore();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [waveform, setWaveform] = useState<number[]>(Array(20).fill(0));

  // Simulate voice recognition
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        // Simulate waveform animation
        setWaveform(Array(20).fill(0).map(() => Math.random() * 100));
      }, 100);

      // Simulate voice command after 3-5 seconds
      const timeout = setTimeout(() => {
        const commands = [
          'analyze bitcoin',
          'show trading signals',
          'open long position',
          'close all positions',
          'market overview',
          'agent status',
        ];
        const randomCommand = commands[Math.floor(Math.random() * commands.length)];
        setTranscript(randomCommand);
        setIsListening(false);
        setWaveform(Array(20).fill(0));
        
        addLog({ type: 'ai', message: `🎤 Voice Command: "${randomCommand}"` });
      }, 3000 + Math.random() * 2000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      setWaveform(Array(20).fill(0));
    }
  }, [isListening]);

  const toggleListening = () => {
    if (!voiceEnabled) {
      addLog({ type: 'warning', message: '⚠️ Voice control is disabled in settings' });
      return;
    }
    
    setIsListening(!isListening);
    setTranscript('');
    
    if (!isListening) {
      addLog({ type: 'info', message: '🎤 Voice recognition started...' });
    } else {
      addLog({ type: 'info', message: '🎤 Voice recognition stopped' });
    }
  };

  const voiceCommands = [
    { command: 'Analyze BTC', icon: '📊' },
    { command: 'Show signals', icon: '🎯' },
    { command: 'Market overview', icon: '🌍' },
    { command: 'Risk report', icon: '⚠️' },
    { command: 'Agent status', icon: '📡' },
    { command: 'Open position', icon: '💰' },
  ];

  return (
    <div className="bg-gray-900/30 border border-gray-800/50 rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <span className="text-sm">🎤</span>
          </div>
          <div>
            <div className="text-sm font-bold text-white">Voice Control</div>
            <div className={`text-[10px] ${voiceEnabled ? 'text-green-400' : 'text-gray-500'}`}>
              {voiceEnabled ? 'Enabled' : 'Disabled'}
            </div>
          </div>
        </div>
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`relative w-10 h-5 rounded-full transition-all ${
            voiceEnabled ? 'bg-green-500' : 'bg-gray-700'
          }`}
        >
          <motion.div
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md"
            animate={{ left: voiceEnabled ? '22px' : '2px' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      {/* Microphone Button */}
      <div className="flex flex-col items-center gap-3">
        <motion.button
          onClick={toggleListening}
          disabled={!voiceEnabled}
          whileTap={{ scale: 0.95 }}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all ${
            isListening
              ? 'bg-red-500/20 border-2 border-red-500'
              : voiceEnabled
              ? 'bg-blue-500/20 border-2 border-blue-500/50 hover:bg-blue-500/30'
              : 'bg-gray-800/50 border-2 border-gray-700 cursor-not-allowed opacity-50'
          }`}
        >
          {/* Pulse rings when listening */}
          {isListening && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-red-500"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-red-500"
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}
          
          <span className="text-3xl">
            {isListening ? '🔴' : '🎤'}
          </span>
        </motion.button>

        <div className="text-center">
          <div className={`text-xs font-medium ${isListening ? 'text-red-400' : 'text-gray-400'}`}>
            {isListening ? 'Listening...' : 'Tap to speak'}
          </div>
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] text-gray-500 mt-1"
            >
              "{transcript}"
            </motion.div>
          )}
        </div>
      </div>

      {/* Waveform Visualization */}
      <div className="h-12 flex items-center justify-center gap-0.5">
        {waveform.map((height, idx) => (
          <motion.div
            key={idx}
            className="w-1 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-full"
            animate={{
              height: isListening ? `${Math.max(10, height)}%` : '10%',
            }}
            transition={{ duration: 0.1 }}
          />
        ))}
      </div>

      {/* Quick Voice Commands */}
      <div className="space-y-2">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider">Quick Commands</div>
        <div className="grid grid-cols-3 gap-2">
          {voiceCommands.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTranscript(cmd.command.toLowerCase());
                addLog({ type: 'ai', message: `🎤 Voice: "${cmd.command}"` });
              }}
              disabled={!voiceEnabled}
              className="px-2 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-[10px] text-gray-300 hover:bg-blue-500/20 hover:border-blue-500/30 hover:text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <div className="text-sm mb-0.5">{cmd.icon}</div>
              <div>{cmd.command}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Status Info */}
      <div className="pt-2 border-t border-gray-800/30">
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <div className="flex justify-between">
            <span className="text-gray-500">Status:</span>
            <span className={isListening ? 'text-red-400' : 'text-gray-300'}>
              {isListening ? 'Active' : 'Idle'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Language:</span>
            <span className="text-gray-300">English</span>
          </div>
        </div>
      </div>
    </div>
  );
}
