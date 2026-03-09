import { create } from 'zustand';

export type TaskStatus = 'Backlog' | 'In Progress' | 'In Review' | 'Done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'High' | 'Medium' | 'Low';
  assignee: 'Jarvis' | 'Davis';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  type: 'task_created' | 'task_moved' | 'task_completed' | 'comment_added';
  message: string;
  taskId: string;
  timestamp: string;
}

interface TaskStore {
  tasks: Task[];
  activities: ActivityItem[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
}

// Sample tasks for demo
const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Fix TypeScript GameBoy Emulator',
    description: 'The emulator is currently broken. Need to debug the CPU instructions.',
    status: 'Backlog',
    priority: 'High',
    assignee: 'Jarvis',
    dueDate: '2026-03-15',
    createdAt: '2026-03-09T10:00:00Z',
    updatedAt: '2026-03-09T10:00:00Z',
  },
  {
    id: '2',
    title: 'Optimize portfolio for recruiters',
    description: 'Make the portfolio stand out with distinctive design and content.',
    status: 'Backlog',
    priority: 'Medium',
    assignee: 'Davis',
    dueDate: '2026-03-20',
    createdAt: '2026-03-09T10:00:00Z',
    updatedAt: '2026-03-09T10:00:00Z',
  },
  {
    id: '3',
    title: 'Deploy Shadow Basketball app',
    description: 'Ship the MVP to Vercel and test with the basketball club.',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Jarvis',
    dueDate: '2026-03-12',
    createdAt: '2026-03-09T10:00:00Z',
    updatedAt: '2026-03-09T10:00:00Z',
  },
  {
    id: '4',
    title: 'Review PR for Sports Engineering Club',
    description: 'Code review for the real-time game analysis app.',
    status: 'In Review',
    priority: 'Medium',
    assignee: 'Davis',
    createdAt: '2026-03-09T10:00:00Z',
    updatedAt: '2026-03-09T10:00:00Z',
  },
  {
    id: '5',
    title: 'Update MEMORY.md with learnings',
    description: 'Document recent session learnings for continuity.',
    status: 'Done',
    priority: 'Low',
    assignee: 'Jarvis',
    createdAt: '2026-03-09T10:00:00Z',
    updatedAt: '2026-03-09T14:00:00Z',
  },
];

const sampleActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'task_moved',
    message: 'Moved "Deploy Shadow Basketball app" to In Progress',
    taskId: '3',
    timestamp: '2026-03-09T14:30:00Z',
  },
  {
    id: '2',
    type: 'task_created',
    message: 'Created task "Fix TypeScript GameBoy Emulator"',
    taskId: '1',
    timestamp: '2026-03-09T14:00:00Z',
  },
  {
    id: '3',
    type: 'task_completed',
    message: 'Completed "Update MEMORY.md with learnings"',
    taskId: '5',
    timestamp: '2026-03-09T14:00:00Z',
  },
];

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: sampleTasks,
  activities: sampleActivities,
  
  addTask: (taskData) => set((state) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    
    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      type: 'task_created',
      message: `Created task "${taskData.title}"`,
      taskId: newTask.id,
      timestamp: now,
    };
    
    return {
      tasks: [...state.tasks, newTask],
      activities: [newActivity, ...state.activities],
    };
  }),
  
  moveTask: (taskId, newStatus) => set((state) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return state;
    
    const now = new Date().toISOString();
    const statusText = newStatus === 'Done' ? 'completed' : `moved to ${newStatus}`;
    
    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      type: newStatus === 'Done' ? 'task_completed' : 'task_moved',
      message: newStatus === 'Done' 
        ? `Completed "${task.title}"`
        : `Moved "${task.title}" to ${newStatus}`,
      taskId,
      timestamp: now,
    };
    
    return {
      tasks: state.tasks.map(t => 
        t.id === taskId ? { ...t, status: newStatus, updatedAt: now } : t
      ),
      activities: [newActivity, ...state.activities],
    };
  }),
  
  updateTask: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map(t => 
      t.id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    ),
  })),
  
  deleteTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== taskId),
  })),
  
  addActivity: (activityData) => set((state) => {
    const newActivity: ActivityItem = {
      ...activityData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    return {
      activities: [newActivity, ...state.activities],
    };
  }),
}));