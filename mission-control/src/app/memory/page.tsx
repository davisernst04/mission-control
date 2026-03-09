'use client';

import { useTaskStore } from '@/lib/stores/taskStore';

export default function MemoryPage() {
  const { tasks } = useTaskStore();
  
  return (
    <div className="h-screen bg-[#0a0a0f] text-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Memory</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-emerald-400">Daily Journal</h2>
          <p className="text-gray-500">Loading daily memories...</p>
        </div>
        <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-blue-400">Long-Term Memory</h2>
          <p className="text-gray-500">Loading long-term memories...</p>
        </div>
      </div>
    </div>
  );
}
