import React, { useRef, useState } from 'react';
import { Maximize, Signal, Wifi, Battery, Download, Share2, CheckCircle2 } from 'lucide-react';

const QRPreview = ({
    text,
    fgColor,
    bgColor,
    logoPreview,
    includeMargin,
    size,
    onDownload
}) => {
    const [downloadFormat, setDownloadFormat] = useState('png');
    const [showCopied, setShowCopied] = useState(false);
    const canvasRef = useRef(null);

    const getBaseQrUrl = (format = 'png', customText = text) => {
        const margin = includeMargin ? 4 : 0;
        const cleanFg = fgColor.replace('#', '');
        const cleanBg = bgColor.replace('#', '');
        return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(customText)}&color=${cleanFg}&bgcolor=${cleanBg}&margin=${margin}${format === 'svg' ? '&format=svg' : ''}`;
    };

    const downloadQRCode = async () => {
        onDownload();

        if (downloadFormat === 'png') {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const qrImg = new Image();
            qrImg.crossOrigin = "Anonymous";
            qrImg.src = getBaseQrUrl('png');

            qrImg.onload = () => {
                ctx.clearRect(0, 0, size, size);
                ctx.drawImage(qrImg, 0, 0, size, size);
                if (logoPreview) {
                    const logoImg = new Image();
                    logoImg.src = logoPreview;
                    logoImg.onload = () => {
                        const logoSize = size * 0.22;
                        const x = (size - logoSize) / 2;
                        const y = (size - logoSize) / 2;
                        ctx.fillStyle = bgColor;
                        ctx.beginPath();
                        if (ctx.roundRect) {
                            ctx.roundRect(x - 5, y - 5, logoSize + 10, logoSize + 10, logoSize * 0.15);
                        } else {
                            ctx.rect(x - 5, y - 5, logoSize + 10, logoSize + 10);
                        }
                        ctx.fill();
                        ctx.drawImage(logoImg, x, y, logoSize, logoSize);
                        saveCanvas(canvas);
                    };
                } else {
                    saveCanvas(canvas);
                }
            };
        } else {
            // SVG Download logic
            try {
                const response = await fetch(getBaseQrUrl('svg'));
                let svgText = await response.text();
                if (logoPreview) {
                    // Basic SVG logo injection logic
                    const logoSize = size * 0.22;
                    const pos = (size - logoSize) / 2;
                    const logoSvgPart = `
             <rect x="${pos - 5}" y="${pos - 5}" width="${logoSize + 10}" height="${logoSize + 10}" fill="${bgColor}" rx="${logoSize * 0.15}" />
             <image x="${pos}" y="${pos}" width="${logoSize}" height="${logoSize}" href="${logoPreview}" />
           `;
                    svgText = svgText.replace('</svg>', `${logoSvgPart}</svg>`);
                }
                const blob = new Blob([svgText], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `neo-qr-${Date.now()}.svg`;
                link.click();
            } catch (err) { console.error(err); }
        }
    };

    const saveCanvas = (canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `neo-qr-${Date.now()}.png`;
        link.click();
    };

    return (
        <div className="relative w-full max-w-[300px] aspect-[9/18] md:h-[600px] md:aspect-auto bg-slate-950 rounded-[2.5rem] md:rounded-[3.5rem] border-[8px] border-slate-800 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden mx-auto">
            <canvas ref={canvasRef} width={size} height={size} className="hidden" />

            <div className="absolute top-0 inset-x-0 h-10 flex items-center justify-between px-6 md:px-8 z-20">
                <span className="text-[10px] font-bold text-white/70">12:45</span>
                <div className="flex items-center gap-1.5 text-white/70"><Signal size={10} /><Wifi size={10} /><Battery size={10} className="rotate-90" /></div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black p-6 flex flex-col items-center pt-12 md:pt-16 overflow-y-auto no-scrollbar">
                <div className="w-full mb-6 md:mb-8 text-center space-y-1 flex-shrink-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-500/20 rounded-2xl mx-auto flex items-center justify-center border border-cyan-500/30 mb-3 md:mb-4">
                        <Maximize size={20} className="text-cyan-400" />
                    </div>
                    <h4 className="text-[10px] md:text-xs font-bold tracking-widest text-white">SCANNER ATIVO</h4>
                    <p className="text-[8px] md:text-[9px] text-slate-500 uppercase">Live Preview</p>
                </div>

                <div className="relative w-full aspect-square bg-white rounded-2xl md:rounded-3xl p-3 md:p-4 shadow-2xl flex-shrink-0">
                    <img src={getBaseQrUrl('png')} alt="Neo QR" className="w-full h-full rounded-lg" />
                    {logoPreview && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="p-1 rounded-lg" style={{ backgroundColor: bgColor }}>
                                <img src={logoPreview} className="w-8 h-8 md:w-10 md:h-10 object-contain rounded" alt="Logo" />
                            </div>
                        </div>
                    )}
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
