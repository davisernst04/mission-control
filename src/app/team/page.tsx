'use client';

export default function TeamPage() {
  return (
    <div className="h-screen bg-black text-white p-6">
      <div className="mb-6 p-4 rounded-xl bg-blue-900/20 border border-blue-800">
        <p className="text-sm text-blue-400 font-medium">Mission Statement</p>
        <p className="text-lg font-semibold mt-1">Every task either gets you closer to the internship or proves you're ready for it.</p>
      </div>
      <h1 className="text-2xl font-bold mb-6">Team</h1>
      <div className="p-6 rounded-xl bg-[#1E1E1E] border border-[#3B3B3B]">
        <p className="text-gray-500">Organization chart loading...</p>
      </div>
    </div>
  );
}
