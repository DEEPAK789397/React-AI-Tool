
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("GEMINI_API_KEY is missing.");

            return res.status(500).json({
                error: "Gemini API key is not configured in Vercel."
            });
        }

        if (!req.body?.contents) {
            return res.status(400).json({
                error: "Invalid request: contents are required."
            });
        }

        const url =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";

        let response;
        let responseText;
        let result;

        // Try a maximum of 3 times for temporary 503 errors.
        for (let attempt = 0; attempt < 3; attempt++) {
            response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },
                body: JSON.stringify(req.body)
            });

            responseText = await response.text();

            try {
                result = JSON.parse(responseText);
            } catch {
                console.error("Gemini returned a non-JSON response.");

                return res.status(502).json({
                    error: "Gemini returned an invalid response."
                });
            }

            // Retry only when Gemini reports temporary unavailability.
            if (response.status !== 503 || attempt === 2) {
                break;
            }

            const delay = 1000 * (2 ** attempt);

            console.warn(
                `Gemini returned 503. Retry ${attempt + 1}/2 in ${delay}ms.`
            );

            await new Promise(resolve => setTimeout(resolve, delay));
        }

        if (!response.ok) {
            console.error("Gemini API error:", response.status, result);

            return res.status(response.status).json({
                error:
                    result.error?.message ||
                    "Gemini API request failed.",
                status: response.status
            });
        }

        const answer = result.candidates?.[0]?.content?.parts
            ?.map(part => part.text || "")
            .join("");

        if (!answer) {
            return res.status(502).json({
                error:
                    result.promptFeedback?.blockReason ||
                    "Gemini returned no text. Please try another question."
            });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error("Backend request failed:", error);

        return res.status(500).json({
            error: "Unable to contact the AI service. Please try again."
        });
    }
}
