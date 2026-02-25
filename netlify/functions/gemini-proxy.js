const axios = require('axios');

exports.handler = async (event) => {
    const method = (event.httpMethod || '').toUpperCase();
    const path = event.path || '';

    console.log(`[Gemini Proxy] Incoming: ${method} ${path}`);

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // 1️⃣ Handle CORS Preflight
    if (method === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: ''
        };
    }

    // 2️⃣ Simple health check
    if (method === 'GET') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                status: 'Gemini Proxy is Active',
                info: 'Send POST request with { prompt }',
                debug: { method, path }
            })
        };
    }

    // 3️⃣ Block other methods
    if (method !== 'POST') {
        return {
            statusCode: 405,
            headers: corsHeaders,
            body: JSON.stringify({
                error: 'Method Not Allowed',
                received: method
            })
        };
    }

    let currentModel = 'gemini-1.5-flash-latest';

    try {
        if (!event.body) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Missing request body' })
            };
        }

        const body = JSON.parse(event.body);

        const prompt = body.prompt?.trim();
        const systemPrompt = body.systemPrompt?.trim();
        const maxTokens = body.max_tokens ?? 2048;
        currentModel = body.model || 'gemini-1.5-flash-latest';

        if (!prompt) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Prompt is required' })
            };
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error('[Gemini Proxy] GEMINI_API_KEY is missing');
            return {
                statusCode: 500,
                headers: corsHeaders,
                body: JSON.stringify({ error: 'Server configuration error: API key missing' })
            };
        }

        // 🔹 Combine system + user safely (Gemini doesn't support system field in REST v1beta)
        const combinedPrompt = systemPrompt
            ? `System Instruction:\n${systemPrompt}\n\nUser Request:\n${prompt}`
            : prompt;

        const geminiBody = {
            contents: [
                {
                    parts: [{ text: combinedPrompt }]
                }
            ],
            generationConfig: {
                maxOutputTokens: maxTokens,
                temperature: 0.7
            }
        };

        const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${currentModel}:generateContent?key=${apiKey}`;

        console.log(`[Gemini Proxy] Calling stable v1: ${currentModel}`);

        const response = await axios.post(apiUrl, geminiBody, {
            headers: { 'Content-Type': 'application/json' }
        });

        const candidate = response.data?.candidates?.[0];
        const text = candidate?.content?.parts?.[0]?.text || '';

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                content: text,
                model: currentModel,
                usage: response.data?.usageMetadata || null
            })
        };

    } catch (error) {
        const status = error.response?.status || 500;
        const details = error.response?.data || error.message;
        const attemptedUrl = `https://generativelanguage.googleapis.com/v1/models/${currentModel}:generateContent`;

        console.error(`[Gemini Proxy] API Error (${status}) at ${attemptedUrl}:`, JSON.stringify(details));

        return {
            statusCode: status,
            headers: corsHeaders,
            body: JSON.stringify({
                error: 'AI Proxy Error',
                status,
                url: attemptedUrl,
                details
            })
        };
    }
};
