import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ChevronRight, LayoutDashboard, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { authService } from '../services/authService';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('admin@formly.app');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login(email, password);
      if (response.success) {
        // 1. Simpan token ke localStorage
        localStorage.setItem('auth_token', response.data.token);
        // 2. Simpan data user opsional
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        // 3. Trigger props onLogin
        onLogin();
      }
    } catch (err: any) {
      setError(err.message || 'Email atau kata sandi salah. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full -ml-48 -mb-48 blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-xl relative z-10">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg mb-4">
              <LayoutDashboard size={32} />
            </div>
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">Formly</h1>
            <p className="text-on-surface-variant mt-2">Kelola pesanan Anda dengan lebih efisien.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-error/10 border border-error/20 rounded-xl flex items-center gap-3 text-error text-sm font-medium"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">Alamat Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-none">Kata Sandi</label>
                  <button type="button" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Lupa Password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={18} />
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-container transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memasuki Sistem...
                </>
              ) : (
                <>
                  Masuk Sekarang
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-outline-variant/30 text-center">
            <p className="text-[10px] text-on-surface-variant/50 uppercase tracking-widest font-medium">
              Sistem Manajemen Pesanan Internal
            </p>
          </div>
        </div>
        
        <p className="text-center text-[10px] text-on-surface-variant/50 uppercase tracking-widest mt-8 font-medium">
          © 2024 Formly Business Suite • v1.0.4
        </p>
      </motion.div>
    </div>
  );
}
