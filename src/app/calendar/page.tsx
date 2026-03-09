'use client';

import { useState, useMemo } from 'react';
import { useTaskStore, type Task } from '@/lib/store';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  User,
  AlertCircle
} from 'lucide-react';
import { format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  startOfWeek as getWeekStart
} from 'date-fns';

const priorityColors = {
  High: 'bg-red-500 text-red-100',
  Medium: 'bg-amber-500 text-amber-100',
  Low: 'bg-blue-500 text-blue-100',
};

const statusColors = {
  Backlog: 'from-zinc-600 to-zinc-700',
  'In Progress': 'from-blue-600 to-blue-700',
  'In Review': 'from-amber-600 to-amber-700',
  Done: 'from-emerald-600 to-emerald-700',
};

function CalendarGrid({ 
  currentDate, 
  tasks,
  view 
}: { 
  currentDate: Date; 
  tasks: Task[];
  view: 'month' | 'week';
}) {
  const getDaysToShow = () => {
    if (view === 'month') {
      const start = startOfWeek(startOfMonth(currentDate));
      const end = endOfWeek(endOfMonth(currentDate));
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return eachDayOfInterval({ start, end });
    }
  };

  const daysToShow = getDaysToShow();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), date);
    });
  };

  return (
    <div className="bg-zinc-950/40 border border-zinc-800/50 rounded-2xl p-6">
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-bold text-zinc-500 uppercase tracking-wider py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {daysToShow.map((date) => {
          const datesTasks = getTasksForDate(date);
          const isCurrentMonth = isSameMonth(date, currentDate);
          
          return (
            <div
              key={date.toString()}
              className={`min-h-[120px] p-2 rounded-lg border transition-all ${
                isCurrentMonth
                  ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                  : 'bg-zinc-950/20 border-zinc-900'
              } ${isSameDay(date, new Date()) ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className={`text-xs font-bold mb-1 ${isCurrentMonth ? 'text-white' : 'text-zinc-600'}`}>
                {format(date, 'd')}
              </div>
              
              <div className="space-y-1 overflow-y-auto max-h-[90px] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                {datesTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded truncate text-white ${priorityColors[task.priority]} cursor-pointer hover:opacity-80 transition-opacity`}
                    title={task.title}
                  >
                    {task.title}
                  </div>
                ))}
                
                {datesTasks.length > 3 && (
                  <div className="text-[9px] text-zinc-500 px-1 italic">
                    +{datesTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UpcomingTasks({ tasks }: { tasks: Task[] }) {
  const upcomingTasks = useMemo(() => {
    const now = new Date();
    return tasks
      .filter(task => task.dueDate && new Date(task.dueDate) >= now && task.status !== 'Done')
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 8);
  }, [tasks]);

  return (
    <div className="bg-zinc-950/40 border border-zinc-800/50 rounded-2xl p-6">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Upcoming Tasks
      </h3>

      <div className="space-y-2">
        {upcomingTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/30 hover:border-zinc-700 transition-all"
          >
            <div className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${
              task.status === 'Done' ? 'bg-emerald-500' :
              task.status === 'In Review' ? 'bg-amber-500' :
              task.status === 'In Progress' ? 'bg-blue-500' :
              'bg-zinc-500'
            }`} />
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-200 font-medium leading-snug truncate">
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <User className="w-3 h-3 text-zinc-600" />
                <span className="text-[11px] text-zinc-500">{task.assignee}</span>
                {task.dueDate && (
                  <>
                    <span className="text-zinc-700">·</span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {format(new Date(task.dueDate), 'MMM d')}
                    </span>
                  </>
                )}
              </div>
            </div>

            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap flex-shrink-0 ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
          </div>
        ))}

        {upcomingTasks.length === 0 && (
          <div className="text-center py-8 text-xs text-zinc-600 italic">
            No upcoming tasks
          </div>
        )}
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const { tasks } = useTaskStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Calendar</h1>
          <p className="text-zinc-500 mt-1">Schedule and track task deadlines</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevious}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleToday}
            className="px-4 py-2 text-sm font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            Today
          </button>

          <button
            onClick={handleNext}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="px-4 py-2 text-lg font-bold text-white min-w-max">
            {format(currentDate, view === 'month' ? 'MMMM yyyy' : 'MMM d - ')}
            {view === 'week' && format(new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000), 'MMM d, yyyy')}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-zinc-800/30 border border-zinc-700/30 rounded-lg p-1">
          <button
            onClick={() => setView('month')}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-all ${
              view === 'month'
                ? 'bg-blue-600 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-all ${
              view === 'week'
                ? 'bg-blue-600 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Week
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6 min-h-0">
        <div className="col-span-2">
          <CalendarGrid currentDate={currentDate} tasks={tasks} view={view} />
        </div>

        <div>
          <UpcomingTasks tasks={tasks} />
        </div>
      </div>
    </div>
  );
}
