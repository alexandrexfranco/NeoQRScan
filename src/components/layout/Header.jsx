import React from 'react';
import { Cpu, History, Download } from 'lucide-react';

const Header = ({ globalCount }) => {
    // Mock history for now
    const history = [];

    return (
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 gap-6">
            <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold tracking-widest uppercase">
                    <Cpu size={12} /> System Status: Online
                </div>
                <h1 className="text-3xl md:text-6xl font-black tracking-tighter bg-gradient-to-r from-white via-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    NEO SCAN
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex flex-col items-center md:items-end px-4 md:border-r border-white/10">
                    <span className="text-[8px] font-bold text-cyan-400 uppercase tracking-widest">Global Scan Count</span>
                    <span className="text-xl font-black text-white font-mono tracking-tighter glow-text">
                        {globalCount.toLocaleString()}
                    </span>
                </div>
                {/* History Widget */}
                <div className="hidden lg:flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
                    <History size={18} className="text-slate-500 ml-2" />
                    <div className="flex gap-2 pr-2">
                        {history.length === 0 && <span className="text-[10px] text-slate-600 uppercase px-4">Sem histórico</span>}
                        {history.map(item => (
                            <button key={item.id} className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 hover:border-cyan-500 transition-all opacity-60 hover:opacity-100 relative group">
                                <img src={item.preview} alt="history" />
                                <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                                    <Download size={12} className="text-white" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
