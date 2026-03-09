'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, GitBranch, Github, MoreVertical, Globe, X, ChevronDown, ChevronUp, Sparkles, Loader2 } from 'lucide-react';
import { openClawAction } from '@/lib/openclaw';
import { piClient } from '@/lib/api';

export interface Project {
  id: string;
  name: string;
  status: 'In Progress' | 'Stable' | 'Active External' | 'On Hold';
  priority: 'High' | 'Medium' | 'Low';
  url: string;
  lastUpdated: string;
}

// Initial projects from server
async function getInitialProjects(): Promise<Project[]> {
  try {
    const result = await openClawAction('projects');
    if (!result.success || !result.data) {
      return getDefaultProjects();
    }
    
    const serverProjects = Array.isArray(result.data) ? result.data : [];
    return serverProjects.map((p: any, index: number) => ({
      id: p.id?.toString() || `project-${index}`,
      name: p.name || 'Unnamed Project',
      status: p.status === 'Active' ? 'Stable' : (p.status as Project['status']) || 'Stable',
      priority: p.priority as Project['priority'] || 'Medium',
      url: p.url || `https://github.com/davisernst04/${p.name}`,
      lastUpdated: p.lastUpdated || new Date().toISOString().split('T')[0],
    }));
  } catch {
    return getDefaultProjects();
  }
}

function getDefaultProjects(): Project[] {
  return [
    {
      id: 'portfolio',
      name: 'Portfolio',
      status: 'Stable',
      priority: 'Medium',
      url: 'https://github.com/davisernst04/davisernst04',
      lastUpdated: new Date().toISOString().split('T')[0],
    },
    {
      id: 'typescript_gameboy_emulator',
      name: 'TypeScript GameBoy Emulator',
      status: 'In Progress',
      priority: 'High',
      url: 'https://github.com/davisernst04/typescript_gameboy_emulator',
      lastUpdated: new Date().toISOString().split('T')[0],
    },
  ];
}

const PRIORITY_OPTIONS: Project['priority'][] = ['High', 'Medium', 'Low'];
const STATUS_OPTIONS: Project['status'][] = ['In Progress', 'Stable', 'Active External', 'On Hold'];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // New project form state
  const [newProject, setNewProject] = useState({
    name: '',
    url: '',
    priority: 'Medium' as Project['priority'],
    prompt: '',
  });

  // Inline editing state
  const [editingField, setEditingField] = useState<{id: string; field: 'priority' | 'status'} | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  // Persist to localStorage when projects change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('mission-control-projects', JSON.stringify(projects));
    }
  }, [projects]);

  const loadProjects = async () => {
    setLoading(true);
    const stored = localStorage.getItem('mission-control-projects');
    if (stored) {
      setProjects(JSON.parse(stored));
    } else {
      const initial = await getInitialProjects();
      setProjects(initial);
    }
    setLoading(false);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : p
    ));
  };

  const handlePriorityChange = (projectId: string, priority: Project['priority']) => {
    updateProject(projectId, { priority });
    setEditingField(null);
  };

  const handleStatusChange = (projectId: string, status: Project['status']) => {
    updateProject(projectId, { status });
    setEditingField(null);
  };

  const createNewProject = async () => {
    if (!newProject.name.trim()) return;
    
    setIsCreating(true);
    
    try {
      // Call the API to create the project and optionally spawn a subagent
      const result = await piClient.request('/projects', {
        name: newProject.name,
        url: newProject.url,
        priority: newProject.priority,
        prompt: newProject.prompt,
      }, 'POST');

      // The API returns the created project
      const createdProject: Project = {
        id: result.id,
        name: result.name,
        status: 'In Progress',
        priority: result.priority,
        url: result.url,
        lastUpdated: result.lastUpdated,
      };

      // If a subagent was spawned, log it
      if (result.subagent?.spawned) {
        console.log('Subagent spawned:', result.subagent.message);
      }

      setProjects(prev => [...prev, createdProject]);
      setNewProject({ name: '', url: '', priority: 'Medium', prompt: '' });
      setShowNewProjectModal(false);
    } catch (error: any) {
      console.error('Failed to create project:', error.message);
      alert(`Failed to create project: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-zinc-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Project Matrix</h1>
          <p className="text-zinc-500 mt-1">Real-time status of all active repositories and ventures.</p>
        </div>
        <button 
          onClick={() => setShowNewProjectModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors text-sm"
        >
          Initialize New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div 
            key={project.id} 
            onClick={() => setSelectedProject(project)}
            className="group rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all p-5 flex flex-col h-full cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-colors">
                {project.id === 'portfolio' ? <Globe className="w-6 h-6" /> : <GitBranch className="w-6 h-6" />}
              </div>
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider cursor-pointer hover:opacity-80 ${
                  project.priority === 'High' ? 'bg-red-500/10 text-red-500' : 
                  project.priority === 'Medium' ? 'bg-blue-500/10 text-blue-500' : 'bg-zinc-500/10 text-zinc-500'
                }`}>
                  {project.priority}
                </span>
                <button className="p-1 text-zinc-600 hover:text-white transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-grow">
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{project.name}</h3>
              <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
                <div className={`w-2 h-2 rounded-full ${
                  project.status === 'In Progress' ? 'bg-blue-500' : 
                  project.status === 'Stable' ? 'bg-green-500' : 
                  project.status === 'Active External' ? 'bg-purple-500' : 'bg-yellow-500'
                }`} />
                {project.status}
              </div>
              
              <div className="grid grid-cols-1 gap-3 mb-6">
                <div className="p-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
                  <p className="text-[10px] text-zinc-600 uppercase font-bold mb-1">Last Update</p>
                  <p className="text-xs text-zinc-300">{project.lastUpdated}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-zinc-800/50 mt-auto" onClick={e => e.stopPropagation()}>
              <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-grow flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                View Source
              </a>
              <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors border border-transparent"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          />
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-blue-400">
                <GitBranch className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{selectedProject.name}</h2>
                <a 
                  href={selectedProject.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:underline flex items-center gap-1"
                >
                  View on GitHub <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              {/* Priority */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Priority</p>
                  {editingField?.id === selectedProject.id && editingField?.field === 'priority' ? (
                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                      {PRIORITY_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          onClick={() => handlePriorityChange(selectedProject.id, opt)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                            selectedProject.priority === opt 
                              ? opt === 'High' ? 'bg-red-500/20 text-red-500' 
                                : opt === 'Medium' ? 'bg-blue-500/20 text-blue-500'
                                : 'bg-zinc-500/20 text-zinc-500'
                              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p 
                      className={`font-medium cursor-pointer hover:opacity-80 ${
                        selectedProject.priority === 'High' ? 'text-red-500' : 
                        selectedProject.priority === 'Medium' ? 'text-blue-500' : 'text-zinc-500'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingField({ id: selectedProject.id, field: 'priority' });
                      }}
                    >
                      {selectedProject.priority}
                    </p>
                  )}
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingField(editingField?.id === selectedProject.id && editingField?.field === 'priority' ? null : { id: selectedProject.id, field: 'priority' });
                  }}
                  className="p-2 text-zinc-600 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
                >
                  {editingField?.id === selectedProject.id && editingField?.field === 'priority' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
                <div>
                  <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Status</p>
                  {editingField?.id === selectedProject.id && editingField?.field === 'status' ? (
                    <div className="flex flex-wrap gap-2" onClick={e => e.stopPropagation()}>
                      {STATUS_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleStatusChange(selectedProject.id, opt)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                            selectedProject.status === opt 
                              ? opt === 'In Progress' ? 'bg-blue-500/20 text-blue-500' 
                                : opt === 'Stable' ? 'bg-green-500/20 text-green-500'
                                : opt === 'Active External' ? 'bg-purple-500/20 text-purple-500'
                                : 'bg-yellow-500/20 text-yellow-500'
                              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        selectedProject.status === 'In Progress' ? 'bg-blue-500' : 
                        selectedProject.status === 'Stable' ? 'bg-green-500' : 
                        selectedProject.status === 'Active External' ? 'bg-purple-500' : 'bg-yellow-500'
                      }`} />
                      <p 
                        className="text-zinc-300 cursor-pointer hover:opacity-80"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingField({ id: selectedProject.id, field: 'status' });
                        }}
                      >
                        {selectedProject.status}
                      </p>
                    </div>
                  )}
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingField(editingField?.id === selectedProject.id && editingField?.field === 'status' ? null : { id: selectedProject.id, field: 'status' });
                  }}
                  className="p-2 text-zinc-600 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
                >
                  {editingField?.id === selectedProject.id && editingField?.field === 'status' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Last Updated */}
              <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
                <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Last Updated</p>
                <p className="text-zinc-300">{selectedProject.lastUpdated}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowNewProjectModal(false)}
          />
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <button 
              onClick={() => setShowNewProjectModal(false)}
              className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Initialize New Project</h2>
                <p className="text-sm text-zinc-500">Create a new project entry</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Project Name */}
              <div>
                <label className="block text-xs text-zinc-500 uppercase font-bold mb-2">Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My Awesome Project"
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Repository URL */}
              <div>
                <label className="block text-xs text-zinc-500 uppercase font-bold mb-2">Repository URL (optional)</label>
                <input
                  type="text"
                  value={newProject.url}
                  onChange={(e) => setNewProject(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://github.com/username/repo"
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs text-zinc-500 uppercase font-bold mb-2">Priority</label>
                <div className="flex gap-2">
                  {PRIORITY_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setNewProject(prev => ({ ...prev, priority: opt }))}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        newProject.priority === opt 
                          ? opt === 'High' ? 'bg-red-500/20 text-red-500 border border-red-500/30' 
                            : opt === 'Medium' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                            : 'bg-zinc-500/20 text-zinc-500 border border-zinc-500/30'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-transparent'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Section */}
              <div>
                <label className="block text-xs text-zinc-500 uppercase font-bold mb-2">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Prompt for AI Generation (optional)
                </label>
                <textarea
                  value={newProject.prompt}
                  onChange={(e) => setNewProject(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="Describe what you want the subagent to build..."
                  rows={4}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
                <p className="text-[10px] text-zinc-600 mt-1">
                  If provided, a gemini-cli subagent will be spawned to create this project
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowNewProjectModal(false)}
                  className="flex-1 px-4 py-3 bg-zinc-800 text-zinc-300 font-medium rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createNewProject}
                  disabled={!newProject.name.trim() || isCreating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Create Project
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Re-export the data functions for type safety
export { getProjects, getSystemStatus, getCareerInfo, getAgents, getCurrentAgent, getSubAgents, getTasks } from '@/lib/data';
export type { SystemStatus, CareerInfo, Agent, CurrentAgent, SubAgent, Task } from '@/lib/data';
