import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Smartphone,
  Lock,
  Mail,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Building2,
  Eye,
  EyeOff
} from 'lucide-react';

interface AuthModalProps {
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const { login, signup } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // Login form state
  const [loginMobile, setLoginMobile] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form state: mobile, email, password, city
  const [signupMobile, setSignupMobile] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupCity, setSignupCity] = useState('');
  const [signupBusiness, setSignupBusiness] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [signupSuccessMsg, setSignupSuccessMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await login(loginMobile, loginPassword);
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSignupSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const res = await signup({
        mobile: signupMobile,
        email: signupEmail,
        password: signupPassword,
        city: signupCity,
        businessName: signupBusiness
      });

      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setSignupSuccessMsg(res.message);
        // Switch to login tab and prefill mobile
        setLoginMobile(signupMobile);
        setTimeout(() => {
          setMode('login');
        }, 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl shadow-emerald-950/30 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header Hero */}
        <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border-b border-slate-800 text-center relative">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-emerald-900/40 mb-3 ring-2 ring-emerald-400/20">
            LX
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            WhatsApp Business Platform
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Official Meta Cloud API • Coexistence • Multi-Tenant SaaS
          </p>

          {/* Quick Demo Credentials hint for testing */}
          <div className="mt-3 p-2 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 flex items-center justify-between">
            <span className="text-emerald-400 font-medium">Master Login:</span>
            <code className="text-slate-200 font-mono">9974428034</code>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-medium">Pass:</span>
            <code className="text-slate-200 font-mono">77777777</code>
          </div>
        </div>

        {/* Tab switchers: Login / Signup */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-950/80 border-b border-slate-800">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              mode === 'login'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Login to Panel
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
              setSignupSuccessMsg(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              mode === 'signup'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register / Signup
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {signupSuccessMsg && (
            <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{signupSuccessMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={loginMobile}
                    onChange={(e) => setLoginMobile(e.target.value)}
                    placeholder="Enter mobile no (e.g. 9974428034)"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-white font-mono placeholder:text-slate-600 focus:outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Logging in...</span>
                ) : (
                  <>
                    <span>Login to Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMobile('9974428034');
                    setLoginPassword('77777777');
                  }}
                  className="text-[11px] text-emerald-400 hover:underline inline-flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" /> Quick fill Master Login
                </button>
              </div>
            </form>
          )}

          {/* SIGNUP FORM: mobile, email, password, city */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={signupMobile}
                  onChange={(e) => setSignupMobile(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="name@business.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={signupCity}
                  onChange={(e) => setSignupCity(e.target.value)}
                  placeholder="e.g. Morbi, Ahmedabad, Mumbai"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  Company / Brand Name (Optional)
                </label>
                <input
                  type="text"
                  value={signupBusiness}
                  onChange={(e) => setSignupBusiness(e.target.value)}
                  placeholder="e.g. Royal Ceramic Works"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Create Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-3 pr-9 py-2 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-[11px] text-slate-400 leading-relaxed">
                <span className="text-emerald-400 font-semibold">Master Approval Process:</span> Signup karne ke baad aapka account Master Admin approval ke liye pending list me jayega. Master Admin ke approve karte hi aapko aapka fresh personal panel mil jayega.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting Request...' : 'Submit Signup for Master Approval'}
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Cloud Firestore Multi-Tenant Security Guaranteed</span>
        </div>
      </div>
    </div>
  );
};
