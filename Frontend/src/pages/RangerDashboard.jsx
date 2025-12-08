import { useState } from 'react';
import { useIssue } from '../context/IssueContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Check, Clock, AlertCircle } from 'lucide-react';
import StatCard from '../components/StatCard';
import SLAClock from '../components/SLAClock';

export default function RangerDashboard() {
  const { issues, createIssue } = useIssue();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const myIssues = issues; // API already filters for filtered 'my-issues'
  const resolvedCount = myIssues.filter(i => i.status === 'RESOLVED').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-3xl font-orbitron font-bold text-white mb-1">RANGER STATION</h2>
            <p className="text-gray-400 font-mono text-sm">Status: Active | Sector: Beta-4</p>
         </div>
         <button onClick={() => setShowModal(true)} className="btn-holo flex items-center gap-2">
            <Plus size={16} /> Report Malfunction
         </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatCard label="ACTIVE REPORTS" value={myIssues.length - resolvedCount} icon={AlertCircle} color="warn" />
         <StatCard label="RESOLVED" value={resolvedCount} icon={Check} color="success" />
         <StatCard label="AVG RESPONSE" value="42" icon={Clock} color="holo" />
      </div>

      {/* Issues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {myIssues.map(issue => (
            <div key={issue._id} className="panel p-5 rounded-xl group hover:-translate-y-1 transition-transform">
               <div className="flex justify-between items-start mb-3">
                  <span className={`badge ${issue.priority === 'URGENT' ? 'border-alert text-alert' : 'border-holo-400 text-holo-400'}`}>
                     {issue.priority}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">{new Date(issue.createdAt).toLocaleDateString()}</span>
               </div>
               
               <h3 className="font-bold text-white mb-2 truncate">{issue.title}</h3>
               <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10">{issue.description}</p>
               
               <div className="flex items-center justify-between border-t border-space-700 pt-3">
                  <div className="flex flex-col">
                     <span className="text-xs font-mono text-gray-500">STATUS</span>
                     <span className={`text-xs font-bold ${issue.status === 'RESOLVED' ? 'text-success' : 'text-warn'}`}>
                        {issue.status}
                     </span>
                  </div>
                  <div className="text-right">
                     <span className="text-xs font-mono text-gray-500 block">SLA</span>
                     <SLAClock targetDate={issue.slaTargetResolutionDate} status={issue.status} />
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* Create Modal */}
      {showModal && <CreateIssueModal onClose={() => setShowModal(false)} onSubmit={createIssue} />}
    </div>
  );
}

function CreateIssueModal({ onClose, onSubmit }) {
   const [form, setForm] = useState({ title: '', description: '', priority: 'MEDIUM', locationName: '' });
   
   const handleSubmit = async (e) => {
      e.preventDefault();
      // Adjust structure to match backend expectation if needed
      // Backend expects { title, description, priority, location: { name: ... } }
      const payload = {
         ...form,
         location: { name: form.locationName }
      };
      const success = await onSubmit(payload);
      if (success) onClose();
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
         <div className="panel p-8 rounded-2xl w-full max-w-lg border-holo-500/30 shadow-[0_0_50px_rgba(20,184,166,0.1)]">
            <h3 className="text-2xl font-orbitron font-bold text-white mb-6 border-b border-space-700 pb-2">
               INTAKE FORM <span className="text-holo-500 text-sm ml-2">// NEW MALFUNCTION</span>
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="text-xs font-mono text-holo-400 mb-1 block">ISSUE TITLE</label>
                  <input required className="input-tech" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Broken Comms Unit" />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-xs font-mono text-holo-400 mb-1 block">PRIORITY</label>
                     <select className="input-tech" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                        <option value="URGENT">URGENT</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-xs font-mono text-holo-400 mb-1 block">LOCATION</label>
                     <input className="input-tech" value={form.locationName} onChange={e => setForm({...form, locationName: e.target.value})} placeholder="Sector 7G" />
                  </div>
               </div>

               <div>
                  <label className="text-xs font-mono text-holo-400 mb-1 block">DETAILS</label>
                  <textarea required rows={4} className="input-tech resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the mechanical failure..." />
               </div>

               <div className="flex justify-end gap-4 mt-6">
                  <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-mono text-gray-400 hover:text-white transition-colors">CANCEL</button>
                  <button type="submit" className="btn-holo bg-holo-600/30 border-holo-400 text-holo-200">TRANSMIT</button>
               </div>
            </form>
         </div>
      </div>
   );
}
