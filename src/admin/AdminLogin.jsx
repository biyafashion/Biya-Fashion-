import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ShieldCheck, ArrowRight, AlertCircle, Info } from 'lucide-react';
import BiyaLogo from '../components/BiyaLogo';
import { useAuth } from '../context/AuthContext';
import { ADMIN_CONFIG } from '../config/adminConfig';

/**
 * BIYA FASHION - Admin Login
 * 
 * IMPORTANT:
 * Frontend-only authentication. Hardcoded credentials are NOT secure for production.
 * A real production application requires server-side authentication.
 */
const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = login(username, password);
    setLoading(false);

    if (result.success) {
      navigate('/admin', { replace: true });
    } else {
      setError(result.error || 'Invalid credentials');
    }
  };

  const handleAutoFill = () => {
    setUsername(ADMIN_CONFIG.ADMIN_USERNAME);
    setPassword(ADMIN_CONFIG.ADMIN_PASSWORD);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Brand Logo & Heading */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BiyaLogo size="large" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#064C32]/10 text-[#064C32] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D9A514]" />
            Staff & Merchant Access
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111]">
            Store Administration
          </h1>
          <p className="text-xs text-[#666666]">
            Enter your credentials to manage products, categories, orders, and settings.
          </p>
        </div>

        {/* Demo Credentials Quick Box */}
        <div className="p-4 rounded-2xl bg-[#F8F8F8] border border-[#E5E5E5] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#111111] flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-[#064C32]" />
              Demo Credentials
            </span>
            <button
              type="button"
              onClick={handleAutoFill}
              className="text-[11px] font-bold text-[#064C32] hover:underline"
            >
              Autofill Form
            </button>
          </div>
          <div className="text-xs text-[#666666] font-mono grid grid-cols-2 gap-2 pt-1">
            <div className="bg-white p-2 rounded-lg border border-[#E5E5E5]">
              <span className="block text-[10px] text-gray-400 uppercase">Username</span>
              <span className="font-bold text-[#111111]">admin</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-[#E5E5E5]">
              <span className="block text-[10px] text-gray-400 uppercase">Password</span>
              <span className="font-bold text-[#111111]">Biya@2026</span>
            </div>
          </div>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8F8F8] border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#064C32] focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#111111] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8F8F8] border border-[#E5E5E5] text-sm text-[#111111] focus:outline-none focus:border-[#064C32] focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#064C32] hover:bg-[#033B27] text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-[#064C32]/20 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Admin Portal'}</span>
            <ArrowRight className="w-4 h-4 text-[#F3D477]" />
          </button>
        </form>

        {/* Security Notice Footer */}
        <p className="text-[10px] text-center text-[#666666] leading-relaxed">
          Frontend-only authentication. Hardcoded credentials are NOT secure for production. A real production application requires server-side authentication.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
