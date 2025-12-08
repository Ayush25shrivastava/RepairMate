import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AlertCircle, 
  Users, 
  Settings, 
  LogOut,
  Radio,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const RoleLabel = {
    user: 'Ranger',
    admin: 'Commander',
    engineer: 'Ops'
  }[user.role] || 'Cadet';

  const links = [
    { label: 'Command Deck', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Malfunctions', path: '/issues', icon: AlertCircle },
  ];

  if (user.role === 'admin') {
    links.push({ label: 'Ops Team', path: '/engineers', icon: Users });
  }

  return (
    <aside className="w-64 bg-space-900 border-r border-space-700 flex flex-col h-screen fixed left-0 top-0 z-50">
      {/* Brand */}
      <div className="p-6 border-b border-space-700">
        <div className="flex items-center gap-3 text-holo-400">
          <Radio className="animate-pulse" size={24} />
          <h1 className="font-orbitron font-bold text-xl tracking-wider text-white">
            ZORDON<span className="text-holo-500">.OPS</span>
          </h1>
        </div>
        <div className="mt-2 flex items-center gap-2 px-3 py-1 bg-space-800 rounded-lg border border-space-700">
          <div className={`w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-alert' : 'bg-holo-500'} animate-pulse`} />
          <span className="text-xs font-mono text-gray-400 uppercase">{RoleLabel} // Online</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm uppercase tracking-wide transition-all ${
                isActive 
                  ? 'bg-holo-500/10 text-holo-300 border border-holo-500/30' 
                  : 'text-gray-400 hover:bg-space-800 hover:text-white'
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-space-700 bg-space-950/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <img src={user.avatar || '/default-avatar.png'} alt="Av" className="w-10 h-10 rounded bg-space-700 object-cover border border-space-600" />
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded border border-alert/30 text-alert/80 hover:bg-alert/10 hover:text-alert transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <LogOut size={14} />
          Disconnect
        </button>
      </div>
    </aside>
  );
}
