import React, { useState, useEffect } from 'react';
import {
    Link as LinkIcon, MessageCircle, Wifi as WifiIcon, Sparkles, Type, Mail,
    HelpCircle, Phone, Wand2, Palette, AlertTriangle, Loader2, RotateCcw,
    Image as ImageIcon, X, Zap
} from 'lucide-react';
import { callGemini } from '../../services/ai';

const Tooltip = ({ content }) => (
    <div className="relative inline-block ml-1 group">
        <HelpCircle size={12} className="text-slate-600 cursor-help hover:text-cyan-400 transition-colors" />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-[10px] text-slate-200 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-white/10">
            {content}
        </div>
    </div>
);

const QRForm = ({
    text, setText,
    activeTab, setActiveTab,
    fgColor, setFgColor,
    bgColor, setBgColor,
    logoPreview, setLogoPreview,
    includeMargin, setIncludeMargin,
    styleOptions, setStyleOptions
}) => {
    const [waNumber, setWaNumber] = useState('');
    const [waMessage, setWaMessage] = useState('');
    // Removed AI state as it's being replaced with Style options

    const tabs = [
        { id: 'style', Icon: Palette, label: 'ESTILO' },
        { id: 'url', Icon: LinkIcon, label: 'URL' },
        { id: 'whatsapp', Icon: MessageCircle, label: 'WHATSAPP' },
        { id: 'wifi', Icon: WifiIcon, label: 'WI-FI' },
        { id: 'text', Icon: Type, label: 'TEXTO' },
        { id: 'email', Icon: Mail, label: 'E-MAIL' }
    ];

    useEffect(() => {
        if (activeTab === 'whatsapp') {
            const cleanNumber = waNumber.replace(/\D/g, '');
            const encodedMsg = encodeURIComponent(waMessage);
            setText(`https://wa.me/${cleanNumber}${waMessage ? `?text=${encodedMsg}` : ''}`);
        }
    }, [waNumber, waMessage, activeTab, setText]);

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setLogoPreview(event.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleColorInput = (setter, value) => {
        let formatted = value.startsWith('#') ? value : `#${value}`;
        formatted = formatted.substring(0, 7);
        setter(formatted);
    };



    return (
        <div className="space-y-6">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="grid grid-cols-3 sm:grid-cols-6 bg-black/40 border-b border-white/5">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center justify-center gap-1 py-3 md:py-4 text-[9px] font-bold tracking-widest transition-all ${activeTab === tab.id ? 'bg-cyan-500/10 text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300 border-b-2 border-transparent'}`}>
                            <tab.Icon size={16} /> {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-4 md:p-8">
                    <div className="mb-4 flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Entrada de Dados</label>
                        <Tooltip content="Escolha o tipo de dado para que o QR Code seja formatado corretamente." />
                    </div>

                    {activeTab === 'url' && (
                        <input type="url" value={text} onChange={(e) => setText(e.target.value)} placeholder="https://exemplo.com" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all text-sm" />
                    )}

                    {activeTab === 'whatsapp' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] text-slate-500 uppercase flex items-center gap-2"><Phone size={10} /> Número (com DDD)</label>
                                <input type="text" value={waNumber} onChange={(e) => setWaNumber(e.target.value)} placeholder="5511999999999" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-slate-500 uppercase flex items-center gap-2"><MessageCircle size={10} /> Mensagem Automática</label>
                                <textarea value={waMessage} onChange={(e) => setWaMessage(e.target.value)} placeholder="Olá! Gostaria de mais informações..." className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white h-24 outline-none resize-none text-sm" />
                            </div>
                        </div>
                    )}

                    {activeTab === 'wifi' && (
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm" placeholder="Nome da Rede (SSID)" onChange={(e) => setText(`WIFI:S:${e.target.value};T:WPA;P:senha;;`)} />
                            <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm mt-2" placeholder="Senha da Rede" onChange={(e) => {
                                /* Basic implementation - better to have state for ssid/pass */
                                const currentSSID = text.match(/WIFI:S:(.*?);/)?.[1] || '';
                                setText(`WIFI:S:${currentSSID};T:WPA;P:${e.target.value};;`);
                            }} />
                        </div>
                    )}

                    {activeTab === 'style' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500 uppercase font-bold">Estilo dos Pontos</label>
                                    <select
                                        value={styleOptions.dots}
                                        onChange={(e) => setStyleOptions({ ...styleOptions, dots: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-cyan-500/50"
                                    >
                                        <option value="square" className="bg-slate-900 text-white">Quadrado (Padrão)</option>
                                        <option value="dots" className="bg-slate-900 text-white">Bolinhas</option>
                                        <option value="rounded" className="bg-slate-900 text-white">Arredondado</option>
                                        <option value="extra-rounded" className="bg-slate-900 text-white">Extra Redondo</option>
                                        <option value="classy" className="bg-slate-900 text-white">Elegante</option>
                                        <option value="classy-rounded" className="bg-slate-900 text-white">Elegante Redondo</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500 uppercase font-bold">Moldura dos Cantos</label>
                                    <select
                                        value={styleOptions.markerBorder}
                                        onChange={(e) => setStyleOptions({ ...styleOptions, markerBorder: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-cyan-500/50"
                                    >
                                        <option value="square" className="bg-slate-900 text-white">Quadrado</option>
                                        <option value="dot" className="bg-slate-900 text-white">Bolinha</option>
                                        <option value="extra-rounded" className="bg-slate-900 text-white">Arredondado</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500 uppercase font-bold">Centro dos Cantos</label>
                                    <select
                                        value={styleOptions.markerCenter}
                                        onChange={(e) => setStyleOptions({ ...styleOptions, markerCenter: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-cyan-500/50"
                                    >
                                        <option value="square" className="bg-slate-900 text-white">Quadrado</option>
                                        <option value="dot" className="bg-slate-900 text-white">Bolinha</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl text-[10px] text-cyan-300">
                                <p>💡 Combine diferentes estilos para criar um QR Code único!</p>
                            </div>
                        </div>
                    )}

                    {(activeTab === 'text' || activeTab === 'email') && (
                        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Insira os dados aqui..." className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white h-32 outline-none resize-none text-sm" />
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.2em] flex items-center gap-2"><Palette size={16} /> Cores</h3>
                        <button onClick={() => { setFgColor('#00f2ff'); setBgColor('#0a0a12'); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg text-[10px] font-bold border border-white/5">
                            <RotateCcw size={12} /> RESET
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-500 uppercase">QR Pixel</label>
                            <div className="flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-white/5">
                                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-6 h-6 rounded bg-transparent cursor-pointer" />
                                <input type="text" value={fgColor} onChange={(e) => handleColorInput(setFgColor, e.target.value)} className="bg-transparent text-[10px] font-mono w-full text-white uppercase outline-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-500 uppercase">Fundo</label>
                            <div className="flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-white/5">
                                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-6 h-6 rounded bg-transparent cursor-pointer" />
                                <input type="text" value={bgColor} onChange={(e) => handleColorInput(setBgColor, e.target.value)} className="bg-transparent text-[10px] font-mono w-full text-white uppercase outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-6">
                    <h3 className="text-xs font-black text-orange-400 uppercase tracking-[0.2em] flex items-center gap-2"><ImageIcon size={16} /> Logo</h3>
                    <div className="flex gap-4">
                        {!logoPreview ? (
                            <label className="flex-1 flex flex-col items-center justify-center gap-2 p-4 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl hover:bg-white/10 cursor-pointer group">
                                <ImageIcon size={18} className="text-slate-600 group-hover:text-orange-400" />
                                <span className="text-[9px] text-slate-500 font-bold uppercase">Upload</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                            </label>
                        ) : (
                            <div className="flex-1 relative flex items-center justify-center p-2 bg-black/40 border border-orange-500/30 rounded-2xl">
                                <img src={logoPreview} alt="Logo" className="h-10 object-contain" />
                                <button onClick={() => setLogoPreview(null)} className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:scale-110 transition-all"><X size={10} /></button>
                            </div>
                        )}
                        <button onClick={() => setIncludeMargin(!includeMargin)} className={`p-4 border rounded-xl transition-all ${includeMargin ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-500 opacity-50'}`}><Zap size={20} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRForm;
