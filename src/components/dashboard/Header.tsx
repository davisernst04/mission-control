'use client';

import { useState } from 'react';
import { Bell, Search, Terminal, X, Command, Send } from 'lucide-react';

export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShell, setShowShell] = useState(false);
  const [command, setCommand] = useState('');
  const [shellHistory, setShellHistory] = useState<{ type: 'input' | 'output', text: string }[]>([]);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Jarvis Status', message: 'Primary agent transitioned to "Working" mode.', time: '2m ago', type: 'info' },
    { id: 2, title: 'Priority Deadline', message: 'SIRC Submission due in 11 days.', time: '1h ago', type: 'warning' },
    { id: 3, title: 'Shadow Basketball', message: 'New deployment successful on Vercel.', time: '5h ago', type: 'success' },
  ]);

  const dismissNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const newHistory = [...shellHistory, { type: 'input' as const, text: command }];
    
    // Mock responses
    let response = "Command acknowledged. Processing...";
    const cmd = command.toLowerCase().trim();
    
    if (cmd === '/status') response = "All systems operational. Jarvis is at 85% capacity.";
    else if (cmd === '/logs') response = "Fetching latest logs... [INFO] 14:22:01 - Deployment stable.";
    else if (cmd === '/deploy') response = "Deployment pipeline initiated for 'mission-control'.";
    else if (cmd.includes('hello')) response = "Hello, Commander. How can I assist you today?";
    
    setShellHistory([...newHistory, { type: 'output' as const, text: response }]);
    setCommand('');
  };

  return (
    <header className="h-16 border-b border-zinc-800 bg-black/50 backdrop-blur-md px-6 flex items-center justify-between relative z-50">
      <div className="flex items-center gap-4 flex-1">
        <h2 className="text-zinc-500 font-mono text-xs uppercase tracking-[0.2em]">OpenClaw System v4.2.0</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 transition-colors relative rounded-full ${showNotifications ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-black" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Notifications</h3>
                <span className="text-[10px] font-bold text-blue-500 uppercase">{notifications.length} New</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto divide-y divide-zinc-900">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-xs text-zinc-600 font-mono italic">No new notifications</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-4 hover:bg-zinc-900 transition-colors group relative">
                      <button 
                        onClick={() => dismissNotification(n.id)}
                        className="absolute right-2 top-2 p-1 text-zinc-700 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="flex justify-between items-start mb-1 pr-4">
                        <h4 className="text-xs font-bold text-zinc-200">{n.title}</h4>
                        <span className="text-[10px] text-zinc-600 font-mono">{n.time}</span>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-2 bg-zinc-900/50 border-t border-zinc-800">
                  <button 
                    onClick={clearAllNotifications}
                    className="w-full py-2 text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors"
                  >
                    Clear All Notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button 
          onClick={() => setShowShell(!showShell)}
          className={`flex items-center gap-2 p-1 pl-3 rounded-full border transition-all ${
            showShell 
              ? 'bg-blue-600 border-blue-500 text-white' 
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
          }`}
        >
          <Terminal className={`w-4 h-4 ${showShell ? 'text-white' : 'text-blue-400'}`} />
          <span className="text-xs font-mono">Open Shell</span>
          <div className="w-6 h-6 rounded-full bg-zinc-700 ml-1 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-zinc-600 to-zinc-800" />
          </div>
        </button>
      </div>

      {/* Shell Overlay */}
      {showShell && (
        <div className="absolute top-20 right-6 w-[480px] bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300 flex flex-col max-h-[500px]">
          <div className="p-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/30">
            <div className="flex items-center gap-2">
              <Command className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Mission Control Shell v1.0</span>
            </div>
            <button onClick={() => setShowShell(false)} className="text-zinc-600 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-2 min-h-[200px] bg-black/20">
            <div className="flex gap-2">
              <span className="text-green-500">davis@jarvis:~$</span>
              <span className="text-zinc-300 italic opacity-50">Session started at {new Date().toLocaleTimeString()}</span>
            </div>
            
            {shellHistory.map((item, i) => (
              <div key={i} className="space-y-1">
                {item.type === 'input' ? (
                  <div className="flex gap-2">
                    <span className="text-green-500">davis@jarvis:~$</span>
                    <span className="text-white">{item.text}</span>
                  </div>
                ) : (
                  <div className="text-blue-400 pl-4 border-l border-zinc-800 py-1">
                    {item.text}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-zinc-800 bg-zinc-900/20">
            <form onSubmit={handleCommand} className="relative">
              <input
                autoFocus
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Enter command (e.g., '/status')"
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-mono"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-blue-500 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-3 flex gap-2">
              {['/status', '/logs', '/deploy'].map((cmd) => (
                <button 
                  key={cmd}
                  onClick={() => {
                    setCommand(cmd);
                  }}
                  className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-colors"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
