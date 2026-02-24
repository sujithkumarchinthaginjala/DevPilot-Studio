const axios = require('axios');

exports.handler = async (event, context) => {
    const method = (event.httpMethod || '').toUpperCase();
    console.log(`[Proxy] Request Method: ${method}, Path: ${event.path}`);

    // Handle CORS preflight
    if (method === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key, anthropic-version',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: ''
        };
    }

    // Friendly status for GET
    if (method === 'GET') {
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                status: 'Gemini Proxy is active',
                message: 'Please use POST to send prompts',
                receivedMethod: method
            }),
        };
    }

    if (method !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Allow': 'GET, POST, OPTIONS'
            },
            body: JSON.stringify({
                error: 'Method Not Allowed',
                receivedMethod: method
            }),
        };
    }

    try {
        const { prompt, systemPrompt, model, max_tokens } = JSON.parse(event.body);
        const apiKey = process.env.GEMINI_API_KEY;
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
                'Access-Control-Allow-Origin': '*'
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
