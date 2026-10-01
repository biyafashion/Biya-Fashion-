import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  Lock,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import BiyaLogo from './BiyaLogo';

const CustomerAuthModal = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    login,
    register,
  } = useCustomerAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sign In Form State
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Register Form State
  const [regData, setRegData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    address: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
  });

  if (!isAuthModalOpen) return null;

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    if (!signInIdentifier.trim()) return;
    setIsSubmitting(true);
    login(signInIdentifier, signInPassword);
    setIsSubmitting(false);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regData.name.trim() || !regData.phone.trim()) return;
    setIsSubmitting(true);
    register(regData);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Click outside backdrop */}
      <div
        className="fixed inset-0"
        onClick={closeAuthModal}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E5E5E5] overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header with Crown Brand */}
        <div className="bg-[#064C32] px-6 py-5 text-white relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-[#D9A514]/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#D9A514]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white tracking-wide">
                BIYA FASHION
              </h3>
              <p className="text-[11px] text-white/80 font-sans">
                Customer Account & Fast Checkout
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E5E5E5] bg-[#F8F8F8]">
          <button
            type="button"
            onClick={() => setAuthModalTab('signin')}
            className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider transition border-b-2 ${
              authModalTab === 'signin'
                ? 'border-[#064C32] text-[#064C32] bg-white'
                : 'border-transparent text-[#666666] hover:text-[#111111]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthModalTab('register')}
            className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider transition border-b-2 ${
              authModalTab === 'register'
                ? 'border-[#064C32] text-[#064C32] bg-white'
                : 'border-transparent text-[#666666] hover:text-[#111111]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Body Form (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-5">
          {authModalTab === 'signin' ? (
            /* ================= SIGN IN TAB ================= */
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                  Mobile Number or Email <span className="text-[#064C32]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    placeholder="e.g. 9876543210 or arun@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                  Password <span className="text-[#064C32]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[#F8F8F8] rounded-xl border border-[#E5E5E5] flex items-center gap-2 text-[11px] text-[#666666]">
                <ShieldCheck className="w-4 h-4 text-[#064C32] shrink-0" />
                <span>Sign in to access your saved delivery address and order history.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-[#064C32] hover:bg-[#033B27] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition"
              >
                <span>{isSubmitting ? 'Signing In...' : 'Sign In To Account'}</span>
                <ArrowRight className="w-4 h-4 text-[#D9A514]" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthModalTab('register')}
                  className="text-xs text-[#064C32] hover:underline font-semibold"
                >
                  Don't have an account? Create one now →
                </button>
              </div>
            </form>
          ) : (
            /* ================= REGISTER TAB ================= */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                    Full Name <span className="text-[#064C32]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={regData.name}
                      onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                      placeholder="e.g. Arun Kumar"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                    WhatsApp Number <span className="text-[#064C32]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={regData.phone}
                      onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                      placeholder="10-digit mobile"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                    Email Address <span className="text-gray-400">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      placeholder="arun@example.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111111] mb-1.5">
                    Create Password <span className="text-[#064C32]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                      placeholder="Min 4 characters"
                      className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Delivery Address Details */}
              <div className="pt-2 border-t border-[#E5E5E5] space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111]">
                  <MapPin className="w-3.5 h-3.5 text-[#064C32]" />
                  <span>Default Delivery Address (For Courier Label & Invoices)</span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                    Street Address / Door No. / Area <span className="text-[#064C32]">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={regData.address}
                    onChange={(e) => setRegData({ ...regData, address: e.target.value })}
                    placeholder="Door No., Street name, Landmark..."
                    className="w-full p-2.5 rounded-xl border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                      City / Town <span className="text-[#064C32]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={regData.city}
                      onChange={(e) => setRegData({ ...regData, city: e.target.value })}
                      placeholder="e.g. Madurai"
                      className="w-full p-2 rounded-xl border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                      State <span className="text-[#064C32]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={regData.state}
                      onChange={(e) => setRegData({ ...regData, state: e.target.value })}
                      placeholder="Tamil Nadu"
                      className="w-full p-2 rounded-xl border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666666] mb-1">
                      Pincode <span className="text-[#064C32]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={regData.pincode}
                      onChange={(e) => setRegData({ ...regData, pincode: e.target.value })}
                      placeholder="625001"
                      className="w-full p-2 rounded-xl border border-[#E5E5E5] text-xs text-[#111111] focus:outline-none focus:border-[#064C32]"
                    />
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-gray-500 bg-[#F8F8F8] p-2.5 rounded-xl border border-[#E5E5E5]">
                🔒 <strong>Privacy Assured:</strong> We only store your address for accurate delivery and invoice generation. No payment data or tracking keys are stored in any database.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-[#064C32] hover:bg-[#033B27] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition"
              >
                <span>{isSubmitting ? 'Creating Account...' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4 text-[#D9A514]" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setAuthModalTab('signin')}
                  className="text-xs text-[#064C32] hover:underline font-semibold"
                >
                  Already have an account? Sign In here →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerAuthModal;
