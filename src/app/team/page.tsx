'use client';

export default function TeamPage() {
  return (
    <div className="h-screen bg-[#0a0a0f] text-gray-100 p-6">
      <div className="mb-6 p-4 rounded-xl bg-emerald-900/20 border border-emerald-800">
        <p className="text-sm text-emerald-400 font-medium">Mission Statement</p>
        <p className="text-lg font-semibold mt-1">Every task either gets you closer to the internship or proves you're ready for it.</p>
      </div>
      <h1 className="text-2xl font-bold mb-6">Team</h1>
      <div className="p-6 rounded-xl bg-gray-900 border border-gray-800">
        <p className="text-gray-500">Organization chart loading...</p>
      </div>
    </div>
  );
}
