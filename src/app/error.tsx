'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1C1917] text-stone-100">
      <div className="max-w-md p-8 rounded-2xl bg-[#292524] border border-[#44403C]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Something went wrong</h2>
        </div>
        <p className="text-stone-400 mb-4">
          {error.message || 'Failed to connect to the API. Please check your connection.'}
        </p>
        <button
          onClick={() => reset()}
          className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-medium transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
