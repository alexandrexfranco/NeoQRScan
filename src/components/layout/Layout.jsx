import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#050508] text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] md:w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[80px] md:blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] md:w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[80px] md:blur-[120px]" />
            </div>
            {children}

            <footer className="w-full text-center py-6 text-xs text-slate-600 space-y-2 relative z-20">
                <p>Desenvolvido por: <span className="text-slate-400 font-bold">Alexandre O. Franco</span></p>
                <a
                    href="https://www.linkedin.com/in/alexandrexfranco/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-cyan-700/70 hover:text-cyan-500 transition-colors"
                >
                    Rede social Linkedin
                </a>
            </footer>
        </div>
    );
};

export default Layout;
