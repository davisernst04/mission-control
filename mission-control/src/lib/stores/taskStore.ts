import { create } from 'zustand';

export type TaskStatus = 'backlog' | 'in_progress' | 'in_review' | 'done';
export type Assignee = 'jarvis' | 'davis';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee: Assignee;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  action: string;
  timestamp: Date;
  taskId?: string;
}

interface TaskStore {
  tasks: Task[];
  activities: Activity[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
  addActivity: (action: string, taskId?: string) => void;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByAssignee: (assignee: Assignee) => Task[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [
    {
      id: '1',
      title: 'Fix GameBoy Emulator PPU',
      description: 'Debug and fix the Picture Processing Unit in the TypeScript GameBoy emulator',
      status: 'backlog',
      assignee: 'jarvis',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Ship Shadow Basketball MVP',
      description: 'Complete the minimum viable product for the Shadow Basketball SaaS',
      status: 'in_progress',
      assignee: 'jarvis',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      title: 'Review Portfolio Updates',
      description: 'Go through the latest portfolio changes and approve for production',
      status: 'in_review',
      assignee: 'davis',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      title: 'Set up Mission Control 2.0',
      description: 'Build the new Task Board, Calendar, and other screens',
      status: 'done',
      assignee: 'jarvis',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  activities: [
    { id: '1', action: 'Initialized Task Board', timestamp: new Date() },
    { id: '2', action: 'Created Kanban columns', timestamp: new Date() },
  ],
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }],
    activities: [...state.activities, {
      id: Date.now().toString(),
      action: `Created task: ${task.title}`,
      timestamp: new Date(),
    }],
  })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t),
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id),
  })),
  moveTask: (id, newStatus) => set((state) => {
    const task = state.tasks.find((t) => t.id === id);
    return {
      tasks: state.tasks.map((t) => t.id === id ? { ...t, status: newStatus, updatedAt: new Date() } : t),
      activities: [...state.activities, {
        id: Date.now().toString(),
        action: `Moved "${task?.title}" to ${newStatus.replace('_', ' ')}`,
        timestamp: new Date(),
        taskId: id,
      }],
    };
  }),
  addActivity: (action, taskId) => set((state) => ({
    activities: [...state.activities, { id: Date.now().toString(), action, timestamp: new Date(), taskId }],
  })),
  getTasksByStatus: (status) => get().tasks.filter((t) => t.status === status),
  getTasksByAssignee: (assignee) => get().tasks.filter((t) => t.assignee === assignee),
}));
