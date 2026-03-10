export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1C1917]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-stone-400">Loading...</p>
      </div>
    </div>
  );
}
