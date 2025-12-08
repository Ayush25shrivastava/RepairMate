import { useIssue } from '../context/IssueContext';
import { useAuth } from '../context/AuthContext';
import { Briefcase, CheckCircle, Clock } from 'lucide-react';
import StatCard from '../components/StatCard';
import SLAClock from '../components/SLAClock';

export default function OpsDashboard() {
  const { issues, updateStatus } = useIssue();
  const { user } = useAuth();

  const myAssignments = issues; // filtered by API
  const pending = myAssignments.filter(i => i.status !== 'RESOLVED' && i.status !== 'CLOSED');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-3xl font-orbitron font-bold text-white mb-1">OPS COMMAND</h2>
            <p className="text-gray-400 font-mono text-sm">Agent: {user.name} | Clearance: L4</p>
         </div>
         <div className="px-3 py-1 bg-space-800 border border-space-700 rounded text-xs font-mono text-success animate-pulse">
            SYSTEM LINK: STABLE
         </div>
      </div>

       {/* Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatCard label="ASSIGNED TASKS" value={myAssignments.length} icon={Briefcase} color="holo" />
         <StatCard label="PENDING ACTION" value={pending.length} icon={Clock} color="warn" />
         <StatCard label="COMPLETED" value={myAssignments.length - pending.length} icon={CheckCircle} color="success" />
      </div>

      {/* Task List */}
      <div className="space-y-4">
         <h3 className="text-lg font-orbitron font-bold text-white mb-4 border-l-4 border-holo-500 pl-3">ACTIVE ASSIGNMENTS</h3>
         
         {myAssignments.length === 0 ? (
            <div className="panel p-10 rounded-xl text-center">
               <p className="text-gray-500 font-mono">NO ACTIVE DIRECTIVES. STANDBY.</p>
            </div>
         ) : (
            myAssignments.map(task => (
               <div key={task._id} className="panel p-6 rounded-xl flex flex-col md:flex-row gap-6 hover:bg-space-800/80 transition-colors">
                  <div className="flex-1">
                     <div className="flex items-center gap-3 mb-2">
                        <span className={`badge ${task.priority === 'URGENT' ? 'border-alert text-alert' : 'border-holo-400 text-holo-400'}`}>
                           {task.priority}
                        </span>
                        <h4 className="font-bold text-white text-lg">{task.title}</h4>
                        <SLAClock targetDate={task.slaTargetResolutionDate} status={task.status} />
                     </div>
                     <p className="text-gray-400 text-sm mb-3">{task.description}</p>
                     <div className="flex gap-4 text-xs font-mono text-gray-500">
                        <span>LOC: {task.location?.name || 'UNKNOWN'}</span>
                        <span>ID: {task._id.slice(-6)}</span>
                     </div>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[200px]">
                     <label className="text-[10px] font-mono text-gray-400 uppercase">UPDATE STATUS</label>
                     <select 
                        className="input-tech text-xs py-2"
                        value={task.status}
                        onChange={(e) => updateStatus(task._id, e.target.value)}
                     >
                        <option value="ASSIGNED">ASSIGNED</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                     </select>
                     
                     {task.status === 'IN_PROGRESS' && (
                        <div className="mt-2 text-xs text-holo-400 animate-pulse flex items-center gap-2">
                           <Clock size={12} /> WORK IN PROGRESS...
                        </div>
                     )}
                  </div>
               </div>
            ))
         )}
      </div>
    </div>
  );
}
