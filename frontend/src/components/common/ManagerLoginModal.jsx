import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, KeyRound, X, CheckCircle2, AlertCircle, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { loginWithCredentials } from '../../services/api';

export const ManagerLoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setError('');
      setSuccess(false);
      setLoading(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginWithCredentials(email, password);
      if (res.success) {
        setSuccess(true);
        localStorage.setItem('sage_staff_token', res.token);
        localStorage.setItem('sage_staff_user', JSON.stringify(res.user));
        setTimeout(() => {
          onClose();
          navigate('/admin');
        }, 800);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#073E47] border border-[#F3D898]/30 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.6)] text-white overflow-hidden">
        
        {/* Glow ambient background circles */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#F3D898]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#0A6473] rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#F3D898]/20 border border-[#F3D898]/40 mx-auto flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(243,216,152,0.2)]">
            <Lock className="w-7 h-7 text-[#F3D898]" />
          </div>
          <h3
            className="text-2xl font-serif text-[#F3D898] uppercase tracking-wider"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Manager & Owner Login
          </h3>
          <p className="text-xs text-white/70 mt-1 font-sans">
            Enter your registered credentials to access the admin dashboard
          </p>
        </div>

        {/* Error / Success Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>Access Granted! Redirecting to Dashboard...</span>
          </div>
        )}

        {/* Form: Email & Password */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-white/80 mb-1.5 font-mono flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#F3D898]" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter registered manager email"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#052C32] border border-white/20 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#F3D898] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-white/80 mb-1.5 font-mono flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#F3D898]" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#052C32] border border-white/20 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#F3D898] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-3.5 rounded-xl bg-[#F3D898] text-[#052C32] font-bold text-xs uppercase tracking-widest hover:bg-[#ffe39e] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-4 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Sign In to Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-1.5 text-center">
          <Lock className="w-3 h-3 text-[#F4B245]/70 shrink-0" />
          <span className="text-[10px] text-white/50 tracking-wider">
            Secure Admin Portal &bull; Sage Café Hazratganj, Lucknow
          </span>
        </div>

      </div>
    </div>
  );
};

export default ManagerLoginModal;
