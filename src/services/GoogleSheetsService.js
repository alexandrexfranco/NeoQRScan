export const logScan = async (data) => {
    const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
    if (!scriptUrl) {
        console.warn("Google Sheet Script URL not configured.");
        return;
    }

    try {
        await fetch(scriptUrl, {
            method: 'POST',
            body: JSON.stringify(data),
            mode: 'no-cors' // Important for GAS Web Apps
        });
        console.log("Logged to Sheets");
    } catch (e) {
        console.error("Logging failed", e);
    }
};

export const getGlobalCount = async () => {
    const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
    if (!scriptUrl) return 0;

    try {
        const response = await fetch(scriptUrl);
        const data = await response.json();
        return data.count || 0;
    } catch (e) {
        console.error("Failed to get count", e);
        return 0;
    }
};
