import { openClawAction } from './openclaw';

/**
 * High-level data fetching functions for Mission Control.
 * These functions use openClawAction (REST API) directly to communicate with Pi.
 */

export interface SystemStatus {
  activeAgents: number;
  totalSessions: number;
  gatewayStatus: string;
  os: string;
  uptime: string;
  error?: string;
}

export async function getSystemStatus(): Promise<SystemStatus> {
  const result = await openClawAction('status');
  
  if (!result.success || !result.data) {
    return {
      activeAgents: 0,
      totalSessions: 0,
      gatewayStatus: 'Error',
      os: 'Unknown',
      uptime: 'Unknown',
      error: result.error || 'Failed to fetch status'
    };
  }

  const status = result.data;
  
  return {
    activeAgents: status.agents?.agents?.length || 0,
    totalSessions: status.agents?.totalSessions || 0,
    gatewayStatus: status.gateway?.reachable ? 'Operational' : 'Down',
    os: status.os?.label || 'Unknown',
    uptime: status.gatewayService?.runtimeShort || 'Unknown',
  };
}

export interface CareerInfo {
  internships: any[];
  mainGoal: string;
  deadline: string;
  content?: string;
  error?: string;
}

export async function getCareerInfo(): Promise<CareerInfo> {
  const result = await openClawAction('career');
  
  if (!result.success || !result.data) {
    return {
      internships: [],
      mainGoal: 'Summer 2026 Internship',
      deadline: 'TBD',
      error: result.error || 'Failed to fetch career data'
    };
  }

  return {
    ...result.data,
  };
}

export interface Project {
  id: string | number;
  name: string;
  status: string;
  priority: string;
  url: string;
  sourceUrl: string;
  lastUpdated?: string;
}

export async function getProjects(): Promise<Project[]> {
  const result = await openClawAction('projects');
  
  if (!result.success || !result.data) {
    return [];
  }
  
  return Array.isArray(result.data) ? result.data : [];
}

export interface Agent {
  id: string;
  name: string;
  status: string;
  model: string;
  sessions: number;
  lastActive: string;
}

export async function getAgents(): Promise<Agent[]> {
  const result = await openClawAction('agents');
  
  if (!result.success || !result.data) {
    return [];
  }
  
  const agents = Array.isArray(result.data) ? result.data : (result.data.agents || []);
  return agents;
}

export interface CurrentAgent {
  id: string;
  name: string;
  identityEmoji: string;
  status: 'active' | 'busy' | 'idle';
  model: string;
  lastActive: number;
}

export async function getCurrentAgent(): Promise<CurrentAgent | null> {
  const result = await openClawAction('agent');
  
  if (!result.success || !result.data) {
    return null;
  }
  
  return {
    id: result.data.id,
    name: result.data.identityName,
    identityEmoji: result.data.identityEmoji,
    status: result.data.status,
    model: result.data.model,
    lastActive: result.data.lastActive,
  };
}

export interface SubAgent {
  id: string;
  key: string;
  status: 'running' | 'completed' | 'failed';
  model: string;
  lastActive: number;
  ageMs: number;
  totalTokens: number | null;
}

export async function getSubAgents(): Promise<SubAgent[]> {
  const result = await openClawAction('subagents');
  
  if (!result.success || !result.data) {
    return [];
  }
  
  return result.data;
}

export interface Task {
  id: string | number;
  title: string;
  status: string;
  priority: string;
  agent: string;
}

export async function getTasks(): Promise<Task[]> {
  // Tasks API not yet implemented - returns empty array
  // TODO: Add tasks API endpoint on Pi
  return [];
}