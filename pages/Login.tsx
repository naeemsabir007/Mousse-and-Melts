import React, { useState } from 'react';
import { useStore } from '../context/StateContext';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import logoImage from '../logo.png';


const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginAdmin, navigate } = useStore();

  // Admin credentials
  const ADMIN_USERNAME = 'mnmadmin';
  const ADMIN_PASSWORD = 'mnmpass123';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 800));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      loginAdmin();
      navigate('/admin');
    } else {
      setError('Invalid username or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-soft-pink/20 to-cream flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-velvet-red/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold-accent/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        {/* Glass card */}
        <div className="bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl border border-white/50">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-4"
            >
              <img
                src={logoImage}
                alt="Mousse & Melts Logo"
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </motion.div>
            <h1 className="font-serif text-3xl text-chocolate font-bold">Admin Portal</h1>
            <p className="text-chocolate/60 mt-2 text-sm">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-chocolate/70 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/40" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-12 pr-4 py-4 bg-white/80 rounded-xl border border-chocolate/10 focus:border-chocolate/30 focus:ring-4 focus:ring-chocolate/10 outline-none transition-all text-chocolate placeholder:text-chocolate/30"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-chocolate/70 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-chocolate/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-12 pr-12 py-4 bg-white/80 rounded-xl border border-chocolate/10 focus:border-chocolate/30 focus:ring-4 focus:ring-chocolate/10 outline-none transition-all text-chocolate placeholder:text-chocolate/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-chocolate/40 hover:text-chocolate transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-chocolate to-velvet-red text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Unlock Dashboard
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-chocolate/40 text-xs mt-6">
            Mousse & Melts Admin Panel
          </p>
        </div>

        {/* Decorative shadow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-chocolate/5 blur-xl rounded-full" />
      </motion.div>
    </div>
  );
};

export default Login;