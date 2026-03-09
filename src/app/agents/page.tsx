'use client';

import { useState, useEffect } from 'react';
import { Bot, Zap, Clock, Shield, Activity, Brain, ChevronDown, Loader2 } from 'lucide-react';

const AVAILABLE_MODELS = [
  'minimax-m2.5',
  'deepseek-chat',
  'kimi-k2',
  'glm-4',
  'flashlite',
  'flash',
  'haiku',
  'sonnet',
  'opus',
  'gpt-4o',
  'nano'
];

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

interface CurrentAgentData {
  id: string;
  name: string;
  identityEmoji: string;
  status: 'active' | 'busy' | 'idle';
  model: string;
  lastActive: number;
}

interface SubAgentData {
  id: string;
  key: string;
  status: 'running' | 'completed' | 'failed';
  model: string;
  lastActive: number;
  ageMs: number;
  totalTokens: number | null;
}

export default function AgentsPage() {
  const [agent, setAgent] = useState<CurrentAgentData | null>(null);
  const [subagents, setSubagents] = useState<SubAgentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch current agent
        const agentRes = await fetch('http://100.97.211.24:3002/api/agent');
        const agentData = await agentRes.json();
        if (agentData.success) {
          setAgent(agentData.data);
        }

        // Fetch subagents
        const subagentRes = await fetch('http://100.97.211.24:3002/api/subagents');
        const subagentData = await subagentRes.json();
        if (subagentData.success) {
          setSubagents(subagentData.data);
        }
      } catch (error) {
        console.error('Failed to fetch agent data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    // Refresh every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'running':
        return 'bg-green-500';
      case 'busy':
        return 'bg-amber-500';
      case 'completed':
        return 'bg-blue-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-zinc-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'active':
      case 'running':
        return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'busy':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'completed':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'failed':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      default:
        return 'bg-zinc-500/10 border-zinc-500/20 text-zinc-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-zinc-500">Loading agent data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Neural Network</h1>
        <p className="text-zinc-500 mt-1">Status and configuration for your autonomous agents.</p>
      </div>

      {/* Current Agent - Jarvis */}
      {agent && (
        <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-zinc-900/40 overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex items-start justify-between">
            <div className="flex gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
                <Bot className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-white">{agent.identityEmoji} {agent.name}</h3>
                  <span className="text-xs text-zinc-500 font-mono bg-zinc-800 px-2 py-0.5 rounded">Current Agent</span>
                </div>
                <p className="text-sm text-zinc-500 font-mono">ID: {agent.id}</p>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium ${getStatusBg(agent.status)}`}>
              <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)} ${agent.status === 'running' || agent.status === 'active' ? 'animate-pulse' : ''}`} />
              {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Model Selector */}
            <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-500 text-xs mb-2">
                <Brain className="w-3 h-3 text-purple-500" />
                Model
              </div>
              <div className="relative">
                <button 
                  onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-600 transition-colors"
                >
                  <span className="text-sm font-medium text-white truncate">{agent.model}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${modelDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {modelDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto">
                    {AVAILABLE_MODELS.map((model) => (
                      <button
                        key={model}
                        onClick={() => {
                          setModelDropdownOpen(false);
                          // TODO: Call API to change model
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-zinc-800 transition-colors ${
                          model === agent.model ? 'text-blue-400 bg-blue-500/10' : 'text-white'
                        }`}
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Status */}
            <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-500 text-xs mb-2">
                <Activity className="w-3 h-3 text-green-500" />
                Activity
              </div>
              <div className="text-sm font-medium text-white capitalize">{agent.status}</div>
              <div className="text-xs text-zinc-500 mt-1">
                {agent.status === 'busy' ? 'Processing request...' : 'Ready for commands'}
              </div>
            </div>
            
            {/* Last Active */}
            <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-500 text-xs mb-2">
                <Clock className="w-3 h-3 text-blue-500" />
                Last Active
              </div>
              <div className="text-sm font-medium text-white">{formatTimeAgo(agent.lastActive)}</div>
              <div className="text-xs text-zinc-500 mt-1">
                {new Date(agent.lastActive).toLocaleTimeString()}
              </div>
            </div>
            
            {/* Sessions */}
            <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
              <div className="flex items-center gap-2 text-zinc-500 text-xs mb-2">
                <Zap className="w-3 h-3 text-amber-500" />
                Subagents
              </div>
              <div className="text-sm font-medium text-white">{subagents.length} active</div>
              <div className="text-xs text-zinc-500 mt-1">
                {subagents.filter(s => s.status === 'running').length} running
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subagents Section */}
      {subagents.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Active Subagents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subagents.map((subagent) => (
              <div 
                key={subagent.id} 
                className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="text-sm font-medium text-white truncate">
                      {subagent.key.split(':').pop()?.substring(0, 8)}...
                    </span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBg(subagent.status)}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(subagent.status)} ${subagent.status === 'running' ? 'animate-pulse' : ''}`} />
                    {subagent.status}
                  </div>
                </div>
                
                <div className="space-y-2 text-xs text-zinc-500">
                  <div className="flex justify-between">
                    <span>Model:</span>
                    <span className="text-zinc-400 font-mono">{subagent.model?.split('/').pop()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="text-zinc-400">{formatDuration(subagent.ageMs)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tokens:</span>
                    <span className="text-zinc-400">{subagent.totalTokens?.toLocaleString() || '—'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
