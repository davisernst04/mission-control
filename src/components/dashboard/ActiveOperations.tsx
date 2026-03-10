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
    <div 
      className="rounded-xl border overflow-hidden"
      style={{ 
        backgroundColor: 'var(--card)', 
        borderColor: 'var(--border)',
      }}
    >
      {tasks.map((task, i) => (
        <div 
          key={i} 
          onClick={() => handleTaskClick(task)}
          className="p-4 hover:bg-[var(--muted)] transition-colors flex items-center justify-between group cursor-pointer"
          style={{ borderBottom: i < tasks.length - 1 ? '1px solid var(--border)' : 'none' }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: 
                  task.status === 'In Progress' ? '#CC7722' : 
                  task.status === 'Review' ? '#D2B48C' : 
                  task.status === 'Continuous' ? '#228B22' : 'var(--muted-foreground)',
                boxShadow: task.status === 'In Progress' ? '0_0_8px_rgba(204,119,34,0.5)' : 'none'
              }}
            />
            <div>
              <h4 
                className="text-sm font-medium group-hover:transition-colors"
                style={{ color: 'var(--foreground)' }}
              >
                {task.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span 
                  className="text-xs font-mono"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {task.agent}
                </span>
                <span 
                  className="text-[10px]"
                  style={{ color: 'var(--border)' }}
                >
                  •
                </span>
                <span 
                  className="text-xs"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {task.priority} Priority
                </span>
              </div>
            </div>
          </div>
          <button 
            className="opacity-0 group-hover:opacity-100 p-2 transition-all"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}