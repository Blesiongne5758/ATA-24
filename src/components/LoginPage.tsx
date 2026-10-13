import { useState } from 'react';
import { motion } from 'framer-motion';
import Captcha from './Captcha';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validasi
    if (!email || !password) {
      setError('Email dan password harus diisi');
      return;
    }

    if (!captchaVerified) {
      setError('Silakan verifikasi captcha terlebih dahulu');
      return;
    }

    setIsLoading(true);

    try {
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock login - dalam produksi, ini akan memanggil API backend
      if (email === 'admin@pjbot.ai' && password === 'admin123') {
        login({
          id: '1',
          email: email,
          name: 'Admin User',
          role: 'admin',
          token: 'mock-jwt-token-' + Date.now()
        });
      } else if (email && password.length >= 6) {
        // Accept any valid email with password 6+ chars for demo
        login({
          id: '2',
          email: email,
          name: email.split('@')[0],
          role: 'user',
          token: 'mock-jwt-token-' + Date.now()
        });
      } else {
        throw new Error('Email atau password salah');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#050211] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-900/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-900/15 blur-3xl" />
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-gray-900/50 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 shadow-2xl shadow-purple-500/10">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mb-4"
            >
              <span className="text-3xl">🤖</span>
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">
              PJ.BOT AI Trading Agent
            </h1>
            <p className="text-sm text-gray-400">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pjbot.ai"
                className="w-full px-4 py-3 rounded-lg bg-gray-900/50 border border-gray-700/50 text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-900/50 border border-gray-700/50 text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-300 transition-colors"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Captcha */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Verifikasi Captcha
              </label>
              <Captcha onVerify={setCaptchaVerified} />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
              >
                ❌ {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading || !captchaVerified}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold text-sm hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/20"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  Memproses...
                </span>
              ) : (
                '🔐 Masuk'
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Belum punya akun?{' '}
              <button className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Daftar sekarang
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-xs text-blue-300 font-medium mb-2">🔑 Demo Credentials:</p>
            <div className="space-y-1 text-xs text-gray-400">
              <p><span className="text-gray-300">Admin:</span> admin@pjbot.ai / admin123</p>
              <p><span className="text-gray-300">User:</span> email apapun / password 6+ karakter</p>
            </div>
          </div>
        </div>

        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-500/30 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-purple-500/30 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-purple-500/30 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple-500/30 rounded-br-2xl" />
      </motion.div>
    </div>
  );
}
