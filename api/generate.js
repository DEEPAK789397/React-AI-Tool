export default async function handler(req, res) {
    // Accept only POST requests.
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        // Read the API key securely from Vercel environment variables.
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("GEMINI_API_KEY is missing.");

            return res.status(500).json({
                error: "Gemini API key is not configured in Vercel."
            });
        }

        // Validate the incoming request.
        if (!req.body || !req.body.contents) {
            return res.status(400).json({
                error: "Invalid request: contents are required."
            });
        }

        // Send the request to Gemini.
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

        // Safely parse Gemini's response.
        const responseText = await response.text();
        let result;

        try {
            result = JSON.parse(responseText);
        } catch {
            console.error("Gemini returned a non-JSON response.");

            return res.status(502).json({
                error: "Gemini returned an invalid response."
            });
        }

        // Return a readable error if Gemini rejects the request.
        if (!response.ok) {
            console.error("Gemini API error:", response.status, result);

            return res.status(response.status).json({
                error:
                    result.error?.message ||
                    "Gemini API request failed.",
                status: response.status
            });
        }

        // Confirm Gemini returned usable text.
        const answer =
            result.candidates?.[0]?.content?.parts
                ?.map(part => part.text || "")
                .join("");

        if (!answer) {
            console.error("Gemini returned no answer:", result);

            return res.status(502).json({
                error:
                    result.promptFeedback?.blockReason ||
                    "Gemini returned no text. Please try another question."
            });
        }

        // Return the successful Gemini response to React.
        return res.status(200).json(result);

    } catch (error) {
        console.error("Backend request failed:", error);

        return res.status(500).json({
            error: "Unable to contact the AI service. Please try again."
        });
    }
}