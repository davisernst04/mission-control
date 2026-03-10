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
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>Workspace Overview</h1>
        <p className="mt-1" style={{ color: 'var(--muted-foreground)' }}>Status report for March 8, 2026. All systems {systemStatus.gatewayStatus === 'Operational' ? 'operational' : 'degraded'}.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Agents', value: systemStatus.activeAgents.toString(), icon: Bot, color: '#CC7722', trend: 'Online' },
          { label: 'Sessions', value: systemStatus.totalSessions.toString(), icon: Cpu, color: '#8B4513', trend: 'Stable' },
          { label: 'System Status', value: systemStatus.gatewayStatus, icon: Activity, color: '#228B22', trend: 'Pulse High' },
          { label: 'OS Platform', value: 'Linux', icon: ShieldCheck, color: '#D2B48C', trend: 'Verified' },
        ].map((stat, i) => (
          <div 
            key={i} 
            className="p-4 rounded-xl border hover:transition-colors"
            style={{ 
              backgroundColor: 'var(--card)', 
              borderColor: 'var(--border)' 
            }}
          >
            <div className="flex items-start justify-between">
              <div 
                className="p-2 rounded-lg border"
                style={{ 
                  backgroundColor: 'var(--background)', 
                  borderColor: 'var(--border)',
                  color: stat.color
                }}
              >
                <stat.icon className="w-5 h-5" />
              </div>
              <span 
                className="text-[10px] font-medium uppercase tracking-wider"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {stat.trend}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
              <h3 
                className="text-2xl font-bold mt-1"
                style={{ color: 'var(--foreground)' }}
              >
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area - Active Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Active Operations</h2>
            <button 
              className="text-xs transition-colors flex items-center gap-1 font-medium"
              style={{ color: 'var(--primary)' }}
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <ActiveOperations tasks={tasks} />
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Career Progress */}
          <div className="space-y-4">
            <h2 
              className="text-xl font-semibold flex items-center gap-2"
              style={{ color: 'var(--foreground)' }}
            >
              <TrendingUp className="w-5 h-5" style={{ color: '#228B22' }} />
              Career Velocity
            </h2>
            <div 
              className="p-5 rounded-xl border space-y-4"
              style={{ 
                backgroundColor: 'var(--card)', 
                borderColor: 'var(--border)' 
              }}
            >
              <div className="pt-2">
                <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  <Target className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  Main Goal: <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>Summer 2026 Internship</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Logs */}
          <div className="space-y-4">
            <h2 
              className="text-xl font-semibold"
              style={{ color: 'var(--foreground)' }}
            >
              System Logs
            </h2>
            <div 
              className="p-4 rounded-xl border font-mono text-[11px] space-y-2"
              style={{ 
                backgroundColor: 'var(--background)', 
                borderColor: 'var(--border)',
                color: 'var(--muted-foreground)' 
              }}
            >
              <div className="flex gap-2">
                <span style={{ color: 'var(--border)' }}>[07:00:01]</span>
                <span style={{ color: '#228B22' }}>INFO</span>
                <span>Morning briefing complete. Objectives set.</span>
              </div>
              <div className="flex gap-2" style={{ color: 'var(--muted-foreground)' }}>
                <span style={{ color: 'var(--border)' }}>[08:00:05]</span>
                <span style={{ color: 'var(--primary)' }}>CRON</span>
                <span>Internship scout job successful. 3 new opportunities.</span>
              </div>
              <div className="flex gap-2">
                <span style={{ color: 'var(--border)' }}>[12:44:12]</span>
                <span style={{ color: '#228B22' }}>GATEWAY</span>
                <span>Gateway reachable at http://127.0.0.1:3002</span>
              </div>
              <div className="pt-2 animate-pulse">
                <span className="inline-block w-2 h-4" style={{ backgroundColor: 'var(--border)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}