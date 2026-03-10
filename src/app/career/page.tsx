import { Briefcase, MapPin, ExternalLink, Star, Clock } from 'lucide-react';
import { getCareerInfo } from '@/lib/data';
import ScoutButton from '@/components/dashboard/ScoutButton';

export default async function CareerPage() {
  const careerData = await getCareerInfo();
  const internships = careerData.internships || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Career Scout</h1>
          <p className="text-zinc-500 mt-1">Autonomous tracking of summer 2026 internship opportunities.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center gap-2 text-xs text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            Last Updated: 2026-03-08
          </div>
          <ScoutButton />
        </div>
      </div>

      {careerData.error && (
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
          {careerData.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {internships.map((job: any, i: number) => (
          <div key={i} className={`p-4 rounded-xl border transition-all ${
            job.isStar ? 'bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40' : 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-700'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg border ${
                  job.isStar ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500'
                }`}>
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white">{job.name}</h3>
                    {job.isStar && <Star className="w-4 h-4 text-blue-500 fill-blue-500" />}
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-400 uppercase tracking-wider">
                      {job.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        job.status === 'Open' ? 'bg-green-500' : job.status === 'Likely Open' ? 'bg-blue-500' : 'bg-red-500'
                      }`} />
                      {job.status}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-auto md:ml-0">
                <button className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors">
                  Details
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
