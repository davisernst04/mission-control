'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  Briefcase, 
  Settings, 
  HeartPulse, 
  Zap, 
  Brain, 
  Rocket,
  ChevronLeft,
  Menu,
  Calendar,
  CheckSquare,
  FolderOpen,
  BookOpen,
  FileText,
  UsersRound,
  Building2
} from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: unknown[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { label: 'Overview', href: '/', icon: LayoutDashboard },
  { label: 'Tasks', href: '/tasks', icon: CheckSquare },
  { label: 'Calendar', href: '/calendar', icon: Calendar },
  { label: 'Projects', href: '/projects', icon: FolderOpen },
  { label: 'Memory', href: '/memory', icon: BookOpen },
  { label: 'Docs', href: '/docs', icon: FileText },
  { label: 'Team', href: '/team', icon: UsersRound },
  { label: 'Office', href: '/office', icon: Building2 },
  { label: 'Agents', href: '/agents', icon: Users },
  { label: 'Career', href: '/career', icon: Briefcase },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-800 bg-black/50 backdrop-blur-md flex flex-col h-full relative">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tighter text-white uppercase italic">
          Open<span className="text-blue-500">Claw</span>
        </h1>
        <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-medium">Mission Control</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <div className="py-2">
          <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Navigation</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group mb-1',
                  isActive 
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50 border border-transparent'
                )}
              >
                <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300')} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors",
          )}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
