export const callGemini = async (prompt, type) => {
    setAiError('');
    setIsAiLoading(true);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        // Mock mode if no key provided
        await new Promise(r => setTimeout(r, 1000));
        return type === 'style'
            ? { fgColor: '#ff00ff', bgColor: '#000000' }
            : `Simulated AI content for: ${prompt}`;
    }

    const systemPrompt = type === 'style'
        ? "You are a Color Palette generator for QR codes. You must output a JSON object with 'fgColor' and 'bgColor' properties containing 6-character hex codes (e.g., '#ffffff'). Ensure high contrast. Output ONLY raw JSON."
        : "You are a QR Code content assistant. Convert descriptions to formatted strings (WIFI, VCard, etc). Output ONLY the raw string.";

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: type === 'style' ? { responseMimeType: "application/json" } : {}
    };

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }
        );

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!resultText) throw new Error("No text generated");

        if (type === 'style') {
            return JSON.parse(resultText);
        } else {
            return resultText.trim();
        }
    } catch (e) {
        console.error("Gemini Error:", e);
        throw e;
    }
};
