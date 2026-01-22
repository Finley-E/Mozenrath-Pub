
import React from 'react';
import { RenderJob, RenderStatus, PublishStatus } from '../types';

interface JobCardProps {
  job: RenderJob;
  onPublish: (job: RenderJob) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onPublish }) => {
  const isPublished = job.publishedPlatforms?.some(p => p.status === PublishStatus.LIVE);
  const hasFailures = job.publishedPlatforms?.some(p => p.status === PublishStatus.FAILED);

  const statusConfig = {
    [RenderStatus.IDLE]: { color: 'bg-slate-500', label: 'Idle' },
    [RenderStatus.QUEUED]: { color: 'bg-amber-500', label: 'Queued' },
    [RenderStatus.RENDERING]: { color: 'bg-indigo-500 animate-pulse', label: 'Rendering' },
    [RenderStatus.COMPLETED]: { color: 'bg-emerald-500', label: 'Ready' },
    [RenderStatus.FAILED]: { color: 'bg-rose-500', label: 'Error' },
  };

  return (
    <div className="glass rounded-[2rem] overflow-hidden hover:border-indigo-500/30 transition-all group relative border border-white/5">
      {/* Distribution Health Bar */}
      {job.publishedPlatforms && job.publishedPlatforms.length > 0 && (
        <div className="absolute top-14 left-4 z-10 flex gap-1.5 p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
          {job.publishedPlatforms.map(p => (
            <div 
              key={p.id} 
              title={`${p.name}: ${p.status}`}
              className={`w-2 h-2 rounded-full shadow-[0_0_5px] ${
                p.status === PublishStatus.LIVE ? 'bg-emerald-500 shadow-emerald-500/50' : 
                p.status === PublishStatus.FAILED ? 'bg-rose-500 shadow-rose-500/50' : 'bg-slate-700'
              }`}
            />
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
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] animate-pulse italic">Synthesizing</span>
              <span className="text-[8px] text-slate-600 mono uppercase tracking-widest mt-1">Ref: {job.id}</span>
            </div>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
           <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${statusConfig[job.status].color}`} />
              <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">{statusConfig[job.status].label}</span>
           </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{job.name}</h3>
          <span className="text-[9px] text-slate-500 font-bold uppercase mono">{new Date(job.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
        
        <p className="text-xs text-slate-500 line-clamp-2 mb-6 min-h-[2.5rem] leading-relaxed italic opacity-80">
          "{job.prompt}"
        </p>
        
        {job.status === RenderStatus.RENDERING ? (
          <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5">
             <div className="flex justify-between text-[9px] text-slate-500 uppercase font-black tracking-widest">
                <span className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                   Processing Node
                </span>
                <span className="mono text-indigo-400">{job.progress}%</span>
             </div>
             <div className="w-full bg-slate-800/50 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(99,102,241,0.6)]" 
                  style={{ width: `${job.progress}%` }}
                />
             </div>
          </div>
        ) : job.status === RenderStatus.COMPLETED ? (
          <div className="flex gap-2">
            <button 
              className={`flex-1 text-[10px] font-black py-3 rounded-xl transition-all active:scale-95 uppercase tracking-[0.2em] border shadow-lg ${
                hasFailures 
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20' 
                : isPublished 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' 
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
              onClick={() => onPublish(job)}
            >
              {hasFailures ? 'RESOLVE ERRORS' : isPublished ? 'MANAGE LIVE' : 'BROADCAST'}
            </button>
            <button className="px-4 bg-slate-900 border border-white/5 hover:border-indigo-500/50 text-slate-400 hover:text-white py-3 rounded-xl transition-all active:scale-95 group/btn">
              <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default JobCard;
