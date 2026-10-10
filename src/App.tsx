import { useState } from 'react';

type Section = 'overview' | 'architecture' | 'components' | 'ai-types' | 'strategies' | 'ml-models' | 'data' | 'risk' | 'backtesting' | 'deployment' | 'multi-agent' | 'integration' | 'security' | 'challenges' | 'trends';

const sections: { id: Section; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: '📖' },
  { id: 'architecture', label: 'Arsitektur', icon: '🏗️' },
  { id: 'components', label: 'Komponen', icon: '🔧' },
  { id: 'ai-types', label: 'Jenis AI', icon: '🧠' },
  { id: 'strategies', label: 'Strategi', icon: '📊' },
  { id: 'ml-models', label: 'ML Models', icon: '🤖' },
  { id: 'data', label: 'Data & Fitur', icon: '📈' },
  { id: 'risk', label: 'Risk Mgmt', icon: '🛡️' },
  { id: 'backtesting', label: 'Backtesting', icon: '📋' },
  { id: 'deployment', label: 'Deployment', icon: '🚀' },
  { id: 'multi-agent', label: 'Multi-Agent', icon: '🤝' },
  { id: 'integration', label: 'Integrasi', icon: '🔌' },
  { id: 'security', label: 'Keamanan', icon: '🔒' },
  { id: 'challenges', label: 'Tantangan', icon: '⚠️' },
  { id: 'trends', label: 'Future', icon: '🔮' },
];

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e1a]/90 backdrop-blur-xl border-b border-cyan-900/30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-cyan-900/20 hover:bg-cyan-900/40 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-black shadow-lg shadow-cyan-500/30">
              🤖
            </div>
            <div>
              <h1 className="text-lg font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Trading Agent
              </h1>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase">Rangkuman Lengkap & Komprehensif</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/20">
              ● Live Documentation
            </span>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-[#0d1220]/95 backdrop-blur-xl border-r border-cyan-900/20 overflow-y-auto transition-transform z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <nav className="p-3 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => { setActiveSection(section.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/5'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-base">{section.icon}</span>
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)] p-4 md:p-8 lg:p-12 max-w-5xl">
          {activeSection === 'overview' && <OverviewSection />}
          {activeSection === 'architecture' && <ArchitectureSection />}
          {activeSection === 'components' && <ComponentsSection />}
          {activeSection === 'ai-types' && <AITypesSection />}
          {activeSection === 'strategies' && <StrategiesSection />}
          {activeSection === 'ml-models' && <MLModelsSection />}
          {activeSection === 'data' && <DataSection />}
          {activeSection === 'risk' && <RiskSection />}
          {activeSection === 'backtesting' && <BacktestingSection />}
          {activeSection === 'deployment' && <DeploymentSection />}
          {activeSection === 'multi-agent' && <MultiAgentSection />}
          {activeSection === 'integration' && <IntegrationSection />}
          {activeSection === 'security' && <SecuritySection />}
          {activeSection === 'challenges' && <ChallengesSection />}
          {activeSection === 'trends' && <TrendsSection />}
        </main>
      </div>
    </div>
  );
}

// Section Components

function OverviewSection() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          📖 Pengertian AI Trading Agent
        </h2>
        <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-2xl p-6 border border-cyan-500/20">
          <p className="text-gray-300 text-lg leading-relaxed">
            <strong className="text-cyan-300">AI Trading Agent</strong> adalah sistem perangkat lunak berbasis kecerdasan buatan (Artificial Intelligence) yang dirancang untuk melakukan analisis pasar keuangan dan mengeksekusi perdagangan (trading) secara otomatis tanpa intervensi manusia secara langsung.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">✨ Karakteristik Utama</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '🎯', title: 'Otonom', desc: 'Mampu membuat keputusan trading secara mandiri' },
            { icon: '🔄', title: 'Adaptif', desc: 'Menyesuaikan diri dengan kondisi pasar yang berubah' },
            { icon: '⚡', title: 'Real-time', desc: 'Memproses data dan mengeksekusi order dalam milidetik' },
            { icon: '📊', title: 'Data-driven', desc: 'Keputusan berdasarkan analisis data kuantitatif' },
            { icon: '🌐', title: 'Multi-aset', desc: 'Dapat trading di berbagai instrumen (saham, forex, crypto, komoditas)' },
          ].map((item, i) => (
            <div key={i} className="bg-[#111827] rounded-xl p-4 border border-gray-800 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h4 className="font-bold text-white">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">📊 Perbedaan dengan Trading Bot Konvensional</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-cyan-400">Aspek</th>
                <th className="text-left py-3 px-4 text-gray-400">Trading Bot Biasa</th>
                <th className="text-left py-3 px-4 text-green-400">AI Trading Agent</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Keputusan', 'Rule-based (IF-THEN)', 'Adaptive & Learning'],
                ['Adaptasi', 'Statis', 'Dinamis'],
                ['Analisis', 'Teknikal sederhana', 'Multi-dimensional'],
                ['Risk Mgmt', 'Fixed rules', 'Dynamic optimization'],
                ['Learning', 'Tidak ada', 'Continuous learning'],
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-800/50 hover:bg-white/5">
                  <td className="py-3 px-4 font-medium text-white">{row[0]}</td>
                  <td className="py-3 px-4 text-gray-400">{row[1]}</td>
                  <td className="py-3 px-4 text-green-300">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl p-6 border border-purple-500/20">
        <h3 className="text-lg font-bold text-purple-300 mb-3">🎯 Kesimpulan</h3>
        <p className="text-gray-300 leading-relaxed">
          AI Trading Agent merupakan evolusi dari trading otomatis tradisional. Dengan kemampuan belajar dan adaptasi, sistem ini menawarkan keputusan berbasis data (bukan emosi), eksekusi 24/7, analisis multi-dimensional real-time, risk management dinamis, dan kemampuan memproses informasi dalam volume besar.
        </p>
      </div>
    </div>
  );
}

function ArchitectureSection() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        🏗️ Arsitektur Sistem
      </h2>

      <div className="bg-[#111827] rounded-2xl p-6 border border-gray-800">
        <h3 className="text-lg font-bold text-white mb-4">Diagram Alur Sistem</h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-6">
          {[
            { label: 'Data\nIngestion', color: 'from-blue-500 to-cyan-500', icon: '📥' },
            { label: 'AI\nEngine', color: 'from-purple-500 to-pink-500', icon: '🧠' },
            { label: 'Risk\nManager', color: 'from-orange-500 to-red-500', icon: '🛡️' },
            { label: 'Execution\nEngine', color: 'from-green-500 to-emerald-500', icon: '⚡' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className={`bg-gradient-to-br ${item.color} rounded-xl p-4 text-center min-w-[120px] shadow-lg`}>
                <span className="text-2xl block mb-1">{item.icon}</span>
                <span className="text-xs font-bold text-white whitespace-pre-line">{item.label}</span>
              </div>
              {i < 3 && <span className="text-cyan-400 text-2xl hidden md:block">→</span>}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Layer Arsitektur</h3>
        <div className="space-y-3">
          {[
            { layer: 'Data Layer', desc: 'Pengumpulan dan penyimpanan data pasar', icon: '💾', color: 'border-blue-500/30 bg-blue-500/5' },
            { layer: 'Processing Layer', desc: 'Preprocessing dan feature engineering', icon: '⚙️', color: 'border-purple-500/30 bg-purple-500/5' },
            { layer: 'AI/ML Layer', desc: 'Model inference dan signal generation', icon: '🧠', color: 'border-pink-500/30 bg-pink-500/5' },
            { layer: 'Risk Layer', desc: 'Manajemen risiko dan position sizing', icon: '🛡️', color: 'border-orange-500/30 bg-orange-500/5' },
            { layer: 'Execution Layer', desc: 'Order routing dan trade execution', icon: '⚡', color: 'border-green-500/30 bg-green-500/5' },
            { layer: 'Monitoring Layer', desc: 'Logging, alerting, dan performance tracking', icon: '📊', color: 'border-cyan-500/30 bg-cyan-500/5' },
          ].map((item, i) => (
            <div key={i} className={`rounded-xl p-4 border ${item.color} flex items-center gap-4`}>
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h4 className="font-bold text-white">{item.layer}</h4>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComponentsSection() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        🔧 Komponen Utama
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            title: '1. Data Ingestion Module',
            icon: '📥',
            items: ['Market Data Feed (tick, OHLCV)', 'Alternative Data (sentiment, news)', 'Fundamental Data (financial statements)', 'On-chain Data (wallet, DEX volumes)'],
            color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'
          },
          {
            title: '2. AI/ML Engine',
            icon: '🧠',
            items: ['Prediction Models (harga, arah, volatilitas)', 'Signal Generator (buy/sell/hold)', 'Pattern Recognition (candlestick, chart)', 'Sentiment Analysis (NLP)'],
            color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30'
          },
          {
            title: '3. Risk Management Module',
            icon: '🛡️',
            items: ['Position Sizing (Kelly Criterion)', 'Dynamic Stop Loss/Take Profit', 'Portfolio Risk (VaR, CVaR)', 'Correlation Analysis'],
            color: 'from-orange-500/20 to-red-500/20 border-orange-500/30'
          },
          {
            title: '4. Execution Engine',
            icon: '⚡',
            items: ['Smart Order Routing', 'Slippage Control (TWAP, VWAP)', 'Latency Optimization', 'Order Management System'],
            color: 'from-green-500/20 to-emerald-500/20 border-green-500/30'
          },
          {
            title: '5. Backtesting Framework',
            icon: '📋',
            items: ['Historical Simulation', 'Walk-forward Analysis', 'Monte Carlo Simulation', 'Performance Metrics'],
            color: 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
          },
          {
            title: '6. Monitoring System',
            icon: '📊',
            items: ['System Health Monitoring', 'Trading Metrics Dashboard', 'Model Performance Tracking', 'Alert & Notification System'],
            color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30'
          },
        ].map((comp, i) => (
          <div key={i} className={`bg-gradient-to-br ${comp.color} rounded-2xl p-5 border`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{comp.icon}</span>
              <h3 className="font-bold text-white text-lg">{comp.title}</h3>
            </div>
            <ul className="space-y-2">
              {comp.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-cyan-400 mt-0.5">▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function AITypesSection() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        🧠 Jenis-Jenis AI dalam Trading
      </h2>

      <div className="space-y-6">
        {/* Machine Learning */}
        <div className="bg-[#111827] rounded-2xl p-6 border border-blue-500/20">
          <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
            <span>📐</span> 1. Machine Learning (ML)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-500/10">
              <h4 className="font-bold text-blue-200 text-sm mb-2">Supervised Learning</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Regression (Price Prediction)</li>
                <li>• Classification (Direction)</li>
                <li>• Time Series Forecasting</li>
              </ul>
            </div>
            <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/10">
              <h4 className="font-bold text-purple-200 text-sm mb-2">Unsupervised Learning</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Clustering (Regime Detection)</li>
                <li>• Anomaly Detection</li>
                <li>• Dimensionality Reduction</li>
              </ul>
            </div>
            <div className="bg-green-900/20 rounded-xl p-4 border border-green-500/10">
              <h4 className="font-bold text-green-200 text-sm mb-2">Reinforcement Learning</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Q-Learning / DQN</li>
                <li>• Policy Gradient (PPO, A2C)</li>
                <li>• Multi-Agent RL</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Deep Learning */}
        <div className="bg-[#111827] rounded-2xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
            <span>🔮</span> 2. Deep Learning
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { name: 'LSTM/GRU', desc: 'Sequential patterns' },
              { name: 'Transformer', desc: 'Attention-based' },
              { name: 'CNN', desc: 'Chart patterns' },
              { name: 'GAN', desc: 'Data generation' },
              { name: 'Autoencoder', desc: 'Feature extraction' },
            ].map((model, i) => (
              <div key={i} className="bg-purple-900/20 rounded-xl p-3 text-center border border-purple-500/10">
                <h4 className="font-bold text-purple-200 text-sm">{model.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{model.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* NLP */}
        <div className="bg-[#111827] rounded-2xl p-6 border border-green-500/20">
          <h3 className="text-xl font-bold text-green-300 mb-4 flex items-center gap-2">
            <span>💬</span> 3. Natural Language Processing (NLP)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Sentiment Analysis', desc: 'Analisis sentimen berita' },
              { name: 'NER', desc: 'Identifikasi entitas' },
              { name: 'Topic Modeling', desc: 'Deteksi tema pasar' },
              { name: 'LLM Integration', desc: 'GPT, Claude analysis' },
            ].map((item, i) => (
              <div key={i} className="bg-green-900/20 rounded-xl p-3 border border-green-500/10">
                <h4 className="font-bold text-green-200 text-sm">{item.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RL */}
        <div className="bg-[#111827] rounded-2xl p-6 border border-orange-500/20">
          <h3 className="text-xl font-bold text-orange-300 mb-4 flex items-center gap-2">
            <span>🎮</span> 4. Reinforcement Learning (RL)
          </h3>
          <div className="bg-orange-900/10 rounded-xl p-4 border border-orange-500/10">
            <ul className="text-sm text-gray-300 space-y-2">
              <li className="flex items-start gap-2"><span className="text-orange-400">▸</span> Agent belajar dari interaksi dengan environment pasar</li>
              <li className="flex items-start gap-2"><span className="text-orange-400">▸</span> <strong>Reward function:</strong> Profit, risk-adjusted return</li>
              <li className="flex items-start gap-2"><span className="text-orange-400">▸</span> <strong>State space:</strong> Market features, portfolio state</li>
              <li className="flex items-start gap-2"><span className="text-orange-400">▸</span> <strong>Action space:</strong> Buy, sell, hold, position size</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StrategiesSection() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        📊 Strategi Trading
      </h2>

      <div className="space-y-6">
        {[
          {
            title: 'Trend Following',
            icon: '📈',
            color: 'border-green-500/30',
            items: [
              { name: 'Moving Average Crossover', desc: 'SMA/EMA crossover signals' },
              { name: 'Momentum Strategy', desc: 'Relative strength, rate of change' },
              { name: 'Breakout Trading', desc: 'Support/resistance level breaks' },
              { name: 'AI Enhancement', desc: 'Adaptive MA periods, dynamic thresholds' },
            ]
          },
          {
            title: 'Mean Reversion',
            icon: '🔄',
            color: 'border-blue-500/30',
            items: [
              { name: 'Statistical Arbitrage', desc: 'Pairs trading, cointegration' },
              { name: 'Bollinger Band Strategy', desc: 'Oversold/overbought signals' },
              { name: 'Z-Score Trading', desc: 'Standard deviation based entries' },
              { name: 'AI Enhancement', desc: 'ML-based regime detection' },
            ]
          },
          {
            title: 'Market Making',
            icon: '💹',
            color: 'border-purple-500/30',
            items: [
              { name: 'Bid-Ask Spread Capture', desc: 'Profit from spread' },
              { name: 'Inventory Management', desc: 'Balanced position keeping' },
              { name: 'AI Enhancement', desc: 'Optimal quote placement via RL' },
            ]
          },
          {
            title: 'Sentiment-Based',
            icon: '💭',
            color: 'border-orange-500/30',
            items: [
              { name: 'News Trading', desc: 'React to breaking news' },
              { name: 'Social Media Analysis', desc: 'Twitter, Reddit sentiment' },
              { name: 'Earnings Reaction', desc: 'Post-earnings drift' },
              { name: 'AI Enhancement', desc: 'Real-time NLP processing' },
            ]
          },
          {
            title: 'Multi-Factor',
            icon: '🎯',
            color: 'border-cyan-500/30',
            items: [
              { name: 'Alpha Factor Combination', desc: 'Multiple signal sources' },
              { name: 'Factor Timing', desc: 'Dynamic weight adjustment' },
              { name: 'AI Enhancement', desc: 'Non-linear factor interaction modeling' },
            ]
          },
        ].map((strategy, i) => (
          <div key={i} className={`bg-[#111827] rounded-2xl p-6 border ${strategy.color}`}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">{strategy.icon}</span> {strategy.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {strategy.items.map((item, j) => (
                <div key={j} className="bg-white/5 rounded-lg p-3">
                  <h4 className="font-semibold text-sm text-white">{item.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MLModelsSection() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        🤖 Machine Learning Models
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-cyan-900/20">
              <th className="text-left py-3 px-4 text-cyan-300 font-bold rounded-tl-lg">Model</th>
              <th className="text-left py-3 px-4 text-cyan-300 font-bold">Use Case</th>
              <th className="text-left py-3 px-4 text-cyan-300 font-bold">Kelebihan</th>
              <th className="text-left py-3 px-4 text-cyan-300 font-bold rounded-tr-lg">Kekurangan</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['XGBoost/LightGBM', 'Tabular data', 'Fast, interpretable', 'Overfitting risk'],
              ['LSTM', 'Time series', 'Long dependencies', 'Slow training'],
              ['Transformer', 'Multi-modal', 'Parallel processing', 'Data hungry'],
              ['Random Forest', 'Classification', 'Robust', 'Less accurate'],
              ['SVM', 'Classification', 'High dimensions', 'Scaling issues'],
              ['PPO/SAC (RL)', 'Dynamic strategy', 'Adaptive', 'Complex training'],
              ['Bayesian', 'Uncertainty', 'Probabilistic', 'Complex setup'],
            ].map((row, i) => (
              <tr key={i} className="border-b border-gray-800/50 hover:bg-white/5">
                <td className="py-3 px-4 font-medium text-white">{row[0]}</td>
                <td className="py-3 px-4 text-gray-400">{row[1]}</td>
                <td className="py-3 px-4 text-green-300">{row[2]}</td>
                <td className="py-3 px-4 text-red-300">{row[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[#111827] rounded-2xl p-6 border border-purple-500/20">
        <h3 className="text-lg font-bold text-purple-300 mb-4">🔀 Model Ensemble</h3>
        <p className="text-gray-300 text-sm mb-4">
          Pendekatan ensemble menggabungkan beberapa model untuk meningkatkan akurasi prediksi dan mengurangi risiko overfitting.
        </p>
        <div className="bg-[#0a0e1a] rounded-xl p-4 font-mono text-xs text-green-300 overflow-x-auto">
          <pre>{`class TradingEnsemble:
    def __init__(self):
        self.models = [
            XGBoostModel(),      # weight: 0.30
            LSTMModel(),         # weight: 0.25
            TransformerModel(),  # weight: 0.25
            RLAgent()            # weight: 0.20
        ]
        self.weights = [0.3, 0.25, 0.25, 0.2]
    
    def predict(self, features):
        predictions = [m.predict(features) for m in self.models]
        return weighted_average(predictions, self.weights)`}</pre>
        </div>
      </div>
    </div>
  );
}

function DataSection() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        📈 Data & Feature Engineering
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111827] rounded-2xl p-5 border border-blue-500/20">
          <h3 className="text-lg font-bold text-blue-300 mb-3">📐 Fitur Teknikal</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2"><span className="text-blue-400">▸</span> Price Features: Returns, log returns, volatility</li>
            <li className="flex items-start gap-2"><span className="text-blue-400">▸</span> Volume Features: OBV, VWAP, volume profile</li>
            <li className="flex items-start gap-2"><span className="text-blue-400">▸</span> Momentum: RSI, MACD, Stochastic, ADX</li>
            <li className="flex items-start gap-2"><span className="text-blue-400">▸</span> Volatility: ATR, Bollinger Width, Hist. Vol</li>
            <li className="flex items-start gap-2"><span className="text-blue-400">▸</span> Trend: ADX, Aroon, Ichimoku</li>
          </ul>
        </div>

        <div className="bg-[#111827] rounded-2xl p-5 border border-green-500/20">
          <h3 className="text-lg font-bold text-green-300 mb-3">💰 Fitur Fundamental</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2"><span className="text-green-400">▸</span> Valuation: P/E, P/B, EV/EBITDA</li>
            <li className="flex items-start gap-2"><span className="text-green-400">▸</span> Growth: Revenue growth, earnings growth</li>
            <li className="flex items-start gap-2"><span className="text-green-400">▸</span> Quality: ROE, debt/equity, FCF</li>
            <li className="flex items-start gap-2"><span className="text-green-400">▸</span> Macro: Interest rates, inflation, GDP</li>
          </ul>
        </div>

        <div className="bg-[#111827] rounded-2xl p-5 border border-purple-500/20">
          <h3 className="text-lg font-bold text-purple-300 mb-3">🔮 Fitur Alternative</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2"><span className="text-purple-400">▸</span> Sentiment Scores: News, social media</li>
            <li className="flex items-start gap-2"><span className="text-purple-400">▸</span> Flow Data: Options flow, institutional</li>
            <li className="flex items-start gap-2"><span className="text-purple-400">▸</span> On-chain: Active addresses, exchange flows</li>
            <li className="flex items-start gap-2"><span className="text-purple-400">▸</span> Satellite Data: Traffic, shipping</li>
          </ul>
        </div>

        <div className="bg-[#111827] rounded-2xl p-5 border border-orange-500/20">
          <h3 className="text-lg font-bold text-orange-300 mb-3">⚙️ Feature Engineering Pipeline</h3>
          <div className="space-y-2 text-sm">
            {['Raw Data', 'Cleaning', 'Normalization', 'Feature Creation', 'Selection', 'Transformation', 'Model Input'].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-300 text-xs flex items-center justify-center font-bold">{i + 1}</span>
                <span className="text-gray-300">{step}</span>
                {i < 6 && <span className="text-orange-400">→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#111827] rounded-2xl p-5 border border-cyan-500/20">
        <h3 className="text-lg font-bold text-cyan-300 mb-3">🔑 Teknik Penting</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { name: 'Stationarity', desc: 'Differencing, log transform' },
            { name: 'Normalization', desc: 'Min-max, z-score, robust scaler' },
            { name: 'Lag Features', desc: 'Historical values as predictors' },
            { name: 'Rolling Statistics', desc: 'Moving windows of various sizes' },
            { name: 'Cross-sectional', desc: 'Relative ranking among assets' },
          ].map((tech, i) => (
            <div key={i} className="bg-cyan-900/10 rounded-lg p-3">
              <h4 className="font-semibold text-sm text-cyan-200">{tech.name}</h4>
              <p className="text-xs text-gray-400 mt-1">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RiskSection() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        🛡️ Risk Management
      </h2>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Position Sizing Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Fixed Fractional', formula: 'Size = (Account × Risk%) / Stop Loss', desc: 'Metode sederhana dan mudah diimplementasi' },
            { name: 'Kelly Criterion', formula: 'f* = (p×b - q) / b', desc: 'Optimal growth rate, p=win prob, b=win/loss ratio' },
            { name: 'Volatility-Based (ATR)', formula: 'Size = (Account × Risk%) / (ATR × Mult)', desc: 'Menyesuaikan dengan volatilitas pasar' },
            { name: 'Risk Parity', formula: 'W_i = (1/σ_i) / Σ(1/σ_j)', desc: 'Equal risk contribution per asset' },
          ].map((method, i) => (
            <div key={i} className="bg-[#111827] rounded-xl p-4 border border-orange-500/20">
              <h4 className="font-bold text-orange-300 text-sm mb-2">{method.name}</h4>
              <code className="text-xs text-green-300 bg-green-900/20 px-2 py-1 rounded block mb-2">{method.formula}</code>
              <p className="text-xs text-gray-400">{method.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Risk Metrics</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-orange-900/20">
                <th className="text-left py-2 px-4 text-orange-300 rounded-tl-lg">Metric</th>
                <th className="text-left py-2 px-4 text-orange-300">Deskripsi</th>
                <th className="text-left py-2 px-4 text-orange-300 rounded-tr-lg">Target</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['VaR', 'Maximum expected loss at confidence level', '95-99%'],
                ['CVaR', 'Expected loss beyond VaR', '< VaR × 1.5'],
                ['Max Drawdown', 'Largest peak-to-trough decline', '< 15%'],
                ['Sharpe Ratio', 'Risk-adjusted return', '> 1.5'],
                ['Sortino Ratio', 'Downside risk-adjusted return', '> 2.0'],
                ['Calmar Ratio', 'Return / Max Drawdown', '> 1.0'],
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-800/50 hover:bg-white/5">
                  <td className="py-2 px-4 font-medium text-white">{row[0]}</td>
                  <td className="py-2 px-4 text-gray-400">{row[1]}</td>
                  <td className="py-2 px-4 text-green-300">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-red-900/10 rounded-2xl p-5 border border-red-500/20">
        <h3 className="text-lg font-bold text-red-300 mb-3">⚠️ Risk Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Maximum position size per trade: 2-5% of capital',
            'Maximum portfolio exposure: defined limit',
            'Maximum correlated positions: 3-5',
            'Daily loss limit: 2-3% of capital',
            'Drawdown circuit breaker: Stop at 10-15% DD',
          ].map((rule, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <span className="text-red-400 mt-0.5">⛔</span>
              {rule}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BacktestingSection() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        📋 Backtesting & Evaluasi
      </h2>

      <div className="bg-[#111827] rounded-2xl p-6 border border-gray-800">
        <h3 className="text-lg font-bold text-white mb-4">Backtesting Framework</h3>
        <div className="bg-[#0a0e1a] rounded-xl p-4 font-mono text-xs text-green-300 overflow-x-auto">
          <pre>{`class Backtester:
    def __init__(self, strategy, data, config):
        self.strategy = strategy
        self.data = data
    
    def run(self):
        for bar in self.data:
            signal = self.strategy.generate_signal(bar)
            position = self.risk_manager.size_position(signal)
            execution = self.executor.execute(position)
            self.portfolio.update(execution)
        return self.calculate_metrics()
    
    def calculate_metrics(self):
        return {
            'total_return': self.portfolio.total_return(),
            'sharpe_ratio': self.portfolio.sharpe_ratio(),
            'max_drawdown': self.portfolio.max_drawdown(),
            'win_rate': self.portfolio.win_rate(),
            'profit_factor': self.portfolio.profit_factor()
        }`}</pre>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Metrik Evaluasi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { name: 'Total Return', target: '> 20% annually', icon: '📈' },
            { name: 'Sharpe Ratio', target: '> 1.5', icon: '📊' },
            { name: 'Sortino Ratio', target: '> 2.0', icon: '📉' },
            { name: 'Max Drawdown', target: '< 15%', icon: '📉' },
            { name: 'Win Rate', target: '> 50%', icon: '🎯' },
            { name: 'Profit Factor', target: '> 1.5', icon: '💰' },
            { name: 'Calmar Ratio', target: '> 1.0', icon: '📐' },
            { name: 'Expectancy', target: '> 0', icon: '🧮' },
          ].map((metric, i) => (
            <div key={i} className="bg-[#111827] rounded-xl p-3 border border-gray-800 text-center">
              <span className="text-xl">{metric.icon}</span>
              <h4 className="font-bold text-white text-sm mt-1">{metric.name}</h4>
              <p className="text-xs text-green-300 mt-1">{metric.target}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-red-900/10 rounded-2xl p-5 border border-red-500/20">
        <h3 className="text-lg font-bold text-red-300 mb-3">🚫 Bias yang Harus Dihindari</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { name: 'Look-ahead Bias', desc: 'Menggunakan data masa depan' },
            { name: 'Survivorship Bias', desc: 'Hanya data yang masih ada' },
            { name: 'Overfitting', desc: 'Terlalu kompleks untuk data historis' },
            { name: 'Selection Bias', desc: 'Memilih parameter terbaik saja' },
            { name: 'Transaction Cost Ignorance', desc: 'Mengabaikan biaya trading' },
          ].map((bias, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-red-400">⚠️</span>
              <div>
                <span className="font-semibold text-red-200">{bias.name}:</span>
                <span className="text-gray-400 ml-1">{bias.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeploymentSection() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        🚀 Implementasi & Deployment
      </h2>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Tech Stack</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Languages',
              icon: '💻',
              items: ['Python (ML, backtesting)', 'C++ (low-latency)', 'Rust (safety + perf)', 'TypeScript (dashboard)'],
              color: 'border-blue-500/30'
            },
            {
              title: 'ML Frameworks',
              icon: '🧠',
              items: ['PyTorch (deep learning)', 'scikit-learn (classical ML)', 'XGBoost/LightGBM', 'Stable-Baselines3 (RL)'],
              color: 'border-purple-500/30'
            },
            {
              title: 'Data & Storage',
              icon: '💾',
              items: ['PostgreSQL/TimescaleDB', 'Redis (caching)', 'InfluxDB (metrics)', 'Apache Kafka (streaming)'],
              color: 'border-green-500/30'
            },
            {
              title: 'Infrastructure',
              icon: '☁️',
              items: ['Docker/Kubernetes', 'AWS/GCP', 'Grafana (monitoring)', 'Prometheus (metrics)'],
              color: 'border-orange-500/30'
            },
          ].map((stack, i) => (
            <div key={i} className={`bg-[#111827] rounded-xl p-4 border ${stack.color}`}>
              <h4 className="font-bold text-white flex items-center gap-2 mb-3">
                <span>{stack.icon}</span> {stack.title}
              </h4>
              <ul className="space-y-1">
                {stack.items.map((item, j) => (
                  <li key={j} className="text-sm text-gray-400 flex items-center gap-2">
                    <span className="text-cyan-400 text-xs">●</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Deployment Pipeline</h3>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { stage: 'Development', icon: '💻' },
            { stage: 'Testing', icon: '🧪' },
            { stage: 'Staging', icon: '🔄' },
            { stage: 'Paper Trading', icon: '📝' },
            { stage: 'Live Trading', icon: '🚀' },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-3 border border-cyan-500/30 text-center min-w-[100px]">
                <span className="text-xl block">{step.icon}</span>
                <span className="text-xs font-bold text-cyan-200">{step.stage}</span>
              </div>
              {i < 4 && <span className="text-cyan-400 text-lg">→</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#111827] rounded-2xl p-5 border border-cyan-500/20">
        <h3 className="text-lg font-bold text-cyan-300 mb-3">📡 Monitoring & Alerting</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { name: 'System Health', desc: 'CPU, memory, network latency' },
            { name: 'Trading Metrics', desc: 'PnL, drawdown, win rate (real-time)' },
            { name: 'Model Performance', desc: 'Prediction accuracy drift' },
            { name: 'Execution Quality', desc: 'Slippage, fill rate, latency' },
          ].map((item, i) => (
            <div key={i} className="bg-cyan-900/10 rounded-lg p-3">
              <h4 className="font-semibold text-sm text-cyan-200">{item.name}</h4>
              <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MultiAgentSection() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        🤝 Multi-Agent System
      </h2>

      <div className="bg-[#111827] rounded-2xl p-6 border border-purple-500/20">
        <h3 className="text-lg font-bold text-white mb-4">Arsitektur Multi-Agent</h3>
        <div className="flex flex-col items-center gap-4">
          {/* Orchestrator */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30 text-center w-full max-w-md">
            <span className="text-2xl">🎛️</span>
            <h4 className="font-bold text-purple-200 mt-1">ORCHESTRATOR AGENT</h4>
            <p className="text-xs text-gray-400">Strategy Selection & Allocation</p>
          </div>
          
          <span className="text-cyan-400 text-2xl">↓</span>
          
          {/* Sub Agents */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl">
            {[
              { name: 'Trend Agent', icon: '📈' },
              { name: 'Mean Revert', icon: '🔄' },
              { name: 'Scalp Agent', icon: '⚡' },
              { name: 'News Agent', icon: '📰' },
            ].map((agent, i) => (
              <div key={i} className="bg-blue-900/20 rounded-xl p-3 border border-blue-500/20 text-center">
                <span className="text-xl">{agent.icon}</span>
                <h4 className="font-bold text-blue-200 text-xs mt-1">{agent.name}</h4>
              </div>
            ))}
          </div>
          
          <span className="text-cyan-400 text-2xl">↓</span>
          
          {/* Risk & Execution */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
            <div className="bg-orange-900/20 rounded-xl p-3 border border-orange-500/20 text-center">
              <span className="text-xl">🛡️</span>
              <h4 className="font-bold text-orange-200 text-xs mt-1">RISK MANAGER</h4>
            </div>
            <div className="bg-green-900/20 rounded-xl p-3 border border-green-500/20 text-center">
              <span className="text-xl">⚡</span>
              <h4 className="font-bold text-green-200 text-xs mt-1">EXECUTION</h4>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Jenis Agent</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { name: 'Analyst Agent', desc: 'Analisis market dan generate signals', icon: '🔍' },
            { name: 'Strategy Agent', desc: 'Mengelola strategi spesifik', icon: '🎯' },
            { name: 'Risk Agent', desc: 'Monitor dan manage portfolio risk', icon: '🛡️' },
            { name: 'Execution Agent', desc: 'Optimal order execution', icon: '⚡' },
            { name: 'Sentiment Agent', desc: 'Analisis berita dan social media', icon: '💬' },
            { name: 'Meta-Learning Agent', desc: 'Optimize agent parameters', icon: '🧬' },
          ].map((agent, i) => (
            <div key={i} className="bg-[#111827] rounded-xl p-4 border border-gray-800 flex items-center gap-3">
              <span className="text-2xl">{agent.icon}</span>
              <div>
                <h4 className="font-bold text-white text-sm">{agent.name}</h4>
                <p className="text-xs text-gray-400">{agent.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#111827] rounded-2xl p-5 border border-cyan-500/20">
        <h3 className="text-lg font-bold text-cyan-300 mb-3">🔗 Komunikasi Agent</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { name: 'Message Passing', desc: 'Agent-to-agent communication' },
            { name: 'Shared Memory', desc: 'Common state representation' },
            { name: 'Blackboard Architecture', desc: 'Shared knowledge base' },
            { name: 'Negotiation', desc: 'Consensus-based decisions' },
          ].map((item, i) => (
            <div key={i} className="bg-cyan-900/10 rounded-lg p-3">
              <h4 className="font-semibold text-sm text-cyan-200">{item.name}</h4>
              <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IntegrationSection() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        🔌 Integrasi Platform
      </h2>

      <div className="space-y-6">
        {/* MT5 */}
        <div className="bg-[#111827] rounded-2xl p-6 border border-blue-500/20">
          <h3 className="text-lg font-bold text-blue-300 mb-3 flex items-center gap-2">
            <span>📊</span> MetaTrader 5 (MT5)
          </h3>
          <div className="bg-[#0a0e1a] rounded-xl p-4 font-mono text-xs text-green-300 overflow-x-auto">
            <pre>{`import MetaTrader5 as mt5

# Initialize connection
mt5.initialize(login=12345, server="BrokerServer", password="***")

# Get data
rates = mt5.copy_rates_from_pos("EURUSD", mt5.TIMEFRAME_M1, 0, 1000)

# Send order
request = {
    "action": mt5.TRADE_ACTION_DEAL,
    "symbol": "EURUSD",
    "volume": 0.1,
    "type": mt5.ORDER_TYPE_BUY,
    "price": mt5.symbol_info_tick("EURUSD").ask,
}
result = mt5.order_send(request)`}</pre>
          </div>
        </div>

        {/* Crypto */}
        <div className="bg-[#111827] rounded-2xl p-6 border border-orange-500/20">
          <h3 className="text-lg font-bold text-orange-300 mb-3 flex items-center gap-2">
            <span>₿</span> Crypto Exchange (Binance)
          </h3>
          <div className="bg-[#0a0e1a] rounded-xl p-4 font-mono text-xs text-green-300 overflow-x-auto">
            <pre>{`import ccxt

exchange = ccxt.binance({
    'apiKey': 'YOUR_API_KEY',
    'secret': 'YOUR_SECRET',
})

# Get ticker
ticker = exchange.fetch_ticker('BTC/USDT')

# Place order
order = exchange.create_limit_buy_order('BTC/USDT', 0.001, 50000)`}</pre>
          </div>
        </div>

        {/* IB */}
        <div className="bg-[#111827] rounded-2xl p-6 border border-green-500/20">
          <h3 className="text-lg font-bold text-green-300 mb-3 flex items-center gap-2">
            <span>🏦</span> Interactive Brokers
          </h3>
          <div className="bg-[#0a0e1a] rounded-xl p-4 font-mono text-xs text-green-300 overflow-x-auto">
            <pre>{`from ib_insync import IB

ib = IB()
ib.connect('127.0.0.1', 7497, clientId=1)

# Get market data
contract = Stock('AAPL', 'SMART', 'USD')
bars = ib.reqHistoricalData(contract, '', '1 D', '1 min', 'TRADES', False)

# Place order
order = MarketOrder('BUY', 100)
trade = ib.placeOrder(contract, order)`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecuritySection() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        🔒 Keamanan & Compliance
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111827] rounded-2xl p-5 border border-red-500/20">
          <h3 className="text-lg font-bold text-red-300 mb-4 flex items-center gap-2">
            <span>🔐</span> Keamanan Sistem
          </h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-2"><span className="text-red-400">▸</span> <strong>API Key Management:</strong> Encrypted storage, rotation policy</li>
            <li className="flex items-start gap-2"><span className="text-red-400">▸</span> <strong>Authentication:</strong> Multi-factor authentication</li>
            <li className="flex items-start gap-2"><span className="text-red-400">▸</span> <strong>Network Security:</strong> VPN, firewall, encrypted connections</li>
            <li className="flex items-start gap-2"><span className="text-red-400">▸</span> <strong>Code Security:</strong> Input validation, no hardcoded secrets</li>
            <li className="flex items-start gap-2"><span className="text-red-400">▸</span> <strong>Audit Trail:</strong> Complete logging of all actions</li>
          </ul>
        </div>

        <div className="bg-[#111827] rounded-2xl p-5 border border-yellow-500/20">
          <h3 className="text-lg font-bold text-yellow-300 mb-4 flex items-center gap-2">
            <span>⚖️</span> Compliance
          </h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-2"><span className="text-yellow-400">▸</span> <strong>Regulatory:</strong> SEC, FCA, ASIC regulations</li>
            <li className="flex items-start gap-2"><span className="text-yellow-400">▸</span> <strong>KYC/AML:</strong> Know Your Customer, Anti-Money Laundering</li>
            <li className="flex items-start gap-2"><span className="text-yellow-400">▸</span> <strong>Market Rules:</strong> Pattern day trading, short selling</li>
            <li className="flex items-start gap-2"><span className="text-yellow-400">▸</span> <strong>Tax Reporting:</strong> Accurate trade reporting</li>
            <li className="flex items-start gap-2"><span className="text-yellow-400">▸</span> <strong>Data Privacy:</strong> GDPR compliance</li>
          </ul>
        </div>
      </div>

      <div className="bg-green-900/10 rounded-2xl p-5 border border-green-500/20">
        <h3 className="text-lg font-bold text-green-300 mb-3">✅ Best Practices</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Never share API keys',
            'Use read-only keys for monitoring',
            'Implement IP whitelisting',
            'Regular security audits',
            'Disaster recovery plan',
            'Kill switch for emergency stop',
          ].map((practice, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
              <span className="text-green-400">✓</span>
              {practice}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChallengesSection() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        ⚠️ Tantangan & Limitasi
      </h2>

      <div className="space-y-6">
        <div className="bg-[#111827] rounded-2xl p-5 border border-red-500/20">
          <h3 className="text-lg font-bold text-red-300 mb-3">💻 Tantangan Teknis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: 'Overfitting', desc: 'Model terlalu spesifik ke data historis' },
              { name: 'Non-stationarity', desc: 'Pasar berubah seiring waktu' },
              { name: 'Latency', desc: 'Delay dalam eksekusi order' },
              { name: 'Data Quality', desc: 'Missing data, outliers, errors' },
              { name: 'Infrastructure', desc: 'Server downtime, network issues' },
            ].map((item, i) => (
              <div key={i} className="bg-red-900/10 rounded-lg p-3">
                <h4 className="font-semibold text-sm text-red-200">{item.name}</h4>
                <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111827] rounded-2xl p-5 border border-orange-500/20">
          <h3 className="text-lg font-bold text-orange-300 mb-3">📈 Tantangan Pasar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: 'Market Efficiency', desc: 'Sulit menemukan edge yang konsisten' },
              { name: 'Competition', desc: 'Berkompetisi dengan institusi besar' },
              { name: 'Regime Changes', desc: 'Perubahan kondisi pasar tiba-tiba' },
              { name: 'Black Swan Events', desc: 'Peristiwa tak terduga' },
              { name: 'Liquidity Risk', desc: 'Tidak bisa exit di market stress' },
            ].map((item, i) => (
              <div key={i} className="bg-orange-900/10 rounded-lg p-3">
                <h4 className="font-semibold text-sm text-orange-200">{item.name}</h4>
                <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111827] rounded-2xl p-5 border border-purple-500/20">
          <h3 className="text-lg font-bold text-purple-300 mb-3">🧠 Tantangan AI</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: 'Explainability', desc: 'Sulit menjelaskan keputusan AI' },
              { name: 'Data Requirements', desc: 'Butuh data besar untuk training' },
              { name: 'Computational Cost', desc: 'GPU/TPU untuk deep learning' },
              { name: 'Concept Drift', desc: 'Model degradation over time' },
              { name: 'Reward Design', desc: 'Merancang reward function yang tepat' },
            ].map((item, i) => (
              <div key={i} className="bg-purple-900/10 rounded-lg p-3">
                <h4 className="font-semibold text-sm text-purple-200">{item.name}</h4>
                <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-900/10 rounded-2xl p-5 border border-green-500/20">
          <h3 className="text-lg font-bold text-green-300 mb-3">🛡️ Mitigasi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'Diversifikasi strategi',
              'Regular model retraining',
              'Robust risk management',
              'Paper trading sebelum live',
              'Continuous monitoring',
              'Graceful degradation',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="text-green-400">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TrendsSection() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        🔮 Future Trends
      </h2>

      <div className="space-y-4">
        {[
          {
            title: 'Large Language Models (LLM) in Trading',
            icon: '💬',
            color: 'border-blue-500/30',
            items: ['GPT-4, Claude untuk analisis kontekstual', 'Multi-modal understanding (chart + news + data)', 'Natural language strategy specification', 'Conversational trading interfaces'],
          },
          {
            title: 'Quantum Computing',
            icon: '⚛️',
            color: 'border-purple-500/30',
            items: ['Quantum optimization for portfolio', 'Quantum machine learning', 'Faster Monte Carlo simulations', 'Quantum-inspired algorithms'],
          },
          {
            title: 'Decentralized AI',
            icon: '🌐',
            color: 'border-green-500/30',
            items: ['Federated learning across agents', 'Blockchain-based strategy marketplace', 'Decentralized data oracles', 'Token-incentivized signal sharing'],
          },
          {
            title: 'Advanced RL',
            icon: '🎮',
            color: 'border-orange-500/30',
            items: ['Multi-agent reinforcement learning (MARL)', 'Meta-learning for rapid adaptation', 'Hierarchical RL for complex strategies', 'Sim-to-real transfer learning'],
          },
          {
            title: 'Autonomous Finance',
            icon: '🤖',
            color: 'border-cyan-500/30',
            items: ['Full-stack autonomous trading systems', 'Self-improving agents', 'Cross-asset optimization', 'Real-time strategy evolution'],
          },
          {
            title: 'Edge Computing',
            icon: '📱',
            color: 'border-pink-500/30',
            items: ['Ultra-low latency execution', 'On-device AI inference', '5G-enabled mobile trading', 'IoT sensor data integration'],
          },
        ].map((trend, i) => (
          <div key={i} className={`bg-[#111827] rounded-2xl p-5 border ${trend.color}`}>
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">{trend.icon}</span> {i + 1}. {trend.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {trend.items.map((item, j) => (
                <div key={j} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-cyan-400 mt-0.5">▸</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 rounded-2xl p-6 border border-cyan-500/20">
        <h3 className="text-lg font-bold text-cyan-300 mb-3">📚 Referensi & Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-bold text-white mb-2">📖 Books</h4>
            <ul className="space-y-1 text-gray-400">
              <li>• "Advances in Financial Machine Learning"</li>
              <li>• "Machine Learning for Trading"</li>
              <li>• "Algorithmic Trading" - Ernest P. Chan</li>
              <li>• "Deep Learning for Finance"</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">🛠️ Tools</h4>
            <ul className="space-y-1 text-gray-400">
              <li>• Backtesting: Backtrader, VectorBT</li>
              <li>• ML: PyTorch, scikit-learn</li>
              <li>• RL: Stable-Baselines3, FinRL</li>
              <li>• Data: yfinance, ccxt, Alpha Vantage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
