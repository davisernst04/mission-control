'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

interface MemoryEntry {
  date: string;
  content: string;
}

export default function MemoryEntryPage() {
  const params = useParams();
  const router = useRouter();
  const date = params.date as string;
  const [memory, setMemory] = useState<MemoryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMemory() {
      try {
        const res = await fetch('/api/memory?action=daily');
        const data = await res.json();
        
        const entry = data.find((m: MemoryEntry) => m.date === date);
        if (entry) {
          setMemory(entry);
        } else {
          setError('Memory entry not found');
        }
      } catch (err) {
        setError('Failed to load memory');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMemory();
  }, [date]);

  if (loading) {
    return (
      <div className="h-screen bg-[#0a0a0f] text-gray-100 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-gray-400">Loading memory...</p>
        </div>
      </div>
    );
  }

  if (error || !memory) {
    return (
      <div className="h-screen bg-[#0a0a0f] text-gray-100 p-6 flex flex-col">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/memory')}
            className="p-2 rounded-lg bg-gray-900 border border-gray-800 hover:border-emerald-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Error</h1>
        </div>
        <p className="text-gray-400">{error || 'Memory not found'}</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0a0a0f] text-gray-100 p-6 overflow-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push('/memory')}
          className="p-2 rounded-lg bg-gray-900 border border-gray-800 hover:border-emerald-500 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>
        <h1 className="text-xl font-bold text-emerald-400">{memory.date}</h1>
      </div>

      <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown>{memory.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}