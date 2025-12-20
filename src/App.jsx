import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Layout from './components/layout/Layout';
import QRForm from './components/qr/QRForm';
import QRPreview from './components/qr/QRPreview';
import { logScan, getGlobalCount } from './services/GoogleSheetsService';

function App() {
    // State
    const [text, setText] = useState('https://google.com');
    const [activeTab, setActiveTab] = useState('url');
    const [fgColor, setFgColor] = useState('#00f2ff');
    const [bgColor, setBgColor] = useState('#0a0a12');
    const [size, setSize] = useState(512);
    const [includeMargin, setIncludeMargin] = useState(true);
    const [fontSize, setFontSize] = useState(16); // Keeping previous states if any
    const [logoPreview, setLogoPreview] = useState(null);

    // Advanced Style State
    const [styleOptions, setStyleOptions] = useState({
        dots: 'square', // square, dots, rounded, extra-rounded, classy, classy-rounded
        markerBorder: 'square', // square, dot, extra-rounded
        markerCenter: 'square' // square, dot
    });

    // Counts (Mock for now, will connect to sheets)
    const [globalCount, setGlobalCount] = useState(0);

    useEffect(() => {
        getGlobalCount().then(c => setGlobalCount(c));
    }, []);

    // Helper to handle download which logs stats
    const handleDownloadStats = () => {
        // Optimistic update
        setGlobalCount(prev => prev + 1);
        logScan({ type: 'download', format: activeTab, content: text });
    };

    return (
        <Layout>
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 md:py-8 pb-20 md:pb-12">
                <Header globalCount={globalCount} />

                <main className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    <div className="lg:col-span-7 space-y-6">
                        <QRForm
                            text={text} setText={setText}
                            activeTab={activeTab} setActiveTab={setActiveTab}
                            fgColor={fgColor} setFgColor={setFgColor}
                            bgColor={bgColor} setBgColor={setBgColor}
                            logoPreview={logoPreview} setLogoPreview={setLogoPreview}
                            includeMargin={includeMargin} setIncludeMargin={setIncludeMargin}
                            styleOptions={styleOptions} setStyleOptions={setStyleOptions}
                        />
                    </div>

                    <div className="lg:col-span-5 flex justify-center py-4 lg:order-last">
                        <QRPreview
                            text={text}
                            fgColor={fgColor}
                            bgColor={bgColor}
                            logoPreview={logoPreview}
                            includeMargin={includeMargin}
                            size={size}
                            styleOptions={styleOptions}
                            onDownload={handleDownloadStats}
                        />
                    </div>
                </main>
            </div>
        </Layout>
    );
}

export default App;
