
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "Gemini API key is not configured"
            });
        }

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify(req.body)
            }
        );

        const result = await response.json();

        return res.status(response.status).json(result);
    } catch (error) {
        console.error("Gemini request failed:", error);

        return res.status(500).json({
            error: "Unable to contact the AI service"
        });
    }
}
