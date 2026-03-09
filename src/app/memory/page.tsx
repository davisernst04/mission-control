'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

interface DailyMemory {
  date: string;
  content: string;
}

interface SearchResult {
  file: string;
  matches: string[];
}

export default function MemoryPage() {
  const router = useRouter();
  const [dailyMemories, setDailyMemories] = useState<DailyMemory[]>([]);
  const [longTermMemory, setLongTermMemory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    async function loadMemories() {
      try {
        // Fetch daily memories
        const dailyRes = await fetch('/api/memory?action=daily');
        const daily = await dailyRes.json();
        setDailyMemories(daily);
        
        // Fetch long-term memory
        const longTermRes = await fetch('/api/memory?action=longterm');
        const longTerm = await longTermRes.json();
        setLongTermMemory(longTerm.content);
      } catch (error) {
        console.error('Error loading memories:', error);
      } finally {
        setLoading(false);
      }
    }
    loadMemories();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/memory?action=search&query=${encodeURIComponent(searchQuery)}`);
      const results = await res.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setSearching(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#0a0a0f] text-gray-100 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-gray-400">Loading memories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0a0a0f] text-gray-100 p-6 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Memory</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500 w-64"
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-gray-900 border border-gray-800">
          <h2 className="text-lg font-semibold mb-3 text-emerald-400">Search Results ({searchResults.length})</h2>
          {searchResults.map((result, idx) => (
            <div key={idx} className="mb-3 pb-3 border-b border-gray-800 last:border-0">
              <p className="text-sm font-medium text-gray-300 mb-1">{result.file}</p>
              {result.matches.slice(0, 5).map((match, i) => (
                <p key={i} className="text-sm text-gray-500 pl-3 border-l-2 border-emerald-500/30">
                  {match}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Journal */}
        <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-emerald-400">Daily Journal</h2>
          {dailyMemories.length === 0 ? (
            <p className="text-gray-500">No daily memories found.</p>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-auto pr-2">
              {dailyMemories.map((memory) => (
                <div 
                  key={memory.date} 
                  className="p-4 rounded-lg bg-gray-950/50 border border-gray-800 hover:border-emerald-500 cursor-pointer transition-colors"
                  onClick={() => router.push(`/memory/${memory.date}`)}
                >
                  <p className="text-xs text-emerald-500 font-medium mb-2">{memory.date}</p>
                  <div className="text-sm text-gray-300 prose prose-invert prose-sm max-w-none line-clamp-6">
                    <ReactMarkdown>{memory.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Long-Term Memory */}
        <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-blue-400">Long-Term Memory</h2>
          {!longTermMemory ? (
            <p className="text-gray-500">No long-term memory found.</p>
          ) : (
            <div className="max-h-[60vh] overflow-auto pr-2">
              <div className="text-sm text-gray-300 prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{longTermMemory}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}