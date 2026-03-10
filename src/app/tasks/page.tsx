'use client';

import { useState } from 'react';
import { useTaskStore, type Task, type TaskStatus, type ActivityItem } from '@/lib/store';
import { 
  Plus, 
  MoreHorizontal, 
  User, 
  Calendar,
  Activity,
  ArrowRight,
  CheckCircle2,
  X
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

const columns: { title: string; status: TaskStatus; color: string }[] = [
  { title: 'Backlog', status: 'Backlog', color: 'bg-zinc-500' },
  { title: 'In Progress', status: 'In Progress', color: 'bg-blue-500' },
  { title: 'In Review', status: 'In Review', color: 'bg-blue-500' },
  { title: 'Done', status: 'Done', color: 'bg-emerald-500' },
];

const priorityColors = {
  High: 'bg-red-500/10 text-red-500 border-red-500/20',
  Medium: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  Low: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

const activityIcons = {
  task_created: Plus,
  task_moved: ArrowRight,
  task_completed: CheckCircle2,
  comment_added: Activity,
};

function TaskCard({ task, onDragStart }: { task: Task; onDragStart: (e: React.DragEvent, taskId: string) => void }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className="group p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all cursor-grab active:cursor-grabbing shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30"
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <button className="opacity-0 group-hover:opacity-100 p-1 text-zinc-600 hover:text-white transition-all">
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors leading-relaxed mb-2">
        {task.title}
      </h4>
      
      {task.description && (
        <p className="text-xs text-zinc-500 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}
      
      <div className="pt-3 border-t border-zinc-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            task.assignee === 'Jarvis' 
              ? 'bg-purple-500/10 border border-purple-500/20' 
              : 'bg-blue-500/10 border border-blue-500/20'
          }`}>
            <User className={`w-3 h-3 ${
              task.assignee === 'Jarvis' ? 'text-purple-400' : 'text-blue-400'
            }`} />
          </div>
          <span className="text-[11px] text-zinc-500 font-medium">{task.assignee}</span>
        </div>
        
        {task.dueDate && (
          <div className="flex items-center gap-1 text-[10px] text-zinc-600">
            <Calendar className="w-3 h-3" />
            <span className="font-mono">{format(new Date(task.dueDate), 'MMM d')}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="w-72 flex-shrink-0 bg-zinc-950/40 border border-zinc-800/50 rounded-2xl p-4 h-fit">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-zinc-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Activity</h3>
      </div>
      
      <div className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {activities.map((activity) => {
          const Icon = activityIcons[activity.type];
          return (
            <div 
              key={activity.id} 
              className="group p-3 rounded-lg hover:bg-zinc-900/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 p-1.5 rounded-md ${
                  activity.type === 'task_completed' ? 'bg-emerald-500/10 text-emerald-400' :
                  activity.type === 'task_created' ? 'bg-blue-500/10 text-blue-400' :
                  activity.type === 'task_moved' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-zinc-700/50 text-zinc-400'
                }`}>
                  <Icon className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-300 leading-snug">
                    {activity.message}
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-1 font-mono">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        
        {activities.length === 0 && (
          <div className="text-center py-8 text-xs text-zinc-600 italic">
            No recent activity
          </div>
        )}
      </div>
    </div>
  );
}

function NewTaskModal({ 
  isOpen, 
  onClose, 
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [assignee, setAssignee] = useState<'Jarvis' | 'Davis'>('Jarvis');
  const [dueDate, setDueDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status: 'Backlog',
      priority,
      assignee,
      dueDate: dueDate || undefined,
    });
    
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setAssignee('Jarvis');
    setDueDate('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Create New Task</h2>
          <button onClick={onClose} className="p-1 text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500"
              placeholder="Task title..."
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 resize-none h-20"
              placeholder="Task description..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Assignee</label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Jarvis">Jarvis</option>
                <option value="Davis">Davis</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 uppercase tracking-wider">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Create Task
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const { tasks, activities, moveTask, addTask } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (draggedTask) {
      moveTask(draggedTask, status);
      setDraggedTask(null);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Task Board</h1>
          <p className="text-zinc-500 mt-1">Manage tasks for Jarvis and Davis</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-6 pb-4 min-w-min">
            {columns.map((column) => (
              <div
                key={column.status}
                className="flex-shrink-0 w-96 flex flex-col space-y-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.status)}
              >
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${column.color}`} />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">{column.title}</h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-500">
                      {tasks.filter(t => t.status === column.status).length}
                    </span>
                  </div>
                </div>

                <div className="flex-1 rounded-2xl bg-zinc-950/30 border border-zinc-800/50 p-3 space-y-3 overflow-y-auto min-h-[400px]">
                  {tasks
                    .filter(t => t.status === column.status)
                    .map((task) => (
                      <TaskCard key={task.id} task={task} onDragStart={handleDragStart} />
                    ))}
                  
                  {tasks.filter(t => t.status === column.status).length === 0 && (
                    <div className="h-24 rounded-xl border border-dashed border-zinc-800 flex items-center justify-center text-xs text-zinc-700 font-medium italic">
                      No tasks in queue
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <ActivityFeed activities={activities} />
      </div>

      <NewTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={addTask} />
    </div>
  );
}
