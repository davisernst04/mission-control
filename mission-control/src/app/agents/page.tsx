import { Bot, Zap, Clock, Shield } from 'lucide-react';
import { getAgents } from '@/lib/data';

export default async function AgentsPage() {
  const agents = await getAgents();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Neural Network</h1>
        <p className="text-zinc-500 mt-1">Status and configuration for your autonomous agents.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex items-start justify-between">
              <div className="flex gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{agent.name}</h3>
                  <p className="text-sm text-zinc-500 font-mono">ID: {agent.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {agent.status}
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  Model
                </div>
                <div className="text-sm font-medium text-white">{agent.model}</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                  <Clock className="w-3 h-3 text-blue-500" />
                  Active Sessions
                </div>
                <div className="text-sm font-medium text-white">{agent.sessions} active</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                  <Shield className="w-3 h-3 text-green-500" />
                  Access Level
                </div>
                <div className="text-sm font-medium text-white">Full / Restricted</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                  <Clock className="w-3 h-3 text-purple-500" />
                  Last Interaction
                </div>
                <div className="text-sm font-medium text-white">{agent.lastActive}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
