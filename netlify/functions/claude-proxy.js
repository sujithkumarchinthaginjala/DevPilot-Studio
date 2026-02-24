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
        const apiKey = process.env.CLAUDE_API_KEY;

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'CLAUDE_API_KEY not configured on server' }),
            };
        }

        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: model || 'claude-3-5-sonnet-20241022',
                max_tokens: max_tokens || 4000,
                system: systemPrompt,
                messages: [{ role: 'user', content: prompt }],
            },
            {
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json',
                },
            }
        );

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(response.data),
        };
    } catch (error) {
        console.error('Proxy Error:', error.response ? error.response.data : error.message);

        return {
            statusCode: error.response ? error.response.status : 500,
            body: JSON.stringify({
                error: 'Failed to communicate with Claude API',
                details: error.response ? error.response.data : error.message,
            }),
        };
    }
};
