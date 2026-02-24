const axios = require('axios');

exports.handler = async (event, context) => {
    const method = (event.httpMethod || '').toUpperCase();
    const path = event.path || '';

    console.log(`[Gemini Proxy] Incoming: ${method} ${path}`);

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // 1. Handle Preflight
    if (method === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: ''
        };
    }

    // 2. Handle simple GET check
    if (method === 'GET') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                status: 'Gemini Proxy is Active',
                info: 'Use POST to generate content',
                debug: { method, path }
            })
        };
    }

    // 3. Block other methods
    if (method !== 'POST') {
        return {
            statusCode: 405,
            headers: corsHeaders,
            body: JSON.stringify({
                error: 'Method Not Allowed',
                received: method,
                tip: 'Ensure your app is sending a POST request to this endpoint'
            }),
        };
    }

    let currentModel = 'gemini-1.5-flash';

    try {
        if (!event.body) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Missing request body' })
            };
        }

        const body = JSON.parse(event.body);
        const { prompt, systemPrompt, max_tokens } = body;
        currentModel = body.model || 'gemini-1.5-flash';
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error('[Gemini Proxy] Error: GEMINI_API_KEY is not set');
            return {
                statusCode: 500,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Server configuration error: Key missing' }),
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

        const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${currentModel}:generateContent?key=${apiKey}`;

        console.log(`[Gemini Proxy] Calling: https://generativelanguage.googleapis.com/v1/models/${currentModel}:generateContent`);

        const response = await axios.post(apiUrl, geminiBody, {
            headers: { 'Content-Type': 'application/json' }
        });

        const candidate = response.data.candidates?.[0];
        const text = candidate?.content?.parts?.[0]?.text || '';

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                content: text,
                model: currentModel,
                usage: response.data.usageMetadata || { totalTokenCount: 0 }
            }),
        };
    } catch (error) {
        const status = error.response ? error.response.status : 500;
        const details = error.response ? error.response.data : error.message;
        const attemptedUrl = `https://generativelanguage.googleapis.com/v1/models/${currentModel}:generateContent`;

        console.error(`[Gemini Proxy] API Error (${status}) at ${attemptedUrl}:`, JSON.stringify(details));

        return {
            statusCode: status,
            headers: corsHeaders,
            body: JSON.stringify({
                error: 'AI Proxy Error',
                message: error.message,
                status: status,
                attemptedUrl: attemptedUrl,
                details: details
            }),
        };
    }
};
