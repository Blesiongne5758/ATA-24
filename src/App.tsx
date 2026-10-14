import { motion } from 'framer-motion';
import TradingWidget from './components/TradingWidget';
import LoginPage from './components/LoginPage';
import { useAuthStore } from './store/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  // Jika belum login, tampilkan halaman login
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen w-full bg-[#050211] flex flex-col items-center justify-start py-6 px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-900/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-900/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-950/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
        <motion.div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" animate={{ top: ['0%', '100%'] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
      </div>

      <motion.div className="relative z-10 text-center mb-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          <span className="text-purple-400">AI</span> Trading Agent
          <span className="text-[10px] ml-2 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-normal">v3.0</span>
        </h1>
        <p className="text-[10px] text-gray-500 mt-1 tracking-wider uppercase">
          Multi-Routing Neural Engine • 6 Markets • MT5 • API Gateway • Auto Trading
        </p>
      </motion.div>

      <div className="relative z-10 w-full max-w-lg">
        <TradingWidget />
      </div>
    </div>
  );
}

export default App;
