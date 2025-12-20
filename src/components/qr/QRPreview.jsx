import React, { useRef, useState, useEffect } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Maximize, Signal, Wifi, Battery, Download, Share2, CheckCircle2 } from 'lucide-react';

const QRPreview = ({
    text,
    fgColor,
    bgColor,
    logoPreview,
    includeMargin,
    size,
    styleOptions,
    onDownload
}) => {
    const [downloadFormat, setDownloadFormat] = useState('png');
    const [showCopied, setShowCopied] = useState(false);
    const ref = useRef(null);
    const [qrCode] = useState(new QRCodeStyling({
        width: size,
        height: size,
        image: logoPreview,
        dotsOptions: {
            color: fgColor,
            type: styleOptions?.dots || 'square'
        },
        backgroundOptions: {
            color: bgColor,
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: includeMargin ? 10 : 0
        },
        cornersSquareOptions: {
            color: fgColor,
            type: styleOptions?.markerBorder || 'square'
        },
        cornersDotOptions: {
            color: fgColor,
            type: styleOptions?.markerCenter || 'square'
        }
    }));

    useEffect(() => {
        qrCode.update({
            data: text,
            dotsOptions: {
                color: fgColor,
                type: styleOptions?.dots || 'square'
            },
            backgroundOptions: {
                color: bgColor,
            },
            image: logoPreview,
            imageOptions: {
                margin: includeMargin ? 10 : 0
            },
            cornersSquareOptions: {
                color: fgColor,
                type: styleOptions?.markerBorder || 'square'
            },
            cornersDotOptions: {
                color: fgColor,
                type: styleOptions?.markerCenter || 'square'
            }
        });
        if (ref.current) {
            ref.current.innerHTML = '';
            qrCode.append(ref.current);
        }
    }, [text, fgColor, bgColor, logoPreview, includeMargin, styleOptions, qrCode]);

    const downloadQRCode = () => {
        onDownload();
        qrCode.download({
            extension: downloadFormat,
            name: `neo-qr-${Date.now()}`
        });
    };

    return (
        <div className="relative w-full max-w-[280px] md:max-w-[300px] h-auto min-h-[500px] md:h-[600px] aspect-[9/18] md:aspect-auto bg-slate-950 rounded-[2rem] md:rounded-[3.5rem] border-[6px] md:border-[8px] border-slate-800 shadow-2xl overflow-hidden mx-auto transition-all bg-black">
            <div className="absolute top-0 inset-x-0 h-10 flex items-center justify-between px-6 md:px-8 z-20">
                <span className="text-[10px] font-bold text-white/70">12:45</span>
                <div className="flex items-center gap-1.5 text-white/70"><Signal size={10} /><Wifi size={10} /><Battery size={10} className="rotate-90" /></div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black p-4 md:p-6 flex flex-col items-center pt-10 md:pt-16 overflow-y-auto no-scrollbar">
                <div className="w-full mb-6 md:mb-8 text-center space-y-1 flex-shrink-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-500/20 rounded-2xl mx-auto flex items-center justify-center border border-cyan-500/30 mb-3 md:mb-4">
                        <Maximize size={20} className="text-cyan-400" />
                    </div>
                    <h4 className="text-[10px] md:text-xs font-bold tracking-widest text-white">SCANNER ATIVO</h4>
                    <p className="text-[8px] md:text-[9px] text-slate-500 uppercase">Live Preview</p>
                </div>

                <div className="relative w-full aspect-square bg-white rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-2xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <div ref={ref} className="w-full h-full flex items-center justify-center [&>canvas]:max-w-full [&>canvas]:max-h-full" />
                </div>

                <div className="mt-auto w-full space-y-3 md:space-y-4 pb-4 pt-6">
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                        <button onClick={() => setDownloadFormat('png')} className={`flex-1 py-1.5 text-[9px] font-bold rounded-lg transition-all ${downloadFormat === 'png' ? 'bg-cyan-500 text-black shadow-lg' : 'text-slate-500'}`}>PNG</button>
                        <button onClick={() => setDownloadFormat('svg')} className={`flex-1 py-1.5 text-[9px] font-bold rounded-lg transition-all ${downloadFormat === 'svg' ? 'bg-cyan-500 text-black shadow-lg' : 'text-slate-500'}`}>SVG</button>
                    </div>
                    <button onClick={downloadQRCode} className="w-full flex items-center justify-center gap-2 py-3 md:py-3.5 bg-cyan-500 text-black font-black text-[10px] rounded-xl md:rounded-2xl shadow-lg hover:bg-cyan-400 transition-all uppercase tracking-wider">
                        <Download size={16} /> Exportar
                    </button>
                    <button onClick={() => { navigator.clipboard.writeText(text); setShowCopied(true); setTimeout(() => setShowCopied(false), 2000); }} className="w-full flex items-center justify-center gap-2 py-2.5 md:py-3 text-slate-400 font-bold text-[9px] bg-white/5 border border-white/10 rounded-xl hover:text-white transition-all uppercase">
                        {showCopied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Share2 size={14} />}
                        {showCopied ? 'Copiado' : 'Compartilhar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRPreview;
