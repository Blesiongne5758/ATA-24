import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTradingStore } from '../store/tradingStore';

// ============================================================
// AI CHAT COMPONENT
// Features: Chat with AI assistant, quick actions, chat history
// ============================================================

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  action?: {
    type: 'trade' | 'analysis' | 'info';
    data?: any;
  };
}

export default function ChatAI() {
  const { addLog, status, marketConfig } = useTradingStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Hello! I\'m your AI Trading Assistant. I can help you analyze markets, execute trades, and provide insights. How can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { label: '📊 Analyze BTC', command: 'analyze BTC' },
    { label: '📈 Market Overview', command: 'market overview' },
    { label: '💡 Trading Signals', command: 'show signals' },
    { label: '⚠️ Risk Report', command: 'risk report' },
  ];

  const handleSend = (message?: string) => {
    const text = message || input;
    if (!text.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateAIResponse(text);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        action: response.action,
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      // Log the interaction
      addLog({ type: 'ai', message: `💬 Chat: ${text.substring(0, 50)}...` });
    }, 1000 + Math.random() * 1000);
  };

  const generateAIResponse = (userInput: string): { content: string; action?: any } => {
    const lower = userInput.toLowerCase();

    if (lower.includes('analyze') || lower.includes('analysis')) {
      return {
        content: `📊 **Market Analysis for ${marketConfig.pair}**\n\n` +
          `**Technical Indicators:**\n` +
          `• RSI (14): ${45 + Math.random() * 20} - Neutral zone\n` +
          `• MACD: Bullish crossover detected\n` +
          `• EMA 9/21: Price above both EMAs (uptrend)\n` +
          `• Bollinger Bands: Near middle band\n\n` +
          `**AI Confidence:** ${(75 + Math.random() * 20).toFixed(1)}%\n` +
          `**Recommendation:** ${Math.random() > 0.5 ? '🟢 BUY' : '⚪ HOLD'}`,
        action: { type: 'analysis' },
      };
    }

    if (lower.includes('signal') || lower.includes('trade')) {
      return {
        content: `🎯 **Current Trading Signals**\n\n` +
          `**Active Signals:**\n` +
          `1. 🟢 BTC/USDT - LONG @ $${(67000 + Math.random() * 1000).toFixed(0)}\n` +
          `   Confidence: ${(80 + Math.random() * 15).toFixed(1)}%\n` +
          `   Target: +${(2 + Math.random() * 3).toFixed(1)}%\n\n` +
          `2. 🔴 ETH/USDT - SHORT @ $${(3500 + Math.random() * 100).toFixed(0)}\n` +
          `   Confidence: ${(70 + Math.random() * 20).toFixed(1)}%\n` +
          `   Target: -${(1.5 + Math.random() * 2).toFixed(1)}%\n\n` +
          `**Market Sentiment:** ${Math.random() > 0.5 ? 'Bullish 📈' : 'Bearish 📉'}`,
        action: { type: 'trade' },
      };
    }

    if (lower.includes('risk') || lower.includes('portfolio')) {
      return {
        content: `⚠️ **Risk Management Report**\n\n` +
          `**Current Exposure:**\n` +
          `• Open Positions: 2/3\n` +
          `• Total Risk: 4.5% of balance\n` +
          `• Daily P&L: +$${(Math.random() * 200).toFixed(2)}\n\n` +
          `**Risk Metrics:**\n` +
          `• Max Drawdown: ${(-2 - Math.random() * 3).toFixed(1)}%\n` +
          `• Sharpe Ratio: ${(1.5 + Math.random()).toFixed(2)}\n` +
          `• Win Rate: ${(55 + Math.random() * 20).toFixed(1)}%\n\n` +
          `**Status:** ✅ Within safe limits`,
        action: { type: 'info' },
      };
    }

    if (lower.includes('market') || lower.includes('overview')) {
      return {
        content: `🌍 **Market Overview**\n\n` +
          `**Crypto Market:**\n` +
          `• BTC: $${(67000 + Math.random() * 1000).toFixed(0)} (${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 3).toFixed(2)}%)\n` +
          `• ETH: $${(3500 + Math.random() * 100).toFixed(0)} (${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 4).toFixed(2)}%)\n` +
          `• SOL: $${(140 + Math.random() * 20).toFixed(0)} (${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 5).toFixed(2)}%)\n\n` +
          `**Market Sentiment:** ${Math.random() > 0.5 ? '🟢 Bullish' : '🔴 Bearish'}\n` +
          `**Fear & Greed Index:** ${Math.floor(40 + Math.random() * 40)}\n` +
          `**24h Volume:** $${(50 + Math.random() * 50).toFixed(1)}B`,
        action: { type: 'info' },
      };
    }

    if (lower.includes('help') || lower.includes('what can you do')) {
      return {
        content: `🤖 **I can help you with:**\n\n` +
          `• **Market Analysis** - "Analyze BTC"\n` +
          `• **Trading Signals** - "Show signals"\n` +
          `• **Risk Reports** - "Risk report"\n` +
          `• **Market Overview** - "Market overview"\n` +
          `• **Execute Trades** - "Open long position"\n` +
          `• **Close Positions** - "Close all positions"\n` +
          `• **Agent Status** - "Agent status"\n\n` +
          `You can also use the quick action buttons below!`,
        action: { type: 'info' },
      };
    }

    if (lower.includes('status') || lower.includes('agent')) {
      return {
        content: `📡 **Agent Status**\n\n` +
          `**Current State:** ${status.toUpperCase()}\n` +
          `**Active Market:** ${marketConfig.pair}\n` +
          `**Time Frame:** ${marketConfig.timeFrame}\n` +
          `**Leverage:** ${marketConfig.leverage}x\n\n` +
          `**Sub-Agents:**\n` +
          `• Technical: ✅ Active\n` +
          `• Sentiment: ✅ Active\n` +
          `• On-Chain: ✅ Active\n\n` +
          `**Last Update:** Just now`,
        action: { type: 'info' },
      };
    }

    // Default response
    return {
      content: `I understand you're asking about "${userInput}". I can help you with market analysis, trading signals, risk reports, and more. Try asking me to "analyze BTC" or "show signals"!`,
      action: { type: 'info' },
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-gray-900/30 border border-gray-800/50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800/50 bg-gray-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-sm">🤖</span>
            </div>
            <div>
              <div className="text-sm font-bold text-white">AI Trading Assistant</div>
              <div className="text-[10px] text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Online
              </div>
            </div>
          </div>
          <button
            onClick={() => setMessages([messages[0]])}
            className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  msg.role === 'user'
                    ? 'bg-purple-500/20 border border-purple-500/30 text-purple-100'
                    : msg.role === 'assistant'
                    ? 'bg-gray-800/50 border border-gray-700/50 text-gray-200'
                    : 'bg-blue-500/10 border border-blue-500/20 text-blue-200'
                }`}
              >
                <div className="text-xs whitespace-pre-wrap">{msg.content}</div>
                <div className="text-[9px] text-gray-500 mt-1">
                  {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2">
              <div className="flex gap-1">
                <motion.div
                  className="w-2 h-2 rounded-full bg-gray-400"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-gray-400"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-gray-400"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-gray-800/50 bg-gray-900/30">
        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(action.command)}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700/50 text-[10px] text-gray-300 hover:bg-purple-500/20 hover:border-purple-500/30 hover:text-purple-300 transition-all"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-800/50 bg-gray-900/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about trading..."
            className="flex-1 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-xs text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-medium hover:bg-purple-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
