import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TaskStatus = 'Backlog' | 'In Progress' | 'In Review' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';
export type Assignee = 'Jarvis' | 'Davis';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: Assignee;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  scheduledFor?: string; // For proactive/scheduled tasks
  isRecurring?: boolean;
  recurringPattern?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  taskId: string;
  taskTitle: string;
  timestamp: string;
}

interface TaskStore {
  tasks: Task[];
  activityLog: ActivityLog[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
  addActivity: (action: string, taskId: string, taskTitle: string) => void;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksForJarvis: () => Task[];
  getScheduledTasks: () => Task[];
}

const generateId = () => Math.random().toString(36).substring(2, 11);
const now = () => new Date().toISOString();

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [
        {
          id: '1',
          title: 'Review portfolio updates',
          description: 'Check and approve the latest portfolio changes',
          status: 'In Review',
          priority: 'High',
          assignee: 'Davis',
          createdAt: now(),
          updatedAt: now(),
        },
        {
          id: '2',
          title: 'Send internship applications',
          description: 'Apply to 5 more companies for Summer 2026',
          status: 'Backlog',
          priority: 'High',
          assignee: 'Davis',
          createdAt: now(),
          updatedAt: now(),
        },
        {
          id: '3',
          title: 'Fix GameBoy emulator',
          description: 'Resolve the broken CPU emulation',
          status: 'In Progress',
          priority: 'Medium',
          assignee: 'Jarvis',
          createdAt: now(),
          updatedAt: now(),
        },
        {
          id: '4',
          title: 'Deploy Shadow Basketball',
          description: 'Ship v1.0 to production',
          status: 'Backlog',
          priority: 'High',
          assignee: 'Jarvis',
          createdAt: now(),
          updatedAt: now(),
          scheduledFor: '2026-03-15T10:00:00Z',
          isRecurring: false,
        },
        {
          id: '5',
          title: 'Weekly career review',
          description: 'Review application status and strategy',
          status: 'Done',
          priority: 'Medium',
          assignee: 'Davis',
          createdAt: now(),
          updatedAt: now(),
          isRecurring: true,
          recurringPattern: 'weekly',
        },
      ],
      activityLog: [
        {
          id: '1',
          action: 'Task created',
          taskId: '4',
          taskTitle: 'Deploy Shadow Basketball',
          timestamp: now(),
        },
        {
          id: '2',
          action: 'Status changed to In Progress',
          taskId: '3',
          taskTitle: 'Fix GameBoy emulator',
          timestamp: now(),
        },
      ],
      
      addTask: (taskData) => {
        const task: Task = {
          ...taskData,
          id: generateId(),
          createdAt: now(),
          updatedAt: now(),
        };
        set((state) => ({
          tasks: [...state.tasks, task],
        }));
        get().addActivity('Task created', task.id, task.title);
      },
      
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: now() }
              : task
          ),
        }));
        const task = get().tasks.find((t) => t.id === id);
        if (task) {
          get().addActivity('Task updated', id, task.title);
        }
      },
      
      deleteTask: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
        if (task) {
          get().addActivity('Task deleted', id, task.title);
        }
      },
      
      moveTask: (id, newStatus) => {
        const task = get().tasks.find((t) => t.id === id);
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, status: newStatus, updatedAt: now() }
              : t
          ),
        }));
        if (task) {
          get().addActivity(`Moved to ${newStatus}`, id, task.title);
        }
      },
      
      addActivity: (action, taskId, taskTitle) => {
        const activity: ActivityLog = {
          id: generateId(),
          action,
          taskId,
          taskTitle,
          timestamp: now(),
        };
        set((state) => ({
          activityLog: [activity, ...state.activityLog].slice(0, 50), // Keep last 50
        }));
      },
      
      getTasksByStatus: (status) => {
        return get().tasks.filter((task) => task.status === status);
      },
      
      getTasksForJarvis: () => {
        return get().tasks.filter(
          (task) => task.assignee === 'Jarvis' && task.status === 'Backlog'
        );
      },
      
      getScheduledTasks: () => {
        return get().tasks.filter((task) => task.scheduledFor);
      },
    }),
    {
      name: 'mission-control-tasks',
    }
  )
);
