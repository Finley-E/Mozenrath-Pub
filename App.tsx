
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import JobCard from './components/JobCard';
import { RenderJob, RenderStatus, PublishStatus, PlatformStatus } from './types';
import { GeminiService } from './services/geminiService';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    // Adding readonly to match potential system-level declarations of aistudio
    readonly aistudio: AIStudio;
  }
}

const Terminal: React.FC<{ logs: string[] }> = ({ logs }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass rounded-3xl border border-white/5 overflow-hidden flex flex-col h-[300px] lg:h-auto">
      <div className="bg-white/5 p-3 flex items-center justify-between border-b border-white/5">
        <div className="flex gap-1.5">
           <div className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
           <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
           <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
        </div>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mono">Control Center Log</span>
        <div className="w-10" />
      </div>
      <div 
        ref={terminalRef}
        className="flex-1 p-4 mono text-[11px] overflow-y-auto space-y-1 terminal-overlay relative"
      >
        {logs.map((log, i) => (
          <div key={i} className={`${log.startsWith('[ERR]') ? 'text-rose-400' : log.startsWith('[SYS]') ? 'text-indigo-400' : log.startsWith('[SOCIAL]') ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
            <span className="opacity-40">[{new Date().toLocaleTimeString()}]</span> {log}
          </div>
        ))}
        {logs.length === 0 && <div className="text-slate-700 italic">Awaiting telemetry...</div>}
        <div className="w-2 h-4 bg-indigo-500 inline-block animate-pulse ml-1" />
      </div>
    </div>
  );
};

const PublisherOverlay: React.FC<{ job: RenderJob; onClose: () => void; onComplete: (jobId: string, results: PlatformStatus[]) => void; addLog: (m: string) => void }> = ({ job, onClose, onComplete, addLog }) => {
  const [publishing, setPublishing] = useState(false);
  const [results, setResults] = useState<PlatformStatus[]>([
    { id: 'tiktok', name: 'TikTok', status: PublishStatus.IDLE, progress: 0 },
    { id: 'instagram', name: 'Instagram', status: PublishStatus.IDLE, progress: 0 },
    { id: 'youtube', name: 'YouTube', status: PublishStatus.IDLE, progress: 0 },
    { id: 'x', name: 'X / Twitter', status: PublishStatus.IDLE, progress: 0 },
  ]);

  const handlePublishAll = async () => {
    setPublishing(true);
    addLog(`[SOCIAL] Initiating Omni-Publish sequence for ${job.name}`);

    // Simulate parallel publishing
    const publishPromises = results.map(platform => {
      return new Promise<void>(async (resolve) => {
        setResults(prev => prev.map(p => p.id === platform.id ? { ...p, status: PublishStatus.UPLOADING } : p));
        addLog(`[SOCIAL] Connecting to ${platform.name} Gateway...`);
        
        // Mock upload progress
        for (let i = 0; i <= 100; i += Math.random() * 30) {
          await new Promise(r => setTimeout(r, 400));
          const prog = Math.min(Math.round(i), 100);
          setResults(prev => prev.map(p => p.id === platform.id ? { ...p, progress: prog } : p));
        }

        addLog(`[SOCIAL] Asset synced to ${platform.name} CDN.`);
        setResults(prev => prev.map(p => p.id === platform.id ? { ...p, status: PublishStatus.LIVE, progress: 100 } : p));
        resolve();
      });
    });

    await Promise.all(publishPromises);
    addLog(`[SOCIAL] Omni-Publish completed. All platforms LIVE.`);
    
    setTimeout(() => {
      onComplete(job.id, results.map(r => ({ ...r, status: PublishStatus.LIVE })));
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/60">
      <div className="glass w-full max-w-xl rounded-[3rem] p-10 border-white/10 shadow-[0_0_100px_rgba(99,102,241,0.3)] animate-in zoom-in-95 duration-300">
        <header className="mb-8 text-center">
           <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Omni-Publish Engine</h2>
           <p className="text-slate-400 text-sm mt-2">Broadcast "{job.name}" to all linked platforms at once.</p>
        </header>

        <div className="space-y-4 mb-10">
          {results.map((platform) => (
            <div key={platform.id} className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center font-black text-xs text-white uppercase tracking-tighter">
                {platform.id.slice(0, 2)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-white">{platform.name}</span>
                  <span className={`text-[10px] font-black mono ${platform.status === PublishStatus.LIVE ? 'text-emerald-400' : 'text-indigo-400'}`}>
                    {platform.status} {platform.progress}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                   <div 
                    className={`h-full transition-all duration-500 ${platform.status === PublishStatus.LIVE ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse'}`}
                    style={{ width: `${platform.progress}%` }}
                   />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button 
            disabled={publishing}
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 font-bold transition-all uppercase tracking-widest text-xs"
          >
            Cancel
          </button>
          <button 
            disabled={publishing}
            onClick={handlePublishAll}
            className="flex-[2] py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black transition-all shadow-xl shadow-emerald-600/20 uppercase tracking-widest text-xs"
          >
            {publishing ? 'Synchronizing Pipeline...' : 'Broadcast to All Platforms'}
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [jobs, setJobs] = useState<RenderJob[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [isApiKeySelected, setIsApiKeySelected] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [publishingJob, setPublishingJob] = useState<RenderJob | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [...prev.slice(-40), msg]);
  }, []);

  useEffect(() => {
    const checkKey = async () => {
      if (typeof window.aistudio !== 'undefined') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsApiKeySelected(hasKey);
        if (hasKey) addLog("[SYS] Neural link active. GPU clusters online.");
      }
    };
    checkKey();
  }, [addLog]);

  const handleSelectKey = async () => {
    if (typeof window.aistudio !== 'undefined') {
      await window.aistudio.openSelectKey();
      setIsApiKeySelected(true);
      addLog("[SYS] Auth level elevated. Production rights granted.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
        addLog(`[SYS] Seed asset detected: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRefinePrompt = async () => {
    if (!prompt.trim()) return;
    setIsRefining(true);
    addLog("[AI] Scanning script for semantic depth...");
    try {
      const refined = await GeminiService.refinePrompt(prompt);
      setPrompt(refined);
      addLog("[AI] Script refinement successful. Production value increased.");
    } catch (e) {
      addLog("[ERR] Refinement module out of sync.");
    } finally {
      setIsRefining(false);
    }
  };

  const startRender = async () => {
    if (!isApiKeySelected) return;
    if (!prompt.trim()) return;

    const newJob: RenderJob = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      name: `SYNTH_${Date.now().toString().slice(-4)}`,
      prompt: prompt,
      status: RenderStatus.RENDERING,
      progress: 0,
      timestamp: Date.now(),
      resolution,
      aspectRatio,
      thumbnail: base64Image || undefined
    };

    setJobs(prev => [newJob, ...prev]);
    setActiveTab('dashboard');
    addLog(`[JOB] Spawning process thread ${newJob.id}...`);

    try {
      const videoUrl = await GeminiService.generateVideo({
        prompt: prompt,
        resolution,
        aspectRatio,
        image: base64Image || undefined,
        onProgress: (status) => {
          addLog(`[RENDER] ${status}`);
          setJobs(prev => prev.map(j => 
            j.id === newJob.id ? { ...j, progress: Math.min(j.progress + 10, 98) } : j
          ));
        }
      });

      if (videoUrl) {
        setJobs(prev => prev.map(j => 
          j.id === newJob.id ? { ...j, status: RenderStatus.COMPLETED, progress: 100, videoUrl } : j
        ));
        addLog(`[SYS] Asset ${newJob.id} compiled successfully.`);
      }
    } catch (error: any) {
      addLog(`[ERR] Critical failure in render pipe: ${error.message}`);
      if (error.message === 'KEY_EXPIRED') setIsApiKeySelected(false);
      setJobs(prev => prev.map(j => j.id === newJob.id ? { ...j, status: RenderStatus.FAILED } : j));
    }
    
    setPrompt('');
    setBase64Image(null);
  };

  const onPublishComplete = (jobId: string, results: PlatformStatus[]) => {
    setJobs(prev => prev.map(j => 
      j.id === jobId ? { ...j, publishedPlatforms: results } : j
    ));
    setPublishingJob(null);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Omni-Publish Overlay */}
      {publishingJob && (
        <PublisherOverlay 
          job={publishingJob} 
          onClose={() => setPublishingJob(null)} 
          onComplete={onPublishComplete}
          addLog={addLog}
        />
      )}

      <main className="flex-1 overflow-y-auto relative bg-transparent scroll-smooth">
        {!isApiKeySelected && (
          <div className="bg-indigo-600/10 border-b border-indigo-500/20 p-4 sticky top-0 z-50 backdrop-blur-xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <div>
                <p className="font-bold text-sm text-white uppercase tracking-tighter">Engine Lockdown</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Secure API Auth Required</p>
              </div>
            </div>
            <button 
              onClick={handleSelectKey}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-2 px-8 rounded-xl shadow-lg shadow-indigo-600/20 transition-all text-[10px] active:scale-95 uppercase tracking-widest"
            >
              Auth Cluster
            </button>
          </div>
        )}

        <div className="p-6 lg:p-12 max-w-7xl mx-auto w-full space-y-12">
          {activeTab === 'dashboard' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Active Synth', value: jobs.filter(j => j.status === RenderStatus.RENDERING).length, icon: '⚡' },
                  { label: 'Asset Vault', value: jobs.length, icon: '📦' },
                  { label: 'Cluster Heat', value: '72°C', icon: '🔥' },
                  { label: 'Omni-Sync', value: 'READY', icon: '📡', color: 'text-emerald-400' },
                ].map((stat, i) => (
                  <div key={i} className="glass p-5 rounded-3xl border border-white/5 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-lg">{stat.icon}</div>
                     <div>
                        <p className="text-[10px] uppercase font-black text-slate-500 tracking-wider">{stat.label}</p>
                        <p className={`text-lg font-black ${stat.color || 'text-white'} tracking-tighter`}>{stat.value}</p>
                     </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <header className="flex justify-between items-center">
                  <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-3 uppercase italic">
                    <span className="w-2 h-8 bg-indigo-600 rounded-full" />
                    Asset Library & Broadcast
                  </h2>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {jobs.length > 0 ? (
                    jobs.map(job => <JobCard key={job.id} job={job} onPublish={setPublishingJob} />)
                  ) : (
                    <div className="col-span-full py-32 text-center bg-white/5 rounded-[3rem] border border-white/5 border-dashed">
                      <div className="text-4xl mb-4 grayscale opacity-40">🎬</div>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Awaiting primary synthesis job</p>
                      <button onClick={() => setActiveTab('create')} className="mt-4 text-indigo-400 text-[10px] font-black uppercase hover:underline tracking-widest">Open Synthesis Lab →</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="lg:col-span-7 space-y-10">
                <header>
                   <div className="bg-indigo-600/20 text-indigo-400 text-[9px] font-black px-3 py-1 rounded-full inline-block mb-3 uppercase tracking-[0.2em] border border-indigo-500/20">
                     Studio Module Active
                   </div>
                  <h2 className="text-5xl font-black text-white tracking-tighter mb-4 italic uppercase">
                    Visual <span className="text-indigo-500">Synthesis</span>
                  </h2>
                  <p className="text-slate-400 text-lg leading-relaxed max-w-lg font-medium">
                    Convert descriptions into high-fidelity cinematic assets for global distribution.
                  </p>
                </header>

                <div className="glass p-8 rounded-[2.5rem] space-y-8 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   </div>
                  
                  <div className="space-y-4 relative z-10">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex justify-between items-center">
                      Cinematic Script
                      <span className="text-indigo-400 font-bold">VEO_3.1_NODE</span>
                    </label>
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Atmospheric sequence involving high-contrast neon lighting, 35mm grain, cinematic dolly zoom..."
                      className="w-full bg-black/40 border border-white/5 rounded-3xl p-6 min-h-[180px] focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-800 text-lg leading-relaxed font-medium"
                    />
                    <div className="flex justify-between items-center px-1">
                      <div className="text-[10px] text-slate-600 mono font-bold uppercase tracking-widest">Buffer: {prompt.length} / 2000</div>
                      <button 
                        onClick={handleRefinePrompt}
                        disabled={isRefining || !prompt}
                        className={`text-[10px] font-black transition-all flex items-center gap-2 tracking-widest uppercase ${
                          isRefining ? 'text-indigo-400 animate-pulse' : 'text-slate-400 hover:text-indigo-400'
                        }`}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        {isRefining ? 'Optimizing...' : 'Refine Narrative'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 relative z-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quality Tier</label>
                      <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-2xl border border-white/5">
                        {['720p', '1080p'].map(res => (
                          <button
                            key={res}
                            onClick={() => setResolution(res as any)}
                            className={`py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${
                              resolution === res ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-600 hover:text-slate-400'
                            }`}
                          >
                            {res}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Asset Frame</label>
                      <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-2xl border border-white/5">
                        {['16:9', '9:16'].map(ratio => (
                          <button
                            key={ratio}
                            onClick={() => setAspectRatio(ratio as any)}
                            className={`py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${
                              aspectRatio === ratio ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-600 hover:text-slate-400'
                            }`}
                          >
                            {ratio}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={startRender}
                    disabled={!prompt || !isApiKeySelected}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-3xl font-black text-xs tracking-[0.3em] shadow-2xl shadow-indigo-600/40 transition-all transform active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-4 uppercase relative z-10 italic"
                  >
                    Initialize Synthesis Job
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-6 pt-10 lg:pt-32">
                 <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reference Node (Optional)</label>
                   <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="glass border-2 border-dashed border-white/10 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 hover:bg-white/5 transition-all overflow-hidden group"
                    >
                      {base64Image ? (
                        <img src={base64Image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Upload Keyframe</span>
                        </div>
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                 </div>

                 <Terminal logs={logs} />
              </div>
            </div>
          )}

          {(activeTab === 'library' || activeTab === 'settings') && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-800">
               <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center mb-6 text-2xl animate-pulse">⚙️</div>
               <h3 className="text-sm font-black text-slate-500 mb-1 uppercase tracking-widest">Layer Under Optimization</h3>
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Refining cloud infrastructure for {activeTab} engine</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
