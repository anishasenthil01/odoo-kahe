import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-slate-900">
      <div className="mesh-bg opacity-20" />
      
      {/* Left side - Image/Branding */}
      <div className="hidden lg:flex lg:w-3/5 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070')] bg-cover bg-center group-hover:scale-110 transition-transform duration-[10s]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent"></div>
        
        <div className="relative z-10 text-white p-20 max-w-2xl animate-in fade-in slide-in-from-left duration-1000">
          <div className="flex items-center gap-5 mb-12">
            <div className="bg-teal-500 p-4 rounded-[1.5rem] shadow-2xl shadow-teal-500/40 rotate-6">
              <MapPin size={40} className="text-white" />
            </div>
            <h1 className="text-6xl font-black tracking-tighter">Traveloop</h1>
          </div>
          <h2 className="text-5xl font-black mb-8 leading-tight tracking-tight">Your world, <br/><span className="text-teal-400">Perfectly Planned.</span></h2>
          <p className="text-slate-300 text-xl font-medium leading-relaxed max-w-lg">
            Join thousands of explorers who use Traveloop to craft unforgettable journeys with smart itineraries and budget tracking.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 lg:p-16 relative z-10">
        <div className="w-full max-w-md glass-card p-12 border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Welcome Back</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Sign in to your adventure</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 text-rose-400 p-5 rounded-2xl mb-8 text-sm border border-rose-500/20 font-bold flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all font-medium text-white placeholder:text-slate-600"
                placeholder="explorer@traveloop.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                <Link to="#" className="text-[10px] text-teal-400 hover:text-teal-300 font-black uppercase tracking-widest transition-colors">Forgot?</Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all font-medium text-white placeholder:text-slate-600"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-teal-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-400 text-white font-black py-5 rounded-2xl transition-all duration-300 shadow-2xl shadow-teal-500/20 active:scale-[0.98] mt-4 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>Sign into Traveloop <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <p className="mt-12 text-center text-sm text-slate-500 font-bold">
            New explorer?{' '}
            <Link to="/register" className="text-teal-400 hover:text-teal-300 transition-colors font-black">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
