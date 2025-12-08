import { useNavigate } from 'react-router-dom';
import { ArrowRight, Hexagon, Shield, Activity, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setShowLogin, setShowRegister } = useAuth();

  const handleEnterHub = () => {
    if (user) navigate('/dashboard');
    else setShowLogin(true);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-space-950 font-sans">
      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 border-[20px] border-space-900/50" />
      <div className="absolute top-8 left-8 text-holo-400 font-mono text-xs z-20 animate-pulse">
        SYSTEM.READY... CONNECTING TO SATELLITE...
      </div>
      <div className="absolute bottom-8 right-8 text-holo-400 font-mono text-xs z-20">
        SECURE CONNECTION ESTABLISHED
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-hub-glow pointer-events-none" />

      {/* Vibrant Background Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-holo-800/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse-glow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] bg-accent-pink/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="container mx-auto px-6 relative z-30 text-center">
        
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1 bg-holo-900/40 border border-holo-500/30 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.3)]">
           <Radio size={14} className="text-holo-400 animate-pulse" />
           <span className="text-holo-200 text-[10px] font-mono tracking-widest uppercase">Zordon Ops Hub v4.0</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-white via-holo-400 to-accent-pink mb-6 drop-shadow-[0_0_35px_rgba(168,85,247,0.5)]">
          FACILITY<br />COMMAND
        </h1>

        <p className="text-xl text-space-400 font-mono max-w-2xl mx-auto mb-12">
          Centralized control for Zord maintenance, Ranger complaints, and base integrity monitoring.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={handleEnterHub}
            className="group relative px-10 py-4 bg-holo-500/10 hover:bg-holo-500/20 border-2 border-holo-500 text-holo-300 hover:text-white font-orbitron font-bold tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
          >
            <span className="flex items-center gap-3">
              Initialize System <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </span>
            {/* Corner Vectors */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-holo-500 -mt-1 -ml-1" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-holo-500 -mb-1 -mr-1" />
          </button>
        </div>

        {/* Floating Modules */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
           {[
             { icon: Hexagon, title: "Zord Diagnostics", desc: "Real-time telemetry from all active mechs." },
             { icon: Shield, title: "Base Integrity", desc: "Shield harmonics and perimeter defense status." },
             { icon: Activity, title: "Ranger Vitals", desc: "Biometric monitoring during active combat." }
           ].map((mod, i) => (
             <div key={i} className="bg-space-800/80 backdrop-blur border border-space-700 p-6 relative group hover:border-holo-500/50 transition-colors hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-holo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <mod.icon size={32} className="text-holo-500 mb-4 mx-auto group-hover:scale-110 transition-transform duration-500" />
                <h3 className="font-orbitron font-bold text-white mb-2">{mod.title}</h3>
                <p className="font-mono text-xs text-space-400">{mod.desc}</p>
             </div>
           ))}
        </div>

      </div>
    </section>
  );
}
