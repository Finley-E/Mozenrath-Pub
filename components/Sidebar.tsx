
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Monitor', icon: 'M' },
    { id: 'create', label: 'Studio', icon: 'S' },
    { id: 'library', label: 'Vault', icon: 'V' },
    { id: 'settings', label: 'Nodes', icon: 'N' },
  ];

  return (
    <div className="w-20 lg:w-64 bg-slate-950/50 backdrop-blur-xl border-r border-white/5 flex flex-col h-full z-20 transition-all duration-300">
      <div className="p-6 flex items-center justify-center lg:justify-start gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/40">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
           </svg>
        </div>
        <div className="hidden lg:block">
          <h1 className="text-lg font-bold tracking-tighter text-white">NovaRender</h1>
          <div className="flex items-center gap-1.5">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Master Node v4.2</span>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-3 py-6 space-y-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all relative group ${
              activeTab === item.id 
                ? 'bg-indigo-600/10 text-white' 
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              activeTab === item.id ? 'bg-indigo-600 shadow-lg shadow-indigo-600/30' : 'bg-slate-900 group-hover:bg-slate-800'
            }`}>
              <span className="text-sm font-bold">{item.icon}</span>
            </div>
            <span className="hidden lg:block font-semibold text-sm tracking-wide">{item.label}</span>
            {activeTab === item.id && (
              <div className="absolute right-0 w-1 h-8 bg-indigo-500 rounded-l-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 hidden lg:block">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cluster Health</span>
            <span className="text-[10px] text-indigo-400 mono">OPT-LEVEL 3</span>
          </div>
          <div className="flex gap-1 h-8 items-end">
            {[40, 70, 50, 90, 60, 80, 45, 75].map((h, i) => (
              <div key={i} className="flex-1 bg-indigo-500/20 rounded-t-sm relative overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-indigo-500 transition-all duration-1000"
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
