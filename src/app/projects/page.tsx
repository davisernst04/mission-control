import { ExternalLink, GitBranch, Github, MoreVertical, Globe } from 'lucide-react';
import { getProjects } from '@/lib/data';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Project Matrix</h1>
          <p className="text-zinc-500 mt-1">Real-time status of all active repositories and ventures.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors text-sm">
          Initialize New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="group rounded-2xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all p-5 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-colors">
                {project.id === 'portfolio' ? <Globe className="w-6 h-6" /> : <GitBranch className="w-6 h-6" />}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                  project.priority === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
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
                  project.status === 'Active (External)' ? 'bg-purple-500' : 'bg-zinc-700'
                }`} />
                {project.status}
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
                  <p className="text-[10px] text-zinc-600 uppercase font-bold mb-1">Last Update</p>
                  <p className="text-xs text-zinc-300">{project.lastUpdated}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
                  <p className="text-[10px] text-zinc-600 uppercase font-bold mb-1">Health</p>
                  <p className="text-xs text-green-400">98%</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-zinc-800/50 mt-auto">
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
    </div>
  );
}
