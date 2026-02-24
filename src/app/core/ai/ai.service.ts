import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AIRequest, AIResponse } from './ai.model';

interface ClaudeMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface ClaudeRequestBody {
    model: string;
    max_tokens: number;
    system?: string;
    messages: ClaudeMessage[];
}

interface ClaudeApiResponse {
    id: string;
    type: string;
    role: string;
    content: Array<{ type: string; text: string }>;
    model: string;
    stop_reason: string;
    usage: { input_tokens: number; output_tokens: number };
}

@Injectable({ providedIn: 'root' })
export class AiService {
    private http = inject(HttpClient);

    sendPrompt(request: AIRequest): Observable<AIResponse> {
        const body = {
            prompt: request.prompt,
            systemPrompt: request.systemPrompt,
            model: environment.geminiModel,
            max_tokens: request.maxTokens ?? 2048,
        };

        console.log('[AiService] Sending POST Prompt to:', environment.geminiApiUrl);
        return this.http
            .post<any>(environment.geminiApiUrl, body)
            .pipe(
                map((res: any): AIResponse => ({
                    content: res.content ?? '',
                    tool: request.tool,
                    tokens: res.usage?.totalTokenCount || 0,
                    model: res.model,
                    timestamp: new Date(),
                })),
                catchError(this.handleError)
            );
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        console.error('[AiService] Error Response:', {
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            error: error.error
        });

        let message = 'An unexpected error occurred.';
        let code = 'UNKNOWN_ERROR';

        if (error.status === 401) {
            message = 'Invalid API key. Please check your Anthropic API key in the environment config.';
            code = 'AUTH_ERROR';
        } else if (error.status === 429) {
            message = 'Rate limit exceeded. Please wait a moment and try again.';
            code = 'RATE_LIMIT';
        } else if (error.status === 400) {
            message = 'Invalid request. Please check your input and try again.';
            code = 'BAD_REQUEST';
        } else if (error.status === 0) {
            message = 'Network error. Please check your internet connection.';
            code = 'NETWORK_ERROR';
        } else if (error.error?.error?.message) {
            message = error.error.error.message;
            code = error.error.error.type ?? 'API_ERROR';
        }

        return throwError(() => ({ message, code, status: error.status }));
    }

    /**
     * Mock response for development/demo when API key is not configured
     */
    getMockResponse(tool: string, prompt: string): Observable<AIResponse> {
        const mockContent = `## AI Response (Demo Mode)\n\nThis is a **demo response** for the **${tool}** tool.\n\n> 🔑 To enable real AI responses, add your Anthropic Claude API key to \`src/environments/environment.ts\`\n\n### What would happen here:\n- Your prompt would be analyzed: *"${prompt.substring(0, 100)}..."*\n- Claude would generate a detailed, context-aware response\n- The response would be formatted and displayed here\n\n### For Production:\n1. Get your API key at [console.anthropic.com](https://console.anthropic.com)\n2. Add it to your environment file\n3. Deploy to Netlify with the env variable set\n\n\`\`\`bash\n# Set your API key\nexport CLAUDE_API_KEY=your_key_here\n\`\`\``;

        return from(
            new Promise<AIResponse>((resolve) =>
                setTimeout(
                    () =>
                        resolve({
                            content: mockContent,
                            tool: tool as any,
                            tokens: 150,
                            model: 'demo-mode',
                            timestamp: new Date(),
                        }),
                    1200
                )
            )
        );
    }
}
