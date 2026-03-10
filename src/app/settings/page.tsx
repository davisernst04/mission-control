'use client';

import { User, Globe, Bell, Save } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    callsign: 'Davis',
    role: 'Lead Orchestrator'
  });

  const [configs, setConfigs] = useState({
    autonomous: false,
    telemetry: true,
    darkMode: true
  });

  const [notifications, setNotifications] = useState([
    { id: 1, label: 'Critical Errors', enabled: true },
    { id: 2, label: 'Agent Milestones', enabled: true },
    { id: 3, label: 'System Health Alerts', enabled: true },
    { id: 4, label: 'Task Completed', enabled: false },
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('mission-control-settings');
    if (savedSettings) {
      try {
        const { profile, configs, notifications } = JSON.parse(savedSettings);
        if (profile) setProfile(profile);
        if (configs) setConfigs(configs);
        if (notifications) setNotifications(notifications);
      } catch (e) {
        console.error('Failed to parse saved settings', e);
      }
    }
  }, []);

  const handleSave = () => {
    const settings = { profile, configs, notifications };
    localStorage.setItem('mission-control-settings', JSON.stringify(settings));
    alert('Settings saved successfully to local storage.');
  };

  const toggleConfig = (key: keyof typeof configs) => {
    setConfigs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleNotification = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n));
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">System Settings</h1>
        <p className="text-zinc-500 mt-1">Configure your Mission Control environment and agent behavior.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <User className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-white">Operator Profile</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Callsign</label>
              <input 
                type="text" 
                value={profile.callsign} 
                onChange={(e) => setProfile(prev => ({ ...prev, callsign: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Workspace Role</label>
              <input 
                type="text" 
                value={profile.role} 
                onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              />
            </div>
          </div>
        </section>

        {/* Global Configuration */}
        <section className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <Globe className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold text-white">Global Configuration</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between group cursor-pointer" onClick={() => toggleConfig('autonomous')}>
              <div>
                <h4 className="text-sm font-medium text-zinc-200">Autonomous Execution</h4>
                <p className="text-xs text-zinc-500">Allow agents to execute terminal commands without confirmation.</p>
              </div>
              <div className={`w-10 h-5 rounded-full relative border transition-colors ${configs.autonomous ? 'bg-blue-600 border-blue-500/50 shadow-[0_0_10px_rgba(37,99,235,0.2)]' : 'bg-zinc-800 border-zinc-700'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${configs.autonomous ? 'right-1 bg-white' : 'left-1 bg-zinc-500'}`} />
              </div>
            </div>
            <div className="flex items-center justify-between group cursor-pointer" onClick={() => toggleConfig('telemetry')}>
              <div>
                <h4 className="text-sm font-medium text-zinc-200">Telemetry Streaming</h4>
                <p className="text-xs text-zinc-500">Stream real-time agent logs to the central dashboard.</p>
              </div>
              <div className={`w-10 h-5 rounded-full relative border transition-colors ${configs.telemetry ? 'bg-blue-600 border-blue-500/50 shadow-[0_0_10px_rgba(37,99,235,0.2)]' : 'bg-zinc-800 border-zinc-700'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${configs.telemetry ? 'right-1 bg-white' : 'left-1 bg-zinc-500'}`} />
              </div>
            </div>
            <div className="flex items-center justify-between group cursor-pointer" onClick={() => toggleConfig('darkMode')}>
              <div>
                <h4 className="text-sm font-medium text-zinc-200">Dark Mode Persistence</h4>
                <p className="text-xs text-zinc-500">Force deep zinc aesthetic across all interface modules.</p>
              </div>
              <div className={`w-10 h-5 rounded-full relative border transition-colors ${configs.darkMode ? 'bg-blue-600 border-blue-500/50 shadow-[0_0_10px_rgba(37,99,235,0.2)]' : 'bg-zinc-800 border-zinc-700'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${configs.darkMode ? 'right-1 bg-white' : 'left-1 bg-zinc-500'}`} />
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
            <Bell className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
          </div>
          <div className="space-y-4">
            {notifications.map((item) => (
              <div key={item.id} className="flex items-center justify-between group cursor-pointer" onClick={() => toggleNotification(item.id)}>
                <span className="text-sm text-zinc-300">{item.label}</span>
                <div className={`w-8 h-4 rounded-full relative border transition-colors ${
                  item.enabled ? 'bg-blue-600/20 border-blue-500/30' : 'bg-zinc-800 border-zinc-700'
                }`}>
                  <div className={`absolute top-0.5 w-2 h-2 rounded-full transition-all ${
                    item.enabled ? 'right-1 bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]' : 'left-1 bg-zinc-600'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 pt-4">
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Discard Changes
          </button>
          <button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}

