const axios = require('axios');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    try {
        const { prompt, systemPrompt, model, max_tokens } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyC2-K3KJ1TfHBe37HfJvRo_Mn8vZQ6z6rs'; // User provided fallback for testing

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'GEMINI_API_KEY not configured on server' }),
            };
        }

        // Google Gemini API expects a slightly different structure than Anthropic
        const geminiBody = {
            contents: [
                {
                    role: 'user',
                    parts: [{ text: prompt }]
                }
            ],
            systemInstruction: systemPrompt ? {
                parts: [{ text: systemPrompt }]
            } : undefined,
            generationConfig: {
                maxOutputTokens: max_tokens || 2048,
                temperature: 0.7,
            }
        };

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`;

        const response = await axios.post(apiUrl, geminiBody, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const candidate = response.data.candidates?.[0];
        const text = candidate?.content?.parts?.[0]?.text || '';

        // Map back to a structured format similar to what the app expects
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: text,
                model: model || 'gemini-1.5-flash',
                usage: response.data.usageMetadata || { totalTokenCount: 0 }
            }),
        };
    } catch (error) {
        console.error('Gemini Proxy Error:', error.response ? error.response.data : error.message);

        return {
            statusCode: error.response ? error.response.status : 500,
            body: JSON.stringify({
                error: 'Failed to communicate with Gemini API',
                details: error.response ? error.response.data : error.message,
            }),
        };
    }
};
