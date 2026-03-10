'use client';

export default function Header() {
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
    </header>
  );
}