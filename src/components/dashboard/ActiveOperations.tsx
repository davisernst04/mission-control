'use client';

import { ArrowUpRight } from 'lucide-react';

interface Task {
  title: string;
  status: string;
  priority: string;
  agent: string;
}

interface ActiveOperationsProps {
  tasks: Task[];
}

export default function ActiveOperations({ tasks }: ActiveOperationsProps) {
  const handleTaskClick = (task: Task) => {
    alert(`Operation: ${task.title}\nStatus: ${task.status}\nPriority: ${task.priority}\nAssigned to: ${task.agent}`);
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden divide-y divide-zinc-800">
      {tasks.map((task, i) => (
        <div 
          key={i} 
          onClick={() => handleTaskClick(task)}
          className="p-4 hover:bg-zinc-800/20 transition-colors flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className={`w-2 h-2 rounded-full ${
              task.status === 'In Progress' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 
              task.status === 'Review' ? 'bg-amber-500' : 
              task.status === 'Continuous' ? 'bg-green-500' : 'bg-zinc-600'
            }`} />
            <div>
              <h4 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{task.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-zinc-500 font-mono">{task.agent}</span>
                <span className="text-[10px] text-zinc-700">•</span>
                <span className="text-xs text-zinc-500">{task.priority} Priority</span>
              </div>
            </div>
          </div>
          <button className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-white transition-all">
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
