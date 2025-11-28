import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Package, User, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const ADMIN_USERNAME = 'Admin';
const ADMIN_PASSWORD = 'admin';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter both username and password.');
      return;
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      onLogin({
        id: 'admin',
        fullName: ADMIN_USERNAME,
        staffId: ADMIN_PASSWORD,
        position: 'Administrator',
        department: 'IT',
        role: 'Admin',
      });
    } else {
      toast.error('Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-sky-400 to-gray-300 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-md bg-white/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-white rounded-full shadow-lg mb-4">
            <img src="/logo.png" alt="Logo" className='h-12 w-12' />
          </div>
          <h1 className="text-3xl font-bold text-brand-gray-800">IT Inventory System</h1>
          <p className="text-brand-gray-600 mt-1">Administrator Sign In</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="relative">
              <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-white border border-brand-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all"
                required
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-400" />
              <input
                type= {showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white border border-brand-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all"
                required
              />
            </div>
          </div>

          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-brand-blue text-white font-semibold py-3 rounded-lg shadow-md hover:bg-brand-blue-dark transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
            ) : null}
            {loading ? 'Signing In...' : 'Sign In'}
          </motion.button>

        </form>
      </motion.div>
    </div>
  );
}

export default LoginPage;
