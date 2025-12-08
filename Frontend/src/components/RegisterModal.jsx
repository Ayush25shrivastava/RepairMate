import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, User, Mail, Lock, Phone, Database } from 'lucide-react';

export default function RegisterModal() {
  const { showRegister, setShowRegister, register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    await register({ ...form, avatar: '/default-avatar.png' });
  };

  if (!showRegister) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-space-950/80 backdrop-blur-md animate-fade-in p-4">
      {/* Enhanced Popup Container */}
      <div className="panel w-full max-w-md p-8 relative overflow-hidden border-2 border-holo-500 shadow-[0_0_60px_rgba(168,85,247,0.25)] bg-space-900/95 animate-slide-in">
        
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-holo-500/20 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-holo-500" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-holo-500" />

        <button
          className="absolute right-5 top-5 text-gray-500 hover:text-white transition-colors z-10"
          onClick={() => setShowRegister(false)}
        >
          <X size={20} />
        </button>
        
        <div className="flex items-center gap-4 mb-6">
           <div className="p-3 bg-holo-500/10 rounded-full border border-holo-500/30">
              <Database className="text-holo-500" size={32} />
           </div>
           <div>
              <h2 className="text-2xl font-orbitron font-bold text-white tracking-wide">NEW_RECRUIT</h2>
              <p className="text-holo-500 text-xs font-mono">PROFILE_CREATION_WIZARD</p>
           </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative group">
            <User className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-holo-500 transition-colors" size={16} />
            <input
              name="name"
              placeholder="FULL NAME"
              className="input-tech pl-11 uppercase placeholder:normal-case focus:border-holo-500 focus:ring-holo-500/50"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-holo-500 transition-colors" size={16} />
            <input
              name="email"
              type="email"
              placeholder="EMAIL.ADDRESS"
              className="input-tech pl-11 focus:border-holo-500 focus:ring-holo-500/50"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-holo-500 transition-colors" size={16} />
            <input
              name="password"
              type="password"
              placeholder="PASSCODE"
              className="input-tech pl-11 focus:border-holo-500 focus:ring-holo-500/50"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative group">
            <Phone className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-holo-500 transition-colors" size={16} />
            <input
              name="phone"
              placeholder="COMMS.FREQUENCY (OPTIONAL)"
              className="input-tech pl-11 focus:border-holo-500 focus:ring-holo-500/50"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="relative group">
            <select
              name="role"
              className="input-tech appearance-none uppercase focus:border-holo-500 focus:ring-holo-500/50"
              value={form.role}
              onChange={handleChange}
            >
              <option value="user">Ranger (User)</option>
              <option value="engineer">Ops (Engineer)</option>
              <option value="admin">Commander (Admin)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full btn-holo bg-holo-500/10 text-holo-500 border-holo-500 hover:bg-holo-500 hover:text-white mt-4 font-bold py-3 shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
          >
            REGISTER PROFILE
          </button>
        </form>
      </div>
    </div>
  );
}
