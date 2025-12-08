import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, Shield } from 'lucide-react';

export default function LoginModal() {
  const { showLogin, setShowLogin, setShowRegister, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  if (!showLogin) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-space-950/80 backdrop-blur-md animate-fade-in p-4">
      {/* Enhanced Popup Container */}
      <div className="panel w-full max-w-md p-8 relative overflow-hidden border-2 border-holo-500 shadow-[0_0_60px_rgba(20,184,166,0.25)] bg-space-900/95 animate-slide-in">
        
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-holo-500/20 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-holo-400" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-holo-400" />

        <button
          onClick={() => setShowLogin(false)}
          className="absolute right-5 top-5 text-gray-500 hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-center gap-4 mb-8">
           <div className="p-3 bg-holo-500/10 rounded-full border border-holo-500/30">
             <Shield className="text-holo-500" size={32} />
           </div>
           <div>
              <h2 className="text-2xl font-orbitron font-bold text-white tracking-wide">SECURE_LOGIN</h2>
              <p className="text-holo-400 text-xs font-mono">AUTH_PROTOCOL_V4</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-1">Identity</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-holo-400 transition-colors" size={16} />
              <input
                type="email"
                className="input-tech pl-11 py-3 border-space-700 bg-space-950/50 focus:bg-space-900"
                placeholder="ranger@zordon.ops"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between ml-1">
               <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Passcode</label>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-holo-400 transition-colors" size={16} />
              <input
                type="password"
                className="input-tech pl-11 py-3 border-space-700 bg-space-950/50 focus:bg-space-900"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-holo bg-holo-500/10 text-holo-300 border-holo-500 hover:bg-holo-500 hover:text-space-950 font-bold py-3 mt-4 shadow-[0_0_20px_rgba(20,184,166,0.1)] hover:shadow-[0_0_30px_rgba(20,184,166,0.4)]"
          >
            AUTHENTICATE ACCESS
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-space-700/50 text-center">
          <p className="text-xs text-gray-500 font-mono">
            NEW RECRUIT?{' '}
            <button
              className="text-holo-400 hover:text-white hover:underline transition-colors font-bold ml-1"
              onClick={() => {
                setShowLogin(false);
                setShowRegister(true);
              }}
            >
              INITIALIZE PROFILE
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
