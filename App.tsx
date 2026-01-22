
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import JobCard from './components/JobCard';
import { RenderJob, RenderStatus, PublishStatus, PlatformStatus, PlatformConnection, PlatformMetadata, ErrorCategory } from './types';
import { GeminiService } from './services/geminiService';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
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
          <div key={i} className={`${log.startsWith('[ERR]') ? 'text-rose-400 font-bold' : log.startsWith('[SYS]') ? 'text-indigo-400' : log.startsWith('[SOCIAL]') ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
            <span className="opacity-40">[{new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'})}]</span> {log}
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
  const [phase, setPhase] = useState<'drafting' | 'review' | 'publishing'>('drafting');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<PlatformStatus[]>([]);

  // Platform specific constraints (Simulated)
  const PLATFORM_RULES: Record<string, { aspect: string }> = {
    'tiktok': { aspect: '9:16' },
    'instagram': { aspect: '9:16' },
    'youtube': { aspect: 'any' },
    'x': { aspect: 'any' }
  };

  useEffect(() => {
    // If job already has some results, initialize with them
    if (job.publishedPlatforms && job.publishedPlatforms.length > 0) {
      setResults(job.publishedPlatforms);
      setPhase('publishing');
      return;
    }

    const active = connections.filter(c => c.isConnected).map(c => ({
      id: c.id,
      name: c.name,
      status: PublishStatus.IDLE,
      progress: 0,
      metadata: undefined,
      retryCount: 0
    }));
    setResults(active);
    
    const generateMeta = async () => {
      addLog("[SOCIAL] Initializing AI metadata engines...");
      const updated = await Promise.all(active.map(async p => {
        try {
          const meta = await GeminiService.generateSocialMetadata(job.prompt, p.name);
          return { ...p, metadata: meta, status: PublishStatus.DRAFTING };
        } catch (e) {
          return { ...p, status: PublishStatus.FAILED, errorMessage: "AI Service Timeout", errorCategory: ErrorCategory.NETWORK };
        }
      }));
      setResults(updated);
      setPhase('review');
    };
    generateMeta();
  }, [connections, job.prompt, addLog, job.publishedPlatforms]);

  const validateNode = (platformId: string): { valid: boolean, error?: string, category?: ErrorCategory } => {
    const platform = results.find(r => r.id === platformId);
    if (!platform) return { valid: false };

    const rule = PLATFORM_RULES[platformId];
    if (rule && rule.aspect !== 'any' && job.aspectRatio !== rule.aspect) {
      return { 
        valid: false, 
        error: `Incompatible Format: Platform requires ${rule.aspect}, found ${job.aspectRatio}.`, 
        category: ErrorCategory.VALIDATION 
      };
    }

    return { valid: true };
  };

  const publishToNode = async (platformId: string) => {
    const platform = results.find(r => r.id === platformId);
    if (!platform) return;

    // Phase: Validation
    setResults(prev => prev.map(p => p.id === platformId ? { ...p, status: PublishStatus.VALIDATING, progress: 0, errorMessage: undefined } : p));
    addLog(`[SOCIAL] Running pre-flight checks for ${platform.name}...`);
    
    const validation = validateNode(platformId);
    if (!validation.valid) {
      addLog(`[ERR] Validation failed for ${platform.name}: ${validation.error}`);
      setResults(prev => prev.map(p => p.id === platformId ? { ...p, status: PublishStatus.FAILED, errorMessage: validation.error, errorCategory: validation.category } : p));
      return;
    }

    // Phase: Upload
    setResults(prev => prev.map(p => p.id === platformId ? { ...p, status: PublishStatus.UPLOADING } : p));
    addLog(`[SOCIAL] Streaming asset to ${platform.name} production node...`);

    // Simulated network behavior with real-world edge cases
    try {
      const step = 2 + Math.random() * 8;
      for (let i = 0; i <= 100; i += step) {
        await new Promise(r => setTimeout(r, 300 + Math.random() * 500));
        const prog = Math.min(Math.round(i), 100);
        
        // Artificial error injection (15% chance, except for YouTube which is "stable")
        const glitchChance = platform.id === 'youtube' ? 0.02 : 0.12;
        if (Math.random() < glitchChance && prog > 40 && prog < 90) {
          const errors = [
            { msg: "OAuth Session Expired", cat: ErrorCategory.AUTH },
            { msg: "Gateway Timeout (504)", cat: ErrorCategory.NETWORK },
            { msg: "Platform Rate Limit Hit", cat: ErrorCategory.LIMIT }
          ];
          const error = errors[Math.floor(Math.random() * errors.length)];
          throw new Error(`${error.msg}|${error.cat}`);
        }

        setResults(prev => prev.map(p => p.id === platformId ? { ...p, progress: prog } : p));
      }

      addLog(`[SOCIAL] Successfully synchronized with ${platform.name}. Status: LIVE.`);
      setResults(prev => prev.map(p => p.id === platformId ? { ...p, status: PublishStatus.LIVE, progress: 100 } : p));
    } catch (err: any) {
      const [msg, cat] = err.message.split('|');
      addLog(`[ERR] Node ${platform.name} crashed: ${msg}`);
      setResults(prev => prev.map(p => p.id === platformId ? { ...p, status: PublishStatus.FAILED, errorMessage: msg, errorCategory: cat as ErrorCategory } : p));
    }
  };

  const handleBroadcast = async () => {
    setPhase('publishing');
    setIsProcessing(true);
    addLog(`[SOCIAL] Dispatching broadcast payloads for asset ${job.id}`);

    const targets = results.filter(r => r.status !== PublishStatus.LIVE);
    // Parallel fan-out
    await Promise.all(targets.map(t => publishToNode(t.id)));

    setIsProcessing(false);
  };

  const handleIndividualRetry = async (platformId: string) => {
    setIsProcessing(true);
    setResults(prev => prev.map(p => p.id === platformId ? { ...p, retryCount: p.retryCount + 1 } : p));
    await publishToNode(platformId);
    setIsProcessing(false);
  };

  const allLive = results.length > 0 && results.every(r => r.status === PublishStatus.LIVE);
  const anyFailed = results.some(r => r.status === PublishStatus.FAILED);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/80 overflow-y-auto custom-scrollbar">
      <div className="glass w-full max-w-2xl rounded-[3rem] p-10 border-white/10 shadow-[0_0_150px_rgba(99,102,241,0.4)] animate-in zoom-in-95 duration-500 my-auto">
        <header className="mb-8 text-center relative">
           <button onClick={onClose} className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all active:scale-90">✕</button>
           <div className="text-indigo-500 font-black text-[10px] tracking-[0.4em] uppercase mb-3">Master Broadcast Controller</div>
           <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Distribution Hub</h2>
        </header>

        {phase === 'drafting' ? (
           <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="relative">
                 <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                 <div className="absolute inset-0 flex items-center justify-center text-xl">🤖</div>
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">Neural Drafting Phase Active</p>
           </div>
        ) : phase === 'review' ? (
          <div className="space-y-4 mb-10 max-h-[400px] overflow-y-auto px-2 custom-scrollbar pr-4">
            <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl mb-6">
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Pre-Flight Summary</p>
               <p className="text-xs text-indigo-300 font-medium leading-relaxed">System ready to fan-out to {results.length} nodes. Resolution and metadata verified for most channels.</p>
            </div>
            {results.map((p) => (
              <div key={p.id} className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-4 relative group hover:bg-white/[0.07] transition-all">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center font-black text-[9px] text-white uppercase border border-white/5">{p.name.slice(0, 2)}</div>
                      <span className="text-sm font-black text-white uppercase tracking-widest">{p.name}</span>
                   </div>
                   <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[8px] font-bold uppercase tracking-widest">Draft Optimized</span>
                </div>
                {p.metadata && (
                  <div className="space-y-3">
                    <p className="text-slate-400 text-[11px] italic leading-relaxed">"{p.metadata.caption}"</p>
                    <div className="flex flex-wrap gap-2">
                      {p.metadata.tags.map(t => <span key={t} className="text-indigo-400 text-[9px] font-bold mono bg-indigo-500/5 px-2 py-0.5 rounded-md">#{t}</span>)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 mb-10">
            {results.map((platform) => (
              <div key={platform.id} className={`bg-white/5 rounded-[2.2rem] p-6 border transition-all duration-700 flex items-center gap-6 ${
                platform.status === PublishStatus.FAILED ? 'border-rose-500/40 bg-rose-500/5 shadow-[0_0_20px_rgba(244,63,94,0.1)]' : 
                platform.status === PublishStatus.LIVE ? 'border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-white/5'
              }`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm text-white uppercase tracking-tighter shadow-inner transition-colors duration-500 ${
                  platform.status === PublishStatus.FAILED ? 'bg-rose-600' : 
                  platform.status === PublishStatus.LIVE ? 'bg-emerald-600' : 'bg-slate-900 border border-white/5'
                }`}>
                  {platform.name.slice(0, 2)}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                       <span className="text-xs font-black text-white uppercase tracking-widest">{platform.name}</span>
                       {platform.retryCount > 0 && <span className="text-[8px] text-indigo-400 font-bold uppercase mt-0.5 tracking-widest">Retry Attempt #{platform.retryCount}</span>}
                    </div>
                    <span className={`text-[9px] font-black mono tracking-[0.2em] px-2 py-0.5 rounded uppercase ${
                      platform.status === PublishStatus.LIVE ? 'text-emerald-400 bg-emerald-500/10' : 
                      platform.status === PublishStatus.FAILED ? 'text-rose-400 bg-rose-500/10' : 'text-indigo-400 bg-indigo-500/10'
                    }`}>
                      {platform.status}
                    </span>
                  </div>
                  
                  {platform.status === PublishStatus.FAILED ? (
                    <div className="flex justify-between items-center gap-4 animate-in slide-in-from-left-2 duration-300">
                       <div className="flex flex-col overflow-hidden">
                          <p className="text-[10px] text-rose-400 font-black uppercase tracking-tight">{platform.errorCategory}</p>
                          <p className="text-[11px] text-rose-500/70 font-medium truncate italic leading-tight">{platform.errorMessage || "Node Disconnected"}</p>
                       </div>
                       <button 
                        disabled={isProcessing}
                        onClick={() => handleIndividualRetry(platform.id)}
                        className="bg-white/10 hover:bg-white/20 text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 border border-white/10"
                       >
                         Resume Node
                       </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                       <div className="flex justify-between text-[8px] text-slate-500 font-bold uppercase tracking-widest">
                          <span>Transmission progress</span>
                          <span className="mono">{platform.progress}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className={`h-full transition-all duration-700 ${
                              platform.status === PublishStatus.LIVE ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.7)]' : 
                              'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.7)] animate-pulse'
                            }`}
                            style={{ width: `${platform.progress}%` }}
                          />
                       </div>
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
                className="flex-1 py-5 rounded-[2.2rem] bg-white/5 hover:bg-white/10 text-slate-500 font-black transition-all uppercase tracking-widest text-[10px] border border-white/5 shadow-inner"
              >
                Abort Broadcast
              </button>
              <button 
                disabled={isProcessing || results.length === 0 || phase === 'drafting'}
                onClick={handleBroadcast}
                className={`flex-[2] py-5 rounded-[2.2rem] font-black transition-all shadow-2xl uppercase tracking-[0.3em] text-[10px] italic border ${
                  anyFailed ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400/20 shadow-rose-600/30' : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400/20 shadow-indigo-600/30'
                }`}
              >
                {isProcessing ? 'Synchronizing Cluster...' : anyFailed ? 'Deploy Critical Retries' : 'Start Multi-Channel Broadcast'}
              </button>
            </>
          ) : (
            <button 
              onClick={() => {
                onComplete(job.id, results);
                onClose();
              }}
              className="w-full py-6 rounded-[2.5rem] bg-emerald-600 hover:bg-emerald-500 text-white font-black transition-all shadow-2xl shadow-emerald-600/40 uppercase tracking-[0.4em] text-[11px] border border-emerald-400/20"
            >
              Verify Distribution Success
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
        addLog(`[SOCIAL] ${newState ? 'Synchronizing' : 'Purging'} OAuth token for ${c.name}...`);
        return { ...c, isConnected: newState, username: newState ? `@nova_user_${Math.floor(Math.random() * 999)}` : undefined };
      }
      return c;
    }));
  };

  useEffect(() => {
    const checkKey = async () => {
      if (typeof window.aistudio !== 'undefined') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsApiKeySelected(hasKey);
        if (hasKey) addLog("[SYS] Auth level verified. Distribution cluster online.");
      }
    };
    checkKey();
  }, [addLog]);

  const handleSelectKey = async () => {
    if (typeof window.aistudio !== 'undefined') {
      await window.aistudio.openSelectKey();
      setIsApiKeySelected(true);
      addLog("[SYS] Handshake successful. Production rights unlocked.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
        addLog(`[SYS] Cached frame buffer: ${file.name}`);
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
      addLog("[AI] Prompt optimized. Production score elevated.");
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
    addLog(`[JOB] Spawning synth thread ${newJob.id} on master node...`);

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
        addLog(`[SYS] Asset ${newJob.id} synthesis success.`);
      }
    } catch (error: any) {
      addLog(`[ERR] Pipeline leak: ${error.message}`);
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
            addLog(`[SOCIAL] Validated multi-channel broadcast for ${id}.`);
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
                <p className="font-black text-xs text-white uppercase tracking-widest">Master Auth Required</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Sync secure API cluster to begin</p>
              </div>
            </div>
            <button 
              onClick={handleSelectKey}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-2.5 px-8 rounded-xl shadow-lg shadow-indigo-600/20 transition-all text-[10px] active:scale-95 uppercase tracking-widest"
            >
              Authorize Node
            </button>
          </div>
        )}

        <div className="p-6 lg:p-12 max-w-7xl mx-auto w-full space-y-12">
          {activeTab === 'dashboard' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Active Synth', value: jobs.filter(j => j.status === RenderStatus.RENDERING).length, icon: '⚡' },
                  { label: 'Vault Stored', value: jobs.length, icon: '📦' },
                  { label: 'Live Nodes', value: connections.filter(c => c.isConnected).length, icon: '📡', color: 'text-emerald-400' },
                  { label: 'Cluster Heat', value: '42°C', icon: '❄️', color: 'text-indigo-400' },
                ].map((stat, i) => (
                  <div key={i} className="glass p-6 rounded-[2rem] border border-white/5 flex items-center gap-5 group hover:border-white/10 transition-all hover:bg-white/[0.02]">
                     <div className="w-12 h-12 rounded-[1rem] bg-slate-900 border border-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">{stat.icon}</div>
                     <div>
                        <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">{stat.label}</p>
                        <p className={`text-xl font-black ${stat.color || 'text-white'} tracking-tighter`}>{stat.value}</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {jobs.length > 0 ? (
                    jobs.map(job => <JobCard key={job.id} job={job} onPublish={setPublishingJob} />)
                  ) : (
                    <div className="col-span-full py-40 text-center bg-white/5 rounded-[4rem] border-2 border-white/5 border-dashed">
                      <div className="text-5xl mb-6 opacity-30 grayscale">🎬</div>
                      <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">Synthesis Core Awaiting Narrative</p>
                      <button onClick={() => setActiveTab('create')} className="mt-6 text-indigo-400 text-[10px] font-black uppercase hover:underline tracking-widest border border-indigo-500/20 px-6 py-2 rounded-full hover:bg-indigo-500/10 transition-all">Initialize Studio →</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <header className="text-center">
                  <div className="inline-block px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest mb-4">Master Gateway config</div>
                  <h2 className="text-5xl font-black text-white tracking-tighter mb-4 italic uppercase">Neural Links</h2>
                  <p className="text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">Securely synchronize your distribution channels for global simultaneous broadcasting.</p>
               </header>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {connections.map((c) => (
                   <div key={c.id} className={`glass rounded-[3rem] p-10 border-white/5 transition-all flex flex-col items-center gap-8 relative overflow-hidden group ${c.isConnected ? 'border-indigo-500/30 shadow-2xl shadow-indigo-500/10' : 'hover:border-white/10'}`}>
                     <div className={`w-24 h-24 rounded-[2.5rem] bg-slate-950 flex items-center justify-center text-4xl font-black text-white ${c.color} transition-all duration-700 relative z-10 border border-white/5 shadow-inner`}>
                        {c.icon}
                     </div>
                     <div className="text-center relative z-10">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-1">{c.name}</h3>
                        <div className="flex items-center justify-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${c.isConnected ? 'bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
                           <p className={`text-[10px] font-black uppercase tracking-widest ${c.isConnected ? 'text-emerald-400' : 'text-slate-600'}`}>
                             {c.isConnected ? 'Link verified' : 'Ready to pair'}
                           </p>
                        </div>
                     </div>
                     {c.isConnected && (
                        <div className="bg-white/5 px-6 py-2 rounded-2xl text-[10px] mono text-slate-400 relative z-10 border border-white/5">
                          {c.username}
                        </div>
                     )}
                     <button 
                       onClick={() => toggleConnection(c.id)}
                       className={`w-full py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all relative z-10 italic border ${
                         c.isConnected 
                         ? 'bg-white/5 hover:bg-rose-600/10 text-rose-500 border-rose-500/20' 
                         : 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30 border-indigo-400/20'
                       }`}
                     >
                       {c.isConnected ? 'Disconnect node' : 'Initialize pairing'}
                     </button>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="lg:col-span-7 space-y-10">
                <header>
                  <h2 className="text-5xl font-black text-white tracking-tighter mb-4 italic uppercase">
                    Asset <span className="text-indigo-500">Synth</span>
                  </h2>
                  <p className="text-slate-400 text-lg leading-relaxed max-w-lg font-medium">
                    Convert high-fidelity narratives into cinematic assets for simultaneous global broadcast.
                  </p>
                </header>

                <div className="glass p-10 rounded-[3rem] space-y-10 shadow-2xl relative overflow-hidden group border border-white/5">
                  <div className="space-y-4 relative z-10">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex justify-between items-center px-1">
                      Cinematic Script
                      <span className="text-indigo-400 font-bold px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[9px] tracking-widest uppercase">VEO.NODE.v4</span>
                    </label>
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Atmospheric sequence involving high-contrast neon lighting, 35mm grain, cinematic dolly zoom..."
                      className="w-full bg-black/40 border border-white/5 rounded-[2.5rem] p-8 min-h-[220px] focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-800 text-lg leading-relaxed font-medium shadow-inner"
                    />
                    <div className="flex justify-between items-center px-4">
                      <div className="text-[10px] text-slate-600 mono font-bold uppercase tracking-widest">Tokens: {Math.floor(prompt.length / 4)} / 512</div>
                      <button 
                        onClick={handleRefinePrompt}
                        disabled={isRefining || !prompt}
                        className={`text-[10px] font-black transition-all flex items-center gap-2 tracking-[0.2em] uppercase ${
                          isRefining ? 'text-indigo-400 animate-pulse' : 'text-slate-500 hover:text-indigo-400'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        {isRefining ? 'Optimizing' : 'Refine Narration'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Quality tier</label>
                      <div className="grid grid-cols-2 gap-2 p-1.5 bg-black/40 rounded-[1.8rem] border border-white/5 shadow-inner">
                        {['720p', '1080p'].map(res => (
                          <button
                            key={res}
                            onClick={() => setResolution(res as any)}
                            className={`py-3.5 rounded-[1.2rem] text-[10px] font-black transition-all uppercase tracking-widest ${
                              resolution === res ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-slate-600 hover:text-slate-400 hover:bg-white/5'
                            }`}
                          >
                            {res}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Aspect node</label>
                      <div className="grid grid-cols-2 gap-2 p-1.5 bg-black/40 rounded-[1.8rem] border border-white/5 shadow-inner">
                        {['16:9', '9:16'].map(ratio => (
                          <button
                            key={ratio}
                            onClick={() => setAspectRatio(ratio as any)}
                            className={`py-3.5 rounded-[1.2rem] text-[10px] font-black transition-all uppercase tracking-widest ${
                              aspectRatio === ratio ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-slate-600 hover:text-slate-400 hover:bg-white/5'
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
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-6 rounded-[2.2rem] font-black text-[11px] tracking-[0.4em] shadow-2xl shadow-indigo-600/50 transition-all transform active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-5 uppercase relative z-10 italic border border-indigo-400/20"
                  >
                    Deploy Master Synth Job
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-8 pt-10 lg:pt-36">
                 <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Seed frame buffer</label>
                   <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="glass border-2 border-dashed border-white/10 rounded-[3rem] aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 hover:bg-white/5 transition-all overflow-hidden group shadow-inner"
                    >
                      {base64Image ? (
                        <img src={base64Image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                      ) : (
                        <div className="flex flex-col items-center gap-5">
                          <div className="w-14 h-14 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-slate-500 group-hover:scale-110 transition-transform shadow-inner border border-white/5">
                             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Inject Reference frame</span>
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
               <div className="w-24 h-24 rounded-full border border-white/5 flex items-center justify-center mb-8 text-4xl animate-pulse bg-white/5">📦</div>
               <h3 className="text-base font-black text-slate-500 mb-2 uppercase tracking-[0.2em] italic">Vault Node Synchronization</h3>
               <p className="text-[11px] font-bold uppercase tracking-widest text-slate-700 leading-relaxed text-center max-w-sm">Primary storage clusters are being re-indexed for high-performance retrieval.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
