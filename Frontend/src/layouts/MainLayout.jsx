import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function MainLayout() {
  const { user } = useAuth();

  if (!user) return <Outlet />; // Should redirect to login usually

  return (
    <div className="min-h-screen bg-space-950 text-white font-sans selection:bg-holo-500/30">
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="ml-64 min-h-screen relative">
        {/* Top Header / HUD */}
        <header className="h-16 border-b border-space-700 bg-space-900/80 backdrop-blur-sm sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="h-2 w-24 bg-space-800 rounded-full overflow-hidden">
                <div className="h-full w-[60%] bg-holo-500 animate-pulse" />
             </div>
             <span className="text-xs font-mono text-holo-400">SYS.STATUS: NOMINAL</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
               <p className="text-[10px] text-gray-500 font-mono">SECTOR</p>
               <p className="text-xs font-bold font-orbitron text-white">ALPHA-9</p>
            </div>
            <div className="text-right">
               <p className="text-[10px] text-gray-500 font-mono">TIME</p>
               <p className="text-xs font-bold font-orbitron text-white">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-8 pb-20 animate-fade-in">
           <Outlet />
        </div>
      </main>

      {/* Scanline Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] bg-repeat opacity-20" />
    </div>
  );
}
