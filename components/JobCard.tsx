
import React from 'react';
import { RenderJob, RenderStatus, PublishStatus } from '../types';

interface JobCardProps {
  job: RenderJob;
  onPublish: (job: RenderJob) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onPublish }) => {
  const isPublished = job.publishedPlatforms?.some(p => p.status === PublishStatus.LIVE);

  const statusConfig = {
    [RenderStatus.IDLE]: { color: 'bg-slate-500', label: 'Idle' },
    [RenderStatus.QUEUED]: { color: 'bg-amber-500', label: 'Queued' },
    [RenderStatus.RENDERING]: { color: 'bg-indigo-500 animate-pulse', label: 'Rendering' },
    [RenderStatus.COMPLETED]: { color: 'bg-emerald-500', label: 'Ready' },
    [RenderStatus.FAILED]: { color: 'bg-rose-500', label: 'Error' },
  };

  return (
    <div className="glass rounded-3xl overflow-hidden hover:border-indigo-500/30 transition-all group relative">
      {/* Platform Status Overlays */}
      {isPublished && (
        <div className="absolute top-14 right-4 z-10 flex flex-col gap-1">
          {job.publishedPlatforms?.filter(p => p.status === PublishStatus.LIVE).map(p => (
            <div key={p.id} className="bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 px-2 py-0.5 rounded text-[8px] font-black text-emerald-400 uppercase tracking-tighter">
              {p.name} LIVE
            </div>
          ))}
        </div>
      )}

      <div className="absolute top-4 right-4 z-10 flex gap-2">
         <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-bold text-slate-300 mono uppercase tracking-wider">
           {job.resolution}
         </span>
         <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-bold text-slate-300 mono uppercase tracking-wider">
           {job.aspectRatio}
         </span>
      </div>

      <div className="relative aspect-[16/10] bg-slate-950 flex items-center justify-center overflow-hidden">
        {job.status === RenderStatus.COMPLETED && job.videoUrl ? (
          <video 
            src={job.videoUrl} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            controls 
            muted
          />
        ) : job.thumbnail ? (
          <img src={job.thumbnail} alt={job.name} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[2s]" />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-white/5" />
              <div className="absolute inset-0 w-16 h-16 rounded-full border-t-2 border-indigo-500 animate-spin" />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] animate-pulse">Computing</span>
              <span className="text-[9px] text-slate-600 mono">Asset ID: {job.id}</span>
            </div>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
           <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${statusConfig[job.status].color}`} />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">{statusConfig[job.status].label}</span>
           </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">{job.name}</h3>
          <span className="text-[10px] text-slate-500 font-medium">{new Date(job.timestamp).toLocaleDateString()}</span>
        </div>
        
        <p className="text-xs text-slate-400 line-clamp-2 mb-6 min-h-[2.5rem] leading-relaxed italic">
          "{job.prompt}"
        </p>
        
        {job.status === RenderStatus.RENDERING ? (
          <div className="space-y-3 bg-white/5 p-3 rounded-2xl border border-white/5">
             <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                <span className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                   Processing...
                </span>
                <span className="mono text-indigo-400">{job.progress}%</span>
             </div>
             <div className="w-full bg-slate-800/50 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                  style={{ width: `${job.progress}%` }}
                />
             </div>
          </div>
        ) : job.status === RenderStatus.COMPLETED ? (
          <div className="flex gap-3">
            <button 
              className="flex-1 bg-white/10 hover:bg-white/20 text-white text-[11px] font-black py-2.5 rounded-xl transition-all active:scale-95 border border-white/5 uppercase tracking-widest"
              onClick={() => onPublish(job)}
            >
              DISTRIBUTE
            </button>
            <button className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        ) : job.status === RenderStatus.FAILED ? (
          <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl text-center">
             <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">Error: Asset Corrupted</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default JobCard;
