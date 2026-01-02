import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User as UserIcon, AlertCircle, Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(username, password);
    
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid username or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6">
      <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] p-10 md:p-12">
          
          <div className="mb-10">
             {error && (
              <div className="mb-6 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 text-xs font-bold animate-shake">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Username field */}
              <div>
                <label className="block text-[10px] font-black uppercase text-[#94a3b8] tracking-[0.15em] mb-3 ml-1">Username</label>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#cbd5e1] group-focus-within:text-red-600 transition-colors">
                    <UserIcon size={20} />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl pl-14 pr-6 py-4 text-sm font-medium text-[#1e293b] placeholder:text-[#cbd5e1] focus:ring-4 focus:ring-red-700/5 focus:border-red-600/30 outline-none transition-all"
                    placeholder="admin"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-[10px] font-black uppercase text-[#94a3b8] tracking-[0.15em] mb-3 ml-1">Password</label>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#cbd5e1] group-focus-within:text-red-600 transition-colors">
                    <Lock size={20} />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl pl-14 pr-6 py-4 text-sm font-medium text-[#1e293b] placeholder:text-[#cbd5e1] focus:ring-4 focus:ring-red-700/5 focus:border-red-600/30 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="peer sr-only" 
                      defaultChecked
                    />
                    <div className="w-5 h-5 border-2 border-[#e2e8f0] rounded-md bg-white peer-checked:bg-[#cc392c] peer-checked:border-[#cc392c] transition-all"></div>
                    <svg className="absolute top-1 left-1 w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-black text-[#64748b] uppercase tracking-wider">Remember Me</span>
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#cc392c] hover:bg-[#b52a1e] text-white font-bold text-lg py-5 rounded-2xl shadow-[0_10px_25px_-5px_rgba(204,57,44,0.4)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
              >
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'Sign In'}
              </button>
            </form>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#f1f5f9]"></div></div>
            <div className="relative flex justify-center text-xs"></div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-[11px] text-[#94a3b8] font-medium tracking-wide">
              Demo Credentials: <span className="text-[#1e293b] font-bold">admin / password</span>
            </p>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;