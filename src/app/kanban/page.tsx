import { Plus, MoreHorizontal, User } from 'lucide-react';
import { getTasks } from '@/lib/data';

export default async function KanbanPage() {
  const tasks = await getTasks();

  const columns = [
    { title: 'Triage', status: 'Triage', tasks: [] },
    { title: 'In Progress', status: 'In Progress', tasks: tasks.filter(t => t.status === 'In Progress') },
    { title: 'Review', status: 'Review', tasks: tasks.filter(t => t.status === 'Review') },
    { title: 'Continuous', status: 'Continuous', tasks: tasks.filter(t => t.status === 'Continuous') },
  ];

  return (
    <div className="h-full flex flex-col space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Operations Board</h1>
        <p className="text-zinc-500 mt-1">Status tracking for active agent missions.</p>
      </div>

      <div className="flex-grow flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {columns.map((column, i) => (
          <div key={i} className="flex-shrink-0 w-80 flex flex-col space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{column.title}</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-500">
                  {column.tasks.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 text-zinc-600 hover:text-white transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
                <button className="p-1 text-zinc-600 hover:text-white transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-grow rounded-2xl bg-zinc-950/30 border border-zinc-800/50 p-3 space-y-3">
              {column.tasks.map((task, j) => (
                <div key={j} className="group p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all cursor-grab active:cursor-grabbing shadow-lg shadow-black/20">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      task.priority === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {task.priority}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 text-zinc-600 hover:text-white transition-all">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors leading-relaxed">
                    {task.title}
                  </h4>
                  <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <User className="w-3 h-3 text-blue-400" />
                      </div>
                      <span className="text-[11px] text-zinc-500 font-medium">{task.agent}</span>
                    </div>
                    <div className="text-[10px] text-zinc-600 font-mono">
                      v1.0
                    </div>
                  </div>
                </div>
              ))}
              
              {column.tasks.length === 0 && (
                <div className="h-24 rounded-xl border border-dashed border-zinc-800 flex items-center justify-center text-xs text-zinc-700 font-medium italic">
                  No tasks in queue
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
