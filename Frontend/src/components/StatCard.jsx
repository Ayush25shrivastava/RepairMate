export default function StatCard({ label, value, icon: Icon, color = "holo" }) {
    const colorClasses = {
      holo: "text-holo-400 border-holo-500/30 bg-holo-500/5",
      alert: "text-alert border-alert/30 bg-alert/5",
      warn: "text-warn border-warn/30 bg-warn/5",
      success: "text-success border-success/30 bg-success/5"
    }[color];
  
    return (
      <div className={`p-5 rounded-xl border ${colorClasses} relative overflow-hidden group`}>
        <div className="absolute right-0 top-0 p-3 opacity-20 group-hover:scale-110 transition-transform duration-500">
           {Icon && <Icon size={64} />}
        </div>
        
        <div className="relative z-10">
          <p className="text-xs font-mono uppercase tracking-widest opacity-70 mb-1">{label}</p>
          <div className="flex items-end gap-2">
             <span className="text-3xl font-bold font-orbitron">{value}</span>
             <span className="text-[10px] mb-1.5 opacity-50">UNITS</span>
          </div>
        </div>
  
        {/* Animated bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-current opacity-30 w-full">
           <div className="h-full bg-current w-1/3 animate-scanline" style={{ animationDuration: '3s' }} />
        </div>
      </div>
    );
  }
