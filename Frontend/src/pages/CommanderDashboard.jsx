import { AlertTriangle, Clock as ClockIcon, CheckCircle, Activity, Users } from 'lucide-react';
import { useIssue } from '../context/IssueContext';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import SLAClock from '../components/SLAClock';

export default function CommanderDashboard() {
  const { issues, engineers, assignEngineer } = useIssue();
  const { user } = useAuth();
  
  // Stats
  const criticalCount = issues.filter(i => i?.priority === 'URGENT' && i?.status !== 'CLOSED').length;
  const pendingCount = issues.filter(i => i?.status === 'PENDING').length;
  const activeCount = issues.filter(i => i?.status === 'IN_PROGRESS').length;

  return (
    <div className="space-y-8">
      {/* HUD Header */}
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-3xl font-orbitron font-bold text-white mb-1">COMMANDER DECK</h2>
            <p className="text-gray-400 font-mono text-sm">Welcome back, {user.name}. System integrity at 94%.</p>
         </div>
         <button className="btn-holo">GENERATE REPORT</button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <StatCard label="CRITICAL ALERTS" value={criticalCount} icon={AlertTriangle} color="alert" />
         <StatCard label="PENDING ASSIGN" value={pendingCount} icon={ClockIcon} color="warn" />
         <StatCard label="ACTIVE REPAIRS" value={activeCount} icon={Activity} color="holo" />
         <StatCard label="OPS AGENTS" value={engineers.length} icon={Users} color="success" />
      </div>

      {/* Main Issue Feed */}
      <div className="panel p-6 rounded-xl">
         <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold font-orbitron text-white">LIVE MALFUNCTION FEED</h3>
            <div className="flex gap-2">
               <span className="badge border-alert text-alert bg-alert/10">LIVE</span>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="text-xs font-mono text-gray-500 border-b border-space-700">
                     <th className="p-3">ID</th>
                     <th className="p-3">SEVERITY</th>
                     <th className="p-3">ISSUE</th>
                     <th className="p-3">LOCATION</th>
                     <th className="p-3">SLA TIMER</th>
                     <th className="p-3">STATUS</th>
                     <th className="p-3">ASSIGNEE</th>
                     <th className="p-3">ACTION</th>
                  </tr>
               </thead>
               <tbody className="text-sm">
                  {issues.map(issue => (
                     <tr key={issue._id} className="border-b border-space-700/50 hover:bg-space-800/30 transition-colors">
                        <td className="p-3 font-mono text-gray-400">#{issue._id.slice(-4)}</td>
                        <td className="p-3">
                           <span className={`badge ${issue.priority === 'URGENT' ? 'border-alert text-alert' : issue.priority === 'HIGH' ? 'border-warn text-warn' : 'border-holo-400 text-holo-400'}`}>
                              {issue.priority}
                           </span>
                        </td>
                        <td className="p-3 font-medium text-white">{issue.title}</td>
                        <td className="p-3 text-gray-400 font-mono text-xs">{(issue.location && issue.location.name) || 'N/A'}</td>
                        <td className="p-3">
                           <SLAClock targetDate={issue.slaTargetResolutionDate} status={issue.status} />
                        </td>
                        <td className="p-3">
                           <span className="text-xs font-bold px-2 py-1 rounded bg-space-800 border border-space-600">
                              {issue.status}
                           </span>
                        </td>
                        <td className="p-3">
                           {issue.Engineer ? (
                              <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full bg-holo-500" />
                                 <span className="text-xs text-holo-300">{issue.Engineer.name}</span>
                              </div>
                           ) : (
                              <span className="text-gray-600 text-xs italic">Unassigned</span>
                           )}
                        </td>
                        <td className="p-3">
                           {!issue.Engineer && (
                              <select 
                                 className="bg-space-900 border border-space-700 text-xs rounded p-1 text-white focus:border-holo-500 outline-none"
                                 onChange={(e) => assignEngineer(issue._id, e.target.value)}
                                 defaultValue=""
                              >
                                 <option value="" disabled>Deploy Ops...</option>
                                 {engineers.map(e => (
                                    <option key={e._id} value={e._id}>{e.name}</option>
                                 ))}
                              </select>
                           )}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
