import { 
  Bot, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  ArrowUpRight,
  TrendingUp,
  Target
} from 'lucide-react';
import { getSystemStatus, getTasks } from '@/lib/data';
import ActiveOperations from '@/components/dashboard/ActiveOperations';

export default async function Home() {
  const systemStatus = await getSystemStatus();
  const tasks = await getTasks();

  return (
    <div className="space-y-8">
      {/* Hero / Overview Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Workspace Overview</h1>
        <p className="text-zinc-500 mt-1">Status report for March 8, 2026. All systems {systemStatus.gatewayStatus === 'Operational' ? 'operational' : 'degraded'}.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Agents', value: systemStatus.activeAgents.toString(), icon: Bot, color: 'text-blue-500', trend: 'Online' },
          { label: 'Sessions', value: systemStatus.totalSessions.toString(), icon: Cpu, color: 'text-purple-500', trend: 'Stable' },
          { label: 'System Status', value: systemStatus.gatewayStatus, icon: Activity, color: 'text-green-500', trend: 'Pulse High' },
          { label: 'OS Platform', value: 'Linux', icon: ShieldCheck, color: 'text-amber-500', trend: 'Verified' },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="flex items-start justify-between">
              <div className={`p-2 rounded-lg bg-zinc-950 border border-zinc-800 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{stat.trend}</span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area - Active Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Active Operations</h2>
            <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 font-medium">
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <ActiveOperations tasks={tasks} />
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Career Progress */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Career Velocity
            </h2>
            <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-4">
              <div className="pt-2">
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <Target className="w-4 h-4 text-blue-400" />
                  Main Goal: <span className="text-white font-medium">Summer 2026 Internship</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Logs */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">System Logs</h2>
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-[11px] space-y-2 text-zinc-500">
              <div className="flex gap-2">
                <span className="text-zinc-700">[07:00:01]</span>
                <span className="text-green-500">INFO</span>
                <span>Morning briefing complete. Objectives set.</span>
              </div>
              <div className="flex gap-2 text-zinc-600">
                <span className="text-zinc-800">[08:00:05]</span>
                <span className="text-blue-500">CRON</span>
                <span>Internship scout job successful. 3 new opportunities.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-zinc-700">[12:44:12]</span>
                <span className="text-green-500">GATEWAY</span>
                <span>Gateway reachable at http://127.0.0.1:3002</span>
              </div>
              <div className="pt-2 animate-pulse">
                <span className="inline-block w-2 h-4 bg-zinc-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
