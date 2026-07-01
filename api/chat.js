import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Please use POST.' });
    }

    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Missing message in request body.' });
    }

    // Securely pull the API key from Vercel Environment Variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("CRITICAL: GEMINI_API_KEY is not set in Vercel Environment Variables.");
        return res.status(500).json({ error: 'Server configuration error.' });
    }

    try {
        // 1. Read the Rulebook Markdown file
        // Vercel allows reading files from process.cwd() if they are part of the repository
        const rulebookPath = path.join(process.cwd(), 'Rules', 'VFA - eFootball Rulebook.md');
        const rulebookText = fs.readFileSync(rulebookPath, 'utf8');

        // 2. Construct the Prompt
        const systemInstruction = `You are the official VFA (Virtual Football Alliance) Administration Assistant chatbot.
Your job is to answer manager questions accurately, professionally, and humanely.
You must base your answers STRICTLY on the official rulebook provided below. 
Do not invent rules, assume things, or talk about real-life football rules unless they are specifically mentioned in this rulebook.
If the rulebook doesn't mention something, tell the user that the rulebook does not cover this and they should contact the human VFA Administration.
Keep your answers concise, friendly, and easy to read. Use bolding to highlight important terms or section numbers.

--- OFFICIAL VFA RULEBOOK START ---
${rulebookText}
--- OFFICIAL VFA RULEBOOK END ---`;

        // 3. Make the API Call to Gemini 1.5 Flash
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: systemInstruction + "\n\nUser Question: " + message }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.1, // Low temperature means it stays very factual to the rulebook
                    maxOutputTokens: 600,
                }
            })
        });

        // 4. Handle the API Response
        if (!response.ok) {
            const errorData = await response.text();
            console.error("Gemini API Error:", errorData);
            return res.status(500).json({ error: 'Failed to communicate with AI provider.' });
        }

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't formulate an answer.";

        // 5. Send the reply back to the frontend
        return res.status(200).json({ reply });

    } catch (error) {
        console.error("Backend execution error:", error);
        return res.status(500).json({ error: 'Internal Server Error.' });
    }
}
