'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header 
      className="h-16 border-b px-6 flex items-center justify-between relative z-50"
      style={{ 
        backgroundColor: 'var(--card)', 
        borderColor: 'var(--border)' 
      }}
    >
      <div className="flex items-center gap-4 flex-1">
        <h2 
          className="text-xs uppercase tracking-[0.2em] font-mono"
          style={{ color: 'var(--muted-foreground)' }}
        >
          OpenClaw System v4.2.0
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="p-2 transition-colors rounded-full hover:bg-[var(--muted)]"
          style={{ color: 'var(--foreground)' }}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  );
}