'use client';

import { Search } from 'lucide-react';

export default function ScoutButton() {
  const handleScout = () => {
    alert("Scanning for new opportunities...\n\nFound 3 potential matches:\n1. 7Shifts — Full Stack Intern (Saskatoon)\n2. Siemens — Software Developer (Remote)\n3. BlackBerry — Security Analyst (Remote)");
  };

  return (
    <button 
      onClick={handleScout}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors text-sm"
    >
      <Search className="w-4 h-4" />
      Run scout job
    </button>
  );
}
