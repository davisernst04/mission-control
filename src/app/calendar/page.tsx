'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTaskStore, type Task } from '@/lib/store';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  User,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { format, 
  eachDayOfInterval, 
  isSameDay,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  isSameWeek,
  parseISO
} from 'date-fns';
import { openClawAction } from '@/lib/openclaw';

// Types for cron jobs
interface CronJob {
  id: string;
  name: string;
  schedule: {
    expr: string;
    tz: string;
  };
  state: {
    nextRunAtMs: number;
    lastRunAtMs: number;
    lastRunStatus: string;
  };
}

// Types for due dates
interface DueDate {
  id: string;
  title: string;
  date: string;
  description: string;
}

const priorityColors = {
  High: 'bg-red-500 text-red-100',
  Medium: 'bg-blue-500 text-blue-100',
  Low: 'bg-blue-500 text-blue-100',
};

const statusColors = {
  Backlog: 'from-zinc-600 to-zinc-700',
  'In Progress': 'from-blue-600 to-blue-700',
  'In Review': 'from-blue-600 to-blue-700',
  Done: 'from-emerald-600 to-emerald-700',
};

export default function CalendarPage() {
  const { tasks } = useTaskStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cronJobs, setCronJobs] = useState<CronJob[]>([]);
  const [dueDates, setDueDates] = useState<DueDate[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddDueDate, setShowAddDueDate] = useState(false);
  const [newDueDate, setNewDueDate] = useState({ title: '', date: '', description: '' });

  // Load cron jobs
  useEffect(() => {
    async function loadCronJobs() {
      try {
        const result = await openClawAction('cron/jobs');
        if (result.success && result.data?.jobs) {
          setCronJobs(result.data.jobs);
        }
      } catch (e) {
        console.error('Failed to load cron jobs:', e);
      }
    }
    loadCronJobs();
  }, []);

  // Load due dates from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('mission-control-due-dates');
    if (stored) {
      try {
        setDueDates(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse due dates:', e);
      }
    }
  }, []);

  // Save due dates to localStorage
  const saveDueDates = (dates: DueDate[]) => {
    setDueDates(dates);
    localStorage.setItem('mission-control-due-dates', JSON.stringify(dates));
  };

  // Add new due date
  const handleAddDueDate = () => {
    if (!newDueDate.title || !newDueDate.date) return;
    
    const dueDate: DueDate = {
      id: Date.now().toString(),
      title: newDueDate.title,
      date: newDueDate.date,
      description: newDueDate.description,
    };
    
    saveDueDates([...dueDates, dueDate]);
    setNewDueDate({ title: '', date: '', description: '' });
    setShowAddDueDate(false);
  };

  // Delete due date
  const handleDeleteDueDate = (id: string) => {
    saveDueDates(dueDates.filter(d => d.id !== id));
  };

  // Get current week's dates (Mon-Sun)
  const weekDates = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), date);
    });
  };

  // Get cron jobs for a specific date
  const getCronJobsForDate = (date: Date) => {
    return cronJobs.filter(job => {
      const nextRun = new Date(job.state.nextRunAtMs);
      const lastRun = job.state.lastRunAtMs ? new Date(job.state.lastRunAtMs) : null;
      
      return (lastRun && isSameDay(lastRun, date)) || isSameDay(nextRun, date);
    });
  };

  // Get due dates for a specific date
  const getDueDatesForDate = (date: Date) => {
    return dueDates.filter(d => isSameDay(parseISO(d.date), date));
  };

  // Check if date has any events (tasks, cron jobs, or due dates)
  const hasEvents = (date: Date) => {
    return getTasksForDate(date).length > 0 || 
           getCronJobsForDate(date).length > 0 || 
           getDueDatesForDate(date).length > 0;
  };

  const handlePrevious = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNext = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCloseDetail = () => {
    setSelectedDate(null);
  };

  // Get cron schedule as readable time
  const getCronTime = (expr: string) => {
    const parts = expr.split(' ');
    if (parts.length === 5) {
      const hour = parts[1].padStart(2, '0');
      const minute = parts[0].padStart(2, '0');
      return `${hour}:${minute}`;
    }
    return expr;
  };

  // Expanded date detail view
  if (selectedDate) {
    const dateTasks = getTasksForDate(selectedDate);
    const dateCronJobs = getCronJobsForDate(selectedDate);
    const dateDueDates = getDueDatesForDate(selectedDate);

    return (
      <div className="h-full flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {format(selectedDate, 'EEEE')}
            </h1>
            <p className="text-zinc-500 mt-1">
              {format(selectedDate, 'MMMM d, yyyy')}
            </p>
          </div>
          <button
            onClick={handleCloseDetail}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Back
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Tasks Section */}
          <div className="bg-zinc-950/40 border border-zinc-800/50 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              Tasks ({dateTasks.length})
            </h3>
            <div className="space-y-2">
              {dateTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/30"
                >
                  <div className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${
                    task.status === 'Done' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 font-medium">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-zinc-500">{task.assignee}</span>
                      <span className="text-zinc-700">·</span>
                      <span className="text-[11px] text-zinc-500">{task.status}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
              {dateTasks.length === 0 && (
                <p className="text-center py-4 text-xs text-zinc-600 italic">No tasks for this date</p>
              )}
            </div>
          </div>

          {/* Cron Jobs Section */}
          <div className="bg-zinc-950/40 border border-zinc-800/50 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Scheduled Jobs ({dateCronJobs.length})
            </h3>
            <div className="space-y-2">
              {dateCronJobs.map(job => (
                <div
                  key={job.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/30"
                >
                  <div className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${
                    job.state.lastRunStatus === 'ok' ? 'bg-emerald-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 font-medium">{job.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {getCronTime(job.schedule.expr)}
                      </span>
                      {job.state.lastRunAtMs && (
                        <>
                          <span className="text-zinc-700">·</span>
                          <span className="text-[11px] text-zinc-500">
                            Last: {format(new Date(job.state.lastRunAtMs), 'MMM d, h:mm a')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    job.state.nextRunAtMs && isSameDay(new Date(job.state.nextRunAtMs), selectedDate)
                      ? 'bg-emerald-500 text-emerald-100'
                      : 'bg-zinc-600 text-zinc-100'
                  }`}>
                    {job.state.nextRunAtMs && isSameDay(new Date(job.state.nextRunAtMs), selectedDate) ? 'Next' : 'Last'}
                  </span>
                </div>
              ))}
              {dateCronJobs.length === 0 && (
                <p className="text-center py-4 text-xs text-zinc-600 italic">No cron jobs scheduled for this date</p>
              )}
            </div>
          </div>

          {/* Due Dates Section */}
          <div className="bg-zinc-950/40 border border-zinc-800/50 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Due Dates ({dateDueDates.length})
            </h3>
            <div className="space-y-2">
              {dateDueDates.map(dueDate => (
                <div
                  key={dueDate.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/30 group"
                >
                  <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0 bg-blue-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 font-medium">{dueDate.title}</p>
                    {dueDate.description && (
                      <p className="text-[11px] text-zinc-500 mt-1">{dueDate.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteDueDate(dueDate.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {dateDueDates.length === 0 && (
                <p className="text-center py-4 text-xs text-zinc-600 italic">No due dates for this date</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Weekly calendar view
  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Calendar</h1>
          <p className="text-zinc-500 mt-1">Weekly schedule with cron jobs and due dates</p>
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
            {format(weekDates[0], 'MMM d')} - {format(weekDates[6], 'MMM d, yyyy')}
          </div>
        </div>

        <button
          onClick={() => setShowAddDueDate(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Due Date
        </button>
      </div>

      {/* Add Due Date Modal */}
      {showAddDueDate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-4">Add Due Date</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Title</label>
                <input
                  type="text"
                  value={newDueDate.title}
                  onChange={(e) => setNewDueDate({ ...newDueDate, title: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="Enter title..."
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Date</label>
                <input
                  type="date"
                  value={newDueDate.date}
                  onChange={(e) => setNewDueDate({ ...newDueDate, date: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Description (optional)</label>
                <textarea
                  value={newDueDate.description}
                  onChange={(e) => setNewDueDate({ ...newDueDate, description: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                  rows={3}
                  placeholder="Enter description..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowAddDueDate(false)}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDueDate}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 gap-3 min-h-0">
        {weekDates.map((date) => {
          const datesTasks = getTasksForDate(date);
          const datesCronJobs = getCronJobsForDate(date);
          const datesDueDates = getDueDatesForDate(date);
          const hasAnyEvents = hasEvents(date);
          
          return (
            <div
              key={date.toString()}
              onClick={() => handleDateClick(date)}
              className={`min-h-[200px] p-3 rounded-xl border cursor-pointer transition-all ${
                isSameWeek(date, currentDate)
                  ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                  : 'bg-zinc-950/20 border-zinc-900'
              } ${isSameDay(date, new Date()) ? 'ring-2 ring-blue-500' : ''} ${
                hasAnyEvents ? 'hover:bg-zinc-800/40' : ''
              }`}
            >
              <div className={`text-sm font-bold mb-2 ${
                isSameDay(date, new Date()) ? 'text-blue-400' : 
                isSameWeek(date, currentDate) ? 'text-white' : 'text-zinc-600'
              }`}>
                {weekDays[date.getDay()]}
              </div>
              <div className={`text-2xl font-bold mb-3 ${
                isSameDay(date, new Date()) ? 'text-blue-400' : 
                isSameWeek(date, currentDate) ? 'text-white' : 'text-zinc-600'
              }`}>
                {format(date, 'd')}
              </div>
              
              {/* Event indicators */}
              <div className="space-y-1.5 overflow-y-auto max-h-[120px]">
                {/* Tasks */}
                {datesTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className={`text-[10px] font-medium px-2 py-1 rounded truncate ${priorityColors[task.priority]}`}
                    title={task.title}
                  >
                    {task.title}
                  </div>
                ))}
                
                {/* Cron Jobs */}
                {datesCronJobs.map((job) => (
                  <div
                    key={job.id}
                    className="text-[10px] font-medium px-2 py-1 rounded truncate bg-purple-600 text-purple-100"
                    title={`${job.name} - ${getCronTime(job.schedule.expr)}`}
                  >
                    ⚡ {job.name}
                  </div>
                ))}
                
                {/* Due Dates */}
                {datesDueDates.map((dd) => (
                  <div
                    key={dd.id}
                    className="text-[10px] font-medium px-2 py-1 rounded truncate bg-amber-600 text-amber-100"
                    title={dd.title}
                  >
                    📅 {dd.title}
                  </div>
                ))}

                {hasAnyEvents && (
                  <div className="text-[9px] text-zinc-500 px-1 pt-1">
                    Click for details →
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