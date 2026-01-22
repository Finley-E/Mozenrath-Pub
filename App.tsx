
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import JobCard from './components/JobCard';
import { RenderJob, RenderStatus, PublishStatus, PlatformStatus, PlatformConnection, PlatformMetadata } from './types';
import { GeminiService } from './services/geminiService';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    // Fixed: Added readonly modifier to match existing global declarations in the environment
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

const PublisherOverlay: React.FC<{ 
  job: RenderJob; 
  onClose: () => void; 
  connections: PlatformConnection[];
  onComplete: (jobId: string, results: PlatformStatus[]) => void; 
  addLog: (m: string) => void 
}> = ({ job, onClose, connections, onComplete, addLog }) => {
  const [phase, setPhase] = useState<'drafting' | 'publishing'>('drafting');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<PlatformStatus[]>([]);

  useEffect(() => {
    const active = connections.filter(c => c.isConnected).map(c => ({
      id: c.id,
      name: c.name,
      status: PublishStatus.IDLE,
      progress: 0,
      metadata: undefined
    }));
    setResults(active);
    
    const generateMeta = async () => {
      addLog("[SOCIAL] Synchronizing AI narrators for broadcast...");
      const updated = await Promise.all(active.map(async p => {
        try {
          const meta = await GeminiService.generateSocialMetadata(job.prompt, p.name);
          return { ...p, metadata: meta, status: PublishStatus.DRAFTING };
        } catch (e) {
          return { ...p, status: PublishStatus.FAILED, errorMessage: "Metadata synthesis failed" };
        }
      }));
      setResults(updated);
    };
    generateMeta();
  }, [connections, job.prompt, addLog]);

  const publishToPlatform = async (platformId: string) => {
    const platform = results.find(r => r.id === platformId);
    if (!platform) return;

    setResults(prev => prev.map(p => p.id === platformId ? { ...p, status: PublishStatus.UPLOADING, progress: 0, errorMessage: undefined } : p));
    addLog(`[SOCIAL] Handshaking with ${platform.name} secure gateway...`);

    // Simulate random failures to test robust error handling (20% chance)
    const shouldFail = Math.random() < 0.2;
    const failurePoint = 30 + Math.random() * 40; // Randomly fail at some %

    try {
      const step = 5 + Math.random() * 10;
      for (let i = 0; i <= 100; i += step) {
        await new Promise(r => setTimeout(r, 400 + Math.random() * 300));
        const prog = Math.min(Math.round(i), 100);
        
        if (shouldFail && prog >= failurePoint) {
          const errors = ["API Rate Limit Exceeded", "Handshake Timeout", "Asset Storage Full", "Unauthorized Scope"];
          const errorMsg = errors[Math.floor(Math.random() * errors.length)];
          throw new Error(errorMsg);
        }

        setResults(prev => prev.map(p => p.id === platformId ? { ...p, progress: prog } : p));
      }

      addLog(`[SOCIAL] Successfully broadcasted to ${platform.name}. Node LIVE.`);
      setResults(prev => prev.map(p => p.id === platformId ? { ...p, status: PublishStatus.LIVE, progress: 100 } : p));
    } catch (err: any) {
      addLog(`[ERR] Broadcast to ${platform.name} interrupted: ${err.message}`);
      setResults(prev => prev.map(p => p.id === platformId ? { ...p, status: PublishStatus.FAILED, errorMessage: err.message } : p));
    }
  };

  const handleBroadcast = async () => {
    setPhase('publishing');
    setIsProcessing(true);
    addLog(`[SOCIAL] Initiating global broadcast sequence for ${job.id}`);

    const targets = results.filter(r => r.status !== PublishStatus.LIVE);
    await Promise.all(targets.map(t => publishToPlatform(t.id)));

    setIsProcessing(false);
  };

  const handleRetry = async (platformId: string) => {
    setIsProcessing(true);
    await publishToPlatform(platformId);
    setIsProcessing(false);
  };

  const allLive = results.length > 0 && results.every(r => r.status === PublishStatus.LIVE);
  const anyFailed = results.some(r => r.status === PublishStatus.FAILED);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/70 overflow-y-auto">
      <div className="glass w-full max-w-2xl rounded-[3rem] p-10 border-white/10 shadow-[0_0_100px_rgba(99,102,241,0.3)] animate-in zoom-in-95 duration-300 my-auto">
        <header className="mb-8 text-center relative">
           <button onClick={onClose} className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-colors">✕</button>
           <div className="text-indigo-500 font-black text-[10px] tracking-[0.3em] uppercase mb-2">Omni-Broadcast Pipeline</div>
           <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Distribution Control</h2>
        </header>

        {phase === 'drafting' ? (
          <div className="space-y-4 mb-10 max-h-[400px] overflow-y-auto px-2 custom-scrollbar">
            {results.map((p) => (
              <div key={p.id} className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-4 relative group hover:border-white/10 transition-all">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center font-black text-[10px] text-white uppercase">{p.name.slice(0, 2)}</div>
                      <span className="text-sm font-black text-white uppercase tracking-widest">{p.name}</span>
                   </div>
                   <span className="px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-[9px] font-bold">AI DRAFT READY</span>
                </div>
                {p.metadata ? (
                  <div className="space-y-3">
                    <p className="text-slate-400 text-xs italic line-clamp-3 leading-relaxed">"{p.metadata.caption}"</p>
                    <div className="flex flex-wrap gap-2">
                      {p.metadata.tags.map(t => <span key={t} className="text-indigo-400 text-[9px] mono font-bold">#{t}</span>)}
                    </div>
                  </div>
                ) : (
                  <div className="h-20 flex items-center justify-center text-slate-700 text-xs uppercase font-bold gap-3">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-800 border-t-indigo-500 animate-spin" />
                    Neural Drafting...
                  </div>
                )}
              </div>
            ))}
            {results.length === 0 && (
              <div className="p-12 text-center text-slate-600 uppercase font-black text-xs tracking-widest border-2 border-dashed border-white/5 rounded-[2rem]">
                No active neural links found. Check settings.
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 mb-10">
            {results.map((platform) => (
              <div key={platform.id} className={`bg-white/5 rounded-[2rem] p-5 border transition-all duration-500 flex items-center gap-6 ${
                platform.status === PublishStatus.FAILED ? 'border-rose-500/30' : 
                platform.status === PublishStatus.LIVE ? 'border-emerald-500/30' : 'border-white/5'
              }`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs text-white uppercase tracking-tighter ${
                  platform.status === PublishStatus.FAILED ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-950'
                }`}>
                  {platform.name.slice(0, 2)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white uppercase tracking-widest">{platform.name}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-black mono tracking-widest ${
                        platform.status === PublishStatus.LIVE ? 'text-emerald-400' : 
                        platform.status === PublishStatus.FAILED ? 'text-rose-400' : 'text-indigo-400'
                      }`}>
                        {platform.status === PublishStatus.FAILED ? 'LINK_FAILURE' : platform.status === PublishStatus.LIVE ? 'BROADCAST_LIVE' : `UPLOADING ${platform.progress}%`}
                      </span>
                    </div>
                  </div>
                  
                  {platform.status === PublishStatus.FAILED ? (
                    <div className="flex justify-between items-center gap-4">
                       <p className="text-[10px] text-rose-500/70 font-bold uppercase tracking-tight truncate">{platform.errorMessage || "Unknown exception"}</p>
                       <button 
                        disabled={isProcessing}
                        onClick={() => handleRetry(platform.id)}
                        className="bg-rose-500 hover:bg-rose-400 text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                       >
                         Retry
                       </button>
                    </div>
                  ) : (
                    <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                       <div 
                        className={`h-full transition-all duration-500 ${
                          platform.status === PublishStatus.LIVE ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                          'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-pulse'
                        }`}
                        style={{ width: `${platform.progress}%` }}
                       />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-4">
          {!allLive ? (
            <>
              <button 
                disabled={isProcessing}
                onClick={onClose}
                className="flex-1 py-5 rounded-[2rem] bg-white/5 hover:bg-white/10 text-slate-500 font-black transition-all uppercase tracking-widest text-[10px] border border-white/5"
              >
                Cancel Pipeline
              </button>
              <button 
                disabled={isProcessing || results.length === 0 || results.some(r => !r.metadata && r.status !== PublishStatus.FAILED)}
                onClick={handleBroadcast}
                className={`flex-[2] py-5 rounded-[2rem] font-black transition-all shadow-xl uppercase tracking-widest text-[10px] italic ${
                  anyFailed ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                }`}
              >
                {isProcessing ? 'Processing Cluster...' : anyFailed ? 'Retry Failed Nodes' : phase === 'drafting' ? 'Deploy Global Broadcast' : 'Resume Broadcast'}
              </button>
            </>
          ) : (
            <button 
              onClick={() => {
                onComplete(job.id, results);
                onClose();
              }}
              className="w-full py-5 rounded-[2rem] bg-emerald-600 hover:bg-emerald-500 text-white font-black transition-all shadow-2xl shadow-emerald-600/30 uppercase tracking-[0.3em] text-[10px]"
            >
              Verify Distribution & Close
            </button>
          )}
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

  const [connections, setConnections] = useState<PlatformConnection[]>([
    { id: 'tiktok', name: 'TikTok', icon: 'TT', isConnected: false, color: 'hover:bg-pink-600' },
    { id: 'instagram', name: 'Instagram', icon: 'IG', isConnected: false, color: 'hover:bg-purple-600' },
    { id: 'youtube', name: 'YouTube', icon: 'YT', isConnected: false, color: 'hover:bg-red-600' },
    { id: 'x', name: 'X / Twitter', icon: 'X', isConnected: false, color: 'hover:bg-slate-800' },
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [...prev.slice(-40), msg]);
  }, []);

  const toggleConnection = (id: string) => {
    setConnections(prev => prev.map(c => {
      if (c.id === id) {
        const newState = !c.isConnected;
        addLog(`[SOCIAL] ${newState ? 'Synchronizing' : 'Unlinking'} ${c.name} OAuth tunnel...`);
        return { ...c, isConnected: newState, username: newState ? `@nova_node_${c.id}` : undefined };
      }
      return c;
    }));
  };

  useEffect(() => {
    const checkKey = async () => {
      if (typeof window.aistudio !== 'undefined') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsApiKeySelected(hasKey);
        if (hasKey) addLog("[SYS] Neural link verified. Distribution nodes ready.");
      }
    };
    checkKey();
  }, [addLog]);

  const handleSelectKey = async () => {
    if (typeof window.aistudio !== 'undefined') {
      await window.aistudio.openSelectKey();
      setIsApiKeySelected(true);
      addLog("[SYS] Authorization elevated. Production engine primed.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
        addLog(`[SYS] Seed asset buffer cached: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRefinePrompt = async () => {
    if (!prompt.trim()) return;
    setIsRefining(true);
    addLog("[AI] Scanning narrative for cinematic high-fidelity markers...");
    try {
      const refined = await GeminiService.refinePrompt(prompt);
      setPrompt(refined);
      addLog("[AI] Prompt optimized. Cinematic score enhanced.");
    } catch (e) {
      addLog("[ERR] Refinement module offline.");
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
    addLog(`[JOB] Spawning process thread ${newJob.id} on master node...`);

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
        addLog(`[SYS] Asset ${newJob.id} synthesis complete.`);
      }
    } catch (error: any) {
      addLog(`[ERR] Pipeline failure: ${error.message}`);
      if (error.message === 'KEY_EXPIRED') setIsApiKeySelected(false);
      setJobs(prev => prev.map(j => j.id === newJob.id ? { ...j, status: RenderStatus.FAILED } : j));
    }
    
    setPrompt('');
    setBase64Image(null);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {publishingJob && (
        <PublisherOverlay 
          job={publishingJob} 
          onClose={() => setPublishingJob(null)} 
          connections={connections}
          onComplete={(id, res) => {
            setJobs(prev => prev.map(j => j.id === id ? { ...j, publishedPlatforms: res } : j));
            addLog(`[SOCIAL] Verify successful broadcast for asset ${id}.`);
          }}
          addLog={addLog}
        />
      )}

      <main className="flex-1 overflow-y-auto relative bg-transparent scroll-smooth custom-scrollbar">
        {!isApiKeySelected && (activeTab === 'create') && (
          <div className="bg-indigo-600/10 border-b border-indigo-500/20 p-4 sticky top-0 z-50 backdrop-blur-xl flex items-center justify-between px-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <div>
                <p className="font-black text-xs text-white uppercase tracking-widest">Locked</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Secure API Key Sync Required</p>
              </div>
            </div>
            <button 
              onClick={handleSelectKey}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-2.5 px-8 rounded-xl shadow-lg shadow-indigo-600/20 transition-all text-[10px] active:scale-95 uppercase tracking-widest"
            >
              Sync Key
            </button>
          </div>
        )}

        <div className="p-6 lg:p-12 max-w-7xl mx-auto w-full space-y-12">
          {activeTab === 'dashboard' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Synth Active', value: jobs.filter(j => j.status === RenderStatus.RENDERING).length, icon: '⚡' },
                  { label: 'Asset Vault', value: jobs.length, icon: '📦' },
                  { label: 'Active Links', value: connections.filter(c => c.isConnected).length, icon: '📡', color: 'text-emerald-400' },
                  { label: 'Broadcast Status', value: 'OPTIMAL', icon: '🌍', color: 'text-indigo-400' },
                ].map((stat, i) => (
                  <div key={i} className="glass p-5 rounded-3xl border border-white/5 flex items-center gap-4 group hover:border-white/10 transition-all">
                     <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">{stat.icon}</div>
                     <div>
                        <p className="text-[10px] uppercase font-black text-slate-500 tracking-wider">{stat.label}</p>
                        <p className={`text-lg font-black ${stat.color || 'text-white'} tracking-tighter`}>{stat.value}</p>
                     </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <header className="flex justify-between items-center px-2">
                  <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-3 uppercase italic">
                    <span className="w-2 h-8 bg-indigo-600 rounded-full" />
                    Asset Library
                  </h2>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {jobs.length > 0 ? (
                    jobs.map(job => <JobCard key={job.id} job={job} onPublish={setPublishingJob} />)
                  ) : (
                    <div className="col-span-full py-32 text-center bg-white/5 rounded-[3rem] border border-white/5 border-dashed">
                      <div className="text-4xl mb-4 opacity-40 grayscale">🎬</div>
                      <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Synthesis core awaiting input</p>
                      <button onClick={() => setActiveTab('create')} className="mt-4 text-indigo-400 text-[10px] font-black uppercase hover:underline tracking-widest">Access Synthesis Lab →</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <header className="text-center">
                  <h2 className="text-4xl font-black text-white tracking-tighter mb-4 italic uppercase">Distribution Nodes</h2>
                  <p className="text-slate-400 font-medium">Manage OAuth handshakes for global distribution channels.</p>
               </header>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {connections.map((c) => (
                   <div key={c.id} className={`glass rounded-[2.5rem] p-8 border-white/5 transition-all flex flex-col items-center gap-6 relative overflow-hidden group ${c.isConnected ? 'border-indigo-500/30 shadow-2xl shadow-indigo-500/10' : ''}`}>
                     <div className={`w-20 h-20 rounded-[2rem] bg-slate-900 flex items-center justify-center text-3xl font-black text-white ${c.color} transition-all duration-500 relative z-10`}>
                        {c.icon}
                     </div>
                     <div className="text-center relative z-10">
                        <h3 className="text-lg font-black text-white uppercase tracking-tighter">{c.name}</h3>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${c.isConnected ? 'text-emerald-400' : 'text-slate-600'}`}>
                          {c.isConnected ? 'Active Node Sync' : 'Link Required'}
                        </p>
                     </div>
                     {c.isConnected && (
                        <div className="bg-white/5 px-4 py-1.5 rounded-full text-[10px] mono text-slate-400 relative z-10">
                          {c.username}
                        </div>
                     )}
                     <button 
                       onClick={() => toggleConnection(c.id)}
                       className={`w-full py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all relative z-10 ${
                         c.isConnected ? 'bg-white/5 hover:bg-rose-600/10 text-rose-500 border border-rose-500/20' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                       }`}
                     >
                       {c.isConnected ? 'Terminate Link' : 'Secure Handshake'}
                     </button>
                   </div>
                 ))}
               </div>

               <div className="glass p-10 rounded-[3rem] border border-white/5">
                  <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                    Neural Distribution Engine
                  </h4>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-5 bg-white/5 rounded-3xl border border-white/5">
                      <div>
                        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Advanced AI Narratives</p>
                        <p className="text-[10px] text-slate-500 font-medium">Auto-generate platform-specific meta-descriptions via Gemini.</p>
                      </div>
                      <div className="w-12 h-7 bg-indigo-600 rounded-full flex items-center px-1 cursor-pointer">
                        <div className="w-5 h-5 bg-white rounded-full ml-auto shadow-sm" />
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="lg:col-span-7 space-y-10">
                <header>
                  <h2 className="text-5xl font-black text-white tracking-tighter mb-4 italic uppercase">
                    Visual <span className="text-indigo-500">Synthesis</span>
                  </h2>
                  <p className="text-slate-400 text-lg leading-relaxed max-w-lg font-medium">
                    Orchestrate description-to-asset pipelines for global social distribution.
                  </p>
                </header>

                <div className="glass p-8 rounded-[2.5rem] space-y-8 shadow-2xl relative overflow-hidden group">
                  <div className="space-y-4 relative z-10">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex justify-between items-center">
                      Cinematic Script
                      <span className="text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">VEO_ENGINE_3.1</span>
                    </label>
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Atmospheric sequence involving high-contrast lighting, cinematic dolly zooms..."
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
                        {isRefining ? 'Processing...' : 'Refine Narrative'}
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
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Frame Format</label>
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
                    Deploy Synthesis Job
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-6 pt-10 lg:pt-32">
                 <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reference Frame</label>
                   <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="glass border-2 border-dashed border-white/10 rounded-[2.5rem] aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 hover:bg-white/5 transition-all overflow-hidden group"
                    >
                      {base64Image ? (
                        <img src={base64Image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:scale-110 transition-transform">
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

          {(activeTab === 'library') && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-800">
               <div className="w-20 h-20 rounded-full border border-white/5 flex items-center justify-center mb-6 text-3xl animate-pulse bg-white/5">📦</div>
               <h3 className="text-sm font-black text-slate-500 mb-1 uppercase tracking-widest">Vault Initialization</h3>
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-700 leading-relaxed">Cluster storage nodes are being re-indexed.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
